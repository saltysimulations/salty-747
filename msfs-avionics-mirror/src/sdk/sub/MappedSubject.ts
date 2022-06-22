import { MappedSubscribable, MutableSubscribable, Subscribable } from './Subscribable';
import { HandlerSubscription } from './HandlerSubscription';
import { Subscription } from './Subscription';
import { SubscribablePipe } from './SubscribablePipe';

/**
 * A type which contains the `length` property of a tuple.
 */
// eslint-disable-next-line jsdoc/require-jsdoc
type TupleLength<T extends [...any[]]> = { length: T['length'] };

/**
 * A type which maps a tuple of input types to a tuple of subscribables that provide the input types.
 */
export type MappedSubscribableInputs<Types extends [...any[]]> = {
  [Index in keyof Types]: Subscribable<Types[Index]>
} & TupleLength<Types>;

/**
 * A subscribable subject that is a mapped stream from one or more input subscribables.
 */
export class MappedSubject<I extends [...any[]], T> implements MappedSubscribable<T> {
  /**
   * Checks if two values are equal using the strict equality operator.
   * @param a The first value.
   * @param b The second value.
   * @returns whether a and b are equal.
   */
  public static readonly DEFAULT_EQUALITY_FUNC = (a: any, b: any): boolean => a === b;

  public readonly isSubscribable = true;

  private readonly inputs: MappedSubscribableInputs<I>;
  private readonly inputValues: I;
  private readonly inputSubs: Subscription[];

  private value: T;
  private readonly mutateFunc: (newVal: T) => void;

  private subs: HandlerSubscription<(v: T) => void>[] = [];
  private notifyDepth = 0;

  private readonly initialNotifyFunc = this.notifySubscription.bind(this);
  private readonly onSubDestroyedFunc = this.onSubDestroyed.bind(this);

  /**
   * Creates a new MappedSubject.
   * @param mapFunc The function which maps this subject's inputs to a value.
   * @param equalityFunc The function which this subject uses to check for equality between values.
   * @param mutateFunc The function which this subject uses to change its value.
   * @param initialVal The initial value of this subject.
   * @param inputs The subscribables which provide the inputs to this subject.
   */
  private constructor(
    private readonly mapFunc: (inputs: Readonly<I>, previousVal?: T) => T,
    private readonly equalityFunc: ((a: T, b: T) => boolean),
    mutateFunc?: ((oldVal: T, newVal: T) => void),
    initialVal?: T,
    ...inputs: MappedSubscribableInputs<I>
  ) {
    this.inputs = inputs;
    this.inputValues = inputs.map(input => input.get()) as I;

    if (initialVal && mutateFunc) {
      this.value = initialVal;
      mutateFunc(this.value, this.mapFunc(this.inputValues));
      this.mutateFunc = (newVal: T): void => { mutateFunc(this.value, newVal); };
    } else {
      this.value = this.mapFunc(this.inputValues);
      this.mutateFunc = (newVal: T): void => { this.value = newVal; };
    }

    this.inputSubs = this.inputs.map((input, index) => input.sub(this.updateValue.bind(this, index)));
  }

