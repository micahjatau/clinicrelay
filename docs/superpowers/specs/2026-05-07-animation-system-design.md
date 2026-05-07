# Animation System Design — ClinicRelay Landing Page

**Date:** 2026-05-07
**Status:** Approved

---

## Overview

A full-page animation system for the ClinicRelay landing page. The guiding principle from `motion.md` is: **animate the workflow, not the decoration.** Every animation should answer "what is happening inside the clinic workflow?" — if it doesn't, it gets cut.

The system extends the existing `AnimatedSection` primitive with two focused hooks and per-section Framer Motion logic. No global animation context, no variant registry, no new dependencies.

---

## Architecture

```
components/landing/
  animated-section.tsx          ← unchanged
  hooks/
    use-count-up.ts             ← new
    use-scroll-progress.ts      ← new
  hero-bento.tsx                ← upgraded
  waitlist-section.tsx          ← upgraded
  metrics-section.tsx           ← upgraded
  faq-section.tsx               ← progressively enhanced
  [all other sections]          ← AnimatedSection + inline Framer Motion
```

Two hooks are the only shared primitives. All other animation logic is local to each component. No new client boundaries are introduced — all upgraded components are already `"use client"`.

---

## New Hooks

### `use-count-up.ts`

```ts
useCountUp(target: number, inView: boolean, duration?: number): number
```

- Animates from `0` to `target` over `duration` (default 1.4s) using `requestAnimationFrame` with ease-out curve
- Activates when `inView` flips to `true`
- Calls `useReducedMotion()` — if true, returns `target` immediately
- Returns current display value as a number
- Pure: no side effects beyond animation state

### `use-scroll-progress.ts`

```ts
useScrollProgress(ref: RefObject<HTMLElement>): MotionValue<number>
```

- Wraps Framer Motion's `useScroll({ target: ref, offset: ["start end", "end start"] })`
- Returns a `MotionValue<number>` in range 0–1
- Calls `useReducedMotion()` — if true, returns a static `MotionValue` of `1` (all nodes shown immediately)
- The consumer (WaitlistSection) maps progress to node activation thresholds

---

## Section-by-Section Plan

### Priority 1 — Hero (`hero-bento.tsx`)

**Current:** rotating card highlight on a 2s interval.

**Upgraded:** scroll-triggered 7-step recovery sequence, plays once.

Sequence (each step +0.6s delay):
1. Slot card: status badge morphs `Cancelled` (red) → shows
2. Waitlist card: slides in, "3 matches" highlights
3. Top candidate card: border → teal
4. SMS bubble: types in "Earlier visit available"
5. Patient reply appears: "Yes, I can make it"
6. Staff task card appears: "Confirm refill"
7. Slot card: badge morphs → green "Refilled", soft glow once

- The existing 2s interval rotator is removed
- Total sequence: ~4.2s (within motion.md's 5s budget)
- `useReducedMotion()` → skip to final state immediately

### Priority 2 — Waitlist Recovery (`waitlist-section.tsx`)

A horizontal 6-node rail added to the section. `useScrollProgress` drives activation.

Nodes: Cancellation → Match → Offer → Reply → Confirm → Refill

- Progress line: `scaleX` 0→1 mapped from scroll 0→1, `transformOrigin: left`
- Each node activates at thresholds: 0, 0.16, 0.33, 0.5, 0.66, 0.83
- Active node: circle `scale` 0.9→1, fill slate→teal, label fades in
- SMS bubble: slides from node 3 to node 4 when threshold 0.5 crosses
- `useReducedMotion()` → all nodes shown active immediately

### Priority 3 — Dashboard Mockup (`dashboard-mockup.tsx`)

- Metric cards: inline count-up on section entry using a local RAF loop (small integers 0–9, `useCountUp` hook is not used here — overhead not warranted for single-digit values)
- "New reply received" toast: appears 1.2s after section entry, fades out at 3.7s, plays once
- Queue rows: staggered `opacity` + `y` fade-in on entry (same pattern as `AnimatedSection`)

### Priority 4 — Pre-Visit Readiness (`pre-visit-readiness.tsx`)

- Each feature card: `whileHover={{ y: -2 }}` on the card wrapper
- Icon: `whileHover={{ y: -3 }}` translate (2–4px per motion.md)
- Card border: `whileHover` changes from `--cr-border` → `--cr-teal` via CSS variable transition
- No structural change — add `motion.div` wrappers around existing card divs

### Priority 5 — Metrics (`metrics-section.tsx`)

- Section header `ref` passed to `useInView({ once: true })`
- `inView` passed to `useCountUp(target, inView)` for each metric value
- Progress bars: `motion.div` with `scaleX: 0→1`, `transformOrigin: left`, triggered same `inView`

### Remaining Sections

| Section | Animation |
|---------|-----------|
| `ProblemSection` | Already staggered. Add icon `y: 4→0, opacity: 0→1` once on entry per card |
| `ProductWorkflow` | Already staggered. Add vertical connecting line `scaleY: 0→1` between steps |
| `FeatureGrid` | `whileHover`: card border → teal, icon `y: -3px` |
| `GrowthSection` | Pillar cards: staggered `scaleY` reveal as each enters view |
| `WebServices` | Before/after: CSS `clip-path` reveal (left panel) on scroll entry |
| `UseCases` | Tab content swap: `AnimatePresence` `mode="wait"` crossfade |
| `TrustSection` | Slow `opacity` fade only, no structural change |
| `PricingSection` | Recommended plan: single soft `scale` pulse on entry. All cards: `whileHover` lift |
| `ProcessSection` | Vertical timeline line `scaleY: 0→1` on scroll. Each step staggered fade |
| `FaqSection` | `toggle` event listener: drives chevron `rotate(45deg)` and content `opacity` fade |
| `FinalCta` | 4-step mini loop (Cancelled→Offer→Confirm→Refilled), 3s cycle, `repeat: Infinity`, subtle |

---

## Performance Constraints

- **Animate only** `transform` and `opacity` — no `width`, `height`, `padding`, `margin`, `font-size`
- Exception: FAQ height uses Framer Motion `height: "auto"` (FLIP-safe)
- **Hero sequence budget:** ≤5s total
- **Infinite loops:** only the teal pulse dot on active hero card, and `FinalCta` mini loop
- **All others:** play once, hold final state
- **Bundle:** no new dependencies — Framer Motion v12 already installed. Hook additions ~1–2KB

---

## Reduced Motion

Each animated component calls `useReducedMotion()` independently (per-component pattern, consistent with existing `AnimatedSection`).

| Component | Reduced motion behaviour |
|-----------|--------------------------|
| `AnimatedSection` | Skips translate, fades only (already implemented) |
| Hero sequence | Skips to final state immediately |
| Waitlist rail | All nodes shown active, no line animation |
| Count-up | Returns `target` immediately |
| Scroll progress | Returns static `MotionValue(1)` |
| FAQ enhancement | Toggle is instant |
| All `whileHover` | No change — hover is not motion-sensitive |

---

## Testing

### Unit tests (Vitest)

- `useCountUp`: test easing math and return values in isolation (pure function, no DOM)
- `useScrollProgress` threshold map: test the 0–1 → node-index mapping function

### Visual (manual)

- Each section verified at: before entry, mid-animation, final state
- Reduced motion: DevTools `prefers-reduced-motion: reduce` → all sections in final state immediately
- No layout shift: Chrome DevTools Performance, CLS < 0.1

### E2E (Playwright)

No new E2E tests. Animation is progressive enhancement — existing smoke tests cover page render and CTA reachability.

### Build gate

`npm run build` and `npm run lint` must pass clean before merging.
