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
        <div className="flex flex-col gap-3">
          <h1 className="text-3xl font-semibold tracking-tight text-foreground">
            vinext
          </h1>
          <p className="text-lg text-muted-foreground">
            Production-ready frontend template — React 19, Tailwind v4,
            shadcn/ui, GSAP, and Cloudflare Workers.
          </p>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {FEATURES.map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              className="flex gap-3 rounded-lg border border-border bg-card p-4"
            >
              <Icon className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
              <div className="flex flex-col gap-1">
                <span className="text-sm font-semibold text-foreground">
                  {title}
                </span>
                <span className="text-sm text-muted-foreground">{desc}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Docs */}
        <div className="flex flex-col gap-3">
          <h2 className="text-base font-semibold text-foreground">
            Documentation
          </h2>
          <div className="flex flex-wrap gap-2">
            {DOCS.map(({ label, file }) => (
              <Link
                key={file}
                href={`/${file}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-8 items-center rounded-md border border-input bg-background px-3 text-sm font-semibold text-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
              >
                {label}
              </Link>
            ))}
          </div>
        </div>

        {/* Get Started */}
        <div className="flex flex-col gap-2 rounded-lg border border-border bg-card p-4">
          <p className="text-sm font-semibold text-foreground">Get started</p>
          <p className="font-mono text-sm text-muted-foreground">
            Edit{" "}
            <code className="rounded bg-muted px-1.5 py-0.5 text-foreground">
              app/page.tsx
            </code>{" "}
            to start building.
          </p>
        </div>
      </main>
    </div>
  );
}
