import { Subscription } from '../sub/Subscription';
import { EventBus, Handler } from './EventBus';

/**
 * An event bus consumer for a specific topic.
 */
export class Consumer<T> {

  private readonly activeSubs = new Map<Handler<T>, Subscription[]>();

  /**
   * Creates an instance of a Consumer.
   * @param bus The event bus to subscribe to.
   * @param topic The topic of the subscription.
   * @param state The state for the consumer to track.
   * @param currentHandler The current build filter handler stack, if any.
   */
  constructor(
    protected bus: EventBus,
    protected topic: string,
    private state: any = {},
    private readonly currentHandler?: (data: T, state: any, next: Handler<T>) => void
  ) { }

  /**
   * Handles an event using the provided event handler.
   * @param handler The event handler for the event.
   * @param paused Whether the new subscription should be initialized as paused. Defaults to `false`.
   * @returns A new subscription for the provided handler.
   */
  public handle(handler: Handler<T>, paused = false): Subscription {
    let activeHandler: Handler<T>;

    if (this.currentHandler !== undefined) {

      /**
       * The handler reference to store.
       * @param data The input data to the handler.
       */
      activeHandler = (data: T): void => {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        this.currentHandler!(data, this.state, handler);
      };
    } else {
      activeHandler = handler;
    }

    let activeSubArray = this.activeSubs.get(handler);
    if (!activeSubArray) {
      activeSubArray = [];
      this.activeSubs.set(handler, activeSubArray);
    }

    const onDestroyed = (destroyed: ConsumerSubscription): void => {
      const activeSubsArray = this.activeSubs.get(handler);
      if (activeSubsArray) {
        activeSubsArray.splice(activeSubsArray.indexOf(destroyed), 1);
        if (activeSubsArray.length === 0) {
          this.activeSubs.delete(handler);
        }
      }
    };

    const sub = new ConsumerSubscription(this.bus.on(this.topic, activeHandler, paused), onDestroyed);

    // Need to handle the case where the subscription is destroyed immediately
    if (sub.isAlive) {
      activeSubArray.push(sub);
    } else if (activeSubArray.length === 0) {
      this.activeSubs.delete(handler);
    }

    return sub;
  }

  /**
   * Disables handling of the event.
   * @param handler The handler to disable.
   * @deprecated This method has been deprecated in favor of using the {@link Subscription} object returned by
   * `.handle()` to manage subscriptions.
   */
  public off(handler: Handler<T>): void {
    const activeSubArray = this.activeSubs.get(handler);
    if (activeSubArray) {
      activeSubArray.shift()?.destroy();

      if (activeSubArray.length === 0) {
        this.activeSubs.delete(handler);
      }
    }
  }

  /**
   * Caps the event subscription to a specified frequency, in Hz.
   * @param frequency The frequency, in Hz, to cap to.
   * @param immediateFirstPublish Whether to fire once immediately before throttling.
   * @returns A new consumer with the applied frequency filter.
   */
  public atFrequency(frequency: number, immediateFirstPublish = true): Consumer<T> {
    const initialState = {
      previousTime: Date.now(),
      firstRun: immediateFirstPublish
    };

    return new Consumer<T>(this.bus, this.topic, initialState, this.getAtFrequencyHandler(frequency));
  }

  /**
   * Gets a handler function for a 'atFrequency' filter.
   * @param frequency The frequency, in Hz, to cap to.
   * @returns A handler function for a 'atFrequency' filter.
   */
  protected getAtFrequencyHandler(frequency: number): (data: any, state: any, next: Handler<T>) => void {
    const deltaTimeTrigger = 1000 / frequency;

    return (data, state, next): void => {
      const currentTime = Date.now();
      const deltaTime = currentTime - state.previousTime;

      if (deltaTimeTrigger <= deltaTime || state.firstRun) {
        while ((state.previousTime + deltaTimeTrigger) < currentTime) {
          state.previousTime += deltaTimeTrigger;
        }

        if (state.firstRun) {
          state.firstRun = false;
        }

        this.with(data, next);
      }
    };
  }

  /**
   * Quantizes the numerical event data to consume only at the specified decimal precision.
   * @param precision The decimal precision to snap to.
   * @returns A new consumer with the applied precision filter.
   */
  public withPrecision(precision: number): Consumer<T> {
    return new Consumer<T>(this.bus, this.topic, { lastValue: 0 }, this.getWithPrecisionHandler(precision));
  }

