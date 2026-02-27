# Project Rules

> **Single source of truth for all code conventions.**
> Every contributor — human or AI — must read this before creating or modifying any file.
> For UI/design conventions, see [`design-system.md`](./design-system.md).
> For animation conventions, see [`animations-guide.md`](./animations-guide.md).

---

## 1. Folder Structure
**TL;DR:** Lowercase plural folders (e.g., `components`), kebab-case for multi-word (e.g., `user-settings`). Never PascalCase or camelCase folders.

## 2. Hybrid Architecture
**TL;DR:** Feature code lives in `src/features/<name>/`. Shared/global code lives in `src/components/`, `src/hooks/`, `src/lib/`. Start local, promote to global when a 2nd feature needs it.

| Code Scope | Location |
|------------|----------|
| **1 feature** | `src/features/<feature>/` |
| **2+ features**| `src/components/`, `src/hooks/`, etc. |
| **App infra** | `src/lib/`, `src/providers/`, `src/constants/` |

**vinext Core**: Uses **vinext** (Vite-based Next.js). Use `npx vinext` for development.

## 3. Feature Module Rules
**TL;DR:** Import only from a feature's barrel `index.ts`. Never reach into feature internals. Pages must be thin (no business logic).
- **Isolation**: Features never import from other features' internals.
- **Thin Pages**: Pages are orchestrators without business logic, API calls, or complex state.

## 4. File Naming
**TL;DR:** Components/Pages = `PascalCase.tsx`. Hooks/Utils = `camelCase.ts`. Types = `camelCase.types.ts`.
- **Components & Pages**: `PascalCase.tsx`
- **Hooks, services, utils**: `camelCase.ts`
- **Type definitions**: `camelCase.types.ts`
- **Tests**: Mirror source + `.test.ts(x)`

## 5. Naming Conventions
**TL;DR:** Variables/hooks = `camelCase`. Booleans = `is/has/can/should`. Constants = `UPPER_SNAKE_CASE`. Type definitions = `PascalCase`.
- **Components**: `PascalCase` (Component name must match filename).
- **Functions**: `camelCase`. Hooks use `use*`. Event handlers use `handle*` or `on*`.
- **Booleans**: Prefix with `is`, `has`, `can`, `should` (e.g., `isLoading`).
- **Constants**: `UPPER_SNAKE_CASE`.

## 6. Code Documentation
**TL;DR:** Every new file needs a header comment. Exported functions need JSDoc comments.
- **File Headers**: Include `File Name`, `Description`, `Author`, and `Created Date`.
- **JSDoc**: Exported functions and components need JSDoc comments detailing Description, Parameters/Props, and Returns.

## 7. Imports
**TL;DR:** 4-block order (external, global `@/`, feature barrels, relative). Use `@/` alias. Cross-feature imports via `index.ts` only.
1. External packages (e.g., `react`)
2. Global shared code via `@/` alias
3. Feature imports via barrel only
4. Relative imports
*Note: Always use `@/` for paths more than one directory up. No circular dependencies.*

## 8. Styling & TypeScript
**TL;DR:** Use Prettier + ESLint. TypeScript `strict: true`. UI must follow 8pt grid and use CSS variables for colors.
- **TypeScript**: `strict: true`. No `any` (prefer `unknown`). Explicit return/parameter types on exports.
- **Tailwind v4**: Use utility classes/CSS variables (e.g., `bg-background`). No arbitrary Tailwind spacing outside the 8pt grid.
- **shadcn/ui**: Prefer using existing components before building from scratch.

## 9. Git & Commits
**TL;DR:** Use conventional commits (`feat:`, `fix:`, `chore:`). Ensure all PR checks pass.
- **Commit Format**: `<type>(<scope>): <short description>`
- **Branch Names**: `feat/<name>`, `fix/<name>`, `chore/<name>`

## 10. Environment & Secrets
**TL;DR:** Never commit `.env` or secrets. Use `NEXT_PUBLIC_` for client vars. Update `.env.example`.
- Prefix client-exposed vars with `NEXT_PUBLIC_` (Next.js) or `VITE_` (Vite).
- `UPPER_SNAKE_CASE` for env vars.

## 11. Testing
**TL;DR:** Colocate test files next to source (`Component.test.tsx`). Target 80% coverage. Mock external APIs.

## 12. Animations
**TL;DR:** All animation rules are in `animations-guide.md`. Import gsap from `@/lib/gsapConfig`, use `useGSAP` with `{ scope: containerRef }`, prefix targets with `anim-`.

## 13. Forms
**TL;DR:** Use `react-hook-form` with `@hookform/resolvers/zod` and shadcn/ui `Form` components. Form schemas go in `schemas/`.
- **Validation**: Define Zod schemas before the component or in a `schemas/` folder. Use `z.infer` for types.
- **Implementation**: Set `defaultValues`. Use `<FormMessage />` for validation errors. Spread `{...field}` onto Radix primitives.

## 14. API Architecture
**TL;DR:** All HTTP calls route through `lib/apiClient.ts`. No URLs in code—use `constants/endpoints.ts`. Services handle fetching, components catch errors with `handleApiError()`.
- **6-Layer Flow**: `.env` → `constants/endpoints.ts` → `types/api.types.ts` → `lib/apiClient.ts` → `features/<name>/services/` → Components.
- **apiClient**: Native fetch wrapper. Use typed `ApiResponse<T>`.
- **Error Handling**: Services throw typed `ApiError`. Components catch it and use `handleApiError()` to display toasts.

## 15. Routing
**TL;DR:** Put path strings in `constants/routes.ts`. Use Next.js route groups `(group)/` for domain splits. Each group should have a `loading.tsx` shell.
- **Link Component**: **Always** use `import Link from 'vinext/shims/link'`. Do NOT use `next/link`.
- **Route Groups**: Use `(groupName)` to organize domains with specific layout shells.
- **Lazy Loading & Boundaries**: Provide `loading.tsx` per group. Use `error.tsx`, `not-found.tsx`, `forbidden.tsx`, and `unauthorized.tsx` for boundaries.

---

## Quick Reference
```
FOLDERS      → lowercase, plural, kebab-case multi-word
COMPONENTS   → PascalCase.tsx, name = export name
NON-COMP     → camelCase.ts (hooks, services, utils)
TYPES        → camelCase.types.ts, PascalCase names
VARIABLES    → camelCase; booleans: is/has/can/should
CONSTANTS    → UPPER_SNAKE_CASE
FUNCTIONS    → camelCase, verb-first; handlers: handle*/on*; hooks: use*
FEATURES     → src/features/<name>/, import from index.ts barrel only
SHARED       → src/components/, src/hooks/, src/lib/ — only if 2+ features need it
PAGES        → Thin orchestrators — no business logic
IMPORTS      → @/ alias, 4-group order, no circular deps, barrel-only cross-feature
STYLING      → Tailwind utilities only, CSS vars, 8pt grid
FORMS        → react-hook-form + zodResolver + shadcn Form components
API          → apiClient only, endpoints.ts for paths, handleApiError in components
ROUTING      → constants/routes.ts, vinext/shims/link, route groups (group), loading.tsx
```