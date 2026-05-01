"use client";

import { useDemoModal } from "@/context/demo-modal-context";

export function PricingCtaButton() {
  const { open } = useDemoModal();
  return (
    <button
      onClick={open}
      className="w-full bg-[--cr-teal] text-white px-5 py-3 rounded-xl font-semibold shadow-[0_12px_26px_rgba(13,148,136,0.22)] hover:bg-[--cr-teal-dark] active:-translate-y-px active:scale-[0.98] transition-all duration-150"
    >
      Book a Demo
    </button>
  );
}
