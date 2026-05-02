"use client";

import { useDemoModal } from "@/context/demo-modal-context";

export function WaitlistCtaButton() {
  const { open } = useDemoModal();
  return (
    <button
      onClick={() => open("recovery")}
      className="mt-6 w-full text-center text-sm font-semibold text-[--cr-teal] underline-offset-4 hover:underline"
    >
See cancelled-slot recovery demo
    </button>
  );
}
