// ─── Object ─────────────────────────────────────────────────────────────────

/**
 * Pick specific keys from an object.
 */
export function pick<T extends Record<string, unknown>, K extends keyof T>(
  obj: T,
  keys: readonly K[],
): Pick<T, K> {
  const result = {} as Pick<T, K>;
  for (const key of keys) {
    if (key in obj) {
      result[key] = obj[key];
    }
  }
  return result;
}

/**
 * Omit specific keys from an object.
 */
export function omit<T extends Record<string, unknown>, K extends keyof T>(
  obj: T,
  keys: readonly K[],
): Omit<T, K> {
  const keySet = new Set<string | number | symbol>(keys);
  const result = {} as Record<string, unknown>;
  for (const key of Object.keys(obj)) {
    if (!keySet.has(key)) {
      result[key] = obj[key];
    }
  }
  return result as Omit<T, K>;
}

/**
 * Deep merge objects. Later sources override earlier ones.
 */
export function merge<T extends Record<string, unknown>>(
  target: T,
  ...sources: Record<string, unknown>[]
): T {
  const result = { ...target } as Record<string, unknown>;
  for (const source of sources) {
    for (const key of Object.keys(source)) {
      const targetVal = result[key];
      const sourceVal = source[key];
      if (
        isPlainObj(targetVal) &&
        isPlainObj(sourceVal)
      ) {
        result[key] = merge(
          targetVal as Record<string, unknown>,
          sourceVal as Record<string, unknown>,
        );
      } else {
        result[key] = sourceVal;
      }
    }
  }
  return result as T;
}

function isPlainObj(v: unknown): v is Record<string, unknown> {
  return typeof v === 'object' && v !== null && !Array.isArray(v) && Object.getPrototypeOf(v) === Object.prototype;
}

/**
 * Get a value from an object by dot-separated path.
 */
export function get(obj: unknown, path: string, defaultValue?: unknown): unknown {
  const keys = path.split('.');
  let current: unknown = obj;
  for (const key of keys) {
    if (current === null || current === undefined) {
      return defaultValue;
    }
    current = (current as Record<string, unknown>)[key];
  }
  return current === undefined ? defaultValue : current;
}

/**
 * Immutably set a value at a dot-separated path.
 */
export function set<T extends Record<string, unknown>>(
  obj: T,
  path: string,
  value: unknown,
): T {
  const keys = path.split('.');

  const build = (current: Record<string, unknown>, idx: number): Record<string, unknown> => {
    const key = keys[idx];
    if (idx === keys.length - 1) {
      return { ...current, [key]: value };
    }
    const next = current[key];
    const child = isPlainObj(next) ? next : {};
    return { ...current, [key]: build(child as Record<string, unknown>, idx + 1) };
  };

  return build(obj, 0) as T;
}

/**
 * Transform object keys using a mapping function.
 */
export function mapKeys<T extends Record<string, unknown>>(
  obj: T,
  fn: (key: string, value: unknown) => string,
): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  for (const key of Object.keys(obj)) {
    result[fn(key, obj[key])] = obj[key];
  }
  return result;
}

/**
 * Transform object values using a mapping function.
 */
export function mapValues<T extends Record<string, unknown>, R>(
  obj: T,
  fn: (value: unknown, key: string) => R,
): Record<string, R> {
  const result: Record<string, R> = {};
  for (const key of Object.keys(obj)) {
    result[key] = fn(obj[key], key);
  }
  return result;
}

/**
 * Invert an object's keys and values.
 */
export function invert(obj: Record<string, string | number>): Record<string, string> {
  const result: Record<string, string> = {};
  for (const key of Object.keys(obj)) {
    result[String(obj[key])] = key;
  }
  return result;
}

/**
 * Check if a value is "empty" (null, undefined, empty string, empty array, empty object).
 */
export function isEmpty(value: unknown): boolean {
  if (value === null || value === undefined) return true;
  if (typeof value === 'string') return value.length === 0;
  if (Array.isArray(value)) return value.length === 0;
  if (typeof value === 'object') return Object.keys(value).length === 0;
  return false;
}

/**
 * Clone a value. Supports deep cloning for plain objects and arrays.
 */
export function clone<T>(value: T, deep: boolean = false): T {
  if (value === null || typeof value !== 'object') return value;
  if (Array.isArray(value)) {
    return (deep ? value.map((v) => clone(v, true)) : [...value]) as T;
  }
  if (isPlainObj(value)) {
    if (deep) {
      const result: Record<string, unknown> = {};
      for (const key of Object.keys(value)) {
        result[key] = clone((value as Record<string, unknown>)[key], true);
      }
      return result as T;
    }
    return { ...value };
  }
  return value;
}
