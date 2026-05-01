import { AnimatedSection } from "./animated-section";
import { metricCards } from "@/lib/content/clinicrelay-landing";

export function MetricsSection() {
  return (
    <section className="py-24 md:py-32 bg-[--cr-bg]">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
        <AnimatedSection className="mb-14">
          <p className="text-4xl md:text-5xl font-semibold tracking-tight text-[--cr-text] max-w-[22ch]">
            "You cannot improve what your front desk cannot see."
          </p>
        </AnimatedSection>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {metricCards.map((m, i) => (
            <AnimatedSection key={m.label} delay={i * 0.08}>
              <div className="rounded-[2rem] border border-[--cr-border] bg-white p-8 hover:scale-[1.01] hover:shadow-lg transition-all duration-200" style={{ boxShadow: "var(--cr-shadow)" }}>
                <p className="text-4xl font-semibold tracking-tighter text-[--cr-teal] mb-2">{m.value}</p>
                <p className="text-base text-[--cr-muted] leading-relaxed">{m.label}</p>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}
