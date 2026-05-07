# Review Fixes Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Address all P0 and P1 issues identified in the master branch review — canonical URL alignment, removal of brittle GitNexus scripts, clearer sample data labelling, safer SMS automation language, accurate patient portal FAQ answer, and market-friendlier feature status labels.

**Architecture:** All changes are content or configuration only. No new components, no new dependencies, no structural changes to the page.

**Tech Stack:** `lib/content/clinicrelay-landing.ts` (single source of truth for all copy), `app/layout.tsx` (metadata), `README.md`, `package.json`, `components/landing/dashboard-mockup.tsx`, `components/landing/feature-grid.tsx`.

---

## File Map

| Action | Path | What changes |
|--------|------|--------------|
| Modify | `app/layout.tsx` | `metadataBase` URL, OG title + description, Twitter title + description aligned to new hero |
| Modify | `README.md` | Production URL aligned to match `metadataBase` |
| Modify | `package.json` | Remove `gnx` and `gnx:analyze` scripts that reference `/root/bright-smile` |
| Modify | `lib/content/clinicrelay-landing.ts` | 6 targeted copy fixes (hero bento, recoveryStep, dashboardMockData, FAQ ×3) |
| Modify | `components/landing/dashboard-mockup.tsx` | Expand "Demo workflow data" badge to include explicit sample disclaimer |
| Modify | `components/landing/feature-grid.tsx` | Update `statusLabel` display strings to market-friendlier values |

---

## Task 1: Fix canonical URL mismatch (P0)

**Problem:** `app/layout.tsx` has `metadataBase: new URL("https://clinicrelay.vercel.app")` but `README.md` says `Production: https://clinicrelay-landing.vercel.app`. These are different Vercel subdomains. Open Graph, Twitter cards, and sitemap resolution all use `metadataBase` — a mismatch breaks social sharing previews and SEO canonicalisation. The OG and Twitter titles also still say "Fill cancelled slots faster" — the old hero copy that was replaced in the repositioning.

**Files:**
- Modify: `app/layout.tsx`
- Modify: `README.md`

- [ ] **Step 1: Update metadataBase and social metadata in layout.tsx**

Open `app/layout.tsx`. Make the following targeted changes:

```ts
// Line 10 — change metadataBase:
metadataBase: new URL(
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://clinicrelay-landing.vercel.app"
),
```

Using `NEXT_PUBLIC_SITE_URL` with a fallback means the canonical URL can be overridden via Vercel env var when a custom domain is added, without touching code.

```ts
// Lines 22-24 — update OG title and description to match current hero:
openGraph: {
  title: "ClinicRelay — Front-Desk Orchestration for Growing Clinics",
  description: "ClinicRelay helps clinics recover cancelled slots, route patient requests, prepare intake and insurance tasks, and give staff one place to see what needs attention.",
```

```ts
// Lines 29-32 — update Twitter title and description:
twitter: {
  card: "summary_large_image",
  title: "ClinicRelay — Front-Desk Orchestration for Growing Clinics",
  description: "Cancelled-slot recovery, pre-visit readiness, and front-desk coordination for appointment-based clinics.",
```

The full updated `metadata` block should look like:

```ts
export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://clinicrelay-landing.vercel.app"
  ),
  title: "ClinicRelay — Front-Desk Orchestration for Growing Clinics",
  description: "ClinicRelay helps clinics recover cancelled slots, route patient requests, prepare intake and insurance tasks, and give staff one place to see what needs attention.",
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    apple: [{ url: "/apple-icon.svg", type: "image/svg+xml" }],
    shortcut: ["/favicon.svg"],
  },
  openGraph: {
    title: "ClinicRelay — Front-Desk Orchestration for Growing Clinics",
    description: "ClinicRelay helps clinics recover cancelled slots, route patient requests, prepare intake and insurance tasks, and give staff one place to see what needs attention.",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "ClinicRelay front-desk orchestration workflow",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ClinicRelay — Front-Desk Orchestration for Growing Clinics",
    description: "Cancelled-slot recovery, pre-visit readiness, and front-desk coordination for appointment-based clinics.",
    images: ["/twitter-image"],
  },
};
```

- [ ] **Step 2: Align README production URL**

