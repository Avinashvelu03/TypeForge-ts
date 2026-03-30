# Changelog

## [1.0.0] - 2026-03-31

### 🎉 Initial Release

#### Array (16 functions)
`chunk`, `compact`, `flatten`, `unique`, `groupBy`, `sortBy`, `intersection`, `difference`, `zip`, `unzip`, `range`, `shuffle`, `sample`, `partition`, `take`, `drop`

#### Object (10 functions)
`pick`, `omit`, `merge`, `get`, `set`, `mapKeys`, `mapValues`, `invert`, `isEmpty`, `clone`

#### String (8 functions)
`camelCase`, `snakeCase`, `kebabCase`, `pascalCase`, `capitalize`, `truncate`, `slugify`, `escapeHtml`

#### Function (6 functions)
`debounce`, `throttle`, `once`, `memoize`, `pipe`, `noop`

#### Promise (5 functions)
`sleep`, `pLimit`, `pRetry`, `pTimeout`, `pAll`

#### Guard (8 type guards)
`isString`, `isNumber`, `isNil`, `isPlainObject`, `isPromise`, `isDefined`, `isBoolean`, `isFunction`

#### Infrastructure
- Zero dependencies
- Dual ESM/CJS output with TypeScript declarations
- Sub-path exports for maximum tree-shaking
- 100% test coverage (147 tests)
- GitHub Actions CI (Node 18, 20, 22)
- Edge-runtime compatible
