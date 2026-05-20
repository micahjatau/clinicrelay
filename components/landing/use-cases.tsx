"use client";

import { useState, type ElementType, memo } from "react";
import { Tooth, FirstAid, Eye, Bandaids } from "@phosphor-icons/react/dist/ssr";
import { motion, useReducedMotion } from "framer-motion";
import { AnimatedSection } from "./animated-section";
import { useCases } from "@/lib/content/clinicrelay-landing";

const iconMap: Record<string, ElementType> = { Tooth, FirstAid, Eye, Bandaids };

const SPRING = { type: "spring" as const, stiffness: 120, damping: 22 } as const;
const EASE = [0.22, 1, 0.36, 1] as const;

const childVariants = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0, transition: SPRING },
};

const contentVariants = {
  initial: {},
  animate: { transition: { staggerChildren: 0.07, delayChildren: 0.04 } },
};

// Perpetual breathing pulse on the active selector dot.
// Memoized + isolated so the loop never restarts when the parent re-renders.
const ActiveDot = memo(function ActiveDot() {
  return (
    <motion.span
      aria-hidden="true"
      className="h-1.5 w-1.5 rounded-full bg-[#8EE4DD]"
      animate={{ opacity: [1, 0.55, 1], scale: [1, 1.3, 1] }}
      transition={{ repeat: Infinity, duration: 2.2, ease: "easeInOut" }}
    />
  );
});

// One-shot shimmer wash that masks the image src swap on selection change.
const ImageShimmer = memo(function ImageShimmer() {
  return (
    <motion.div
      className="pointer-events-none absolute inset-y-0 w-1/2"
      style={{
        background:
          "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.22) 50%, transparent 100%)",
      }}
      initial={{ x: "-110%" }}
      animate={{ x: "230%" }}
      transition={{ duration: 0.95, ease: EASE }}
    />
  );
});

