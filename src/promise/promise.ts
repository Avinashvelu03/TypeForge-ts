// ─── Promise ────────────────────────────────────────────────────────────────

/** Sleep for `ms` milliseconds. */
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Create a concurrency limiter. Returns a function that wraps async tasks
 * to limit how many run in parallel.
 */
export function pLimit(concurrency: number): <T>(fn: () => Promise<T>) => Promise<T> {
  if (concurrency < 1 || !Number.isFinite(concurrency)) {
    throw new RangeError(`concurrency must be >= 1, got ${concurrency}`);
  }
  const limit = Math.floor(concurrency);
  let running = 0;
  const queue: (() => void)[] = [];

  const next = () => {
    if (queue.length > 0 && running < limit) {
      running++;
      const run = queue.shift()!;
      run();
    }
  };

  return <T>(fn: () => Promise<T>): Promise<T> => {
    return new Promise<T>((resolve, reject) => {
      const run = () => {
        fn().then(
          (val) => { running--; resolve(val); next(); },
          (err) => { running--; reject(err); next(); },
        );
      };

      if (running < limit) {
        running++;
        run();
      } else {
        queue.push(run);
      }
    });
  };
}

/**
 * Retry an async function with configurable attempts and delay.
 */
export function pRetry<T>(
  fn: () => Promise<T>,
  options: { retries?: number; delay?: number } = {},
): Promise<T> {
  const retries = options.retries ?? 3;
  const delay = options.delay ?? 0;

  return new Promise<T>((resolve, reject) => {
    let attempt = 0;

    const tryOnce = () => {
      fn().then(resolve, (err) => {
        attempt++;
        if (attempt >= retries) {
          reject(err);
        } else if (delay > 0) {
          setTimeout(tryOnce, delay);
        } else {
          tryOnce();
        }
      });
    };

    tryOnce();
  });
}

/**
 * Wrap a promise with a timeout. Rejects with an Error if not resolved within `ms`.
 */
export function pTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  // Attach a no-op catch immediately so Node's unhandled-rejection tracker
  // always sees a synchronous handler, regardless of when the outer wrapper
  // attaches its own .then/.catch via the returned promise.
  promise.catch(() => {});

  return new Promise<T>((resolve, reject) => {
    let settled = false;

    const timer = setTimeout(() => {
      if (!settled) {
        settled = true;
        reject(new Error(`Promise timed out after ${ms}ms`));
      }
    }, ms);

    promise.then(
      (val) => {
        if (!settled) {
          settled = true;
          clearTimeout(timer);
          resolve(val);
        }
      },
      (err) => {
        if (!settled) {
          settled = true;
          clearTimeout(timer);
          reject(err);
        }
      },
    );
  });
}

/**
 * Execute multiple async tasks with optional concurrency limit.
 */
export async function pAll<T>(
  tasks: readonly (() => Promise<T>)[],
  concurrency?: number,
): Promise<T[]> {
  if (!concurrency || concurrency >= tasks.length) {
    return Promise.all(tasks.map((fn) => fn()));
  }

  const limiter = pLimit(concurrency);
  return Promise.all(tasks.map((fn) => limiter(fn)));
}
