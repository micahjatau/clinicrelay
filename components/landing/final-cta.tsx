"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { FinalCtaButtons } from "./final-cta-buttons";

const LOOP_STEPS = [
  { label: "Slot cancelled", color: "bg-red-500/20 text-red-300" },
  { label: "Waitlist offer sent", color: "bg-amber-500/20 text-amber-300" },
  { label: "Patient confirmed", color: "bg-teal-500/20 text-teal-300" },
  { label: "Slot refilled", color: "bg-green-500/20 text-green-300" },
] as const;

export function FinalCta() {
  const [step, setStep] = useState(0);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    if (shouldReduceMotion) return;
    const id = setInterval(() => setStep((s) => (s + 1) % LOOP_STEPS.length), 3000);
    return () => clearInterval(id);
  }, [shouldReduceMotion]);

  const current = shouldReduceMotion ? LOOP_STEPS[3] : LOOP_STEPS[step];

  return (
    <section className="py-28 md:py-36 bg-[#0F172A]">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10 text-center">
        <div className="flex items-center justify-center gap-2 mb-8 h-7">
          <AnimatePresence mode="wait">
            <motion.span
              key={current.label}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.25 }}
              className={`text-xs font-semibold px-3 py-1 rounded-full ${current.color}`}
            >
              {current.label}
            </motion.span>
          </AnimatePresence>
        </div>

        <h2 className="text-4xl md:text-6xl tracking-tighter font-semibold text-white mb-6 max-w-[18ch] mx-auto leading-none">
          Stop letting front-desk chaos leak revenue.
        </h2>
        <p className="text-base text-white/75 mb-10 max-w-[56ch] mx-auto leading-relaxed">
          Start with a workflow audit. We&apos;ll identify where cancellations, missed follow-up, and manual coordination are costing your clinic time and capacity.
        </p>
        <FinalCtaButtons />
      </div>
    </section>
  );
}
