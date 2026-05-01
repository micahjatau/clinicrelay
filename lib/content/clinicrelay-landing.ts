export type NavLink = { label: string; href: string };
export type HeroData = {
  eyebrow: string;
  h1: string;
  subheadline: string;
  primaryCta: string;
  secondaryCta: string;
  trustLine: string;
  badges: string[];
  bentoCards: Array<{ step: string; label: string; detail: string }>;
};
export type PainCard = { icon: string; title: string; copy: string };
export type Step = { number: string; icon: string; title: string; copy: string };
export type FeatureCard = { icon: string; title: string; copy: string; tag: string };
export type GrowthPillar = { title: string; copy: string; pills: string[] };
export type ServiceCard = {
  title: string;
  copy: string;
  deliverables: string[];
};
export type DashboardData = {
  navItems: string[];
  metrics: Array<{ label: string; value: string; sub?: string }>;
};
export type UseCase = {
  type: string;
  icon: string;
  title: string;
  copy: string;
  pills: string[];
};
export type TrustPillar = { title: string; copy: string };
export type MetricCard = { value: string; label: string };
export type PricingPackage = {
  name: string;
  tagline: string;
  features: string[];
  recommended?: boolean;
};
export type FaqItem = { question: string; answer: string };

export const navLinks: NavLink[] = [
  { label: "Product", href: "#product" },
  { label: "Waitlist Recovery", href: "#waitlist" },
  { label: "Growth Services", href: "#growth" },
  { label: "Pricing", href: "#pricing" },
  { label: "FAQ", href: "#faq" },
];

export const heroData: HeroData = {
  eyebrow: "Front-Desk Orchestration",
  h1: "Fill cancelled slots faster.",
  subheadline:
    "ClinicRelay connects your waitlist, your front desk, and your schedule — so cancelled time has a second chance to become productive time.",
  primaryCta: "Book a Demo",
  secondaryCta: "Request Workflow Audit",
  trustLine: "Built for clinics that need better appointment recovery and front-desk coordination",
  badges: ["Waitlist Recovery", "Patient Reminders", "Booking Coordination"],
  bentoCards: [
    { step: "1", label: "Cancelled Slot Detected", detail: "Dr. Patel — 2:30 PM Thursday" },
    { step: "2", label: "Eligible Patient Matched", detail: "3 candidates identified" },
    { step: "3", label: "Recovery SMS Sent", detail: "Personalized message sent" },
    { step: "4", label: "Patient Reply Captured", detail: '"Yes, I can make it!"' },
    { step: "5", label: "Staff Confirms Refill", detail: "Confirmed in 4 minutes" },
  ],
};

export const painCards: PainCard[] = [
  {
    icon: "CalendarX",
    title: "Cancelled appointments go unfilled",
    copy: "Your team calls down a list manually. By the time someone says yes, the day is gone.",
  },
  {
    icon: "Phone",
    title: "Front desk is stuck on the phone",
    copy: "Staff spend hours chasing confirmations instead of serving patients already in the building.",
  },
  {
    icon: "ClockClockwise",
    title: "No-shows cost you twice",
    copy: "You lose the revenue and you still pay the overhead. A waitlist without a process is just a list.",
  },
  {
    icon: "ChartLineDown",
    title: "Recall falls through the cracks",
    copy: "Patients due for hygiene or follow-up age out of your schedule invisibly.",
  },
];

export const recoverySteps: Step[] = [
  { number: "01", icon: "CalendarBlank", title: "Cancellation received", copy: "A confirmed appointment is cancelled — ClinicRelay detects it immediately." },
  { number: "02", icon: "ListChecks", title: "Waitlist scanned", copy: "Eligible patients are ranked by proximity, service match, and last contact." },
  { number: "03", icon: "ChatCircle", title: "SMS dispatched", copy: "A personalized message is prepared or sent based on your clinic workflow rules." },
  { number: "04", icon: "ArrowBendUpLeft", title: "Reply captured", copy: "Patient responses are parsed and routed to your front desk for a one-click confirm." },
  { number: "05", icon: "CheckCircle", title: "Slot refilled", copy: "The appointment is confirmed and the schedule is updated. The cycle closes." },
];

