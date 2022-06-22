import { Consumer, EventBus, Handler } from '../data';
import { AbstractSubscribable } from '../sub/AbstractSubscribable';
import { SubEvent } from '../sub/SubEvent';
import { Subscription } from '../sub/Subscription';
import { UserSettingMap, UserSetting, UserSettingDefinition, UserSettingManager, UserSettingType, MappedUserSettingManager } from './UserSetting';

/**
 * Maps the names of a subset of user setting definitions to other setting names.
 */
type DeferredUserSettingMap<T> = {
  [Property in keyof T]?: string | number | symbol;
}

/**
 * A manager for user settings capable of handling aliased settings whose aliases are known ahead of time, but
 * whose true names are not defined until some arbitrary time after the manager has been created. Until the mappings
 * between aliases and true names are defined, all settings have their values fixed to their default values.
 */
export class DeferredUserSettingManager<T extends Record<any, UserSettingType>> implements UserSettingManager<T> {
  private readonly deferredSettings: Map<keyof T, DeferredUserSetting<keyof T, T[keyof T]>>;
  private readonly mapEvent = new SubEvent<DeferredUserSettingManager<T>, DeferredUserSettingMap<T>>();

  protected manager?: UserSettingManager<T>;

  /**
   * Constructor.
   * @param bus The bus used by this manager to publish setting change events.
   * @param settingDefs The setting definitions used to initialize this manager's settings. For those settings with
   * aliased names, these definitions should define the aliases rather than the true names.
   */
  constructor(
    private readonly bus: EventBus,
    settingDefs: readonly UserSettingDefinition<keyof T, T[keyof T]>[]
  ) {
    this.deferredSettings = new Map(settingDefs.map(def => [def.name, new DeferredUserSetting(def)]));
  }

  /**
   * Defines the mappings for this manager's aliased setting names. If a mapping has already been defined, then this
   * method does nothing.
   * @param masterManager The manager hosting the original settings from which this manager's settings are aliased.
   * @param map The mappings for this manager's aliased setting names, as a set of key-value pairs where the keys are
   * the setting name aliases and the values are the true setting names. For any setting whose name does not appear as
   * a key in the mapping, the setting's true name is assumed to be the same as its alias.
   */
  public defineAliases<O extends Record<any, UserSettingType>>(masterManager: UserSettingManager<O>, map: UserSettingMap<T, O>): void {
    if (this.manager) {
      return;
    }

    this.manager = masterManager.mapTo(map) as unknown as UserSettingManager<T>;

    for (const deferredSetting of this.deferredSettings.values()) {
      deferredSetting.init(this.manager.getSetting(deferredSetting.definition.name));
    }

    this.mapEvent.notify(this, map);
  }

  /** @inheritdoc */
  public getSetting<K extends keyof T>(name: K): UserSetting<K, T[K]> {
    const setting = this.deferredSettings.get(name);
    if (!setting) {
      throw new Error(`Could not find setting with name ${name}`);
    }

    return setting as unknown as UserSetting<K, T[K]>;
  }

  /** @inheritdoc */
  public whenSettingChanged<K extends keyof T>(name: K): Consumer<T[K]> {
    const setting = this.deferredSettings.get(name);
    if (!setting) {
      throw new Error(`Could not find setting with name ${name}`);
    }

    return new DeferredUserSettingConsumer<T[K]>(
      this.bus,
      name.toString(),
      this.manager?.getSetting(name).definition.name.toString(),
      setting.definition.defaultValue as T[K],
      this.mapEvent
    ).whenChanged();
  }

  /** @inheritdoc */
  public getAllSettings(): UserSetting<keyof T, T[keyof T]>[] {
    return Array.from(this.deferredSettings.values());
  }

  /** @inheritdoc */
  public mapTo<M extends Record<any, UserSettingType>>(map: UserSettingMap<M, T>): UserSettingManager<M & T> {
    return new MappedUserSettingManager(this, map);
  }
}

