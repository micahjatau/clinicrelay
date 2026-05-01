import { AnimatedSection } from "./animated-section";
import { serviceCards } from "@/lib/content/clinicrelay-landing";

export function WebServices() {
  return (
    <section className="py-24 md:py-32 bg-[--cr-bg]">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
        <AnimatedSection className="mb-14">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[--cr-teal] mb-3">Web Services</p>
          <h2 className="text-3xl md:text-4xl tracking-tight font-semibold text-[--cr-text]">
            Your digital presence, managed.
          </h2>
        </AnimatedSection>
        <div className="flex gap-4 overflow-x-auto pb-4 md:grid md:overflow-visible" style={{ gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr" }}>
          {serviceCards.map((card, i) => (
            <AnimatedSection key={card.title} delay={i * 0.08} className="min-w-[260px] md:min-w-0">
              <div className="rounded-[2rem] border border-[--cr-border] bg-white h-full p-8" style={{ boxShadow: "var(--cr-shadow)" }}>
                <h3 className="text-xl font-semibold text-[--cr-text] tracking-tight mb-3">{card.title}</h3>
                <p className="text-sm text-[--cr-muted] leading-relaxed mb-6">{card.copy}</p>
                <div className="flex flex-col">
                  {card.deliverables.map((d) => (
                    <p key={d} className="text-xs text-[--cr-muted] py-2.5 border-t border-[--cr-border]">{d}</p>
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
