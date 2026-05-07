# Paid Traffic Readiness & Content Audit — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add Vercel KV rate limiting to `/api/leads`, wire PostHog conversion funnel tracking, and fix four content inaccuracies before clinic outreach.

**Architecture:** Three independent task groups shipped as separate commits: (1) rate limiting module + route integration, (2) PostHog provider + events, (3) copy-only content fixes. No shared state between groups.

**Tech Stack:** `@upstash/ratelimit`, `@upstash/redis`, `posthog-js`, Vercel KV, Next.js 15 App Router, Vitest

---

## File Map

| File | Action | Purpose |
|---|---|---|
| `lib/ratelimit/leads.ts` | Create | Singleton `Ratelimit` instance using Vercel KV env vars; returns `null` if unconfigured |
| `app/api/leads/route.ts` | Modify | Add rate limit check at top of `POST`; 429 + `Retry-After` on exceeded |
| `__tests__/api-leads.test.ts` | Modify | Add 2 tests: 429 when limited, 200 when limiter is null |
| `components/providers/posthog-provider.tsx` | Create | `"use client"` PostHog init + `PHProvider` wrapper |
| `app/layout.tsx` | Modify | Wrap `<DemoModalProvider>` with `<PostHogProvider>` |
| `components/landing/demo-modal.tsx` | Modify | Add 4 `posthog.capture()` calls: modal opened, submitted, succeeded, failed |
| `lib/content/clinicrelay-landing.ts` | Modify | Fix 4 copy inaccuracies (recall claims, tier name, unbuilt feature) |

---

## Task 1: Rate Limit Module

**Files:**
- Create: `lib/ratelimit/leads.ts`

- [ ] **Step 1: Install packages**

```bash
cd /root/clinicrelay-landing
npm install @upstash/ratelimit @upstash/redis
```

Expected: packages added to `package.json`, no errors.

- [ ] **Step 2: Create the rate limit module**

Create `lib/ratelimit/leads.ts`:

```ts
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

let ratelimit: Ratelimit | null = null;

export function getLeadsRatelimit(): Ratelimit | null {
  if (ratelimit) return ratelimit;

  const url = process.env.KV_REST_API_URL;
  const token = process.env.KV_REST_API_TOKEN;

  if (!url || !token) return null;

  const redis = new Redis({ url, token });
  ratelimit = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(5, "10 m"),
    analytics: false,
  });

  return ratelimit;
}
```

- [ ] **Step 3: Verify TypeScript compiles**

```bash
cd /root/clinicrelay-landing
npx tsc --noEmit
```

Expected: no errors.

---

## Task 2: Wire Rate Limit into Route + Tests

**Files:**
- Modify: `app/api/leads/route.ts`
- Modify: `__tests__/api-leads.test.ts`

- [ ] **Step 1: Write the failing tests**

Open `__tests__/api-leads.test.ts`. Add a `vi.mock` for the ratelimit module at the top of the file (alongside the existing Supabase mock), add the import, and add 2 new tests. The full updated file:

