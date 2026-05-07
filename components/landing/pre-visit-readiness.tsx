"use client";

import { ShieldCheck, CheckSquare, Receipt, Warning } from "@phosphor-icons/react/dist/ssr";
import { motion } from "framer-motion";
import { AnimatedSection } from "./animated-section";
import { readinessFeatures } from "@/lib/content/clinicrelay-landing";

const iconMap: Record<string, React.ElementType> = {
  ShieldCheck,
  CheckSquare,
  Receipt,
  Warning,
};

export function PreVisitReadiness() {
  return (
    <section id="readiness" className="py-28 md:py-36 bg-white">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
        <AnimatedSection className="mb-14">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[--cr-teal] mb-3">Pre-Visit Readiness</p>
          <h2 className="text-3xl md:text-5xl tracking-tighter font-semibold text-[--cr-text] max-w-[26ch]">
            The day-of scramble is a before-visit failure.
          </h2>
          <p className="text-base leading-relaxed text-[--cr-muted] mt-6">
            ClinicRelay helps staff see insurance gaps, intake blockers, and unresolved requests before
            appointment day — so walk-in surprises stay rare.
          </p>
        </AnimatedSection>

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
