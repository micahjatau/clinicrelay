"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import type { HeroData } from "@/lib/content/clinicrelay-landing";

type Props = { cards: HeroData["bentoCards"] };

export function HeroBento({ cards }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px" });
  const shouldReduceMotion = useReducedMotion();
  const [activeIndex, setActiveIndex] = useState(-1);

  useEffect(() => {
    if (!inView) return;
    if (shouldReduceMotion) {
      setActiveIndex(cards.length - 1);
      return;
    }
    const timeouts = cards.map((_, i) =>
      setTimeout(() => setActiveIndex(i), i * 600)
    );
    return () => timeouts.forEach(clearTimeout);
  }, [inView, shouldReduceMotion, cards.length]);

  const isLast = (i: number) => i === cards.length - 1 && activeIndex === cards.length - 1;

  return (
    <div ref={ref} className="flex flex-col gap-3 pt-8 md:pt-0">
      {cards.map((card, i) => {
        const isActive = activeIndex >= i;
        const isCurrent = activeIndex === i;
        const last = isLast(i);
        return (
          <motion.div
            key={card.step}
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ type: "spring", stiffness: 80, damping: 20, delay: i * 0.12 }}
          >
            <motion.div
              className="rounded-2xl border border-[--cr-border] bg-white p-4 flex items-center gap-4"
              animate={{
                boxShadow: last
                  ? "0 8px 24px -4px rgba(22,163,74,0.22)"
                  : isActive
                  ? "0 8px 24px -4px rgba(13,148,136,0.18)"
                  : "var(--cr-shadow)",
                borderColor: last
                  ? "var(--cr-success)"
                  : isActive
                  ? "var(--cr-teal)"
                  : "var(--cr-border)",
              }}
              transition={{ duration: 0.3 }}
            >
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 transition-colors duration-300"
                style={{
                  background: last
                    ? "var(--cr-success)"
                    : isActive
                    ? "var(--cr-teal)"
                    : "var(--cr-surface-2)",
                  color: isActive ? "white" : "var(--cr-muted)",
                }}
              >
                {card.step}
              </div>
              <div>
                <p className="text-sm font-semibold text-[--cr-text]">{card.label}</p>
                <p className="text-xs text-[--cr-muted]">{card.detail}</p>
              </div>
              {isCurrent && !last && (
                <motion.div
                  className="ml-auto w-2 h-2 rounded-full bg-[--cr-teal]"
                  animate={{ scale: [1, 1.4, 1] }}
                  transition={{ repeat: Infinity, duration: 1.2 }}
                />
              )}
              {last && (
                <motion.div
                  className="ml-auto w-2 h-2 rounded-full bg-[--cr-success]"
                  initial={{ scale: 0 }}
                  animate={{ scale: [0, 1.6, 1] }}
                  transition={{ duration: 0.4 }}
                />
              )}
            </motion.div>
          </motion.div>
        );
      })}
    </div>
  );
}
