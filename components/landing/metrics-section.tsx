"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { AnimatedSection } from "./animated-section";
import { metricCards } from "@/lib/content/clinicrelay-landing";

export function MetricsSection() {
  const headerRef = useRef<HTMLDivElement>(null);
  const headerInView = useInView(headerRef, { once: true, margin: "-15% 0px" });

  return (
    <section className="py-28 md:py-36 bg-[--cr-bg]">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
        <AnimatedSection className="mb-14">
          <div ref={headerRef}>
            <p className="text-4xl md:text-6xl font-semibold tracking-tighter text-[--cr-text] max-w-[18ch]">
              "You cannot improve what your front desk cannot see."
            </p>
          </div>
        </AnimatedSection>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-10">
          {metricCards.map((m, i) => (
            <AnimatedSection key={m.label} delay={i * 0.08} className="pt-6 relative overflow-hidden">
              <motion.div
                className="absolute top-0 left-0 h-px bg-[--cr-teal] origin-left"
                initial={{ scaleX: 0 }}
                animate={headerInView ? { scaleX: 1 } : { scaleX: 0 }}
                transition={{ delay: i * 0.08 + 0.1, duration: 0.5, ease: "easeOut" }}
                style={{ width: "100%" }}
              />
              <div className="absolute top-0 left-0 right-0 h-px bg-[--cr-border]" />
              <p className="text-4xl font-semibold tracking-tighter text-[--cr-teal] mb-2">{m.value}</p>
              <p className="text-base text-[--cr-muted] leading-relaxed">{m.label}</p>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}
