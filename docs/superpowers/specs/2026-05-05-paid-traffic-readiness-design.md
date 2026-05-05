# ClinicRelay Landing — Paid Traffic Readiness & Content Audit

**Date:** 2026-05-05
**Status:** Approved
**Branch:** master

---

## Overview

Three independent improvements to prepare the ClinicRelay landing page for direct clinic outreach:

1. **Rate limiting** on `/api/leads` via Vercel KV
2. **PostHog analytics** for conversion funnel visibility
3. **Content audit** — fix four copy inaccuracies before showing the page to clinic owners

Each ships as its own commit in sequence (A → B → C).

---

## Section 1: Rate Limiting (Vercel KV)

### Goal
Prevent spam bursts to the lead capture endpoint before outreach drives traffic to the page.

### Packages
- `@upstash/ratelimit` — sliding window algorithm
- `@upstash/redis` — Upstash Redis client (compatible with Vercel KV env vars)

### New file: `lib/ratelimit/leads.ts`
- Initialises an `@upstash/redis` client using `KV_REST_API_URL` + `KV_REST_API_TOKEN`
- Returns a `Ratelimit` instance configured as: **5 requests per IP per 10 minutes** (sliding window)
- If env vars are missing (local dev without KV wired), returns `null` — caller skips rate limiting gracefully

### Change: `app/api/leads/route.ts`
- At the top of `POST`, extract client IP from `x-forwarded-for` header (Vercel sets this)
- Call the limiter; if limit exceeded, return `429 { error: "Too many requests. Please try again later." }` with a `Retry-After` header (seconds until reset, from Upstash's `reset` timestamp)
- If limiter is `null` (env vars absent), continue to normal handler

### Prerequisites
- Create a KV store in Vercel dashboard: Storage → Create KV Store → link to the `clinicrelay` project
- Vercel auto-injects `KV_REST_API_URL` and `KV_REST_API_TOKEN` into deployed env
- Add both vars to `.env.local` for local testing

### Env vars
```
KV_REST_API_URL
KV_REST_API_TOKEN
```

---

## Section 2: PostHog Analytics

### Goal
Track the full conversion funnel (visitor → modal open → form submit → lead confirmed) before clinic outreach begins.

### Package
- `posthog-js` (client-side only; no server-side events needed for a landing page)

### New file: `components/providers/posthog-provider.tsx`
- `"use client"` component
- Initialises PostHog once on mount using `NEXT_PUBLIC_POSTHOG_KEY` and `NEXT_PUBLIC_POSTHOG_HOST`
- Wraps children; keeps all PostHog init code out of `layout.tsx`

### Change: `app/layout.tsx`
- Import `PostHogProvider` and wrap `<body>` contents
- One import, one wrapper — no other changes

### Events (4 total)

All events added to `components/landing/demo-modal.tsx`:

| Event | Trigger | Properties |
|---|---|---|
| `demo_modal_opened` | Modal opens | `{ intent: "demo" \| "audit" \| "recovery" }` |
| `lead_form_submitted` | Form submit button clicked | `{ intent }` |
| `lead_form_succeeded` | API returns `ok: true` | `{ intent }` |
| `lead_form_failed` | API returns error | `{ intent }` — no PII |

Pageviews are tracked automatically by PostHog.

### Env vars
```
NEXT_PUBLIC_POSTHOG_KEY
NEXT_PUBLIC_POSTHOG_HOST    # https://us.i.posthog.com
```

---

## Section 3: Content Audit

### Goal
Remove four copy inaccuracies that could damage trust on first contact with clinic owners. Recall is staff-triggered in BrightSmile, not autonomous — "all automated" language must be corrected.

### Only file changed: `lib/content/clinicrelay-landing.ts`

#### Fix 1 — Dental use case: recall overclaim
```
// Before
"Automate recall for preventive appointments."

// After
"Surface recall opportunities for preventive appointments."
```

#### Fix 2 — Optometry use case: "all automated" overclaim
```
// Before
"Annual exam recall, contact lens follow-ups, and frame adjustment reminders — all automated."

// After
"Annual exam recall, contact lens follow-ups, and frame adjustment reminders — surfaced for staff action."
```

#### Fix 3 — FAQ question 8: tier name mismatch
```
// Before (answer body)
"The Growth System tier supports multi-location groups..."

// After
"The Pilot Expansion tier supports multi-location groups..."
```

#### Fix 4 — Process step 4: unbuilt feature reference
```
// Before
"...expand to recall, new patient conversion, and growth services."

// After
"...expand to recall, confirmation workflows, and front-desk coordination."
```

### Rationale
Each change replaces an *autonomous outcome claim* with *staff-visible action framing*. This is both factually accurate and commercially credible — ClinicRelay surfaces and routes work to staff; it does not replace them.

---

## Commit sequence

```
feat(leads): add Vercel KV rate limiting to /api/leads (5 req/IP/10min)
feat(analytics): add PostHog funnel tracking (modal open, submit, succeed, fail)
fix(content): correct recall automation claims and tier name mismatch
```

---

## Out of scope

- Custom domain (`clinicrelay.co`) — pending DNS verification
- Resend domain flip (`leads@clinicrelay.co`) — blocked on domain verification
- Dashboard visual upgrades, hero mockup, OG image — separate design pass