Open `README.md`. Change the deployment section:

```markdown
## Deployment

Deployed on Vercel.

- Production: https://clinicrelay-landing.vercel.app
- Repo: https://github.com/micahjatau/clinicrelay
```

The URL `https://clinicrelay-landing.vercel.app` matches the fallback in `metadataBase`. Both are now consistent.

- [ ] **Step 3: Build — verify no TypeScript errors**

```bash
cd /root/clinicrelay-landing && npm run build 2>&1 | tail -10
```

Expected: clean build output with all routes listed.

- [ ] **Step 4: Commit**

```bash
cd /root/clinicrelay-landing && git add app/layout.tsx README.md && git commit -m "fix(seo): align canonical URL across metadataBase and README, update OG/Twitter titles"
```

---

## Task 2: Remove brittle GitNexus scripts (P1)

**Problem:** `package.json` contains two scripts:

```json
"gnx": "NODE_OPTIONS=\"--require /root/bright-smile/.gitnexus/lbug-patch.cjs\" gitnexus",
"gnx:analyze": "NODE_OPTIONS=\"--require /root/bright-smile/.gitnexus/lbug-patch.cjs\" gitnexus analyze"
```

These embed an absolute path to `/root/bright-smile/` — a path that only exists on the original dev machine. Any other developer, CI runner, or Vercel build attempting to run these scripts will get `MODULE_NOT_FOUND`. They should not be in the landing page repo at all; GitNexus indexing belongs to the BrightSmile application repo.

**Files:**
- Modify: `package.json`

- [ ] **Step 1: Remove gnx scripts from package.json**

Open `package.json`. Find the `scripts` block. Remove the two lines:

```json
"gnx": "NODE_OPTIONS=\"--require /root/bright-smile/.gitnexus/lbug-patch.cjs\" gitnexus",
"gnx:analyze": "NODE_OPTIONS=\"--require /root/bright-smile/.gitnexus/lbug-patch.cjs\" gitnexus analyze",
```

The `scripts` block after removal should contain only:

```json
"scripts": {
  "dev": "next dev --turbopack",
  "build": "next build",
  "start": "next start",
  "lint": "eslint",
  "test": "vitest run",
  "lead-gen": "tsx --env-file .env.local scripts/lead-gen/run.ts"
},
```

- [ ] **Step 2: Verify no gitnexus references remain**

```bash
cd /root/clinicrelay-landing && grep -r "gitnexus\|bright-smile" package.json
```

Expected: no output.

- [ ] **Step 3: Build — verify package.json change doesn't affect build**

```bash
cd /root/clinicrelay-landing && npm run build 2>&1 | tail -10
```

Expected: clean build.

- [ ] **Step 4: Commit**

```bash
cd /root/clinicrelay-landing && git add package.json && git commit -m "chore(scripts): remove brittle GitNexus scripts referencing /root/bright-smile path"
```

---

## Task 3: Explicit sample data disclaimer on dashboard (P1)

**Problem:** The dashboard mockup currently shows a small "Demo workflow data" badge (top right corner of the dashboard card). The reviewer flags that metrics like "Slot Utilization: 84%", "Recall Due This Week: 47", and "Avg Response Time: 4m" look like real performance claims to a buyer. A small badge in the corner is easy to miss. The section heading area needs a more explicit disclaimer visible at a glance.

**Files:**
- Modify: `components/landing/dashboard-mockup.tsx`

The current dashboard header block (lines ~73–78) is:

```tsx
<div className="mb-14 flex items-center justify-between gap-4 flex-wrap">
  <div>
    <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[--cr-teal] mb-3">Dashboard</p>
    <h2 className="text-3xl md:text-4xl tracking-tight font-semibold text-[--cr-text]">Proof of recovery in one view.</h2>
  </div>
  <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-[--cr-muted] border border-[--cr-border]">Demo workflow data</span>
</div>
```

- [ ] **Step 1: Add explicit sample disclaimer below the heading**

Replace the header block with:

