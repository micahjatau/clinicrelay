"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

export type DemoIntent = "demo" | "audit" | "recovery";

type DemoModalContextType = {
  isOpen: boolean;
  intent: DemoIntent;
  open: (intent?: DemoIntent) => void;
  close: () => void;
};

const DemoModalContext = createContext<DemoModalContextType | null>(null);

export function DemoModalProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [intent, setIntent] = useState<DemoIntent>("demo");

  const open = (nextIntent: DemoIntent = "demo") => {
    setIntent(nextIntent);
    setIsOpen(true);
  };

  return (
    <DemoModalContext.Provider value={{ isOpen, intent, open, close: () => setIsOpen(false) }}>
      {children}
    </DemoModalContext.Provider>
  );
}

export function useDemoModal() {
  const ctx = useContext(DemoModalContext);
  if (!ctx) throw new Error("useDemoModal must be used inside DemoModalProvider");
  return ctx;
}
