I checked the clinicrelay repo and the design system needs a code-aligned v1.1, not a purely conceptual visual board.

The repo currently uses:

Next.js 16.2.4

React 19.2.4

Tailwind CSS v4

Geist font

Framer Motion

Phosphor Icons

CSS variable design tokens in app/globals.css

Content-driven landing architecture via lib/content/clinicrelay-landing.ts

Section structure in app/page.tsx: Hero, Problem, Waitlist, Workflow, Features, Growth, Web Services, Dashboard Mockup, Use Cases, Trust, Metrics, Pricing, Process, FAQ, CTA, Footer


So here is the edited design system.


---

ClinicRelay Landing UI Design System v1.1

Code-Aligned Edition

1. Product Direction

ClinicRelay should feel like a calm healthcare operations platform.

Not:

AI toy

chatbot wrapper

futuristic robot product

generic CRM

loud startup template


Yes:

operationally reliable

clinic-safe

staff-friendly

revenue-aware

trustworthy

quietly modern


Primary positioning:

> Fill cancelled slots faster.



Supporting promise:

> ClinicRelay connects your waitlist, your front desk, and your schedule — so cancelled time has a second chance to become productive time.



The repo already leads with this correctly in the hero content. Keep that hierarchy.


---

2. Tech Stack Design Constraints

The design system must match the actual repo stack:

Next.js 16
React 19
Tailwind CSS v4
Geist
Framer Motion
Phosphor Icons
CSS variable tokens

Do not design as if this is Tailwind v3 with tailwind.config.ts as the source of truth.

The repo is currently token-driven through app/globals.css, which defines:

:root {
  --cr-bg:         #f8fafa;
  --cr-surface:    #ffffff;
  --cr-surface-2:  #f0fdfa;
  --cr-teal:       #0d9488;
  --cr-teal-dark:  #0f766e;
  --cr-teal-light: #ccfbf1;
  --cr-text:       #0f1a18;
  --cr-muted:      #4b7a72;
  --cr-border:     #d1e8e4;
  --cr-shadow:     0 20px 40px -15px rgba(13, 148, 136, 0.08);
}

These should become the foundation.


---

3. Updated Color System

Core Tokens

Token	Current Value	Use

--cr-bg	#f8fafa	Page background
--cr-surface	#ffffff	Cards, panels, nav
--cr-surface-2	#f0fdfa	Soft teal sections, badge backgrounds
--cr-teal	#0d9488	Primary actions, active states
--cr-teal-dark	#0f766e	Hover states
--cr-teal-light	#ccfbf1	Focus rings, badges, light fills
--cr-text	#0f1a18	Primary text
--cr-muted	#4b7a72	Secondary copy
--cr-border	#d1e8e4	Card borders, input borders
--cr-shadow	0 20px 40px -15px rgba(13,148,136,.08)	Soft card shadow


Add These Missing Semantic Tokens

The dashboard mockup and landing page need status colors. Add these to globals.css:

:root {
  --cr-success: #16a34a;
  --cr-success-light: #dcfce7;

  --cr-warning: #d97706;
  --cr-warning-light: #fef3c7;

  --cr-danger: #dc2626;
  --cr-danger-light: #fee2e2;

  --cr-info: #2563eb;
  --cr-info-light: #dbeafe;

  --cr-slate: #334155;
  --cr-slate-light: #f1f5f9;
}

Use them for:

cancelled slot = danger

pending confirmation = warning

slot refilled = success

workflow/info states = teal or info

inactive/neutral status = slate



---

4. Typography System

The repo uses Geist via:

--font-geist-sans: var(--font-geist-sans);

Current hero uses:

text-4xl md:text-6xl tracking-tighter font-semibold leading-none

Keep Geist. It fits the product: modern, neutral, not too playful.

Type Scale

Role	Tailwind Recipe

