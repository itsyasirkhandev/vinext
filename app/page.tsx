/*
 * File Name:     page.tsx
 * Description:   Home page — quick overview of what this template provides.
 * Author:        Yasir Khan
 * Created Date:  2026-02-26
 */

import Link from "vinext/shims/link";
import {
  Zap,
  Atom,
  Palette,
  Puzzle,
  Clapperboard,
  ClipboardList,
  Moon,
  Cloud,
} from "lucide-react";

const FEATURES = [
  { icon: Zap, title: "Vite + vinext", desc: "Lightning-fast HMR with edge-first routing" },
  { icon: Atom, title: "React 19", desc: "Server & client components, concurrent rendering" },
  { icon: Palette, title: "Tailwind v4", desc: "OKLCH colors, @theme tokens, automatic content detection" },
  { icon: Puzzle, title: "shadcn/ui", desc: "45+ accessible Radix-based components pre-installed" },
  { icon: Clapperboard, title: "GSAP", desc: "Animation infrastructure with useGSAP, ScrollTrigger & tokens" },
  { icon: ClipboardList, title: "Forms", desc: "react-hook-form + Zod validation + shadcn Form components" },
  { icon: Moon, title: "Dark Mode", desc: "CSS variable theming with next-themes provider" },
  { icon: Cloud, title: "Edge Deploy", desc: "One-command deploy to Cloudflare Workers" },
] as const;

const DOCS = [
  { label: "Code Conventions", file: "rules.md" },
  { label: "Design System", file: "design-system.md" },
  { label: "Animations Guide", file: "animations-guide.md" },
] as const;

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-16">
      <main className="flex w-full max-w-2xl flex-col gap-12">
        {/* Header */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <h1 className="text-4xl font-bold tracking-tight text-foreground">
              vinext
            </h1>
            <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary ring-1 ring-inset ring-primary/20">
              Next.js Over Vite
            </span>
          </div>
          <p className="text-xl text-muted-foreground leading-relaxed">
            The Next.js API surface, reimplemented on Vite by Cloudflare.
            Built for maximum performance and instant deployment to Cloudflare Workers.
          </p>
        </div>

        {/* What is vinext? */}
        <section className="rounded-xl border border-border bg-card/50 p-6 backdrop-blur-sm">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-primary">
            Why vinext?
          </h2>
          <div className="grid gap-4 text-sm leading-relaxed text-muted-foreground">
            <p>
              <strong className="text-foreground">vinext</strong> is a drop-in
              alternative to Next.js developed by Cloudflare engineers to solve
              the "deployment problem." It provides the same App Router
              experience you love, but runs on <strong className="text-foreground">Vite</strong> instead of Webpack/Turbopack.
            </p>
            <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              <li className="flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                4.4x Faster Builds
              </li>
              <li className="flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                57% Smaller Bundles
              </li>
              <li className="flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                94% API Coverage
              </li>
              <li className="flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                Native Edge Support
              </li>
            </ul>
          </div>
        </section>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {FEATURES.map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              className="group flex gap-4 rounded-xl border border-border bg-card p-5 transition-all hover:border-primary/50 hover:bg-accent/5"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                <Icon className="h-5 w-5" />
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-sm font-bold text-foreground">
                  {title}
                </span>
                <span className="text-xs leading-normal text-muted-foreground">
                  {desc}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Docs & CTA */}
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-3">
            <h2 className="text-sm font-semibold text-foreground">
              Documentation
            </h2>
            <div className="flex flex-wrap gap-2">
              {DOCS.map(({ label, file }) => (
                <Link
                  key={file}
                  href={`/${file}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-9 items-center rounded-lg border border-input bg-background px-4 text-sm font-medium text-foreground transition-all hover:bg-accent hover:text-accent-foreground sm:h-10"
                >
                  {label}
                </Link>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between rounded-xl border border-primary/20 bg-primary/5 p-4">
            <div className="flex flex-col gap-0.5">
              <p className="text-sm font-bold text-foreground italic">Ready to blast off?</p>
              <p className="font-mono text-[11px] text-muted-foreground uppercase tracking-widest leading-none">
                Deploy with `npx vinext deploy`
              </p>
            </div>
            <div className="h-2 w-2 animate-pulse rounded-full bg-primary" />
          </div>
        </div>

        {/* Get Started Footer */}
        <div className="mt-4 border-t border-border pt-8 text-center">
          <p className="text-xs text-muted-foreground">
            Modify <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-foreground">app/page.tsx</code> to begin your journey.
          </p>
        </div>
      </main>
    </div>
  );
}