export const workflowSteps: Step[] = [
  { number: "01", icon: "Funnel", title: "Intake & routing", copy: "New patient requests are sorted by service type, urgency, and provider availability." },
  { number: "02", icon: "CalendarCheck", title: "Smart scheduling", copy: "Appointment windows are matched to provider schedules and operatory availability." },
  { number: "03", icon: "BellRinging", title: "Automated reminders", copy: "Confirmation sequences reduce no-shows without staff manually calling patients." },
  { number: "04", icon: "ArrowsClockwise", title: "Waitlist recovery", copy: "Cancellations trigger automatic waitlist outreach before the slot can go to waste." },
  { number: "05", icon: "ChartBar", title: "Performance visibility", copy: "Front-desk metrics surface in a single dashboard — fill rate, response time, recall rate." },
];

export const featureCards: FeatureCard[] = [
  { icon: "ChatCircleText", title: "Two-way SMS", copy: "Patients reply in plain text. ClinicRelay parses intent and routes accordingly.", tag: "Engagement" },
  { icon: "CalendarCheck", title: "Waitlist automation", copy: "Cancelled slots trigger outreach automatically — no manual list-calling.", tag: "Recovery" },
  { icon: "BellRinging", title: "Recall campaigns", copy: "Hygiene and follow-up recalls sent on schedule, not when someone remembers.", tag: "Retention" },
  { icon: "ClipboardText", title: "Intake coordination", copy: "New patient forms, insurance collection, and routing handled before they arrive.", tag: "Efficiency" },
  { icon: "Envelope", title: "Confirmation sequences", copy: "Multi-step reminder flows reduce no-shows and surface cancellations early.", tag: "Reliability" },
  { icon: "Gauge", title: "Front-desk dashboard", copy: "Slot utilization, recovery rate, and response times visible at a glance.", tag: "Visibility" },
  { icon: "Phone", title: "Missed call capture", copy: "Unanswered calls trigger an automatic SMS follow-up within minutes.", tag: "Recovery" },
  { icon: "UsersFour", title: "Multi-location support", copy: "Single admin view across all clinic locations, each with its own configuration.", tag: "Scale" },
  { icon: "Lock", title: "Data governance", copy: "Role-based access, audit trails, and no PHI stored beyond what your workflows require.", tag: "Compliance" },
  { icon: "PuzzlePiece", title: "Workflow builder", copy: "Configure outreach sequences, timing rules, and escalation paths without code.", tag: "Flexibility" },
  { icon: "ArrowsClockwise", title: "Schedule sync", copy: "Read-only schedule visibility keeps outreach in sync with real availability.", tag: "Accuracy" },
  { icon: "ChartBar", title: "Analytics exports", copy: "Weekly and monthly summaries delivered to your inbox — no dashboard login required.", tag: "Reporting" },
];

export const growthPillars: GrowthPillar[] = [
  {
    title: "Waitlist Recovery",
    copy: "Convert cancelled chair time into confirmed revenue without adding staff.",
    pills: ["Same-day cancellations", "Short-notice slots", "Provider gaps"],
  },
  {
    title: "Recall Reactivation",
    copy: "Bring lapsed patients back before they find another provider.",
    pills: ["Hygiene recall", "Follow-up sequences", "Inactive patient lists"],
  },
  {
    title: "New Patient Conversion",
    copy: "Respond to inquiries faster and reduce the friction from first contact to first visit.",
    pills: ["Missed call follow-up", "Online booking", "Intake coordination"],
  },
  {
    title: "Front-Desk Efficiency",
    copy: "Automate the repetitive communication tasks that consume staff time without adding value.",
    pills: ["Confirmation flows", "Insurance collection", "Form reminders"],
  },
];

