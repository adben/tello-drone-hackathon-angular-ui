import {
  EMPTY, MonoTypeOperatorFunction, Observable, SchedulerLike, Subject, Subscriber, Subscription, filter, first, switchMap, timer,
} from 'rxjs';

export type CacheResetTrigger = 'next' | 'error' | 'complete' | 'refCountZero' | 'refCountNonZero';

/** Configuration options for the `cache` operator. */
export interface CacheOptions {
  /**
   * Factory function that should return a stream that emits a next event when the `cache` operator should reset the connection
   * (unsubscribe) from the source observable. Values emitted by the resulting observable are ignored, so they can be anything.
   */
  // eslint-disable-next-line @typescript-eslint/method-signature-style
  resetConnection?: (event$: Observable<CacheResetTrigger>) => Observable<unknown>;

  /**
   * Factory function that should return a stream that emits a next event when the `cache` operator should reset (clear) the cached value.
   * Values emitted by the resulting observable are ignored, so they can be anything.
   */
  // eslint-disable-next-line @typescript-eslint/method-signature-style
  resetCache?: (event$: Observable<CacheResetTrigger>) => Observable<unknown>;
}

/**
 * Operator for caching the last emitted next event and which multicasts all events from the source observable, thereby making sure it only
 * receives a single subscriber.
 *
 * Behavior of when to reset the connection to the source observable and when to reset (clear) the cached value can be defined using the
 * `options`-parameter.
 *
 * By default, when no options are specified, the cache is never cleared and the connection will be reset once there are no more
 * subscribers. So, the subscription to the source observable is canceled in that case. What happens when a new subscriber arrives, depends
 * on whether a termination event (error or complete) was received prior. If not, then a new subscription to the source observable is made.
 * Oherwise, no resubscription will happen. In any case the new subscriber (and any subsequent subscribers) will receive the cached value
 * and possibly a termination event.
 *
 * @param options Configuration object that controls the behavior of the this operator.
 */
export function cache<T>(options?: CacheOptions): MonoTypeOperatorFunction<T> {
  return (source$) => new CacheObservable(source$, options ?? {});
}

/**
 * This function is to be used in conjunction with the `cache` operator. It creates a `CacheOptions` object that applies debouncing when the
 * ref count reaches zero (i.e. the number of subscribers to the observable created by the `cache` operator goes to zero). This means that
 * it will keep the source subscription alive until the ref count reaches zero and no new subscriber arrives within the specified period.
 * When this happens the cached value will also be cleared.
 *
 * @param dueTime   Time to wait before unsubscribing from the source observable and clearing the cache when the ref count reaches zero.
 * @param scheduler Scheduler to use when setting a timer for the debounce duration.
 */
export function withDebouncedRefCount(dueTime: number, scheduler?: SchedulerLike): CacheOptions {
  function resetOnDebouncedRefCountZero(event$: Observable<CacheResetTrigger>): Observable<unknown> {
    return event$.pipe(
      filter((event) => event === 'refCountZero' || event === 'refCountNonZero'),
      switchMap((event) => event === 'refCountZero' ? timer(dueTime, scheduler) : EMPTY),
    );
  }

  return {
    resetConnection: resetOnDebouncedRefCountZero,
    resetCache: resetOnDebouncedRefCountZero,
  };
}

const NO_VALUE = Symbol('NO_VALUE');

class CacheObservable<T> extends Observable<T> {
  private cachedValue: T | typeof NO_VALUE = NO_VALUE;
  private cachedError: unknown = NO_VALUE;
  private cachedComplete = false;

  private sourceSubscription?: Subscription;
  private resetConnectionSubscription?: Subscription;
  private resetCacheSubscription?: Subscription;

  private readonly subscribers = new Set<Subscriber<T>>();
  private readonly resetTriggerSubject = new Subject<CacheResetTrigger>();

  private readonly getResetConnectionStream: (event$: Observable<CacheResetTrigger>) => Observable<unknown>;
  private readonly getResetCacheStream: (event$: Observable<CacheResetTrigger>) => Observable<unknown>;

