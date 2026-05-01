import { AnimatedSection } from "./animated-section";
import { serviceCards } from "@/lib/content/clinicrelay-landing";

export function WebServices() {
  return (
    <section className="py-24 md:py-32 bg-[--cr-bg]">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
        <AnimatedSection className="mb-14">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[--cr-teal] mb-3">Clinic Growth Infrastructure</p>
          <h2 className="text-3xl md:text-4xl tracking-tight font-semibold text-[--cr-text]">
            Once recovery is stable, grow demand with confidence.
          </h2>
        </AnimatedSection>

        <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-12">
          <AnimatedSection className="border-t border-[--cr-border] pt-6">
            <h3 className="text-xl font-semibold text-[--cr-text] tracking-tight mb-3">{serviceCards[0].title}</h3>
            <p className="text-sm text-[--cr-muted] leading-relaxed mb-6 max-w-[60ch]">{serviceCards[0].copy}</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {serviceCards[0].deliverables.map((d) => (
                <p key={d} className="text-sm text-[--cr-muted] py-2 border-t border-[--cr-border]">{d}</p>
              ))}
            </div>
          </AnimatedSection>

          <div className="divide-y divide-[--cr-border] border-y border-[--cr-border]">
            {serviceCards.slice(1).map((card, i) => (
              <AnimatedSection key={card.title} delay={i * 0.08} className="py-5">
                <h4 className="text-base font-semibold text-[--cr-text] tracking-tight mb-1">{card.title}</h4>
                <p className="text-sm text-[--cr-muted] leading-relaxed mb-3">{card.copy}</p>
                <p className="text-xs text-[--cr-muted]">{card.deliverables.join(" • ")}</p>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