export const serviceCards: ServiceCard[] = [
  {
    title: "Clinic Website",
    copy: "A fast, conversion-focused website built to turn visitors into booked patients.",
    deliverables: ["Custom design", "Booking integration", "Local SEO structure", "Mobile-first"],
  },
  {
    title: "Google Ads",
    copy: "Paid search campaigns targeting high-intent local patients.",
    deliverables: ["Campaign setup", "Ad copy", "Conversion tracking"],
  },
  {
    title: "Local SEO",
    copy: "Organic search visibility for the services your clinic actually provides.",
    deliverables: ["GMB optimization", "Citation building", "Content strategy"],
  },
  {
    title: "Reputation System",
    copy: "Automate review requests and monitor your clinic's online reputation.",
    deliverables: ["Review automation", "Response templates", "Reporting"],
  },
  {
    title: "Growth Audit",
    copy: "A complete front-desk and marketing review with a prioritized action plan.",
    deliverables: ["Workflow analysis", "Competitor review", "90-day roadmap"],
  },
];

export const dashboardMockData: DashboardData = {
  navItems: ["Overview", "Cancelled Slots", "Waitlist", "Recovery", "Front Desk", "Calendar", "Patients", "Communication", "Analytics", "Settings"],
  metrics: [
    { label: "Slot Utilization", value: "84%", sub: "+13% vs last week" },
    { label: "Slots Recovered Today", value: "3", sub: "of 4 cancellations" },
    { label: "Avg Response Time", value: "4m", sub: "patient reply" },
    { label: "Recall Due This Week", value: "47", sub: "12 reached" },
    { label: "Pending Confirmations", value: "8", sub: "tomorrow" },
    { label: "Missed Calls Today", value: "2", sub: "SMS sent" },
    { label: "Active Waitlist", value: "31", sub: "patients" },
  ],
};

export const useCases: UseCase[] = [
  {
    type: "Dental",
    icon: "Tooth",
    title: "Dental practices",
    copy: "Fill hygiene cancellations same-day. Automate recall for preventive appointments. Reduce no-shows for high-value procedures.",
    pills: ["Hygiene recall", "Same-day fill", "Procedure reminders"],
  },
  {
    type: "Family Medicine",
    icon: "FirstAid",
    title: "Family medicine clinics",
    copy: "Manage high appointment volume with automated confirmations and smart waitlist prioritization.",
    pills: ["Confirmation flows", "Waitlist matching", "Multi-provider scheduling"],
  },
  {
    type: "Optometry",
    icon: "Eye",
    title: "Eye care clinics",
    copy: "Annual exam recall, contact lens follow-ups, and frame adjustment reminders — all automated.",
    pills: ["Annual recall", "Product follow-up", "Appointment reminders"],
  },
  {
    type: "Dermatology",
    icon: "Bandaids",
    title: "Dermatology clinics",
    copy: "Long waitlists and high cancellation rates are common. ClinicRelay turns that into an advantage.",
    pills: ["Waitlist priority", "Cancellation recovery", "Follow-up sequences"],
  },
];

export const trustPillars: TrustPillar[] = [
  {
    title: "No autonomous patient decisions",
    copy: "ClinicRelay surfaces information and drafts outreach. Your team confirms before anything is booked or sent.",
  },
  {
    title: "Limited workflow data collection",
    copy: "ClinicRelay is designed to collect only the operational data needed for booking, reminders, and follow-up workflows.",
  },
  {
    title: "Clinic-controlled opt-out",
    copy: "Every outreach channel can be disabled per patient, per clinic, or globally — with one setting change.",
  },
  {
    title: "Audit trail for every action",
    copy: "Every message sent, every slot filled, every staff action is logged with timestamp and source.",
  },
  {
    title: "Canadian data residency available",
    copy: "Canadian data residency is available for eligible deployments based on your clinic requirements.",
  },
];

export const metricCards: MetricCard[] = [
  { value: "47%", label: "Average increase in same-day slot fill rate" },
  { value: "4 min", label: "Median patient response time to waitlist SMS" },
  { value: "3.2x", label: "More recall appointments booked vs manual outreach" },
  { value: "11 hrs", label: "Front-desk time recovered per week per location" },
  { value: "62%", label: "Reduction in outbound confirmation calls" },
  { value: "< 1 wk", label: "Typical time from audit to first automated workflow" },
];

