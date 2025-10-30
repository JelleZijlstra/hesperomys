# Repository Guidelines

## Project Structure & Module Organization

- Source: `src/`
  - `components/` UI primitives and utilities
  - `body/` page bodies for each model (e.g., NameBody, ArticleBody)
  - `lists/` paginated list views (generated).
  - `title/`, `subtitle/`, `reference/` display helpers
- GraphQL schema: `hesperomys.graphql`
- Generators: `make_paginators.py` (produces files in `src/lists/`)
- Generated Relay artifacts: `src/**/__generated__/`

## Build, Test, and Development Commands

- Install: `npm install` (or `yarn install`)
- Start dev server: `npm start`
- Relay codegen: `npm run relay` (ensure schema and fragments are current)
- Format: `pre-commit run --all-files` (or `npm run prettier`)

## Coding Style & Naming Conventions

- TypeScript + React. Prefer functional components; keep class components where
  established.
- Formatting is enforced by Prettier (via pre-commit). Do not hand‑wrap differently.
- Filenames: `PascalCase.tsx` for components; keep existing patterns for utilities.
- GraphQL: colocate fragments with components; alias fields to resolve union/nullability
  conflicts; avoid overfetching.

## Testing Guidelines

- None.

## Commit & Pull Request Guidelines

- Commits: imperative, scoped messages (e.g., `Add NameRerankings section`).

## Agent‑Specific Instructions

- Do not edit generated list components in `src/lists/` directly. Update
  `make_paginators.py` and re‑generate.
- After changing GraphQL fragments or schema usage, run Relay codegen to refresh
  `__generated__` types.
