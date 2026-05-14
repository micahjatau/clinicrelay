"use client";

import { useEffect, useState, memo } from "react";
import { motion, useReducedMotion } from "framer-motion";
import type { HeroData } from "@/lib/content/clinicrelay-landing";

// Per-step status theme — drives badge, border, shadow, and shimmer colors
const STEP_THEMES = [
  {
    // Step 1 — Cancelled Slot Detected
    badgeBg: "#DC2626",
    border: "rgba(220, 38, 38, 0.28)",
    shadow:
      "0 0 0 1px rgba(220,38,38,0.09), 0 8px 28px -4px rgba(220,38,38,0.13), inset 0 1px 0 rgba(255,255,255,0.92)",
    shimmer: "rgba(220, 38, 38, 0.07)",
    radial:
      "radial-gradient(ellipse at 92% 12%, rgba(220,38,38,0.05) 0%, transparent 62%)",
  },
  {
    // Step 2 — Eligible Patient Matched
    badgeBg: "#0D9488",
    border: "rgba(13, 148, 136, 0.30)",
    shadow:
      "0 0 0 1px rgba(13,148,136,0.09), 0 8px 28px -4px rgba(13,148,136,0.13), inset 0 1px 0 rgba(255,255,255,0.92)",
    shimmer: "rgba(13, 148, 136, 0.08)",
    radial:
      "radial-gradient(ellipse at 92% 12%, rgba(13,148,136,0.05) 0%, transparent 62%)",
  },
  {
    // Step 3 — Recovery Offer Routed
    badgeBg: "#D97706",
    border: "rgba(217, 119, 6, 0.26)",
    shadow:
      "0 0 0 1px rgba(217,119,6,0.08), 0 8px 28px -4px rgba(217,119,6,0.11), inset 0 1px 0 rgba(255,255,255,0.92)",
    shimmer: "rgba(217, 119, 6, 0.07)",
    radial:
      "radial-gradient(ellipse at 92% 12%, rgba(217,119,6,0.04) 0%, transparent 62%)",
  },
  {
    // Step 4 — Patient Reply Captured
    badgeBg: "#16A34A",
    border: "rgba(22, 163, 74, 0.30)",
    shadow:
      "0 0 0 1px rgba(22,163,74,0.09), 0 8px 28px -4px rgba(22,163,74,0.13), inset 0 1px 0 rgba(255,255,255,0.92)",
    shimmer: "rgba(22, 163, 74, 0.08)",
    radial:
      "radial-gradient(ellipse at 92% 12%, rgba(22,163,74,0.05) 0%, transparent 62%)",
  },
  {
    // Step 5 — Staff Confirms Refill (success)
    badgeBg: "#16A34A",
    border: "rgba(22, 163, 74, 0.42)",
    shadow:
      "0 0 0 1px rgba(22,163,74,0.14), 0 12px 36px -4px rgba(22,163,74,0.20), 0 0 0 4px rgba(22,163,74,0.05), inset 0 1px 0 rgba(255,255,255,0.92)",
    shimmer: "rgba(22, 163, 74, 0.09)",
    radial:
      "radial-gradient(ellipse at 50% 50%, rgba(22,163,74,0.07) 0%, transparent 75%)",
  },
] as const;

const IDLE_BORDER = "rgba(15, 118, 110, 0.10)";
const IDLE_SHADOW =
  "0 20px 40px -15px rgba(13, 148, 136, 0.07), inset 0 1px 0 rgba(255,255,255,0.92)";

// ─── Isolated perpetual shimmer ───────────────────────────────────────────────
// Memo prevents parent re-renders from resetting the animation loop
const CardShimmer = memo(function CardShimmer({ color }: { color: string }) {
  return (
    <div className="absolute inset-0 overflow-hidden rounded-2xl pointer-events-none">
      <motion.div
        className="absolute inset-y-0 w-1/3"
        style={{
          background: `linear-gradient(90deg, transparent 0%, ${color} 50%, transparent 100%)`,
        }}
        animate={{ x: ["-100%", "400%"] }}
        transition={{
          repeat: Infinity,
          duration: 3.2,
          ease: "linear",
          repeatDelay: 1.4,
        }}
      />
    </div>
  );
});

// ─── Isolated perpetual pulse dot ────────────────────────────────────────────
const StatusDot = memo(function StatusDot({ color }: { color: string }) {
  return (
    <motion.div
      className="ml-auto w-2 h-2 rounded-full shrink-0"
      style={{ background: color }}
      animate={{ scale: [1, 1.5, 1], opacity: [1, 0.65, 1] }}
      transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
    />
  );
});

type Props = { cards: HeroData["bentoCards"] };

