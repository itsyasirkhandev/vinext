# Project Rules

> **Single source of truth for all code conventions.**
> Every contributor — human or AI — must read this before creating or modifying
> any file. All `GEMINI.md` files reference this. Never duplicate these rules elsewhere.
>
> For UI/design conventions (typography, spacing, colors, components), see
> [`design-system.md`](./design-system.md).

> For animation conventions (GSAP setup, hook patterns, naming, ScrollTrigger,
> performance, and motion tokens), see [`animations.md`](./animations.md).
---

## Table of Contents

1. [Folder Structure & Naming](#1-folder-structure--naming)
2. [Hybrid Folder Architecture](#2-hybrid-folder-architecture)
3. [Feature Module Rules](#3-feature-module-rules)
4. [File Naming](#4-file-naming)
5. [Component, Variable & Function Naming](#5-component-variable--function-naming)
6. [Code Documentation](#6-code-documentation)
7. [Imports](#7-imports)
8. [Styling & TypeScript](#8-styling--typescript)
9. [Git & Commits](#9-git--commits)
10. [Environment & Secrets](#10-environment--secrets)
11. [Testing](#11-testing)
12. [Animations](#12-animations)
13. [Forms](#13-forms)
14. [API Architecture](#14-api-architecture)
15. [Routing](#15-routing)

---

## 1. Folder Structure & Naming

> **TL;DR:** Lowercase plural folders (e.g., `components`), kebab-case for multi-word (e.g., `user-settings`).

- **Lowercase only** — never PascalCase or camelCase folders.
- **Plural** for collections — `components`, `hooks`, `services`, `utils`, `types`.
- **Kebab-case** for multi-word — `user-settings`, `order-history`.
- **Meaningful** — `auth`, `dashboard`, `products`. Never `folder1`, `misc`.

```
✅ components, hooks, features, user-settings
❌ Components, userSettings, folder1, MyServices
```

---

## 2. Hybrid Folder Architecture

> **TL;DR:** Feature code lives in `src/features/<name>/`. Shared/global code lives in `src/components/`, `src/hooks/`, `src/lib/`. Start local, promote to global when a 2nd feature needs it.

Combines **feature-based** (domain code) with **type-based** (shared code).

| Code Scope | Location | Example |
|------------|----------|---------|
| Used by **1 feature** | `src/features/<feature>/` | Login form, cart hook |
| Used by **2+ features** | `src/components/`, `src/hooks/`, etc. | Button, useDebounce |
| App infrastructure | `src/lib/`, `src/providers/`, `src/constants/` | apiClient, AuthProvider |

> **Rule**: Start inside a feature. Promote to global only when a second feature needs it.

### `src/` Structure

```
src/
├── app/                        # Next.js App Router (pages, layouts, API routes)
│   ├── (auth)/                 # Route groups
│   │   ├── login/page.tsx
│   │   └── register/page.tsx
│   ├── dashboard/
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── api/                    # API route handlers
│   ├── layout.tsx              # Root layout
│   └── providers.tsx           # Client providers wrapper
│
├── features/                   # Domain-specific, self-contained modules
│   ├── auth/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── services/
│   │   ├── types/
│   │   └── index.ts            # Public barrel export
│   ├── dashboard/
│   ├── products/
│   └── cart/
│
├── components/                 # Shared UI (used by 2+ features)
│   ├── ui/                     # Primitives: Button, Input, Modal
│   ├── layout/                 # Header, Footer, Sidebar
│   └── forms/                  # FormField, FormError
│
├── hooks/                      # Shared hooks (used by 2+ features)
├── lib/                        # Infra: apiClient, queryClient, cn, validators
├── services/                   # Shared API services (used by 2+ features)
├── stores/                     # Global state (Zustand/Redux/Jotai)
├── providers/                  # Context providers: Auth, Theme, Query
├── types/                      # Shared TypeScript types
├── constants/                  # Routes, query keys, app config
├── styles/                     # globals.css, tailwind.css
├── test/                       # Mocks, fixtures, test setup
│   ├── mocks/
│   ├── fixtures/
│   └── renderWithProviders.tsx
└── proxy.ts                    # Next.js proxy (replaces middleware)
```

> **Plain React (Vite/CRA)**: Replace `src/app/` with `src/pages/` or
> `src/routes/`. Use `src/App.tsx` as root. Everything else stays the same.

---

## 3. Feature Module Rules

> **TL;DR:** Import only from a feature's barrel `index.ts`. Never reach into feature internals. Pages must be thin (no business logic).

### Feature Anatomy

```
features/<feature-name>/
├── components/       # Feature-specific UI
├── hooks/            # Feature-specific hooks
├── services/         # Feature-specific API calls
├── utils/            # Feature-specific helpers
├── types/            # Feature-specific types
├── constants/        # Feature-specific constants (if needed)
├── schemas/          # Validation schemas (if needed)
└── index.ts          # Barrel export — the ONLY public API
```

> Only create sub-folders a feature actually needs.

### Barrel Export (`index.ts`)

Other code imports from a feature **only** through its barrel file:

```ts
// ✅ Good
import { LoginForm, useSession } from '@/features/auth';

// ❌ Bad — reaching into internals
import { LoginForm } from '@/features/auth/components/LoginForm';
```

### Feature Isolation

- Features **never** import from other features' internals — barrel only.
- Features **can** import from global shared folders and `packages/*`.
- If 2 features need the same thing → promote it to global.

### Thin Pages

Pages are **thin orchestrators**. No business logic, no API calls, no complex state.

```tsx
// ✅ Good — thin page
import { DashboardStats, RecentActivity } from '@/features/dashboard';

export default function DashboardPage() {
  return (
    <>
      <DashboardStats />
      <RecentActivity />
    </>
  );
}

// ❌ Bad — fat page with logic, fetch calls, useState
```

---

## 4. File Naming

> **TL;DR:** Components/Pages = `PascalCase.tsx`. Hooks/Utils = `camelCase.ts`. Types = `camelCase.types.ts`.


| File Type | Convention | Examples |
|-----------|-----------|----------|
| Components & Pages | **PascalCase** `.tsx` | `Header.tsx`, `LoginForm.tsx`, `UserProfile.tsx` |
| Hooks, services, utils | **camelCase** `.ts` | `useAuth.ts`, `authService.ts`, `formatDate.ts` |
| Type definitions | **camelCase** `.types.ts` | `auth.types.ts`, `product.types.ts` |
| Tests | Mirror source + `.test` | `authService.test.ts`, `LoginForm.test.tsx` |
| Barrel files | `index.ts` | Re-exports only — **never** put logic here |

---

## 5. Component, Variable & Function Naming

> **TL;DR:** Variables/hooks = `camelCase`. Booleans = `is/has/can/should`. Constants = `UPPER_SNAKE_CASE`. Type definitions = `PascalCase`.

### Components — PascalCase (must match file name)

```tsx
// File: LoginForm.tsx
export function LoginForm() { ... }   // ✅
export function loginForm() { ... }   // ❌
```

One primary component per file.

### Variables — camelCase

```ts
let userName = 'Yasir';           // ✅
let Total_Price = 99;             // ❌
```

**Booleans** → prefix with `is`, `has`, `can`, `should`:

```ts
let isLoading = true;             // ✅
let loading = true;               // ❌
```

**Constants** → `UPPER_SNAKE_CASE`:

```ts
const MAX_RETRIES = 3;            // ✅
const API_BASE_URL = '...';       // ✅
```

**Enums, Types, Interfaces** → PascalCase:

```ts
enum UserRole { Admin = 'ADMIN' }
type UserProfile = { ... };
interface AuthResponse { ... };
```

### Functions — camelCase, verb-first, descriptive

```ts
function getUserData() { ... }         // ✅ Service
function handleSubmit() { ... }        // ✅ Event handler (handle* or on*)
function useAuth() { ... }             // ✅ Hook (use* prefix)
function calculateTotalPrice() { ... } // ✅ Descriptive

function doTask() { ... }             // ❌ Vague
function GetUserData() { ... }        // ❌ PascalCase = components only
```

---

## 6. Code Documentation

> **TL;DR:** Every new file needs a header comment. Exported functions need JSDoc comments.

### File Header — Required for Every New File

```ts
/*
 * File Name:     authService.ts
 * Description:   Handles authentication API calls: login, logout,
 *                token refresh, and session validation.
 * Author:        Yasir Khan
 * Created Date:  2025-02-21
 */
```

### Function Documentation — Required for All Exports

**Non-component functions:**

```ts
/*
 * Function Name: getUserData
 * Description:   Fetches user profile by unique ID.
 * Parameters:    userId (string) — The user's unique ID.
 * Returns:       Promise<UserProfile>
 */
export async function getUserData(userId: string): Promise<UserProfile> { ... }
```

**Components (document props):**

```tsx
/*
 * Component Name: UserCard
 * Description:    Displays user avatar, name, and role in a card.
 * Props:
 *   - user (UserProfile)   — User object to display.
 *   - isCompact (boolean)  — Renders condensed version if true.
 *   - onEdit (() => void)  — Callback when edit is clicked.
 */
export function UserCard({ user, isCompact, onEdit }: UserCardProps) { ... }
```

### Inline Comments

- Write **why**, not what. The code shows what.
- Remove `TODO` / `FIXME` before merging to main.

---

## 7. Imports

> **TL;DR:** 4-block order (external, global `@/`, feature barrels, relative). Use `@/` alias. Cross-feature imports via `index.ts` only.

### Order (4 groups, blank line between each)

```ts
// 1. External packages
import React from 'react';
import { useQuery } from '@tanstack/react-query';

// 2. Global shared code (@/ alias)
import { Button } from '@/components/ui';
import { apiClient } from '@/lib/apiClient';

// 3. Feature imports (barrel only)
import { useSession } from '@/features/auth';

// 4. Relative imports
import { UserAvatar } from './UserAvatar';
```

### Rules

- Use `@/` alias for anything more than one directory up. Never `../../../`.
- Cross-feature imports go through barrel `index.ts` only.
- No circular imports — use a shared module if two modules need each other.

---

## 8. Styling & TypeScript

> **TL;DR:** Use Prettier + ESLint. TypeScript `strict: true`. UI must follow 8pt grid and use CSS variables for colors. No arbitrary Tailwind values.

### Formatting

- **Prettier** for formatting. **ESLint** for code quality.
- 2-space indentation, single quotes (JS/TS), double quotes (JSX attributes).
- Trailing commas (ES5), max 100 chars (soft) / 120 (hard).

### TypeScript

- `strict: true` — no exceptions.
- No `any` unless justified with an inline comment. Prefer `unknown`.
- Exported functions must have explicit parameter and return types.

### UI & Design System

> **All UI styling, spacing, color, typography, and component rules are in
> [`design-system.md`](./design-system.md).** Read it before building any
> user-facing UI.
>
> Key rules enforced:
> - 4 font sizes, 2 weights — nothing else
> - 8pt grid spacing — every value divisible by 8 or 4
> - 60/30/10 color rule — use CSS variables, never hardcode
> - shadcn/ui components first — don't rebuild what exists
> - Tailwind v4 conventions — `@theme`, OKLCH, `@import "tailwindcss"`
> - Tailwind class order — layout → sizing → spacing → type → color → effects → states
> - Accessibility — preserve Radix behavior, WCAG AA contrast, keyboard nav

### Tailwind Class Usage (Quick Rules)

```
✅ DO: Use Tailwind utility classes for all styling
✅ DO: Use CSS variables from globals.css (bg-background, text-foreground)
✅ DO: Use shadcn/ui components from src/components/ui/

❌ DON'T: Use inline styles
❌ DON'T: Hardcode colors (no bg-red-500 — use bg-destructive)
❌ DON'T: Use arbitrary spacing that breaks 8pt grid (no p-[25px])
❌ DON'T: Write custom CSS when a Tailwind utility exists
❌ DON'T: Build custom UI when shadcn/ui has the component
```

> For complete design system rules, component patterns, CVA variants,
> dark mode, animation, and the full UI review checklist, see
> [`design-system.md`](./design-system.md).

---

## 9. Git & Commits

> **TL;DR:** Use conventional commits (`feat:`, `fix:`, `chore:`). Ensure all PR checks pass.

### Conventional Commits

```
<type>(<scope>): <short description>
```

| Type | Use |
|------|-----|
| `feat` | New feature |
| `fix` | Bug fix |
| `docs` | Documentation |
| `style` | Formatting only |
| `refactor` | No new feature, no fix |
| `test` | Tests |
| `chore` | Build, deps, tooling |

```
feat(auth): add Google OAuth login
fix(cart): prevent negative quantity
refactor(products): extract validation to shared schema
```

### Branches

```
feat/google-oauth
fix/cart-negative-quantity
chore/upgrade-react-19
```

### PR Rules

- Reference issue/ticket number.
- ≥ 1 approval required.
- All CI checks pass. Squash-merge to main.

---

## 10. Environment & Secrets

> **TL;DR:** Never commit `.env` or secrets. Use `NEXT_PUBLIC_` for client vars. Update `.env.example`.

- **Never** commit API keys, tokens, or passwords.
- `.env.example` (committed, dummy values) → `.env` / `.env.local` (gitignored).
- `UPPER_SNAKE_CASE` for all env vars.
- Client-exposed vars: prefix with `NEXT_PUBLIC_` (Next.js) or `VITE_` (Vite).
- Never log PII in production.

---

## 11. Testing

> **TL;DR:** Colocate test files next to source (`Component.test.tsx`). Target 80% coverage. Mock external APIs.

- **Unit tests**: colocated — `LoginForm.test.tsx` next to `LoginForm.tsx`.
- **Integration**: `tests/integration/**`
- **E2E**: `tests/e2e/**`
- Use `describe`/`it` with natural-language descriptions.
- Target ≥ 80% coverage (≥ 90% for auth, payments, data mutations).
- Mock external APIs in `src/test/mocks/`. Never call real APIs in tests.
- Use `src/test/renderWithProviders.tsx` for component tests needing providers.

## 12. Animations

> **TL;DR:** All animation rules are in `animations-guide.md`. Import gsap from `@/lib/gsapConfig`, use `useGSAP` with `{ scope: containerRef }`, prefix targets with `anim-`.

> **Full reference:** [`animations-guide.md`](./animations-guide.md)

### Animation Quick Rules

```
✅ DO: Import from @/lib/gsapConfig
✅ DO: Use useGSAP with scope for all animations
✅ DO: Prefix all GSAP target classes with anim-
✅ DO: Use gsap.matchMedia() for responsive animations
✅ DO: Use tokens from animationTokens.ts
✅ DO: Respect prefers-reduced-motion in every hook
✅ DO: Animate x, y, scale, opacity, autoAlpha only
✅ DO: Extract animation logic into dedicated hooks

❌ DON'T: Import gsap directly from "gsap" in components
❌ DON'T: Use useEffect for GSAP code
❌ DON'T: Skip { scope: containerRef }
❌ DON'T: Hardcode duration, ease, or stagger values
❌ DON'T: Target Tailwind utility classes with GSAP
❌ DON'T: Animate layout properties (top, left, width, height)
❌ DON'T: Commit markers: true or timeScale overrides
❌ DON'T: Put raw GSAP calls inside component JSX (except hover micro-animations)
```

> For the complete animation system — setup, folder structure, all patterns, ScrollTrigger, gsap.matchMedia(), gsap.set(), debugging tools, and the full animation review checklist, see [`animations-guide.md`](./animations-guide.md).

---

## 13. Forms

> **TL;DR:** Use `react-hook-form` with `@hookform/resolvers/zod` and shadcn/ui `Form` components. Form schemas go in `schemas/`.
> This ensures consistent validation, type safety, and accessible form UI.

### Required Stack

| Library | Purpose |
|---------|---------|
| `react-hook-form` | Form state management, validation, submission |
| `@hookform/resolvers` | Zod schema integration |
| `zod` | Schema-based validation with TypeScript inference |
| `shadcn/ui Form` | Accessible form components built on Radix UI |

### Installation

```bash
pnpm add react-hook-form @hookform/resolvers zod
pnpm dlx shadcn-ui@latest add form
```

### Form Pattern Summary

Forms should look generally like this (abstracted):

```tsx
'use client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';

// 1. Zod schema
const schema = z.object({ email: z.string().email() });

export function MyForm() {
  // 2. Initialize
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: { email: '' },
  });

  // 3. Render
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(console.log)} className="space-y-6">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl><Input {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}
```

### Form Rules

```
✅ DO: Define Zod schema BEFORE the component
✅ DO: Use z.infer to derive types from schemas
✅ DO: Use zodResolver to connect schema to useForm
✅ DO: Use shadcn Form components (Form, FormField, FormItem, etc.)
✅ DO: Spread {...field} from render prop onto input components
✅ DO: Use FormMessage for validation errors — never custom error UI
✅ DO: Set defaultValues for all fields to avoid uncontrolled warnings
✅ DO: Extract schemas to a separate file for complex forms (schemas/ folder)

❌ DON'T: Use controlled inputs without react-hook-form
❌ DON'T: Manage form state with useState
❌ DON'T: Write custom validation logic — use Zod schemas
❌ DON'T: Skip FormMessage — users need validation feedback
❌ DON'T: Hardcode error messages in components — define in schema
❌ DON'T: Use native form validation (noValidate on form is fine)
```

### Schema Location

| Form Complexity | Location |
|-----------------|----------|
| Simple (1-2 fields) | Same file as component |
| Medium (3-6 fields) | Separate `schemas/` folder in feature |
| Complex / Shared | `src/features/<feature>/schemas/` or `src/lib/schemas/` |

### Common Zod Patterns

```ts
// Required string
name: z.string().min(1, 'Name is required');

// Email validation
email: z.string().email('Invalid email address');

// Password with requirements
password: z
  .string()
  .min(8, 'Must be at least 8 characters')
  .regex(/[A-Z]/, 'Must contain uppercase letter')
  .regex(/[0-9]/, 'Must contain number');

// Optional field
bio: z.string().optional();

// Number from string input
age: z.coerce.number().min(18, 'Must be 18 or older');

// Date
birthDate: z.date({ required_error: 'Birth date is required' });

// Enum
role: z.enum(['admin', 'user', 'guest'], {
  required_error: 'Please select a role',
});

// Conditional validation
password: z.string().min(8),
confirmPassword: z.string(),
.refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

// Array
tags: z.array(z.string()).min(1, 'Select at least one tag');
```

### Form Components to Add

```bash
# Core form component
pnpm dlx shadcn-ui@latest add form

# Common form inputs
pnpm dlx shadcn-ui@latest add input
pnpm dlx shadcn-ui@latest add select
pnpm dlx shadcn-ui@latest add checkbox
pnpm dlx shadcn-ui@latest add radio-group
pnpm dlx shadcn-ui@latest add textarea
pnpm dlx shadcn-ui@latest add switch
pnpm dlx shadcn-ui@latest add calendar popover  # For date pickers
```

### Accessibility Notes

- shadcn Form components use Radix UI primitives
- Labels are properly associated with inputs
- Error messages are announced to screen readers
- Required fields are indicated (add `*` to label text)
- Focus management is handled automatically

> For form UI patterns, validation UX, and styling, see
> [`design-system.md`](./design-system.md) § 6 Component Architecture.

---

## 14. API Architecture

> **TL;DR:** All HTTP calls route through `lib/apiClient.ts`. No URLs in code—use `constants/endpoints.ts`. Services handle fetching, components catch errors with `handleApiError()`.

> This ensures consistent headers, auth token injection, error handling,
> and typed responses across the entire application.

### 6-Layer Flow

```
.env (NEXT_PUBLIC_API_BASE_URL)
  → constants/endpoints.ts (all route paths as constants)
    → types/api.types.ts (shared response/error shapes)
      → lib/apiClient.ts (base fetch wrapper — single entry point)
        → features/<name>/services/<name>Service.ts (feature API calls)
          → features/<name>/components/... (UI consumes the service)
```

### File Placement

| File | Location | Scope |
|------|----------|-------|
| API base URL | `.env.local` | Server + client |
| Endpoint paths | `constants/endpoints.ts` | Global |
| Response / error types | `types/api.types.ts` | Global |
| Base HTTP client | `lib/apiClient.ts` | Global |
| Feature service | `features/<name>/services/<name>Service.ts` | Feature |
| Feature types | `features/<name>/types/<name>.types.ts` | Feature |

### Base Service (`lib/apiClient.ts`)

- Uses **native `fetch`** — works in RSC, client components, and edge.
- Typed methods: `get<T>`, `post<T>`, `put<T>`, `patch<T>`, `del<T>`.
- Auth token injected via `setAuthTokenGetter()` — decoupled from auth state.
- Throws typed `ApiError` on non-2xx responses.
- Supports Next.js `cache` and `next.revalidate` options via `RequestConfig`.

### Endpoint Constants (`constants/endpoints.ts`)

- **Every API path** lives here — never hardcode URLs in services or components.
- Static paths → string constants. Dynamic paths → functions returning strings.
- Group by domain: `AUTH`, `USERS`, `PRODUCTS`, etc.

```ts
// ✅ Good — import from endpoints
import { API_ENDPOINTS } from '@/constants/endpoints';
apiClient.get(API_ENDPOINTS.USERS.PROFILE);

// ❌ Bad — hardcoded URL
apiClient.get('/api/users/profile');
```

### Service Pattern

Services are thin wrappers around `apiClient`:

```ts
import { apiClient } from '@/lib/apiClient';
import { API_ENDPOINTS } from '@/constants/endpoints';

export async function login(data: LoginRequest) {
  return apiClient.post<AuthResponse>(API_ENDPOINTS.AUTH.LOGIN, data);
}
```

### Calling Services in Components

```tsx
try {
  const result = await login(data);
} catch (error) {
  // Use handleApiError to toast/extract ApiError instances
  handleApiError(error); 
}
```

### Error Handling

> **All API errors flow through `lib/apiErrorHandler.ts`.**
> Services **throw** → components **catch** → `handleApiError()` **toasts**.

#### Error Infrastructure

| File | Purpose |
|------|---------|
| `types/api.types.ts` — `ApiError` | Error class extending `Error` (typed `statusCode`, `errors`) |
| `types/api.types.ts` — `isApiError()` | Type-guard for safe narrowing in catch blocks |
| `lib/apiErrorHandler.ts` — `handleApiError()` | Shows toast + returns typed `ApiError` for further handling |
| `lib/apiErrorHandler.ts` — `getApiErrorMessage()` | Resolves error → user-friendly string (no toast) |
| `lib/apiErrorHandler.ts` — `getValidationErrors()` | Flattens server field errors for form mapping |

#### Service Pattern — Throw

Services are thin and do **not** catch errors. Let `apiClient` throw `ApiError`.

#### Component Pattern — Catch & Toast

```tsx
import { handleApiError } from '@/lib/apiErrorHandler';
import { toast } from 'sonner';

// In a component context (e.g. form submission):
try {
    await login(values);
    toast.success('Logged in!');
} catch (error) {
    handleApiError(error, 'Login failed');
    // If validation errors: const fieldErrors = getValidationErrors(apiError);
}
```

### API Architecture Rules

```
✅ DO: Route ALL HTTP calls through apiClient — never use raw fetch in features
✅ DO: Define every endpoint path in constants/endpoints.ts
✅ DO: Use typed ApiResponse<T> and ApiError for all returns/catches
✅ DO: Keep services as thin functions — one function per API call
✅ DO: Export services through the feature barrel (index.ts)
✅ DO: Define feature-specific types in features/<name>/types/
✅ DO: Use handleApiError() in component catch blocks — never raw toast.error()
✅ DO: Use isApiError() type-guard for safe narrowing — never `as ApiError`

❌ DON'T: Hardcode API URLs in services or components
❌ DON'T: Call apiClient directly from components — go through a service
❌ DON'T: Import from feature internals — use barrel exports only
❌ DON'T: Put business logic in services — services only do HTTP calls
❌ DON'T: Use axios or other HTTP libraries — apiClient wraps native fetch
❌ DON'T: Skip error typing — always catch ApiError
❌ DON'T: Catch errors in services — let them propagate to components
❌ DON'T: Show toast.error() directly — use handleApiError() instead
```

---

## 15. Routing

> **TL;DR:** Put path strings in `constants/routes.ts`. Use Next.js route groups `(group)/` for domain splits. Each group should have a `loading.tsx` shell.

> **All client-side route paths live in `constants/routes.ts`.**
> This ensures consistent navigation, avoids typos, and makes refactoring safe.

### Route Constants (`constants/routes.ts`)

- **Every route path** lives here — never hardcode URL strings in components.
- Static paths → string constants. Dynamic paths → functions returning strings.
- Group by domain: `AUTH`, `DASHBOARD`, `MARKETING`, etc.

```ts
// ✅ Good — import from routes
import { ROUTES } from '@/constants/routes';
<Link href={ROUTES.DASHBOARD.ROOT}>Dashboard</Link>

// ❌ Bad — hardcoded URL
<Link href="/dashboard">Dashboard</Link>
```

### Feature-Based Route Groups

Use parenthesized route groups `(groupName)/` to organize routes by domain.
Each group has its own layout, loading skeleton, and error boundary:

| Group | Purpose | Shell Component | Layout Path |
|-------|---------|-----------------|-------------|
| `(auth)` | Login, register, forgot password | Minimal centered | `app/(auth)/layout.tsx` |
| `(dashboard)` | Authenticated admin area | `AppShell` | `app/(dashboard)/layout.tsx` |
| `(marketing)` | Public-facing pages | `MarketingShell` | `app/(marketing)/layout.tsx` |

> Route groups use parentheses `()` so they **don't** affect the URL path.
> `app/(auth)/login/page.tsx` → URL: `/login` (not `/auth/login`).

### Lazy Loading (`loading.tsx`)

Each route group has a `loading.tsx` that acts as a Suspense fallback.
This is the App Router's **native** lazy loading mechanism.

```
app/
├── loading.tsx                    # Root fallback (spinner)
├── (auth)/
│   ├── layout.tsx                 # Centered card wrapper
│   ├── loading.tsx                # Auth skeleton
│   └── login/page.tsx
├── (dashboard)/
│   ├── layout.tsx                 # AppShell sidebar + header
│   ├── loading.tsx                # Dashboard skeleton
│   └── dashboard/page.tsx
└── (marketing)/
    ├── layout.tsx                 # MarketingShell header + footer
    ├── loading.tsx                # Marketing skeleton
    └── about/page.tsx
```

### Shell Components

Reusable layout wrappers used by route group layouts:

| Component | Path | Used By |
|-----------|------|---------|
| `AppShell` | `components/layout/AppShell.tsx` | `(dashboard)` layout |
| `MarketingShell` | `components/layout/MarketingShell.tsx` | `(marketing)` layout |

### Routing Rules

```
✅ DO: Import all route paths from constants/routes.ts
✅ DO: Use route groups (parenthesized) for domain-based grouping
✅ DO: Create loading.tsx in every route group for lazy loading
✅ DO: Keep pages thin — delegate to feature components
✅ DO: Use shell components for shared layout (sidebar, header, footer)
✅ DO: Create error.tsx per route group for granular error handling

❌ DON'T: Hardcode route strings in components — use ROUTES constants
❌ DON'T: Put business logic in layout or loading files
❌ DON'T: Use React.lazy() or next/dynamic for route-level lazy loading
❌ DON'T: Nest route groups deeper than 1 level
❌ DON'T: Skip loading.tsx — every group should have a skeleton
```

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
STYLING      → Tailwind utilities only, CSS vars, 8pt grid, 60/30/10 color
COMPONENTS   → shadcn/ui first, CVA variants, Radix for behavior
FORMS        → react-hook-form + zodResolver + shadcn Form components
API          → apiClient only, endpoints.ts for paths, services per feature, barrel exports
ROUTING      → constants/routes.ts for paths, route groups for domains, loading.tsx for lazy loading
COMMITS      → type(scope): description
FILE HEADER  → Every new file, ISO date, specific description
DESIGN       → See design-system.md for full UI rules
ANIMATIONS   → See animations-guide.md — anim- prefix, useGSAP + scope, tokens only, matchMedia
```

---

> **AI Agents**: Read this entire file before creating or modifying code.
> Follow § 2-3 when adding features. Follow § 4-6 when creating files.
> Follow § 8 + `design-system.md` when building UI. Follow § 9 when committing.

*Last updated: <!-- DATE --> · Maintainer: <!-- NAME -->*