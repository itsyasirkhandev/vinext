# animations-guide.md — GSAP Full Reference

> This is the full animation rule set for human contributors and AI coding agents
> working directly on animation files.
>
> **If you are generating `agents.md` files**, read [`animations.md`](./animations.md)
> instead — it contains the section map and classification rules without the full detail.
>
> This project uses **GSAP** (`gsap` + `@gsap/react`) as the exclusive animation
> library. Do not introduce Framer Motion, anime.js, or any competing animation
> library without explicit architectural approval.
>
> All animation logic must comply with [`rules.md`](./rules.md)
> (naming, folder structure, TypeScript) and [`design-system.md`](./design-system.md)
> (motion tokens, easing, duration scale).

---

## Table of Contents

1. [Setup & Plugin Registration](#1-setup--plugin-registration)
2. [Folder Structure & File Placement](#2-folder-structure--file-placement)
3. [File & Variable Naming](#3-file--variable-naming)
4. [The useGSAP Hook — Next.js Rules](#4-the-usegsap-hook--nextjs-rules)
5. [Tween Rules — gsap.to / from / fromTo](#5-tween-rules--gsapto--from--fromto)
6. [gsap.set() + clearProps](#6-gsapset--clearprops)
7. [Timeline Rules](#7-timeline-rules)
8. [Stagger Rules](#8-stagger-rules)
9. [ScrollTrigger Rules](#9-scrolltrigger-rules)
10. [gsap.matchMedia() — Responsive Animations](#10-gsapmatchmedia--responsive-animations)
11. [gsap.utils — The Utility Toolkit](#11-gsaputils--the-utility-toolkit)
12. [useGSAP Dependencies Array — Reactive Animations](#12-usegsap-dependencies-array--reactive-animations)
13. [ScrollTrigger.refresh() + markers — Next.js Gotchas](#13-scrolltriggerrefresh--markers--nextjs-gotchas)
14. [Page Transition Animations — App Router](#14-page-transition-animations--app-router)
15. [Performance Rules](#15-performance-rules)
16. [What Never To Do](#16-what-never-to-do)
17. [Code Documentation](#17-code-documentation)
18. [Quick Reference](#18-quick-reference)

---

## 1. Setup & Plugin Registration

### Installation

```bash
pnpm add gsap @gsap/react
```

### Central Config — `src/lib/gsapConfig.ts`

All GSAP imports and plugin registrations must live in **one file only**.
Never register plugins inside individual components or hooks.

```ts
/*
 * File Name:     gsapConfig.ts
 * Description:   Central GSAP configuration. Registers all plugins once.
 *                Import gsap and useGSAP exclusively from this file.
 * Author:        <Name>
 * Created Date:  <YYYY-MM-DD>
 */

"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export { gsap, ScrollTrigger, useGSAP };
```

### Import Rule

```ts
// ✅ Always import from the central config
import { gsap, useGSAP, ScrollTrigger } from "@/lib/gsapConfig";

// ❌ Never import directly from the gsap package in components
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
```

---

## 2. Folder Structure & File Placement

Animation code follows the same **hybrid architecture** defined in
[`rules.md § 2`](./rules.md#2-hybrid-folder-architecture).

### Where Animation Code Lives

| Scope | Location | Example |
|-------|----------|---------|
| Used by **1 feature** | `src/features/<feature>/hooks/` | `useHeroAnimation.ts` |
| Used by **2+ features** | `src/hooks/` | `useStaggerReveal.ts` |
| Reusable animated components | `src/components/ui/` | `AnimatedCounter.tsx` |
| Global GSAP config | `src/lib/` | `gsapConfig.ts` |
| Motion tokens / constants | `src/constants/` | `animationTokens.ts` |

### Animation Constants File

All shared duration, ease, and stagger values live in one constants file.
Never hardcode animation values inline — always reference a token.

```ts
/*
 * File Name:     animationTokens.ts
 * Description:   Shared GSAP animation constants — duration, ease, and
 *                stagger values used across the entire project.
 * Author:        <Name>
 * Created Date:  <YYYY-MM-DD>
 */

export const DURATION = {
  fast:   0.3,
  normal: 0.6,
  slow:   1.0,
  xslow:  1.5,
} as const;

export const EASE = {
  default:  "power2.out",
  strong:   "power3.out",
  bounce:   "back.out(1.7)",
  elastic:  "elastic.out(1, 0.3)",
  linear:   "none",
  inOut:    "power1.inOut",
} as const;

export const STAGGER = {
  fast:   0.06,
  normal: 0.1,
  slow:   0.15,
} as const;

export const BREAKPOINTS = {
  mobile:  "(max-width: 767px)",
  tablet:  "(min-width: 768px) and (max-width: 1023px)",
  desktop: "(min-width: 1024px)",
  reduced: "(prefers-reduced-motion: reduce)",
} as const;
```

### Feature Anatomy with Animations

```
features/<feature-name>/
├── components/
│   └── HeroSection.tsx       # Uses animation hook — no raw GSAP here
├── hooks/
│   └── useHeroAnimation.ts   # All raw GSAP logic isolated here
├── types/
└── index.ts
```

> **Rule**: Animation logic belongs in hooks. Components call the hook
> and attach the returned `ref`. Components must not contain raw
> `gsap.to()` / `gsap.from()` calls directly — except for simple
> micro-animations (e.g. `onMouseEnter` hover lifts).

---

## 3. File & Variable Naming

### Files

| File Type | Convention | Examples |
|-----------|-----------|----------|
| Animation hooks | `camelCase` + `use` prefix `.ts` | `useHeroAnimation.ts`, `useStaggerReveal.ts` |
| Animated components | **PascalCase** `.tsx` | `AnimatedCounter.tsx`, `RevealText.tsx` |
| Animation constants | `camelCase` `.ts` | `animationTokens.ts` |
| ScrollTrigger hooks | `camelCase` + `use` prefix `.ts` | `useScrollReveal.ts`, `usePinSection.ts` |

### Variables & Instances

| Thing | Convention | Example |
|-------|-----------|---------|
| Timeline instance | `camelCase` + `Tl` suffix | `heroTl`, `cardsTl`, `navTl` |
| ScrollTrigger instance | `camelCase` + `St` suffix | `heroPinSt`, `revealSt` |
| Tween reference | `camelCase` + `Tween` suffix | `fadeTween`, `floatTween` |
| GSAP context | `camelCase` + `Ctx` suffix | `heroCtx` |
| matchMedia instance | `camelCase` + `Mm` suffix | `heroMm`, `pagesMm` |

```ts
// ✅ Good naming
const heroTl     = gsap.timeline({ defaults: { ease: EASE.default } });
const heroMm     = gsap.matchMedia();
const floatTween = gsap.to(".anim-badge", { y: -10, repeat: -1, yoyo: true });

// ❌ Bad naming
const tl1  = gsap.timeline();
const anim = gsap.to(".anim-badge", { y: -10 });
const mm   = gsap.matchMedia();
```

### CSS Class Selectors for GSAP

```
Prefix: anim-
Format: anim-<feature>-<element>

Examples:
  anim-hero-title
  anim-hero-nav
  anim-hero-cta
  anim-features-card
  anim-nav-link
```

```tsx
// ✅ Good — anim- prefix, clearly not a style class
<h1 className="anim-hero-title text-4xl font-bold text-foreground">
  Hello World
</h1>

// ❌ Bad — GSAP targets a Tailwind class, coupling animation to style
gsap.from(".text-4xl", { opacity: 0 });

// ❌ Bad — GSAP targets a JS hook class
gsap.from(".js-title", { opacity: 0 });
```

> **Rule**: The `anim-` prefix is animation-only. Never apply styles to
> it. Never use Tailwind utility classes or `data-` attributes as GSAP
> targets in production code.

---

## 4. The useGSAP Hook — Next.js Rules

### The Mandatory Pattern

```tsx
"use client"; // 1. Must be a Client Component

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsapConfig";
import { DURATION, EASE } from "@/constants/animationTokens";

export default function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null); // 2. Ref on root element

  useGSAP(                                           // 3. useGSAP, NOT useEffect
    () => {
      gsap.from(".anim-hero-title", {
        opacity: 0,
        y: 60,
        duration: DURATION.slow,
        ease: EASE.strong,
      });
    },
    { scope: containerRef }                          // 4. Always scope!
  );

  return (
    <div ref={containerRef}>                         {/* 5. Ref on wrapper */}
      <h1 className="anim-hero-title">Hello</h1>
    </div>
  );
}
```

### The 5 Non-Negotiable Rules

```
1. "use client"     — Every file with useGSAP must be a Client Component.
                      Never use GSAP in Server Components.

2. useGSAP only     — Never use useEffect or useLayoutEffect for GSAP.
                      useGSAP handles React reconciliation and cleanup correctly.

3. scope always     — Always pass { scope: containerRef } to useGSAP.
                      This prevents selector leakage across components.

4. useRef on root   — Always attach the ref to the outermost wrapper element.
                      Never skip the ref or attach it to a child.

5. push client deep — Mark only the animated leaf component as "use client".
                      Keep parent page.tsx and layout.tsx as Server Components.
```

### Extracting Animation Logic into a Hook

```ts
/*
 * File Name:     useHeroAnimation.ts
 * Description:   Manages all GSAP animations for the Hero section —
 *                entrance timeline, floating badge loop, and responsive
 *                breakpoint handling via gsap.matchMedia().
 * Targets:       .anim-hero-nav, .anim-hero-title, .anim-hero-subtitle,
 *                .anim-hero-cta, .anim-hero-stat, .anim-hero-badge
 * Plugin:        ScrollTrigger
 * Author:        <Name>
 * Created Date:  <YYYY-MM-DD>
 */

"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsapConfig";
import { DURATION, EASE, STAGGER, BREAKPOINTS } from "@/constants/animationTokens";

/*
 * Function Name: useHeroAnimation
 * Description:   Returns a containerRef to attach to the hero wrapper.
 *                Runs the full entrance timeline on mount, with
 *                responsive variants via gsap.matchMedia().
 * Returns:       { containerRef } — attach to root element
 * Cleanup:       Handled automatically by useGSAP
 */
export function useHeroAnimation() {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const heroMm = gsap.matchMedia();

      // ♿ Reduced motion — skip all animation, snap to final state
      heroMm.add(BREAKPOINTS.reduced, () => {
        gsap.set(
          ".anim-hero-nav, .anim-hero-badge, .anim-hero-title, .anim-hero-subtitle, .anim-hero-cta, .anim-hero-stat",
          { clearProps: "all" }
        );
      });

      // 🖥️ Desktop — full cinematic entrance
      heroMm.add(BREAKPOINTS.desktop, () => {
        const heroTl = gsap.timeline({
          defaults: { ease: EASE.default, duration: DURATION.normal },
        });

        heroTl
          .from(".anim-hero-nav",      { y: -80, autoAlpha: 0 })
          .from(".anim-hero-badge",    { y: 20, autoAlpha: 0, duration: DURATION.fast  }, "-=0.1")
          .from(".anim-hero-title",    { y: 70, autoAlpha: 0, duration: DURATION.slow,
                                         ease: EASE.strong                             }, "-=0.2")
          .from(".anim-hero-subtitle", { y: 30, autoAlpha: 0                           }, "-=0.4")
          .fromTo(".anim-hero-cta",
            { scale: 0, autoAlpha: 0 },
            { scale: 1, autoAlpha: 1, duration: DURATION.fast, ease: EASE.bounce       }, "<+=0.2")
          .from(".anim-hero-stat",     {
            y: 20, autoAlpha: 0, duration: DURATION.fast,
            stagger: { each: STAGGER.normal, from: "start" }                           }, "-=0.2");

        // Floating badge — independent of the main timeline
        gsap.to(".anim-hero-badge", {
          y: -10,
          duration: 2,
          repeat: -1,
          yoyo: true,
          ease: EASE.inOut,
          delay: 1.5,
        });

        return () => {
          gsap.set(".anim-hero-nav, .anim-hero-badge, .anim-hero-title, .anim-hero-subtitle, .anim-hero-cta, .anim-hero-stat", { clearProps: "all" });
        };
      });

      // 📱 Mobile — lighter, faster entrance
      heroMm.add(BREAKPOINTS.mobile, () => {
        const heroTl = gsap.timeline({
          defaults: { ease: EASE.default, duration: DURATION.fast },
        });

        heroTl
          .from(".anim-hero-title",    { y: 40, autoAlpha: 0 })
          .from(".anim-hero-subtitle", { y: 20, autoAlpha: 0 }, "-=0.1")
          .from(".anim-hero-cta",      { autoAlpha: 0        }, "-=0.1");

        return () => {
          gsap.set(".anim-hero-title, .anim-hero-subtitle, .anim-hero-cta", { clearProps: "all" });
        };
      });
    },
    { scope: containerRef }
  );

  return { containerRef };
}
```

```tsx
// HeroSection.tsx — clean, zero raw GSAP
"use client";
import { useHeroAnimation } from "../hooks/useHeroAnimation";

export function HeroSection() {
  const { containerRef } = useHeroAnimation();

  return (
    <div ref={containerRef}>
      <nav className="anim-hero-nav">...</nav>
      <h1 className="anim-hero-title">...</h1>
    </div>
  );
}
```

---

## 5. Tween Rules — gsap.to / from / fromTo

### When to Use Each Method

| Method | Use When |
|--------|----------|
| `gsap.to()` | Element is already visible; animate it somewhere — hover, parallax, loop |
| `gsap.from()` | Element is at its final CSS position; animate the entrance |
| `gsap.fromTo()` | You need precise control of both start AND end state |
| `gsap.set()` | Snap to a state instantly with zero duration |

```ts
// ✅ gsap.from() — page load entrance
gsap.from(".anim-hero-title", {
  y: 60,
  autoAlpha: 0,
  duration: DURATION.slow,
  ease: EASE.strong,
});

// ✅ gsap.to() — loop or interactive
gsap.to(".anim-badge", {
  y: -10,
  repeat: -1,
  yoyo: true,
  duration: 2,
  ease: EASE.inOut,
});

// ✅ gsap.fromTo() — full control
gsap.fromTo(
  ".anim-hero-cta",
  { scale: 0, autoAlpha: 0 },
  { scale: 1, autoAlpha: 1, duration: DURATION.fast, ease: EASE.bounce }
);

// ✅ gsap.set() — zero-duration snap
gsap.set(".anim-hero-cta", { autoAlpha: 0, scale: 0 });
```

### Standard Property Reference

```ts
// ✅ PREFERRED — GPU-accelerated, no layout recalc
{ x: 200 }           // translateX
{ y: -100 }          // translateY
{ scale: 1.2 }       // uniform scale
{ scaleX: 2 }
{ scaleY: 0.5 }
{ rotation: 360 }
{ autoAlpha: 0 }     // opacity + visibility combined — PREFERRED over opacity alone

// ⚠️ USE SPARINGLY — triggers style recalc but not layout
{ borderRadius: "50%" }
{ backgroundColor: "var(--primary)" }
{ color: "var(--foreground)" }

// ❌ NEVER — triggers layout reflow, destroys CLS score
{ width: "200px" }
{ height: "100px" }
{ top: "50px" }
{ left: "200px" }
{ margin: "20px" }
{ padding: "16px" }
```

> **`autoAlpha` rule**: Always prefer `autoAlpha` over `opacity` for entrance
> animations. When `autoAlpha` reaches `0`, GSAP also sets `visibility: hidden`,
> preventing invisible elements from being keyboard-focusable or intercepting
> pointer events.

---

## 6. gsap.set() + clearProps

### What `gsap.set()` Does

`gsap.set()` is a zero-duration tween — it applies properties instantly.
It is the correct way to set initial state, reset elements, or prepare the
DOM before a timeline runs.

```ts
// ✅ Snap to a state instantly
gsap.set(".anim-hero-cta", { autoAlpha: 0, scale: 0 });

// ✅ Reset multiple elements at once
gsap.set(".anim-hero-title, .anim-hero-subtitle, .anim-hero-cta", {
  autoAlpha: 0,
  y: 0,
});

// ✅ Pre-hide elements before a delayed timeline fires
useGSAP(() => {
  gsap.set(".anim-hero-title",    { autoAlpha: 0, y: 60  });
  gsap.set(".anim-hero-subtitle", { autoAlpha: 0, y: 30  });
  gsap.set(".anim-hero-cta",      { autoAlpha: 0, scale: 0 });

  const heroTl = gsap.timeline({ delay: 0.2 });
  heroTl
    .to(".anim-hero-title",    { autoAlpha: 1, y: 0, duration: DURATION.slow  })
    .to(".anim-hero-subtitle", { autoAlpha: 1, y: 0, duration: DURATION.normal }, "-=0.3")
    .to(".anim-hero-cta",      { autoAlpha: 1, scale: 1, ease: EASE.bounce     }, "-=0.2");

}, { scope: containerRef });
```

### `clearProps` — Remove All Inline GSAP Styles

```ts
// ✅ Clear a specific property
gsap.set(".anim-hero-title", { clearProps: "opacity" });

// ✅ Clear multiple specific properties
gsap.set(".anim-hero-title", { clearProps: "opacity,transform" });

// ✅ Clear ALL inline GSAP styles — most common use case
gsap.set(".anim-hero-title", { clearProps: "all" });

// ✅ Clear all animated elements at once
gsap.set(
  ".anim-hero-nav, .anim-hero-title, .anim-hero-subtitle, .anim-hero-cta",
  { clearProps: "all" }
);
```

### When to Use Each

| Situation | What to Do |
|-----------|-----------|
| Pre-hide elements before a delayed timeline | `gsap.set(target, { autoAlpha: 0 })` |
| Prevent flash of unstyled content | `gsap.set(targets, { autoAlpha: 0 })` before timeline |
| Switch between `matchMedia` breakpoints | `gsap.set(targets, { clearProps: "all" })` in cleanup return |
| Reset an element completely after animation | `gsap.set(target, { clearProps: "all" })` |

### clearProps in matchMedia Cleanup

```ts
heroMm.add(BREAKPOINTS.desktop, () => {
  gsap.from(".anim-hero-title", { y: 70, autoAlpha: 0, duration: DURATION.slow });

  return () => {
    gsap.set(".anim-hero-title", { clearProps: "all" });
  };
});
```

---

## 7. Timeline Rules

### Always Use Timelines for Sequences of 2+ Tweens

```ts
// ❌ Bad — manual delay math, breaks when any duration changes
gsap.from(".anim-nav",      { autoAlpha: 0, duration: 0.8 });
gsap.from(".anim-title",    { autoAlpha: 0, duration: 1,   delay: 0.8 });
gsap.from(".anim-subtitle", { autoAlpha: 0, duration: 0.8, delay: 1.6 });

// ✅ Good — chainable, self-managing, maintainable
const heroTl = gsap.timeline({
  defaults: { ease: EASE.default, duration: DURATION.normal },
});

heroTl
  .from(".anim-nav",      { autoAlpha: 0 })
  .from(".anim-title",    { autoAlpha: 0 })
  .from(".anim-subtitle", { autoAlpha: 0 });
```

### Always Set Defaults

```ts
const heroTl = gsap.timeline({
  defaults: {
    ease:     EASE.default,
    duration: DURATION.normal,
  },
});

// Uses defaults
heroTl.from(".anim-nav", { autoAlpha: 0, y: -80 });

// Overrides ease only — all other defaults still apply
heroTl.from(".anim-cta", { scale: 0, autoAlpha: 0, ease: EASE.bounce });
```

### Position Parameter — Standard Patterns

```ts
const tl = gsap.timeline();

tl.from(".a", { autoAlpha: 0 })                // DEFAULT — after previous ends
  .from(".b", { autoAlpha: 0 }, "-=0.3")       // OVERLAP — 0.3s before previous ends
  .from(".c", { autoAlpha: 0 }, "<")            // SYNC — same time as previous
  .from(".d", { autoAlpha: 0 }, "<+=0.2")       // SYNC + OFFSET — 0.2s after previous started
  .from(".e", { autoAlpha: 0 }, "+=0.5")        // GAP — 0.5s after previous ends
  .from(".f", { autoAlpha: 0 }, 2);             // ABSOLUTE — at exactly 2s
```

| Pattern | Code | Best For |
|---------|------|----------|
| Slight overlap | `"-=0.2"` | Default — smooth, polished feel |
| Sync | `"<"` | Two things that belong together |
| Sync + small offset | `"<+=0.15"` | Staggered pair with shared start point |
| Gap | `"+=0.3"` | Distinct phase breaks within one timeline |

### Labels for Complex Timelines

Use labels when a timeline has more than 4–5 tweens or distinct phases.

```ts
const pageTl = gsap.timeline();

pageTl
  .addLabel("nav")
  .from(".anim-nav", { y: -80, autoAlpha: 0 }, "nav")

  .addLabel("hero", "nav+=0.3")
  .from(".anim-hero-title",    { y: 60, autoAlpha: 0 }, "hero")
  .from(".anim-hero-subtitle", { y: 30, autoAlpha: 0 }, "hero+=0.2")

  .addLabel("stats", "+=0.1")
  .from(".anim-hero-stat", {
    y: 20,
    autoAlpha: 0,
    stagger: STAGGER.normal,
  }, "stats");

// Debug: jump to any label while building — DEV ONLY, never commit
// pageTl.seek("stats");
// pageTl.timeScale(0.2);
```

### Timeline Callbacks

```ts
const heroTl = gsap.timeline({
  onStart:    () => console.log("▶️  heroTl started"),
  onComplete: () => console.log("✅ heroTl complete"),
});

heroTl.play();
heroTl.pause();
heroTl.reverse();
heroTl.restart();
heroTl.seek(2);
heroTl.timeScale(0.2); // DEV ONLY — never commit
```

> **Rule**: Remove all `timeScale` overrides, `seek()` calls, and `console.log`
> callbacks before committing.

---

## 8. Stagger Rules

### Basic vs. Advanced Stagger

```ts
// ✅ Basic — token number for simple uniform cascades
gsap.from(".anim-hero-stat", {
  autoAlpha: 0,
  y: 20,
  stagger: STAGGER.normal,
});

// ✅ Advanced — object when you need direction or eased spacing
gsap.from(".anim-features-card", {
  autoAlpha: 0,
  y: 60,
  duration: DURATION.normal,
  stagger: {
    each: STAGGER.normal,
    from: "start",
    ease: "power2.inOut",
  },
});
```

### `from` Direction Reference

| Value | Effect | Best For |
|-------|--------|----------|
| `"start"` | Left → right | Horizontal lists, nav links, cards |
| `"end"` | Right → left | Dismissals, reverse reveals |
| `"center"` | Center → outward | Hero badges, radial reveals |
| `"edges"` | Edges → center | Closing / collapsing sequences |
| `"random"` | Random order | Playful / organic feel |
| `0` (index) | From a specific element | Custom focal point |

### `each` vs. `amount`

```ts
// each — fixed gap regardless of element count (PREFERRED)
stagger: { each: STAGGER.normal }

// amount — total time is fixed, gap shrinks as elements grow
stagger: { amount: 1.0 }
```

> **Rule**: Default to `each` for UI components. Use `amount` only when
> element count is variable and you need a guaranteed fixed total duration.

### Grid Stagger

```ts
gsap.from(".anim-grid-item", {
  autoAlpha: 0,
  y: 40,
  duration: DURATION.normal,
  stagger: {
    each: STAGGER.fast,
    from: "start",
    grid: "auto",
  },
});
```

---

## 9. ScrollTrigger Rules

ScrollTrigger is registered once in `src/lib/gsapConfig.ts`. Never
re-register it inside a component or hook.

### Standard Scroll Reveal Pattern

```ts
gsap.from(".anim-section-title", {
  autoAlpha: 0,
  y: 60,
  duration: DURATION.slow,
  ease: EASE.strong,
  scrollTrigger: {
    trigger:       ".anim-section-title",
    start:         "top 80%",
    end:           "top 40%",
    toggleActions: "play none none reverse",
  },
});
```

### `toggleActions` Reference

Format: `"onEnter onLeave onEnterBack onLeaveBack"`

| Preset | Code | Use Case |
|--------|------|----------|
| Play once, never reset | `"play none none none"` | Counters, one-time reveals |
| Play in, reverse on scroll up | `"play none none reverse"` | **Standard scroll reveals** ✅ |
| Full bidirectional | `"play reverse play reverse"` | Sticky nav, persistent states |

### Scrub

```ts
// scrub: true  — instant, 1:1 with scroll
// scrub: 1     — 1 second lag (smooth — standard choice)
// scrub: 2     — 2 second lag (cinematic, heavy elements)

gsap.to(".anim-parallax-image", {
  y: -200,
  ease: EASE.linear,
  scrollTrigger: {
    trigger: ".anim-parallax-image",
    start:   "top bottom",
    end:     "bottom top",
    scrub:   1,
  },
});
```

### Pin

```ts
ScrollTrigger.create({
  trigger:    ".anim-sticky-section",
  start:      "top top",
  end:        "+=600",
  pin:        true,
  pinSpacing: true,
});
```

### Individual ScrollTrigger Per Element

```ts
const cards = gsap.utils.toArray<HTMLElement>(".anim-features-card");

cards.forEach((card) => {
  gsap.from(card, {
    autoAlpha: 0,
    y: 60,
    duration: DURATION.normal,
    ease: EASE.default,
    scrollTrigger: {
      trigger:       card,
      start:         "top 85%",
      toggleActions: "play none none reverse",
    },
  });
});
```

### ScrollTrigger Cleanup

`useGSAP` handles cleanup automatically. Only use manual cleanup for
edge cases outside `useGSAP`:

```ts
useEffect(() => {
  const revealSt = ScrollTrigger.create({ ... });
  return () => revealSt.kill();
}, []);
```

---

## 10. gsap.matchMedia() — Responsive Animations

Without `gsap.matchMedia()`, GSAP inline styles applied at one breakpoint
persist when the viewport changes. CSS `@media` queries cannot override
GSAP inline styles. `gsap.matchMedia()` automatically reverts and kills all
animations and ScrollTriggers when a media query no longer matches.

### Standard Pattern

```ts
useGSAP(() => {
  const heroMm = gsap.matchMedia();

  // ♿ Reduced motion — always declare first, highest priority
  heroMm.add(BREAKPOINTS.reduced, () => {
    gsap.set(
      ".anim-hero-title, .anim-hero-subtitle, .anim-hero-cta, .anim-hero-stat",
      { clearProps: "all" }
    );
  });

  // 🖥️ Desktop
  heroMm.add(BREAKPOINTS.desktop, () => {
    const heroTl = gsap.timeline({
      defaults: { ease: EASE.default, duration: DURATION.normal },
    });

    heroTl
      .from(".anim-hero-title",    { y: 70, autoAlpha: 0, duration: DURATION.slow })
      .from(".anim-hero-subtitle", { y: 30, autoAlpha: 0 }, "-=0.3");

    gsap.to(".anim-parallax-bg", {
      y: -200,
      scrollTrigger: {
        trigger: ".anim-hero",
        start:   "top top",
        end:     "bottom top",
        scrub:   1,
      },
    });

    return () => {
      gsap.set(".anim-hero-title, .anim-hero-subtitle", { clearProps: "all" });
    };
  });

  // 📱 Mobile
  heroMm.add(BREAKPOINTS.mobile, () => {
    gsap.from(".anim-hero-title", {
      y: 30,
      autoAlpha: 0,
      duration: DURATION.fast,
    });

    return () => {
      gsap.set(".anim-hero-title", { clearProps: "all" });
    };
  });

}, { scope: containerRef });
```

### Using Context Data Inside Handlers

```ts
const heroMm = gsap.matchMedia();

heroMm.add(
  {
    isDesktop: BREAKPOINTS.desktop,
    isMobile:  BREAKPOINTS.mobile,
    isReduced: BREAKPOINTS.reduced,
  },
  (context) => {
    const { isDesktop, isMobile, isReduced } = context.conditions as {
      isDesktop: boolean;
      isMobile:  boolean;
      isReduced: boolean;
    };

    if (isReduced) {
      gsap.set(".anim-hero-title", { clearProps: "all" });
      return;
    }

    gsap.from(".anim-hero-title", {
      y:         isDesktop ? 70 : 30,
      autoAlpha: 0,
      duration:  isDesktop ? DURATION.slow : DURATION.fast,
      ease:      EASE.strong,
    });
  }
);
```

### Rules

```
✅ Always declare BREAKPOINTS.reduced handler first — highest priority
✅ Always return a cleanup function with clearProps: "all" for each handler
✅ Use BREAKPOINTS tokens — never hardcode media query strings
✅ Use gsap.matchMedia() — not the deprecated ScrollTrigger.matchMedia()
✅ Never use CSS @media queries to control GSAP-animated elements
```

---

## 11. gsap.utils — The Utility Toolkit

### `gsap.utils.toArray()` — NodeList to Array

```ts
const cards = gsap.utils.toArray<HTMLElement>(".anim-features-card");

cards.forEach((card, index) => {
  gsap.from(card, {
    autoAlpha: 0,
    y: 60,
    duration: DURATION.normal,
    delay: index * STAGGER.normal,
    scrollTrigger: {
      trigger:       card,
      start:         "top 85%",
      toggleActions: "play none none reverse",
    },
  });
});
```

### `gsap.utils.clamp()`

```ts
const clampedProgress = gsap.utils.clamp(0, 1, rawProgress);

// Reusable clamp function
const clampProgress = gsap.utils.clamp(0, 1);
const safe = clampProgress(someValue);
```

### `gsap.utils.mapRange()`

```ts
// Map scroll progress (0 → 1) to rotation (0 → 360deg)
const progressToRotation = gsap.utils.mapRange(0, 1, 0, 360);
const rotation = progressToRotation(scrollProgress);

// Map scroll Y (0 → 1000px) to opacity (1 → 0)
const scrollToOpacity = gsap.utils.mapRange(0, 1000, 1, 0);
```

### `gsap.utils.interpolate()`

```ts
const colorInterp = gsap.utils.interpolate("var(--primary)", "var(--secondary)");
const midColor = colorInterp(0.5);

const numInterp = gsap.utils.interpolate(0, 100);
const midPoint  = numInterp(0.3); // → 30
```

### `gsap.utils.wrap()`

```ts
// Essential for infinite carousels and looping animations
const wrap    = gsap.utils.wrap(0, slides.length);
const nextIdx = wrap(currentIndex + 1);
```

### When to Use Each

| Utility | Use When |
|---------|----------|
| `toArray()` | Iterating over GSAP targets with individual ScrollTriggers |
| `clamp()` | Constraining a computed value to a safe range |
| `mapRange()` | Linking scroll progress or pointer position to an animation value |
| `interpolate()` | Blending between two values at a given progress point |
| `wrap()` | Infinite cycling — carousels, loops |

---

## 12. useGSAP Dependencies Array — Reactive Animations

### When to Use Dependencies

When an animation depends on React state or props — menu toggle, tab change,
theme switch — pass a `dependencies` array. The animation re-runs on change.

```ts
"use client";
import { useState, useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsapConfig";
import { DURATION, EASE } from "@/constants/animationTokens";

export function MobileMenu() {
  const containerRef        = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);

  useGSAP(
    () => {
      gsap.to(".anim-menu-panel", {
        height:    isOpen ? "auto" : 0,
        autoAlpha: isOpen ? 1 : 0,
        duration:  DURATION.fast,
        ease:      isOpen ? EASE.default : EASE.inOut,
      });

      gsap.to(".anim-menu-icon", {
        rotation: isOpen ? 45 : 0,
        duration: DURATION.fast,
        ease:     EASE.bounce,
      });
    },
    {
      scope:          containerRef,
      dependencies:   [isOpen],
      revertOnUpdate: true,
    }
  );

  return (
    <div ref={containerRef}>
      <button onClick={() => setIsOpen((prev) => !prev)}>
        <span className="anim-menu-icon">✕</span>
      </button>
      <div className="anim-menu-panel">...</div>
    </div>
  );
}
```

### `revertOnUpdate` — Why It Matters

Without `revertOnUpdate: true`, the new animation fights inline styles left
by the previous run. `revertOnUpdate: true` cleanly reverts all GSAP state
before re-running — the same way `useEffect` cleanup works.

```ts
// ✅ Always pair dependencies with revertOnUpdate
useGSAP(
  () => { /* state-driven animation */ },
  {
    scope:          containerRef,
    dependencies:   [isOpen, activeTab],
    revertOnUpdate: true,
  }
);

// ❌ Missing revertOnUpdate — animations fight each other on state change
useGSAP(
  () => { /* animation */ },
  { scope: containerRef, dependencies: [isOpen] }
);
```

### Dependencies Rules

```
✅ Always pair dependencies: [...] with revertOnUpdate: true
✅ Only include values the animation actually reads
✅ Use for state-driven animations (open/closed, active tab, theme)
❌ Do not add dependencies for entrance animations that run once on mount
❌ Do not add dependencies just because a value exists in the component
```

---

## 13. ScrollTrigger.refresh() + markers — Next.js Gotchas

### The Problem

ScrollTrigger calculates start/end positions on mount. If content loads
asynchronously after mount, the page height changes and all trigger positions
become inaccurate. Fix with `ScrollTrigger.refresh()`.

### When to Call `ScrollTrigger.refresh()`

```ts
// ✅ After all animations are registered
useGSAP(() => {
  gsap.from(".anim-section-title", {
    autoAlpha: 0,
    y: 60,
    scrollTrigger: { trigger: ".anim-section-title", start: "top 80%" },
  });

  ScrollTrigger.refresh();
}, { scope: containerRef });
```

```ts
// ✅ After images or async content finishes loading
useEffect(() => {
  const images = document.querySelectorAll("img");
  let loaded   = 0;

  images.forEach((img) => {
    if (img.complete) {
      loaded++;
      if (loaded === images.length) ScrollTrigger.refresh();
    } else {
      img.addEventListener("load", () => {
        loaded++;
        if (loaded === images.length) ScrollTrigger.refresh();
      });
    }
  });
}, []);
```

### `markers` — Dev-Only Visual Debugging

```ts
scrollTrigger: {
  trigger: ".anim-section",
  start:   "top 80%",
  end:     "top 40%",
  markers: true,  // 👈 DEV ONLY — NEVER commit
}
```

### Route Change Cleanup — App Router

```ts
"use client";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { ScrollTrigger } from "@/lib/gsapConfig";

export function ScrollTriggerCleaner() {
  const pathname = usePathname();

  useEffect(() => {
    return () => {
      ScrollTrigger.getAll().forEach((st) => st.kill());
    };
  }, [pathname]);

  return null;
}
```

---

## 14. Page Transition Animations — App Router

Next.js App Router unmounts the outgoing page immediately on route change,
leaving no time for an exit animation. Use `next-transition-router`.

### Installation

```bash
pnpm add next-transition-router
```

### Setup in Root Layout

```tsx
/*
 * File Name:     layout.tsx
 * Description:   Root layout. Wraps all pages with TransitionRouter
 *                for animated page enter/exit using GSAP.
 * Author:        <Name>
 * Created Date:  <YYYY-MM-DD>
 */

import { TransitionRouter } from "next-transition-router";
import { gsap } from "@/lib/gsapConfig";
import { DURATION, EASE } from "@/constants/animationTokens";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <TransitionRouter
          leave={(next) => {
            gsap.to(".anim-page-wrapper", {
              autoAlpha: 0,
              y: -20,
              duration:   DURATION.fast,
              ease:       EASE.default,
              onComplete: next,
            });
          }}
          enter={(next) => {
            gsap.fromTo(
              ".anim-page-wrapper",
              { autoAlpha: 0, y: 20 },
              {
                autoAlpha:  1,
                y:          0,
                duration:   DURATION.normal,
                ease:       EASE.default,
                onComplete: next,
              }
            );
          }}
        >
          {children}
        </TransitionRouter>
      </body>
    </html>
  );
}
```

### Page Wrapper — Required on Every Page

```tsx
export default function DashboardPage() {
  return (
    <div className="anim-page-wrapper">
      <DashboardContent />
    </div>
  );
}
```

### Reduced Motion — Disable Page Transitions

```tsx
const prefersReducedMotion =
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

<TransitionRouter
  leave={prefersReducedMotion ? undefined : (next) => { /* animate out */ next(); }}
  enter={prefersReducedMotion ? undefined : (next) => { /* animate in  */ next(); }}
>
  {children}
</TransitionRouter>
```

### Rules

```
✅ Always wrap page content in a div with class anim-page-wrapper
✅ Always call next() in onComplete — without it navigation hangs
✅ Disable transitions when prefers-reduced-motion: reduce is set
✅ Keep leave duration short (DURATION.fast) — users are waiting to navigate
❌ Do not run heavy animations in leave — it blocks the route change
❌ Do not use CSS transitions for page transitions — they race with GSAP
```

---

## 15. Performance Rules

### The Golden Properties

```
✅ opacity       — composited, GPU only
✅ autoAlpha     — opacity + visibility — PREFERRED
✅ x, y          — transform, composited
✅ scale         — transform, composited
✅ rotation      — transform, composited
✅ scaleX/scaleY — transform, composited
```

### Core Web Vitals — What Never to Animate

```
❌ width, height    — layout reflow (breaks CLS)
❌ top, left        — layout reflow (breaks CLS)
❌ margin, padding  — layout reflow (breaks CLS)
❌ font-size        — triggers layout recalc
❌ display          — use autoAlpha instead
```

### Reduce Motion — Accessibility Required

Every animation hook must respect `prefers-reduced-motion` via
`gsap.matchMedia()` with `BREAKPOINTS.reduced` — never via
`window.matchMedia` checked manually inside hooks.

```ts
const heroMm = gsap.matchMedia();

heroMm.add(BREAKPOINTS.reduced, () => {
  gsap.set(
    ".anim-hero-title, .anim-hero-subtitle, .anim-hero-cta, .anim-hero-stat",
    { clearProps: "all" }
  );
});

heroMm.add(BREAKPOINTS.desktop, () => {
  const heroTl = gsap.timeline({ ... });
  // ...
});
```

### `will-change` — Let GSAP Manage It

GSAP automatically applies `will-change: transform` during animations and
removes it when done. Never manually set `will-change` in CSS on animated
elements — it wastes GPU memory when permanently set.

```css
/* ❌ Never — always-on GPU memory waste */
.anim-hero-title {
  will-change: transform;
}
/* ✅ GSAP applies and removes will-change automatically */
```

---

## 16. What Never To Do

```
❌ Import gsap directly from "gsap" in components — use @/lib/gsapConfig
❌ Use useEffect for GSAP — use useGSAP
❌ Omit { scope: containerRef } from useGSAP — selector leaks will occur
❌ Target Tailwind classes with GSAP — use anim- prefix classes only
❌ Register plugins inside components — register once in gsapConfig.ts
❌ Animate layout properties (top, left, width, height, margin, padding)
❌ Use opacity without considering autoAlpha for entrance animations
❌ Hardcode duration, ease, stagger, or breakpoint values — use tokens
❌ Leave timeScale / seek / markers: true / console.log in committed code
❌ Use GSAP in Server Components — always "use client"
❌ Put raw GSAP timelines inside component JSX — extract to a hook
❌ Ignore prefers-reduced-motion — add BREAKPOINTS.reduced to every hook
❌ Use CSS @media queries to control GSAP-animated elements — use matchMedia
❌ Skip clearProps: "all" when switching between matchMedia breakpoints
❌ Forget to call next() in TransitionRouter leave/enter — navigation will hang
❌ Use Framer Motion, anime.js, or CSS keyframes for complex sequences
❌ Call ScrollTrigger.refresh() before all animations are registered
❌ Use dependencies: [...] without revertOnUpdate: true
❌ Use the deprecated ScrollTrigger.matchMedia() — use gsap.matchMedia()
```

---

## 17. Code Documentation

Animation hooks follow the same documentation standard as
[`rules.md § 6`](./rules.md#6-code-documentation), with
animation-specific additions.

### Animation Hook File Header

```ts
/*
 * File Name:     useHeroAnimation.ts
 * Description:   Manages entrance timeline and floating loop for the Hero
 *                section. Handles responsive breakpoints via matchMedia
 *                and respects prefers-reduced-motion.
 * Targets:       .anim-hero-nav, .anim-hero-title, .anim-hero-subtitle,
 *                .anim-hero-cta, .anim-hero-stat, .anim-hero-badge
 * Plugin:        ScrollTrigger
 * Author:        <Name>
 * Created Date:  <YYYY-MM-DD>
 */
```

### Animation Hook Function Doc

```ts
/*
 * Function Name: useHeroAnimation
 * Description:   Runs a sequenced entrance timeline for the hero section
 *                on mount. Desktop shows full cinematic sequence with
 *                parallax. Mobile shows a simplified entrance only.
 *                Reduced motion skips all animation via clearProps.
 * Parameters:    none
 * Returns:       { containerRef } — attach to the section's root wrapper
 * Cleanup:       Handled automatically by useGSAP + matchMedia revert
 */
```

### Inline Comments — Label Every Animation Block

```ts
const heroTl = gsap.timeline({
  defaults: { ease: EASE.default, duration: DURATION.normal },
});

// 1. Navbar drops from above the viewport on load
heroTl.from(".anim-hero-nav", { y: -80, autoAlpha: 0 });

// 2. Badge fades up — overlaps navbar exit for a connected feel
heroTl.from(".anim-hero-badge", { y: 20, autoAlpha: 0 }, "-=0.1");

// 3. Title is the focal point — longer duration + stronger ease for impact
heroTl.from(".anim-hero-title", {
  y: 70,
  autoAlpha: 0,
  duration: DURATION.slow,
  ease: EASE.strong,  // overrides default — title is the hero moment
}, "-=0.2");

// 4. Stats cascade left → right — reinforces natural scan direction
heroTl.from(".anim-hero-stat", {
  y: 20,
  autoAlpha: 0,
  duration: DURATION.fast,
  stagger: { each: STAGGER.normal, from: "start" },
}, "-=0.2");
```

---

## 18. Quick Reference

```
SETUP
  Install           → pnpm add gsap @gsap/react
  Config file       → src/lib/gsapConfig.ts (register ALL plugins here)
  Tokens file       → src/constants/animationTokens.ts
  Import rule       → always from @/lib/gsapConfig, never from "gsap" directly

FOLDER RULES
  Feature-only      → src/features/<name>/hooks/useXAnimation.ts
  Shared (2+)       → src/hooks/useXAnimation.ts
  Animated comp     → src/components/ui/AnimatedX.tsx
  Constants         → src/constants/animationTokens.ts

NAMING
  Timelines         → camelCase + Tl suffix      (heroTl, cardsTl)
  ScrollTriggers    → camelCase + St suffix      (revealSt, pinSt)
  matchMedia        → camelCase + Mm suffix      (heroMm, pagesMm)
  GSAP Selectors    → anim- prefix               (anim-hero-title)
  Duration tokens   → DURATION.fast/normal/slow/xslow
  Ease tokens       → EASE.default/strong/bounce/elastic/linear/inOut
  Stagger tokens    → STAGGER.fast/normal/slow
  Breakpoint tokens → BREAKPOINTS.mobile/tablet/desktop/reduced

NEXT.JS PATTERN (ALL 5 REQUIRED)
  1. "use client"             → top of every animation file
  2. useGSAP not useEffect    → always, no exceptions
  3. { scope: containerRef }  → always, no exceptions
  4. useRef on root element   → containerRef on outermost wrapper
  5. Logic in hooks           → no raw GSAP timelines in component JSX

TWEEN METHODS
  gsap.from()       → page load entrances (most common)
  gsap.to()         → hover effects, loops, scroll-driven movement
  gsap.fromTo()     → full control of both start AND end state
  gsap.set()        → instant snap — pre-hide, reset, clear after breakpoint

PROPERTIES (SAFE TO ANIMATE)
  autoAlpha         → opacity + visibility — always prefer over opacity alone
  x, y              → transforms — always use over top/left
  scale             → transforms — always use over width/height
  rotation          → transforms — safe
  opacity           → safe but prefer autoAlpha for entrances

CLEARPROPS
  clearProps: "all"              → removes ALL GSAP inline styles
  clearProps: "opacity,transform"→ removes specific properties only
  Use in → matchMedia cleanup return, reduced motion handler, post-animation resets

TIMELINE
  defaults: {}      → always set ease + duration on every timeline
  "-=0.2"           → default overlap for polished sequential feel
  "<"               → sync two things that belong together
  "<+=0.15"         → sync + small offset
  addLabel()        → use when timeline has 4+ distinct phases
  timeScale(0.2)    → debug only, never commit

STAGGER
  stagger: token    → simple uniform cascade (use STAGGER.x token)
  each vs amount    → prefer each; use amount for variable-count lists
  from: "start"     → left to right (default for most layouts)
  from: "center"    → radial / focal reveals
  from: "random"    → organic, playful feel

SCROLLTRIGGER
  start/end         → "top 80%" / "top 40%" default for most reveals
  scrub: 1          → smooth parallax (1s lag — standard choice)
  pin: true         → sticky sections
  toggleActions     → "play none none reverse" for standard scroll reveals
  markers: true     → dev only, never commit
  refresh()         → call after all triggers registered on dynamic pages
  toArray() loop    → use for individual trigger per element

MATCHMEDIA
  Always declare    → BREAKPOINTS.reduced handler first
  Always return     → cleanup function with clearProps: "all"
  Use tokens        → BREAKPOINTS.mobile/tablet/desktop/reduced
  Never use         → CSS @media to control GSAP-animated elements
  Deprecated        → ScrollTrigger.matchMedia() — use gsap.matchMedia()

GSAP UTILS
  toArray()         → NodeList → typed array for individual ScrollTriggers
  clamp()           → constrain computed value to safe range
  mapRange()        → link scroll progress to animation values
  interpolate()     → blend between two values at a progress point
  wrap()            → infinite cycling for carousels and loops

REACTIVE ANIMATIONS
  dependencies: []  → re-run animation when state/props change
  revertOnUpdate    → always pair with dependencies — clean slate on re-run

PAGE TRANSITIONS
  Library           → next-transition-router
  Wrapper class     → anim-page-wrapper on every page root element
  leave callback    → animate out, call next() in onComplete
  enter callback    → animate in, call next() in onComplete
  Reduced motion    → pass undefined to leave/enter when reduced is set

PERFORMANCE
  ✅ autoAlpha, x, y, scale, rotation — GPU composited, always safe
  ❌ top, left, width, height, margin, padding — layout reflow, never
  ✅ Respect prefers-reduced-motion via BREAKPOINTS.reduced in every hook
  ✅ Let GSAP manage will-change — never set it manually in CSS

NEVER
  ❌ Import gsap directly — use @/lib/gsapConfig
  ❌ useEffect for GSAP — use useGSAP
  ❌ Skip scope — selector leaks across components
  ❌ Target Tailwind classes — use anim- prefix
  ❌ Hardcode values — use animationTokens.ts
  ❌ Commit timeScale / seek / markers / console.log
  ❌ Animate layout properties
  ❌ Ignore prefers-reduced-motion
  ❌ Skip clearProps when switching matchMedia breakpoints
  ❌ Use dependencies without revertOnUpdate: true
  ❌ Forget next() in TransitionRouter callbacks
```

---

Last updated: <!-- DATE --> · Maintainer: <!-- NAME -->