Hero headline	text-4xl md:text-6xl tracking-tighter font-semibold leading-none
Section headline	text-3xl md:text-5xl tracking-tight font-semibold leading-tight
Card title	text-base md:text-lg font-semibold text-[--cr-text]
Body large	text-base leading-relaxed text-[--cr-muted]
Body small	text-sm leading-relaxed text-[--cr-muted]
Eyebrow	text-xs font-semibold uppercase tracking-[0.12em] text-[--cr-teal]
Badge	text-xs font-semibold px-3 py-1.5 rounded-full
Metric value	text-3xl md:text-4xl font-semibold tracking-tight text-[--cr-text]


Strong Opinion

Do not use dramatic display fonts. This product sells operational trust. The typeface should “wear a clean shirt,” not enter the room wearing sunglasses indoors.


---

5. Button System

The repo already defines:

.cr-btn
.cr-btn-primary
.cr-btn-secondary

Keep them, but slightly expand.

Base Button

.cr-btn {
  border-radius: 0.75rem;
  font-weight: 600;
  transition: all 150ms;
}

Primary Button

Use for:

Book a Demo

Start Workflow Audit

Final CTA


.cr-btn-primary {
  background: var(--cr-teal);
  color: #fff;
  box-shadow: 0 12px 26px rgba(13, 148, 136, 0.22);
}

Secondary Button

Use for:

Request Workflow Audit

View Product

Learn More


.cr-btn-secondary {
  border: 1px solid var(--cr-border);
  background: #fff;
  color: var(--cr-text);
}

Ghost Button

Add:

.cr-btn-ghost {
  background: transparent;
  color: var(--cr-muted);
}

.cr-btn-ghost:hover {
  color: var(--cr-text);
  background: rgba(13, 148, 136, 0.06);
}


---

6. Card System

ClinicRelay needs cards that feel like Linear/Stripe but warmer for healthcare.

Standard Card

className="
  rounded-2xl 
  border border-[--cr-border] 
  bg-[--cr-surface] 
  shadow-[var(--cr-shadow)] 
  p-6
"

Elevated Card

Use for hero mockups, dashboard previews, pricing recommended tier.

className="
  rounded-3xl 
  border border-[--cr-border] 
  bg-white 
  shadow-[0_24px_70px_-30px_rgba(13,148,136,0.28)] 
  p-6 md:p-8
"

Soft Section Card

Use inside growth, workflow, and trust sections.

className="
  rounded-2xl 
  bg-[--cr-surface-2] 
  border border-[--cr-border] 
  p-6
"


---

7. Status Badge System

Add these reusable badge recipes.

Success

className="inline-flex items-center rounded-full bg-[--cr-success-light] px-3 py-1 text-xs font-semibold text-[--cr-success]"

Label examples:

Slot Refilled
Booked
Recovered
Confirmed

Warning

className="inline-flex items-center rounded-full bg-[--cr-warning-light] px-3 py-1 text-xs font-semibold text-[--cr-warning]"

Label examples:

Pending
Awaiting Reply
Needs Staff Review

Danger

className="inline-flex items-center rounded-full bg-[--cr-danger-light] px-3 py-1 text-xs font-semibold text-[--cr-danger]"

Label examples:

Cancelled
Unfilled
No Reply

Teal / Active

className="inline-flex items-center rounded-full bg-[--cr-teal-light] px-3 py-1 text-xs font-semibold text-[--cr-teal]"

Label examples:

Active Workflow
SMS Sent
Waitlist Matched


---

8. Icon System

The repo uses Phosphor Icons, so the design system should standardize on them.

Use icons from current content:

Use	Icon

Cancelled appointment	CalendarX
Waitlist	ListChecks
SMS / communication	ChatCircle, ChatCircleText
Confirmation	CheckCircle, CalendarCheck
Reminder	BellRinging
Metrics	ChartBar, Gauge
Growth	TrendUp
Security	Lock
Workflow	ArrowsClockwise
Routing	Funnel


Important correction: the content file currently includes Robot for intake coordination. That weakens the “not an AI toy” positioning.

Change this:

