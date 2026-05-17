"use client";

import { ShieldCheck, CheckSquare, Receipt, Warning } from "@phosphor-icons/react/dist/ssr";
import { motion, useReducedMotion } from "framer-motion";
import { AnimatedSection } from "./animated-section";
import { readinessFeatures } from "@/lib/content/clinicrelay-landing";

const iconMap: Record<string, React.ElementType> = {
  ShieldCheck,
  CheckSquare,
  Receipt,
  Warning,
};

const readinessMarkers = [
  { label: "Insurance checked", top: "43%", delay: 0 },
  { label: "Intake blocker found", top: "58%", delay: 0.24 },
  { label: "Ready before arrival", top: "73%", delay: 0.48 },
] as const;

export function PreVisitReadiness() {
  const reduceMotion = useReducedMotion();

  return (
    <section id="readiness" className="py-28 md:py-36 bg-white">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-[0.9fr_1.1fr] gap-12 lg:gap-16 items-center mb-14">
          <AnimatedSection>
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[--cr-teal] mb-3">Pre-Visit Readiness</p>
            <h2 className="text-3xl md:text-5xl tracking-tighter font-semibold text-[--cr-text] max-w-[26ch]">
              The day-of scramble is a before-visit failure.
            </h2>
            <p className="text-base leading-relaxed text-[--cr-muted] mt-6 max-w-[62ch]">
              ClinicRelay helps staff see insurance gaps, intake blockers, and unresolved requests before
              appointment day — so walk-in surprises stay rare.
            </p>
          </AnimatedSection>

          <AnimatedSection delay={0.16}>
            <motion.div
              className="group relative overflow-hidden rounded-[2rem] border border-[--cr-border] bg-[--cr-bg] p-3"
              whileHover={{ y: -4 }}
              transition={{ type: "spring", stiffness: 120, damping: 20 }}
              style={{ boxShadow: "var(--cr-shadow)" }}
            >
              <div className="relative overflow-hidden rounded-[1.55rem] border border-[--cr-border] bg-white">
                <img
                  src="/landing-visuals/readiness-checklist.svg"
                  alt="Pre-visit readiness interface showing insurance, intake, cost, and appointment tasks."
                  loading="lazy"
                  decoding="async"
                  className="block h-auto w-full transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.015]"
                />

                <motion.div
                  className="absolute bottom-[15%] top-[15%] w-px bg-[linear-gradient(180deg,transparent,rgba(13,148,136,0.72),transparent)] shadow-[0_0_24px_rgba(94,184,180,0.35)]"
                  initial={{ left: "12%", opacity: 0 }}
                  whileInView={reduceMotion ? { left: "84%", opacity: 0.7 } : { left: ["12%", "84%"], opacity: [0, 0.85, 0] }}
                  viewport={{ once: true, margin: "-20% 0px" }}
                  transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
                />

                {readinessMarkers.map((marker) => (
                  <motion.div
                    key={marker.label}
                    className="absolute right-5 rounded-full border border-[--cr-border] bg-white/92 px-3 py-1.5 text-xs font-semibold text-[--cr-text] shadow-[0_14px_32px_-20px_rgba(13,31,29,0.75)] backdrop-blur-sm"
                    style={{ top: marker.top }}
                    initial={{ opacity: 0, x: 16 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-20% 0px" }}
                    transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1], delay: marker.delay + 0.45 }}
                  >
                    {marker.label}
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </AnimatedSection>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {readinessFeatures.map((feature, i) => {
            const Icon = iconMap[feature.icon];
            return (
              <AnimatedSection key={feature.title} delay={i * 0.08}>
                <motion.div
                  className="rounded-[2rem] border border-[--cr-border] bg-[--cr-bg] p-8"
                  whileHover={{
                    y: -2,
                    borderColor: "var(--cr-teal)",
                    boxShadow: "0 8px 24px -4px rgba(13,148,136,0.12)",
                  }}
                  transition={{ duration: 0.2 }}
                >
                  <motion.div whileHover={{ y: -3 }} transition={{ duration: 0.2 }}>
                    {Icon && <Icon size={28} weight="duotone" className="text-[--cr-teal] mb-4" />}
                  </motion.div>
                  <h3 className="text-xl font-semibold text-[--cr-text] tracking-tight mb-2">{feature.title}</h3>
                  <p className="text-sm text-[--cr-muted] leading-relaxed">{feature.copy}</p>
                </motion.div>
              </AnimatedSection>
            );
          })}
        </div>
      </div>
    </section>
  );
}
