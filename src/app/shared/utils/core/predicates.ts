export type Predicate<T> = (value: T) => boolean;

export function notUndefined<T>(value: T | undefined): value is T {
  return value !== undefined;
}

export function notNull<T>(value: T | null): value is T {
  return value !== null;
}

export function notNullOrUndefined<T>(value: T | undefined | null): value is T {
  return notUndefined(value) && notNull(value);
}

export function not<T, U extends T>(typeGuardFunction: (value: T) => value is U): (value: T) => value is Exclude<T, U>;
export function not<T extends (...args: any[]) => boolean>(func: T): T; // eslint-disable-line @typescript-eslint/no-explicit-any
export function not<T extends (...args: any[]) => boolean>(func: T): T { // eslint-disable-line @typescript-eslint/no-explicit-any
  return function(this: unknown, ...args: unknown[]): boolean {
    return !func.apply(this, args);
  } as T;
}

export function isNullOrUndefined(value: unknown): value is null | undefined {
  return value === null || value === undefined;
}
