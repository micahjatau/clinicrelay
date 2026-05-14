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
    <div className="flex flex-wrap gap-3">
      <p className="w-full text-xs text-[--cr-muted] mb-1 md:hidden">Typical setup in under 7 days. No long-term lock-in.</p>
      <RippleButton onClick={() => open("audit")} className="cr-btn cr-btn-primary px-5 py-3">
        {heroData.primaryCta}
        <RippleButtonRipples color="rgba(255,255,255,0.45)" />
      </RippleButton>
      <RippleButton asChild>
        <a href="#waitlist" className="cr-btn cr-btn-secondary px-5 py-3">
          {heroData.secondaryCta}
          <RippleButtonRipples color="rgba(13,148,136,0.3)" />
        </a>
      </RippleButton>
      <p className="hidden md:block w-full text-xs text-[--cr-muted] mt-1">Typical setup in under 7 days. No long-term lock-in.</p>
    </div>
  );
}