```tsx
<div className="mb-14 flex items-center justify-between gap-4 flex-wrap">
  <div>
    <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[--cr-teal] mb-3">Dashboard</p>
    <h2 className="text-3xl md:text-4xl tracking-tight font-semibold text-[--cr-text]">Proof of recovery in one view.</h2>
    <p className="text-sm text-[--cr-muted] mt-2">Sample workflow dashboard. Metrics shown for demonstration only and do not represent actual clinic outcomes.</p>
  </div>
  <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-[--cr-muted] border border-[--cr-border]">Demo workflow data</span>
</div>
```

The disclaimer sits directly under the heading, visible before the eye reaches the dashboard card. The existing badge is kept as a second, redundant signal.

- [ ] **Step 2: Build — verify no TypeScript errors**

```bash
cd /root/clinicrelay-landing && npm run build 2>&1 | tail -10
```

Expected: clean build.

- [ ] **Step 3: Commit**

```bash
cd /root/clinicrelay-landing && git add components/landing/dashboard-mockup.tsx && git commit -m "fix(dashboard): add explicit sample data disclaimer under section heading"
```

---

## Task 4: Safer SMS automation language (P1)

**Problem:** Several copy strings imply automatic SMS dispatch without qualification. The BrightSmile notification system requires scheduler configuration for fully automated dispatch — claiming "SMS sent" or "SMS dispatched" without qualification could set false expectations with buyers evaluating a pilot.

**Exact changes required in `lib/content/clinicrelay-landing.ts`:**

| Line | Current | Replacement |
|------|---------|-------------|
| 67 | `label: "Recovery SMS Sent"` | `label: "Recovery Offer Routed"` |
| 67 | `detail: "Personalized message sent"` | `detail: "Recovery message prepared and routed"` |
| 109 | `title: "SMS dispatched"` | `title: "Recovery offer routed"` |
| 283 | `sub: "SMS sent"` | `sub: "Outreach routed"` |
| 404 (FAQ answer) | `"sends it for staff review before dispatch — or automatically, depending on your configuration."` | `"routes it for staff review before dispatch — or sends it automatically, depending on your configuration."` |

Note: Line 109's `copy` is already safe — "prepared or sent based on your clinic workflow rules" — leave it unchanged.
Note: Line 185 ("Patients can confirm by SMS, and replies are routed to staff") is accurate and does not imply automation. Leave it unchanged.
Note: Line 368 ("SMS reply routing" in a pricing feature list) is accurate — it describes reply routing, not outbound automation. Leave it unchanged.

**Files:**
- Modify: `lib/content/clinicrelay-landing.ts`

- [ ] **Step 1: Apply the five targeted copy changes**

Change line 67 — hero bento card step 3:

```ts
// Before:
{ step: "3", label: "Recovery SMS Sent", detail: "Personalized message sent" },

// After:
{ step: "3", label: "Recovery Offer Routed", detail: "Recovery message prepared and routed" },
```

Change line 109 — recovery step 03 title:

```ts
// Before:
{ number: "03", icon: "ChatCircle", title: "SMS dispatched", copy: "A personalized message is prepared or sent based on your clinic workflow rules." },

// After:
{ number: "03", icon: "ChatCircle", title: "Recovery offer routed", copy: "A personalized message is prepared or sent based on your clinic workflow rules." },
```

Change line 283 — dashboard mock data sub label:

```ts
// Before:
{ label: "Missed Calls Today", value: "2", sub: "SMS sent" },

// After:
{ label: "Missed Calls Today", value: "2", sub: "Outreach routed" },
```

Change line 404 — FAQ answer for "How does the waitlist SMS work?":

```ts
// Before:
answer: "When a cancellation is detected, ClinicRelay identifies eligible waitlist patients, generates a personalized SMS, and sends it for staff review before dispatch — or automatically, depending on your configuration. Patient replies are routed back to your inbox for a one-click confirm.",

// After:
answer: "When a cancellation is detected, ClinicRelay identifies eligible waitlist patients, generates a personalized recovery offer, and routes it for staff review before dispatch — or sends it automatically, depending on your configuration. Patient replies are routed back to your inbox for a one-click confirm.",
```

- [ ] **Step 2: Run full test suite — verify content tests still pass**

```bash
cd /root/clinicrelay-landing && npx vitest run
```

Expected: all tests passing. The content-claims tests check for overclaims, not specific SMS wording — they should be unaffected.

- [ ] **Step 3: Commit**

