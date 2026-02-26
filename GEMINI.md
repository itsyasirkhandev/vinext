# GEMINI.md — AI Agent Guidance

> **For AI coding agents working in this codebase.**
> This is your primary entry point. Read the Critical Rules for simple tasks, and use the Decision Tree to decide which child files to read for specific features.

---

## Project Snapshot

- **Type**: Single Next.js 16 frontend application (not a monorepo)
- **Tech**: Next.js 16 App Router, React 19, TypeScript 5, Tailwind v4, shadcn/ui, GSAP
- **Package Manager**: pnpm
- **Testing**: Vitest + @testing-library/react + jsdom
- **Formatting**: Prettier (`.prettierrc`) + ESLint
- **Structure**: Single app — feature modules live in `features/`.

---

## Critical Rules — Always Apply

> These rules apply to ALL tasks. You do NOT need to read child files for these.

### Naming
- Folders: `lowercase`, plural, kebab-case multi-word
- Components: `PascalCase.tsx` — name must match export
- Hooks/services/utils: `camelCase.ts`
- Constants: `UPPER_SNAKE_CASE`
- Booleans: prefix with `is`, `has`, `can`, `should`

### Structure
- Feature code → `features/<name>/`, import via barrel `index.ts` only
- Shared code (2+ features) → `components/`, `hooks/`, `lib/`
- Pages are thin orchestrators — no business logic

### Files
- Every new file needs a documentation header (Author, Date, Description)
- Exported functions need JSDoc-style comments
- `"use client"` only when necessary — Server Components by default

### TypeScript
- `strict: true`, no `any` (use `unknown`)
- Explicit parameter and return types on exports

### Imports
- `@/` alias for anything more than one directory up
- Order: external → global shared → feature barrels → relative
- Cross-feature imports: barrel `index.ts` only

### Styling
- CSS variables only (`bg-background`, not `bg-white`)
- 8pt grid spacing — all values divisible by 8 or 4
- shadcn/ui components first — don't rebuild what exists

---

## When to Read Child Files (Decision Tree)

| If your task involves... | Read this file | Focus on §§ |
|--------------------------|---------------|-------------|
| UI components / styling  | `design-system.md` | § 2-6 (typography, spacing, color, components) |
| GSAP Animations          | `animations-guide.md` | Entire file (107 lines) |
| Forms                    | `rules.md` § 13 + `design-system.md` § 6 | Form stack, patterns, spacing |
| API service/calls        | `rules.md` § 14 | 6-layer flow, service pattern |
| Routes/Pages             | `rules.md` § 15 | Route constants, groups, shells |
| `app/` Directory files   | `app/gemini.md` | File tree, key files, gotchas |
| Any other basic code task| This file is sufficient | — |

---

## rules.md — JIT Section Index

> Use this index to jump straight to the relevant `§` in `rules.md` without reading the whole file.

| §  | Title | What It Covers |
|----|-------|----------------|
| 1  | Folder Structure | Lowercase, plural, kebab-case rules |
| 2  | Hybrid Architecture | Feature-based vs type-based code placement |
| 3  | Feature Module Rules | Anatomy, barrel exports, isolation, thin pages |
| 4  | File Naming | PascalCase components, camelCase hooks, .test convention |
| 5  | Naming Conventions | Variables, booleans, constants, enums, functions |
| 6  | Code Documentation | File headers, function docs, inline comments |
| 7  | Imports | 4-group order, @/ alias, no circular deps |
| 8  | Styling & TypeScript | Prettier, ESLint, strict TS, Tailwind class order |
| 9  | Git & Commits | Conventional commits, branch naming, PR rules |
| 10 | Environment & Secrets | .env patterns, NEXT_PUBLIC_, never commit keys |
| 11 | Testing | Colocated tests, 80% coverage, mock setup |
| 12 | Animations | Short pointer to `animations-guide.md` |
| 13 | Forms | react-hook-form + zod + shadcn Form patterns |
| 14 | API Architecture | apiClient 6-layer flow, services, error handling |
| 15 | Routing | Route constants, groups, shells, lazy loading |

---

## UI Components & MCP Tools

### shadcn/ui Components

- **Always prefer shadcn/ui components** for building UI.
- Use the **shadcn MCP tools** to discover available components:
  - `get_project_registries` — Get configured registry names from `components.json`
  - `list_items_in_registries` — List all available components
  - `search_items_in_registries` — Search for specific components (fuzzy matching)
  - `view_items_in_registries` — View component details and source code
  - `get_item_examples_from_registries` — Find usage examples and demos
  - `get_add_command_for_items` — Get the CLI command to add components

### Documentation & Code Examples

- **Use the `ref_search_documentation` and `ref_read_url` MCP tools** for searching and reading documentation from the web.
- **Use the `web_search_exa`, `get_code_context_exa`, and `company_research_exa` MCP tools** for documentation, code examples, and research from the internet.