  constructor(
    private readonly source$: Observable<T>,
    options: CacheOptions,
  ) {
    super((subscriber) => {
      this.addSubscriber(subscriber);

      return () => this.removeSubscriber(subscriber);
    });

    this.getResetConnectionStream = options.resetConnection ?? resetOnRefCountZeroAndNotTerminated;
    this.getResetCacheStream = options.resetCache ?? (() => EMPTY);
  }

  private addSubscriber(subscriber: Subscriber<T>): void {
    this.emitCache(subscriber);

    if (this.cacheContainsTerminationEvent()) {
      return;
    }

    this.subscribers.add(subscriber);

    if (this.subscribers.size === 1) {
      this.onRefCountNonZero();
    }
  }

  private removeSubscriber(subscriber: Subscriber<T>): void {
    this.subscribers.delete(subscriber);

    if (this.subscribers.size === 0) {
      this.onRefCountZero();
    }
  }

  private onRefCountZero(): void {
    this.resetTriggerSubject.next('refCountZero');
  }

  private onRefCountNonZero(): void {
    this.resetTriggerSubject.next('refCountNonZero');
    this.subscribeToResetConnectionStream();
    this.subscribeToResetCacheStream();
    this.subscribeToSource();
  }

  private subscribeToResetConnectionStream(): void {
    this.resetConnectionSubscription?.unsubscribe();

    const clearConnection = (): void => {
      this.resetConnectionSubscription?.unsubscribe();
      this.resetConnectionSubscription = undefined;
      this.sourceSubscription?.unsubscribe();
      this.sourceSubscription = undefined;
    };

    this.resetConnectionSubscription = this.getResetConnectionStream(this.resetTriggerSubject).subscribe({
      next: clearConnection,
      complete: clearConnection,
    });
  }

  private subscribeToResetCacheStream(): void {
    this.resetCacheSubscription ??= this.getResetCacheStream(this.resetTriggerSubject).subscribe({
      next: () => {
        if (this.subscribers.size === 0) {
          this.resetCacheSubscription?.unsubscribe();
          this.resetCacheSubscription = undefined;
        }
        this.resetCache();
      },
      complete: () => {
        this.resetCacheSubscription = undefined;
      },
    });
  }

  private subscribeToSource(): void {
    if (!this.sourceSubscription) {
      this.sourceSubscription = this.source$.subscribe({
        next: this.onNext.bind(this),
        error: this.onError.bind(this),
        complete: this.onComplete.bind(this),
      });
    }
  }

  private onNext(value: T): void {
    this.cachedValue = value;

    for (const subscriber of this.subscribers) {
      subscriber.next(value);
    }

    this.resetTriggerSubject.next('next');
  }

  private onError(error: unknown): void {
    this.cachedError = error;

    for (const subscriber of this.subscribers) {
      subscriber.error(error);
    }

    this.resetTriggerSubject.next('error');
  }

  private onComplete(): void {
    this.cachedComplete = true;

    for (const subscriber of this.subscribers) {
      subscriber.complete();
    }

    this.resetTriggerSubject.next('complete');
  }

  private cacheContainsTerminationEvent(): boolean {
    return this.cachedError !== NO_VALUE || this.cachedComplete;
  }

  private emitCache(subscriber: Subscriber<T>): void {
    if (this.cachedValue !== NO_VALUE) {
      subscriber.next(this.cachedValue);
    }

    if (this.cachedError !== NO_VALUE) {
      subscriber.error(this.cachedError);
    }

    if (this.cachedComplete) {
      subscriber.complete();
    }
  }

  private resetCache(): void {
    this.cachedValue = NO_VALUE;
    this.cachedError = NO_VALUE;
    this.cachedComplete = false;
  }
}

function resetOnRefCountZeroAndNotTerminated(event$: Observable<CacheResetTrigger>): Observable<unknown> {
  return event$.pipe(
    first((event) => event === 'error' || event === 'complete' || event === 'refCountZero'),
    filter((event) => event === 'refCountZero'),
  );
}
