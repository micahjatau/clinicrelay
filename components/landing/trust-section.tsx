"use client";

import { motion } from "framer-motion";
import { AnimatedSection } from "./animated-section";
import { trustPillars } from "@/lib/content/clinicrelay-landing";

export function TrustSection() {

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
              className="group relative overflow-hidden rounded-[2rem] border border-[--cr-border] bg-[#0d1f1d] p-3 lg:justify-self-end lg:w-full xl:max-w-[680px]"
              whileHover={{ y: -4 }}
              transition={{ type: "spring", stiffness: 120, damping: 20 }}
              style={{ boxShadow: "var(--cr-shadow)" }}
            >
              <div className="relative aspect-[1.06] overflow-hidden rounded-[1.55rem] border border-white/10 bg-[#0d1f1d] shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
                <img
                  src="/landing-visuals/trust-compliance-card.jpg"
                  alt="Trust and compliance hero showing patient data protection, strict access controls, encryption, and audit logging."
                  loading="lazy"
                  decoding="async"
                  className="block h-full w-full object-cover object-[50%_42%] transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.03]"
                />
              </div>
            </motion.div>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
}
