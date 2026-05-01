import { CalendarBlank, ListChecks, ChatCircle, ArrowBendUpLeft, CheckCircle } from "@phosphor-icons/react/dist/ssr";
import { AnimatedSection } from "./animated-section";
import { recoverySteps } from "@/lib/content/clinicrelay-landing";
import { WaitlistCtaButton } from "./waitlist-cta-button";

const iconMap: Record<string, React.ElementType> = {
  CalendarBlank, ListChecks, ChatCircle, ArrowBendUpLeft, CheckCircle,
};

export function WaitlistSection() {
  return (
    <section id="waitlist" className="py-24 md:py-32 bg-[--cr-bg]">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
        <AnimatedSection className="mb-14">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[--cr-teal] mb-3">Waitlist Recovery</p>
          <h2 className="text-3xl md:text-4xl tracking-tight font-semibold text-[--cr-text] max-w-[28ch]">
            Every cancellation is a recovery opportunity.
          </h2>
        </AnimatedSection>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-start">
          <div className="flex flex-col gap-0 relative">
            <div className="absolute left-[19px] top-8 bottom-8 w-px bg-[--cr-border]" />
            {recoverySteps.map((step, i) => {
              const Icon = iconMap[step.icon];
              return (
                <AnimatedSection key={step.number} delay={i * 0.1} className="flex gap-6 pb-10 relative">
                  <div className="w-10 h-10 rounded-full bg-[--cr-teal-light] border-2 border-[--cr-teal] flex items-center justify-center shrink-0 z-10">
                    {Icon && <Icon size={18} weight="duotone" className="text-[--cr-teal]" />}
                  </div>
                  <div className="pt-1">
                    <p className="text-xs font-semibold text-[--cr-teal] mb-1">{step.number}</p>
                    <h3 className="text-xl font-semibold text-[--cr-text] tracking-tight mb-1">{step.title}</h3>
                    <p className="text-[--cr-muted] text-base leading-relaxed">{step.copy}</p>
                  </div>
                </AnimatedSection>
              );
            })}
          </div>
          <AnimatedSection delay={0.2}>
            <div className="rounded-[2rem] border border-[--cr-border] bg-white p-8" style={{ boxShadow: "var(--cr-shadow)" }}>
              <p className="text-xs font-semibold text-[--cr-muted] mb-4 uppercase tracking-widest">Recovery Panel</p>
              <div className="rounded-xl bg-[--cr-surface-2] border border-[--cr-border] p-4 mb-4">
                <p className="text-sm font-semibold text-[--cr-text]">Open Slot — Dr. Patel</p>
                <p className="text-xs text-[--cr-muted]">Thursday 2:30 PM · Preventive Care · 45 min</p>
              </div>
              {[
                { name: "Rangi T.", match: "High — due for recall, lives nearby" },
                { name: "Soha M.", match: "Medium — flexible schedule" },
                { name: "Dev K.", match: "Medium — cancelled last month" },
              ].map((c, i) => (
                <div key={i} className="flex items-center justify-between py-3 border-t border-[--cr-border]">
                  <div>
                    <p className="text-sm font-semibold text-[--cr-text]">{c.name}</p>
                    <p className="text-xs text-[--cr-muted]">{c.match}</p>
                  </div>
                  <span className="text-xs font-semibold px-3 py-1 rounded-full bg-[--cr-teal-light] text-[--cr-teal]">SMS Sent</span>
                </div>
              ))}
              <div className="mt-4 pt-4 border-t border-[--cr-border]">
                <p className="text-xs text-[--cr-muted]">Rangi T. replied: <span className="text-[--cr-teal] font-semibold">&quot;Yes, I can make it!&quot;</span></p>
                <p className="text-xs text-[--cr-muted] mt-1">Slot confirmed — 4 minutes after cancellation.</p>
              </div>
              <WaitlistCtaButton />
            </div>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
}
