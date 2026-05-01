import { ChatCircleText, CalendarCheck, BellRinging, Robot, Envelope, Gauge, Phone, UsersFour, Lock, PuzzlePiece, ArrowsClockwise, ChartBar } from "@phosphor-icons/react/dist/ssr";
import { AnimatedSection } from "./animated-section";
import { featureCards } from "@/lib/content/clinicrelay-landing";

const iconMap: Record<string, React.ElementType> = {
  ChatCircleText, CalendarCheck, BellRinging, Robot, Envelope, Gauge,
  Phone, UsersFour, Lock, PuzzlePiece, ArrowsClockwise, ChartBar,
};

export function FeatureGrid() {
  return (
    <section className="py-24 md:py-32 bg-[--cr-bg]">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
        <AnimatedSection className="mb-14">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[--cr-teal] mb-3">Features</p>
          <h2 className="text-3xl md:text-4xl tracking-tight font-semibold text-[--cr-text]">
            Built for every part of the front desk.
          </h2>
        </AnimatedSection>
        <div
          className="grid gap-4"
          style={{
            gridTemplateColumns: "repeat(4, 1fr)",
            gridTemplateRows: "auto",
          }}
        >
          {featureCards.map((card, i) => {
            const Icon = iconMap[card.icon];
            const isWide = [0, 5, 8].includes(i);
            return (
              <AnimatedSection
                key={card.title}
                delay={i * 0.05}
                className={`rounded-[2rem] border border-[--cr-border] bg-white p-8 hover:scale-[1.01] hover:shadow-lg transition-all duration-200 ${isWide ? "col-span-2" : "col-span-1"} max-md:col-span-2`}
              >
                {Icon && <Icon size={28} weight="duotone" className="text-[--cr-teal] mb-4" />}
                <h3 className="text-xl font-semibold text-[--cr-text] tracking-tight mb-2">{card.title}</h3>
                <p className="text-sm text-[--cr-muted] leading-relaxed mb-4">{card.copy}</p>
                <span className="text-xs font-semibold px-3 py-1 rounded-full bg-[--cr-teal-light] text-[--cr-teal]">{card.tag}</span>
              </AnimatedSection>
            );
          })}
        </div>
      </div>
    </section>
  );
}
