"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion, motionValue } from "framer-motion";
import Image from "next/image";
import { heroData } from "@/lib/content/clinicrelay-landing";
import { HeroBento } from "./hero-bento";
import { HeroCtaButtons } from "./hero-cta-buttons";

export function Hero() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  const rawOverlayOpacity = useTransform(scrollYProgress, [0, 0.45], [0, 1]);
  const rawCopyOpacity = useTransform(scrollYProgress, [0.35, 0.7], [0, 1]);
  const staticOne = useRef(motionValue(1));

  const overlayOpacity = reducedMotion ? staticOne.current : rawOverlayOpacity;
  const copyOpacity = reducedMotion ? staticOne.current : rawCopyOpacity;

  return (
    <div ref={sectionRef} className={reducedMotion ? "min-h-[100dvh]" : "min-h-[250vh]"}>
      <section className="sticky top-0 h-[100dvh] overflow-hidden relative flex items-center bg-[--cr-bg] pt-16">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <Image
            src="/clinicrelay-hero-bg.jpg"
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover object-center opacity-35"
          />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(245,250,255,0.96)_0%,rgba(245,250,255,0.88)_38%,rgba(245,250,255,0.64)_100%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(13,148,136,0.14),transparent_30%),radial-gradient(circle_at_bottom_right,_rgba(59,130,246,0.12),transparent_28%)]" />
        </div>
        <div className="relative z-10 max-w-[1400px] mx-auto px-6 lg:px-10 w-full py-28 md:py-36">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[--cr-teal] mb-4">
                {heroData.eyebrow}
              </p>
              <h1 className="text-4xl md:text-6xl tracking-tighter font-semibold text-[--cr-text] leading-[0.95] mb-8">
                {heroData.h1}
              </h1>
              <p className="text-base leading-relaxed text-[--cr-muted] max-w-[62ch] mb-8">
                {heroData.subheadline}
              </p>
              <p className="text-xs text-[--cr-muted] mb-3 md:hidden">{heroData.trustLine}</p>
              <HeroCtaButtons />
              <p className="hidden md:block text-xs text-[--cr-muted] mt-4 mb-6">{heroData.trustLine}</p>
              <div className="flex flex-wrap gap-2">
                {heroData.badges.map((badge) => (
                  <span
                    key={badge}
                    className="text-xs font-semibold px-3 py-1.5 rounded-full bg-[--cr-teal-light] text-[--cr-teal]"
                  >
                    {badge}
                  </span>
                ))}
              </div>
            </div>
            <HeroBento cards={heroData.bentoCards} />
          </div>
        </div>
      </section>
    </div>
  );
}
