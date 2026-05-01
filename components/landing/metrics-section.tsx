import { AnimatedSection } from "./animated-section";
import { metricCards } from "@/lib/content/clinicrelay-landing";

export function MetricsSection() {
  return (
    <section className="py-28 md:py-36 bg-[--cr-bg]">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
        <AnimatedSection className="mb-14">
          <p className="text-4xl md:text-6xl font-semibold tracking-tighter text-[--cr-text] max-w-[18ch]">
            "You cannot improve what your front desk cannot see."
          </p>
        </AnimatedSection>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-10">
          {metricCards.map((m, i) => (
            <AnimatedSection key={m.label} delay={i * 0.08} className="border-t border-[--cr-border] pt-6">
              <p className="text-4xl font-semibold tracking-tighter text-[--cr-teal] mb-2">{m.value}</p>
              <p className="text-base text-[--cr-muted] leading-relaxed">{m.label}</p>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}
