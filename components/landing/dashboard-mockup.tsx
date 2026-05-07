"use client";

import { memo, useRef, useState } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { dashboardMockData } from "@/lib/content/clinicrelay-landing";
import { useCountUp } from "./hooks/use-count-up";

type Row = {
  slot: string;
  provider: string;
  patient: string;
  outreach: string;
  reply: string;
  task: string;
  status: "Cancelled" | "Pending" | "Booked" | "In Progress";
};

const recoveryRows: Row[] = [
  {
    slot: "Today, 10:30 AM · Dr. Patel",
    provider: "New Patient Consult",
    patient: "Jessica Smith",
    outreach: "SMS sent 10:32 AM",
    reply: "Yes, I can take it.",
    task: "Confirm & book",
    status: "Pending",
  },
  {
    slot: "Today, 1:00 PM · Dr. Lee",
    provider: "Return Visit",
    patient: "Robert Martinez",
    outreach: "SMS sent 12:15 PM",
    reply: "Yes, that works.",
    task: "Completed by Sam",
    status: "Booked",
  },
  {
    slot: "Today, 3:30 PM · Dr. Patel",
    provider: "New Patient Consult",
    patient: "Alyssa Lin",
    outreach: "SMS sent 3:31 PM",
    reply: "No reply",
    task: "First reminder due 3:46 PM",
    status: "In Progress",
  },
];

function statusClass(status: Row["status"]) {
  if (status === "Booked") return "cr-badge cr-badge-success";
  if (status === "Pending") return "cr-badge cr-badge-warning";
  if (status === "Cancelled") return "cr-badge cr-badge-danger";
  return "cr-badge cr-badge-teal";
}

