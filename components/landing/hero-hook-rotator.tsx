"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const hooks = [
  "Fill canceled slots faster.",
  "Front-desk orchestration that keeps every day on track.",
  "Patient readiness before they arrive.",
  "Scheduling that stays full, balanced, and predictable.",
];

export function HeroHookRotator() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % hooks.length);
    }, 2600);
    return () => clearInterval(id);
  }, []);

  return (
    <div aria-live="polite" className="relative h-[7.25rem] md:h-[12rem] mb-8 md:mb-10">
      <AnimatePresence mode="wait">
        <motion.h1
          key={hooks[index]}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-0 text-4xl md:text-6xl tracking-tighter font-semibold text-[--cr-text] leading-[0.95]"
        >
          {hooks[index]}
        </motion.h1>
      </AnimatePresence>
    </div>
  );
}
