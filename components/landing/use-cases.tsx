"use client";

import { useState } from "react";
import { Tooth, FirstAid, Eye, Bandaids } from "@phosphor-icons/react/dist/ssr";
import { AnimatedSection } from "./animated-section";
import { useCases } from "@/lib/content/clinicrelay-landing";
import { motion, AnimatePresence } from "framer-motion";

const iconMap: Record<string, React.ElementType> = { Tooth, FirstAid, Eye, Bandaids };

export function UseCases() {
  const [activeIndex, setActiveIndex] = useState(0);
  const active = useCases[activeIndex];

  return (
    <section className="py-24 md:py-32 bg-[--cr-bg]">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
        <AnimatedSection className="mb-14">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[--cr-teal] mb-3">Use Cases</p>
          <h2 className="text-3xl md:text-4xl tracking-tight font-semibold text-[--cr-text]">
            Built for appointment-based clinics.
          </h2>
        </AnimatedSection>

        <div className="flex flex-wrap gap-2 mb-8">
          {useCases.map((uc, i) => (
            <button
              key={uc.type}
              onClick={() => setActiveIndex(i)}
              className={`text-sm font-semibold px-4 py-2 rounded-full border transition-colors ${
                activeIndex === i
                  ? "bg-[--cr-teal] text-white border-[--cr-teal]"
                  : "bg-white text-[--cr-muted] border-[--cr-border] hover:border-[--cr-teal] hover:text-[--cr-teal]"
              }`}
            >
              {uc.type}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeIndex}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="grid gap-8 items-center rounded-[2rem] border border-[--cr-border] bg-white p-10 grid-cols-1 md:grid-cols-[1.4fr_1fr]"
            style={{ boxShadow: "var(--cr-shadow)" }}
          >
            <div>
              <UseCaseIcon icon={iconMap[active.icon]} />
              <h3 className="text-xl font-semibold text-[--cr-text] tracking-tight mb-2">{active.title}</h3>
              <p className="text-base text-[--cr-muted] leading-relaxed mb-4">{active.copy}</p>
              <div className="flex flex-wrap gap-2">
                {active.pills.map((pill) => (
                  <span key={pill} className="text-xs font-semibold px-3 py-1.5 rounded-full bg-white border border-[--cr-border] text-[--cr-muted] hover:border-[--cr-teal]">
                    {pill}
                  </span>
                ))}
              </div>
            </div>
            <div className="rounded-2xl bg-[--cr-surface-2] border border-[--cr-border] p-6 flex items-center justify-center min-h-[140px]">
              <p className="text-sm font-semibold text-[--cr-teal]">{active.type} Clinic Workflow</p>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}

function UseCaseIcon({ icon: Icon }: { icon: React.ElementType }) {
  return (
    <motion.div
      className="mb-4 inline-block"
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Icon size={32} weight="duotone" className="text-[--cr-teal]" />
    </motion.div>
  );
}
