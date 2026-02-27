# app/gemini.md — vinext App Router

> **Package Identity**: **vinext** App Router application (Next.js 16 reimplementation on Vite).
> Optimized for **Cloudflare Workers** with 4x faster builds and 57% smaller bundles.
> Developed by Cloudflare to provide a seamless edge-native Next.js experience.

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
├── global-error.tsx      # Root layout error boundary (Client Component)
├── not-found.tsx         # Custom 404 page
├── forbidden.tsx         # 403 Forbidden page
├── unauthorized.tsx      # 401 Unauthorized page
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
| Root layout error | `app/global-error.tsx` |
| 404 page | `app/not-found.tsx` |
| 403 Forbidden | `app/forbidden.tsx` |
| 401 Unauthorized | `app/unauthorized.tsx` |
| Root loading | `app/loading.tsx` |
| Client providers | `app/providers.tsx` |

---

## vinext / Next.js Gotchas

- **Origins**: vinext is a clean-room rebuild of the Next.js API surface by Cloudflare. It is NOT a wrapper; it is a full reimplementation on Vite.
- **Routing Link Shim**: We use `vinext` instead of pure Next.js for Cloudflare edge deployment support. Due to TS type resolution with Vite, you **MUST** import the Next link component via `import Link from 'vinext/shims/link'` instead of `next/link`.
- **Proxy vs Middleware**: We use `proxy.ts`, NOT `middleware.ts`. The exported function is `proxy()`. This is better suited for the Cloudflare Workers execution model.
- **vinext CLI**: For compatibility checking, use `npx vinext check`. Standard commands are `vinext dev`, `vinext build`, `vinext start`, and `vinext deploy` (Cloudflare).
- **RSC Default**: Components are Server Components by default. Only add `"use client"` when you need hooks (`useGSAP`, `useState`) or browser APIs.
- **Client boundaries deep in tree**: When adding animations (which require "use client"), extract the animated code into a leaf component rather than making the whole page "use client".

---

*Last updated: 2026-02-27*
