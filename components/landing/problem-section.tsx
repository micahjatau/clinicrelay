import { CalendarX, Phone, ClockClockwise, ChartLineDown } from "@phosphor-icons/react/dist/ssr";
import { AnimatedSection } from "./animated-section";
import { painCards } from "@/lib/content/clinicrelay-landing";

const iconMap: Record<string, React.ElementType> = {
  CalendarX, Phone, ClockClockwise, ChartLineDown,
};

export function ProblemSection() {
  return (
    <section id="product" className="py-24 md:py-32 bg-white">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
        <AnimatedSection className="mb-14">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[--cr-teal] mb-3">The Problem</p>
          <h2 className="text-3xl md:text-4xl tracking-tight font-semibold text-[--cr-text] max-w-[20ch]">
            Your clinic is not just losing time. It is leaking capacity.
          </h2>
        </AnimatedSection>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {painCards.map((card, i) => {
            const Icon = iconMap[card.icon];
            return (
              <AnimatedSection key={card.title} delay={i * 0.08}>
                <div className="rounded-[2rem] border border-[--cr-border] bg-[--cr-surface-2] p-8 hover:scale-[1.01] hover:shadow-lg transition-all duration-200" style={{ boxShadow: "var(--cr-shadow)" }}>
                  {Icon && <Icon size={28} weight="duotone" className="text-[--cr-teal] mb-4" />}
                  <h3 className="text-xl tracking-tight font-semibold text-[--cr-text] mb-2">{card.title}</h3>
                  <p className="text-base leading-relaxed text-[--cr-muted]">{card.copy}</p>
                </div>
              </AnimatedSection>
            );
          })}
        </div>
      </div>
    </section>
  );
}