export const DashboardMockup = memo(function DashboardMockup() {
  const [active, setActive] = useState("Waitlist Recovery");
  const headerRef = useRef<HTMLDivElement>(null);
  const inView = useInView(headerRef, { once: true, margin: "-15% 0px" });
  const [showToast, setShowToast] = useState(false);

  // Trigger toast once when section enters view
  const toastFiredRef = useRef(false);
  if (inView && !toastFiredRef.current) {
    toastFiredRef.current = true;
    setTimeout(() => setShowToast(true), 1200);
    setTimeout(() => setShowToast(false), 3700);
  }

  return (
    <section className="py-24 md:py-32 bg-white">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
        <div ref={headerRef} className="mb-14 flex items-center justify-between gap-4 flex-wrap">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[--cr-teal] mb-3">Dashboard</p>
            <h2 className="text-3xl md:text-4xl tracking-tight font-semibold text-[--cr-text]">Proof of recovery in one view.</h2>
            <p className="text-sm text-[--cr-muted] mt-2">Sample workflow dashboard. Metrics shown for demonstration only and do not represent actual clinic outcomes.</p>
          </div>
          <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-[--cr-muted] border border-[--cr-border]">Demo workflow data</span>
        </div>

        <div className="rounded-[2rem] border border-[--cr-border] bg-[--cr-surface-2] overflow-hidden relative" style={{ boxShadow: "var(--cr-shadow)" }}>
          {/* Toast */}
          <AnimatePresence>
            {showToast && (
              <motion.div
                initial={{ opacity: 0, y: -12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.25 }}
                className="absolute top-4 right-4 z-20 rounded-xl border border-[--cr-teal] bg-white px-4 py-2.5 text-xs font-semibold text-[--cr-teal] shadow-md"
              >
                New reply received — Alyssa Lin
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex">
            <aside className="hidden md:flex flex-col w-56 shrink-0 border-r border-[--cr-border] p-4 gap-1 bg-white">
              {dashboardMockData.navItems.map((item) => (
                <button
                  key={item}
                  onClick={() => setActive(item)}
                  className={`text-left text-sm px-3 py-2 rounded-xl transition-colors ${
                    active === item ? "bg-[--cr-teal] text-white font-semibold" : "text-[--cr-muted] hover:bg-[--cr-teal-light] hover:text-[--cr-teal]"
                  }`}
                >
                  {item}
                </button>
              ))}
            </aside>

            <main className="flex-1 p-6 bg-white">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <Metric label="Cancelled Today" rawValue={4} suffix="" tone="danger" inView={inView} />
                <Metric label="Recovery in Progress" rawValue={2} suffix="" tone="warning" inView={inView} />
                <Metric label="Recovered Today" rawValue={3} suffix="" tone="success" inView={inView} />
                <Metric label="Recovery Rate" rawValue={75} suffix="%" tone="teal" inView={inView} />
              </div>

              <div className="md:hidden space-y-3">
                {recoveryRows.map((row, i) => (
                  <motion.div
                    key={`${row.slot}-${row.patient}`}
                    initial={{ opacity: 0, y: 8 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ delay: i * 0.1, duration: 0.3 }}
                    className="rounded-xl border border-[--cr-border] bg-[--cr-slate-light] p-4"
                  >
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div>
                        <p className="font-semibold text-[--cr-text] text-sm">{row.slot}</p>
                        <p className="text-xs text-[--cr-muted]">Cancelled appointment slot · {row.provider}</p>
                      </div>
                      <span className={statusClass(row.status)}>{row.status === "Booked" ? "Slot refilled" : row.status}</span>
                    </div>
                    <div className="space-y-2 text-xs">
                      <p><span className="font-semibold text-[--cr-text]">Match:</span> <span className="text-[--cr-muted]">{row.patient}</span></p>
                      <p><span className="font-semibold text-[--cr-text]">Outreach:</span> <span className="text-[--cr-muted]">{row.outreach}</span></p>
                      <p><span className="font-semibold text-[--cr-text]">Reply:</span> <span className="text-[--cr-muted]">{row.reply}</span></p>
                      <p><span className="font-semibold text-[--cr-text]">Staff task:</span> <span className="text-[--cr-muted]">{row.task}</span></p>
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="hidden md:block overflow-x-auto">
                <table className="w-full min-w-[860px] text-sm">
                  <thead>
                    <tr className="text-left text-xs text-[--cr-muted] border-b border-[--cr-border]">
                      <th className="py-3 pr-3">Slot & Reason</th>
                      <th className="py-3 pr-3">Waitlist Match</th>
                      <th className="py-3 pr-3">Outreach</th>
                      <th className="py-3 pr-3">Patient Reply</th>
                      <th className="py-3 pr-3">Staff Task</th>
                      <th className="py-3">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recoveryRows.map((row, i) => (
                      <motion.tr
                        key={`${row.slot}-${row.patient}`}
                        initial={{ opacity: 0, y: 6 }}
                        animate={inView ? { opacity: 1, y: 0 } : {}}
                        transition={{ delay: 0.2 + i * 0.1, duration: 0.3 }}
                        className="border-b border-[--cr-border] last:border-0 align-top"
                      >
                        <td className="py-3 pr-3">
                          <p className="font-semibold text-[--cr-text]">{row.slot}</p>
                          <p className="text-xs text-[--cr-muted]">Cancelled appointment slot · {row.provider}</p>
                        </td>
                        <td className="py-3 pr-3">
                          <p className="font-semibold text-[--cr-text]">{row.patient}</p>
                          <p className="text-xs text-[--cr-muted]">Eligible waitlist patient</p>
                        </td>
                        <td className="py-3 pr-3">
                          <p className="text-[--cr-text]">{row.outreach}</p>
                          <p className="text-xs text-[--cr-muted]">Recovery offer sent</p>
                        </td>
                        <td className="py-3 pr-3">
                          <p className="text-[--cr-text]">{row.reply}</p>
                          <p className="text-xs text-[--cr-muted]">Patient reply captured</p>
                        </td>
                        <td className="py-3 pr-3">
                          <p className="text-[--cr-text]">{row.task}</p>
                          <p className="text-xs text-[--cr-muted]">Staff confirmation task</p>
                        </td>
                        <td className="py-3">
                          <span className={statusClass(row.status)}>{row.status === "Booked" ? "Slot refilled" : row.status}</span>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </main>
          </div>
        </div>
      </div>
    </section>
  );
});

function Metric({
  label,
  rawValue,
  suffix,
  tone,
  inView,
}: {
  label: string;
  rawValue: number;
  suffix: string;
  tone: "danger" | "warning" | "success" | "teal";
  inView: boolean;
}) {
  const count = useCountUp(rawValue, inView);
  const toneClass = {
    danger: "text-[--cr-danger]",
    warning: "text-[--cr-warning]",
    success: "text-[--cr-success]",
    teal: "text-[--cr-teal]",
  }[tone];

  return (
    <div className="rounded-2xl border border-[--cr-border] bg-[--cr-slate-light] p-4">
      <p className="text-xs font-semibold text-[--cr-muted] mb-1">{label}</p>
      <p className={`text-2xl font-semibold tracking-tight ${toneClass}`}>
        {count}{suffix}
      </p>
    </div>
  );
}
