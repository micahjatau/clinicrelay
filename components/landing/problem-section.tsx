"use client";

import { CalendarX, Phone, ClockClockwise, ChartLineDown, ShieldWarning, ArrowsSplit } from "@phosphor-icons/react/dist/ssr";
import { AnimatedSection } from "./animated-section";
import { painCards } from "@/lib/content/clinicrelay-landing";
import { motion, useReducedMotion } from "framer-motion";

const iconMap: Record<string, React.ElementType> = {
  CalendarX,
  Phone,
  ClockClockwise,
  ChartLineDown,
  ShieldWarning,
  ArrowsSplit,
};

const pressureSignals = [
  { label: "Missed callback", x: "8%", y: "18%", delay: 0 },
  { label: "Coverage check", x: "58%", y: "11%", delay: 0.18 },
  { label: "Open slot", x: "52%", y: "70%", delay: 0.36 },
] as const;

export function ProblemSection() {
  const reduceMotion = useReducedMotion();

  return (
    <section id="product" className="py-28 md:py-36 bg-white">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_0.82fr] gap-14 lg:gap-20 items-start">
          <div>
            <AnimatedSection className="mb-14">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[--cr-teal] mb-3">The Problem</p>
              <h2 className="text-3xl md:text-5xl tracking-tighter font-semibold text-[--cr-text] max-w-[18ch]">
                Your clinic is not just losing time. It is leaking capacity.
              </h2>
            </AnimatedSection>
            <div className="divide-y divide-[--cr-border] border-y border-[--cr-border]">
              {painCards.map((card, i) => {
                const Icon = iconMap[card.icon];
                return (
                  <AnimatedSection key={card.title} delay={i * 0.08} className="py-8 grid grid-cols-1 md:grid-cols-[32px_1fr] gap-5 md:gap-6">
                    <div className="pt-1">
                      {Icon && (
                        <motion.div
                          initial={{ opacity: 0, y: 4 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true, margin: "-20% 0px" }}
                          transition={{ duration: 0.35, delay: i * 0.08 }}
                        >
                          <Icon size={24} weight="duotone" className="text-[--cr-teal-dark]" />
                        </motion.div>
                      )}
                    </div>
                    <div>
                      <h3 className="text-xl tracking-tight font-semibold text-[--cr-text] mb-2">{card.title}</h3>
                      <p className="text-base leading-relaxed text-[--cr-muted] max-w-[70ch]">{card.copy}</p>
                    </div>
                  </AnimatedSection>
                );
              })}
            </div>
          </div>

          <AnimatedSection delay={0.18} className="lg:sticky lg:top-28">
            <motion.div
              className="group relative overflow-hidden rounded-[2rem] border border-[--cr-border] bg-[--cr-bg] p-3"
              whileHover={{ y: -4 }}
              transition={{ type: "spring", stiffness: 120, damping: 20 }}
              style={{ boxShadow: "var(--cr-shadow)" }}
            >
              <div className="relative min-h-[480px] overflow-hidden rounded-[1.55rem] bg-[--cr-surface-2] md:min-h-[560px] lg:min-h-[640px]">
                <img
                  src="/landing-visuals/front-desk-pressure.jpg"
                  alt="Clinic front desk with a patient signing in while staff handle intake work."
                  loading="lazy"
                  decoding="async"
                  className="h-full w-full object-cover object-center opacity-95 transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.025]"
                />
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(13,31,29,0.10)_0%,rgba(13,31,29,0.24)_55%,rgba(13,31,29,0.82)_100%)]" />

                {pressureSignals.map((signal) => (
                  <motion.div
                    key={signal.label}
                    className="absolute rounded-full border border-white/20 bg-white/88 px-3 py-1.5 text-xs font-semibold text-[--cr-text] shadow-[0_14px_32px_-18px_rgba(13,31,29,0.8)] backdrop-blur-sm"
                    style={{ left: signal.x, top: signal.y }}
                    animate={reduceMotion ? {} : { y: [0, 10, 0], opacity: [0.84, 1, 0.84] }}
                    transition={{ duration: 4.6, repeat: Infinity, ease: "easeInOut", delay: signal.delay }}
                  >
                    {signal.label}
                  </motion.div>
                ))}

                <div className="absolute bottom-5 left-5 right-5 rounded-[1.25rem] border border-white/15 bg-[#0d1f1d]/82 p-5 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.12)] backdrop-blur-md">
                  <div className="mb-3 flex items-center justify-between gap-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.14em] text-white/62">Capacity leak</p>
                    <p className="text-xs font-semibold text-[#8EE4DD]">During check-in</p>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-white/12">
                    <motion.div
                      className="h-full rounded-full bg-[#5EB8B4]"
                      initial={{ width: "82%" }}
                      whileInView={reduceMotion ? { width: "42%" } : { width: ["82%", "42%"] }}
                      viewport={{ once: true, margin: "-20% 0px" }}
                      transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.25 }}
                    />
                  </div>
                  <p className="mt-3 text-sm leading-relaxed text-white/72">
                    Capacity drains quietly when every new desk task pushes recovery work further out of view.
                  </p>
                </div>
              </div>
            </motion.div>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
}
