import { AnimatedSection } from "./animated-section";
import { growthPillars } from "@/lib/content/clinicrelay-landing";

export function GrowthSection() {
  return (
    <section id="growth" className="py-24 md:py-32 bg-white">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
        <AnimatedSection className="mb-14">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[--cr-teal] mb-3">Growth</p>
          <h2 className="text-3xl md:text-4xl tracking-tight font-semibold text-[--cr-text]">
            Four ways clinics grow with ClinicRelay.
          </h2>
        </AnimatedSection>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          {growthPillars.map((pillar, i) => (
            <AnimatedSection key={pillar.title} delay={i * 0.1}>
              <div className="rounded-[2rem] border border-[--cr-border] bg-[--cr-surface-2] p-8 hover:scale-[1.01] transition-all duration-200" style={{ boxShadow: "var(--cr-shadow)" }}>
                <h3 className="text-xl font-semibold text-[--cr-text] tracking-tight mb-2">{pillar.title}</h3>
                <p className="text-base text-[--cr-muted] leading-relaxed mb-5">{pillar.copy}</p>
                <div className="flex flex-wrap gap-2">
                  {pillar.pills.map((pill) => (
                    <span key={pill} className="text-xs font-semibold px-3 py-1.5 rounded-full bg-[--cr-teal-light] text-[--cr-teal]">{pill}</span>
                  ))}
                </div>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}
