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