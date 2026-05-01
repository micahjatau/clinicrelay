import { AnimatedSection } from "./animated-section";
import { trustPillars } from "@/lib/content/clinicrelay-landing";

export function TrustSection() {
  return (
    <section className="py-24 md:py-32 bg-white">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
        <AnimatedSection className="mb-14">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[--cr-teal] mb-3">Trust & Compliance</p>
          <h2 className="text-3xl md:text-4xl tracking-tight font-semibold text-[--cr-text] max-w-[24ch]">
            Your patients' data is not a growth strategy.
          </h2>
        </AnimatedSection>
        <div className="max-w-3xl divide-y divide-[--cr-border]">
          {trustPillars.map((pillar, i) => (
            <AnimatedSection key={pillar.title} delay={i * 0.08} className="py-6">
              <h3 className="text-xl font-semibold text-[--cr-text] tracking-tight mb-1">{pillar.title}</h3>
              <p className="text-base text-[--cr-muted] leading-relaxed">{pillar.copy}</p>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}
