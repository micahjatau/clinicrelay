"use client";

import { useDemoModal } from "@/context/demo-modal-context";

export function PricingCtaButton() {
  const { open } = useDemoModal();
  return (
    <button
      onClick={open}
      className="w-full cr-btn cr-btn-primary px-5 py-3"
    >
      Book a Demo
    </button>
  );
}