  /**
   * Gets a handler function for a 'withPrecision' filter.
   * @param precision The decimal precision to snap to.
   * @returns A handler function for a 'withPrecision' filter.
   */
  protected getWithPrecisionHandler(precision: number): (data: any, state: any, next: Handler<T>) => void {
    return (data, state, next): void => {
      const dataValue = (data as unknown) as number;
      const multiplier = Math.pow(10, precision);

      const currentValueAtPrecision = Math.round(dataValue * multiplier) / multiplier;
      if (currentValueAtPrecision !== state.lastValue) {
        state.lastValue = currentValueAtPrecision;

        this.with((currentValueAtPrecision as unknown) as T, next);
      }
    };
  }

  /**
   * Filter the subscription to consume only when the value has changed by a minimum amount.
   * @param amount The minimum amount threshold below which the consumer will not consume.
   * @returns A new consumer with the applied change threshold filter.
   */
  public whenChangedBy(amount: number): Consumer<T> {
    return new Consumer<T>(this.bus, this.topic, { lastValue: 0 }, this.getWhenChangedByHandler(amount));
  }

  /**
   * Gets a handler function for a 'whenChangedBy' filter.
   * @param amount The minimum amount threshold below which the consumer will not consume.
   * @returns A handler function for a 'whenChangedBy' filter.
   */
  protected getWhenChangedByHandler(amount: number): (data: any, state: any, next: Handler<T>) => void {
    return (data, state, next): void => {
      const dataValue = (data as unknown) as number;
      const diff = Math.abs(dataValue - state.lastValue);

      if (diff >= amount) {
        state.lastValue = dataValue;
        this.with(data, next);
      }
    };
  }

  /**
   * Filter the subscription to consume only if the value has changed. At all.  Really only
   * useful for strings or other events that don't change much.
   * @returns A new consumer with the applied change threshold filter.
   */
  public whenChanged(): Consumer<T> {
    return new Consumer<T>(this.bus, this.topic, { lastValue: '' }, this.getWhenChangedHandler());
  }

  /**
   * Gets a handler function for a 'whenChanged' filter.
   * @returns A handler function for a 'whenChanged' filter.
   */
  protected getWhenChangedHandler(): (data: any, state: any, next: Handler<T>) => void {
    return (data, state, next): void => {
      if (state.lastValue !== data) {
        state.lastValue = data;
        this.with(data, next);
      }
    };
  }

  /**
   * Filters events by time such that events will not be consumed until a minimum duration
   * has passed since the previous event.
   * @param deltaTime The minimum delta time between events.
   * @returns A new consumer with the applied change threshold filter.
   */
  public onlyAfter(deltaTime: number): Consumer<T> {
    return new Consumer<T>(this.bus, this.topic, { previousTime: Date.now() }, this.getOnlyAfterHandler(deltaTime));
  }

  /**
   * Gets a handler function for an 'onlyAfter' filter.
   * @param deltaTime The minimum delta time between events.
   * @returns A handler function for an 'onlyAfter' filter.
   */
  protected getOnlyAfterHandler(deltaTime: number): (data: any, state: any, next: Handler<T>) => void {
    return (data, state, next): void => {
      const currentTime = Date.now();
      const timeDiff = currentTime - state.previousTime;

      if (timeDiff > deltaTime) {
        state.previousTime += deltaTime;
        this.with(data, next);
      }
    };
  }

  /**
   * Builds a handler stack from the current handler.
   * @param data The data to send in to the handler.
   * @param handler The handler to use for processing.
   */
  protected with(data: T, handler: Handler<T>): void {
    if (this.currentHandler !== undefined) {
      this.currentHandler(data, this.state, handler);
    } else {
      handler(data);
    }
  }
}

/**
 * A {@link Subscription} for a {@link Consumer}.
 */
class ConsumerSubscription implements Subscription {
  /** @inheritdoc */
  public get isAlive(): boolean {
    return this.sub.isAlive;
  }

  /** @inheritdoc */
  public get isPaused(): boolean {
    return this.sub.isPaused;
  }

  /** @inheritdoc */
  public get canInitialNotify(): boolean {
    return this.sub.canInitialNotify;
  }

  /**
   * Constructor.
   * @param sub The event bus subscription backing this subscription.
   * @param onDestroy A function which is called when this subscription is destroyed.
   */
  constructor(
    private readonly sub: Subscription,
    private readonly onDestroy: (sub: ConsumerSubscription) => void
  ) {
  }

  /** @inheritdoc */
  public pause(): void {
    this.sub.pause();
  }

  /** @inheritdoc */
  public resume(initialNotify = false): void {
    this.sub.resume(initialNotify);
  }

  /** @inheritdoc */
  public destroy(): void {
    this.sub.destroy();

    this.onDestroy(this);
  }
}