### Next.js Documentation (Local)

- **Next.js docs are available locally in `.next-docs/`** — ALWAYS use these first.
- **DO NOT search online for Next.js documentation.** The local docs in `.next-docs/` are the authoritative source for this project.
- The docs index is embedded in this file (see `<!-- NEXT-AGENTS-MD-START -->` section below).

---

## Development Workflow

### Dev Server

- **DO NOT run the dev server** (`pnpm dev`). The developer runs it themselves.
- **ALWAYS assume the dev server is running** at `http://localhost:3000`.

### Frontend Testing

- **DO NOT initialize or run `frontend-tester`** agent. The developer handles frontend testing manually.
- **Testing framework**: Vitest (`vitest.config.ts`) with `@testing-library/react` and `jsdom`.
- **Test structure**: `test/setup.ts` (global setup), `test/mocks/`, `test/fixtures/`.
- **Coverage threshold**: 80% (statements, branches, functions, lines).

### Proxy (replaces Middleware)

- In Next.js 16, `middleware.ts` is renamed to `proxy.ts`.
- The exported function is `proxy()` (not `middleware()`).
- See `.next-docs/01-app/03-api-reference/03-file-conventions/proxy.mdx` for full docs.

---

## Root Setup Commands

```bash
# Install dependencies
pnpm install

# Development server
pnpm dev

# Build for production
pnpm build

# Run tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run tests with coverage
pnpm test:coverage

# Lint
pnpm lint

# Fix lint errors
pnpm lint --fix

# Format code
pnpm format

# Check formatting
pnpm format:check

# Type check
npx tsc --noEmit
```

---

## Security & Secrets

- **Never** commit API keys, tokens, or passwords.
- `.env.example` (committed, dummy values) → `.env` / `.env.local` (gitignored).
- `UPPER_SNAKE_CASE` for all env vars.
- Client-exposed vars: prefix with `NEXT_PUBLIC_`.
- Never log PII in production.
- See `rules.md § 10` for full details.

---

## Quick-Find Index

**Quick-find commands:**

```bash
# Find all TypeScript/TSX files
find src -name "*.ts" -o -name "*.tsx"

# Find all animation hooks
find src -name "use*Animation.ts"

# Find GSAP imports (should all come from gsapConfig — violations if from "gsap" directly)
rg "from ['\"]gsap['\"]" src/

# Find all anim- prefixed classes
rg "anim-" src/ --type tsx

# Find markers left in ScrollTrigger (violation — never commit)
rg "markers: true" src/

# Find useEffect used for GSAP (violation — use useGSAP instead)
rg "useEffect" src/features --type ts | rg -v ".test."

# Find hardcoded animation values (violation — use tokens)
rg "duration: [0-9]" src/features

# Find hardcoded API URLs (violation — use constants/endpoints.ts)
rg "fetch\(" features/ lib/ --type ts | rg -v "apiClient"
```

---

## Definition of Done

Run this validation before submitting changes:

```bash
pnpm lint; if($?) { npx tsc --noEmit }; if($?) { pnpm test }; if($?) { pnpm build }
```

**Checklist:**
- [ ] Code follows all rules in [`rules.md`](./rules.md)
- [ ] UI follows all rules in [`design-system.md`](./design-system.md) (if UI-facing)
- [ ] Animations follow all rules in [`animations-guide.md`](./animations-guide.md) (if animation-facing)
- [ ] New files have required documentation headers
- [ ] Commits follow Conventional Commits format
- [ ] No secrets or PII in the diff
- [ ] All CI checks pass: `pnpm lint && npx tsc --noEmit && pnpm test && pnpm build`
- [ ] Code is formatted: `pnpm format:check`
- [ ] No `markers: true`, `timeScale`, `seek()`, or `console.log` committed in animation files

---

