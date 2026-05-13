import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Notice — ClinicRelay",
  description:
    "How ClinicRelay handles website, lead, and pilot workflow information for appointment-based clinics.",
};

const lastUpdated = "May 13, 2026";

type LegalSection = {
  title: string;
  paragraphs?: readonly string[];
  bullets?: readonly string[];
};

const privacySections: readonly LegalSection[] = [
  {
    title: "1. Scope",
    paragraphs: [
      "This Privacy Notice explains how ClinicRelay collects, uses, shares, and safeguards information through this website, demo and workflow-audit forms, and any pre-launch pilot or evaluation services we provide to clinics.",
      "ClinicRelay is designed for appointment-based clinic operations: cancelled-slot recovery, waitlist coordination, patient-request routing, pre-visit readiness, and staff-visible workflow queues. This notice is not a substitute for a signed data processing agreement, business associate agreement, service order, or clinic-specific privacy notice. If a signed agreement says something different, the signed agreement controls.",
    ],
  },
  {
    title: "2. Information we collect",
    paragraphs: [
      "We collect only the information needed to respond to inquiries, evaluate clinic workflows, operate pilots, and improve the product.",
    ],
    bullets: [
      "Website and form information: name, email address, clinic name, role, phone number if provided, form messages, requested services, and other information submitted through demo, audit, or contact forms.",
      "Clinic workflow information during pilots: appointment metadata, cancellation status, waitlist status, patient contact preferences supplied by the clinic, message-routing events, staff task status, intake or insurance readiness status, configuration rules, and audit history needed to coordinate scheduling work.",
      "Technical and usage information: device and browser information, pages visited, referring URLs, timestamps, approximate location derived from IP address, performance data, and product interaction events collected through hosting, analytics, and product-improvement tools.",
      "Communications: emails, call notes, support requests, implementation notes, and other messages exchanged with clinic staff or authorized representatives.",
    ],
  },
  {
    title: "3. How we use information",
    bullets: [
      "Respond to demo, workflow-audit, pilot, support, and sales inquiries.",
      "Map clinic workflows, configure recovery rules, route staff tasks, and support scheduling coordination during authorized pilots.",
      "Send operational notices, onboarding messages, service updates, support replies, and administrative communications.",
      "Monitor reliability, troubleshoot issues, prevent abuse, protect security, and maintain audit visibility.",
      "Improve website content, product usability, implementation processes, and clinic workflow recommendations.",
      "Create aggregated or de-identified learnings that do not reasonably identify a clinic, staff member, patient, or household.",
    ],
  },
  {
    title: "4. Health, HIPAA, and PIPEDA-sensitive workflows",
    paragraphs: [
      "ClinicRelay is intended to support operational coordination, not diagnosis, treatment decisions, emergency response, or clinical judgment. Clinics remain responsible for their patient relationships, legal notices, patient consents, message content, record accuracy, and compliance obligations.",
      "Where a clinic asks ClinicRelay to process protected health information, personal health information, or other regulated patient information, ClinicRelay should do so only under the appropriate written agreement, such as a business associate agreement, data processing agreement, or other clinic-approved terms. Until that agreement is in place, clinics should not submit regulated patient information beyond what is necessary for an authorized evaluation.",
      "ClinicRelay avoids hard compliance claims on this website because formal obligations depend on clinic configuration, jurisdiction, vendors, integrations, message content, and the signed agreements in place.",
    ],
  },
  {
    title: "5. Patient communications and consent",
    paragraphs: [
      "ClinicRelay may help clinics prepare, route, or send appointment-related messages, including waitlist offers, confirmations, reminders, and follow-up requests. Clinics are responsible for confirming they have the right permissions, consents, opt-in status, and lawful basis to contact each patient through the selected channel.",
      "When SMS or other electronic messaging is used, clinics are responsible for honoring opt-outs, maintaining suppression lists, avoiding prohibited content, and ensuring messages match the clinic’s policies and applicable law. ClinicRelay may provide workflow tools to help surface opt-outs or routing decisions, but the clinic remains responsible for final communication governance unless a signed agreement says otherwise.",
    ],
  },
  {
    title: "6. How we share information",
    paragraphs: [
      "We do not sell personal information. We share information only when needed to operate ClinicRelay, support the clinic relationship, comply with law, protect rights and safety, or complete a business transaction such as a financing, merger, acquisition, or asset transfer.",
    ],
    bullets: [
      "Service providers and subprocessors: hosting, database, analytics, email delivery, messaging, security, payment, support, implementation, and infrastructure providers that help operate the service.",
      "Authorized clinic personnel: staff, administrators, or representatives designated by the clinic for implementation, support, audit, or workflow review.",
      "Legal and safety recipients: regulators, courts, law enforcement, professional advisers, or other parties when disclosure is required or appropriate to comply with law, enforce terms, or protect rights, security, and safety.",
      "Aggregated or de-identified outputs: reports or product learnings that do not reasonably identify a person or clinic.",
    ],
  },
  {
    title: "7. Retention",
    paragraphs: [
      "We keep information for as long as needed to provide services, respond to inquiries, run pilots, maintain records, resolve disputes, satisfy legal obligations, and improve ClinicRelay. Pilot workflow data may be deleted, returned, de-identified, or retained according to the applicable written agreement with the clinic.",
    ],
  },
  {
    title: "8. Security",
    paragraphs: [
      "ClinicRelay uses administrative, technical, and organizational safeguards intended to protect information against unauthorized access, loss, misuse, or alteration. No website, cloud service, or electronic communication channel is perfectly secure, so clinics should avoid submitting sensitive information unless it is necessary and covered by the right agreement and configuration.",
    ],
  },
  {
    title: "9. International processing",
    paragraphs: [
      "ClinicRelay and its service providers may process information in the United States, Canada, or other locations where infrastructure or support providers operate. Where required, cross-border processing terms should be addressed in the applicable clinic agreement.",
    ],
  },
  {
    title: "10. Your choices and rights",
    paragraphs: [
      "Clinic staff may ask to access, correct, update, or delete their contact information by contacting ClinicRelay. Patients should direct requests about their medical or clinic records to the clinic that controls those records. Depending on location, individuals may have additional privacy rights under applicable law.",
      "You may opt out of non-essential marketing emails by using the unsubscribe link if one is provided or by contacting us. Operational service messages may still be sent when necessary to administer a pilot, respond to a request, or provide the service.",
    ],
  },
  {
    title: "11. Children",
    paragraphs: [
      "ClinicRelay is not directed to children and is not intended for direct use by minors. Any patient information involving minors should be handled by the clinic under the clinic’s own consent, notice, and recordkeeping obligations.",
    ],
  },
  {
    title: "12. Changes and contact",
    paragraphs: [
      "We may update this notice as ClinicRelay changes or as legal, vendor, or operational requirements evolve. The updated version will be posted on this page with a revised date.",
      "For privacy questions, use the demo or workflow-audit form on this website, or contact the ClinicRelay operator at micahjatau@gmail.com until a dedicated privacy inbox is published.",
    ],
  },
] as const;