```ts
import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@/lib/supabase/admin", () => ({
  getSupabaseAdminClient: vi.fn(),
}));

vi.mock("@/lib/ratelimit/leads", () => ({
  getLeadsRatelimit: vi.fn(),
}));

import { POST } from "@/app/api/leads/route";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";
import { getLeadsRatelimit } from "@/lib/ratelimit/leads";

function makeRequest(body: unknown) {
  return new Request("http://localhost/api/leads", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

function mockSupabase(insertError: unknown = null) {
  const insert = vi.fn().mockResolvedValue({ error: insertError });
  const from = vi.fn().mockReturnValue({ insert });
  vi.mocked(getSupabaseAdminClient).mockReturnValue({ from } as never);
  return { from, insert };
}

describe("POST /api/leads", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(getLeadsRatelimit).mockReturnValue(null as never);
  });

  it("returns 422 when required fields are missing", async () => {
    mockSupabase();
    const res = await POST(makeRequest({ name: "Alex" }));
    expect(res.status).toBe(422);
    const body = await res.json();
    expect(body.error).toBe("Invalid fields.");
  });

  it("inserts lead and returns ok when required fields present", async () => {
    mockSupabase();
    const res = await POST(
      makeRequest({ name: "Dr. Sana Mir", email: "sana@clinic.ca", clinic_name: "Westview Family Health" })
    );
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.ok).toBe(true);
  });

  it("returns 500 when supabase client is unavailable", async () => {
    vi.mocked(getSupabaseAdminClient).mockReturnValue(null as never);
    const res = await POST(makeRequest({ name: "A", email: "a@b.com", clinic_name: "X" }));
    expect(res.status).toBe(500);
  });

  it("returns 500 when supabase insert fails", async () => {
    mockSupabase({ message: "DB error" });
    const res = await POST(makeRequest({ name: "A", email: "a@b.com", clinic_name: "X" }));
    expect(res.status).toBe(500);
  });

  it("returns 429 with Retry-After when rate limit is exceeded", async () => {
    const reset = Date.now() + 60_000;
    vi.mocked(getLeadsRatelimit).mockReturnValue({
      limit: vi.fn().mockResolvedValue({ success: false, reset }),
    } as never);
    const res = await POST(makeRequest({ name: "A", email: "a@b.com", clinic_name: "X" }));
    expect(res.status).toBe(429);
    const body = await res.json();
    expect(body.error).toBe("Too many requests. Please try again later.");
    expect(res.headers.get("Retry-After")).toBeTruthy();
  });

  it("skips rate limiting and succeeds when limiter is null", async () => {
    vi.mocked(getLeadsRatelimit).mockReturnValue(null as never);
    mockSupabase();
    const res = await POST(makeRequest({ name: "A", email: "a@b.com", clinic_name: "X" }));
    expect(res.status).toBe(200);
  });
});
```

- [ ] **Step 2: Run tests — verify the 2 new tests fail**

```bash
cd /root/clinicrelay-landing
npx vitest run __tests__/api-leads.test.ts
```

