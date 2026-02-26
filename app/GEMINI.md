# app/gemini.md — Next.js App Router

> **Package Identity**: Next.js 16 frontend application using App Router.
> Contains pages, layouts, API routes, and global styles.

---

## 🛑 STOP: Local Rules Only

> **This file only contains rules specific to the `app/` directory.**
> 
> General code rules (naming, structure, etc.) are in [`../rules.md`](../rules.md).
> UI/Tailwind rules are in [`../design-system.md`](../design-system.md).
> GSAP Animation rules are in [`../animations-guide.md`](../animations-guide.md).
> 
> **Do not add general rules here.**

---

## File Organization & Routing

```
app/
├── favicon.ico           # Site favicon
├── globals.css           # Tailwind v4 + OKLCH color variables
├── layout.tsx            # Root layout (Server Component)
├── page.tsx              # Home page (template overview)
├── error.tsx             # Global error boundary (Client Component)
├── not-found.tsx         # Custom 404 page
├── loading.tsx           # Root loading fallback (spinner)
├── providers.tsx         # Client providers wrapper
├── (auth)/               # Route group — auth pages
│   ├── layout.tsx        # Centered card wrapper
│   ├── loading.tsx       # Auth skeleton
│   ├── login/page.tsx
│   └── register/page.tsx
├── (dashboard)/          # Route group — authenticated area
│   ├── layout.tsx        # AppShell sidebar + header
│   ├── loading.tsx       # Dashboard skeleton
│   └── dashboard/
│       ├── page.tsx
│       └── settings/page.tsx
├── (marketing)/          # Route group — public pages
│   ├── layout.tsx        # MarketingShell header + footer
│   ├── loading.tsx       # Marketing skeleton
│   ├── about/page.tsx
│   └── pricing/page.tsx
└── api/                  # API route handlers
    └── users/route.ts
```

### Route Groups
Use `(folderName)` for route groups. This prevents `folderName` from appearing in the URL path. This allows us to share `layout.tsx` across a group of routes.

### Pages are Thin
Pages (`page.tsx`) must be **thin orchestrators**.
Extract all business logic, data fetching, and complex state into `src/features/`. Pages should mainly be basic server components returning nested components. See `rules.md § 3` for details.

---

## Key App Touchpoints

| Concern | File |
|---------|------|
| Global styles | `app/globals.css` |
| Root layout | `app/layout.tsx` |
| Home page | `app/page.tsx` |
| Error boundary | `app/error.tsx` |
| 404 page | `app/not-found.tsx` |
| Root loading | `app/loading.tsx` |
| Client providers | `app/providers.tsx` |

---

## Next.js Gotchas

- **Proxy vs Middleware**: We use `proxy.ts`, NOT `middleware.ts`. The exported function is `proxy()`.
- **RSC Default**: Components are Server Components by default. Only add `"use client"` when you need hooks (`useGSAP`, `useState`) or browser APIs.
- **Client boundaries deep in tree**: When adding animations (which require "use client"), extract the animated code into a leaf component rather than making the whole page "use client".

---

*Last updated: 2026-02-26*
