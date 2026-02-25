# Next.js Frontend Template

A production-ready Next.js 16 frontend template with a comprehensive design system, animation infrastructure, and strict code conventions. Built for scalability, maintainability, and developer productivity.

## Tech Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| [Next.js](https://nextjs.org/) | 16.x | React framework with App Router |
| [React](https://react.dev/) | 19.x | UI library |
| [TypeScript](https://www.typescriptlang.org/) | 5.x | Type safety |
| [Tailwind CSS](https://tailwindcss.com/) | v4 | Utility-first styling |
| [shadcn/ui](https://ui.shadcn.com/) | Latest | Accessible component library |
| [GSAP](https://greensock.com/gsap/) | 3.x | Professional animations |
| [React Hook Form](https://react-hook-form.com/) | 7.x | Form state management |
| [Zod](https://zod.dev/) | 4.x | Schema validation |
| [pnpm](https://pnpm.io/) | Latest | Fast, disk-efficient package manager |

## Features

- **Modern Architecture**: Hybrid folder structure combining feature-based and type-based organization
- **Design System**: Enforced typography (4 sizes, 2 weights), 8pt grid spacing, and 60/30/10 color rule
- **Animation Infrastructure**: GSAP with `useGSAP` hook pattern, responsive animations via `matchMedia()`, and motion tokens
- **Component Library**: Pre-configured shadcn/ui with Radix UI primitives for accessibility
- **Form Handling**: React Hook Form + Zod integration with shadcn Form components
- **Type Safety**: Strict TypeScript with no `any` types
- **Dark Mode**: CSS variable-based theming with OKLCH color format

## Getting Started

### Prerequisites

- Node.js 18.x or later
- pnpm (recommended) or npm

### Installation

```bash
# Clone the repository
git clone https://github.com/itsyasirkhandev/nextjs_frontend_template.git
cd nextjs_frontend_template

# Install dependencies
pnpm install
```

### Development

```bash
# Start development server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build

```bash
# Production build
pnpm build

# Start production server
pnpm start
```

### Linting

```bash
# Run ESLint
pnpm lint

# Fix lint errors
pnpm lint --fix
```

## Project Structure

```
├── app/                    # Next.js App Router
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Home page
│   ├── globals.css         # Global styles + Tailwind v4 theme
│   └── agents.md           # App-specific AI agent guidance
│
├── components/             # Shared UI components
│   └── ui/                 # shadcn/ui components
│
├── features/               # Feature-based modules
│   └── <feature>/          # Self-contained feature
│       ├── components/     # Feature-specific components
│       ├── hooks/          # Feature-specific hooks
│       ├── services/       # Feature-specific API calls
│       ├── types/          # Feature-specific types
│       └── index.ts        # Barrel export
│
├── hooks/                  # Shared hooks (2+ features)
├── lib/                    # Infrastructure
│   ├── gsapConfig.ts       # GSAP setup + plugin registration
│   └── utils.ts            # Utility functions (cn, etc.)
│
├── constants/              # App constants
│   └── animationTokens.ts  # Duration, ease, stagger values
│
├── public/                 # Static assets
│
├── rules.md                # Code conventions (MUST READ)
├── design-system.md        # UI/design rules (MUST READ)
├── animations-guide.md     # GSAP animation rules (MUST READ)
└── AGENTS.md               # AI agent guidance
```

## Documentation

Before contributing, read these files in order:

1. **[`rules.md`](./rules.md)** — Code conventions, naming, folder structure, git commits, forms
2. **[`design-system.md`](./design-system.md)** — Typography, spacing, colors, components, accessibility
3. **[`animations-guide.md`](./animations-guide.md)** — GSAP setup, hooks, ScrollTrigger, responsive animations

## Adding Components

### shadcn/ui Components

```bash
# Add a component
pnpm dlx shadcn-ui@latest add button
pnpm dlx shadcn-ui@latest add card
pnpm dlx shadcn-ui@latest add form input select
```

Components install to `components/ui/`.

### Creating Features

```bash
# Create a new feature module
mkdir -p features/my-feature/{components,hooks,services,types}
touch features/my-feature/index.ts
```

Follow the [Feature Module Rules](./rules.md#3-feature-module-rules) for structure and barrel exports.

## Design System Quick Reference

| Rule | Details |
|------|---------|
| Typography | 4 sizes, 2 weights (semibold + regular only) |
| Spacing | 8pt grid — every value divisible by 8 or 4 |
| Colors | 60% neutral / 30% complementary / 10% accent |
| Components | shadcn/ui first — never rebuild what exists |
| Forms | react-hook-form + zodResolver + shadcn Form |
| Dark Mode | CSS variables + `.dark` class |

## Animation Quick Reference

| Rule | Details |
|------|---------|
| Import | Always from `@/lib/gsapConfig` — never from `"gsap"` |
| Hook | `useGSAP` with `{ scope: containerRef }` — never `useEffect` |
| Selectors | `anim-` prefix on all GSAP target classes |
| Tokens | Use values from `animationTokens.ts` — never hardcode |
| Responsive | `gsap.matchMedia()` required for breakpoint-specific animations |
| Accessibility | `prefers-reduced-motion` check in every animation hook |

## Code Style

- **Prettier** for formatting
- **ESLint** for code quality
- 2-space indentation
- Single quotes (JS/TS), double quotes (JSX attributes)
- Trailing commas (ES5)
- Max 100 chars (soft) / 120 (hard)

## Git Conventions

### Commit Format

```
<type>(<scope>): <description>
```

### Types

| Type | Use |
|------|-----|
| `feat` | New feature |
| `fix` | Bug fix |
| `docs` | Documentation |
| `style` | Formatting only |
| `refactor` | No new feature or fix |
| `test` | Tests |
| `chore` | Build, deps, tooling |

### Examples

```
feat(auth): add Google OAuth login
fix(cart): prevent negative quantity
refactor(products): extract validation to shared schema
```

## Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start development server |
| `pnpm build` | Production build |
| `pnpm start` | Start production server |
| `pnpm lint` | Run ESLint |
| `pnpm lint --fix` | Fix lint errors |

## Deployment

The easiest way to deploy is using the [Vercel Platform](https://vercel.com/new):

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme)

See the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more options.

## Learn More

- [Next.js Documentation](https://nextjs.org/docs) — features and API
- [Learn Next.js](https://nextjs.org/learn) — interactive tutorial
- [shadcn/ui Documentation](https://ui.shadcn.com/docs) — component library
- [GSAP Documentation](https://greensock.com/docs/) — animation library

## License

MIT License — feel free to use for personal and commercial projects.

---

*Last updated: 2026-02-25*