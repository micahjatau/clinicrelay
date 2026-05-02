"use client";

import { useDemoModal } from "@/context/demo-modal-context";

export function PricingCtaButton() {
  const { open } = useDemoModal();
  return (
    <button
      onClick={() => open("demo")}
      className="w-full cr-btn cr-btn-primary px-5 py-3"
    >
Start Recovery Pilot
    </button>
  );
}
