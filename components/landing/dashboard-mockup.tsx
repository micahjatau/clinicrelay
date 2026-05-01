"use client";

import { memo, useState } from "react";
import { dashboardMockData } from "@/lib/content/clinicrelay-landing";

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

  return (
    <section className="py-24 md:py-32 bg-white">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
        <div className="mb-14 flex items-center justify-between gap-4 flex-wrap">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[--cr-teal] mb-3">Dashboard</p>
            <h2 className="text-3xl md:text-4xl tracking-tight font-semibold text-[--cr-text]">Proof of recovery in one view.</h2>
          </div>
          <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-[--cr-muted] border border-[--cr-border]">Demo workflow data</span>
        </div>

        <div className="rounded-[2rem] border border-[--cr-border] bg-[--cr-surface-2] overflow-hidden" style={{ boxShadow: "var(--cr-shadow)" }}>
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
                <Metric label="Cancelled Today" value="4" tone="danger" />
                <Metric label="Recovery in Progress" value="2" tone="warning" />
                <Metric label="Recovered Today" value="3" tone="success" />
                <Metric label="Recovery Rate" value="75%" tone="teal" />
              </div>

              <div className="md:hidden space-y-3">
                {recoveryRows.map((row) => (
                  <div key={`${row.slot}-${row.patient}`} className="rounded-xl border border-[--cr-border] bg-[--cr-slate-light] p-4">
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
                  </div>
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
                    {recoveryRows.map((row) => (
                      <tr key={`${row.slot}-${row.patient}`} className="border-b border-[--cr-border] last:border-0 align-top">
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
                      </tr>
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

function Metric({ label, value, tone }: { label: string; value: string; tone: "danger" | "warning" | "success" | "teal" }) {
  const toneClass = {
    danger: "text-[--cr-danger]",
    warning: "text-[--cr-warning]",
    success: "text-[--cr-success]",
    teal: "text-[--cr-teal]",
  }[tone];

  return (
    <div className="rounded-2xl border border-[--cr-border] bg-[--cr-slate-light] p-4">
      <p className="text-xs font-semibold text-[--cr-muted] mb-1">{label}</p>
      <p className={`text-2xl font-semibold tracking-tight ${toneClass}`}>{value}</p>
    </div>
  );
}
