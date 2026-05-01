"use client";

import { useDemoModal } from "@/context/demo-modal-context";

export function MobileStickyCta() {
  const { open } = useDemoModal();
  return (
    <div className="md:hidden fixed bottom-0 inset-x-0 z-40 border-t border-[--cr-border] bg-white/95 backdrop-blur px-4 py-3">
      <button onClick={open} className="w-full cr-btn cr-btn-primary px-4 py-3">Book a Demo</button>
      <p className="text-[11px] text-[--cr-muted] text-center mt-2">Typical setup in under 7 days.</p>
    </div>
  );
}
