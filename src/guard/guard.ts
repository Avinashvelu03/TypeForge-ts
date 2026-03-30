// ─── Guards ─────────────────────────────────────────────────────────────────

/** Type guard for string. */
export function isString(value: unknown): value is string {
  return typeof value === 'string';
}

/** Type guard for number (excludes NaN). */
export function isNumber(value: unknown): value is number {
  return typeof value === 'number' && !Number.isNaN(value);
}

/** Type guard for null or undefined. */
export function isNil(value: unknown): value is null | undefined {
  return value === null || value === undefined;
}

/** Type guard for plain objects (not arrays, Date, etc.). */
export function isPlainObject(value: unknown): value is Record<string, unknown> {
  if (typeof value !== 'object' || value === null) return false;
  const proto = Object.getPrototypeOf(value);
  return proto === Object.prototype || proto === null;
}

/** Type guard for Promise/thenable. */
export function isPromise(value: unknown): value is Promise<unknown> {
  return (
    value !== null &&
    typeof value === 'object' &&
    typeof (value as Record<string, unknown>).then === 'function'
  );
}

/** Type guard that excludes null and undefined. */
export function isDefined<T>(value: T | null | undefined): value is T {
  return value !== null && value !== undefined;
}

/** Type guard for boolean. */
export function isBoolean(value: unknown): value is boolean {
  return typeof value === 'boolean';
}

/** Type guard for function. */
export function isFunction(value: unknown): value is (...args: any[]) => any {
  return typeof value === 'function';
}
