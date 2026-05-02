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
    "ClinicRelay helps your team recover cancelled slots with waitlist matching, staff-visible confirmation tasks, and policy-safe scheduling workflows.",
  primaryCta: "Book a Demo",
  secondaryCta: "Request Workflow Audit",
  trustLine: "Built for clinics that need better appointment recovery and front-desk coordination",
  badges: ["Cancelled-Slot Recovery", "Staff Confirmation Loop", "Policy-Safe Scheduling"],
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
  { icon: "CalendarCheck", title: "Cancelled-slot recovery", copy: "When time opens up, ClinicRelay starts a recovery workflow with waitlist matching and staff-visible next actions.", tag: "Core" },
  { icon: "ChatCircleText", title: "Waitlist reply loop", copy: "Patients can confirm by SMS, and replies are routed to staff so replacement bookings are coordinated in one place.", tag: "Core" },
  { icon: "ClipboardText", title: "Staff operations queue", copy: "Front-desk teams get a prioritized queue for confirmations, follow-up, and unresolved workflow tasks.", tag: "Core" },
  { icon: "ArrowsClockwise", title: "Policy-safe scheduling", copy: "Scheduling checks keep recovery actions aligned with provider, service, and clinic-specific rules.", tag: "Core" },
  { icon: "BellRinging", title: "Reminder lead-time", copy: "Reminder workflows surface risk early so clinics have time to run recovery before a slot is lost.", tag: "Support" },
  { icon: "Gauge", title: "Recovery visibility", copy: "Track open cancellations, offers sent, replies received, and staff-confirmed refills from one dashboard.", tag: "Core" },
  { icon: "Phone", title: "Request routing", copy: "Patient change requests and follow-up needs flow into staff-visible operational work instead of scattered channels.", tag: "Support" },
  { icon: "Lock", title: "Workflow guardrails", copy: "Role-aware workflows and audit visibility support safer operational coordination.", tag: "Support" },
  { icon: "ChartBar", title: "Pilot performance review", copy: "Use pilot metrics to measure recovery throughput and front-desk response performance over each cycle.", tag: "Pilot" },
];

export const growthPillars: GrowthPillar[] = [
  {
    title: "Cancelled-Slot Recovery",
    copy: "Focus first on the operational leak that hurts most: cancelled time that never gets refilled.",
    pills: ["Open slot detection", "Waitlist matching", "Staff confirmation"],
  },
  {
    title: "Visible Confirmation Loop",
    copy: "Every response and follow-up becomes trackable staff work instead of hidden phone-tag.",
    pills: ["Reply capture", "Action queues", "Outcome logging"],
  },
  {
    title: "Policy-Safe Coordination",
    copy: "Recovery actions stay aligned with clinic rules for service, provider, and schedule fit.",
    pills: ["Scheduling guardrails", "Provider fit", "Rule checks"],
  },
  {
    title: "Pilot-First Rollout",
    copy: "Start with a focused pilot, measure impact, and expand only after the workflow proves itself.",
    pills: ["30-day pilot", "Weekly review", "Scale after proof"],
  },
];

export const serviceCards: ServiceCard[] = [
  {
    title: "Workflow Audit",
    copy: "Map where cancellations, follow-up gaps, and front-desk handoff delays are leaking capacity.",
    deliverables: ["Workflow map", "Leak points", "Pilot scope", "Success metrics"],
  },
  {
    title: "Recovery Pilot Setup",
    copy: "Configure waitlist recovery, confirmation routing, and staff-visible actions for a focused pilot.",
    deliverables: ["Recovery logic", "SMS templates", "Staff queue setup"],
  },
  {
    title: "Policy-Safe Scheduling Controls",
    copy: "Align the pilot with clinic scheduling rules so recovery actions stay operationally safe.",
    deliverables: ["Rule alignment", "Provider/service checks", "Escalation defaults"],
  },
  {
    title: "Operations Queue Enablement",
    copy: "Deploy a single staff work surface for replies, confirmations, and unresolved tasks.",
    deliverables: ["Queue views", "Status states", "Action ownership"],
  },
  {
    title: "Pilot Review & Scale Plan",
    copy: "Review pilot outcomes and decide what to expand next based on measured workflow performance.",
    deliverables: ["Pilot review", "Expansion plan", "Change priorities"],
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
    title: "Staff-confirmed operations",
    copy: "ClinicRelay routes workflow actions to your team. Staff stay in control of patient-facing confirmations.",
  },
  {
    title: "Limited operational data",
    copy: "The system is designed to collect only the workflow data needed for scheduling coordination and follow-up.",
  },
  {
    title: "Policy-aware controls",
    copy: "Workflow rules can be configured around provider, service, and clinic-level operational boundaries.",
  },
  {
    title: "Audit visibility",
    copy: "Operational actions can be reviewed with clear status history and ownership.",
  },
  {
    title: "Pilot-first governance",
    copy: "Each rollout starts with a constrained pilot so clinics can validate processes before broader adoption.",
  },
];

export const metricCards: MetricCard[] = [
  { value: "Track", label: "Cancelled slots detected and recovery attempts started" },
  { value: "Measure", label: "Waitlist offers sent and patient replies captured" },
  { value: "Monitor", label: "Pending confirmations and staff-owned next actions" },
  { value: "Review", label: "Policy-safe scheduling decisions across open slots" },
  { value: "Compare", label: "Manual follow-up load before and after pilot rollout" },
  { value: "Improve", label: "Recovery throughput across each pilot cycle" },
];

export const pricingPackages: PricingPackage[] = [
  {
    name: "Recovery Audit",
    tagline: "Find and prioritize where cancelled-slot and coordination leakage is happening now.",
    features: [
      "Workflow discovery session",
      "Leak-point map",
      "Pilot success criteria",
      "Clinic-specific rollout scope",
      "Action plan delivery",
    ],
  },
  {
    name: "Front-Desk Recovery Pilot",
    tagline: "Focused pilot for waitlist recovery, confirmation loop visibility, and policy-safe scheduling.",
    features: [
      "Waitlist matching workflows",
      "SMS reply routing",
      "Staff operations queue",
      "Scheduling guardrails",
      "Weekly pilot review",
      "Dedicated onboarding support",
    ],
    recommended: true,
  },
  {
    name: "Pilot Expansion",
    tagline: "Scale proven workflows after pilot evidence is clear.",
    features: [
      "Everything in Recovery Pilot",
      "Multi-location rollout planning",
      "Queue/process tuning",
      "Governance checkpoints",
      "Quarterly workflow reviews",
      "Expansion roadmap",
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
    answer: "ClinicRelay is designed with privacy-aware workflow boundaries, limited operational data collection, and auditability in mind. Formal compliance depends on your clinic configuration, jurisdiction, vendor stack, and legal requirements.",
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
