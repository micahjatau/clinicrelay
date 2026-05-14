"use client";

import { motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import { heroData } from "@/lib/content/clinicrelay-landing";
import { HeroBento } from "./hero-bento";
import { HeroCtaButtons } from "./hero-cta-buttons";

function fadeUp(delay: number) {
  return {
    initial: { opacity: 0, y: 12 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] as const, delay },
  };
}

export function Hero() {
  const reducedMotion = useReducedMotion();

  const motion_props = (delay: number) =>
    reducedMotion
      ? {}
      : fadeUp(delay);

  return (
    <div className="min-h-[100dvh] relative flex items-center bg-[--cr-bg] pt-10 md:pt-16">
      {/* Background — full-bleed, static, low opacity */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <Image
          src="/clinicrelay-hero-bg.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-[0.08]"
          style={{ filter: "blur(1px)" }}
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(245,250,255,0.96)_0%,rgba(245,250,255,0.88)_38%,rgba(245,250,255,0.64)_100%)]" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-[1400px] mx-auto px-6 lg:px-10 w-full py-12 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          {/* Left — copy */}
          <div>
            <motion.p
              className="text-xs font-semibold uppercase tracking-[0.12em] text-[--cr-teal] mb-4"
              {...motion_props(0)}
            >
              {heroData.eyebrow}
            </motion.p>
            <motion.h1
              className="text-4xl md:text-6xl tracking-tighter font-semibold text-[--cr-text] leading-[0.95] mb-8"
              {...motion_props(0.1)}
            >
              {heroData.h1}
            </motion.h1>
            <motion.p
              className="text-base leading-relaxed text-[--cr-muted] max-w-[62ch] mb-8"
              {...motion_props(0.2)}
            >
              {heroData.subheadline}
            </motion.p>
            <motion.div {...motion_props(0.3)}>
              <HeroCtaButtons />
              <p className="text-xs text-[--cr-muted] mt-4 mb-6">{heroData.trustLine}</p>
            </motion.div>
            <motion.div className="flex flex-wrap gap-2" {...motion_props(0.4)}>
              {heroData.badges.map((badge) => (
                <span
                  key={badge}
                  className="text-xs font-semibold px-3 py-1.5 rounded-full bg-[--cr-teal-light] text-[--cr-teal]"
                >
                  {badge}
                </span>
              ))}
            </motion.div>
          </div>

          {/* Right — workflow cards */}
          <motion.div {...motion_props(0.2)}>
            <HeroBento cards={heroData.bentoCards} />
          </motion.div>
        </div>
      </div>
    </div>
  );
}