{ icon: "Robot", title: "Intake coordination", ... }

To this:

{ icon: "ClipboardText", title: "Intake coordination", ... }

Or:

{ icon: "FlowArrow", title: "Intake coordination", ... }

No robots. No sci-fi. No “AI magic” nonsense.


---

9. Landing Page Section System

The actual repo order is:

<Nav />
<Hero />
<ProblemSection />
<WaitlistSection />
<ProductWorkflow />
<FeatureGrid />
<GrowthSection />
<WebServices />
<DashboardMockup />
<UseCases />
<TrustSection />
<MetricsSection />
<PricingSection />
<ProcessSection />
<FaqSection />
<FinalCta />
<Footer />
<MobileStickyCta />

This is strong, but slightly long. The hierarchy should be:

Primary Narrative

1. Hero


2. Problem


3. Waitlist Recovery


4. Product Workflow


5. Dashboard Mockup


6. Growth Infrastructure


7. Trust


8. Pricing


9. Final CTA



Secondary Narrative

Feature grid, use cases, metrics, process, FAQ can stay, but avoid making the page feel like a buffet.

The strongest feature is waitlist recovery. Don’t bury the blade.


---

10. Hero System

Current hero data is strong:

h1: "Fill cancelled slots faster."

Keep it.

Recommended hero structure:

Eyebrow:
Front-Desk Orchestration

Headline:
Fill cancelled slots faster.

Subheadline:
ClinicRelay connects your waitlist, your front desk, and your schedule — so cancelled time has a second chance to become productive time.

Primary CTA:
Book a Demo

Secondary CTA:
Request Workflow Audit

Hero Bento Cards

Current cards:

1. Open Slot Detected
2. Waitlist Matched
3. SMS Dispatched
4. Reply Captured
5. Slot Refilled

Good. Tight. Operational.

Improve labels slightly:

1. Cancelled Slot Detected
2. Eligible Waitlist Match Found
3. Recovery SMS Sent
4. Patient Reply Captured
5. Staff Confirms Refill

That better matches the dashboard mockup workflow.


---

11. Dashboard Mockup System

The mockup should be central to the page.

Use this visual hierarchy:

Left sidebar:
Overview
Cancelled Slots
Waitlist
Recovery
Front Desk
Calendar
Patients
Communication
Analytics
Settings

Top metrics:
Cancelled Today
Recovery in Progress
Recovered Today
Recovery Rate

Main table:
Slot & Reason
Waitlist Match
Outreach
Patient Reply
Staff Task
Status

Required Workflow States

Show exactly this recovery chain:

Cancelled appointment slot
→ Eligible waitlist patient
→ SMS recovery offer sent
→ Patient reply received
→ Staff confirmation task
→ Slot refilled

Mock Data

Use realistic clinic-safe sample data:

const recoveryRows = [
  {
    slot: "Today, 10:30 AM",
    provider: "Dr. Patel",
    duration: "30 min",
    reason: "Cancelled by patient",
    reasonTag: "Sick",
    patient: "Jessica Smith",
    mrn: "MRN 004312",
    service: "New Patient Consult",
    priority: "High",
    outreach: "SMS sent",
    outreachTime: "10:32 AM",
    reply: "Yes, I can take it.",
    replyTime: "10:33 AM",
    task: "Confirm & book",
    assignee: "Assigned to you",
    status: "Pending"
  },
  {
    slot: "Today, 1:00 PM",
    provider: "Dr. Lee",
    duration: "45 min",
    reason: "Cancelled by clinic",
    reasonTag: "Overbooked",
    patient: "Robert Martinez",
    mrn: "MRN 008765",
    service: "Return Visit",
    priority: "High",
    outreach: "SMS sent",
    outreachTime: "12:15 PM",
    reply: "Yes, that works.",
    replyTime: "12:17 PM",
    task: "Confirm & book",
    assignee: "Completed by Sam",
    status: "Booked"
  },
  {
    slot: "Today, 3:30 PM",
    provider: "Dr. Patel",
    duration: "30 min",
    reason: "Cancelled by patient",
    reasonTag: "Family",
    patient: "Alyssa Lin",
    mrn: "MRN 001234",
    service: "New Patient Consult",
    priority: "Medium",
    outreach: "SMS sent",
    outreachTime: "3:31 PM",
    reply: "No reply",
    replyTime: "First reminder due 3:46 PM",
    task: "Awaiting reply",
    assignee: "—",
    status: "In Progress"
  }
];


