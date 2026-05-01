import { CalendarX, Phone, ClockClockwise, ChartLineDown } from "@phosphor-icons/react/dist/ssr";
import { AnimatedSection } from "./animated-section";
import { painCards } from "@/lib/content/clinicrelay-landing";

const iconMap: Record<string, React.ElementType> = {
  CalendarX,
  Phone,
  ClockClockwise,
  ChartLineDown,
};

export function ProblemSection() {
  return (
    <section id="product" className="py-28 md:py-36 bg-white">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
        <AnimatedSection className="mb-14">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[--cr-teal] mb-3">The Problem</p>
          <h2 className="text-3xl md:text-5xl tracking-tighter font-semibold text-[--cr-text] max-w-[18ch]">
            Your clinic is not just losing time. It is leaking capacity.
          </h2>
        </AnimatedSection>
        <div className="divide-y divide-[--cr-border] border-y border-[--cr-border]">
          {painCards.map((card, i) => {
            const Icon = iconMap[card.icon];
            return (
              <AnimatedSection key={card.title} delay={i * 0.08} className="py-8 grid grid-cols-1 md:grid-cols-[32px_1fr] gap-5 md:gap-6">
                <div className="pt-1">{Icon && <Icon size={24} weight="duotone" className="text-[--cr-teal]" />}</div>
                <div>
                  <h3 className="text-xl tracking-tight font-semibold text-[--cr-text] mb-2">{card.title}</h3>
                  <p className="text-base leading-relaxed text-[--cr-muted] max-w-[70ch]">{card.copy}</p>
                </div>
              </AnimatedSection>
            );
          })}
        </div>
      </div>
    </section>
  );
}
