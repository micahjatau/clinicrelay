# Hero Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the scroll-pinned atmospheric hero with a standard single-viewport hero where content is immediately visible and animated in via a crisp mount stagger.

**Architecture:** Three focused changes — (1) strip scroll machinery from `hero.tsx` and rebuild as static mount, (2) remove opacity fade-in from `nav.tsx`, (3) increase CTA size in `hero-cta-buttons.tsx`. No new files needed. `hero-bento.tsx` is untouched — its internal stagger already works correctly on a standard viewport.

**Tech Stack:** Next.js 14, Framer Motion, Tailwind CSS, TypeScript

---

## File Map

| File | Change |
|---|---|
| `components/landing/hero.tsx` | Remove 250vh container, scroll listener, all motion values; add per-element mount stagger; fix background to full-bleed static |
| `components/landing/nav.tsx` | Remove `useState`, scroll `useEffect`, `motion.header`; replace with plain `<header>` |
| `components/landing/hero-cta-buttons.tsx` | Increase primary and secondary CTA padding/size; mobile stack |

---

## Task 1: Strip motion from nav

**Files:**
- Modify: `components/landing/nav.tsx`

- [ ] **Step 1: Rewrite nav.tsx**

Replace the entire file with:

```tsx
"use client";

import Image from "next/image";
import { useState } from "react";
import { List, X } from "@phosphor-icons/react";
import { useDemoModal } from "@/context/demo-modal-context";
import { navLinks } from "@/lib/content/clinicrelay-landing";
import { Button } from "@/components/ui/button";

export function Nav() {
  const { open } = useDemoModal();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 inset-x-0 z-40 bg-white border-b border-[--cr-border]">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10 h-[4.25rem] flex items-center justify-between md:grid md:grid-cols-[auto_1fr_auto] md:gap-6">
        <a href="#" className="flex items-center gap-2.5">
          <Image src="/logo-mark.svg" alt="ClinicRelay" width={24} height={24} priority />
          <span className="font-semibold text-[15px] text-[--cr-text] tracking-tight">ClinicRelay</span>
          <span className="hidden sm:inline text-[11px] text-[--cr-muted] tracking-wide uppercase">Front-Desk Orchestration</span>
        </a>

        <nav className="hidden md:flex items-center justify-center gap-6">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-[13px] tracking-wide text-[--cr-muted] hover:text-[--cr-text] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[--cr-teal] rounded"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-4">
          <Button onClick={() => open("demo")} size="sm" className="h-9 px-4 min-w-[118px] bg-[#0F766E] text-white hover:bg-[#115e59]">Book a Demo</Button>
          <button
            onClick={() => open("audit")}
            className="text-[13px] font-semibold text-[--cr-teal] hover:text-[--cr-teal-dark] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[--cr-teal] rounded"
          >
            Request Workflow Audit
          </button>
        </div>

        <button
          className="md:hidden text-[--cr-text]"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          {menuOpen ? <X size={22} /> : <List size={22} />}
        </button>
      </div>

      {menuOpen && (
        <div className="md:hidden bg-white border-t border-[--cr-border] px-6 py-4 flex flex-col gap-3">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-base font-medium text-[--cr-text] hover:text-[--cr-teal] py-2 px-1 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[--cr-teal]"
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </a>
          ))}
          <Button
            onClick={() => { open("demo"); setMenuOpen(false); }}
            size="sm"
            className="mt-2 w-full justify-center bg-[#0F766E] text-white hover:bg-[#115e59]"
          >
            Book a Demo
          </Button>
        </div>
      )}
    </header>
  );
}
```

- [ ] **Step 2: Verify dev server shows no errors**

Check `http://127.0.0.1:3000` — nav should be solid white with border, visible immediately on load with no flicker.

- [ ] **Step 3: Commit**

```bash
git add components/landing/nav.tsx
git commit -m "refactor: remove motion fade-in from nav, always-visible solid header"
```

---

## Task 2: Rework hero — remove scroll machinery and fix background

**Files:**
- Modify: `components/landing/hero.tsx`

- [ ] **Step 1: Rewrite hero.tsx**

Replace the entire file with:

