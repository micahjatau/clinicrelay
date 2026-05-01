"use client";

import { useDemoModal } from "@/context/demo-modal-context";

export function WaitlistCtaButton() {
  const { open } = useDemoModal();
  return (
    <button
      onClick={open}
      className="mt-6 w-full text-center text-sm font-semibold text-[--cr-teal] underline-offset-4 hover:underline"
    >
      See how waitlist recovery works
    </button>
  );
}
