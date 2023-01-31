import { MonoTypeOperatorFunction, ReplaySubject, connectable } from 'rxjs';

/**
 * Operator that "commits" to the source observable by directly subscribing and multicasting all events to any downstream subscribers. It
 * also makes sure that the last emitted next event is cached, so late subscribers won't miss the result. This is useful for constructing
 * observables which represent an "external state modification" (e.g. HTTP PUT, POST or DELETE requests), which should be executed
 * regardless of any subscribers.
 *
 * Essentially, this operator is equal to the `cache` operator, except that it directly subscribes to the source observable.
 *
 * See https://codefoundry.nl/blogs/rxjs-subscriptions#when-not-to-unsubscribe for more details.
 */
export function commit<T>(): MonoTypeOperatorFunction<T> {
  return (source$) => {
    const connectorSubject = new ReplaySubject<T>(1);

    const output$ = connectable(source$, { connector: () => connectorSubject, resetOnDisconnect: false });

    output$.connect();

    return output$;
  };
}
