"use client";

import dynamic from "next/dynamic";
import { useDemoModal } from "@/context/demo-modal-context";

const DemoModal = dynamic(
  () => import("@/components/landing/demo-modal").then((m) => m.DemoModal),
  { ssr: false }
);

export function DemoModalLazy() {
  const { isOpen } = useDemoModal();
  if (!isOpen) return null;
  return <DemoModal />;
}
