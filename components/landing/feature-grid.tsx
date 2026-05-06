import {
  ChatCircleText, CalendarCheck, BellRinging, ClipboardText,
  Gauge, Lock, ArrowsClockwise, ShieldCheck, UserCircle,
} from "@phosphor-icons/react/dist/ssr";
import { AnimatedSection } from "./animated-section";
import { featureCards, type FeaturePillar, type FeatureStatus } from "@/lib/content/clinicrelay-landing";

const statusLabel: Record<FeatureStatus, string> = {
  available: "Available",
  pilot: "Pilot-supported",
  roadmap: "Roadmap",
};

const statusClass: Record<FeatureStatus, string> = {
  available: "bg-[--cr-teal-light] text-[--cr-teal]",
  pilot: "bg-[--cr-warning-light] text-[--cr-warning]",
  roadmap: "bg-[--cr-slate-light] text-[--cr-slate]",
};

const iconMap: Record<string, React.ElementType> = {
  ChatCircleText, CalendarCheck, BellRinging, ClipboardText,
  Gauge, Lock, ArrowsClockwise, ShieldCheck, UserCircle,
};

const pillars: FeaturePillar[] = ["Access", "Readiness", "Recovery"];

const pillarMeta: Record<FeaturePillar, { label: string; copy: string }> = {
  Access: {
    label: "Access",
    copy: "How patients reach your clinic and how requests enter the workflow.",
  },
  Readiness: {
    label: "Readiness",
    copy: "What staff and patients resolve before the visit begins.",
  },
  Recovery: {
    label: "Recovery",
    copy: "How cancelled capacity gets reclaimed and confirmed.",
  },
};

export function FeatureGrid() {
  return (
    <section className="py-24 md:py-32 bg-[--cr-bg]">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
        <AnimatedSection className="mb-14">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[--cr-teal] mb-3">Capabilities</p>
          <h2 className="text-3xl md:text-4xl tracking-tight font-semibold text-[--cr-text]">
            Three layers. One coordinated workflow.
          </h2>
        </AnimatedSection>

        <div className="flex flex-col gap-16">
          {pillars.map((pillar) => {
            const cards = featureCards.filter((c) => c.pillar === pillar);
            const meta = pillarMeta[pillar];
            return (
              <div key={pillar}>
                <AnimatedSection className="mb-8 border-b border-[--cr-border] pb-4">
                  <span className="text-xs font-semibold uppercase tracking-[0.12em] text-[--cr-teal]">{meta.label}</span>
                  <p className="text-base text-[--cr-muted] mt-1">{meta.copy}</p>
                </AnimatedSection>

                {/* Mobile: horizontal scroll */}
                <div className="md:hidden -mx-6 px-6 overflow-x-auto pb-2">
                  <div className="flex gap-3 snap-x snap-mandatory">
                    {cards.map((card, i) => {
                      const Icon = iconMap[card.icon];
                      return (
                        <AnimatedSection
                          key={card.title}
                          delay={i * 0.04}
                          className="snap-start shrink-0 w-[85vw] rounded-[1.5rem] border border-[--cr-border] bg-white p-5"
                        >
                          {Icon && <Icon size={24} weight="duotone" className="text-[--cr-teal] mb-3" />}
                          <h3 className="text-lg font-semibold text-[--cr-text] tracking-tight mb-2">{card.title}</h3>
                          <p className="text-sm text-[--cr-muted] leading-relaxed mb-3 line-clamp-4">{card.copy}</p>
                          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${statusClass[card.status]}`}>
                            {statusLabel[card.status]}
                          </span>
                        </AnimatedSection>
                      );
                    })}
                  </div>
                </div>

                {/* Desktop: responsive grid */}
                <div className="hidden md:grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {cards.map((card, i) => {
                    const Icon = iconMap[card.icon];
                    return (
                      <AnimatedSection
                        key={card.title}
                        delay={i * 0.05}
                        className="rounded-[2rem] border border-[--cr-border] bg-white p-8 hover:scale-[1.01] hover:shadow-lg transition-all duration-200"
                      >
                        {Icon && <Icon size={28} weight="duotone" className="text-[--cr-teal] mb-4" />}
                        <h3 className="text-xl font-semibold text-[--cr-text] tracking-tight mb-2">{card.title}</h3>
                        <p className="text-sm text-[--cr-muted] leading-relaxed mb-4">{card.copy}</p>
                        <span className={`text-xs font-semibold px-3 py-1 rounded-full ${statusClass[card.status]}`}>
                          {statusLabel[card.status]}
                        </span>
                      </AnimatedSection>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
