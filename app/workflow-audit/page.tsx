import Link from "next/link";

export default function WorkflowAuditPage() {
  return (
    <main className="min-h-[100dvh] bg-[--cr-bg] pt-28 pb-20">
      <section className="max-w-[900px] mx-auto px-6">
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[--cr-teal] mb-3">Workflow Audit</p>
        <h1 className="text-4xl md:text-6xl tracking-tighter font-semibold text-[--cr-text] leading-[0.95] mb-6">Find where operational leakage starts.</h1>
        <p className="text-base text-[--cr-muted] leading-relaxed max-w-[62ch] mb-8">We review cancellations, waitlist follow-up, and front-desk handoffs, then define a pilot scope with clear success metrics.</p>
        <div className="flex flex-wrap gap-3">
          <Link href="/demo" className="cr-btn cr-btn-primary px-5 py-3">Book a Demo</Link>
          <Link href="/#waitlist" className="cr-btn cr-btn-secondary px-5 py-3">See Recovery Workflow</Link>
        </div>
      </section>
    </main>
  );
}
