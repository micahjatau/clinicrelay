import { AnimatedSection } from "./animated-section";
import { commandCenterItems, type CommandCenterStatus } from "@/lib/content/clinicrelay-landing";

const statusStyle: Record<CommandCenterStatus, { dot: string; label: string; text: string }> = {
  action: { dot: "bg-[--cr-danger]", label: "Needs action", text: "text-[--cr-danger]" },
  pending: { dot: "bg-[--cr-warning]", label: "Pending", text: "text-[--cr-warning]" },
  done: { dot: "bg-[--cr-success]", label: "Done", text: "text-[--cr-success]" },
};

export function FrontDeskCommand() {
  return (
    <section id="command-center" className="py-24 md:py-32 bg-[--cr-bg]">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <AnimatedSection>
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[--cr-teal] mb-3">Front Desk Command Center</p>
            <h2 className="text-3xl md:text-5xl tracking-tighter font-semibold text-[--cr-text] mb-6 max-w-[22ch]">
              One place for the work the front desk usually carries in memory.
            </h2>
            <p className="text-base leading-relaxed text-[--cr-muted]">
              Appointment changes, insurance follow-up, estimates, reminders, and waitlist recovery
              become visible staff-owned tasks instead of scattered calls and inbox fragments.
            </p>
          </AnimatedSection>

          <AnimatedSection delay={0.1}>
            <div className="rounded-[2rem] border border-[--cr-border] bg-white overflow-hidden" style={{ boxShadow: "var(--cr-shadow)" }}>
              <div className="flex items-center justify-between px-6 py-4 border-b border-[--cr-border]">
                <p className="text-sm font-semibold text-[--cr-text] tracking-tight">Staff Queue — Today</p>
                <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-[--cr-muted] border border-[--cr-border]">
                  Demo workflow data
                </span>
              </div>
              <ul className="divide-y divide-[--cr-border]">
                {commandCenterItems.map((item) => {
                  const s = statusStyle[item.status];
                  return (
                    <li key={item.label} className="flex items-center justify-between px-6 py-4 gap-4">
                      <div className="flex items-center gap-3 min-w-0">
                        <span className={`w-2 h-2 rounded-full shrink-0 ${s.dot}`} aria-hidden="true" />
                        <span className="text-sm text-[--cr-text] truncate">{item.label}</span>
                      </div>
                      <div className="flex items-center gap-3 shrink-0">
                        <span className={`text-sm font-semibold ${s.text}`}>{item.count}</span>
                        <span className="text-xs text-[--cr-muted] hidden sm:inline">{s.label}</span>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
}
