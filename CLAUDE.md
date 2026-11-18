# CLAUDE.md

Guidance for Claude Code in this repo: React + TS technical test using the JSONPlaceholder API.

## Source of truth
- Requirements and acceptance criteria live in `docs/SPEC.md`.
- Do not add features outside the spec. If something is ambiguous, ask.

## Stack
- Vite + React 19 + TypeScript.
- axios (single client in `src/api/client.ts`) + TanStack Query (`useQuery`/`useMutation`).
- Vitest + Testing Library + jsdom.
- Tailwind CSS v4 (`@tailwindcss/vite`); tokens and base styles in `src/index.css`. Do not add other libraries without asking.

## Commands
- `npm run dev`: dev server
- `npm run build`: type-check (`tsc -b`) + build
- `npm run lint`: ESLint
- `npm test`: Vitest

## Tooling
- React Compiler is enabled (see `vite.config.ts`). Avoid manual `useMemo`/`useCallback` unless needed. Do not remove the plugin when editing `vite.config.ts`.
- TS uses project references: `tsconfig.app.json` (src) and `tsconfig.node.json` (configs).
- ESLint uses the flat config in `eslint.config.js`.

## Structure
- `src/api`: HTTP calls with axios
- `src/types`: User, Post, NewPost
- `src/hooks`: useUsers, usePosts, useCreatePost
- `src/components`: Header, UserList, AuthorHeader, PostList, PostForm (dialog modal), StatusMessage
- `App.tsx`: layout and `selectedUserId` in `useState` (no Context or Redux)
- Tests next to the component: `Component.test.tsx`

## Workflow
- Implement one requirement (R1, R2...) at a time.
- Before coding, show a short plan and wait for my OK.
- Do not commit: I make the commits. When done, suggest a message (Conventional Commits).
- After each change, run `npm test`, `npm run lint` and `npx tsc -b`.
- Keep code simple and readable; no unnecessary abstractions.
- UI text in Spanish.

## Tests
- Mock `src/api`, not axios.
- Wrap components in a fresh QueryClient per test with `retry: false`.
- Name tests after the acceptance criterion: `it('AC1: ...')`.
- Prefer accessible queries: `getByRole`, `getByLabelText`.

## Design
- Styles use Tailwind (added on request); shared class strings live in `src/components/styles.ts`.
- Design "Classical" (MyEditorial): styles with Tailwind CSS v4 utility classes (theme tokens in `index.css`), Cormorant Garamond + Lora via Google Fonts in `index.html`; only simple animations (skeleton pulse, spinner, show more/less).
- Accessibility: sufficient contrast, labels on inputs, visible focus.
- The Classical redesign changed structure on purpose (modal form, two-screen mobile navigation, author header, toast).