export function HeroBento({ cards }: Props) {
  const [activeIndex, setActiveIndex] = useState(-1);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    if (shouldReduceMotion) {
      setActiveIndex(cards.length - 1);
      return;
    }
    // Stagger each card lighting up — 700ms after mount, then every 640ms
    const timeouts = cards.map((_, i) =>
      setTimeout(() => setActiveIndex(i), 700 + i * 640)
    );
    return () => timeouts.forEach(clearTimeout);
  }, [shouldReduceMotion, cards.length]);

  return (
    <div className="relative">
      {/* Radial teal glow behind the card stack */}
      <div
        aria-hidden="true"
        className="absolute pointer-events-none -z-10"
        style={{
          inset: "-56px -40px",
          background:
            "radial-gradient(ellipse at 58% 50%, rgba(13, 148, 136, 0.11) 0%, transparent 68%)",
        }}
      />
      {/* Dot-grid texture */}
      <div
        aria-hidden="true"
        className="absolute pointer-events-none -z-10"
        style={{
          inset: "-56px -40px",
          backgroundImage:
            "radial-gradient(circle, rgba(13, 148, 136, 0.14) 1px, transparent 1px)",
          backgroundSize: "20px 20px",
          opacity: 0.42,
        }}
      />

      <div className="flex flex-col gap-3 pt-8 md:pt-0">
        {cards.map((card, i) => {
          const theme = STEP_THEMES[i] ?? STEP_THEMES[STEP_THEMES.length - 1];
          const isActive = activeIndex >= i;
          const isCurrent = activeIndex === i;
          const isLast = i === cards.length - 1 && isActive;

          return (
            // Outer wrapper: handles staggered entrance animation only
            <motion.div
              key={card.step}
              initial={shouldReduceMotion ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.5,
                ease: [0.22, 1, 0.36, 1] as const,
                delay: i * 0.1,
              }}
            >
              {/* Inner card: handles status state + hover interaction */}
              <motion.div
                className="relative rounded-2xl border flex items-center gap-4 p-4 overflow-hidden"
                style={{
                  background: isActive
                    ? `${theme.radial}, linear-gradient(148deg, #ffffff 0%, #f7fbfa 100%)`
                    : "linear-gradient(148deg, #ffffff 0%, #f7fbfa 100%)",
                }}
                animate={{
                  borderColor: isActive ? theme.border : IDLE_BORDER,
                  boxShadow: isActive ? theme.shadow : IDLE_SHADOW,
                }}
                whileHover={
                  shouldReduceMotion
                    ? undefined
                    : {
                        y: -3,
                        scale: 1.01,
                        transition: {
                          duration: 0.22,
                          ease: [0.22, 1, 0.36, 1] as const,
                        },
                      }
                }
                transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] as const }}
              >
                {/* Shimmer — current step only, isolated to prevent re-renders */}
                {isCurrent && !shouldReduceMotion && (
                  <CardShimmer color={theme.shimmer} />
                )}

                {/* Step badge */}
                <motion.div
                  className="relative z-10 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
                  animate={{
                    backgroundColor: isActive ? theme.badgeBg : "#f0fdfa",
                    color: isActive ? "#ffffff" : "#4b7a72",
                  }}
                  transition={{ duration: 0.28 }}
                >
                  {card.step}
                </motion.div>

                {/* Label + detail */}
                <div className="relative z-10 min-w-0 flex-1">
                  <p className="text-sm font-semibold text-[--cr-text] leading-snug">
                    {card.label}
                  </p>
                  <p className="text-xs text-[--cr-muted] mt-0.5">{card.detail}</p>
                </div>

                {/* Status indicator */}
                {isCurrent && !isLast && !shouldReduceMotion && (
                  <StatusDot color={theme.badgeBg} />
                )}
                {isLast && (
                  <motion.div
                    className="ml-auto w-2 h-2 rounded-full shrink-0"
                    style={{ background: "#22C55E" }}
                    initial={{ scale: 0 }}
                    animate={{ scale: [0, 1.7, 1] }}
                    transition={{
                      duration: 0.45,
                      ease: [0.22, 1, 0.36, 1] as const,
                    }}
                  />
                )}

                {/* Thin progress line — fills from left using scaleX (GPU-friendly) */}
                {isActive && (
                  <motion.div
                    className="absolute bottom-0 left-0 right-0 h-[1.5px] origin-left pointer-events-none"
                    style={{ background: theme.badgeBg, opacity: 0.45 }}
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{
                      duration: 0.55,
                      ease: [0.22, 1, 0.36, 1] as const,
                    }}
                  />
                )}
              </motion.div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