/**
 * A user setting with a value that is deferred until the setting is initialized to be backed by another user setting.
 * Before intialization, the deferred setting's value is always equal to its default value.
 */
class DeferredUserSetting<K, T extends boolean | number | string> extends AbstractSubscribable<T> implements UserSetting<K, T> {
  public readonly isMutableSubscribable = true;

  /**
   * The user setting backing this deferred setting, or undefined if this setting has not been initialized.
   */
  private setting?: UserSetting<K, T>;

  /** @inheritdoc */
  public get definition(): UserSettingDefinition<K, T> {
    return this.setting?.definition ?? this.aliasedDefinition;
  }

  // eslint-disable-next-line jsdoc/require-returns
  /** This setting's current value. */
  public get value(): T {
    return this.setting?.value ?? this.definition.defaultValue;
  }
  // eslint-disable-next-line jsdoc/require-jsdoc
  public set value(v: T) {
    this.setting && (this.setting.value = v);
  }

  /**
   * Constructor.
   * @param aliasedDefinition This setting's aliased definition.
   */
  constructor(
    private readonly aliasedDefinition: UserSettingDefinition<K, T>
  ) {
    super();
  }

  /**
   * Initializes this deferred setting to be backed by another user setting. Once initialized, any changes to this
   * setting's value will be reflected in the backing setting, and vice versa.
   * @param setting The user setting backing this deferred setting.
   */
  public init(setting: UserSetting<K, T>): void {
    this.setting = setting;
    setting.sub(() => { this.notify(); });
    if (this.definition.defaultValue !== setting.value) {
      this.notify();
    }
  }

  /** @inheritdoc */
  public get(): T {
    return this.value;
  }

  /**
   * Sets the value of this setting.
   * @param value The new value.
   */
  public set(value: T): void {
    this.value = value;
  }
}

/**
 * A consumer of value-change events of user settings with deferred aliased names.
 */
class DeferredUserSettingConsumer<T> extends Consumer<T> {
  private readonly deferredActiveSubs = new Map<Handler<T>, Subscription[]>();

  private readonly mapEventSub?: Subscription;

  private currentMappingHandler?: Handler<T>;

  /**
   * Constructor.
   * @param bus The event bus.
   * @param aliasTopic The topic associated with this consumer's setting's alias name.
   * @param trueTopic The topic associated with this consumer's setting's true name, or undefined if the true name is
   * unknown.
   * @param defaultValue This consumer's setting's default value.
   * @param mapEvent A subscribable event that notifies when a mapping has been defined between this consumer's
   * setting's alias name and its true name.
   * @param deferredState The state for the consumer to track.
   * @param deferredCurrentHandler The current build filter handler stack, if any.
   */
  constructor(
    bus: EventBus,
    aliasTopic: string,
    private trueTopic: string | undefined,
    private readonly defaultValue: T,
    private readonly mapEvent: SubEvent<DeferredUserSettingManager<any>, DeferredUserSettingMap<any>>,
    private deferredState: any = {},
    private readonly deferredCurrentHandler?: (data: T, state: any, next: Handler<T>) => void
  ) {
    super(bus, aliasTopic, deferredState, deferredCurrentHandler);

    if (trueTopic === undefined) {
      this.mapEventSub = mapEvent.on(this.onMap.bind(this));
    }
  }

