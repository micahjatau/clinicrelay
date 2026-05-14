# Hero Pinned Scroll Reveal Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a cinematic pinned scroll animation to the landing hero where the background image is visible on load, an overlay fades in as the user scrolls, and the copy reveals on top.

**Architecture:** The hero outer `<section>` becomes a `250vh` scroll container with a `sticky top-0 h-[100dvh]` inner panel. Framer Motion `useScroll` tracks progress through the outer container; two `useTransform` values drive overlay opacity (0→1 over scroll 0–0.45) and copy opacity (0→1 over scroll 0.35–0.70). `useReducedMotion` short-circuits both to static `1`.

**Tech Stack:** Next.js 15, Framer Motion v12, Tailwind CSS v4, TypeScript

---

### Task 1: Convert hero.tsx to a client component with scroll motion values

**Files:**
- Modify: `components/landing/hero.tsx`

This task wires up the Framer Motion scroll tracking and derives the two animated opacity values. No visual change yet — this just establishes the motion values.

- [ ] **Step 1: Add `"use client"` directive and update imports**

Replace the top of `components/landing/hero.tsx` with:

```tsx
"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion, motionValue } from "framer-motion";
import Image from "next/image";
import { heroData } from "@/lib/content/clinicrelay-landing";
import { HeroBento } from "./hero-bento";
import { HeroCtaButtons } from "./hero-cta-buttons";
```

- [ ] **Step 2: Add hooks inside the Hero component body**

Replace the `export function Hero() {` opening with:

```tsx
export function Hero() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  const rawOverlayOpacity = useTransform(scrollYProgress, [0, 0.45], [0, 1]);
  const rawCopyOpacity = useTransform(scrollYProgress, [0.35, 0.7], [0, 1]);
  const staticOne = useRef(motionValue(1));

  const overlayOpacity = reducedMotion ? staticOne.current : rawOverlayOpacity;
  const copyOpacity = reducedMotion ? staticOne.current : rawCopyOpacity;
```

- [ ] **Step 3: Verify TypeScript compiles**

```bash
cd /home/ubuntu/projects/clinicrelay && npx tsc --noEmit
```

Expected: no errors related to `hero.tsx`.

- [ ] **Step 4: Commit**

```bash
git add components/landing/hero.tsx
git commit -m "feat: add scroll motion values to Hero component"
```

---

### Task 2: Restructure JSX — outer scroll container + sticky panel

**Files:**
- Modify: `components/landing/hero.tsx`

Wrap the existing section in a tall outer div (the scroll container) and make the section itself sticky.

- [ ] **Step 1: Replace the outer `<section>` with a scroll container + sticky panel**

The current JSX return is:
```tsx
return (
  <section className="relative min-h-[100dvh] flex items-center overflow-hidden bg-[--cr-bg] pt-16">
    ...
  </section>
);
```

Replace it with:
```tsx
return (
  <div ref={sectionRef} className={reducedMotion ? "min-h-[100dvh]" : "min-h-[250vh]"}>
    <section className="sticky top-0 h-[100dvh] overflow-hidden relative flex items-center bg-[--cr-bg] pt-16">
      ...existing content unchanged...
    </section>
  </div>
);
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
cd /home/ubuntu/projects/clinicrelay && npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add components/landing/hero.tsx
git commit -m "feat: wrap hero in 250vh scroll container with sticky panel"
```

---

### Task 3: Animate the overlay layers

**Files:**
- Modify: `components/landing/hero.tsx`

Convert the two overlay `<div>`s inside the background layer to `<motion.div>`s driven by `overlayOpacity`. Also raise the background image opacity from `opacity-35` to `opacity-60` so it reads clearly before the overlay fades in.

- [ ] **Step 1: Update background image opacity**

Find:
```tsx
className="object-cover object-center opacity-35"
```

Replace with:
```tsx
className="object-cover object-center opacity-60"
```

- [ ] **Step 2: Convert the white gradient div to a motion.div**

Find:
```tsx
<div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(245,250,255,0.96)_0%,rgba(245,250,255,0.88)_38%,rgba(245,250,255,0.64)_100%)]" />
```

