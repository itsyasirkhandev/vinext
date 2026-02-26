# Design System — shadcn/ui + Tailwind v4

> **Single source of truth for all UI/design conventions.**
> Every `GEMINI.md` file references this. Never duplicate these rules elsewhere.
> For code conventions (naming, structure, git), see [`rules.md`](./rules.md).

---

## Table of Contents

1. [Core Principles](#1-core-principles)
2. [Typography](#2-typography)
3. [Spacing — 8pt Grid](#3-spacing--8pt-grid)
4. [Color — 60/30/10 Rule](#4-color--603010-rule)
5. [Tailwind v4 Setup](#5-tailwind-v4-setup)
6. [Component Architecture](#6-component-architecture)
   - [Form Components](#form-components)
7. [Dark Mode](#7-dark-mode)
8. [Motion & Animation](#8-motion--animation)
9. [Accessibility](#9-accessibility)
10. [UI Code Review Checklist](#10-ui-code-review-checklist)

---

## 1. Core Principles

| Principle | Rule |
|-----------|------|
| **Typography** | 4 sizes, 2 weights — nothing else |
| **Spacing** | Every value divisible by 8 or 4 |
| **Color** | 60% neutral / 30% complementary / 10% accent |
| **Simplicity** | Clarity and function over flashiness |
| **Consistency** | Same patterns everywhere — no one-offs |

---

## 2. Typography

> **TL;DR:** Only 4 text sizes and 2 font weights (semibold or regular). No arbitrary sizes like `text-[17px]`.

### 4 Sizes Only

| Token | Purpose | Example Use |
|-------|---------|-------------|
| Size 1 | Large headings | Page titles, hero text |
| Size 2 | Subheadings | Section headers, card titles |
| Size 3 | Body text | Paragraphs, descriptions, form labels |
| Size 4 | Small text | Captions, helper text, badges |

### 2 Weights Only

| Weight | Use |
|--------|-----|
| **Semibold** (`font-semibold`) | Headings, emphasis, labels |
| **Regular** (`font-normal`) | Body text, descriptions, UI content |

### Rules

```
✅ DO: Pick from the 4 sizes. Use semibold or regular.
✅ DO: Use monospace for numerical/tabular data when appropriate.
❌ DON'T: Introduce a 5th size or a 3rd weight.
❌ DON'T: Use font-bold, font-light, font-medium, font-thin, font-black.
❌ DON'T: Use arbitrary font sizes like text-[17px].
```

---

## 3. Spacing — 8pt Grid

> **TL;DR:** Every padding/margin/gap MUST be divisible by 8 or 4. (e.g., `p-4` is 16px, `gap-6` is 24px).

**Every spacing value MUST be divisible by 8 or 4.**

### Allowed Tailwind Values

```
Divisible by 8:  p-2(8px)  p-4(16px)  p-6(24px)  p-8(32px)  p-10(40px)  p-12(48px)
Divisible by 4:  p-1(4px)  p-3(12px)  p-5(20px)  p-7(28px)  p-9(36px)   p-11(44px)
```

### Mapping

| Tailwind Class | Pixels | Divisible by |
|---------------|--------|-------------|
| `1` | 4px | 4 |
| `2` | 8px | 8 |
| `3` | 12px | 4 |
| `4` | 16px | 8 |
| `5` | 20px | 4 |
| `6` | 24px | 8 |
| `8` | 32px | 8 |
| `10` | 40px | 8 |
| `12` | 48px | 8 |
| `16` | 64px | 8 |

### Rules

```
✅ DO: p-4 (16px), gap-6 (24px), m-8 (32px), space-y-4 (16px)
❌ DON'T: p-[25px], m-[11px], gap-[15px], p-[7px]
❌ DON'T: Use arbitrary spacing values that break the 8/4 grid
```

> **Exception**: `p-0`, `m-0`, `p-px` (1px for borders) are allowed.

---

## 4. Color — 60/30/10 Rule

> **TL;DR:** 60% neutral, 30% complementary, 10% accent. Never hardcode colors (`bg-red-500`); use CSS variables from `globals.css` in OKLCH format.

### Distribution

| Percentage | Role | Typical Use | CSS Variable |
|-----------|------|-------------|-------------|
| **60%** | Neutral | Backgrounds, cards, containers | `--background`, `--card` |
| **30%** | Complementary | Text, icons, subtle borders | `--foreground`, `--muted-foreground` |
| **10%** | Accent | CTA buttons, highlights, badges | `--primary`, `--accent` |

### Rules

```
✅ DO: Use CSS variables from globals.css — bg-background, text-foreground, bg-primary
✅ DO: Reserve accent/primary for actionable elements (buttons, links, indicators)
✅ DO: Maintain sufficient contrast between text and background

❌ DON'T: Hardcode colors — no bg-red-500, text-blue-600
❌ DON'T: Overuse accent colors (more than ~10% of visible area)
❌ DON'T: Use more than 1 primary accent color in a single view
❌ DON'T: Use colors not defined in the theme variables
```

### Color Variables (globals.css)

```css
:root {
  --background: oklch(1 0 0);
  --foreground: oklch(0.145 0 0);
  --card: oklch(1 0 0);
  --card-foreground: oklch(0.145 0 0);
  --primary: oklch(0.205 0 0);
  --primary-foreground: oklch(0.985 0 0);
  --secondary: oklch(0.97 0 0);
  --secondary-foreground: oklch(0.205 0 0);
  --muted: oklch(0.97 0 0);
  --muted-foreground: oklch(0.556 0 0);
  --accent: oklch(0.97 0 0);
  --accent-foreground: oklch(0.205 0 0);
  --destructive: oklch(0.577 0.245 27.325);
  --border: oklch(0.922 0 0);
  --input: oklch(0.922 0 0);
  --ring: oklch(0.708 0 0);
  --chart-1: /* ... */;
  --chart-2: /* ... */;
  --chart-3: /* ... */;
  --chart-4: /* ... */;
  --chart-5: /* ... */;
}
```

> Use OKLCH format for all colors. Better perceptual uniformity than HSL.

---

## 5. Tailwind v4 Setup

> **TL;DR:** Use `@import "tailwindcss"`. Colors use `oklch`. Register tokens via `@theme`.

### CSS Entry Point (globals.css)

```css
@import "tailwindcss";

@custom-variant dark (&:is(.dark *));

:root {
  /* color variables here (see § 4) */
}

.dark {
  /* dark mode overrides */
}

@theme {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-primary: var(--primary);
  --color-primary-foreground: var(--primary-foreground);
  --color-secondary: var(--secondary);
  --color-secondary-foreground: var(--secondary-foreground);
  --color-muted: var(--muted);
  --color-muted-foreground: var(--muted-foreground);
  --color-accent: var(--accent);
  --color-accent-foreground: var(--accent-foreground);
  --color-destructive: var(--destructive);
  --color-border: var(--border);
  --color-input: var(--input);
  --color-ring: var(--ring);
  /* chart colors, radius, fonts, etc. */
}
```

### Key Differences from v3

| v3 (Old) | v4 (Current) |
|----------|-------------|
| `@tailwind base; @tailwind components; @tailwind utilities;` | `@import "tailwindcss";` |
| `@layer base { :root { ... } }` | `@theme { ... }` for token registration |
| HSL color format `0 0% 100%` | OKLCH format `oklch(1 0 0)` |
| `tailwind.config.ts` content array | Automatic content detection (Oxide engine) |
| Plugin for container queries | Built-in `@container`, `@min-*`, `@max-*` |
| `text-opacity-*` | Deprecated — use color with alpha directly |

### Tailwind Class Organization

Apply classes in this order within an element:

```
1. Layout       → flex, grid, block, hidden, relative, absolute
2. Sizing       → w-*, h-*, min-w-*, max-w-*
3. Spacing      → p-*, m-*, gap-*, space-*
4. Typography   → text-*, font-*, leading-*, tracking-*
5. Color        → bg-*, text-*, border-*
6. Border       → border, rounded-*, ring-*
7. Effects      → shadow-*, opacity-*
8. Transitions  → transition-*, duration-*, ease-*
9. Responsive   → sm:, md:, lg:, xl:
10. States      → hover:, focus:, active:, disabled:, dark:
```

### Rules

```
✅ DO: Use @import "tailwindcss" (not @tailwind directives)
✅ DO: Define design tokens with @theme directive
✅ DO: Use @utility for custom utilities in CSS
✅ DO: Use @source only when auto-detection misses files
✅ DO: Use container queries (@container) for component-level responsiveness
✅ DO: Use data-* attribute variants (data-current:opacity-100)

❌ DON'T: Use tailwind.config.ts content array (auto-detected now)
❌ DON'T: Use @layer base for theme variables (use @theme)
❌ DON'T: Use HSL format for colors (use OKLCH)
❌ DON'T: Use deprecated v3 utilities (text-opacity-*, etc.)
❌ DON'T: Write custom CSS when a Tailwind utility exists
❌ DON'T: Use inline styles — always Tailwind classes
```

---

## 6. Component Architecture

> **TL;DR:** Use shadcn/ui components first. Modify them as needed. Use CVA for variant styling.

### shadcn/ui Structure

```
2-Layer Architecture:
┌─────────────────────────────┐
│  Style Layer (Tailwind CSS) │  ← You modify this
├─────────────────────────────┤
│  Behavior Layer (Radix UI)  │  ← Handles a11y, keyboard, focus
└─────────────────────────────┘
```

### Adding Components

```bash
# CLI (recommended)
pnpm dlx shadcn-ui@latest add button
pnpm dlx shadcn-ui@latest add card
pnpm dlx shadcn-ui@latest add dialog

# Components install to: src/components/ui/
```

### Component Customization Rules

```
✅ DO: Modify shadcn components directly — they are YOUR code after install
✅ DO: Use Class Variance Authority (CVA) for variant styling
✅ DO: Use the data-slot attribute for styling component sub-parts
✅ DO: Use "new-york" style (default for new projects)
✅ DO: Keep components in src/components/ui/

❌ DON'T: Override Radix primitives' accessibility behavior
❌ DON'T: Remove data-slot attributes from components
❌ DON'T: Create custom components when shadcn/ui has one available
❌ DON'T: Mix shadcn components with other UI libraries
```

### Variant Pattern (CVA)

```tsx
import { cva } from 'class-variance-authority';

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-md font-semibold transition-colors',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90',
        destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
        outline: 'border border-input bg-background hover:bg-accent',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
      },
      size: {
        default: 'h-10 px-4',    // 40px height, 16px horizontal padding
        sm: 'h-8 px-3',          // 32px height, 12px padding
        lg: 'h-12 px-6',         // 48px height, 24px padding
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);
```

> Notice: all sizing values follow the 8pt grid (32, 40, 48, 12, 16, 24).

### components.json Configuration

```json
{
  "style": "new-york",
  "rsc": true,
  "tailwind": {
    "config": "",
    "css": "app/globals.css",
    "baseColor": "neutral",
    "cssVariables": true
  },
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils"
  }
}
```

### Form Components

> **TL;DR:** Full form implementation rules and code patterns are in **`rules.md` § 13**.

Forms must use **shadcn/ui Form** components, built on **react-hook-form** and **Radix UI**.

**Form Spacing Guidelines (8pt grid):**

| Element | Spacing |
|---------|---------|
| Between form fields | `space-y-6` (24px) |
| Label to input | `space-y-2` (8px) |
| Description to error | `space-y-1` (4px) |
| Form buttons | `pt-4` (16px top padding) |

**Form Input Sizing:**

| Input Size | Height | Classes |
|------------|--------|---------|
| Default | 40px | `h-10 text-[size-3]` |
| Small | 32px | `h-8 text-[size-4]` |
| Large | 48px | `h-12 text-[size-3]` |

---

## 7. Dark Mode

### Implementation

```css
/* In globals.css */
@custom-variant dark (&:is(.dark *));

.dark {
  --background: oklch(0.145 0 0);
  --foreground: oklch(0.985 0 0);
  --card: oklch(0.145 0 0);
  --card-foreground: oklch(0.985 0 0);
  --primary: oklch(0.922 0 0);
  --primary-foreground: oklch(0.205 0 0);
  /* ... all overrides */
}
```

### Rules

```
✅ DO: Use CSS variables for all colors — dark mode works automatically
✅ DO: Test contrast ratios in both light and dark modes
✅ DO: Use dark: variant for dark-mode-specific adjustments when needed

❌ DON'T: Hardcode light-mode colors — they won't adapt to dark mode
❌ DON'T: Forget to define dark mode values for custom variables
```

---

## 8. Motion & Animation

### Rules

```
✅ DO: Use transitions for state changes (hover, focus, open/close)
✅ DO: Keep animations under 300ms for UI interactions
✅ DO: Use consistent easing — ease-in-out for most, ease-out for entrances
✅ DO: Use Tailwind transition utilities (transition-colors, transition-all)
✅ DO: Respect prefers-reduced-motion

❌ DON'T: Animate for decoration — every animation must serve a purpose
❌ DON'T: Use different animation patterns for similar interactions
❌ DON'T: Block user interaction during animations
```

---

## 9. Accessibility

### Rules

```
✅ DO: Preserve Radix UI's built-in keyboard navigation and focus management
✅ DO: Maintain WCAG 2.1 AA contrast ratios (4.5:1 text, 3:1 large text)
✅ DO: Use semantic HTML elements (button, nav, main, section, article)
✅ DO: Add aria-label to icon-only buttons
✅ DO: Use sr-only class for screen-reader-only text
✅ DO: Test with keyboard navigation (Tab, Enter, Escape, Arrow keys)

❌ DON'T: Remove focus ring styles (ring-* utilities)
❌ DON'T: Use div/span for interactive elements — use button/a
❌ DON'T: Rely on color alone to convey information
```

---

## 10. UI Code Review Checklist

### Typography
- [ ] Uses only 4 font sizes (no arbitrary sizes)
- [ ] Uses only 2 weights: semibold and regular
- [ ] Clear visual hierarchy across the page

### Spacing
- [ ] All spacing values divisible by 8 or 4
- [ ] No arbitrary spacing values (`p-[25px]`, `m-[11px]`)
- [ ] Consistent gaps between related elements

### Color
- [ ] Follows 60/30/10 distribution
- [ ] Uses CSS variables only — no hardcoded colors
- [ ] Accent color used sparingly (≤ 10%)
- [ ] Sufficient contrast in both light and dark modes

### Components
- [ ] Uses shadcn/ui components where available
- [ ] CVA used for variant styling
- [ ] data-slot attributes preserved
- [ ] Components in `src/components/ui/`

### Forms
- [ ] Uses react-hook-form with zodResolver
- [ ] Uses shadcn Form components (Form, FormField, FormItem, etc.)
- [ ] Zod schema defined for validation
- [ ] Types inferred from Zod schema with z.infer
- [ ] FormMessage used for validation errors
- [ ] FormLabel on every field
- [ ] Spacing follows 8pt grid (space-y-6 between fields)

### Tailwind v4
- [ ] Uses `@import "tailwindcss"` (not v3 directives)
- [ ] Theme tokens in `@theme` directive
- [ ] OKLCH color format
- [ ] No deprecated v3 utilities
- [ ] Classes ordered: layout → sizing → spacing → typography → color → effects → states

### Accessibility
- [ ] Keyboard navigable
- [ ] Contrast ratios meet WCAG AA
- [ ] Semantic HTML used
- [ ] Focus rings visible
- [ ] Screen reader support (sr-only, aria-labels)

---

## Quick Reference

```
TYPOGRAPHY   → 4 sizes only, 2 weights only (semibold + regular)
SPACING      → 8pt grid: every value divisible by 8 or 4
COLORS       → 60% neutral / 30% complementary / 10% accent
VARIABLES    → OKLCH format, defined in :root, registered in @theme
COMPONENTS   → shadcn/ui first, CVA for variants, Radix for behavior
FORMS        → react-hook-form + zod + shadcn Form, 8pt spacing between fields
CLASS ORDER  → layout → sizing → spacing → type → color → border → effects → states
DARK MODE    → CSS variables + .dark class + @custom-variant
ANIMATION    → Purpose-driven, <300ms, consistent easing
A11Y         → Radix handles it — don't break it. Test keyboard + contrast.
```

---

*Last updated: <!-- DATE --> · Maintainer: <!-- NAME -->*