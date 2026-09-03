# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

HabitTracker: a local-first, offline PWA habit tracker tool built specifically for e-ink/e-paper
tablets (Onyx Boox, etc.). No backend, no network calls for core features — all data lives in
IndexedDB via Dexie. The UI is intentionally minimal: high-contrast black/white, no animations or
transitions (e-ink displays ghost and lag on refresh), and a deliberately small feature set.

## Commands

```bash
npm run dev        # vite dev server on http://localhost:9001
npm run build       # tsc -b && vite build
npm run lint         # biome lint .
npm run format      # biome format --write .
npm run check       # biome check --write . (lint + format)
npm test            # vitest (watch mode)
npm run test:ui     # vitest --ui
npm run coverage    # vitest run --coverage
```

Run a single test file: `npx vitest run src/hooks/use-projects.hook.test.ts`
Run tests matching a name: `npx vitest run -t "creates a project"`

There is no separate typecheck script — `tsc -b` runs as part of `npm run build`.

Always use these commands directly rather than reimplementing what they do — `npm install` /
`npm ci` for dependencies, the `npm run <script>` commands above (as defined in `package.json`) for
build/lint/format/test, and `gh` for GitHub operations (PRs, issues, checks).

## Architecture

...

## Conventions

- **Filenames**: lowercase-kebab-case with a role suffix — `*.component.tsx` (+ matching
  `*.component.css`), `*.hook.ts`, `*.view.tsx`, each with a co-located `*.test.tsx`/`*.test.ts`.
- **JSDoc on all exported types, interfaces, and functions** — every prop, hook return field, and
  exported component/function has a `/** ... */` doc comment (see `button.component.tsx`,
  `use-projects.hook.ts`). Follow this pattern for new exports; don't skip it.
- Component prop interfaces are named `<Component>Props`; hook return types are named
  `Use<Hook>Return`.
- The `Button` component exposes fixed action variants as static properties (`Button.Cancel`,
  `Button.Create`, `Button.Delete`, `Button.Edit`, `Button.Open`, `Button.Add`, `Button.Move`,
  `Button.Detail`, `Button.Back`) instead of a single component with many boolean/variant props.
  Prefer extending this pattern (new static sub-component) over adding new conditional props to
  `Button` itself when introducing a new fixed action.
- IDs are `crypto.randomUUID()`; timestamps are `Date.now()` (Unix ms), stored as `createdAt` /
  `updatedAt` on both `Project` and `ProjectItem`.
- Biome (not ESLint/Prettier) enforces lint + format: 2-space indent, double quotes, semicolons,
  100-char line width, import organization on. Run `npm run check` before considering work done.

## E-ink UI constraints (non-negotiable for UI changes)

- No animations or CSS transitions — e-ink refresh causes visible ghosting/lag. `src/index.css`
  globally forces `transition: none; animation: none; scroll-behavior: auto;`; don't override this
  per-component.
- High-contrast black-and-white only (`#000000` / `#FFFFFF`), sharp borders, no gradients/shadows.
- Always build UI from the `epaper-components` custom elements (`<e-*>`) wrapped in
  `src/components/`, not raw HTML form controls — they carry the e-ink-appropriate styling and
  accessibility behavior.
- Keep the feature surface small and distraction-free — this is a deliberate design constraint, not
  a gap to fill. Don't add features/animations/polish beyond what's asked.

## Testing

- Vitest + Testing Library + jsdom, config in `vite.config.ts` (`test.environment: "jsdom"`,
  globals on).
- `src/setupTests.ts` is the global setup: loads `fake-indexeddb/auto` (so Dexie/IndexedDB work
  under jsdom) and polyfills `ElementInternals` form-association APIs, which jsdom lacks but the
  form-associated `epaper-components` custom elements (`e-input`, `e-textarea`, ...) require to mount.
- Every component/hook/view has a co-located test file; keep that 1:1 pairing for new code.
