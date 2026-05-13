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
  { number: "01", icon: "Funnel", title: "Intake & routing", copy: "New patient requests land in one queue — sorted by service type, urgency, and who's available — not by whoever happens to pick up first." },
  { number: "02", icon: "CalendarCheck", title: "Smart scheduling", copy: "Appointment windows match to provider schedules and chair availability so nothing gets double-booked and no one has to call back to fix it." },
  { number: "03", icon: "BellRinging", title: "Reminder workflows", copy: "Confirmation tasks run on a schedule. Your front desk sees what still needs follow-up — not what got buried in a voicemail inbox." },
  { number: "04", icon: "ArrowsClockwise", title: "Waitlist recovery", copy: "A slot opens. ClinicRelay matches it to the right patient and surfaces the next action for staff to confirm. No manual list-diving required." },
  { number: "05", icon: "ChartBar", title: "Performance visibility", copy: "Fill rate, response time, and recall rate — in one place, so you know what's working and where things are quietly falling through." },
];

export const featureCards: FeatureCard[] = [
  // Access pillar
  {
    icon: "CalendarCheck",
    title: "Booking that skips the phone tag",
    copy: "New patients get matched to the right provider and time slot without your staff playing scheduler-by-phone.",
    tag: "Access",
    status: "available",
    pillar: "Access",
  },
  {
    icon: "UserCircle",
    title: "Patients prep before they arrive",
    copy: "Intake details, appointment status, and requests handled before visit day — so your front desk isn't doing triage at check-in.",
    tag: "Access",
    status: "pilot",
    pillar: "Access",
  },
  {
    icon: "ArrowsClockwise",
    title: "Change requests in a queue, not a voicemail box",
    copy: "When a patient needs to reschedule, it becomes a visible staff task — not a message that gets lost between desk shifts.",
    tag: "Access",
    status: "available",
    pillar: "Access",
  },
  // Readiness pillar
  {
    icon: "ShieldCheck",
    title: "Insurance problems caught before visit day",
    copy: "Patients submit coverage details early. Your staff sees what needs review before the patient arrives — not while they're standing at the desk.",
    tag: "Readiness",
    status: "pilot",
    pillar: "Readiness",
  },
  {
    icon: "ClipboardText",
    title: "Intake tasks surface before the morning rush",
    copy: "Pre-visit tasks and cost questions become trackable queue items with a clear owner — not floating in someone's inbox.",
    tag: "Readiness",
    status: "pilot",
    pillar: "Readiness",
  },
  {
    icon: "BellRinging",
    title: "Enough lead time to actually recover",
    copy: "Reminders go out early enough that if someone's going to cancel, you know before you've lost the chance to fill the slot.",
    tag: "Readiness",
    status: "available",
    pillar: "Readiness",
  },
  // Recovery pillar
  {
    icon: "CalendarCheck",
    title: "Recovery starts the moment a slot opens",
    copy: "The instant a cancellation is detected, ClinicRelay starts the recovery workflow — waitlist matching, next staff action, confirmation loop.",
    tag: "Recovery",
    status: "available",
    pillar: "Recovery",
  },
  {
    icon: "ChatCircleText",
    title: "Patient texts yes. Staff confirms. Done.",
    copy: "Patients reply to recovery offers by SMS. Those replies land in the staff queue so replacements get booked — no back-and-forth phone calls.",
    tag: "Recovery",
    status: "available",
    pillar: "Recovery",
  },
  {
    icon: "Gauge",
    title: "See every slot, every offer, every reply",
    copy: "Track where each cancellation is in the recovery cycle — from detection to confirmed refill — without chasing your team for status updates.",
    tag: "Recovery",
    status: "available",
    pillar: "Recovery",
  },
  {
    icon: "ArrowsClockwise",
    title: "Recovery that stays inside your clinic's rules",
    copy: "Every scheduling decision checks provider availability, service rules, and clinic policies. Your guardrails — not ours.",
    tag: "Recovery",
    status: "available",
    pillar: "Recovery",
  },
  {
    icon: "ClipboardText",
    title: "One place for everything your front desk needs to act on",
    copy: "Confirmations, follow-up tasks, unresolved changes — all in a prioritized queue so nothing gets buried and everyone knows what's next.",
    tag: "Recovery",
    status: "available",
    pillar: "Recovery",
  },
  {
    icon: "Lock",
    title: "Appropriate access. Clear audit trail.",
    copy: "Role-based workflow access and full action history so you can see what's happening across your team without hovering.",
    tag: "Recovery",
    status: "pilot",
    pillar: "Recovery",
  },
];

