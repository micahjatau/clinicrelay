"use client";

import { useDemoModal } from "@/context/demo-modal-context";

export function FinalCtaButtons() {
  const { open } = useDemoModal();
  return (
    <div className="flex flex-wrap gap-4 justify-center">
      <button
        onClick={open}
        className="bg-[--cr-teal] text-white px-6 py-3 rounded-xl font-semibold shadow-[0_12px_26px_rgba(13,148,136,0.22)] hover:bg-[--cr-teal-dark] active:-translate-y-px active:scale-[0.98] transition-all duration-150"
      >
        Book a Demo
      </button>
      <button
        onClick={open}
        className="border border-white/30 text-white px-6 py-3 rounded-xl font-semibold hover:bg-white/10 transition-colors"
      >
        Request Workflow Audit
      </button>
    </div>
  );
}
