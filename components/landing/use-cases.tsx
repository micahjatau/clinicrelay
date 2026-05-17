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
            whileHover={{ y: -4 }}
            transition={{ type: "spring", stiffness: 120, damping: 20 }}
            className="group grid gap-8 overflow-hidden rounded-[2rem] border border-[--cr-border] bg-white p-6 md:p-8 lg:p-10 grid-cols-1 md:grid-cols-[1.05fr_0.95fr]"
            style={{ boxShadow: "var(--cr-shadow)" }}
          >
            <div className="flex flex-col justify-center">
              <UseCaseIcon icon={iconMap[active.icon]} />
              <h3 className="text-xl md:text-2xl font-semibold text-[--cr-text] tracking-tight mb-2">{active.title}</h3>
              <p className="text-base text-[--cr-muted] leading-relaxed mb-5 max-w-[58ch]">{active.copy}</p>
              <div className="flex flex-wrap gap-2">
                {active.pills.map((pill) => (
                  <span key={pill} className="text-xs font-semibold px-3 py-1.5 rounded-full bg-white border border-[--cr-border] text-[--cr-muted] transition-colors duration-300 group-hover:border-[--cr-teal]/40">
                    {pill}
                  </span>
                ))}
              </div>
            </div>
            <div className="relative min-h-[230px] overflow-hidden rounded-[1.5rem] border border-[--cr-border] bg-[--cr-surface-2] md:min-h-[320px]">
              <img
                src={active.image.src}
                alt={active.image.alt}
                loading="lazy"
                decoding="async"
                className="h-full w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105"
                style={{ objectPosition: active.image.position ?? "center" }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0d1f1d]/70 via-[#0d1f1d]/10 to-transparent opacity-80 transition-opacity duration-500 group-hover:opacity-65" />
              <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-3">
                <div className="rounded-full border border-white/20 bg-white/90 px-3 py-1.5 shadow-[0_12px_30px_-18px_rgba(13,31,29,0.8)] backdrop-blur-sm transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-1">
                  <p className="text-xs font-semibold text-[--cr-text]">{active.type} clinic workflow</p>
                </div>
                {active.image.credit ? (
                  <p className="max-w-[15ch] text-right text-[10px] font-medium leading-tight text-white/80">
                    {active.image.credit}
                  </p>
                ) : null}
              </div>
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
