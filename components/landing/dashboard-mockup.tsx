"use client";

import { memo, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { dashboardMockData } from "@/lib/content/clinicrelay-landing";

export const DashboardMockup = memo(function DashboardMockup() {
  const [utilization, setUtilization] = useState(71);
  const [pulse, setPulse] = useState(false);
  const started = useRef(false);

  useEffect(() => {
    if (started.current) return;
    started.current = true;
    let val = 71;
    const id = setInterval(() => {
      val += 1;
      setUtilization(val);
      if (val >= 84) clearInterval(id);
    }, 60);
    const pulseId = setInterval(() => setPulse((p) => !p), 1600);
    return () => { clearInterval(id); clearInterval(pulseId); };
  }, []);

  const [active, setActive] = useState("Today");

  return (
    <section className="py-24 md:py-32 bg-white">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
        <div className="mb-14">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[--cr-teal] mb-3">Dashboard</p>
          <h2 className="text-3xl md:text-4xl tracking-tight font-semibold text-[--cr-text]">
            Everything your front desk needs to see.
          </h2>
        </div>
        <div className="rounded-[2rem] border border-[--cr-border] bg-[--cr-surface-2] overflow-hidden" style={{ boxShadow: "var(--cr-shadow)" }}>
          <div className="flex">
            <aside className="hidden md:flex flex-col w-52 shrink-0 border-r border-[--cr-border] p-4 gap-1">
              {dashboardMockData.navItems.map((item) => (
                <button
                  key={item}
                  onClick={() => setActive(item)}
                  className={`text-left text-sm px-3 py-2 rounded-xl transition-colors ${
                    active === item
                      ? "bg-[--cr-teal] text-white font-semibold"
                      : "text-[--cr-muted] hover:bg-[--cr-teal-light] hover:text-[--cr-teal]"
                  }`}
                >
                  {item}
                </button>
              ))}
            </aside>
            <main className="flex-1 p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-[--cr-text] tracking-tight">{active}</h3>
                <div className="flex items-center gap-2 text-xs text-[--cr-muted]">
                  <motion.div
                    className="w-2 h-2 rounded-full bg-[--cr-teal]"
                    animate={{ scale: pulse ? 1.5 : 1, opacity: pulse ? 0.5 : 1 }}
                    transition={{ duration: 0.4 }}
                  />
                  Recovery active
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                <div className="col-span-2 rounded-2xl bg-white border border-[--cr-border] p-5">
                  <p className="text-xs font-semibold text-[--cr-muted] mb-1">Slot Utilization</p>
                  <p className="text-4xl font-semibold tracking-tighter text-[--cr-text]">{utilization}%</p>
                  <p className="text-xs text-[--cr-teal] mt-1">+13% vs last week</p>
                </div>
                {dashboardMockData.metrics.slice(1).map((m) => (
                  <div key={m.label} className="rounded-2xl bg-white border border-[--cr-border] p-4">
                    <p className="text-xs font-semibold text-[--cr-muted] mb-1 leading-tight">{m.label}</p>
                    <p className="text-2xl font-semibold tracking-tighter text-[--cr-text]">{m.value}</p>
                    {m.sub && <p className="text-xs text-[--cr-teal] mt-0.5">{m.sub}</p>}
                  </div>
                ))}
              </div>
            </main>
          </div>
        </div>
      </div>
    </section>
  );
});
