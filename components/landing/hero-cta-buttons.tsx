"use client";

import { useDemoModal } from "@/context/demo-modal-context";
import { heroData } from "@/lib/content/clinicrelay-landing";
import {
  RippleButton,
  RippleButtonRipples,
} from "@/components/animate-ui/primitives/buttons/ripple";

export function HeroCtaButtons() {
  const { open } = useDemoModal();
  return (
    <div className="flex flex-col sm:flex-row gap-3 mb-4">
      <RippleButton
        onClick={() => open("audit")}
        className="cr-btn cr-btn-primary px-6 py-3.5 text-[15px] w-full sm:w-auto"
      >
        {heroData.primaryCta}
        <RippleButtonRipples color="rgba(255,255,255,0.45)" />
      </RippleButton>
      <RippleButton asChild>
        <a
          href="#waitlist"
          className="cr-btn cr-btn-secondary px-6 py-3.5 text-[15px] text-center w-full sm:w-auto"
        >
          {heroData.secondaryCta}
          <RippleButtonRipples color="rgba(13,148,136,0.3)" />
        </a>
      </RippleButton>
    </div>
  );
}
