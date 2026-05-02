"use client";

import { useDemoModal } from "@/context/demo-modal-context";
import { heroData } from "@/lib/content/clinicrelay-landing";

export function HeroCtaButtons() {
  const { open } = useDemoModal();
  return (
    <div className="flex flex-wrap gap-3">
      <p className="w-full text-xs text-[--cr-muted] mb-1 md:hidden">Typical setup in under 7 days. No long-term lock-in.</p>
      <button onClick={() => open("demo")} className="cr-btn cr-btn-primary px-5 py-3">
        {heroData.primaryCta}
      </button>
      <button onClick={() => open("audit")} className="cr-btn cr-btn-secondary px-5 py-3">
        {heroData.secondaryCta}
      </button>
      <p className="hidden md:block w-full text-xs text-[--cr-muted] mt-1">Typical setup in under 7 days. No long-term lock-in.</p>
    </div>
  );
}
