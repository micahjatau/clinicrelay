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
export type FeatureStatus = "available" | "pilot" | "roadmap";
export type FeaturePillar = "Access" | "Readiness" | "Recovery";
export type FeatureCard = { icon: string; title: string; copy: string; tag: string; status: FeatureStatus; pillar: FeaturePillar };
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
export type ReadinessFeature = { icon: string; title: string; copy: string };
export type CommandCenterStatus = "action" | "pending" | "done";
export type CommandCenterItem = { label: string; count: string; status: CommandCenterStatus };

export const navLinks: NavLink[] = [
  { label: "Product", href: "#product" },
  { label: "Waitlist Recovery", href: "#waitlist" },
  { label: "Growth Services", href: "#growth" },
  { label: "Pricing", href: "#pricing" },
  { label: "FAQ", href: "#faq" },
];

export const heroData: HeroData = {
  eyebrow: "Front-Desk Operations",
  h1: "Your front desk can't recover cancelled slots while they're checking in the next patient.",
  subheadline:
    "ClinicRelay gives your team a system for same-day slot recovery, pre-visit prep, and daily coordination — so empty slots get filled and your staff isn't on hold with a waitlist patient while someone's standing at the desk.",
  primaryCta: "Book a Workflow Audit",
  secondaryCta: "See How Recovery Works",
  trustLine: "Built for practices where the front desk is already stretched thin",
  badges: ["Same-Day Slot Recovery", "Pre-Visit Readiness", "Front-Desk Work Queue"],
  bentoCards: [
    { step: "1", label: "Cancelled Slot Detected", detail: "Dr. Patel — 2:30 PM Thursday" },
    { step: "2", label: "Eligible Patient Matched", detail: "3 candidates identified" },
    { step: "3", label: "Recovery Offer Routed", detail: "Recovery message prepared and routed" },
    { step: "4", label: "Patient Reply Captured", detail: '"Yes, I can make it!"' },
    { step: "5", label: "Staff Confirms Refill", detail: "Confirmed in 4 minutes" },
  ],
};

export const painCards: PainCard[] = [
  {
    icon: "CalendarX",
    title: "Cancelled slots sit empty while your team works the phones",
    copy: "By the time someone calls through the waitlist and a patient says yes, that window is gone. It's not a staffing problem — it's a process one.",
  },
  {
    icon: "Phone",
    title: "Your front desk is the scheduler, the follow-up team, and the insurance chaser — all at once",
    copy: "Confirmations, change requests, coverage calls, recalls — all landing at the same desk, at the same time, with the same two people.",
  },
  {
    icon: "ClockClockwise",
    title: "No-shows cost you the visit and the next slot behind it",
    copy: "You lose the revenue. You still pay overhead. And the next patient on your waitlist never heard from anyone.",
  },
  {
    icon: "ChartLineDown",
    title: "Recall patients drift out of your schedule without anyone noticing",
    copy: "They're due for a follow-up or a preventive visit, but the list doesn't surface them until it's been six months too long.",
  },
  {
    icon: "ShieldWarning",
    title: "Insurance surprises hit at check-in — not before",
    copy: "Your staff finds out something's wrong with a patient's coverage while they're standing at the desk. At that point, everyone's day gets harder.",
  },
  {
    icon: "ArrowsSplit",
    title: "Appointment changes scatter across every channel",
    copy: "Phone calls. Texts. Emails. Voicemails. Nothing connects. Patients repeat themselves. Staff keep notes only they can find.",
  },
];

export const recoverySteps: Step[] = [
  { number: "01", icon: "CalendarBlank", title: "Cancellation received", copy: "A confirmed appointment is cancelled — ClinicRelay detects it immediately." },
  { number: "02", icon: "ListChecks", title: "Waitlist scanned", copy: "Eligible patients are ranked by proximity, service match, and last contact." },
  { number: "03", icon: "ChatCircle", title: "Recovery offer routed", copy: "A personalized message is prepared or sent based on your clinic workflow rules." },
  { number: "04", icon: "ArrowBendUpLeft", title: "Reply captured", copy: "Patient responses are parsed and routed to your front desk for a one-click confirm." },
  { number: "05", icon: "CheckCircle", title: "Slot refilled", copy: "The appointment is confirmed and the schedule is updated. The cycle closes." },
];

