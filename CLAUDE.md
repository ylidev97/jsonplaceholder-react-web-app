# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm run dev` — Vite dev server
- `npm run build` — `tsc -b && vite build` (type-checks via project references, then bundles)
- `npm run lint` — ESLint (flat config in `eslint.config.js`)
- `npm test` — Vitest (watch mode by default; use `npx vitest run` for a single pass)
- Single test: `npx vitest run src/path/to/file.test.tsx` or `npx vitest run -t "test name"`

## Stack and setup notes

React 19 + TypeScript + Vite (rolldown-based), intended as a client for the JSONPlaceholder API. The project is at an early scaffold stage: `src/` holds only `main.tsx`, `App.tsx` and the template CSS.

- **React Compiler is enabled** through `@rolldown/plugin-babel` + `reactCompilerPreset()` in `vite.config.ts`. Avoid manual `useMemo`/`useCallback`/`React.memo` unless needed, and keep components pure so the compiler can optimize them.
- **Vitest config lives in `vite.config.ts`** (imports `defineConfig` from `vitest/config`), not a separate file. Tests run in `jsdom` with `globals: true`; `src/setupTests.js` loads `@testing-library/jest-dom`.
- **Dependencies not yet wired up:** the git history says TanStack Query was installed, but `@tanstack/react-query` is not in `package.json`. Tailwind v4 (`@tailwindcss/vite`) and axios are installed, but the Tailwind plugin isn't registered in `vite.config.ts` and `src/index.css` has no `@import "tailwindcss"`. Fix these when first using them.
- TypeScript is split across `tsconfig.app.json` (src) and `tsconfig.node.json` (config files), referenced from `tsconfig.json`.