Expected: 4 existing tests pass, 2 new tests fail (route doesn't call `getLeadsRatelimit` yet).

- [ ] **Step 3: Add rate limit check to route**

Open `app/api/leads/route.ts`. Add the import and rate limit block. Full updated file:

```ts
import { NextResponse } from "next/server";
import { z } from "zod";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";
import { notifyNewLead } from "@/lib/email/notify";
import { getLeadsRatelimit } from "@/lib/ratelimit/leads";

const optionalText = z.string().trim().min(1).optional().or(z.literal(""));

const LeadSchema = z.object({
  name:           z.string().trim().min(1),
  clinic_name:    z.string().trim().min(1),
  email:          z.string().trim().email(),
  role:           optionalText,
  phone:          optionalText,
  clinic_type:    optionalText,
  location_count: optionalText,
  website_url:    optionalText,
  pain_points:    z.array(z.string().trim().min(1)).optional(),
  interest:       z.array(z.string().trim().min(1)).optional(),
  message:        optionalText,
  company:        optionalText,
});

export async function POST(request: Request) {
  const limiter = getLeadsRatelimit();
  if (limiter) {
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "anonymous";
    const { success, reset } = await limiter.limit(ip);
    if (!success) {
      const retryAfter = Math.ceil((reset - Date.now()) / 1000);
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429, headers: { "Retry-After": String(retryAfter) } }
      );
    }
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON." }, { status: 400 });
  }

  const parsed = LeadSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      process.env.NODE_ENV === "development"
        ? { error: "Invalid fields.", issues: parsed.error.issues }
        : { error: "Invalid fields." },
      { status: 422 }
    );
  }

  if (parsed.data.company && parsed.data.company.trim().length > 0) {
    return NextResponse.json({ ok: true });
  }

  const { ...rawLead } = parsed.data;
  const lead = Object.fromEntries(
    Object.entries(rawLead).filter(([key, value]) => {
      if (key === "company") return false;
      if (value === "") return false;
      if (Array.isArray(value)) return value.length > 0;
      return value !== undefined && value !== null;
    })
  );

  const supabase = getSupabaseAdminClient();
  if (!supabase) {
    return NextResponse.json({ error: "Unable to submit. Please try again." }, { status: 500 });
  }

  const { error } = await supabase.from("clinicrelay_leads").insert(lead);
  if (error) {
    return NextResponse.json({ error: "Unable to submit. Please try again." }, { status: 500 });
  }

  notifyNewLead(parsed.data as Parameters<typeof notifyNewLead>[0]).catch(() => {});

  return NextResponse.json({ ok: true });
}
```

- [ ] **Step 4: Run all tests — verify all 6 pass**

```bash
cd /root/clinicrelay-landing
npx vitest run __tests__/api-leads.test.ts
```

Expected: 6 tests pass, 0 failures.

- [ ] **Step 5: Commit**

```bash
cd /root/clinicrelay-landing
git add lib/ratelimit/leads.ts app/api/leads/route.ts __tests__/api-leads.test.ts package.json package-lock.json
git commit -m "feat(leads): add Vercel KV rate limiting to /api/leads (5 req/IP/10min)"
```

---

## Task 3: PostHog Provider + Layout

**Files:**
- Create: `components/providers/posthog-provider.tsx`
- Modify: `app/layout.tsx`

- [ ] **Step 1: Install PostHog**

```bash
cd /root/clinicrelay-landing
npm install posthog-js
```

Expected: `posthog-js` added to `package.json`.

- [ ] **Step 2: Create the PostHog provider**

Create `components/providers/posthog-provider.tsx`:

```tsx
"use client";

import posthog from "posthog-js";
import { PostHogProvider as PHProvider } from "posthog-js/react";
import { useEffect } from "react";

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (!process.env.NEXT_PUBLIC_POSTHOG_KEY) return;
    posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY, {
      api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST ?? "https://us.i.posthog.com",
      capture_pageview: true,
      capture_pageleave: true,
    });
  }, []);

  return <PHProvider client={posthog}>{children}</PHProvider>;
}
```

- [ ] **Step 3: Wire PostHogProvider into layout**

Open `app/layout.tsx`. The updated file:

```tsx
import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { DemoModalProvider } from "@/context/demo-modal-context";
import { DemoModalLazy } from "@/components/landing/demo-modal-lazy";
import { PostHogProvider } from "@/components/providers/posthog-provider";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://clinicrelay.vercel.app"),
  title: "ClinicRelay — Front-Desk Orchestration for Growing Clinics",
  description: "ClinicRelay helps clinics recover cancelled appointment slots, coordinate patient communication, manage waitlists, and reduce front-desk chaos.",
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    apple: [{ url: "/apple-icon.svg", type: "image/svg+xml" }],
    shortcut: ["/favicon.svg"],
  },
  openGraph: {
    title: "Fill cancelled slots faster with ClinicRelay",
    description: "Waitlist recovery, patient reminders, booking workflows, and front-desk coordination for growing clinics.",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "ClinicRelay waitlist recovery workflow",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Fill cancelled slots faster with ClinicRelay",
    description: "Waitlist recovery and front-desk coordination for growing clinics.",
    images: ["/twitter-image"],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={GeistSans.variable}>
      <body>
        <PostHogProvider>
          <DemoModalProvider>
            {children}
            <DemoModalLazy />
          </DemoModalProvider>
        </PostHogProvider>
      </body>
    </html>
  );
}
```

- [ ] **Step 4: Add env vars to .env.local**

Open `.env.local` and add:

```
NEXT_PUBLIC_POSTHOG_KEY=phc_YOUR_KEY_HERE
NEXT_PUBLIC_POSTHOG_HOST=https://us.i.posthog.com
```

Replace `phc_YOUR_KEY_HERE` with the actual key from your PostHog project (posthog.com → Project Settings → Project API Key).

- [ ] **Step 5: Verify TypeScript compiles**

```bash
cd /root/clinicrelay-landing
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 6: Run existing tests — verify nothing broken**

```bash
cd /root/clinicrelay-landing
npx vitest run
```

Expected: all 6 tests pass.

- [ ] **Step 7: Commit**

```bash
cd /root/clinicrelay-landing
git add components/providers/posthog-provider.tsx app/layout.tsx package.json package-lock.json
git commit -m "feat(analytics): add PostHog provider and wire into layout"
```

---

## Task 4: PostHog Conversion Events

**Files:**
- Modify: `components/landing/demo-modal.tsx`

- [ ] **Step 1: Add PostHog events to demo modal**

Open `components/landing/demo-modal.tsx`. The updated file — changes are: new import, `usePostHog()` hook, capture on modal open, and 3 captures in `handleSubmit`:

```tsx
"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, CheckCircle } from "@phosphor-icons/react";
import { useDemoModal } from "@/context/demo-modal-context";
import { usePostHog } from "posthog-js/react";

type State = "idle" | "loading" | "success" | "error";
type FormErrors = { name?: string; clinic_name?: string; email?: string };

const modalCopy = {
  demo: {
    title: "Book a Demo",
    description: "See how ClinicRelay helps recover cancelled slots and coordinate front-desk workflows.",
    submit: "Book my demo",
  },
  audit: {
    title: "Request Workflow Audit",
    description: "Tell us where cancellations, response delays, and manual follow-up are hurting operations.",
    submit: "Request my audit",
  },
  recovery: {
    title: "See Waitlist Recovery",
    description: "We'll walk you through the cancelled-slot recovery loop and staff confirmation workflow.",
    submit: "Show me recovery workflow",
  },
} as const;

export function DemoModal() {
  const { isOpen, close, intent } = useDemoModal();
  const [state, setState] = useState<State>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const posthog = usePostHog();

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [isOpen, close]);

  useEffect(() => {
    if (isOpen) {
      setState("idle");
      setErrorMsg("");
      setFormErrors({});
      posthog?.capture("demo_modal_opened", { intent });
    }
  }, [isOpen, intent, posthog]);

  function validate(fd: FormData) {
    const next: FormErrors = {};
    const name = String(fd.get("name") ?? "").trim();
    const clinic = String(fd.get("clinic_name") ?? "").trim();
    const email = String(fd.get("email") ?? "").trim();

    if (!name) next.name = "Please enter your name.";
    if (!clinic) next.clinic_name = "Please enter your clinic name.";
    if (!email) next.email = "Please enter your email.";
    else if (!/^\S+@\S+\.\S+$/.test(email)) next.email = "Please enter a valid email.";

    setFormErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    if (!validate(fd)) return;

    setState("loading");
    posthog?.capture("lead_form_submitted", { intent });

    const pain_points = fd.getAll("pain_points") as string[];
    const interest = fd.getAll("interest") as string[];
    const intentInterestMap = { demo: "demo", audit: "audit", recovery: "growth-system" } as const;
    const normalizedInterest = interest.length > 0 ? interest : [intentInterestMap[intent]];
    const payload = {
      name: fd.get("name"),
      clinic_name: fd.get("clinic_name"),
      role: fd.get("role"),
      email: fd.get("email"),
      phone: fd.get("phone"),
      clinic_type: fd.get("clinic_type"),
      location_count: fd.get("location_count"),
      website_url: fd.get("website_url"),
      message: fd.get("message"),
      company: fd.get("company"),
      pain_points,
      interest: normalizedInterest,
    };

    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        setState("success");
        posthog?.capture("lead_form_succeeded", { intent });
      } else {
        const json = await res.json();
        setErrorMsg(json.error ?? "Unable to submit. Please try again.");
        setState("error");
        posthog?.capture("lead_form_failed", { intent });
      }
    } catch {
      setErrorMsg("Unable to submit. Please try again.");
      setState("error");
      posthog?.capture("lead_form_failed", { intent });
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div className="fixed inset-0 z-50 flex items-center justify-center p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={close} />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="demo-modal-title"
            className="relative bg-white rounded-[2rem] p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl"
            initial={{ scale: 0.95, opacity: 0, y: 16 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 16 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <button onClick={close} className="absolute top-6 right-6 text-[--cr-muted] hover:text-[--cr-text] transition-colors" aria-label="Close">
              <X size={20} />
            </button>

            {state === "success" ? (
              <div className="text-center py-12">
                <CheckCircle size={48} weight="duotone" className="text-[--cr-teal] mx-auto mb-4" />
                <h2 className="text-2xl font-semibold text-[--cr-text] tracking-tight mb-2">We'll be in touch.</h2>
                <p className="text-[--cr-muted] mb-6">Expect to hear from us within one business day.</p>
                <button onClick={close} className="cr-btn cr-btn-primary">Done</button>
              </div>
            ) : (
              <>
                <h2 id="demo-modal-title" className="text-2xl font-semibold text-[--cr-text] tracking-tight mb-1">{modalCopy[intent].title}</h2>
                <p className="text-[--cr-muted] mb-8 text-sm">{modalCopy[intent].description}</p>

                <form onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Field label="Name *" name="name" required helperText="Used for your personalized demo briefing." error={formErrors.name} />
                    <Field label="Clinic Name *" name="clinic_name" required helperText="Helps us tailor workflow recommendations." error={formErrors.clinic_name} />
                    <Field label="Your Role" name="role" />
                    <Field label="Email *" name="email" type="email" required helperText="We'll send next steps here." error={formErrors.email} />
                    <Field label="Phone" name="phone" type="tel" />
                    <Field label="Current Website" name="website_url" type="url" />
                  </div>

                  <input name="company" type="text" className="hidden" tabIndex={-1} autoComplete="off" aria-hidden="true" />

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <SelectField label="Clinic Type" name="clinic_type" options={["dental", "family", "eye", "dermatology", "physio", "other"]} />
                    <SelectField label="Number of Locations" name="location_count" options={["1", "2–5", "6+"]} />
                  </div>

                  <CheckboxGroup
                    label="Biggest operational pain"
                    name="pain_points"
                    options={[
                      { value: "cancellations", label: "Cancellations" },
                      { value: "no-shows", label: "No-shows" },
                      { value: "missed-calls", label: "Missed calls" },
                      { value: "recall", label: "Recall gaps" },
                      { value: "website", label: "Website / online presence" },
                      { value: "staff-overload", label: "Staff overload" },
                    ]}
                  />

                  <CheckboxGroup
                    label="I'm interested in"
                    name="interest"
                    options={[
                      { value: "demo", label: "Product demo" },
                      { value: "audit", label: "Workflow audit" },
                      { value: "website", label: "New website" },
                      { value: "growth-system", label: "Full growth system" },
                    ]}
                  />

                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-semibold text-[--cr-text]" htmlFor="message">Message</label>
                    <textarea id="message" name="message" rows={3} className="cr-input resize-none" placeholder="Anything else we should know?" />
                  </div>

                  {state === "error" && <p className="text-red-600 text-sm">{errorMsg}</p>}

                  <button type="submit" disabled={state === "loading"} className="cr-btn cr-btn-primary disabled:opacity-60">
                    {state === "loading" ? "Submitting…" : modalCopy[intent].submit}
                  </button>
                  <p className="text-xs text-[--cr-muted]">No commitment required. 20-minute walkthrough.</p>
                </form>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function Field({ label, name, type = "text", required = false, helperText, error }: { label: string; name: string; type?: string; required?: boolean; helperText?: string; error?: string }) {
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={name} className="text-xs font-semibold text-[--cr-text]">{label}</label>
      <input id={name} name={name} type={type} required={required} aria-invalid={!!error} className={`cr-input ${error ? "border-red-500" : ""}`} />
      {error ? <p className="text-xs text-red-600">{error}</p> : helperText ? <p className="text-xs text-[--cr-muted]">{helperText}</p> : null}
    </div>
  );
}

function SelectField({ label, name, options }: { label: string; name: string; options: string[] }) {
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={name} className="text-xs font-semibold text-[--cr-text]">{label}</label>
      <select id={name} name={name} className="cr-input bg-white">
        <option value="">Select…</option>
        {options.map((o) => (
          <option key={o} value={o}>{o.charAt(0).toUpperCase() + o.slice(1)}</option>
        ))}
      </select>
    </div>
  );
}

function CheckboxGroup({ label, name, options }: { label: string; name: string; options: Array<{ value: string; label: string }> }) {
  return (
    <div className="flex flex-col gap-2">
      <span className="text-xs font-semibold text-[--cr-text]">{label}</span>
      <div className="flex flex-wrap gap-2">
        {options.map((o) => (
          <label key={o.value} className="flex items-center gap-2 text-sm text-[--cr-muted] cursor-pointer">
            <input type="checkbox" name={name} value={o.value} className="accent-[--cr-teal] rounded" />
            {o.label}
          </label>
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
cd /root/clinicrelay-landing
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Run all tests**

```bash
cd /root/clinicrelay-landing
npx vitest run
```

Expected: 6 tests pass.

- [ ] **Step 4: Commit**

```bash
cd /root/clinicrelay-landing
git add components/landing/demo-modal.tsx
git commit -m "feat(analytics): add PostHog funnel tracking (modal open, submit, succeed, fail)"
```

---

## Task 5: Content Audit

**Files:**
- Modify: `lib/content/clinicrelay-landing.ts`

- [ ] **Step 1: Apply the four copy fixes**

Open `lib/content/clinicrelay-landing.ts` and make these 4 targeted changes:

**Fix 1** — `useCases` dental entry, `copy` field (line ~189):
```ts
// Before:
copy: "Fill hygiene cancellations same-day. Automate recall for preventive appointments. Reduce no-shows for high-value procedures.",

// After:
copy: "Fill hygiene cancellations same-day. Surface recall opportunities for preventive appointments. Reduce no-shows for high-value procedures.",
```

**Fix 2** — `useCases` optometry entry, `copy` field (line ~203):
```ts
// Before:
copy: "Annual exam recall, contact lens follow-ups, and frame adjustment reminders — all automated.",

// After:
copy: "Annual exam recall, contact lens follow-ups, and frame adjustment reminders — surfaced for staff action.",
```

**Fix 3** — `faqItems` question 8, `answer` field (line ~325):
```ts
// Before:
answer: "Yes. The Growth System tier supports multi-location groups with a unified dashboard, per-location configuration, and consolidated reporting.",

// After:
answer: "Yes. The Pilot Expansion tier supports multi-location groups with a unified dashboard, per-location configuration, and consolidated reporting.",
```

**Fix 4** — `processSteps` step 4, `copy` field (line ~291):
```ts
// Before:
copy: "After the pilot, we review the numbers and expand to recall, new patient conversion, and growth services.",

// After:
copy: "After the pilot, we review the numbers and expand to recall, confirmation workflows, and front-desk coordination.",
```

- [ ] **Step 2: Run all tests — verify nothing broken**

```bash
cd /root/clinicrelay-landing
npx vitest run
```

Expected: 6 tests pass (content file has no test coverage; this confirms no regressions elsewhere).

- [ ] **Step 3: Verify TypeScript compiles**

```bash
cd /root/clinicrelay-landing
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 4: Commit**

```bash
cd /root/clinicrelay-landing
git add lib/content/clinicrelay-landing.ts
git commit -m "fix(content): correct recall automation claims and tier name mismatch"
```

---

## Post-Implementation Checklist

- [ ] Create KV store in Vercel dashboard (Storage → Create KV Store → link to `clinicrelay` project). Vercel auto-injects `KV_REST_API_URL` and `KV_REST_API_TOKEN` into the deployed environment.
- [ ] Add `NEXT_PUBLIC_POSTHOG_KEY` and `NEXT_PUBLIC_POSTHOG_HOST` to Vercel project env vars (Production + Preview + Development).
- [ ] Deploy: `vercel --prod`
- [ ] Verify rate limiting: submit the lead form 6 times in quick succession from the same IP — the 6th should return an error toast.
- [ ] Verify PostHog: open PostHog dashboard → Live Events → open the demo modal on the live site — `demo_modal_opened` should appear within seconds.