---

12. Motion Rules

The repo has Framer Motion. Keep motion restrained.

Use Motion For

section fade-in

cards rising slightly

workflow steps entering sequentially

dashboard mockup subtle reveal


Avoid

bouncing

spinning

excessive parallax

animated robots

typing gimmicks

flashy AI gradients


Motion Defaults

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0 }
};

const transition = {
  duration: 0.35,
  ease: [0.22, 1, 0.36, 1]
};

For staggered cards:

transition={{
  staggerChildren: 0.08
}}


---

13. Section Background Rules

Use three background modes only.

Default

bg-[--cr-bg]

White Surface

bg-white

Soft Teal

bg-[--cr-surface-2]

Do not overuse gradients. The current brand is strongest when it feels clean, quiet, and precise.

Acceptable gradient:

bg-gradient-to-b from-[--cr-bg] to-white

Avoid:

purple-blue AI gradients
neon mesh backgrounds
glassmorphism everywhere

This is a clinic workflow product, not a crypto dashboard that forgot its medication.


---

14. Component Specs

Nav

Should be:

sticky top-0 z-50
bg-white/80 backdrop-blur-xl
border-b border-[--cr-border]

Nav items from repo:

Product
Waitlist Recovery
Growth Services
Pricing
FAQ

Keep.

Primary nav CTA:

Book a Demo

Secondary optional CTA:

Workflow Audit


---

Problem Cards

Use painCards from content.

The section should feel like:

Your front desk is not lazy.
Your system is leaking time.

Tone: respectful to staff, firm about workflow failure.

Recommended section headline:

> Cancelled slots are not just empty time. They are recoverable capacity.




---

Waitlist Section

This is the spearpoint.

Use recoverySteps.

Layout:

left: explanation and CTA

right: vertical workflow cards

mobile: stacked workflow


Use icons and status colors.

Do not make this section decorative. It should explain the product.


---

Product Workflow

Use workflowSteps.

Purpose:

Show ClinicRelay is broader than waitlist recovery:

Intake
Smart scheduling
Reminders
Waitlist recovery
Performance visibility

This helps sell future platform depth without diluting the hero.


---

Feature Grid

The repo has 12 feature cards.

Keep 6–8 visible by default. Too many cards can make the product feel unfocused.

Priority order:

1. Waitlist automation


2. Two-way SMS


3. Confirmation sequences


4. Missed call capture


5. Recall campaigns


6. Front-desk dashboard


7. Data governance


8. Multi-location support



Move lower-priority items further down or hide behind “More capabilities.”


---

Growth Section

The growth section is smart because you want to offer web dev services for clinics.

But keep the distinction sharp:

ClinicRelay product = operational recovery
Growth services = website, SEO, ads, reputation

Do not let the landing page sound like a web design agency first.

Primary growth message:

> Once your clinic stops leaking appointments, ClinicRelay helps you create more demand to fill them.



That is the correct sequencing.


---

Web Services

Current service cards are good:

Clinic Website
Google Ads
Local SEO
Reputation System
Growth Audit

Recommended rename:

Clinic Growth Infrastructure

Because “web services” sounds too generic.


---

Trust Section

Current trust pillars are strong:

No autonomous patient decisions
No PHI stored beyond workflow context
Clinic-controlled opt-out
Audit trail for every action
Canadian infrastructure

Keep these.

But be careful with:

Canadian infrastructure

Only say this if the implementation actually uses Canadian hosting/data residency. If not implemented yet, phrase as:

