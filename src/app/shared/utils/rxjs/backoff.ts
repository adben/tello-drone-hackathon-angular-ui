import { EMPTY, Observable, RetryConfig, SchedulerLike, repeat, throwError, timer } from 'rxjs';

type RepeatConfig = Exclude<Parameters<typeof repeat>[0], undefined | number>;

export type BackoffConfig = RetryConfig & RepeatConfig;

type BackoffDelaySelector = (count: number) => number | false;

export function withConstantBackoff(delay: number, maxCount: number = Infinity, scheduler?: SchedulerLike): BackoffConfig {
  return withBackoff((count) => count <= maxCount ? delay : false, scheduler);
}

export interface ExponentialBackoffOptions {
  startDelay: number;
  base: number;
  minDelay?: number;
  maxDelay?: number;
  maxCount?: number;
}

export function withExponentialBackoff(options: Partial<ExponentialBackoffOptions> = {}, scheduler?: SchedulerLike): BackoffConfig {
  const {
    startDelay,
    base,
    minDelay,
    maxDelay,
    maxCount,
  } = { startDelay: 5000, base: 2, ...options };

  return withBackoff(
    (count) => {
      if (maxCount !== undefined && count > maxCount) {
        return false;
      }

      const delay = startDelay * base ** (count - 1);

      return (
        (minDelay !== undefined && delay < minDelay) ? minDelay :
        (maxDelay !== undefined && delay > maxDelay) ? maxDelay : delay
      );
    },
    scheduler,
  );
}

export function withBackoffFromArray(delays: number[], repeatLastDelay: boolean = true, scheduler?: SchedulerLike): BackoffConfig {
  return withBackoff(
    (count) =>
      count <= delays.length
        ? delays[count - 1]! :
      repeatLastDelay && delays.length > 0
        ? delays[delays.length - 1]!
        : false,
    scheduler,
  );
}

function withBackoff(backoffDelaySelector: BackoffDelaySelector, scheduler: SchedulerLike | undefined): BackoffConfig {
  return {
    delay: backoffDelay(backoffDelaySelector, scheduler),
    resetOnSuccess: true,
  };
}

function backoffDelay(
  backoffDelaySelector: BackoffDelaySelector,
  scheduler: SchedulerLike | undefined,
): Exclude<BackoffConfig['delay'], undefined> {
  function getBackoffDelay(count: number): Observable<unknown>;
  function getBackoffDelay(error: unknown, count: number): Observable<unknown>;
  function getBackoffDelay(errorOrCount: unknown, count?: number): Observable<unknown> {
    count ??= typeof errorOrCount === 'number' ? errorOrCount : Infinity; // eslint-disable-line no-param-reassign

    const delay = backoffDelaySelector(count);

    if (delay !== false) {
      return timer(delay, scheduler);
    }

    const hasError = arguments.length > 1;

    return hasError ? throwError(() => errorOrCount) : EMPTY;
  }

  return getBackoffDelay;
}