  /**
   * Creates a new mapped subject. Values are compared for equality using the strict equality comparison (`===`).
   * @param mapFunc The function to use to map inputs to the new subject value.
   * @param inputs The subscribables which provide the inputs to the new subject.
   */
  public static create<I extends [...any[]], T>(
    mapFunc: (inputs: Readonly<I>, previousVal?: T) => T,
    ...inputs: MappedSubscribableInputs<I>
  ): MappedSubject<I, T>;
  /**
   * Creates a new mapped subject. Values are compared for equality using a custom function.
   * @param mapFunc The function to use to map inputs to the new subject value.
   * @param equalityFunc The function which the new subject uses to check for equality between values.
   * @param inputs The subscribables which provide the inputs to the new subject.
   */
  public static create<I extends [...any[]], T>(
    mapFunc: (inputs: Readonly<I>, previousVal?: T) => T,
    equalityFunc: (a: T, b: T) => boolean,
    ...inputs: MappedSubscribableInputs<I>
  ): MappedSubject<I, T>;
  /**
   * Creates a new mapped subject with a persistent, cached value which is mutated when it changes. Values are
   * compared for equality using a custom function.
   * @param mapFunc The function to use to map inputs to the new subject value.
   * @param equalityFunc The function which the new subject uses to check for equality between values.
   * @param mutateFunc The function to use to change the value of the new subject.
   * @param initialVal The initial value of the new subject.
   * @param inputs The subscribables which provide the inputs to the new subject.
   */
  public static create<I extends [...any[]], T>(
    mapFunc: (inputs: Readonly<I>, previousVal?: T) => T,
    equalityFunc: (a: T, b: T) => boolean,
    mutateFunc: (oldVal: T, newVal: T) => void,
    initialVal: T,
    ...inputs: MappedSubscribableInputs<I>
  ): MappedSubject<I, T>;
  // eslint-disable-next-line jsdoc/require-jsdoc
  public static create<I extends [...any[]], T>(
    mapFunc: (inputs: Readonly<I>, previousVal?: T) => T,
    ...args: any
  ): MappedSubject<I, T> {
    let equalityFunc, mutateFunc, initialVal;
    if (typeof args[0] === 'function') {
      equalityFunc = args.shift() as (a: T, b: T) => boolean;
    } else {
      equalityFunc = MappedSubject.DEFAULT_EQUALITY_FUNC;
    }

    if (typeof args[0] === 'function') {
      mutateFunc = args.shift() as ((oldVal: T, newVal: T) => void);
      initialVal = args.shift() as T;
    }

    return new MappedSubject<I, T>(mapFunc, equalityFunc, mutateFunc, initialVal, ...args as any);
  }

  /**
   * Updates an input value, then re-maps this subject's value, and notifies subscribers if this results in a change to
   * the mapped value according to this subject's equality function.
   * @param index The index of the input value to update.
   */
  private updateValue(index: number): void {
    this.inputValues[index] = this.inputs[index].get();

    const value = this.mapFunc(this.inputValues, this.value);
    if (!this.equalityFunc(this.value, value)) {
      this.mutateFunc(value);
      this.notify();
    }
  }

  /** @inheritdoc */
  public get(): T {
    return this.value;
  }

  /** @inheritdoc */
  public sub(handler: (v: T) => void, initialNotify = false, paused = false): Subscription {
    const sub = new HandlerSubscription<(v: T) => void>(handler, this.initialNotifyFunc, this.onSubDestroyedFunc);
    this.subs.push(sub);

    if (paused) {
      sub.pause();
    } else if (initialNotify) {
      sub.initialNotify();
    }

    return sub;
  }

  /** @inheritdoc */
  public unsub(handler: (v: T) => void): void {
    const toDestroy = this.subs.find(sub => sub.handler === handler);
    toDestroy?.destroy();
  }

  /**
   * Notifies subscribers that this subscribable's value has changed.
   */
  private notify(): void {
    let needCleanUpSubs = false;
    this.notifyDepth++;

    const subLen = this.subs.length;
    for (let i = 0; i < subLen; i++) {
      try {
        const sub = this.subs[i];
        if (sub.isAlive && !sub.isPaused) {
          this.notifySubscription(sub);
        }

        needCleanUpSubs ||= !sub.isAlive;
      } catch (error) {
        console.error(`MappedSubject: error in handler: ${error}`);
        if (error instanceof Error) {
          console.error(error.stack);
        }
      }
    }

    this.notifyDepth--;

    if (needCleanUpSubs && this.notifyDepth === 0) {
      this.subs = this.subs.filter(sub => sub.isAlive);
    }
  }

  /**
   * Notifies a subscription of this subscribable's current state.
   * @param sub The subscription to notify.
   */
  private notifySubscription(sub: HandlerSubscription<(v: T) => void>): void {
    sub.handler(this.get());
  }

