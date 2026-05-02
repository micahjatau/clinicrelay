import Link from "next/link";

export default function DemoPage() {
  return (
    <main className="min-h-[100dvh] bg-[--cr-bg] pt-28 pb-20">
      <section className="max-w-[900px] mx-auto px-6">
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[--cr-teal] mb-3">Demo</p>
        <h1 className="text-4xl md:text-6xl tracking-tighter font-semibold text-[--cr-text] leading-[0.95] mb-6">Book a ClinicRelay demo.</h1>
        <p className="text-base text-[--cr-muted] leading-relaxed max-w-[62ch] mb-8">See cancelled-slot recovery, waitlist matching, and staff confirmation workflows in a guided session.</p>
        <div className="flex flex-wrap gap-3">
          <Link href="/#pricing" className="cr-btn cr-btn-primary px-5 py-3">View Pilot Options</Link>
          <Link href="/workflow-audit" className="cr-btn cr-btn-secondary px-5 py-3">Request Workflow Audit</Link>
        </div>
      </section>
    </main>
  );
}