<!-- NEXT-AGENTS-MD-START -->[Next.js Docs Index]|root: ./.next-docs|STOP. What you remember about Next.js is WRONG for this project. Always search docs and read before any task.|If docs missing, run this command first: npx @next/codemod agents-md --output GEMINI.md|01-app:{04-glossary.mdx}|01-app/01-getting-started:{01-installation.mdx,02-project-structure.mdx,03-layouts-and-pages.mdx,04-linking-and-navigating.mdx,05-server-and-client-components.mdx,06-cache-components.mdx,07-fetching-data.mdx,08-updating-data.mdx,09-caching-and-revalidating.mdx,10-error-handling.mdx,11-css.mdx,12-images.mdx,13-fonts.mdx,14-metadata-and-og-images.mdx,15-route-handlers.mdx,16-proxy.mdx,17-deploying.mdx,18-upgrading.mdx}|01-app/02-guides:{analytics.mdx,authentication.mdx,backend-for-frontend.mdx,caching.mdx,ci-build-caching.mdx,content-security-policy.mdx,css-in-js.mdx,custom-server.mdx,data-security.mdx,debugging.mdx,draft-mode.mdx,environment-variables.mdx,forms.mdx,incremental-static-regeneration.mdx,instrumentation.mdx,internationalization.mdx,json-ld.mdx,lazy-loading.mdx,local-development.mdx,mcp.mdx,mdx.mdx,memory-usage.mdx,multi-tenant.mdx,multi-zones.mdx,open-telemetry.mdx,package-bundling.mdx,prefetching.mdx,production-checklist.mdx,progressive-web-apps.mdx,public-static-pages.mdx,redirecting.mdx,sass.mdx,scripts.mdx,self-hosting.mdx,single-page-applications.mdx,static-exports.mdx,tailwind-v3-css.mdx,third-party-libraries.mdx,videos.mdx}|01-app/02-guides/migrating:{app-router-migration.mdx,from-create-react-app.mdx,from-vite.mdx}|01-app/02-guides/testing:{cypress.mdx,jest.mdx,playwright.mdx,vitest.mdx}|01-app/02-guides/upgrading:{codemods.mdx,version-14.mdx,version-15.mdx,version-16.mdx}|01-app/03-api-reference:{07-edge.mdx,08-turbopack.mdx}|01-app/03-api-reference/01-directives:{use-cache-private.mdx,use-cache-remote.mdx,use-cache.mdx,use-client.mdx,use-server.mdx}|01-app/03-api-reference/02-components:{font.mdx,form.mdx,image.mdx,link.mdx,script.mdx}|01-app/03-api-reference/03-file-conventions/01-metadata:{app-icons.mdx,manifest.mdx,opengraph-image.mdx,robots.mdx,sitemap.mdx}|01-app/03-api-reference/03-file-conventions:{default.mdx,dynamic-routes.mdx,error.mdx,forbidden.mdx,instrumentation-client.mdx,instrumentation.mdx,intercepting-routes.mdx,layout.mdx,loading.mdx,mdx-components.mdx,not-found.mdx,page.mdx,parallel-routes.mdx,proxy.mdx,public-folder.mdx,route-groups.mdx,route-segment-config.mdx,route.mdx,src-folder.mdx,template.mdx,unauthorized.mdx}|01-app/03-api-reference/04-functions:{after.mdx,cacheLife.mdx,cacheTag.mdx,connection.mdx,cookies.mdx,draft-mode.mdx,fetch.mdx,forbidden.mdx,generate-image-metadata.mdx,generate-metadata.mdx,generate-sitemaps.mdx,generate-static-params.mdx,generate-viewport.mdx,headers.mdx,image-response.mdx,next-request.mdx,next-response.mdx,not-found.mdx,permanentRedirect.mdx,redirect.mdx,refresh.mdx,revalidatePath.mdx,revalidateTag.mdx,unauthorized.mdx,unstable_cache.mdx,unstable_noStore.mdx,unstable_rethrow.mdx,updateTag.mdx,use-link-status.mdx,use-params.mdx,use-pathname.mdx,use-report-web-vitals.mdx,use-router.mdx,use-search-params.mdx,use-selected-layout-segment.mdx,use-selected-layout-segments.mdx,userAgent.mdx}|01-app/03-api-reference/05-config/01-next-config-js:{adapterPath.mdx,allowedDevOrigins.mdx,appDir.mdx,assetPrefix.mdx,authInterrupts.mdx,basePath.mdx,browserDebugInfoInTerminal.mdx,cacheComponents.mdx,cacheHandlers.mdx,cacheLife.mdx,compress.mdx,crossOrigin.mdx,cssChunking.mdx,devIndicators.mdx,distDir.mdx,env.mdx,expireTime.mdx,exportPathMap.mdx,generateBuildId.mdx,generateEtags.mdx,headers.mdx,htmlLimitedBots.mdx,httpAgentOptions.mdx,images.mdx,incrementalCacheHandlerPath.mdx,inlineCss.mdx,isolatedDevBuild.mdx,logging.mdx,mdxRs.mdx,onDemandEntries.mdx,optimizePackageImports.mdx,output.mdx,pageExtensions.mdx,poweredByHeader.mdx,productionBrowserSourceMaps.mdx,proxyClientMaxBodySize.mdx,reactCompiler.mdx,reactMaxHeadersLength.mdx,reactStrictMode.mdx,redirects.mdx,rewrites.mdx,sassOptions.mdx,serverActions.mdx,serverComponentsHmrCache.mdx,serverExternalPackages.mdx,staleTimes.mdx,staticGeneration.mdx,taint.mdx,trailingSlash.mdx,transpilePackages.mdx,turbopack.mdx,turbopackFileSystemCache.mdx,typedRoutes.mdx,typescript.mdx,urlImports.mdx,useLightningcss.mdx,viewTransition.mdx,webVitalsAttribution.mdx,webpack.mdx}|01-app/03-api-reference/05-config:{02-typescript.mdx,03-eslint.mdx}|01-app/03-api-reference/06-cli:{create-next-app.mdx,next.mdx}|02-pages/01-getting-started:{01-installation.mdx,02-project-structure.mdx,04-images.mdx,05-fonts.mdx,06-css.mdx,11-deploying.mdx}|02-pages/02-guides:{analytics.mdx,authentication.mdx,babel.mdx,ci-build-caching.mdx,content-security-policy.mdx,css-in-js.mdx,custom-server.mdx,debugging.mdx,draft-mode.mdx,environment-variables.mdx,forms.mdx,incremental-static-regeneration.mdx,instrumentation.mdx,internationalization.mdx,lazy-loading.mdx,mdx.mdx,multi-zones.mdx,open-telemetry.mdx,package-bundling.mdx,post-css.mdx,preview-mode.mdx,production-checklist.mdx,redirecting.mdx,sass.mdx,scripts.mdx,self-hosting.mdx,static-exports.mdx,tailwind-v3-css.mdx,third-party-libraries.mdx}|02-pages/02-guides/migrating:{app-router-migration.mdx,from-create-react-app.mdx,from-vite.mdx}|02-pages/02-guides/testing:{cypress.mdx,jest.mdx,playwright.mdx,vitest.mdx}|02-pages/02-guides/upgrading:{codemods.mdx,version-10.mdx,version-11.mdx,version-12.mdx,version-13.mdx,version-14.mdx,version-9.mdx}|02-pages/03-building-your-application/01-routing:{01-pages-and-layouts.mdx,02-dynamic-routes.mdx,03-linking-and-navigating.mdx,05-custom-app.mdx,06-custom-document.mdx,07-api-routes.mdx,08-custom-error.mdx}|02-pages/03-building-your-application/02-rendering:{01-server-side-rendering.mdx,02-static-site-generation.mdx,04-automatic-static-optimization.mdx,05-client-side-rendering.mdx}|02-pages/03-building-your-application/03-data-fetching:{01-get-static-props.mdx,02-get-static-paths.mdx,03-forms-and-mutations.mdx,03-get-server-side-props.mdx,05-client-side.mdx}|02-pages/03-building-your-application/06-configuring:{12-error-handling.mdx}|02-pages/04-api-reference:{06-edge.mdx,08-turbopack.mdx}|02-pages/04-api-reference/01-components:{font.mdx,form.mdx,head.mdx,image-legacy.mdx,image.mdx,link.mdx,script.mdx}|02-pages/04-api-reference/02-file-conventions:{instrumentation.mdx,proxy.mdx,public-folder.mdx,src-folder.mdx}|02-pages/04-api-reference/03-functions:{get-initial-props.mdx,get-server-side-props.mdx,get-static-paths.mdx,get-static-props.mdx,next-request.mdx,next-response.mdx,use-params.mdx,use-report-web-vitals.mdx,use-router.mdx,use-search-params.mdx,userAgent.mdx}|02-pages/04-api-reference/04-config/01-next-config-js:{adapterPath.mdx,allowedDevOrigins.mdx,assetPrefix.mdx,basePath.mdx,bundlePagesRouterDependencies.mdx,compress.mdx,crossOrigin.mdx,devIndicators.mdx,distDir.mdx,env.mdx,exportPathMap.mdx,generateBuildId.mdx,generateEtags.mdx,headers.mdx,httpAgentOptions.mdx,images.mdx,isolatedDevBuild.mdx,onDemandEntries.mdx,optimizePackageImports.mdx,output.mdx,pageExtensions.mdx,poweredByHeader.mdx,productionBrowserSourceMaps.mdx,proxyClientMaxBodySize.mdx,reactStrictMode.mdx,redirects.mdx,rewrites.mdx,serverExternalPackages.mdx,trailingSlash.mdx,transpilePackages.mdx,turbopack.mdx,typescript.mdx,urlImports.mdx,useLightningcss.mdx,webVitalsAttribution.mdx,webpack.mdx}|02-pages/04-api-reference/04-config:{01-typescript.mdx,02-eslint.mdx}|02-pages/04-api-reference/05-cli:{create-next-app.mdx,next.mdx}|03-architecture:{accessibility.mdx,fast-refresh.mdx,nextjs-compiler.mdx,supported-browsers.mdx}|04-community:{01-contribution-guide.mdx,02-rspack.mdx}<!-- NEXT-AGENTS-MD-END -->

*Last updated: 2026-02-26*
