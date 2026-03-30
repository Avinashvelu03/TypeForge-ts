# Contributing to TypeForge-ts

Thank you for your interest in contributing! 🎉

## Development Setup

```bash
git clone https://github.com/Avinashvelu03/TypeForge-ts.git
cd TypeForge-ts
npm install
```

## Commands

| Command | Description |
|---------|-------------|
| `npm test` | Run all tests |
| `npm run test:coverage` | Run tests with 100% coverage |
| `npm run test:watch` | Watch mode |
| `npm run build` | Build ESM + CJS + types |
| `npm run lint` | Run ESLint |
| `npm run typecheck` | Type check with tsc |

## Guidelines

### Code Quality
- All code must be written in TypeScript with strict mode.
- Maintain **100% test coverage** — every function must include tests.
- No external dependencies — TypeForge-ts is zero-dependency by design.
- All functions must be tree-shakable.

### Adding a New Function
1. Add the function to the appropriate module (e.g., `src/array/array.ts`).
2. Export it from the module's `index.ts` barrel file.
3. Add comprehensive tests in `tests/<module>.test.ts`.
4. Ensure `npm run test:coverage` still shows 100%.
5. Update the README with usage examples.

### Pull Requests
1. Fork the repository and create a feature branch.
2. Write tests for any new functionality.
3. Ensure all checks pass:
   - `npm run test:coverage` — 100% coverage
   - `npm run build` — successful build
   - `npm run lint` — no lint errors
   - `npm run typecheck` — no type errors
4. Submit a pull request with a clear description.

### Commit Messages
Use conventional commit format:
- `feat: add new utility function`
- `fix: resolve edge case in chunk`
- `test: add coverage for debounce`
- `docs: update README`

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
