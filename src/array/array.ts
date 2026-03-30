// ─── Array ──────────────────────────────────────────────────────────────────

/**
 * Split an array into chunks of the given size.
 */
export function chunk<T>(arr: readonly T[], size: number): T[][] {
  if (size < 1 || !Number.isFinite(size)) {
    throw new RangeError(`chunk size must be >= 1, got ${size}`);
  }
  const s = Math.floor(size);
  const result: T[][] = [];
  for (let i = 0; i < arr.length; i += s) {
    result.push(arr.slice(i, i + s));
  }
  return result;
}

/**
 * Remove all falsy values (false, null, 0, '', undefined, NaN) from an array.
 */
export function compact<T>(arr: readonly (T | null | undefined | false | 0 | '')[]): T[] {
  return arr.filter(Boolean) as T[];
}

/**
 * Flatten an array to the specified depth.
 */
export function flatten<T>(arr: readonly T[], depth: number = 1): unknown[] {
  if (depth < 1) return arr.slice();
  return arr.reduce<unknown[]>((acc, val) => {
    if (Array.isArray(val) && depth > 0) {
      acc.push(...flatten(val, depth - 1));
    } else {
      acc.push(val);
    }
    return acc;
  }, []);
}

/**
 * Deduplicate array items. Optionally provide a key function for complex objects.
 */
export function unique<T>(arr: readonly T[], keyFn?: (item: T) => unknown): T[] {
  if (!keyFn) {
    return [...new Set(arr)];
  }
  const seen = new Set<unknown>();
  const result: T[] = [];
  for (const item of arr) {
    const key = keyFn(item);
    if (!seen.has(key)) {
      seen.add(key);
      result.push(item);
    }
  }
  return result;
}

/**
 * Group array items by a key function.
 */
export function groupBy<T, K extends string | number>(
  arr: readonly T[],
  keyFn: (item: T, index: number) => K,
): Record<K, T[]> {
  const result = {} as Record<K, T[]>;
  for (let i = 0; i < arr.length; i++) {
    const key = keyFn(arr[i], i);
    if (!result[key]) {
      result[key] = [];
    }
    result[key].push(arr[i]);
  }
  return result;
}

/**
 * Sort an array by a key function. Returns a new sorted array.
 */
export function sortBy<T>(
  arr: readonly T[],
  keyFn: (item: T) => number | string,
  order: 'asc' | 'desc' = 'asc',
): T[] {
  const copy = arr.slice();
  const multiplier = order === 'asc' ? 1 : -1;
  return copy.sort((a, b) => {
    const ka = keyFn(a);
    const kb = keyFn(b);
    if (ka < kb) return -1 * multiplier;
    if (ka > kb) return 1 * multiplier;
    return 0;
  });
}

/**
 * Return items present in both arrays.
 */
export function intersection<T>(a: readonly T[], b: readonly T[]): T[] {
  const setB = new Set(b);
  return [...new Set(a)].filter((item) => setB.has(item));
}

/**
 * Return items in `a` that are not in `b`.
 */
export function difference<T>(a: readonly T[], b: readonly T[]): T[] {
  const setB = new Set(b);
  return [...new Set(a)].filter((item) => !setB.has(item));
}

/**
 * Zip multiple arrays into an array of tuples.
 */
export function zip<T extends readonly (readonly unknown[])[]>(
  ...arrays: T
): unknown[][] {
  if (arrays.length === 0) return [];
  const len = Math.min(...arrays.map((a) => a.length));
  const result: unknown[][] = [];
  for (let i = 0; i < len; i++) {
    result.push(arrays.map((a) => a[i]));
  }
  return result;
}

/**
 * Unzip an array of tuples into separate arrays.
 */
export function unzip(tuples: readonly (readonly unknown[])[]): unknown[][] {
  if (tuples.length === 0) return [];
  const width = tuples[0].length;
  const result: unknown[][] = Array.from({ length: width }, () => []);
  for (const tuple of tuples) {
    for (let i = 0; i < width; i++) {
      result[i].push(tuple[i]);
    }
  }
  return result;
}

/**
 * Generate an array of numbers in the given range.
 */
export function range(start: number, end: number, step: number = 1): number[] {
  if (step === 0) throw new RangeError('step must not be 0');
  if (!Number.isFinite(step)) throw new RangeError(`step must be finite, got ${step}`);
  const result: number[] = [];
  if (step > 0) {
    for (let i = start; i < end; i += step) result.push(i);
  } else {
    for (let i = start; i > end; i += step) result.push(i);
  }
  return result;
}

/**
 * Fisher-Yates shuffle. Returns a new shuffled array.
 */
export function shuffle<T>(arr: readonly T[]): T[] {
  const copy = arr.slice();
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

/**
 * Return random sample(s) from an array.
 */
export function sample<T>(arr: readonly T[]): T | undefined;
export function sample<T>(arr: readonly T[], n: number): T[];
export function sample<T>(arr: readonly T[], n?: number): T | undefined | T[] {
  if (arr.length === 0) return n !== undefined ? [] : undefined;
  if (n === undefined) {
    return arr[Math.floor(Math.random() * arr.length)];
  }
  const shuffled = shuffle(arr);
  return shuffled.slice(0, Math.max(0, n));
}

/**
 * Partition an array into two groups based on a predicate.
 */
export function partition<T>(
  arr: readonly T[],
  predicate: (item: T, index: number) => boolean,
): [T[], T[]] {
  const pass: T[] = [];
  const fail: T[] = [];
  for (let i = 0; i < arr.length; i++) {
    (predicate(arr[i], i) ? pass : fail).push(arr[i]);
  }
  return [pass, fail];
}

/**
 * Take the first `n` items from an array.
 */
export function take<T>(arr: readonly T[], n: number): T[] {
  return arr.slice(0, Math.max(0, n));
}

/**
 * Drop the first `n` items from an array.
 */
export function drop<T>(arr: readonly T[], n: number): T[] {
  return arr.slice(Math.max(0, n));
}
