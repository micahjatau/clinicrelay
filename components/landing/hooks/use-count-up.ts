"use client";

import { useState, useEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";

/** Pure easing + value function — exported for testing. */
export function computeCountUpValue(target: number, progress: number): number {
  const clamped = Math.min(Math.max(progress, 0), 1);
  const eased = 1 - Math.pow(1 - clamped, 3); // ease-out cubic
  return Math.round(eased * target);
}

/**
 * Animates a counter from 0 to `target` when `inView` becomes true.
 * Respects prefers-reduced-motion — returns `target` immediately if set.
 */
export function useCountUp(target: number, inView: boolean, duration = 1400): number {
  const [value, setValue] = useState(0);
  const reducedMotion = useReducedMotion();
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (!inView) return;
    if (reducedMotion) {
      setValue(target);
      return;
    }
    const start = performance.now();
    function tick(now: number) {
      const elapsed = now - start;
      setValue(computeCountUpValue(target, elapsed / duration));
      if (elapsed < duration) {
        rafRef.current = requestAnimationFrame(tick);
      }
    }
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [inView, target, duration, reducedMotion]);

  return value;
}