export const growthPillars: GrowthPillar[] = [
  {
    title: "Fix the biggest revenue leak first",
    copy: "Cancelled time that never gets refilled is usually the highest-impact place to start. That's where we begin.",
    pills: ["Open slot detection", "Waitlist matching", "Staff confirmation"],
  },
  {
    title: "Make follow-up visible, not accidental",
    copy: "Every response and next step becomes trackable staff work instead of phone-tag that depends on who's in that day.",
    pills: ["Reply capture", "Action queues", "Outcome logging"],
  },
  {
    title: "Recovery that stays inside your clinic's rules",
    copy: "Every outreach action stays within your service, provider, and scheduling limits — no surprises for your team.",
    pills: ["Scheduling guardrails", "Provider fit", "Rule checks"],
  },
  {
    title: "A pilot before a commitment",
    copy: "Start with a focused workflow pilot, measure what actually happened, and expand only after the numbers back it up.",
    pills: ["Controlled workflow pilot", "Weekly review", "Scale after proof"],
  },
];

export const serviceCards: ServiceCard[] = [
  {
    title: "Workflow Audit",
    copy: "We map where cancelled slots, follow-up gaps, and handoff delays are leaking time and revenue from your practice.",
    deliverables: ["Workflow map", "Leak points", "Pilot scope", "Success metrics"],
  },
  {
    title: "Recovery Pilot Setup",
    copy: "We configure waitlist recovery, confirmation routing, and your front-desk task queue for a focused 30-day pilot.",
    deliverables: ["Recovery logic", "SMS templates", "Staff queue setup"],
  },
  {
    title: "Policy-Safe Scheduling Controls",
    copy: "We align the pilot with your scheduling rules so every recovery action stays operationally safe for your team.",
    deliverables: ["Rule alignment", "Provider/service checks", "Escalation defaults"],
  },
  {
    title: "Operations Queue Enablement",
    copy: "We deploy a single staff work surface for replies, confirmations, and unresolved tasks — so the front desk has one place to look.",
    deliverables: ["Queue views", "Status states", "Action ownership"],
  },
  {
    title: "Pilot Review & Scale Plan",
    copy: "We review what happened during the pilot and help you decide what to expand — based on what actually moved the needle.",
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
    title: "Your front desk still runs the show",
    copy: "ClinicRelay doesn't replace your team or make decisions for them. It gives staff a cleaner queue for the work they're already doing — recovery outreach, confirmations, follow-up — without adding a new system to learn.",
  },
  {
    title: "Only the data the workflow actually needs",
    copy: "The system collects scheduling and coordination data — nothing more. We're not building a patient profile. We're helping keep your calendar full.",
  },
  {
    title: "Your clinic rules, applied consistently",
    copy: "Every recovery action stays within the service, provider, and scheduling boundaries you've set. Your staff doesn't have to second-guess what's allowed.",
  },
  {
    title: "A clear record of what happened and who did it",
    copy: "Every action has a status, an owner, and a history. When something needs review, you can see exactly what happened — and who confirmed it.",
  },
  {
    title: "Proven before it's permanent",
    copy: "Every rollout starts with a focused pilot. You see what it does in your clinic before we talk about expanding anything.",
  },
];

export const metricCards: MetricCard[] = [
  { value: "Track", label: "Every cancelled slot and where it sits in the recovery cycle" },
  { value: "Measure", label: "Waitlist offers sent, replies received, and slots confirmed" },
  { value: "Monitor", label: "Pending staff actions and what's been resolved today" },
  { value: "Review", label: "Recovery decisions and whether they followed clinic rules" },
  { value: "Compare", label: "Manual follow-up load before and after the pilot" },
  { value: "Improve", label: "Fill rate and recovery speed across each pilot cycle" },
];