> Canadian data residency available for eligible deployments.



Truth beats polish. Especially in healthcare.


---

Pricing Section

Current pricing packages:

Waitlist Recovery Starter
Front-Desk Recovery Pilot
Growth System

This is good.

Recommended hierarchy:

Starter

For clinics that only want cancellation recovery.

Recovery Pilot

The default offer. Make this the recommended tier.

Growth System

For clinics that want operational recovery plus website/SEO/reputation.

Primary pricing CTA:

Request a Workflow Audit

Better than “Buy Now” because this is consultative B2B healthcare.


---

15. Accessibility Rules

Keep or add:

WCAG 2.2 AA target
Keyboard-accessible nav and CTAs
Visible focus states
Minimum 4.5:1 text contrast
No color-only workflow communication
Reduced motion support
Semantic headings
Descriptive button text

Add CSS:

@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    scroll-behavior: auto !important;
    transition-duration: 0.01ms !important;
  }
}


---

16. Responsive Behavior

Mobile

Single column
Hero text first, mockup second
Sticky CTA enabled
Hide dense dashboard table or convert rows to cards
Section padding: py-16

Tablet

Two-column where useful
Dashboard mockup remains visible but simplified
Feature grid: 2 columns

Desktop

Max width: 1400px for hero
Max width: 1280px for standard sections
Feature grid: 3 columns
Dashboard mockup full width

The hero already uses:

max-w-[1400px] mx-auto px-6 lg:px-10

Keep this.


---

17. Copy Rules

Voice

Use:

calm
specific
operational
clinically safe
revenue-aware
staff-respectful

Avoid:

revolutionary
AI-powered everything
autonomous
disruptive
magic
replace your staff

Approved Messaging

Turn cancellations into recoverable revenue.
Fill cancelled slots faster.
Recover capacity before the slot goes cold.
Give your front desk a workflow, not another inbox.
Clinic growth starts by stopping appointment leakage.

Avoid

AI receptionist
fully autonomous clinic
replace front-desk staff
never lose revenue again
guaranteed recovery
HIPAA/PIPEDA compliant

Unless compliance is formally validated, don’t make hard claims.


---

18. Concrete Code Changes I Recommend

A. Add semantic status tokens to globals.css

:root {
  --cr-success: #16a34a;
  --cr-success-light: #dcfce7;

  --cr-warning: #d97706;
  --cr-warning-light: #fef3c7;

  --cr-danger: #dc2626;
  --cr-danger-light: #fee2e2;

  --cr-info: #2563eb;
  --cr-info-light: #dbeafe;

  --cr-slate: #334155;
  --cr-slate-light: #f1f5f9;
}

B. Add badge classes

.cr-badge {
  display: inline-flex;
  align-items: center;
  border-radius: 9999px;
  padding: 0.25rem 0.75rem;
  font-size: 0.75rem;
  font-weight: 600;
}

.cr-badge-success {
  background: var(--cr-success-light);
  color: var(--cr-success);
}

.cr-badge-warning {
  background: var(--cr-warning-light);
  color: var(--cr-warning);
}

.cr-badge-danger {
  background: var(--cr-danger-light);
  color: var(--cr-danger);
}

.cr-badge-teal {
  background: var(--cr-teal-light);
  color: var(--cr-teal);
}

C. Replace Robot icon in content

Change:

{ icon: "Robot", title: "Intake coordination", ... }

To:

{ icon: "ClipboardText", title: "Intake coordination", ... }

D. Update hero bento labels

Current:

Open Slot Detected
Waitlist Matched
SMS Dispatched
Reply Captured
Slot Refilled

Better:

Cancelled Slot Detected
Eligible Patient Matched
Recovery SMS Sent
Patient Reply Captured
Staff Confirms Refill

E. Move DashboardMockup higher

Current position:

<GrowthSection />
<WebServices />
<DashboardMockup />

Recommended:

<WaitlistSection />
<ProductWorkflow />
<DashboardMockup />
<FeatureGrid />
<GrowthSection />
<WebServices />

