# Hero Redesign — Standard Viewport, Immediate Mount

**Date:** 2026-05-14
**Status:** Approved

## Summary

Replace the scroll-pinned 250vh hero with a standard single-viewport hero. Content is visible immediately on page load. Animation priority shifts from atmospheric scroll theatre to crisp mount-in stagger that puts the message first.

## Section 1 — Hero Structure

- Outer container: `min-h-[100dvh]` (remove the 250vh scroll container)
- Inner section: `sticky` and scroll listener removed; standard block layout
- Remove all motion values: `useMotionValue`, `useTransform`, `navOpacity`, `overlayOpacity`, `copyOpacity`, `contentY`, `rotationX`, scroll `useEffect`
- Remove framer-motion imports that are no longer needed
- Section padding: `pt-10 md:pt-16`
- Content padding: `py-12 md:py-20` (down from `py-28 md:py-36`)

## Section 2 — Background Treatment

- Image container: `absolute inset-0` (full-bleed, no padding, no border radius)
- Image: `object-cover`, `opacity-[0.08]`, `style={{ filter: "blur(1px)" }}`
- White gradient overlay: static `<div>` (no motion), fixed opacity — `bg-[linear-gradient(90deg,rgba(245,250,255,0.96)_0%,rgba(245,250,255,0.88)_38%,rgba(245,250,255,0.64)_100%)]`
- Remove radial gradient overlay entirely
- No animation on any background layer

## Section 3 — Copy Animation

Each copy block gets an individual `<motion.div>` with:

```
initial={{ opacity: 0, y: 12 }}
animate={{ opacity: 1, y: 0 }}
transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1], delay: n * 0.1 }}
```

Stagger order:

| Element | Delay |
|---|---|
| Eyebrow | 0s |
| h1 | 0.1s |
| Subcopy | 0.2s |
| CTAs + trust line | 0.3s |
| Badges | 0.4s |
| HeroBento (right column wrapper) | 0.2s |

The `HeroBento` component already manages its own internal card stagger via `useInView`. With a standard viewport hero, `inView` fires immediately on load — no changes needed inside `hero-bento.tsx`. The `delay: 0.2` above applies only to the `<motion.div>` wrapper around `<HeroBento>` in `hero.tsx`.

No blur, no scale, no perspective, no rotateX on any element.

`useReducedMotion`: when true, skip all motion — render everything at final opacity/position immediately.

## Section 4 — CTA Prominence

- Primary: "Book a Workflow Audit" — `h-10 px-6`, teal fill (`bg-[#0F766E] text-white hover:bg-[#115e59]`)
- Secondary: "See How Recovery Works" — outline/ghost style next to primary
- Mobile: stack vertically, primary on top, full width
- Rebuild CTA layout inline in `hero.tsx` (remove `HeroCtaButtons` component reference or update it) so stagger delay applies correctly

## Section 5 — Nav

- Remove `navOpacity` state, scroll listener, and `motion.header`
- Replace with plain `<header>` — `bg-white border-b border-[--cr-border]`, always visible
- No fade-in, no opacity animation
- Mobile structure unchanged (logo + hamburger → drawer)

## Files Changed

- `components/landing/hero.tsx` — full rework (scroll machinery removed, mount animations, background treatment, CTA layout)
- `components/landing/nav.tsx` — remove motion + opacity state, plain header
- `components/landing/hero-cta-buttons.tsx` — update CTA styling/layout if needed

## Reduced Motion

When `useReducedMotion()` returns true in `hero.tsx`, render all elements at `opacity: 1, y: 0` with no transition — skip the stagger entirely.