```tsx
"use client";

import { motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import { heroData } from "@/lib/content/clinicrelay-landing";
import { HeroBento } from "./hero-bento";
import { HeroCtaButtons } from "./hero-cta-buttons";

function fadeUp(delay: number) {
  return {
    initial: { opacity: 0, y: 12 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] as const, delay },
  };
}

export function Hero() {
  const reducedMotion = useReducedMotion();

  const motion_props = (delay: number) =>
    reducedMotion
      ? {}
      : fadeUp(delay);

  return (
    <div className="min-h-[100dvh] relative flex items-center bg-[--cr-bg] pt-10 md:pt-16">
      {/* Background — full-bleed, static, low opacity */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <Image
          src="/clinicrelay-hero-bg.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-[0.08]"
          style={{ filter: "blur(1px)" }}
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(245,250,255,0.96)_0%,rgba(245,250,255,0.88)_38%,rgba(245,250,255,0.64)_100%)]" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-[1400px] mx-auto px-6 lg:px-10 w-full py-12 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          {/* Left — copy */}
          <div>
            <motion.p
              className="text-xs font-semibold uppercase tracking-[0.12em] text-[--cr-teal] mb-4"
              {...motion_props(0)}
            >
              {heroData.eyebrow}
            </motion.p>
            <motion.h1
              className="text-4xl md:text-6xl tracking-tighter font-semibold text-[--cr-text] leading-[0.95] mb-8"
              {...motion_props(0.1)}
            >
              {heroData.h1}
            </motion.h1>
            <motion.p
              className="text-base leading-relaxed text-[--cr-muted] max-w-[62ch] mb-8"
              {...motion_props(0.2)}
            >
              {heroData.subheadline}
            </motion.p>
            <motion.div {...motion_props(0.3)}>
              <HeroCtaButtons />
              <p className="text-xs text-[--cr-muted] mt-4 mb-6">{heroData.trustLine}</p>
            </motion.div>
            <motion.div className="flex flex-wrap gap-2" {...motion_props(0.4)}>
              {heroData.badges.map((badge) => (
                <span
                  key={badge}
                  className="text-xs font-semibold px-3 py-1.5 rounded-full bg-[--cr-teal-light] text-[--cr-teal]"
                >
                  {badge}
                </span>
              ))}
            </motion.div>
          </div>

          {/* Right — workflow cards */}
          <motion.div {...motion_props(0.2)}>
            <HeroBento cards={heroData.bentoCards} />
          </motion.div>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Verify dev server shows no TypeScript errors**

Check the terminal running `npm run dev` for any red errors. The page at `http://127.0.0.1:3000` should show the hero copy immediately on load without any scroll required.

- [ ] **Step 3: Verify background**

On the page, the background image should be barely visible (ghosted at ~8% opacity, very slightly blurred). The white gradient should keep the left side of the hero readable.

- [ ] **Step 4: Verify reduced motion**

Open DevTools → Rendering → Emulate prefers-reduced-motion. All copy should appear instantly with no animation.

- [ ] **Step 5: Commit**

```bash
git add components/landing/hero.tsx
git commit -m "feat: replace scroll-pin hero with immediate mount-stagger animation"
```

---

## Task 3: Increase CTA prominence

**Files:**
- Modify: `components/landing/hero-cta-buttons.tsx`

- [ ] **Step 1: Update CTA sizing and mobile stacking**

Replace the entire file with:

```tsx
"use client";

import { useDemoModal } from "@/context/demo-modal-context";
import { heroData } from "@/lib/content/clinicrelay-landing";
import {
  RippleButton,
  RippleButtonRipples,
} from "@/components/animate-ui/primitives/buttons/ripple";

export function HeroCtaButtons() {
  const { open } = useDemoModal();
  return (
    <div className="flex flex-col sm:flex-row gap-3 mb-4">
      <RippleButton
        onClick={() => open("audit")}
        className="cr-btn cr-btn-primary px-6 py-3.5 text-[15px] w-full sm:w-auto"
      >
        {heroData.primaryCta}
        <RippleButtonRipples color="rgba(255,255,255,0.45)" />
      </RippleButton>
      <RippleButton asChild>
        <a
          href="#waitlist"
          className="cr-btn cr-btn-secondary px-6 py-3.5 text-[15px] text-center w-full sm:w-auto"
        >
          {heroData.secondaryCta}
          <RippleButtonRipples color="rgba(13,148,136,0.3)" />
        </a>
      </RippleButton>
    </div>
  );
}
```

Key changes:
- `flex-col sm:flex-row` — stacks vertically on mobile, side-by-side on sm+
- `px-6 py-3.5 text-[15px]` — larger touch target and font (up from `px-5 py-3`)
- `w-full sm:w-auto` — full width on mobile for easy tap
- Removed the inline trust line (it's now in `hero.tsx` under the CTA motion wrapper)

- [ ] **Step 2: Verify visually**

On `http://127.0.0.1:3000` the primary "Book a Workflow Audit" button should be clearly dominant. At mobile width (< 640px) both buttons should stack full-width.

- [ ] **Step 3: Commit**

```bash
git add components/landing/hero-cta-buttons.tsx
git commit -m "feat: increase CTA prominence, full-width mobile stack"
```

---

## Task 4: Push

- [ ] **Step 1: Push all commits**

```bash
git push
```

- [ ] **Step 2: Final check**

Confirm on `http://127.0.0.1:3000`:
1. Nav is solid white with border, no fade-in flicker
2. Hero copy (eyebrow → h1 → subcopy → CTAs → badges) fades up on load, no scroll required
3. Workflow cards (right column) begin their sequential animation on load
4. Background image is ghosted and barely visible
5. "Book a Workflow Audit" is clearly the primary action, larger than before
6. Mobile: hero content starts near the top, CTAs stack vertically