Replace with:
```tsx
<motion.div
  style={{ opacity: overlayOpacity }}
  className="absolute inset-0 bg-[linear-gradient(90deg,rgba(245,250,255,0.96)_0%,rgba(245,250,255,0.88)_38%,rgba(245,250,255,0.64)_100%)]"
/>
```

- [ ] **Step 3: Convert the radial gradient div to a motion.div**

Find:
```tsx
<div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(13,148,136,0.14),transparent_30%),radial-gradient(circle_at_bottom_right,_rgba(59,130,246,0.12),transparent_28%)]" />
```

Replace with:
```tsx
<motion.div
  style={{ opacity: overlayOpacity }}
  className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(13,148,136,0.14),transparent_30%),radial-gradient(circle_at_bottom_right,_rgba(59,130,246,0.12),transparent_28%)]"
/>
```

- [ ] **Step 4: Verify TypeScript compiles**

```bash
cd /home/ubuntu/projects/clinicrelay && npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 5: Commit**

```bash
git add components/landing/hero.tsx
git commit -m "feat: animate hero overlay layers on scroll"
```

---

### Task 4: Animate the copy columns

**Files:**
- Modify: `components/landing/hero.tsx`

Wrap the left copy column and the right `HeroBento` column each in a `<motion.div>` driven by `copyOpacity`.

- [ ] **Step 1: Wrap the left copy column**

Find the opening of the left column `<div>` inside the grid:
```tsx
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[--cr-teal] mb-4">
```

Replace the opening `<div>` tag with:
```tsx
          <motion.div style={{ opacity: copyOpacity }}>
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[--cr-teal] mb-4">
```

And find the closing `</div>` that ends the left column (just before `<HeroBento ...>`):
```tsx
          </div>
          <HeroBento cards={heroData.bentoCards} />
```

Replace that closing tag:
```tsx
          </motion.div>
          <HeroBento cards={heroData.bentoCards} />
```

- [ ] **Step 2: Wrap HeroBento in a motion.div**

Find:
```tsx
          <HeroBento cards={heroData.bentoCards} />
```

Replace with:
```tsx
          <motion.div style={{ opacity: copyOpacity }}>
            <HeroBento cards={heroData.bentoCards} />
          </motion.div>
```

- [ ] **Step 3: Verify TypeScript compiles**

```bash
cd /home/ubuntu/projects/clinicrelay && npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 4: Run existing tests to confirm no regressions**

```bash
cd /home/ubuntu/projects/clinicrelay && npx vitest run
```

Expected: all tests pass.

- [ ] **Step 5: Commit**

```bash
git add components/landing/hero.tsx
git commit -m "feat: animate hero copy columns on scroll"
```

---

### Task 5: Manual browser verification

**Files:** none

Start the dev server and verify the animation end-to-end.

- [ ] **Step 1: Start dev server**

```bash
cd /home/ubuntu/projects/clinicrelay && npm run dev
```

Open `http://localhost:3000` in a browser.

- [ ] **Step 2: Verify initial state**

At page load (scroll position 0):
- Background image is clearly visible at `opacity-60`
- No white overlay is visible
- Copy (headline, subheadline, CTAs, badges) and bento card are not visible

- [ ] **Step 3: Verify overlay phase**

Scroll slowly from the top:
- Between scroll 0–45% through the hero's 250vh: white overlay and teal gradient fade in
- Background image becomes progressively dimmed behind the overlay

- [ ] **Step 4: Verify copy reveal phase**

- Between scroll 35–70% through the hero's 250vh: copy and bento card fade in
- Copy and overlay overlap their fade-in windows (copy starts appearing while overlay is still coming in)

- [ ] **Step 5: Verify full state**

After scrolling past 70% of hero scroll range:
- Everything fully visible — layout matches the pre-animation design exactly
- Page continues scrolling to the next section normally

- [ ] **Step 6: Verify layout of sections below hero**

Scroll past the hero and confirm:
- Trust section, process section, and other landing sections render without layout shift
- The extra `150vh` of scroll room is fully consumed before reaching the next section

- [ ] **Step 7: Final commit if any fixes were made during verification**

```bash
git add components/landing/hero.tsx
git commit -m "fix: hero scroll reveal manual verification fixes"
```

Only run this step if fixes were needed. Skip if no changes were made.
