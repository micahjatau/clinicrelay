import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About ClinicRelay | Front-Desk Orchestration for Clinics",
  description:
    "Learn how ClinicRelay helps clinics coordinate bookings, reduce missed appointments, recover cancelled slots, and reduce front-desk chaos.",
  alternates: {
    canonical: "https://www.clinicrelay.co/about",
  },
};

export default function AboutPage() {
  return (
    <main className="min-h-[100dvh] bg-[--cr-bg] pt-28 pb-20">
      <section className="max-w-[900px] mx-auto px-6">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[--cr-teal] mb-4">
          About
        </p>
        <h1 className="text-4xl md:text-5xl tracking-tight font-semibold text-[--cr-text] mb-6">
          About ClinicRelay
        </h1>
        <div className="space-y-5 text-base md:text-lg text-[--cr-muted] leading-relaxed max-w-[68ch]">
          <p>
            ClinicRelay is a front-desk orchestration platform for modern clinics. It helps teams coordinate bookings,
            reduce missed appointments, recover cancelled slots, and keep patient communication moving without adding
            more admin burden.
          </p>
          <p>
            The product is built around the idea that clinics do not need more noise. They need a clearer queue for the
            work that already lives at the front desk: scheduling, follow-up, waitlist recovery, and patient readiness.
          </p>
          <p>
            ClinicRelay was founded by Micah Jatau to give clinics a cleaner operational layer between the calendar and
            the patient walk-in.
          </p>
          <p>
            If you want to talk about a workflow audit, a demo, or a pilot, reach out at{' '}
            <a href="mailto:hello@clinicrelay.co" className="text-[--cr-text] hover:text-[--cr-teal] underline underline-offset-4">
              hello@clinicrelay.co
            </a>{' '}
            or visit{' '}
            <a href="https://www.clinicrelay.co" className="text-[--cr-text] hover:text-[--cr-teal] underline underline-offset-4">
              www.clinicrelay.co
            </a>.
          </p>
        </div>
      </section>
    </main>
  );
}
