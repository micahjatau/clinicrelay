"use client";

import { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { faqItems } from "@/lib/content/clinicrelay-landing";

function FaqItem({ question, answer }: { question: string; answer: string }) {
  const detailsRef = useRef<HTMLDetailsElement>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const el = detailsRef.current;
    if (!el) return;
    const handler = () => setOpen(el.open);
    el.addEventListener("toggle", handler);
    return () => el.removeEventListener("toggle", handler);
  }, []);

  return (
    <details ref={detailsRef} className="group py-2">
      <summary className="w-full list-none cursor-pointer flex items-center justify-between py-4 text-left gap-4">
        <span className="text-base font-semibold text-[--cr-text] tracking-tight">{question}</span>
        <motion.span
          className="text-[--cr-muted] shrink-0 text-lg leading-none select-none"
          animate={{ rotate: open ? 45 : 0, color: open ? "var(--cr-teal)" : "var(--cr-muted)" }}
          transition={{ duration: 0.2 }}
        >
          +
        </motion.span>
      </summary>
      <motion.div
        initial={false}
        animate={{ opacity: open ? 1 : 0, height: open ? "auto" : 0 }}
        transition={{ duration: 0.25, ease: "easeInOut" }}
        className="overflow-hidden"
      >
        <p className="text-base text-[--cr-muted] leading-relaxed pb-5">{answer}</p>
      </motion.div>
    </details>
  );
}

export function FaqSection() {
  return (
    <section id="faq" className="py-24 md:py-32 bg-white">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
        <div className="mb-14">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[--cr-teal] mb-3">FAQ</p>
          <h2 className="text-3xl md:text-4xl tracking-tight font-semibold text-[--cr-text]">Common questions.</h2>
        </div>
        <div className="max-w-3xl mx-auto rounded-2xl border border-[--cr-border] bg-[--cr-surface-2] px-6 md:px-8 py-3 divide-y divide-[--cr-border]">
          {faqItems.map((item, i) => (
            <FaqItem key={i} question={item.question} answer={item.answer} />
          ))}
        </div>
      </div>
    </section>
  );
}
