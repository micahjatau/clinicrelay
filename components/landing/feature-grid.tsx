"use client";

import {
  ChatCircleText, CalendarCheck, BellRinging, ClipboardText,
  Gauge, Lock, ArrowsClockwise, ShieldCheck, UserCircle,
} from "@phosphor-icons/react/dist/ssr";
import { motion } from "framer-motion";
import { AnimatedSection } from "./animated-section";
import { featureCards, type FeaturePillar, type FeatureStatus } from "@/lib/content/clinicrelay-landing";

const statusLabel: Record<FeatureStatus, string> = {
  available: "Core",
  pilot: "Pilot-ready",
  roadmap: "Expansion",
};

const statusClass: Record<FeatureStatus, string> = {
  available:
    "border border-[--cr-teal-dark]/10 bg-[--cr-teal-light] text-[--cr-teal] shadow-[inset_0_1px_0_rgba(255,255,255,0.72)]",
  pilot:
    "border border-[--cr-warning]/15 bg-[--cr-warning-light] text-[--cr-warning] shadow-[inset_0_1px_0_rgba(255,255,255,0.72)]",
  roadmap:
    "border border-[--cr-slate]/12 bg-[--cr-slate-light] text-[--cr-slate] shadow-[inset_0_1px_0_rgba(255,255,255,0.72)]",
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

function PillarCard({ card, size }: { card: (typeof featureCards)[number]; size: "sm" | "lg" }) {
  const Icon = iconMap[card.icon];
  if (size === "sm") {
    return (
      <motion.div
        className="rounded-2xl border border-[--cr-border] bg-[--cr-surface-2] p-5"
        whileHover={{
          borderColor: "var(--cr-teal)",
          y: -2,
          boxShadow: "0 4px 16px -4px rgba(13,148,136,0.10)",
        }}
        transition={{ duration: 0.18 }}
      >
        <motion.div whileHover={{ y: -3 }} transition={{ duration: 0.18 }}>
          {Icon && (
            <span className="mb-3 inline-flex rounded-xl border border-[--cr-teal-dark]/10 bg-[--cr-teal-light] p-2.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.72)]">
              <Icon size={24} weight="duotone" className="text-[--cr-teal-dark]" />
            </span>
          )}
        </motion.div>
        <h3 className="text-lg font-semibold text-[--cr-text] tracking-tight mb-2">{card.title}</h3>
        <p className="text-sm text-[--cr-muted] leading-relaxed mb-3 line-clamp-4">{card.copy}</p>
        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${statusClass[card.status]}`}>
          {statusLabel[card.status]}
        </span>
      </motion.div>
    );
  }
  return (
    <motion.div
      className="rounded-2xl border border-[--cr-border] bg-[--cr-surface-2] p-5"
      whileHover={{
        borderColor: "var(--cr-teal)",
        y: -2,
        boxShadow: "0 4px 16px -4px rgba(13,148,136,0.10)",
      }}
      transition={{ duration: 0.18 }}
    >
      <motion.div whileHover={{ y: -3 }} transition={{ duration: 0.18 }}>
        {Icon && (
          <span className="mb-4 inline-flex rounded-[1rem] border border-[--cr-teal-dark]/10 bg-[--cr-teal-light] p-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.72)]">
            <Icon size={28} weight="duotone" className="text-[--cr-teal-dark]" />
          </span>
        )}
      </motion.div>
      <h3 className="text-xl font-semibold text-[--cr-text] tracking-tight mb-2">{card.title}</h3>
      <p className="text-sm text-[--cr-muted] leading-relaxed mb-4">{card.copy}</p>
      <span className={`text-xs font-semibold px-3 py-1 rounded-full ${statusClass[card.status]}`}>
        {statusLabel[card.status]}
      </span>
    </motion.div>
  );
}

export function FeatureGrid() {
  return (
    <section className="py-24 md:py-32 bg-white">
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

                <div className="md:hidden -mx-6 px-6 overflow-x-auto pb-2">
                  <div className="flex gap-3 snap-x snap-mandatory">
                    {cards.map((card, i) => (
                      <AnimatedSection key={card.title} delay={i * 0.04} className="snap-start shrink-0 w-[85vw]">
                        <PillarCard card={card} size="sm" />
                      </AnimatedSection>
                    ))}
                  </div>
                </div>

                <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {cards.map((card, i) => (
                    <AnimatedSection key={card.title} delay={i * 0.05} className="rounded-[2rem] border border-[--cr-border] bg-white p-8">
                      <PillarCard card={card} size="lg" />
                    </AnimatedSection>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
