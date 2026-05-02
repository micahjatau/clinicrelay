"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { List, X } from "@phosphor-icons/react";
import { useDemoModal } from "@/context/demo-modal-context";
import { navLinks } from "@/lib/content/clinicrelay-landing";
import { Button } from "@/components/ui/button";

export function Nav() {
  const { open } = useDemoModal();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 inset-x-0 z-40 transition-shadow duration-200 ${
        scrolled ? "bg-white/95 backdrop-blur-sm border-b border-[--cr-border] shadow-sm" : "bg-transparent"
      }`}
    >
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10 h-[4.25rem] flex items-center justify-between md:grid md:grid-cols-[auto_1fr_auto] md:gap-6">
        <a href="#" className="flex items-center gap-2.5">
          <Image src="/logo-mark.svg" alt="ClinicRelay" width={24} height={24} priority />
          <span className="font-semibold text-[15px] text-[--cr-text] tracking-tight">ClinicRelay</span>
          <span className="hidden sm:inline text-[11px] text-[--cr-muted] tracking-wide uppercase">Front-Desk Orchestration</span>
        </a>

        <nav className="hidden md:flex items-center justify-center gap-6">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-[13px] tracking-wide text-[--cr-muted] hover:text-[--cr-text] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[--cr-teal] rounded"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-4">
          <Button onClick={() => open("demo")} size="sm" className="h-9 px-4 min-w-[118px] bg-[#0F766E] text-white hover:bg-[#115e59]">Book a Demo</Button>
          <button
            onClick={() => open("audit")}
            className="text-[13px] font-semibold text-[--cr-teal] hover:text-[--cr-teal-dark] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[--cr-teal] rounded"
          >
            Request Workflow Audit
          </button>
        </div>

        <button
          className="md:hidden text-[--cr-text]"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          {menuOpen ? <X size={22} /> : <List size={22} />}
        </button>
      </div>

      {menuOpen && (
        <div className="md:hidden bg-white border-t border-[--cr-border] px-6 py-4 flex flex-col gap-3">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-base font-medium text-[--cr-text] hover:text-[--cr-teal] py-2 px-1 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[--cr-teal]"
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </a>
          ))}
          <Button
            onClick={() => { open("demo"); setMenuOpen(false); }}
            size="sm"
            className="mt-2 w-full justify-center bg-[#0F766E] text-white hover:bg-[#115e59]"
          >
            Book a Demo
          </Button>
        </div>
      )}
    </header>
  );
}
