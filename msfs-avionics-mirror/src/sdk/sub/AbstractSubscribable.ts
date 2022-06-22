import { MappedSubject } from './MappedSubject';
import { MutableSubscribable, Subscribable } from './Subscribable';
import { HandlerSubscription } from './HandlerSubscription';
import { Subscription } from './Subscription';
import { SubscribablePipe } from './SubscribablePipe';

/**
 * An abstract implementation of a subscribable which allows adding, removing, and notifying subscribers.
 */
export abstract class AbstractSubscribable<T> implements Subscribable<T> {
  public readonly isSubscribable = true;

  /**
   * Checks if two values are equal using the strict equality operator.
   * @param a The first value.
   * @param b The second value.
   * @returns whether a and b are equal.
   */
  public static readonly DEFAULT_EQUALITY_FUNC = (a: any, b: any): boolean => a === b;

  protected subs: HandlerSubscription<(v: T) => void>[] = [];
  protected notifyDepth = 0;

  /** A function which sends initial notifications to subscriptions. */
  protected readonly initialNotifyFunc = this.notifySubscription.bind(this);

  /** A function which responds to when a subscription to this subscribable is destroyed. */
  protected readonly onSubDestroyedFunc = this.onSubDestroyed.bind(this);

  /** @inheritdoc */
  public abstract get(): T;

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
   * Notifies subscriptions that this subscribable's value has changed.
   */
  protected notify(): void {
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
        console.error(`AbstractSubscribable: error in handler: ${error}`);
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
  protected notifySubscription(sub: HandlerSubscription<(v: T) => void>): void {
    sub.handler(this.get());
  }

  /**
   * Responds to when a subscription to this subscribable is destroyed.
   * @param sub The destroyed subscription.
   */
  protected onSubDestroyed(sub: HandlerSubscription<(v: T) => void>): void {
    // If we are not in the middle of a notify operation, remove the subscription.
    // Otherwise, do nothing and let the post-notify clean-up code handle it.
    if (this.notifyDepth === 0) {
      this.subs.splice(this.subs.indexOf(sub), 1);
    }
  }

  /**
   * Maps this subscribable to a new subscribable.
   * @param fn The function to use to map to the new subscribable.
   * @param equalityFunc The function to use to check for equality between mapped values. Defaults to the strict
   * equality comparison (`===`).
   * @returns The mapped subscribable.
   */
  public map<M>(fn: (input: T, previousVal?: M) => M, equalityFunc?: ((a: M, b: M) => boolean)): MappedSubject<[T], M>;
  /**
   * Maps this subscribable to a new subscribable with a persistent, cached value which is mutated when it changes.
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
    return mutateFunc
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      ? MappedSubject.create(mapFunc, equalityFunc!, mutateFunc, initialVal!, this)
      : MappedSubject.create(mapFunc, equalityFunc ?? AbstractSubscribable.DEFAULT_EQUALITY_FUNC, this);
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