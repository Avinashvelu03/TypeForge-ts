// ─── String ─────────────────────────────────────────────────────────────────

/**
 * Split a string into words (handles camelCase, snake_case, kebab-case, spaces).
 */
function words(str: string): string[] {
  return str
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/[_-]+/g, ' ')
    .replace(/[^\w\s]/g, '')
    .trim()
    .split(/\s+/)
    .filter(Boolean);
}

/** Convert a string to camelCase. */
export function camelCase(str: string): string {
  const w = words(str);
  if (w.length === 0) return '';
  return w[0].toLowerCase() + w.slice(1).map((s) => s.charAt(0).toUpperCase() + s.slice(1).toLowerCase()).join('');
}

/** Convert a string to snake_case. */
export function snakeCase(str: string): string {
  return words(str).map((s) => s.toLowerCase()).join('_');
}

/** Convert a string to kebab-case. */
export function kebabCase(str: string): string {
  return words(str).map((s) => s.toLowerCase()).join('-');
}

/** Convert a string to PascalCase. */
export function pascalCase(str: string): string {
  return words(str).map((s) => s.charAt(0).toUpperCase() + s.slice(1).toLowerCase()).join('');
}

/** Capitalize the first letter of a string. */
export function capitalize(str: string): string {
  if (str.length === 0) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/** Truncate a string to `maxLen` characters, appending `suffix` if truncated. */
export function truncate(str: string, maxLen: number, suffix: string = '...'): string {
  if (str.length <= maxLen) return str;
  return str.slice(0, maxLen - suffix.length) + suffix;
}

/** Convert a string to a URL-safe slug. */
export function slugify(str: string): string {
  // Step 1: lowercase and trim
  let slug = str.toLowerCase().trim();

  // Step 2: remove characters that are not word chars, spaces, or hyphens
  // Uses a simple character class with no nested quantifiers — O(n) safe
  slug = slug.replace(/[^\w\s-]/g, '');

  // Step 3: replace whitespace and underscores with a single hyphen each
  // Deliberately avoid /\s+/ or /-+/ quantifier chains that cause ReDoS
  slug = slug.replace(/\s/g, '-').replace(/_/g, '-');

  // Step 4: collapse consecutive hyphens using a possessive-style linear scan
  // Split on hyphens and rejoin — avoids /-+/g backtracking on long dash runs
  slug = slug.split('-').filter((part) => part.length > 0).join('-');

  return slug;
}

/** Escape HTML special characters to prevent XSS. */
export function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
