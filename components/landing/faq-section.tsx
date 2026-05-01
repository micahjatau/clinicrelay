"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus } from "@phosphor-icons/react";
import { faqItems } from "@/lib/content/clinicrelay-landing";

export function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="py-24 md:py-32 bg-white">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
        <div className="mb-14">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[--cr-teal] mb-3">FAQ</p>
          <h2 className="text-3xl md:text-4xl tracking-tight font-semibold text-[--cr-text]">Common questions.</h2>
        </div>
        <div className="max-w-3xl divide-y divide-[--cr-border]">
          {faqItems.map((item, i) => (
            <div key={i}>
              <button
                className="w-full flex items-center justify-between py-5 text-left gap-4"
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                aria-expanded={openIndex === i}
              >
                <span className="text-base font-semibold text-[--cr-text] tracking-tight">{item.question}</span>
                {openIndex === i
                  ? <Minus size={18} className="text-[--cr-teal] shrink-0" />
                  : <Plus size={18} className="text-[--cr-muted] shrink-0" />
                }
              </button>
              <AnimatePresence initial={false}>
                {openIndex === i && (
                  <motion.div
                    key="content"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    className="overflow-hidden"
                  >
                    <p className="text-base text-[--cr-muted] leading-relaxed pb-5">{item.answer}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
