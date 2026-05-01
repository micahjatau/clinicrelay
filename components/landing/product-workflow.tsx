import { Funnel, CalendarCheck, BellRinging, ArrowsClockwise, ChartBar } from "@phosphor-icons/react/dist/ssr";
import { AnimatedSection } from "./animated-section";
import { workflowSteps } from "@/lib/content/clinicrelay-landing";

const iconMap: Record<string, React.ElementType> = {
  Funnel, CalendarCheck, BellRinging, ArrowsClockwise, ChartBar,
};

export function ProductWorkflow() {
  return (
    <section className="py-24 md:py-32 bg-white">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
        <AnimatedSection className="mb-14">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[--cr-teal] mb-3">How It Works</p>
          <h2 className="text-3xl md:text-4xl tracking-tight font-semibold text-[--cr-text]">
            Five steps from intake to insight.
          </h2>
        </AnimatedSection>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8">
          {workflowSteps.map((step, i) => {
            const Icon = iconMap[step.icon];
            return (
              <AnimatedSection key={step.number} delay={i * 0.08}>
                <div className="flex flex-col gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[--cr-teal-light] flex items-center justify-center">
                    {Icon && <Icon size={20} weight="duotone" className="text-[--cr-teal]" />}
                  </div>
                  <p className="text-2xl font-semibold text-[--cr-text] tracking-tighter">{step.number}</p>
                  <h3 className="text-xl font-semibold text-[--cr-text] tracking-tight">{step.title}</h3>
                  <p className="text-sm text-[--cr-muted] leading-relaxed">{step.copy}</p>
                </div>
              </AnimatedSection>
            );
          })}
        </div>
      </div>
    </section>
  );
}