  /** @inheritdoc */
  public handle(handler: Handler<T>, paused = false): Subscription {
    let activeHandler: Handler<T>;

    if (this.deferredCurrentHandler !== undefined) {

      /**
       * The handler reference to store.
       * @param data The input data to the handler.
       */
      activeHandler = (data): void => {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        this.deferredCurrentHandler!(data, this.deferredState, handler);
      };
    } else {
      activeHandler = handler;
    }

    let activeSubArray = this.deferredActiveSubs.get(handler);
    if (!activeSubArray) {
      activeSubArray = [];
      this.deferredActiveSubs.set(handler, activeSubArray);
    }

    const onDestroyed = (destroyed: DeferredSubscription<T>): void => {
      // If we are not in the middle of a mapping operation, remove the subscription.
      // Otherwise, do nothing and let the post-mapping clean-up code handle it.
      if (this.currentMappingHandler === handler) {
        return;
      }

      const activeSubsArray = this.deferredActiveSubs.get(handler);
      if (activeSubsArray) {
        activeSubsArray.splice(activeSubsArray.indexOf(destroyed), 1);
        if (activeSubsArray.length === 0) {
          this.deferredActiveSubs.delete(handler);
        }
      }
    };

    const sub = new DeferredSubscription(this.defaultValue, activeHandler, onDestroyed);

    if (paused) {
      sub.pause();
    }

    if (this.trueTopic !== undefined) {
      // init() will take care of the initial notify for us, including not notifying if the subscription is paused.
      sub.init(this.bus, this.trueTopic);
    } else if (!paused) {
      sub.initialNotify();
    }

    // Need to handle the case where the subscription is destroyed immediately
    if (sub.isAlive) {
      activeSubArray.push(sub);
    } else if (activeSubArray.length === 0) {
      this.deferredActiveSubs.delete(handler);
    }

    return sub;
  }

  /** @inheritdoc */
  public off(handler: Handler<T>): void {
    const activeSubsArray = this.deferredActiveSubs.get(handler);
    if (activeSubsArray) {
      // If we are not in the middle of a mapping operation, remove the subscription.
      // Otherwise, do nothing and let the post-mapping clean-up code handle it.
      if (this.currentMappingHandler === handler) {
        activeSubsArray[0]?.destroy();
      } else {
        activeSubsArray.shift()?.destroy();

        if (activeSubsArray.length === 0) {
          this.deferredActiveSubs.delete(handler);
        }
      }
    }
  }

  /** @inheritdoc */
  public atFrequency(frequency: number, immediateFirstPublish = true): Consumer<T> {
    const initialState = {
      previousTime: Date.now(),
      firstRun: immediateFirstPublish
    };

    return new DeferredUserSettingConsumer<T>(
      this.bus, this.topic, this.trueTopic, this.defaultValue, this.mapEvent, initialState, this.getAtFrequencyHandler(frequency)
    );
  }

  /** @inheritdoc */
  public withPrecision(precision: number): Consumer<T> {
    return new DeferredUserSettingConsumer<T>(
      this.bus, this.topic, this.trueTopic, this.defaultValue, this.mapEvent, { lastValue: 0 }, this.getWithPrecisionHandler(precision)
    );
  }

  /** @inheritdoc */
  public whenChangedBy(amount: number): Consumer<T> {
    return new DeferredUserSettingConsumer<T>(
      this.bus, this.topic, this.trueTopic, this.defaultValue, this.mapEvent, { lastValue: 0 }, this.getWhenChangedByHandler(amount)
    );
  }

  /** @inheritdoc */
  public whenChanged(): Consumer<T> {
    return new DeferredUserSettingConsumer<T>(
      this.bus, this.topic, this.trueTopic, this.defaultValue, this.mapEvent, { lastValue: '' }, this.getWhenChangedHandler()
    );
  }

  /** @inheritdoc */
  public onlyAfter(deltaTime: number): Consumer<T> {
    return new DeferredUserSettingConsumer<T>(
      this.bus, this.topic, this.trueTopic, this.defaultValue, this.mapEvent, { previousTime: Date.now() }, this.getOnlyAfterHandler(deltaTime)
    );
  }