export const pricingPackages: PricingPackage[] = [
  {
    name: "Waitlist Recovery Starter",
    tagline: "Cancellation recovery and basic recall for single-location clinics.",
    features: [
      "Waitlist SMS recovery",
      "Automated confirmation sequences",
      "Basic recall campaigns",
      "Front-desk dashboard",
      "Email support",
    ],
  },
  {
    name: "Front-Desk Recovery Pilot",
    tagline: "Full workflow coordination with growth services for growing clinics.",
    features: [
      "Everything in Starter",
      "Two-way SMS inbox",
      "Missed call capture",
      "Multi-provider scheduling visibility",
      "Monthly performance review",
      "Dedicated onboarding support",
    ],
    recommended: true,
  },
  {
    name: "Growth System",
    tagline: "Complete front-desk orchestration plus digital presence for multi-location groups.",
    features: [
      "Everything in Recovery Pilot",
      "Multi-location dashboard",
      "Website + local SEO",
      "Google Ads management",
      "Reputation automation",
      "Quarterly growth audits",
    ],
  },
];

export const processSteps: Step[] = [
  { number: "01", icon: "MagnifyingGlass", title: "Workflow Audit", copy: "We review your current cancellation rate, recall gaps, and front-desk time allocation before recommending anything." },
  { number: "02", icon: "Wrench", title: "Configure Relay Layer", copy: "We configure your outreach sequences, timing rules, and escalation paths based on your clinic's schedule and preferences." },
  { number: "03", icon: "Users", title: "Pilot With Real Staff", copy: "Your front desk runs the system live for 30 days. We monitor, adjust, and fix anything that needs tuning." },
  { number: "04", icon: "TrendUp", title: "Optimize for Growth", copy: "After the pilot, we review the numbers and expand to recall, new patient conversion, and growth services." },
];

export const faqItems: FaqItem[] = [
  {
    question: "Does ClinicRelay connect to our practice management software?",
    answer: "ClinicRelay uses a read-only schedule view rather than a deep integration. This keeps setup fast and avoids the compliance risk of writing directly to your PMS. Most clinics are live within a week.",
  },
  {
    question: "How does the waitlist SMS work?",
    answer: "When a cancellation is detected, ClinicRelay identifies eligible waitlist patients, generates a personalized SMS, and sends it for staff review before dispatch — or automatically, depending on your configuration. Patient replies are routed back to your inbox for a one-click confirm.",
  },
  {
    question: "Do patients need to download an app?",
    answer: "No. All patient communication happens over standard SMS. Nothing for patients to install or log into.",
  },
  {
    question: "Is ClinicRelay HIPAA or PIPEDA compliant?",
    answer: "ClinicRelay is designed for responsible data handling: data stored in Canadian infrastructure, limited PHI retention, and full audit trails. We do not make HIPAA or PIPEDA compliance claims — that determination depends on your clinic's specific configuration and regulatory context.",
  },
  {
    question: "Can we control which patients receive automated messages?",
    answer: "Yes. You can exclude individual patients, entire patient segments, or turn off any outreach channel at any time. Your team stays in control.",
  },
  {
    question: "How long does setup take?",
    answer: "Most clinics complete the audit and configuration phase within one week. The 30-day pilot begins immediately after.",
  },
  {
    question: "What if the waitlist SMS doesn't fill the slot?",
    answer: "If no waitlist patient responds in time, the slot is flagged in your dashboard for manual follow-up. ClinicRelay never silently abandons a recovery attempt.",
  },
  {
    question: "Can ClinicRelay work across multiple clinic locations?",
    answer: "Yes. The Growth System tier supports multi-location groups with a unified dashboard, per-location configuration, and consolidated reporting.",
  },
  {
    question: "What does the monthly performance review include?",
    answer: "A structured call covering slot fill rate, recall conversion, response times, and any workflow adjustments. You receive a written summary within 24 hours.",
  },
  {
    question: "How is ClinicRelay different from a generic CRM?",
    answer: "ClinicRelay is purpose-built for appointment-based clinics. It understands schedules, waitlists, recall cycles, and cancellation patterns. A generic CRM doesn't — and configuration to get there takes months.",
  },
];
