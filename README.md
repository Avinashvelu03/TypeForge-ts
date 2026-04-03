# TypeForge-ts ⚒️

> **Blazing-fast, zero-dependency TypeScript utility toolkit. The modern lodash replacement.**

[![npm version](https://img.shields.io/npm/v/typeforge-ts.svg)](https://www.npmjs.com/package/typeforge-ts)
[![npm downloads](https://img.shields.io/npm/dm/typeforge-ts.svg)](https://www.npmjs.com/package/typeforge-ts)
[![license](https://img.shields.io/npm/l/typeforge-ts.svg)](https://github.com/Avinashvelu03/TypeForge-ts/blob/main/LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7+-blue.svg)](https://www.typescriptlang.org/)
[![Coverage](https://img.shields.io/badge/coverage-100%25-brightgreen.svg)](https://github.com/Avinashvelu03/TypeForge-ts)
[![CI](https://github.com/Avinashvelu03/TypeForge-ts/actions/workflows/ci.yml/badge.svg)](https://github.com/Avinashvelu03/TypeForge-ts/actions/workflows/ci.yml)
[![Bundle Size](https://img.shields.io/badge/bundle-22.7kB-green.svg)](https://www.npmjs.com/package/typeforge-ts)
[![Node.js](https://img.shields.io/badge/node-%3E%3D18-brightgreen.svg)](https://nodejs.org/)

**53 utility functions** across 6 modules — with perfect TypeScript inference, tree-shaking, and edge compatibility. No dependencies. No bloat.

---

## ✨ Why TypeForge-ts?

| | **lodash** | **es-toolkit** | **TypeForge-ts** |
|---|:-:|:-:|:-:|
| TypeScript-first | ❌ | ✅ | ✅ |
| Zero dependencies | ❌ | ✅ | ✅ |
| Tree-shakable | ⚠️ partial | ✅ | ✅ |
| Sub-path exports | ❌ | ✅ | ✅ |
| Type guards | ❌ | ❌ | ✅ |
| Promise utilities | ❌ | ❌ | ✅ |
| Edge-runtime ready | ⚠️ | ✅ | ✅ |
| 100% test coverage | ❌ | ⚠️ | ✅ |

---

## 📦 Installation

```bash
npm install typeforge-ts
```

```bash
pnpm add typeforge-ts
```

```bash
yarn add typeforge-ts
```

## 🚀 Quick Start

```typescript
import { chunk, groupBy, camelCase, debounce, pLimit, isString } from 'typeforge-ts';

// Or import specific modules for maximum tree-shaking:
import { chunk, groupBy } from 'typeforge-ts/array';
import { pick, merge } from 'typeforge-ts/object';
import { camelCase, slugify } from 'typeforge-ts/string';
import { debounce, memoize } from 'typeforge-ts/function';
import { pLimit, pRetry } from 'typeforge-ts/promise';
import { isString, isNil } from 'typeforge-ts/guard';
```

---

## 📖 API Reference

### 🔢 Array — `typeforge-ts/array` (16 functions)

```typescript
chunk([1, 2, 3, 4, 5], 2)       // [[1, 2], [3, 4], [5]]
compact([0, 1, false, 2, ''])    // [1, 2]
flatten([1, [2, [3]]], 2)        // [1, 2, 3]
unique([1, 2, 2, 3])             // [1, 2, 3]
unique(users, u => u.id)         // Dedupe by key

groupBy([1, 2, 3, 4], n => n % 2 ? 'odd' : 'even')
// { odd: [1, 3], even: [2, 4] }

sortBy(users, u => u.name)       // Stable sort, ascending
sortBy(users, u => u.age, 'desc') // Descending

intersection([1, 2, 3], [2, 3, 4])  // [2, 3]
difference([1, 2, 3], [2, 3, 4])    // [1]
zip([1, 2], ['a', 'b'])             // [[1, 'a'], [2, 'b']]
unzip([[1, 'a'], [2, 'b']])         // [[1, 2], ['a', 'b']]
range(0, 5)                          // [0, 1, 2, 3, 4]
range(0, 10, 3)                      // [0, 3, 6, 9]
shuffle([1, 2, 3, 4, 5])            // Random order
sample([1, 2, 3])                    // Random element
sample([1, 2, 3], 2)                 // 2 random elements
partition([1, 2, 3, 4], n => n > 2)  // [[3, 4], [1, 2]]
take([1, 2, 3, 4], 2)               // [1, 2]
drop([1, 2, 3, 4], 2)               // [3, 4]
```

---

### 📦 Object — `typeforge-ts/object` (10 functions)

```typescript
pick({ a: 1, b: 2, c: 3 }, ['a', 'c'])  // { a: 1, c: 3 }
omit({ a: 1, b: 2, c: 3 }, ['b'])       // { a: 1, c: 3 }

merge({ a: { x: 1 } }, { a: { y: 2 } })
// { a: { x: 1, y: 2 } }  — deep merge!

get({ a: { b: { c: 42 } } }, 'a.b.c')           // 42
get({ a: 1 }, 'b.c', 'default')                  // 'default'
set({ a: { b: 1 } }, 'a.b', 2)                   // { a: { b: 2 } } — immutable

mapKeys({ a: 1, b: 2 }, k => k.toUpperCase())    // { A: 1, B: 2 }
mapValues({ a: 1, b: 2 }, v => v * 2)             // { a: 2, b: 4 }
invert({ a: '1', b: '2' })                        // { '1': 'a', '2': 'b' }

isEmpty(null)   // true
isEmpty('')     // true
isEmpty([])     // true
isEmpty({})     // true

clone({ a: { b: 1 } })          // Shallow clone
clone({ a: { b: 1 } }, true)    // Deep clone
```

---

### 🔤 String — `typeforge-ts/string` (8 functions)

```typescript
camelCase('hello_world')     // 'helloWorld'
snakeCase('helloWorld')      // 'hello_world'
kebabCase('helloWorld')      // 'hello-world'
pascalCase('hello_world')    // 'HelloWorld'
capitalize('hello')          // 'Hello'
truncate('Hello World!', 8)  // 'Hello...'
slugify('Hello World!')      // 'hello-world'
escapeHtml('<script>')       // '&lt;script&gt;'
```

---

### ⚡ Function — `typeforge-ts/function` (6 functions)

```typescript
// Debounce with cancel and flush
const search = debounce(fetchResults, 300);
search('query');
search.cancel();
search.flush();

// Debounce with leading execution
const save = debounce(persist, 1000, { leading: true });

// Throttle (max once per interval)
const scroll = throttle(handleScroll, 100);
scroll.cancel();

// Execute once
const init = once(expensiveSetup);
init(); // runs
init(); // returns cached result

// Memoize with cache control
const compute = memoize(heavyCalc);
compute(42);     // computes
compute(42);     // cached!
compute.clear(); // clear cache

// Pipe functions left-to-right
const transform = pipe(
  (x: number) => x + 1,
  (x: number) => x * 2,
  (x: number) => x.toString(),
);
transform(5); // '12'

noop(); // does nothing
```

---

### 🔄 Promise — `typeforge-ts/promise` (5 functions)

```typescript
await sleep(1000); // Wait 1 second

// Concurrency limiter
const limit = pLimit(5);
const results = await Promise.all(
  urls.map(url => limit(() => fetch(url))),
);

// Retry with delay
const data = await pRetry(() => fetchData(), {
  retries: 3,
  delay: 1000,
});

// Timeout wrapper
const result = await pTimeout(fetch('/api'), 5000);

// Parallel execution with concurrency
const allResults = await pAll(tasks, 3);
```

---

### 🛡️ Guard — `typeforge-ts/guard` (8 type guards)

```typescript
isString('hello')       // true — narrows to string
isNumber(42)            // true — excludes NaN!
isNil(null)             // true — null | undefined
isPlainObject({})       // true — excludes Date, Array, etc.
isPromise(p)            // true — checks for .then()
isDefined(value)        // true — excludes null & undefined
isBoolean(true)         // true
isFunction(() => {})    // true
```

---

## 🌳 Tree-Shaking

Import from sub-paths for minimal bundle size:

```typescript
// ✅ Only bundles chunk and groupBy (~200 bytes)
import { chunk, groupBy } from 'typeforge-ts/array';

// ⚠️ Bundles everything (~5 KB)
import { chunk, groupBy } from 'typeforge-ts';
```

---

## 📊 Complete Function List

| Module | Count | Functions |
|--------|:-----:|-----------|
| **Array** | 16 | `chunk` `compact` `flatten` `unique` `groupBy` `sortBy` `intersection` `difference` `zip` `unzip` `range` `shuffle` `sample` `partition` `take` `drop` |
| **Object** | 10 | `pick` `omit` `merge` `get` `set` `mapKeys` `mapValues` `invert` `isEmpty` `clone` |
| **String** | 8 | `camelCase` `snakeCase` `kebabCase` `pascalCase` `capitalize` `truncate` `slugify` `escapeHtml` |
| **Function** | 6 | `debounce` `throttle` `once` `memoize` `pipe` `noop` |
| **Promise** | 5 | `sleep` `pLimit` `pRetry` `pTimeout` `pAll` |
| **Guard** | 8 | `isString` `isNumber` `isNil` `isPlainObject` `isPromise` `isDefined` `isBoolean` `isFunction` |
| **Total** | **53** | |

---

## 🔧 Requirements

- **Node.js** ≥ 18.0.0
- **TypeScript** ≥ 5.0
- Works with **Bun**, **Deno**, **Cloudflare Workers**, **Vercel Edge**

## 🤝 Contributing

Contributions are welcome! Please see our [Contributing Guide](./CONTRIBUTING.md) for details.

```bash
git clone https://github.com/Avinashvelu03/TypeForge-ts.git
cd TypeForge-ts
npm install
npm test              # Run tests
npm run test:coverage # 100% coverage
npm run build         # Build ESM + CJS + types
```

## 📄 License

[MIT](./LICENSE) © [Avinash Velu](https://github.com/Avinashvelu03)

---

## ⚒️ Support TypeForge

TypeForge is independently built and completely free. If it's replaced lodash in your codebase or made your TypeScript cleaner, it would mean the world to get your support:

<div align="center">

> *"The best tools are the ones that just work — and don't cost you anything."*

[![Ko-fi](https://img.shields.io/badge/Ko--fi-Buy%20a%20coffee-FF5E5B?style=flat-square&logo=ko-fi&logoColor=white)](https://ko-fi.com/avinashvelu)
[![GitHub Sponsors](https://img.shields.io/badge/GitHub-Sponsor%20%E2%9D%A4-EA4AAA?style=flat-square&logo=github-sponsors&logoColor=white)](https://github.com/sponsors/Avinashvelu03)

</div>

**Other ways to help:**
- ⭐ **Star the repo** at [github.com/Avinashvelu03/TypeForge-ts](https://github.com/Avinashvelu03/TypeForge-ts)
- 🧑‍💻 Share with your TypeScript community — dev.to, Reddit, Discord
- 📋 Suggest utilities — what does lodash have that TypeForge should replace next?
