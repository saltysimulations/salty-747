import { EventBus, EventBusMetaEvents, MockEventTypes, Publisher } from '../data/EventBus';
import { PublishPacer } from '../data/EventBusPacer';
import { SimVarDefinition, SimVarEventTypes } from '../data/SimVars';

/**
 * A basic event-bus publisher.
 */
export class BasePublisher<E> {

    private bus: EventBus;
    private publisher: Publisher<E>;
    private publishActive: boolean;
    private pacer: PublishPacer<E> | undefined;

    /**
     * Creates an instance of BasePublisher.
     * @param bus The common event bus.
     * @param pacer An optional pacer to control the rate of publishing.
     */
    public constructor(bus: EventBus, pacer: PublishPacer<E> | undefined = undefined) {
        this.bus = bus;
        this.publisher = this.bus.getPublisher<E>();
        this.publishActive = false;
        this.pacer = pacer;
    }

    /**
     * Start publishing.
     */
    public startPublish(): void {
        this.publishActive = true;
    }

    /**
     * Stop publishing.
     */
    public stopPublish(): void {
        this.publishActive = false;
    }

    /**
     * Tells whether or not the publisher is currently active.
     * @returns True if the publisher is active, false otherwise.
     */
    public isPublishing(): boolean {
        return this.publishActive;
    }

    /**
     * A callback called when the publisher receives an update cycle.
     */
    public onUpdate(): void {
        return;
    }

    /**
     * Publish a message if publishing is acpive
     * @param topic The topic key to publish to.
     * @param data The data type for chosen topic.
     * @param sync Whether or not the event should be synced via local storage.
     * @param isCached Whether or not the event should be cached.
     */
    protected publish<K extends keyof E>(topic: K, data: E[K], sync = false, isCached = true): void {
        if (this.publishActive && (!this.pacer || this.pacer.canPublish(topic, data))) {
            this.publisher.pub(topic, data, sync, isCached);
        }
    }
}

/**
 * A publisher that sends a constant stream of random numbers.
 */
export class RandomNumberPublisher extends BasePublisher<MockEventTypes> {
    /**
     * Start publishing random numbers.
     */
    public startPublish(): void {
        super.startPublish();
        this.publishRandomNumbers();
    }

    /**
     * Async thread that publishes random numbers
     * @param ms - Milliseconds to sleep between publishes
     */
    private async publishRandomNumbers(ms = 1000): Promise<any> {
        while (this.isPublishing()) {
            const newVal = Math.floor(Math.random() * ms);
            this.publish('randomNumber', newVal, true);
            await new Promise(r => setTimeout(r, ms));
        }
    }
}

/**
 * A base class for publishers that need to handle simvars with built-in
 * support for pacing callbacks.
 */
export class SimVarPublisher<E extends SimVarEventTypes> extends BasePublisher<E> {
    private simvars: Map<keyof E, SimVarDefinition>;
    protected subscribed: Set<keyof E>;

    /**
     * Create a SimVarPublisher
     * @param simVarMap A map of simvar event type keys to a SimVarDefinition.
     * @param bus The EventBus to use for publishing.
     * @param pacer An optional pacer to control the rate of publishing.
     */
    public constructor(simVarMap: Map<keyof E, SimVarDefinition>,
        bus: EventBus, pacer: PublishPacer<E> | undefined = undefined) {
        super(bus, pacer);
        this.simvars = simVarMap;
        this.subscribed = new Set<keyof E>();

        // Start polling all simvars for which there are existing subscriptions.
        for (const simvar of this.simvars.keys()) {
            if (bus.getTopicSubsciberCount(simvar as string)) {
                this.subscribed.add(simvar);
            }
        }

        bus.getSubscriber<EventBusMetaEvents>().on('event_bus_topic_first_sub').handle(
            (event: string) => {
                if (this.simvars.get(event as keyof E)) {
                    this.subscribed.add(event as keyof E);
                }
            });
    }

    /**
     * NOOP - For backwards compatibility.
     * @deprecated
     * @param data Key of the event type in the simVarMap
     */
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    public subscribe(data: keyof E): void {
        return;
    }

    /**
     * NOOP - For backwards compatibility.
     * @deprecated
     * @param data Key of the event type in the simVarMap
     */
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    public unsubscribe(data: keyof E): void {
        return;
    }

    /**
     * Read the value of a given simvar by its key.
     * @param key The key of the simvar in simVarMap
     * @returns The value returned by SimVar.GetSimVarValue()
     */
    public getValue(key: keyof E): any {
        const simvar = this.simvars.get(key);
        if (simvar === undefined) {
            return undefined;
        }
        return SimVar.GetSimVarValue(simvar.name, simvar.type);
    }

    /**
     * Publish all subscribed data points to the bus.
     */
    public onUpdate(): void {
        for (const data of this.subscribed.values()) {
            const value = this.getValue(data);
            if (value !== undefined) {
                this.publish(data, value);
            }
        }
    }

    /**
     * Change the simvar read for a given key.
     * @param key The key of the simvar in simVarMap
     * @param value The new value to set the simvar to.
     */
    public updateSimVarSource(key: keyof E, value: SimVarDefinition): void {
        this.simvars.set(key, value);
    }
}