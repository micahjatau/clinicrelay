"use client";

import { useEffect, useState } from "react";
import { useDemoModal } from "@/context/demo-modal-context";

export function MobileStickyCta() {
  const { open } = useDemoModal();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 700);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!visible) return null;

  return (
    <div className="md:hidden fixed bottom-0 inset-x-0 z-40 border-t border-[--cr-border] bg-white/95 backdrop-blur px-4 py-3">
      <button onClick={() => open("demo")} className="w-full cr-btn cr-btn-primary px-4 py-3">Book a Demo</button>
      <p className="text-[11px] text-[--cr-muted] text-center mt-2">Pilot-first setup. No long-term lock-in.</p>
    </div>
  );
}
