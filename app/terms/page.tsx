import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service — ClinicRelay",
  description:
    "Terms governing access to ClinicRelay website, evaluations, pilots, and clinic workflow services.",
};

const lastUpdated = "May 13, 2026";

type LegalSection = {
  title: string;
  paragraphs?: readonly string[];
  bullets?: readonly string[];
};

const termsSections: readonly LegalSection[] = [
  {
    title: "1. Agreement to these Terms",
    paragraphs: [
      "These Terms of Service govern access to the ClinicRelay website, workflow-audit forms, demos, evaluations, pilots, and related services. By using the website, requesting a demo, submitting a workflow-audit form, or participating in a pilot, you agree to these Terms on behalf of yourself or the clinic or organization you represent.",
      "If you are using ClinicRelay for a clinic, practice group, or other organization, you represent that you have authority to bind that organization. If a signed order form, pilot agreement, data processing agreement, business associate agreement, or other written agreement conflicts with these Terms, the signed agreement controls for that relationship.",
    ],
  },
  {
    title: "2. What ClinicRelay provides",
    paragraphs: [
      "ClinicRelay provides workflow software and implementation services for appointment-based clinic operations. The product may support cancelled-slot recovery, waitlist matching, patient-request routing, staff confirmation queues, appointment reminders, pre-visit readiness workflows, intake or insurance status tracking, and operational reporting.",
      "ClinicRelay is an operational coordination tool. It does not provide medical advice, clinical decision-making, diagnosis, treatment recommendations, emergency response, legal advice, billing advice, or insurance determinations.",
    ],
  },
  {
    title: "3. Pilot and pre-launch status",
    paragraphs: [
      "Some ClinicRelay features may be provided as pilots, beta functionality, proofs of concept, or evaluation services. Pilot features may change, be limited, be interrupted, or be discontinued as we learn from clinic workflows and improve the product.",
      "Any timelines, metrics, screenshots, workflow examples, or dashboard values shown on this website are illustrative unless a signed agreement states otherwise. ClinicRelay does not guarantee that a clinic will recover a specific number of appointments, reduce no-shows by a specific percentage, increase revenue, or achieve any particular business outcome.",
    ],
  },
  {
    title: "4. Clinic responsibilities",
    paragraphs: [
      "Clinics remain responsible for their operations, patient relationships, records, staff actions, message content, scheduling decisions, and legal compliance. ClinicRelay helps surface and coordinate work; it does not replace professional judgment or clinic governance.",
    ],
    bullets: [
      "Use ClinicRelay only for lawful clinic operations and only with information you are authorized to provide or process.",
      "Maintain accurate schedules, waitlists, patient contact preferences, consent records, opt-outs, clinic rules, and staff permissions.",
      "Review and approve workflow rules, message templates, patient-facing content, and automated actions before use unless a signed agreement assigns responsibility differently.",
      "Do not use ClinicRelay for emergencies, urgent clinical triage, diagnosis, treatment instructions, or any workflow where a delay or error could create patient safety risk.",
      "Do not upload unnecessary sensitive information, clinical notes, payment card numbers, government identifiers, or other regulated data unless the required written agreement and configuration are in place.",
      "Train staff on appropriate use and promptly notify ClinicRelay of suspected unauthorized access, incorrect configuration, patient opt-out issues, or other workflow risk.",
    ],
  },
  {
    title: "5. Patient communications",
    paragraphs: [
      "ClinicRelay may help prepare, route, or send messages such as waitlist offers, confirmations, reminders, intake prompts, and follow-up requests. The clinic is responsible for ensuring each communication is permitted, accurate, appropriate, and consistent with the clinic’s notices, consents, policies, and applicable law.",
      "For SMS, email, phone, or other electronic messages, clinics are responsible for honoring opt-outs, maintaining suppression lists, obtaining required consent, identifying the sender where required, and avoiding prohibited or sensitive message content. ClinicRelay may provide tooling to support these obligations, but the clinic remains the controller of its patient communication strategy unless a signed agreement says otherwise.",
    ],
  },
  {
    title: "6. Data, privacy, and regulated information",
    paragraphs: [
      "ClinicRelay’s Privacy Notice explains how website, lead, and pilot workflow information is handled. Clinics must not submit protected health information, personal health information, or other regulated patient information unless the appropriate written agreement is in place for the intended use.",
      "Where ClinicRelay acts as a service provider, processor, business associate, or similar vendor role, the specific privacy, security, audit, deletion, retention, and subprocessor obligations should be documented in the applicable signed agreement.",
    ],
  },
  {
    title: "7. Accounts, access, and security",
    paragraphs: [
      "If ClinicRelay provides accounts, shared workspaces, dashboards, or admin access, the clinic is responsible for managing authorized users, protecting credentials, assigning appropriate permissions, and promptly removing access for users who no longer need it.",
      "You may not attempt to bypass security controls, access another clinic’s data, interfere with the service, probe systems without authorization, upload malicious code, scrape the service, or use ClinicRelay in a way that harms patients, clinics, infrastructure, or other users.",
    ],
  },
  {
    title: "8. Fees and payment",
    paragraphs: [
      "Fees, payment timing, taxes, renewal terms, cancellation rights, and pilot scope will be set out in the applicable order form, proposal, invoice, or signed agreement. If a pilot is provided at no charge, ClinicRelay may still require reasonable cooperation, feedback, implementation access, and usage limits as part of the pilot scope.",
    ],
  },
  {
    title: "9. Intellectual property",
    paragraphs: [
      "ClinicRelay and its licensors retain all rights, title, and interest in the website, product, workflow designs, software, documentation, templates, analytics, and related materials. These Terms do not transfer ownership of ClinicRelay technology to any clinic or user.",
      "Clinics retain ownership of their clinic data, patient records, brand assets, and materials they provide. Clinics grant ClinicRelay the rights needed to host, process, transmit, display, and use that information to provide and improve the service, subject to the Privacy Notice and any applicable signed agreement.",
      "Feedback, suggestions, and product ideas may be used by ClinicRelay without restriction or compensation, provided ClinicRelay does not disclose confidential clinic or patient information except as permitted by agreement or law.",
    ],
  },
  {
    title: "10. Third-party services and integrations",
    paragraphs: [
      "ClinicRelay may rely on third-party hosting, database, analytics, messaging, email, support, payment, security, or integration providers. Third-party services may have their own terms, privacy notices, reliability limits, and security practices.",
      "If a clinic asks ClinicRelay to connect with a practice management system, calendar, messaging provider, analytics tool, or other third-party system, the clinic is responsible for confirming it has the right to authorize that connection and for understanding any limits imposed by the third-party provider.",
    ],
  },
  {
    title: "11. Confidentiality",
    paragraphs: [
      "During demos, audits, pilots, or implementation, either party may receive non-public business, workflow, technical, or operational information. Each party should use reasonable care to protect the other party’s confidential information and use it only for the purpose of evaluating, providing, or supporting ClinicRelay, unless disclosure is required by law or permitted by a signed agreement.",
    ],
  },
  {
    title: "12. Disclaimers",
    paragraphs: [
      "ClinicRelay is provided on an “as is” and “as available” basis unless a signed agreement states otherwise. To the fullest extent permitted by law, ClinicRelay disclaims warranties of merchantability, fitness for a particular purpose, non-infringement, uninterrupted operation, error-free operation, and guaranteed business results.",
      "ClinicRelay does not warrant that workflow recommendations, waitlist matching, reminders, message routing, analytics, or dashboard outputs will be complete, accurate, timely, or suitable for every clinic scenario. Staff should review important scheduling, communication, and patient-facing actions before relying on them.",
    ],
  },
  {
    title: "13. Limitation of liability",
    paragraphs: [
      "To the fullest extent permitted by law, ClinicRelay will not be liable for indirect, incidental, special, consequential, exemplary, punitive, or lost-profit damages arising from these Terms or use of the service. ClinicRelay’s total liability for claims related to these Terms or the service will not exceed the amount paid to ClinicRelay for the service giving rise to the claim during the three months before the event that created the liability, or one hundred dollars if no amount was paid, unless a signed agreement states otherwise or applicable law requires a different result.",
    ],
  },
  {
    title: "14. Suspension and termination",
    paragraphs: [
      "ClinicRelay may suspend or limit access if we believe use of the service creates security, legal, patient safety, infrastructure, payment, or abuse risk. Either party may stop an evaluation or pilot according to the applicable written scope. Upon termination, data return, deletion, retention, and transition obligations should follow the signed agreement, if any.",
    ],
  },
  {
    title: "15. Governing law and disputes",
    paragraphs: [
      "The governing law, venue, and dispute process should be finalized in the applicable order form or signed agreement. If there is no signed agreement, disputes will be handled in the jurisdiction where the ClinicRelay operator is principally located, unless applicable law requires otherwise.",
    ],
  },
  {
    title: "16. Changes and contact",
    paragraphs: [
      "ClinicRelay may update these Terms as the website, product, pilots, or legal requirements evolve. Updated Terms will be posted on this page with a revised date. Continued use after an update means you accept the updated Terms.",
      "For questions about these Terms, use the demo or workflow-audit form on this website, or contact the ClinicRelay team at hello@clinicrelay.co.",
    ],
  },
] as const;

export default function TermsPage() {
  return (
    <main className="min-h-[100dvh] bg-[--cr-bg] pt-28 pb-20">
      <section className="max-w-[900px] mx-auto px-6">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[--cr-teal] mb-4">
          Legal
        </p>
        <h1 className="text-4xl md:text-5xl tracking-tight font-semibold text-[--cr-text] mb-5">
          Terms of Service
        </h1>
        <p className="text-sm text-[--cr-muted-soft] mb-8">Last updated: {lastUpdated}</p>

        <div className="rounded-2xl border border-[--cr-border] bg-white p-5 md:p-6 shadow-[var(--cr-shadow)] mb-10">
          <p className="text-base text-[--cr-muted] leading-relaxed">
            These are practical pre-launch terms for ClinicRelay’s website, demos, evaluations, and pilot workflows. They should be reviewed by counsel before broad commercial rollout or before relying on them for paid clinic contracts.
          </p>
        </div>

        <div className="space-y-10">
          {termsSections.map((section) => (
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