The dashboard is proof. Don’t hide proof after the agency-services pitch.


---

19. Full AI Agent Prompt

Use this to update the repo:

You are editing the ClinicRelay landing page repository.

The product is ClinicRelay, a clinic front-desk orchestration platform focused first on cancelled-slot recovery, then broader front-desk workflow coordination and clinic growth infrastructure.

Design direction:
ClinicRelay must feel like a calm, premium healthcare operations platform. It should resemble Linear or Stripe in clarity, spacing, and restraint, but adapted for healthcare operations. Do not make it look like an AI toy. Do not use robot imagery, cartoon illustrations, stock doctor photos, or flashy AI gradients.

Tech constraints:
- Next.js 16
- React 19
- Tailwind CSS v4
- Geist font
- Framer Motion
- Phosphor Icons
- Existing CSS variables in app/globals.css are the design-token source of truth.

Tasks:

1. Update app/globals.css:
   - Keep the existing ClinicRelay CSS variables.
   - Add semantic status tokens for success, warning, danger, info, and slate.
   - Add reusable badge classes:
     cr-badge
     cr-badge-success
     cr-badge-warning
     cr-badge-danger
     cr-badge-teal
   - Add cr-btn-ghost.
   - Add prefers-reduced-motion support.

2. Update lib/content/clinicrelay-landing.ts:
   - Replace the Robot icon with ClipboardText or another operational icon.
   - Update hero bento card labels to:
     Cancelled Slot Detected
     Eligible Patient Matched
     Recovery SMS Sent
     Patient Reply Captured
     Staff Confirms Refill
   - Keep the hero headline: “Fill cancelled slots faster.”
   - Keep the primary positioning around waitlist recovery and cancelled-slot recovery.
   - Avoid hard compliance claims unless phrased carefully.

3. Update app/page.tsx section order:
   Preferred order:
   Nav
   Hero
   ProblemSection
   WaitlistSection
   ProductWorkflow
   DashboardMockup
   FeatureGrid
   GrowthSection
   WebServices
   UseCases
   TrustSection
   MetricsSection
   PricingSection
   ProcessSection
   FaqSection
   FinalCta
   Footer
   MobileStickyCta

4. Update the dashboard mockup:
   It should show a waitlist recovery workflow:
   - Cancelled appointment slot
   - Eligible waitlist patient
   - SMS recovery offer sent
   - Patient reply received
   - Staff confirmation task
   - Slot refilled

   Visual style:
   - white cards
   - soft slate text
   - teal accents
   - subtle green success state
   - amber pending state
   - red cancelled status
   - no stock photos
   - no doctors
   - no robots
   - no cartoon style

5. Maintain accessibility:
   - semantic headings
   - visible focus states
   - no color-only status communication
   - keyboard-friendly CTAs
   - reduced motion support

6. Keep copy specific and operational:
   Approved phrases:
   - Fill cancelled slots faster.
   - Recover capacity before the slot goes cold.
   - Give your front desk a workflow, not another inbox.
   - Turn cancellations into recoverable revenue.

   Avoid:
   - revolutionary AI
   - autonomous clinic
   - replace your staff
   - guaranteed recovery
   - HIPAA/PIPEDA compliant unless legally validated

Goal:
Make the landing page feel premium, credible, clinic-safe, and revenue-relevant. Lead with waitlist recovery. Use growth services as the expansion layer after operational leakage is solved.


---

Bottom Line

The design system is now better aligned with the actual repo.

The biggest corrections are:

1. Use the existing CSS variables as the source of truth.


2. Add missing status tokens.


3. Remove the Robot icon.


4. Move the dashboard mockup higher.


5. Make waitlist recovery the proof-bearing center of the page.


6. Keep growth services as expansion, not the main pitch.



The product story is strong. The execution risk is dilution. Don’t let “we also build websites” eat the sharper message: ClinicRelay recovers lost clinic capacity.