export function UseCases() {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const reduced = useReducedMotion();
  const active = useCases[selectedIndex];

  return (
    // `isolate` creates a new stacking context; `overflow-hidden` contains every
    // child animation so nothing can bleed into ProblemSection / TrustSection.
    <section className="relative isolate overflow-hidden py-24 md:py-32 bg-[--cr-bg]">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
        <AnimatedSection className="mb-14">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[--cr-teal] mb-3">
            Use Cases
          </p>
          <h2 className="text-3xl md:text-4xl tracking-tight font-semibold text-[--cr-text]">
            Built for appointment-based clinics.
          </h2>
        </AnimatedSection>

        {/* Selector — layoutId background physically morphs between selected pills */}
        <div
          className="flex flex-wrap gap-2 mb-8"
          role="tablist"
          aria-label="Select a clinic use case"
        >
          {useCases.map((uc, i) => {
            const isSelected = selectedIndex === i;
            return (
              <button
                key={uc.type}
                type="button"
                role="tab"
                onClick={() => setSelectedIndex(i)}
                aria-pressed={isSelected}
                className={`relative rounded-full border px-4 py-2 text-sm font-semibold shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[--cr-teal] focus-visible:ring-offset-2 active:translate-y-px ${
                  isSelected
                    ? "border-[#0d1f1d] text-white"
                    : "border-[--cr-border] bg-white text-[--cr-muted] transition-colors duration-200 hover:border-[--cr-teal] hover:bg-[--cr-teal-light] hover:text-[--cr-teal-dark]"
                }`}
              >
                {isSelected &&
                  (reduced ? (
                    <span
                      aria-hidden="true"
                      className="absolute inset-0 -z-10 rounded-full bg-[#0d1f1d]"
                    />
                  ) : (
                    <motion.span
                      layoutId="useCasePillBg"
                      aria-hidden="true"
                      className="absolute inset-0 -z-10 rounded-full bg-[#0d1f1d] shadow-[0_14px_28px_-18px_rgba(13,31,29,0.8)]"
                      transition={SPRING}
                    />
                  ))}
                <span className="relative flex items-center gap-2">
                  {isSelected && !reduced ? (
                    <ActiveDot />
                  ) : (
                    <span
                      aria-hidden="true"
                      className={`h-1.5 w-1.5 rounded-full ${
                        isSelected ? "bg-[#8EE4DD]" : "bg-[--cr-border]"
                      }`}
                    />
                  )}
                  {uc.type}
                </span>
              </button>
            );
          })}
        </div>

        {/* Stage card — height stays stable (image min-h dominates grid), so no
            push to surrounding sections when content swaps. */}
        <div
          className="grid grid-cols-1 gap-8 overflow-hidden rounded-[2rem] border border-[--cr-border] bg-white p-6 md:grid-cols-[1.05fr_0.95fr] md:p-8 lg:p-10"
          style={{ boxShadow: "var(--cr-shadow)" }}
        >
          {/* Content side — staggered children re-run on each selection change */}
          <motion.div
            key={`content-${active.type}`}
            className="flex flex-col justify-center"
            initial={reduced ? false : "initial"}
            animate="animate"
            variants={contentVariants}
          >
            <motion.div variants={childVariants}>
              <UseCaseIcon icon={iconMap[active.icon]} />
            </motion.div>
            <motion.h3
              variants={childVariants}
              className="mb-2 text-xl font-semibold tracking-tight text-[--cr-text] md:text-2xl"
            >
              {active.title}
            </motion.h3>
            <motion.p
              variants={childVariants}
              className="mb-5 max-w-[58ch] text-base leading-relaxed text-[--cr-muted]"
            >
              {active.copy}
            </motion.p>
            <motion.div variants={childVariants} className="flex flex-wrap gap-2">
              {active.pills.map((pill) => (
                <span
                  key={pill}
                  className="rounded-full border border-[--cr-border] bg-white px-3 py-1.5 text-xs font-semibold text-[--cr-muted]"
                >
                  {pill}
                </span>
              ))}
            </motion.div>
          </motion.div>

          {/* Image side — stable <img>, subtle scale entrance keyed to src,
              shimmer wash overlay masks the swap. */}
          <div className="relative min-h-[230px] overflow-hidden rounded-[1.5rem] border border-[--cr-border] bg-[--cr-surface-2] md:min-h-[320px]">
            <motion.img
              key={active.image.src}
              src={active.image.src}
              alt={active.image.alt}
              loading="eager"
              decoding="async"
              className="h-full w-full object-cover"
              style={{ objectPosition: active.image.position ?? "center" }}
              initial={reduced ? false : { scale: 1.06, opacity: 0.85 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.7, ease: EASE }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0d1f1d]/70 via-[#0d1f1d]/10 to-transparent opacity-80" />
            {!reduced && <ImageShimmer key={`shimmer-${active.type}`} />}

            <div className="absolute bottom-4 left-4 right-4 z-10 flex items-end justify-between gap-3">
              <motion.div
                key={`badge-${active.type}`}
                initial={reduced ? false : { opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ ...SPRING, delay: 0.15 }}
                className="rounded-full border border-white/20 bg-white/90 px-3 py-1.5 shadow-[0_12px_30px_-18px_rgba(13,31,29,0.8)] backdrop-blur-sm"
              >
                <p className="text-xs font-semibold text-[--cr-text]">
                  {active.type} clinic workflow
                </p>
              </motion.div>
              {active.image.credit ? (
                <p className="max-w-[15ch] text-right text-[10px] font-medium leading-tight text-white/80">
                  {active.image.credit}
                </p>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function UseCaseIcon({ icon: Icon }: { icon: ElementType }) {
  return (
    <div className="mb-4 inline-flex rounded-[1.1rem] border border-[--cr-teal-dark]/10 bg-[--cr-teal-light] p-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.72)]">
      <Icon size={32} weight="duotone" className="text-[--cr-teal-dark]" />
    </div>
  );
}