  /**
   * Responds to when a mapping has been defined between this consumer's setting's alias name and its true name.
   * @param sender The sender of the mapping event.
   * @param map A set of mappings that includes the mapping between this consumer's setting's alias name and its true
   * name.
   */
  private onMap(sender: any, map: DeferredUserSettingMap<any>): void {
    this.trueTopic = (map[this.topic] as string) ?? this.topic;

    const needCleanUpHandlers = [];

    // Initialize all deferred subscriptions that are still alive.
    for (const [handler, activeSubArray] of this.deferredActiveSubs.entries()) {
      let needCleanUpSubs = false;

      this.currentMappingHandler = handler;

      for (const activeSub of activeSubArray) {
        if (activeSub.isAlive) {
          if (activeSub instanceof DeferredSubscription) {
            activeSub.init(this.bus, this.trueTopic);
          }
        }

        needCleanUpSubs ||= !activeSub.isAlive;
      }

      this.currentMappingHandler = undefined;

      if (needCleanUpSubs) {
        needCleanUpHandlers.push(handler);
      }
    }

    // Remove all dead subscriptions.
    for (let i = 0; i < needCleanUpHandlers.length; i++) {
      const handler = needCleanUpHandlers[i];

      const filtered = this.deferredActiveSubs.get(handler)?.filter(sub => sub.isAlive);
      if (filtered?.length === 0) {
        this.deferredActiveSubs.delete(handler);
      } else if (filtered) {
        this.deferredActiveSubs.set(handler, filtered);
      }
    }

    this.mapEventSub?.destroy();
  }
}

/**
 * A {@link Subscription} for a {@link DeferredUserSettingConsumer}.
 */
class DeferredSubscription<T> implements Subscription {
  private sub?: Subscription;

  private _isAlive = true;
  /** @inheritdoc */
  public get isAlive(): boolean {
    return this._isAlive;
  }

  private _isPaused = false;
  /** @inheritdoc */
  public get isPaused(): boolean {
    return this._isPaused;
  }

  /** @inheritdoc */
  public readonly canInitialNotify = true;

  /**
   * Constructor.
   * @param defaultValue This default value of this subscription's source.
   * @param handler This subscription's handler. The handler will be called each time this subscription receives a
   * notification from its source.
   * @param onDestroy A function which is called when this subscription is destroyed.
   */
  constructor(
    private readonly defaultValue: T,
    public readonly handler: Handler<T>,
    private readonly onDestroy: (sub: DeferredSubscription<T>) => void
  ) {
  }

  /**
   * Initializes this deferred subscription with an event bus topic. Once initialized, this subscription will receive
   * notifications from events for the given topic.
   * @param bus The event bus.
   * @param topic The topic to which to subscribe.
   * @throws Error if this subscription is not alive.
   */
  public init(bus: EventBus, topic: string): void {
    if (!this._isAlive) {
      throw new Error('DeferredSubscription: cannot initialize a dead Subscription.');
    }

    this.sub = bus.on(topic, (data: T): void => {
      if (!this._isPaused) {
        this.handler(data);
      }
    });

    // Need to handle the case where this subscription is destroyed immediately
    if (!this._isAlive) {
      this.sub.destroy();
    }
  }

  /**
   * Sends an initial notification to this subscription.
   * @throws Error if this subscription is not alive.
   */
  public initialNotify(): void {
    if (!this._isAlive) {
      throw new Error('DeferredSubscription: cannot notify a dead Subscription.');
    }

    this.handler(this.defaultValue);
  }

  /** @inheritdoc */
  public pause(): void {
    if (!this._isAlive) {
      throw new Error('Subscription: cannot pause a dead Subscription.');
    }

    this.sub?.pause();
    this._isPaused = true;
  }

  /** @inheritdoc */
  public resume(initialNotify = false): void {
    if (!this._isAlive) {
      throw new Error('Subscription: cannot resume a dead Subscription.');
    }

    if (!this._isPaused) {
      return;
    }

    this._isPaused = false;

    if (this.sub) {
      this.sub.resume(initialNotify);
    } else if (initialNotify) {
      this.initialNotify();
    }
  }

  /** @inheritdoc */
  public destroy(): void {
    this.sub?.destroy();
    this._isAlive = false;

    this.onDestroy(this);
  }
}