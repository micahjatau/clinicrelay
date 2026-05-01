"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

type DemoModalContextType = {
  isOpen: boolean;
  open: () => void;
  close: () => void;
};

const DemoModalContext = createContext<DemoModalContextType | null>(null);

export function DemoModalProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <DemoModalContext.Provider value={{ isOpen, open: () => setIsOpen(true), close: () => setIsOpen(false) }}>
      {children}
    </DemoModalContext.Provider>
  );
}

export function useDemoModal() {
  const ctx = useContext(DemoModalContext);
  if (!ctx) throw new Error("useDemoModal must be used inside DemoModalProvider");
  return ctx;
}
