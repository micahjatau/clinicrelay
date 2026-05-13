import Link from "next/link";
import { pricingPackages } from "@/lib/content/clinicrelay-landing";

export default function PricingPage() {
  return (
    <main className="min-h-[100dvh] bg-[--cr-bg] pt-28 pb-20">
      <section className="max-w-[1100px] mx-auto px-6">
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[--cr-teal] mb-3">Pricing</p>
        <h1 className="text-4xl md:text-6xl tracking-tighter font-semibold text-[--cr-text] leading-[0.95] mb-10">Choose the fastest path to recovered revenue.</h1>
        <p className="text-base text-[--cr-muted] max-w-2xl mb-10">Start with an audit, prove value with a focused pilot, then scale what works across the clinic.</p>
        <div className="grid gap-4 md:grid-cols-3">
          {pricingPackages.map((pkg) => (
            <article key={pkg.name} className="rounded-3xl border border-[--cr-border] bg-white p-6">
              {pkg.recommended && <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[--cr-teal] mb-3">Most popular</p>}
              <h2 className="text-xl font-semibold text-[--cr-text] tracking-tight mb-2">{pkg.name}</h2>
              <p className="text-sm text-[--cr-muted] mb-4">{pkg.tagline}</p>
              <ul className="space-y-2 text-sm text-[--cr-muted] mb-6">
                {pkg.features.map((f) => <li key={f}>• {f}</li>)}
              </ul>
              <Link href="/demo" className="cr-btn cr-btn-primary w-full justify-center">Book a Demo</Link>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