export const workflowSteps: Step[] = [
  { number: "01", icon: "Funnel", title: "Intake & routing", copy: "New patient requests are sorted by service type, urgency, and provider availability." },
  { number: "02", icon: "CalendarCheck", title: "Smart scheduling", copy: "Appointment windows are matched to provider schedules and operatory availability." },
  { number: "03", icon: "BellRinging", title: "Reminder workflows", copy: "Confirmation workflows reduce manual calling and surface appointment risk earlier." },
  { number: "04", icon: "ArrowsClockwise", title: "Waitlist recovery", copy: "When a slot opens, ClinicRelay prepares recovery outreach based on your clinic's workflow rules." },
  { number: "05", icon: "ChartBar", title: "Performance visibility", copy: "Front-desk metrics surface in a single dashboard — fill rate, response time, recall rate." },
];

export const featureCards: FeatureCard[] = [
  // Access pillar
  {
    icon: "CalendarCheck",
    title: "Guided booking",
    copy: "Booking requests are matched to provider availability and service rules so new patients reach the right slot without back-and-forth.",
    tag: "Access",
    status: "available",
    pillar: "Access",
  },
  {
    icon: "UserCircle",
    title: "Patient portal",
    copy: "Patients submit intake details, check appointment status, and send requests before the visit — without calling the front desk.",
    tag: "Access",
    status: "pilot",
    pillar: "Access",
  },
  {
    icon: "ArrowsClockwise",
    title: "Change requests",
    copy: "Appointment change requests become visible staff-owned tasks instead of scattered inbound calls that fall through.",
    tag: "Access",
    status: "available",
    pillar: "Access",
  },
  // Readiness pillar
  {
    icon: "ShieldCheck",
    title: "Insurance workflow",
    copy: "Patients submit insurance details early. Staff see what needs verification before the visit, not when the patient walks in.",
    tag: "Readiness",
    status: "pilot",
    pillar: "Readiness",
  },
  {
    icon: "ClipboardText",
    title: "Intake & estimates",
    copy: "Pre-visit intake tasks and treatment estimate requests surface as actionable staff queue items with clear ownership.",
    tag: "Readiness",
    status: "pilot",
    pillar: "Readiness",
  },
  {
    icon: "BellRinging",
    title: "Reminder lead-time",
    copy: "Reminder workflows surface risk early so clinics have time to run recovery before a slot is lost.",
    tag: "Readiness",
    status: "available",
    pillar: "Readiness",
  },
  // Recovery pillar
  {
    icon: "CalendarCheck",
    title: "Cancelled-slot recovery",
    copy: "When time opens up, ClinicRelay starts a recovery workflow with waitlist matching and staff-visible next actions.",
    tag: "Recovery",
    status: "available",
    pillar: "Recovery",
  },
  {
    icon: "ChatCircleText",
    title: "Waitlist reply loop",
    copy: "Patients can confirm by SMS, and replies are routed to staff so replacement bookings are coordinated in one place.",
    tag: "Recovery",
    status: "available",
    pillar: "Recovery",
  },
  {
    icon: "Gauge",
    title: "Recovery visibility",
    copy: "Track open cancellations, offers sent, replies received, and staff-confirmed refills from one dashboard.",
    tag: "Recovery",
    status: "available",
    pillar: "Recovery",
  },
  {
    icon: "ArrowsClockwise",
    title: "Policy-safe scheduling",
    copy: "Scheduling checks keep recovery actions aligned with provider, service, and clinic-specific rules.",
    tag: "Recovery",
    status: "available",
    pillar: "Recovery",
  },
  {
    icon: "ClipboardText",
    title: "Staff operations queue",
    copy: "Front-desk teams get a prioritized queue for confirmations, follow-up, and unresolved workflow tasks.",
    tag: "Recovery",
    status: "available",
    pillar: "Recovery",
  },
  {
    icon: "Lock",
    title: "Workflow guardrails",
    copy: "Role-aware workflows and audit visibility support safer operational coordination.",
    tag: "Recovery",
    status: "pilot",
    pillar: "Recovery",
  },
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
    pills: ["Controlled workflow pilot", "Weekly review", "Scale after proof"],
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
    { label: "Missed Calls Today", value: "2", sub: "Outreach routed" },
    { label: "Active Waitlist", value: "31", sub: "patients" },
  ],
};

