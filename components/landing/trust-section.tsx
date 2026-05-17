"use client";

import { motion, useReducedMotion } from "framer-motion";
import { AnimatedSection } from "./animated-section";
import { trustPillars } from "@/lib/content/clinicrelay-landing";

const auditSignals = [
  { label: "Staff action logged", top: "39%", delay: 0 },
  { label: "Role checked", top: "52%", delay: 0.22 },
  { label: "Minimal data used", top: "65%", delay: 0.44 },
] as const;

export function TrustSection() {
  const reduceMotion = useReducedMotion();

  return (
    <section id="trust" className="py-24 md:py-32 bg-white">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-[0.95fr_1.05fr] gap-12 lg:gap-16 items-center">
          <div>
            <AnimatedSection className="mb-14">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[--cr-teal] mb-3">Trust & Compliance</p>
              <h2 className="text-3xl md:text-4xl tracking-tight font-semibold text-[--cr-text] max-w-[24ch]">
                Your patients' data is not a growth strategy.
              </h2>
            </AnimatedSection>
            <div className="max-w-3xl divide-y divide-[--cr-border]">
              {trustPillars.map((pillar, i) => (
                <AnimatedSection key={pillar.title} delay={i * 0.12} className="py-6">
                  <h3 className="text-xl font-semibold text-[--cr-text] tracking-tight mb-1">{pillar.title}</h3>
                  <p className="text-base text-[--cr-muted] leading-relaxed">{pillar.copy}</p>
                </AnimatedSection>
              ))}
            </div>
          </div>

          <AnimatedSection delay={0.18}>
            <motion.div
              className="group relative overflow-hidden rounded-[2rem] border border-[--cr-border] bg-[#0d1f1d] p-3"
              whileHover={{ y: -4 }}
              transition={{ type: "spring", stiffness: 120, damping: 20 }}
              style={{ boxShadow: "var(--cr-shadow)" }}
            >
              <div className="relative overflow-hidden rounded-[1.55rem] border border-white/10 bg-[#0d1f1d] shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
                <img
                  src="/landing-visuals/trust-audit-trail.svg"
                  alt="Privacy and audit trail interface with role access, timestamps, staff actions, and a lock."
                  loading="lazy"
                  decoding="async"
                  className="block h-auto w-full transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.015]"
                />

                <motion.div
                  className="absolute right-[9.5%] top-[26%] h-[18%] w-[18%] rounded-[2rem] border border-[#8EE4DD]/45 bg-[#8EE4DD]/6"
                  animate={reduceMotion ? {} : { scale: [1, 1.035, 1], opacity: [0.62, 1, 0.62] }}
                  transition={{ duration: 3.8, repeat: Infinity, ease: "easeInOut" }}
                />

                <motion.div
                  className="absolute bottom-[18%] left-[13%] top-[38%] w-px origin-top bg-[linear-gradient(180deg,#8EE4DD,rgba(142,228,221,0.04))]"
                  initial={{ scaleY: 0, opacity: 0 }}
                  whileInView={{ scaleY: 1, opacity: 0.82 }}
                  viewport={{ once: true, margin: "-20% 0px" }}
                  transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.22 }}
                />

                {auditSignals.map((signal) => (
                  <motion.div
                    key={signal.label}
                    className="absolute left-[17%] rounded-full border border-white/12 bg-white/10 px-3 py-1.5 text-xs font-semibold text-white/86 shadow-[0_14px_32px_-20px_rgba(0,0,0,0.9)] backdrop-blur-sm"
                    style={{ top: signal.top }}
                    initial={{ opacity: 0, x: -12 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-20% 0px" }}
                    transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1], delay: signal.delay + 0.3 }}
                  >
                    {signal.label}
                  </motion.div>
                ))}

                <div className="absolute bottom-5 right-5 max-w-[230px] rounded-[1.25rem] border border-white/12 bg-white/10 p-4 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] backdrop-blur-md">
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#8EE4DD]">Bounded access</p>
                  <p className="mt-2 text-sm leading-relaxed text-white/72">
                    Access narrows to the work being done, while every staff action remains visible in the audit trail.
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
