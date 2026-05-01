"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import type { HeroData } from "@/lib/content/clinicrelay-landing";

type Props = { cards: HeroData["bentoCards"] };

export function HeroBento({ cards }: Props) {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setActiveIndex((i) => (i + 1) % cards.length), 2000);
    return () => clearInterval(id);
  }, [cards.length]);

  return (
    <div className="flex flex-col gap-3 pt-8 md:pt-0">
      {cards.map((card, i) => (
        <motion.div
          key={card.step}
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ type: "spring", stiffness: 80, damping: 20, delay: i * 0.12 }}
        >
          <motion.div
            className="rounded-2xl border border-[--cr-border] bg-white p-4 flex items-center gap-4"
            animate={{
              boxShadow:
                activeIndex === i
                  ? "0 8px 24px -4px rgba(13,148,136,0.18)"
                  : "var(--cr-shadow)",
              borderColor: activeIndex === i ? "var(--cr-teal)" : "var(--cr-border)",
            }}
            transition={{ duration: 0.3 }}
          >
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
              style={{
                background: activeIndex === i ? "var(--cr-teal)" : "var(--cr-surface-2)",
                color: activeIndex === i ? "white" : "var(--cr-muted)",
              }}
            >
              {card.step}
            </div>
            <div>
              <p className="text-sm font-semibold text-[--cr-text]">{card.label}</p>
              <p className="text-xs text-[--cr-muted]">{card.detail}</p>
            </div>
            {activeIndex === i && (
              <motion.div
                className="ml-auto w-2 h-2 rounded-full bg-[--cr-teal]"
                animate={{ scale: [1, 1.4, 1] }}
                transition={{ repeat: Infinity, duration: 1.2 }}
              />
            )}
          </motion.div>
        </motion.div>
      ))}
    </div>
  );
}
