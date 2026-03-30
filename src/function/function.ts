// ─── Function ───────────────────────────────────────────────────────────────

/**
 * Debounce a function. The function will only execute after `ms` of
 * calm (no further calls). Supports leading and trailing execution.
 */
export function debounce<T extends (...args: any[]) => any>(
  fn: T,
  ms: number,
  options: { leading?: boolean } = {},
): T & { cancel(): void; flush(): void } {
  let timer: ReturnType<typeof setTimeout> | undefined;
  let lastArgs: Parameters<T> | undefined;
  let lastResult: ReturnType<T>;
  let calledLeading = false;

  const debounced = function (this: unknown, ...args: Parameters<T>) {
    lastArgs = args;

    if (options.leading && !calledLeading && timer === undefined) {
      calledLeading = true;
      lastResult = fn.call(this, ...args);
    }

    if (timer !== undefined) clearTimeout(timer);
    timer = setTimeout(() => {
      timer = undefined;
      if (!options.leading || (options.leading && lastArgs !== undefined && !calledLeading)) {
        lastResult = fn.call(this, ...lastArgs!);
      }
      calledLeading = false;
      lastArgs = undefined;
    }, ms);

    return lastResult;
  } as T & { cancel(): void; flush(): void };

  debounced.cancel = () => {
    if (timer !== undefined) clearTimeout(timer);
    timer = undefined;
    lastArgs = undefined;
    calledLeading = false;
  };

  debounced.flush = () => {
    if (timer !== undefined) {
      clearTimeout(timer);
      timer = undefined;
      if (lastArgs !== undefined) {
        lastResult = fn.call(undefined, ...lastArgs);
      }
      calledLeading = false;
      lastArgs = undefined;
    }
  };

  return debounced;
}

/**
 * Throttle a function to execute at most once per `ms` milliseconds.
 */
export function throttle<T extends (...args: any[]) => any>(
  fn: T,
  ms: number,
): T & { cancel(): void } {
  let lastRun = 0;
  let timer: ReturnType<typeof setTimeout> | undefined;
  let lastArgs: Parameters<T> | undefined;
  let lastResult: ReturnType<T>;

  const throttled = function (this: unknown, ...args: Parameters<T>) {
    const now = Date.now();
    const elapsed = now - lastRun;

    if (elapsed >= ms) {
      lastRun = now;
      lastResult = fn.call(this, ...args);
    } else {
      lastArgs = args;
      if (timer === undefined) {
        timer = setTimeout(() => {
          lastRun = Date.now();
          timer = undefined;
          if (lastArgs !== undefined) {
            lastResult = fn.call(this, ...lastArgs);
            lastArgs = undefined;
          }
        }, ms - elapsed);
      }
    }

    return lastResult;
  } as T & { cancel(): void };

  throttled.cancel = () => {
    if (timer !== undefined) clearTimeout(timer);
    timer = undefined;
    lastArgs = undefined;
  };

  return throttled;
}

/**
 * Create a function that can only be called once.
 */
export function once<T extends (...args: any[]) => any>(fn: T): T {
  let called = false;
  let result: ReturnType<T>;

  return function (this: unknown, ...args: Parameters<T>) {
    if (!called) {
      called = true;
      result = fn.call(this, ...args);
    }
    return result;
  } as T;
}

/**
 * Memoize a function's results based on its arguments.
 */
export function memoize<T extends (...args: any[]) => any>(
  fn: T,
  keyFn: (...args: Parameters<T>) => string = (...args) => JSON.stringify(args),
): T & { cache: Map<string, ReturnType<T>>; clear(): void } {
  const cache = new Map<string, ReturnType<T>>();

  const memoized = function (this: unknown, ...args: Parameters<T>) {
    const key = keyFn(...args);
    if (cache.has(key)) {
      return cache.get(key)!;
    }
    const result = fn.call(this, ...args);
    cache.set(key, result);
    return result;
  } as T & { cache: Map<string, ReturnType<T>>; clear(): void };

  memoized.cache = cache;
  memoized.clear = () => cache.clear();

  return memoized;
}

/**
 * Pipe functions left-to-right: `pipe(f, g)(x)` === `g(f(x))`.
 */
export function pipe<A, B>(f1: (a: A) => B): (a: A) => B;
export function pipe<A, B, C>(f1: (a: A) => B, f2: (b: B) => C): (a: A) => C;
export function pipe<A, B, C, D>(f1: (a: A) => B, f2: (b: B) => C, f3: (c: C) => D): (a: A) => D;
export function pipe(...fns: ((a: any) => any)[]): (a: any) => any;
export function pipe(...fns: ((a: any) => any)[]): (a: any) => any {
  return (x: any) => fns.reduce((acc, fn) => fn(acc), x);
}

/** A no-op function that does nothing and returns undefined. */
export function noop(): void {
  // intentionally empty
}
