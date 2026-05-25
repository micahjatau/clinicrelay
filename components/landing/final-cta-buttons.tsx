"use client";

import { useDemoModal } from "@/context/demo-modal-context";

export function FinalCtaButtons() {
  const { open } = useDemoModal();
  return (
    <div className="flex flex-wrap gap-4 justify-center">
      <button onClick={() => open("audit")} className="cr-btn px-6 py-3 bg-[#0F766E] text-white hover:bg-[#115e59]">Request Workflow Audit</button>
      <a href="#waitlist" className="cr-btn border border-white/50 text-white px-6 py-3 hover:bg-white/10">See Recovery Workflow</a>
      <a
        href="mailto:hello@clinicrelay.co?subject=ClinicRelay%20Demo%20Request"
        className="cr-btn border border-white/50 text-white px-6 py-3 hover:bg-white/10"
      >
        Email us
      </a>
      <p className="w-full text-xs text-white/85">For demo requests and clinic partnerships, email <a href="mailto:hello@clinicrelay.co" className="underline underline-offset-4 hover:text-white">hello@clinicrelay.co</a>. Response within one business day. Pilot-first onboarding.</p>
    </div>
  );
}
