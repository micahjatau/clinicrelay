import Link from "next/link";

export default function DentalUseCasePage() {
  return (
    <main className="min-h-[100dvh] bg-[--cr-bg] pt-28 pb-20">
      <section className="max-w-[900px] mx-auto px-6">
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[--cr-teal] mb-3">Use Case — Dental</p>
        <h1 className="text-4xl md:text-6xl tracking-tighter font-semibold text-[--cr-text] leading-[0.95] mb-6">Dental cancellation recovery workflows.</h1>
        <p className="text-base text-[--cr-muted] leading-relaxed max-w-[62ch] mb-8">Support hygiene refill, waitlist matching, and front-desk confirmation loops without adding manual phone-tag burden.</p>
        <div className="flex flex-wrap gap-3">
          <Link href="/demo" className="cr-btn cr-btn-primary px-5 py-3">Book Demo</Link>
          <Link href="/workflow-audit" className="cr-btn cr-btn-secondary px-5 py-3">Request Audit</Link>
        </div>
      </section>
    </main>
  );
}
