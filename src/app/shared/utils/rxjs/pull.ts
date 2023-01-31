import { Observable } from 'rxjs';

/** Value which indicates that the source stream did not emit a value upon subscription. */
export const NO_VALUE_EMITTED = Symbol('NO_VALUE_EMITTED');

/**
 * Subscribes to the source observable and then synchronously unsubscribes. If the observable synchronously emitted one or more values (e.g.
 * for a `ReplaySubject`, a `BehaviorSubject` or the result of a `cache` operator), then the **last** emitted value is returned by this
 * function. When no value was emitted, then this function returns the `NO_VALUE_EMITTED` value.
 *
 * To check if the result is a valid value, you can use the utility function `valueWasEmitted`, which acts as a type predicate:
 *
 * ```typescript
 * const value = pull(source$);
 *
 * if (valueWasEmitted(value)) {
 *   // You can now safely use value here
 * }
 * ```
 */
export function pull<T>(source$: Observable<T>): T | typeof NO_VALUE_EMITTED;

/**
 * Subscribes to the source observable and then synchronously unsubscribes. If the observable synchronously emitted one or more values (e.g.
 * for a `ReplaySubject`, a `BehaviorSubject` or the result of a `cache` operator), then the **last** emitted value is returned by this
 * function. When no value was emitted, then this function returns the specified default value.
 */
export function pull<T>(source$: Observable<T>, defaultValue: T): T;

/**
 * Subscribes to the source observable and then synchronously unsubscribes. If the observable synchronously emitted one or more values (e.g.
 * for a `ReplaySubject`, a `BehaviorSubject` or the result of a `cache` operator), then the **last** emitted value is returned by this
 * function. When no value was emitted, then this function returns the specified default value.
 */
export function pull<T, U>(source$: Observable<T>, defaultValue: U): T | U;

export function pull<T, U>(source$: Observable<T>, defaultValue?: U): T | U | typeof NO_VALUE_EMITTED {
  let result: T | U | typeof NO_VALUE_EMITTED = arguments.length > 1 ? defaultValue! : NO_VALUE_EMITTED;

  const subscription = source$.subscribe({
    next: (value) => (result = value),
    error: () => {},
  });
  subscription.unsubscribe();

  return result;
}

/**
 * Type predicate used to verify whether the result of a `pull` invocation is a value that was emitted by the source observable.
 */
export function valueWasEmitted<T>(value: T | typeof NO_VALUE_EMITTED): value is T {
  return value !== NO_VALUE_EMITTED;
}
