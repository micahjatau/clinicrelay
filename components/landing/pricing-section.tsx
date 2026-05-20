"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { AnimatedSection } from "./animated-section";
import { pricingPackages } from "@/lib/content/clinicrelay-landing";
import { PricingCtaButton } from "./pricing-cta-button";
import { CheckCircle } from "@phosphor-icons/react/dist/ssr";

export function PricingSection() {
  const headerRef = useRef<HTMLDivElement>(null);
  const inView = useInView(headerRef, { once: true, margin: "-15% 0px" });

  return (
    <section id="pricing" className="py-24 md:py-32 bg-white">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
        <AnimatedSection className="mb-14">
          <div ref={headerRef}>
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[--cr-teal] mb-3">Pricing</p>
            <h2 className="text-3xl md:text-4xl tracking-tight font-semibold text-[--cr-text]">
              Turn empty slots into revenue.
            </h2>
            <p className="text-base text-[--cr-muted] mt-3 max-w-[55ch]">Start with a workflow audit, launch a focused recovery pilot, and scale only after you&apos;ve proven the ROI.</p>
          </div>
        </AnimatedSection>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {pricingPackages.map((pkg, i) => (
            <AnimatedSection key={pkg.name} delay={i * 0.1}>
              <motion.div
                className={`rounded-[2rem] border-2 bg-white p-8 flex flex-col h-full ${pkg.recommended ? "border-[--cr-teal]" : "border-[--cr-border]"}`}
                style={{ boxShadow: pkg.recommended ? "0 0 0 4px rgba(13,148,136,0.08), var(--cr-shadow)" : "var(--cr-shadow)" }}
                animate={pkg.recommended && inView ? { scale: [1, 1.02, 1] } : {}}
                transition={{ duration: 0.5, delay: 0.4 }}
                whileHover={{ y: -4, boxShadow: "0 12px 32px -6px rgba(13,148,136,0.15)" }}
              >
                {pkg.recommended && (
                  <span className="text-xs font-semibold px-3 py-1.5 rounded-full border border-[--cr-teal-dark]/10 bg-[--cr-teal-light] text-[--cr-teal] self-start mb-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.72)]">Most popular</span>
                )}
                <h3 className="text-xl font-semibold text-[--cr-text] tracking-tight mb-2">{pkg.name}</h3>
                <p className="text-sm text-[--cr-muted] mb-6 leading-relaxed">{pkg.tagline}</p>
                <ul className="flex flex-col gap-3 mb-8 flex-1">
                  {pkg.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-[--cr-muted]">
                      <CheckCircle size={16} weight="duotone" className="text-[--cr-teal-dark] mt-0.5 shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <PricingCtaButton />
              </motion.div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}
