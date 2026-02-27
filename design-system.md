# Design System — shadcn/ui + Tailwind v4

> **Single source of truth for all UI/design conventions.**
> For code conventions (naming, structure, git), see [`rules.md`](./rules.md).

---

## 1. Core Principles
**TL;DR:** Typography: 4 sizes, 2 weights. Spacing: 8pt grid (divisible by 8 or 4). Color: 60/30/10 rule.

## 2. Typography
**TL;DR:** Only 4 text sizes (Size 1: Large headings, Size 2: Subheadings, Size 3: Body, Size 4: Small). Only 2 font weights (`font-semibold` or `font-normal`).
- **DO NOT** use arbitrary sizes like `text-[17px]`. 
- **DO NOT** use `font-bold`, `font-light`, `font-medium`, `font-thin`.

## 3. Spacing — 8pt Grid
**TL;DR:** Every padding/margin/gap MUST be divisible by 8 or 4 (e.g., `p-4` is 16px, `gap-6` is 24px).
- **Valid:** 1(4px), 2(8px), 3(12px), 4(16px), 5(20px), 6(24px), 8(32px), 10(40px), 12(48px), 16(64px).
- **Exceptions:** `p-0`, `m-0`, `p-px` are allowed.
- **DO NOT** use arbitrary spacing values that break the grid (e.g., `p-[25px]`, `gap-[15px]`).

## 4. Color — 60/30/10 Rule
**TL;DR:** 60% neutral (`--background`, `--card`), 30% complementary (`--foreground`, `--muted`), 10% accent (`--primary`).
- **NEVER** hardcode colors (no `bg-red-500`). Use CSS variables from `globals.css` (e.g., `bg-background`, `text-foreground`).
- Variables must use OKLCH format: `--background: oklch(1 0 0);`.

## 5. Tailwind v4 Setup
**TL;DR:** Use `@import "tailwindcss"`. Colors use `oklch`. Register tokens via `@theme`.
- **globals.css**: `@import "tailwindcss";`, `:root { ... }`, `@theme { --color-background: var(--background); ... }`.
- **Class Order**: 1. Layout → 2. Sizing → 3. Spacing → 4. Typography → 5. Color → 6. Border → 7. Effects → 8. Transitions → 9. Responsive → 10. States.
- **DO NOT** use deprecated v3 utilities (e.g., `text-opacity-*`).

## 6. Component Architecture
**TL;DR:** Use shadcn/ui components first (`pnpm dlx shadcn-ui@latest add <component>`). Use CVA for variant styling.
- Modify downloaded shadcn components directly in `src/components/ui/`.
- **Forms**: Must use shadcn/ui Form, built on react-hook-form + Radix UI. Form spacing uses the 8pt grid (e.g., `space-y-6` between fields, `space-y-2` label to input).

## 7. Dark Mode
**TL;DR:** Works automatically if CSS variables are used.
- Define dark overrides in `.dark { ... }` in `globals.css` using OKLCH.
- Test contrast ratios in both light and dark modes.

## 8. Motion & Animation
**TL;DR:** Use transitions for state changes. Keep animations < 300ms.
- Respect `prefers-reduced-motion`.
- Do not animate just for decoration.

## 9. Accessibility
**TL;DR:** Preserve Radix UI's built-in keyboard navigation and focus management.
- Maintain WCAG 2.1 AA contrast ratios.
- Do not remove focus rings (`ring-*`). Use semantic HTML.

## 10. UI Code Review Checklist
**TL;DR:** Form components correctly implemented, Tailwind v4 rules followed, accessibility intact, 8pt grid applied, OKLCH CSS variables used without hardcoding.

---

## Quick Reference
```
TYPOGRAPHY   → 4 sizes only, 2 weights only (semibold + regular)
SPACING      → 8pt grid: every value divisible by 8 or 4
COLORS       → 60% neutral / 30% complementary / 10% accent
VARIABLES    → OKLCH format
COMPONENTS   → shadcn/ui first, CVA for variants
FORMS        → react-hook-form + zod + shadcn Form
CLASS ORDER  → layout → sizing → spacing → type → color → border → effects → states
```