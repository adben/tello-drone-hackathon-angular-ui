import { Observable, OperatorFunction } from 'rxjs';

/** Value that indicating that a emit from some observable should be filtered out. */
export const FILTERED = Symbol('FILTERED');
export type FILTERED = typeof FILTERED;

/**
 * Operator that enables you to simultaneously specify a mapping and filtering operation. The advantage of this operator over a `map`
 * followed by a `filter`, is that it automatically uses TypeScript`s type narrowing feature to limit the size of the resulting type.
 * The operator behaves like a normal map operator, except when the projection function returns the `FILTERED` value. This is a special
 * value that indicates that no value should be emitted, thereby effectively filtering out the emit from the source observable.
 *
 * Example usage (using a `Observable<Loadable<string>>` as input):
 *
 * ```typescript
 * source$.pipe(
 *   filterMap((loadableString) =>
 *     loadableString?.success
 *       ? loadableString.value.toUpperCase()
 *       : FILTERED
 *   ),
 * )
 * ```
 */
export function filterMap<T, U>(project: (value: T) => U | FILTERED): OperatorFunction<T, U> {
  return (source$: Observable<T>) =>
    new Observable<U>((observer) =>
      source$.subscribe({
        next: (value) => {
          const result = project(value);

          if (result !== FILTERED) {
            observer.next(result);
          }
        },
        error: (error) => observer.error(error),
        complete: () => observer.complete(),
      }),
    );
}