  /**
   * Responds to when a subscription to this subscribable is destroyed.
   * @param sub The destroyed subscription.
   */
  private onSubDestroyed(sub: HandlerSubscription<(v: T) => void>): void {
    // If we are not in the middle of a notify operation, remove the subscription.
    // Otherwise, do nothing and let the post-notify clean-up code handle it.
    if (this.notifyDepth === 0) {
      this.subs.splice(this.subs.indexOf(sub), 1);
    }
  }

  /**
   * Destroys the subscription to the parent subscribable.
   */
  public destroy(): void {
    for (let i = 0; i < this.inputSubs.length; i++) {
      this.inputSubs[i].destroy();
    }
  }

  /**
   * Maps this subject to a new subscribable.
   * @param fn The function to use to map to the new subscribable.
   * @param equalityFunc The function to use to check for equality between mapped values. Defaults to the strict
   * equality comparison (`===`).
   * @returns The mapped subscribable.
   */
  public map<M>(fn: (input: T, previousVal?: M) => M, equalityFunc?: ((a: M, b: M) => boolean)): MappedSubject<[T], M>;
  /**
   * Maps this subject to a new subscribable with a persistent, cached value which is mutated when it changes.
   * @param fn The function to use to map to the new subscribable.
   * @param equalityFunc The function to use to check for equality between mapped values.
   * @param mutateFunc The function to use to change the value of the mapped subscribable.
   * @param initialVal The initial value of the mapped subscribable.
   * @returns The mapped subscribable.
   */
  public map<M>(
    fn: (input: T, previousVal?: M) => M,
    equalityFunc: ((a: M, b: M) => boolean),
    mutateFunc: ((oldVal: M, newVal: M) => void),
    initialVal: M
  ): MappedSubject<[T], M>;
  // eslint-disable-next-line jsdoc/require-jsdoc
  public map<M>(
    fn: (input: T, previousVal?: M) => M,
    equalityFunc?: ((a: M, b: M) => boolean),
    mutateFunc?: ((oldVal: M, newVal: M) => void),
    initialVal?: M
  ): MappedSubject<[T], M> {
    const mapFunc = (inputs: readonly [T], previousVal?: M): M => fn(inputs[0], previousVal);
    return new MappedSubject(mapFunc, equalityFunc ?? MappedSubject.DEFAULT_EQUALITY_FUNC, mutateFunc, initialVal, this);
  }

  /**
   * Subscribes to and pipes this subscribable's state to a mutable subscribable. Whenever an update of this
   * subscribable's state is received through the subscription, it will be used as an input to change the other
   * subscribable's state.
   * @param to The mutable subscribable to which to pipe this subscribable's state.
   * @param paused Whether the new subscription should be initialized as paused. Defaults to `false`.
   * @returns The new subscription.
   */
  public pipe(to: MutableSubscribable<any, T>, paused?: boolean): Subscription;
  /**
   * Subscribes to this subscribable's state and pipes a mapped version to a mutable subscribable. Whenever an update
   * of this subscribable's state is received through the subscription, it will be transformed by the specified mapping
   * function, and the transformed state will be used as an input to change the other subscribable's state.
   * @param to The mutable subscribable to which to pipe this subscribable's mapped state.
   * @param map The function to use to transform inputs.
   * @param paused Whether the new subscription should be initialized as paused. Defaults to `false`.
   * @returns The new subscription.
   */
  public pipe<M>(to: MutableSubscribable<any, M>, map: (input: T) => M, paused?: boolean): Subscription;
  // eslint-disable-next-line jsdoc/require-jsdoc
  public pipe<M>(to: MutableSubscribable<any, T> | MutableSubscribable<any, M>, arg2?: ((from: T) => M) | boolean, arg3?: boolean): Subscription {
    let sub;
    let paused;
    if (typeof arg2 === 'function') {
      sub = new SubscribablePipe(this, to as MutableSubscribable<any, M>, arg2, this.onSubDestroyedFunc);
      paused = arg3 ?? false;
    } else {
      sub = new SubscribablePipe(this, to as MutableSubscribable<any, T>, this.onSubDestroyedFunc);
      paused = arg2 ?? false;
    }

    this.subs.push(sub);

    if (paused) {
      sub.pause();
    } else {
      sub.initialNotify();
    }

    return sub;
  }
}