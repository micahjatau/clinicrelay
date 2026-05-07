"use client";

import { useRef } from "react";
import { useScroll, useReducedMotion, motionValue, MotionValue } from "framer-motion";

/** Scroll progress thresholds for the 6-node waitlist recovery rail. */
export const WAITLIST_THRESHOLDS = [0, 0.16, 0.33, 0.5, 0.66, 0.83] as const;

/**
 * Returns how many nodes should be active given scroll progress.
 * Exported for unit testing.
 */
export function getActiveNodeCount(progress: number, thresholds: readonly number[]): number {
  return thresholds.filter((t) => progress >= t).length;
}

/**
 * Returns a MotionValue<number> in range 0–1 representing scroll progress
 * through the target element. Returns a static MotionValue of 1 when
 * prefers-reduced-motion is set.
 */
export function useScrollProgress(ref: React.RefObject<HTMLElement | null>): MotionValue<number> {
  const reducedMotion = useReducedMotion();
  const staticFull = useRef(motionValue(1));
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  return reducedMotion ? staticFull.current : scrollYProgress;
}