export const pricingPackages: PricingPackage[] = [
  {
    name: "Workflow Audit",
    tagline: "Find out exactly where your clinic is losing revenue — and what to fix first.",
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
    tagline: "Get a real waitlist-recovery system running in your clinic, with a team that makes sure it works.",
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
    tagline: "Once the pilot proves the numbers, expand to multiple locations with the infrastructure already in place.",
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
  { number: "01", icon: "MagnifyingGlass", title: "Workflow Audit", copy: "We review your cancellation rate, recall gaps, and how your team spends its time before recommending a single thing." },
  { number: "02", icon: "Wrench", title: "Configure Recovery Layer", copy: "We set up your outreach sequences, timing rules, and escalation paths around your clinic's actual schedule and preferences." },
  { number: "03", icon: "Users", title: "Pilot With Your Real Team", copy: "Your front desk runs the system live for 30 days. We monitor, adjust, and fix anything that needs tuning." },
  { number: "04", icon: "TrendUp", title: "Review and Expand", copy: "After the pilot, we look at the numbers together and decide what to scale — recall, confirmation workflows, multi-location coordination." },
];

export const faqItems: FaqItem[] = [
  {
    question: "Does ClinicRelay connect to our practice management software?",
    answer: "ClinicRelay can start as a lightweight layer alongside your existing workflow — no deep integration required upfront. Most clinics are up and running within a week. We talk about deeper connections after the pilot proves its worth.",
  },
  {
    question: "How does the waitlist SMS work?",
    answer: "When a cancellation is detected, ClinicRelay identifies eligible waitlist patients, prepares a recovery offer, and either routes it for your team to review first or sends it automatically — depending on how you've set it up. Patient replies come back to your staff queue for a one-click confirm. No chasing required.",
  },
  {
    question: "Do patients need to download an app?",
    answer: "No app. SMS handles recovery offers and quick confirmations. When the patient portal is enabled, patients access intake forms and appointment details through a link — no login, no download.",
  },
  {
    question: "Is ClinicRelay HIPAA or PIPEDA compliant?",
    answer: "ClinicRelay is built with privacy-aware workflow limits, minimal data collection, and full audit visibility. Formal compliance depends on your clinic's configuration, jurisdiction, and vendor requirements — we walk through that during your audit.",
  },
  {
    question: "Can we control which patients receive automated messages?",
    answer: "Yes — by patient, by segment, or by outreach channel. Your team stays in control of who hears from ClinicRelay and how.",
  },
  {
    question: "How long does setup take?",
    answer: "Most clinics finish the audit and configuration phase within a week. The 30-day pilot kicks off right after.",
  },
  {
    question: "What if the waitlist SMS doesn't fill the slot?",
    answer: "If no one responds in time, the slot gets flagged in your dashboard for manual follow-up. ClinicRelay never quietly gives up on a recovery attempt.",
  },
  {
    question: "Can ClinicRelay work across multiple clinic locations?",
    answer: "Yes. The Scale-Up tier supports multi-location groups with a unified dashboard, per-location configuration, and consolidated reporting.",
  },
  {
    question: "What does the monthly performance review include?",
    answer: "A structured call covering slot fill rate, recall conversion, response times, and workflow tweaks. You get a written summary within 24 hours.",
  },
  {
    question: "How is ClinicRelay different from a generic CRM?",
    answer: "ClinicRelay is built for appointment-based clinics — it understands schedules, waitlists, recall cycles, and cancellation patterns. A generic CRM doesn't. Getting one to do what ClinicRelay does out of the box takes months of configuration.",
  },
];

export const readinessFeatures: ReadinessFeature[] = [
  {
    icon: "ShieldCheck",
    title: "Insurance sorted before the patient walks in",
    copy: "Patients upload coverage details early. Your staff sees what needs review before check-in — not during it.",
  },
  {
    icon: "CheckSquare",
    title: "Intake tasks visible to staff before the day gets busy",
    copy: "Pre-visit intake items show up in the staff queue so nothing falls through the cracks on a packed morning.",
  },
  {
    icon: "Receipt",
    title: "Cost questions become tasks, not interruptions",
    copy: "Treatment estimate requests land in a visible staff queue — not as phone calls that pull someone away from the desk.",
  },
  {
    icon: "Warning",
    title: "Problems flagged before appointment day",
    copy: "Upcoming visits with unresolved insurance or incomplete intake are surfaced early enough to actually do something about it.",
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