export const useCases: UseCase[] = [
  {
    type: "Dental",
    icon: "Tooth",
    title: "Dental practices",
    copy: "Fill hygiene cancellations same-day. Surface recall opportunities for preventive appointments. Reduce no-shows for high-value procedures.",
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
    copy: "Annual exam recall, contact lens follow-ups, and frame adjustment reminders — surfaced for staff action.",
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
    copy: "ClinicRelay does not replace your front desk. It gives staff a clearer queue for the work they already manage — recovery outreach, confirmations, and follow-up — without adding new systems to learn.",
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
    name: "Workflow Audit",
    tagline: "Identify the fastest path to recovered visits with a focused review of your biggest scheduling leaks.",
    features: [
      "90-minute workflow review",
      "Cancellation leak map",
      "ROI and impact estimate",
      "Priority rollout plan",
      "Implementation checklist",
    ],
  },
  {
    name: "Recovery Pilot",
    tagline: "Launch a focused waitlist-recovery pilot with visible staff workflows and weekly optimization.",
    features: [
      "Waitlist matching workflows",
      "SMS reply routing",
      "Staff operations queue",
      "Scheduling guardrails",
      "Weekly optimization review",
      "Dedicated onboarding support",
    ],
    recommended: true,
  },
  {
    name: "Scale-Up",
    tagline: "Expand the pilot into a multi-location recovery system once the numbers prove the value.",
    features: [
      "Everything in Recovery Pilot",
      "Multi-location rollout planning",
      "Queue and process tuning",
      "Governance checkpoints",
      "Quarterly performance reviews",
      "Expansion roadmap",
    ],
  },
];

export const processSteps: Step[] = [
  { number: "01", icon: "MagnifyingGlass", title: "Workflow Audit", copy: "We review your current cancellation rate, recall gaps, and front-desk time allocation before recommending anything." },
  { number: "02", icon: "Wrench", title: "Configure Relay Layer", copy: "We configure your outreach sequences, timing rules, and escalation paths based on your clinic's schedule and preferences." },
  { number: "03", icon: "Users", title: "Pilot With Real Staff", copy: "Your front desk runs the system live for 30 days. We monitor, adjust, and fix anything that needs tuning." },
  { number: "04", icon: "TrendUp", title: "Optimize for Growth", copy: "After the pilot, we review the numbers and expand to recall, confirmation workflows, and front-desk coordination." },
];

export const faqItems: FaqItem[] = [
  {
    question: "Does ClinicRelay connect to our practice management software?",
    answer: "ClinicRelay can start as a lightweight coordination layer alongside your existing workflow before deeper integrations are considered. This keeps setup fast and keeps risk low. Most clinics are configured within a week.",
  },
  {
    question: "How does the waitlist SMS work?",
    answer: "When a cancellation is detected, ClinicRelay identifies eligible waitlist patients, generates a personalized recovery offer, and routes it for staff review before dispatch — or sends it automatically, depending on your configuration. Patient replies are routed back to your inbox for a one-click confirm.",
  },
  {
    question: "Do patients need to download an app?",
    answer: "No app download is required. SMS handles lightweight replies for waitlist recovery and confirmations. When enabled, the patient portal supports intake, insurance review, and appointment details — all accessible by link, no login required.",
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
    answer: "Yes. The Pilot Expansion tier supports multi-location groups with a unified dashboard, per-location configuration, and consolidated reporting.",
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

export const readinessFeatures: ReadinessFeature[] = [
  {
    icon: "ShieldCheck",
    title: "Insurance submitted before visit day",
    copy: "Patients upload card details and staff see what needs review before check-in, not during it.",
  },
  {
    icon: "CheckSquare",
    title: "Intake status visible to staff",
    copy: "Pre-visit intake tasks show up in the staff queue so nothing falls through on a busy morning.",
  },
  {
    icon: "Receipt",
    title: "Estimate requests routed for response",
    copy: "Treatment cost questions become visible staff tasks instead of calls that interrupt the front desk.",
  },
  {
    icon: "Warning",
    title: "Readiness blockers surfaced early",
    copy: "Upcoming appointments with unresolved insurance or intake gaps are flagged before appointment day.",
  },
];

export const commandCenterItems: CommandCenterItem[] = [
  { label: "Insurance follow-up needed", count: "2", status: "action" },
  { label: "Appointment change requests", count: "4", status: "action" },
  { label: "Recall tasks due this week", count: "11", status: "action" },
  { label: "Waitlist recovery offers sent", count: "3", status: "pending" },
  { label: "Confirmations pending reply", count: "6", status: "pending" },
  { label: "Resolved today", count: "8", status: "done" },
];
