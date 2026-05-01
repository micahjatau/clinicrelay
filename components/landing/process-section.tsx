import { MagnifyingGlass, Wrench, Users, TrendUp } from "@phosphor-icons/react/dist/ssr";
import { AnimatedSection } from "./animated-section";
import { processSteps } from "@/lib/content/clinicrelay-landing";
import React from "react";

const iconMap: Record<string, React.ElementType> = { MagnifyingGlass, Wrench, Users, TrendUp };

export function ProcessSection() {
  return (
    <section className="py-24 md:py-32 bg-[--cr-bg]">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
        <AnimatedSection className="mb-14">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[--cr-teal] mb-3">Getting Started</p>
          <h2 className="text-3xl md:text-4xl tracking-tight font-semibold text-[--cr-text]">
            From audit to active in four steps.
          </h2>
        </AnimatedSection>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 relative">
          <div className="hidden lg:block absolute top-5 left-[12.5%] right-[12.5%] h-px bg-[--cr-border]" />
          {processSteps.map((step, i) => {
            const Icon = iconMap[step.icon];
            return (
              <AnimatedSection key={step.number} delay={i * 0.1} className="flex flex-col gap-3">
                <div className="w-10 h-10 rounded-full bg-[--cr-teal] flex items-center justify-center shrink-0 relative z-10">
                  {Icon && React.createElement(Icon, { size: 18, weight: "duotone", className: "text-white" })}
                </div>
                <p className="text-xs font-semibold text-[--cr-teal]">{step.number}</p>
                <h3 className="text-xl font-semibold text-[--cr-text] tracking-tight">{step.title}</h3>
                <p className="text-sm text-[--cr-muted] leading-relaxed">{step.copy}</p>
              </AnimatedSection>
            );
          })}
        </div>
      </div>
    </section>
  );
}
