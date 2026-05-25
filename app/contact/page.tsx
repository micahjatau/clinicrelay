import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact ClinicRelay",
  description: "Contact ClinicRelay for demos, workflow audits, and clinic partnerships.",
  alternates: {
    canonical: "https://www.clinicrelay.co/contact",
  },
};

export default function ContactPage() {
  return (
    <main className="min-h-[100dvh] bg-[--cr-bg] pt-28 pb-20">
      <section className="max-w-[900px] mx-auto px-6">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[--cr-teal] mb-4">
          Contact
        </p>
        <h1 className="text-4xl md:text-5xl tracking-tight font-semibold text-[--cr-text] mb-6">
          Contact ClinicRelay
        </h1>
        <div className="space-y-5 text-base md:text-lg text-[--cr-muted] leading-relaxed max-w-[68ch]">
          <p>
            Contact ClinicRelay for clinic partnerships, demos, workflow audits, and product inquiries.
          </p>
          <p>
            Email: <a href="mailto:hello@clinicrelay.co" className="text-[--cr-text] hover:text-[--cr-teal] underline underline-offset-4">hello@clinicrelay.co</a>
          </p>
          <p>
            Website: <a href="https://www.clinicrelay.co" className="text-[--cr-text] hover:text-[--cr-teal] underline underline-offset-4">www.clinicrelay.co</a>
          </p>
        </div>
      </section>
    </main>
  );
}
