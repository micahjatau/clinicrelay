"use client";

import { useDemoModal } from "@/context/demo-modal-context";
import { heroData } from "@/lib/content/clinicrelay-landing";

export function HeroCtaButtons() {
  const { open } = useDemoModal();
  return (
    <div className="flex flex-wrap gap-3">
      <button
        onClick={open}
        className="bg-[--cr-teal] text-white px-5 py-3 rounded-xl font-semibold shadow-[0_12px_26px_rgba(13,148,136,0.22)] hover:bg-[--cr-teal-dark] active:-translate-y-px active:scale-[0.98] transition-all duration-150"
      >
        {heroData.primaryCta}
      </button>
      <button
        onClick={open}
        className="border border-[--cr-border] bg-white text-[--cr-text] px-5 py-3 rounded-xl font-semibold hover:border-[--cr-teal] transition-colors"
      >
        {heroData.secondaryCta}
      </button>
    </div>
  );
}
