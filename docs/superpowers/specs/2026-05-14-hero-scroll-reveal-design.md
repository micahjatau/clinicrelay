# Hero Pinned Scroll Reveal

**Date:** 2026-05-14  
**Status:** Approved

## Summary

Add a cinematic scroll-driven reveal to the landing page hero. The background image is shown prominently on page load; as the user scrolls, an overlay fades in (dimming the image) and the copy fades in on top. The hero section is pinned (sticky) so the visual panel stays in the viewport while the animation plays, then normal page scroll resumes.

## Scroll Phase Map

| Scroll progress | Effect |
|---|---|
| `0.0` | Background image visible at full opacity. Overlay = transparent. Copy = invisible. |
| `0.0 → 0.45` | White overlay + gradient fades in; background image dims behind it |
| `0.35 → 0.70` | Copy (eyebrow, h1, subheadline, CTAs, badges) and bento card column fade in |
| `0.70+` | Everything fully visible; user scrolls off the hero into the next section |

## Architecture

### Scroll container

The outer `<section>` grows to `min-h-[250vh]`. This provides ~150vh of "scroll room" while the sticky panel plays the animation.

### Sticky panel

An inner `<div>` with `sticky top-0 h-[100dvh] overflow-hidden` holds all existing visual layers. It stays fixed in the viewport while the scroll container advances beneath it.

### Motion values

- `scrollYProgress` — from `useScroll({ target: outerRef, offset: ["start start", "end start"] })`
- `overlayOpacity` — `useTransform(scrollYProgress, [0, 0.45], [0, 1])`
- `copyOpacity` — `useTransform(scrollYProgress, [0.35, 0.70], [0, 1])`

### Background image

Changed from `opacity-35` to `opacity-60` so it reads clearly before the overlay fades in.

### Overlay layer

The existing white gradient `<div>` is converted to a `<motion.div>` driven by `overlayOpacity`. At scroll 0 it is fully transparent; by scroll 0.45 it is at its designed opacity.

### Copy column

The left-column content wrapper and the right-column `HeroBento` are each wrapped in a `<motion.div style={{ opacity: copyOpacity }}>` so both reveal together.

## Files Changed

- `components/landing/hero.tsx` — all changes contained here; convert to `"use client"`

## Reduced Motion

When `useReducedMotion()` returns true, `overlayOpacity` and `copyOpacity` are set to static `motionValue(1)` so everything is immediately visible. The outer section reverts to `min-h-[100dvh]`.

## Edge Cases

- **Mobile** — `250vh` provides sufficient scroll room on all viewport heights.
- **No JS** — Content is always present in the DOM; only opacity is animated, so content is accessible even if JS fails to hydrate.