```bash
cd /root/clinicrelay-landing && git add lib/content/clinicrelay-landing.ts && git commit -m "fix(content): replace SMS automation language with dispatch-neutral wording"
```

---

## Task 5: Fix patient portal FAQ answer (P1)

**Problem:** The FAQ answer to "Do patients need to download an app?" currently says:

> "No. All patient communication happens over standard SMS. Nothing for patients to install or log into."

This is inaccurate. BrightSmile has a patient portal that handles intake, insurance, and appointment details. Saying "all communication happens over SMS" contradicts the Pre-Visit Readiness section of the same page, which describes a patient portal for intake workflows. A buyer who reads both sections will notice the contradiction.

**Files:**
- Modify: `lib/content/clinicrelay-landing.ts`

- [ ] **Step 1: Update the FAQ patient portal answer**

Find line 408:

```ts
// Before:
{
  question: "Do patients need to download an app?",
  answer: "No. All patient communication happens over standard SMS. Nothing for patients to install or log into.",
},

// After:
{
  question: "Do patients need to download an app?",
  answer: "No app download is required. SMS handles lightweight replies for waitlist recovery and confirmations. When enabled, the patient portal supports intake, insurance review, and appointment details — all accessible by link, no login required.",
},
```

This answer is now accurate for all three communication modes: SMS (always on), portal links (when enabled), and no native app (always true).

- [ ] **Step 2: Run full test suite**

```bash
cd /root/clinicrelay-landing && npx vitest run
```

Expected: all tests passing.

- [ ] **Step 3: Commit**

```bash
cd /root/clinicrelay-landing && git add lib/content/clinicrelay-landing.ts && git commit -m "fix(content): correct patient portal FAQ answer to reflect portal + SMS capabilities"
```

---

## Task 6: Market-friendlier feature status labels (P2)

**Problem:** Feature cards in the feature grid show status badges: "Available", "Pilot-supported", "Roadmap". "Roadmap" publicly signals unfinished features to buyers — this can undermine conversion for prospects who might have been fine not knowing a feature was planned rather than shipped. "Pilot-supported" is accurate but could be cleaner.

The change is display-only. The underlying `FeatureStatus` type values (`"available"`, `"pilot"`, `"roadmap"`) in `lib/content/clinicrelay-landing.ts` are unchanged — they are used as content data keys, not shown directly to users.

**Files:**
- Modify: `components/landing/feature-grid.tsx`

- [ ] **Step 1: Update the statusLabel display map**

Find lines 11–15 in `components/landing/feature-grid.tsx`:

```ts
// Before:
const statusLabel: Record<FeatureStatus, string> = {
  available: "Available",
  pilot: "Pilot-supported",
  roadmap: "Roadmap",
};

// After:
const statusLabel: Record<FeatureStatus, string> = {
  available: "Core",
  pilot: "Pilot-ready",
  roadmap: "Expansion",
};
```

- "Core" replaces "Available" — implies stable, central capability.
- "Pilot-ready" replaces "Pilot-supported" — tighter, more positive framing.
- "Expansion" replaces "Roadmap" — implies planned growth rather than incompleteness.

- [ ] **Step 2: Build — verify no TypeScript errors**

```bash
cd /root/clinicrelay-landing && npm run build 2>&1 | tail -10
```

Expected: clean build.

- [ ] **Step 3: Commit**

```bash
cd /root/clinicrelay-landing && git add components/landing/feature-grid.tsx && git commit -m "fix(content): replace feature status labels with market-friendlier display strings"
```

---

## Task 7: Push all fixes to origin

- [ ] **Step 1: Run full build and test suite one final time**

```bash
cd /root/clinicrelay-landing && npm run lint && npx vitest run && npm run build 2>&1 | tail -15
```

Expected: lint clean, all tests passing, build clean.

- [ ] **Step 2: Push to origin master**

```bash
cd /root/clinicrelay-landing && git push origin master
```

Expected: `master -> master` push confirmed.

- [ ] **Step 3: Verify Vercel deployment succeeds**

```bash
cd /root/clinicrelay-landing && npx vercel ls 2>&1 | head -5
```

Expected: latest production deployment shows `● Ready` within 60–90 seconds of push.
