"use client";

import { useDemoModal } from "@/context/demo-modal-context";

export function FinalCtaButtons() {
  const { open } = useDemoModal();
  return (
    <div className="flex flex-wrap gap-4 justify-center">
      <button onClick={open} className="cr-btn px-6 py-3 bg-[#0F766E] text-white hover:bg-[#115e59]">Book a Demo</button>
      <button onClick={open} className="cr-btn border border-white/50 text-white px-6 py-3 hover:bg-white/10">Request Workflow Audit</button>
      <p className="w-full text-xs text-white/85">Response within one business day. Pilot-first onboarding.</p>
    </div>
  );
}
