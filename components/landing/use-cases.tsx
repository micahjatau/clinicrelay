"use client";

import { Tooth, FirstAid, Eye, Bandaids } from "@phosphor-icons/react/dist/ssr";
import { AnimatedSection } from "./animated-section";
import { useCases } from "@/lib/content/clinicrelay-landing";
import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";

const iconMap: Record<string, React.ElementType> = { Tooth, FirstAid, Eye, Bandaids };

export function UseCases() {
  return (
    <section className="py-24 md:py-32 bg-[--cr-bg]">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
        <AnimatedSection className="mb-14">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[--cr-teal] mb-3">Use Cases</p>
          <h2 className="text-3xl md:text-4xl tracking-tight font-semibold text-[--cr-text]">
            Built for appointment-based clinics.
          </h2>
        </AnimatedSection>
        <div className="flex flex-col gap-6">
          {useCases.map((uc, i) => (
            <AnimatedSection key={uc.type} delay={i * 0.08}>
              <div
                className={`grid gap-8 items-center rounded-[2rem] border border-[--cr-border] bg-white p-10 ${i % 2 === 0 ? "grid-cols-1 md:grid-cols-[1.4fr_1fr]" : "grid-cols-1 md:grid-cols-[1fr_1.4fr]"}`}
                style={{ boxShadow: "var(--cr-shadow)" }}
              >
                <div className={i % 2 !== 0 ? "md:order-2" : ""}>
                  {iconMap[uc.icon] && <UseCaseIcon icon={iconMap[uc.icon]} />}
                  <h3 className="text-xl font-semibold text-[--cr-text] tracking-tight mb-2">{uc.title}</h3>
                  <p className="text-base text-[--cr-muted] leading-relaxed mb-4">{uc.copy}</p>
                  <div className="flex flex-wrap gap-2">
                    {uc.pills.map((pill) => <span key={pill} className="text-xs font-semibold px-3 py-1.5 rounded-full bg-[--cr-teal-light] text-[--cr-teal]">{pill}</span>)}
                  </div>
                </div>
                <div className={`rounded-2xl bg-[--cr-surface-2] border border-[--cr-border] p-6 flex items-center justify-center min-h-[140px] ${i % 2 !== 0 ? "md:order-1" : ""}`}>
                  <p className="text-sm font-semibold text-[--cr-teal]">{uc.type} Clinic Workflow</p>
                </div>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}

function UseCaseIcon({ icon: Icon }: { icon: React.ElementType }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-20% 0px" });

  return (
    <motion.div
      ref={ref}
      className="mb-4 inline-block"
      style={{ transformPerspective: 900 }}
      initial={{ rotateY: 0, rotateX: 0 }}
      animate={inView ? { rotateY: 720, rotateX: 12 } : { rotateY: 0, rotateX: 0 }}
      transition={{ duration: 1.15, ease: [0.22, 1, 0.36, 1] }}
    >
      <Icon size={32} weight="duotone" className="text-[--cr-teal]" />
    </motion.div>
  );
}
