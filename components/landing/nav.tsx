"use client";

import { useState, useEffect } from "react";
import { List, X } from "@phosphor-icons/react";
import { useDemoModal } from "@/context/demo-modal-context";
import { navLinks } from "@/lib/content/clinicrelay-landing";

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
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10 h-[4.25rem] flex items-center justify-between">
        <div>
          <span className="font-semibold text-[15px] text-[--cr-text] tracking-tight">ClinicRelay</span>
          <span className="hidden sm:inline text-[11px] text-[--cr-muted] ml-2 tracking-wide uppercase">Front-Desk Orchestration</span>
        </div>

        <nav className="hidden md:flex items-center gap-7">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-[13px] tracking-wide text-[--cr-muted] hover:text-[--cr-text] transition-colors"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <button
            onClick={open}
            className="cr-btn cr-btn-primary px-5 py-2.5 text-sm"
          >
            Book a Demo
          </button>
          <button
            onClick={open}
            className="text-[--cr-teal] text-sm underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[--cr-teal] rounded"
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
        <div className="md:hidden bg-white border-t border-[--cr-border] px-6 py-4 flex flex-col gap-4">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm text-[--cr-muted] hover:text-[--cr-text]"
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </a>
          ))}
          <button
            onClick={() => { open(); setMenuOpen(false); }}
            className="cr-btn cr-btn-primary px-5 py-2.5 text-sm text-left"
          >
            Book a Demo
          </button>
        </div>
      )}
    </header>
  );
}