export default function PrivacyPage() {
  return (
    <main className="min-h-[100dvh] bg-[--cr-bg] pt-28 pb-20">
      <section className="max-w-[900px] mx-auto px-6">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[--cr-teal] mb-4">
          Legal
        </p>
        <h1 className="text-4xl md:text-5xl tracking-tight font-semibold text-[--cr-text] mb-5">
          Privacy Notice
        </h1>
        <p className="text-sm text-[--cr-muted-soft] mb-8">Last updated: {lastUpdated}</p>

        <div className="rounded-2xl border border-[--cr-border] bg-white p-5 md:p-6 shadow-[var(--cr-shadow)] mb-10">
          <p className="text-base text-[--cr-muted] leading-relaxed">
            This page is practical pre-launch privacy copy for ClinicRelay’s website and pilot workflow. It should be reviewed by counsel before broad commercial rollout, especially before processing regulated patient information or signing clinic customers.
          </p>
        </div>

        <div className="space-y-10">
          {privacySections.map((section) => (
            <section key={section.title} className="border-t border-[--cr-border] pt-8">
              <h2 className="text-2xl font-semibold tracking-tight text-[--cr-text] mb-4">
                {section.title}
              </h2>
              {section.paragraphs?.map((paragraph) => (
                <p key={paragraph} className="text-base text-[--cr-muted] leading-relaxed mb-4">
                  {paragraph}
                </p>
              ))}
              {section.bullets ? (
                <ul className="list-disc pl-5 space-y-3 text-base text-[--cr-muted] leading-relaxed">
                  {section.bullets.map((bullet) => (
                    <li key={bullet}>{bullet}</li>
                  ))}
                </ul>
              ) : null}
            </section>
          ))}
        </div>
      </section>
    </main>
  );
}
