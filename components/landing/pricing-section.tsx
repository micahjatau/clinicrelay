import { AnimatedSection } from "./animated-section";
import { pricingPackages } from "@/lib/content/clinicrelay-landing";
import { PricingCtaButton } from "./pricing-cta-button";
import { CheckCircle } from "@phosphor-icons/react/dist/ssr";

export function PricingSection() {
  return (
    <section id="pricing" className="py-24 md:py-32 bg-white">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
        <AnimatedSection className="mb-14">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[--cr-teal] mb-3">Pricing</p>
          <h2 className="text-3xl md:text-4xl tracking-tight font-semibold text-[--cr-text]">
            Custom quote for every clinic.
          </h2>
          <p className="text-base text-[--cr-muted] mt-3 max-w-[55ch]">Every clinic is different. Book a demo and we'll put together a quote based on your size, services, and goals.</p>
        </AnimatedSection>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {pricingPackages.map((pkg, i) => (
            <AnimatedSection key={pkg.name} delay={i * 0.1}>
              <div
                className={`rounded-[2rem] border-2 bg-white p-8 flex flex-col h-full ${pkg.recommended ? "border-[--cr-teal]" : "border-[--cr-border]"}`}
                style={{ boxShadow: pkg.recommended ? "0 0 0 4px rgba(13,148,136,0.08), var(--cr-shadow)" : "var(--cr-shadow)" }}
              >
                {pkg.recommended && (
                  <span className="text-xs font-semibold px-3 py-1.5 rounded-full bg-[--cr-teal-light] text-[--cr-teal] self-start mb-4">Recommended</span>
                )}
                <h3 className="text-xl font-semibold text-[--cr-text] tracking-tight mb-2">{pkg.name}</h3>
                <p className="text-sm text-[--cr-muted] mb-6 leading-relaxed">{pkg.tagline}</p>
                <ul className="flex flex-col gap-3 mb-8 flex-1">
                  {pkg.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-[--cr-muted]">
                      <CheckCircle size={16} weight="duotone" className="text-[--cr-teal] mt-0.5 shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <PricingCtaButton />
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}
