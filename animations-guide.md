# animations-guide.md — GSAP Reference

> Core rules for GSAP + `@gsap/react` in this Next.js project. No other animation libraries allowed.

---

## 1. Setup & Imports

> **TL;DR:** Import gsap and plugins from `@/lib/gsapConfig`. Use `animationTokens.ts` for all timing and easing values.

- **Central Config**: Register plugins only in `src/lib/gsapConfig.ts`.
- **Import Rule**: ALWAYS import from central config.
  ```ts
  // ✅ DO
  import { gsap, useGSAP, ScrollTrigger } from "@/lib/gsapConfig";
  // ❌ DON'T
  import { gsap } from "gsap";
  ```
- **Animation Tokens**: Use `DURATION`, `EASE`, `STAGGER`, `BREAKPOINTS` from `src/constants/animationTokens.ts`. Never hardcode values.

## 2. File Placement & Naming

> **TL;DR:** Put GSAP logic in custom hooks. Target elements using `anim-` prefix classes, never Tailwind classes.

- **Custom Hooks**: Extract GSAP logic into hooks (e.g., `src/features/hero/hooks/useHeroAnimation.ts`).
- **CSS Selectors**: Always use the `anim-` prefix (e.g., `anim-hero-title`). **NEVER** target Tailwind classes or use `anim-` for styling.
- **Naming Conventions**: 
  - Timelines: `camelCaseTl` (e.g., `heroTl`)
  - ScrollTriggers: `camelCaseSt` (e.g., `revealSt`)
  - matchMedia: `camelCaseMm` (e.g., `heroMm`)

## 3. The useGSAP Hook (5 Non-Negotiable Rules)

> **TL;DR:** Always use `useGSAP` with `{ scope: containerRef }` in a Client Component (`"use client"`).

1. **`"use client"`**: Must be at the top of the file.
2. **`useGSAP` Only**: Never use `useEffect` or `useLayoutEffect` for animations.
3. **Always Scope**: Pass `{ scope: containerRef }` to prevent selector bleeding.
4. **Ref on Root**: Attach the ref to the outermost wrapper element.
5. **Push Client Deep**: Keep page/layout as Server Components, only animate leaf components.

```tsx
"use client";
import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsapConfig";

export function useHeroAnimation() {
  const containerRef = useRef<HTMLDivElement>(null);
  useGSAP(() => {
    gsap.from(".anim-title", { autoAlpha: 0, y: 50 });
  }, { scope: containerRef });
  return { containerRef };
}
```

## 4. Tween & Performance Rules

> **TL;DR:** Only animate composite properties (`x`, `y`, `scale`, `rotation`, `autoAlpha`). Never animate layout properties like `width`.

- **GPU Only**: Animate `x`, `y`, `scale`, `rotation`, `autoAlpha`.
- **NEVER Animate Reflow**: `width`, `height`, `top`, `left`, `margin`, `padding` (destroys CLS).
- **`autoAlpha` > `opacity`**: Always prefer `autoAlpha` for entrances (handles `visibility: hidden`).
- **Instant Snaps**: Use `gsap.set(target, { autoAlpha: 0 })` to pre-hide.
- **Timelines**: Use `gsap.timeline({ defaults: { ease: EASE.default, duration: DURATION.normal } })` for sequences.

## 5. Responsive & Accessibility (`gsap.matchMedia`)

> **TL;DR:** Use `gsap.matchMedia()` for breakpoints. Always define reduced motion rules first to respect user preferences.

- Always use `gsap.matchMedia()` for breakpoints.
- **Reduced Motion**: Always define `BREAKPOINTS.reduced` **first**.
- **Cleanup**: Always return `clearProps: "all"` within each matchMedia handler.

```ts
useGSAP(() => {
  const mm = gsap.matchMedia();
  
  // ♿ Highest priority
  mm.add(BREAKPOINTS.reduced, () => {
    gsap.set(".anim-title", { clearProps: "all" });
  });

  // 🖥️ Desktop
  mm.add(BREAKPOINTS.desktop, () => {
    gsap.from(".anim-title", { y: 100, autoAlpha: 0 });
    return () => gsap.set(".anim-title", { clearProps: "all" });
  });
}, { scope: containerRef });
```

## 6. Reactive State & Dependencies

> **TL;DR:** If animation depends on React state, set `dependencies: [state]` and `revertOnUpdate: true` in the `useGSAP` config.

- When syncing GSAP to React state (e.g., `isOpen`), add dependencies.
- **Rule**: ALWAYS pair `dependencies: [...]` with `revertOnUpdate: true`.

```ts
useGSAP(() => {
  gsap.to(".anim-menu", { height: isOpen ? "auto" : 0 });
}, { scope: containerRef, dependencies: [isOpen], revertOnUpdate: true });
```

## 7. ScrollTrigger & Page Transitions

> **TL;DR:** Refresh ScrollTrigger after async loads. Wait for transitions to complete before navigating.

- **ScrollTrigger**: Call `ScrollTrigger.refresh()` after async content/images load.
- **Page Transitions**: Use `next-transition-router`. Wrap pages in `.anim-page-wrapper`. Call `next()` in `onComplete` callbacks so navigation doesn't hang.

## 8. What NEVER To Do

- ❌ Import `gsap` directly from "gsap" (use `@/lib/gsapConfig`)
- ❌ Target Tailwind classes (use `anim-` prefix)
- ❌ Hardcode durations/eases/staggers (use `animationTokens.ts`)
- ❌ Forget `{ scope: containerRef }` in `useGSAP`
- ❌ Animate `width`/`height`/`top`/`left` (forces layout reflow)
- ❌ Ignore `prefers-reduced-motion`
- ❌ Leave `markers: true`, `timeScale`, or `console.log` in committed code
- ❌ Put raw GSAP timelines inside component JSX (extract to custom hooks)
- ❌ Use dependencies array without `revertOnUpdate: true`