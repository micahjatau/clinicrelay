# Animation System Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement the full ClinicRelay landing page animation system as specified in `docs/superpowers/specs/2026-05-07-animation-system-design.md`, bringing scroll-triggered sequences, a scroll-progress recovery rail, count-up dashboard metrics, hover micro-interactions, and per-section motion to all 15 landing sections.

**Architecture:** Two shared hooks (`useCountUp`, `useScrollProgress`) live in `components/landing/hooks/`. All per-section animation logic is local to each component file. `AnimatedSection` is unchanged. No global animation context.

**Tech Stack:** Framer Motion v12 (already installed), React 19, TypeScript, Vitest (node env — no DOM).

---

## File Map

| Action | Path | Responsibility |
|--------|------|----------------|
| Create | `components/landing/hooks/use-count-up.ts` | RAF count-up hook + testable pure fn |
| Create | `components/landing/hooks/use-scroll-progress.ts` | MotionValue scroll progress hook + threshold util |
| Create | `__tests__/use-count-up.test.ts` | Unit tests for count-up math |
| Create | `__tests__/use-scroll-progress.test.ts` | Unit tests for node activation thresholds |
| Modify | `components/landing/hero-bento.tsx` | Scroll-triggered 5-step sequence, remove interval |
| Modify | `components/landing/waitlist-section.tsx` | Add "use client", horizontal 6-node scroll-progress rail |
| Modify | `components/landing/dashboard-mockup.tsx` | Count-up metrics, toast notification, queue stagger |
| Modify | `components/landing/pre-visit-readiness.tsx` | whileHover card + icon micro-interactions |
| Modify | `components/landing/metrics-section.tsx` | Animated left border reveal per card on entry |
| Modify | `components/landing/problem-section.tsx` | Icon entry animation |
| Modify | `components/landing/product-workflow.tsx` | Add "use client", animated connecting line |
| Modify | `components/landing/feature-grid.tsx` | whileHover border + icon |
| Modify | `components/landing/growth-section.tsx` | Pill stagger on entry |
| Modify | `components/landing/web-services.tsx` | clip-path reveal on section entry |
| Modify | `components/landing/use-cases.tsx` | Convert vertical list to tabbed UI with AnimatePresence |
| Modify | `components/landing/trust-section.tsx` | Slower fade delay (minimal change) |
| Modify | `components/landing/pricing-section.tsx` | Add "use client", recommended plan pulse, card hover lift |
| Modify | `components/landing/process-section.tsx` | Add "use client", animated horizontal timeline line |
| Modify | `components/landing/faq-section.tsx` | Add "use client", JS progressive enhancement |
| Modify | `components/landing/final-cta.tsx` | 4-step mini workflow loop |

---

## Task 1: `useCountUp` hook

**Files:**
- Create: `components/landing/hooks/use-count-up.ts`
- Create: `__tests__/use-count-up.test.ts`

- [ ] **Step 1: Write the failing tests**

```ts
// __tests__/use-count-up.test.ts
import { describe, it, expect } from "vitest";
import { computeCountUpValue } from "@/components/landing/hooks/use-count-up";

describe("computeCountUpValue", () => {
  it("returns 0 at progress 0", () => {
    expect(computeCountUpValue(100, 0)).toBe(0);
  });
  it("returns target at progress 1", () => {
    expect(computeCountUpValue(100, 1)).toBe(100);
  });
  it("returns a value between 0 and target at progress 0.5", () => {
    const v = computeCountUpValue(100, 0.5);
    expect(v).toBeGreaterThan(0);
    expect(v).toBeLessThan(100);
  });
  it("rounds to nearest integer", () => {
    expect(Number.isInteger(computeCountUpValue(75, 0.6))).toBe(true);
  });
  it("clamps at target for progress > 1", () => {
    expect(computeCountUpValue(100, 1.5)).toBe(100);
  });
});
```

- [ ] **Step 2: Run tests — verify they fail**

```bash
cd /root/clinicrelay-landing && npx vitest run __tests__/use-count-up.test.ts
```

Expected: FAIL — `computeCountUpValue` not found.

- [ ] **Step 3: Implement the hook**

```ts
// components/landing/hooks/use-count-up.ts
"use client";
import { useState, useEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";

/** Pure easing + value function — exported for testing. */
export function computeCountUpValue(target: number, progress: number): number {
  const clamped = Math.min(Math.max(progress, 0), 1);
  const eased = 1 - Math.pow(1 - clamped, 3); // ease-out cubic
  return Math.round(eased * target);
}

/**
 * Animates a counter from 0 to `target` when `inView` becomes true.
 * Respects prefers-reduced-motion — returns `target` immediately if set.
 */
export function useCountUp(target: number, inView: boolean, duration = 1400): number {
  const [value, setValue] = useState(0);
  const reducedMotion = useReducedMotion();
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (!inView) return;
    if (reducedMotion) {
      setValue(target);
      return;
    }
    const start = performance.now();
    function tick(now: number) {
      const elapsed = now - start;
      setValue(computeCountUpValue(target, elapsed / duration));
      if (elapsed < duration) {
        rafRef.current = requestAnimationFrame(tick);
      }
    }
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [inView, target, duration, reducedMotion]);

  return value;
}
```

- [ ] **Step 4: Run tests — verify they pass**

```bash
cd /root/clinicrelay-landing && npx vitest run __tests__/use-count-up.test.ts
```

Expected: 5 passing.

- [ ] **Step 5: Commit**

```bash
cd /root/clinicrelay-landing && git add components/landing/hooks/use-count-up.ts __tests__/use-count-up.test.ts && git commit -m "feat(animation): add useCountUp hook with pure math utilities"
```

---

## Task 2: `useScrollProgress` hook

**Files:**
- Create: `components/landing/hooks/use-scroll-progress.ts`
- Create: `__tests__/use-scroll-progress.test.ts`

- [ ] **Step 1: Write the failing tests**

```ts
// __tests__/use-scroll-progress.test.ts
import { describe, it, expect } from "vitest";
import { getActiveNodeCount, WAITLIST_THRESHOLDS } from "@/components/landing/hooks/use-scroll-progress";

describe("getActiveNodeCount", () => {
  it("activates 1 node at progress 0", () => {
    expect(getActiveNodeCount(0, WAITLIST_THRESHOLDS)).toBe(1);
  });
  it("activates all 6 nodes at progress 1", () => {
    expect(getActiveNodeCount(1, WAITLIST_THRESHOLDS)).toBe(6);
  });
  it("activates 3 nodes at progress 0.4", () => {
    expect(getActiveNodeCount(0.4, WAITLIST_THRESHOLDS)).toBe(3);
  });
  it("activates 4 nodes at progress 0.55", () => {
    expect(getActiveNodeCount(0.55, WAITLIST_THRESHOLDS)).toBe(4);
  });
  it("WAITLIST_THRESHOLDS has 6 entries", () => {
    expect(WAITLIST_THRESHOLDS).toHaveLength(6);
  });
});
```

- [ ] **Step 2: Run tests — verify they fail**

```bash
cd /root/clinicrelay-landing && npx vitest run __tests__/use-scroll-progress.test.ts
```

Expected: FAIL — `getActiveNodeCount` not found.

- [ ] **Step 3: Implement the hook**

```ts
// components/landing/hooks/use-scroll-progress.ts
"use client";
import { useRef } from "react";
import { useScroll, useReducedMotion, motionValue, MotionValue } from "framer-motion";

/** Scroll progress thresholds for the 6-node waitlist recovery rail. */
export const WAITLIST_THRESHOLDS = [0, 0.16, 0.33, 0.50, 0.66, 0.83] as const;

/**
 * Returns how many nodes should be active given scroll progress.
 * Exported for unit testing.
 */
export function getActiveNodeCount(progress: number, thresholds: readonly number[]): number {
  return thresholds.filter((t) => progress >= t).length;
}

/**
 * Returns a MotionValue<number> in range 0–1 representing scroll progress
 * through the target element. Returns a static MotionValue of 1 when
 * prefers-reduced-motion is set.
 */
export function useScrollProgress(ref: React.RefObject<HTMLElement | null>): MotionValue<number> {
  const reducedMotion = useReducedMotion();
  const staticFull = useRef(motionValue(1));
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  return reducedMotion ? staticFull.current : scrollYProgress;
}
```

- [ ] **Step 4: Run tests — verify they pass**

```bash
cd /root/clinicrelay-landing && npx vitest run __tests__/use-scroll-progress.test.ts
```

Expected: 5 passing.

- [ ] **Step 5: Run full suite — verify no regressions**

```bash
cd /root/clinicrelay-landing && npx vitest run
```

Expected: all tests passing.

- [ ] **Step 6: Commit**

```bash
cd /root/clinicrelay-landing && git add components/landing/hooks/use-scroll-progress.ts __tests__/use-scroll-progress.test.ts && git commit -m "feat(animation): add useScrollProgress hook with node activation util"
```

---

## Task 3: Hero bento — scroll-triggered 5-step sequence

**Files:**
- Modify: `components/landing/hero-bento.tsx`

The current hero cycles cards on a 2-second interval. This task replaces that with a scroll-triggered sequence that plays once: cards activate one by one at 600ms intervals, the final card glows green.

- [ ] **Step 1: Replace hero-bento.tsx**

```tsx
// components/landing/hero-bento.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import type { HeroData } from "@/lib/content/clinicrelay-landing";

type Props = { cards: HeroData["bentoCards"] };

export function HeroBento({ cards }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px" });
  const shouldReduceMotion = useReducedMotion();
  const [activeIndex, setActiveIndex] = useState(-1);

  useEffect(() => {
    if (!inView) return;
    if (shouldReduceMotion) {
      setActiveIndex(cards.length - 1);
      return;
    }
    const timeouts = cards.map((_, i) =>
      setTimeout(() => setActiveIndex(i), i * 600)
    );
    return () => timeouts.forEach(clearTimeout);
  }, [inView, shouldReduceMotion, cards.length]);

  const isLast = (i: number) => i === cards.length - 1 && activeIndex === cards.length - 1;

  return (
    <div ref={ref} className="flex flex-col gap-3 pt-8 md:pt-0">
      {cards.map((card, i) => {
        const isActive = activeIndex >= i;
        const isCurrent = activeIndex === i;
        const last = isLast(i);
        return (
          <motion.div
            key={card.step}
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ type: "spring", stiffness: 80, damping: 20, delay: i * 0.12 }}
          >
            <motion.div
              className="rounded-2xl border border-[--cr-border] bg-white p-4 flex items-center gap-4"
              animate={{
                boxShadow: last
                  ? "0 8px 24px -4px rgba(22,163,74,0.22)"
                  : isActive
                  ? "0 8px 24px -4px rgba(13,148,136,0.18)"
                  : "var(--cr-shadow)",
                borderColor: last
                  ? "var(--cr-success)"
                  : isActive
                  ? "var(--cr-teal)"
                  : "var(--cr-border)",
              }}
              transition={{ duration: 0.3 }}
            >
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 transition-colors duration-300"
                style={{
                  background: last
                    ? "var(--cr-success)"
                    : isActive
                    ? "var(--cr-teal)"
                    : "var(--cr-surface-2)",
                  color: isActive ? "white" : "var(--cr-muted)",
                }}
              >
                {card.step}
              </div>
              <div>
                <p className="text-sm font-semibold text-[--cr-text]">{card.label}</p>
                <p className="text-xs text-[--cr-muted]">{card.detail}</p>
              </div>
              {isCurrent && !last && (
                <motion.div
                  className="ml-auto w-2 h-2 rounded-full bg-[--cr-teal]"
                  animate={{ scale: [1, 1.4, 1] }}
                  transition={{ repeat: Infinity, duration: 1.2 }}
                />
              )}
              {last && (
                <motion.div
                  className="ml-auto w-2 h-2 rounded-full bg-[--cr-success]"
                  initial={{ scale: 0 }}
                  animate={{ scale: [0, 1.6, 1] }}
                  transition={{ duration: 0.4 }}
                />
              )}
            </motion.div>
          </motion.div>
        );
      })}
    </div>
  );
}
```

- [ ] **Step 2: Build — verify no TypeScript errors**

```bash
cd /root/clinicrelay-landing && npm run build 2>&1 | tail -15
```

Expected: clean build output.

- [ ] **Step 3: Commit**

```bash
cd /root/clinicrelay-landing && git add components/landing/hero-bento.tsx && git commit -m "feat(animation): upgrade hero bento to scroll-triggered 5-step recovery sequence"
```

---

## Task 4: Waitlist section — horizontal scroll-progress rail

**Files:**
- Modify: `components/landing/waitlist-section.tsx`

Adds a 6-node horizontal rail above the existing content. The rail line fills left-to-right in real time as you scroll through the section. The component becomes a client component.

- [ ] **Step 1: Replace waitlist-section.tsx**

```tsx
// components/landing/waitlist-section.tsx
"use client";

import { useRef, useState } from "react";
import { motion, useMotionValueEvent } from "framer-motion";
import { CalendarBlank, ListChecks, ChatCircle, ArrowBendUpLeft, CheckCircle } from "@phosphor-icons/react/dist/ssr";
import { AnimatedSection } from "./animated-section";
import { recoverySteps } from "@/lib/content/clinicrelay-landing";
import { WaitlistCtaButton } from "./waitlist-cta-button";
import { useScrollProgress, WAITLIST_THRESHOLDS, getActiveNodeCount } from "./hooks/use-scroll-progress";

const iconMap: Record<string, React.ElementType> = {
  CalendarBlank, ListChecks, ChatCircle, ArrowBendUpLeft, CheckCircle,
};

const RAIL_NODES = ["Cancellation", "Match", "Offer", "Reply", "Confirm", "Refill"] as const;

export function WaitlistSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const progress = useScrollProgress(sectionRef);
  const [activeCount, setActiveCount] = useState(0);

  useMotionValueEvent(progress, "change", (v) => {
    setActiveCount(getActiveNodeCount(v, WAITLIST_THRESHOLDS));
  });

  return (
    <section ref={sectionRef} id="waitlist" className="py-24 md:py-32 bg-[--cr-bg]">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10">

        {/* Scroll-progress rail */}
        <div className="mb-14 relative">
          <div className="relative flex items-center justify-between">
            {/* Static track */}
            <div className="absolute inset-x-0 top-[7px] h-px bg-[--cr-border]" />
            {/* Animated fill */}
            <motion.div
              className="absolute left-0 top-[7px] h-px bg-[--cr-teal] origin-left"
              style={{ scaleX: progress }}
            />
            {RAIL_NODES.map((node, i) => (
              <div key={node} className="relative flex flex-col items-center gap-2 z-10">
                <motion.div
                  className="w-3.5 h-3.5 rounded-full border-2"
                  animate={{
                    backgroundColor: activeCount > i ? "var(--cr-teal)" : "var(--cr-surface-2)",
                    borderColor: activeCount > i ? "var(--cr-teal)" : "var(--cr-border)",
                    scale: activeCount > i ? 1 : 0.85,
                  }}
                  transition={{ duration: 0.2 }}
                />
                <motion.p
                  className="text-xs font-semibold text-[--cr-muted] hidden sm:block"
                  animate={{ opacity: activeCount > i ? 1 : 0.35 }}
                  transition={{ duration: 0.2 }}
                >
                  {node}
                </motion.p>
              </div>
            ))}
          </div>
        </div>

        <AnimatedSection className="mb-14">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[--cr-teal] mb-3">Waitlist Recovery</p>
          <h2 className="text-3xl md:text-4xl tracking-tight font-semibold text-[--cr-text] max-w-[28ch]">
            Every cancellation is a recovery opportunity.
          </h2>
        </AnimatedSection>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-start">
          <div className="flex flex-col gap-0 relative">
            <div className="absolute left-[19px] top-8 bottom-8 w-px bg-[--cr-border]" />
            {recoverySteps.map((step, i) => {
              const Icon = iconMap[step.icon];
              return (
                <AnimatedSection key={step.number} delay={i * 0.1} className="flex gap-6 pb-10 relative">
                  <div className="w-10 h-10 rounded-full bg-[--cr-teal-light] border-2 border-[--cr-teal] flex items-center justify-center shrink-0 z-10">
                    {Icon && <Icon size={18} weight="duotone" className="text-[--cr-teal]" />}
                  </div>
                  <div className="pt-1">
                    <p className="text-xs font-semibold text-[--cr-teal] mb-1">{step.number}</p>
                    <h3 className="text-xl font-semibold text-[--cr-text] tracking-tight mb-1">{step.title}</h3>
                    <p className="text-[--cr-muted] text-base leading-relaxed">{step.copy}</p>
                  </div>
                </AnimatedSection>
              );
            })}
          </div>
          <AnimatedSection delay={0.2}>
            <div className="rounded-[2rem] border border-[--cr-border] bg-white p-8" style={{ boxShadow: "var(--cr-shadow)" }}>
              <p className="text-xs font-semibold text-[--cr-muted] mb-4 uppercase tracking-widest">Recovery Panel</p>
              <div className="rounded-xl bg-[--cr-surface-2] border border-[--cr-border] p-4 mb-4">
                <p className="text-sm font-semibold text-[--cr-text]">Open Slot — Dr. Patel</p>
                <p className="text-xs text-[--cr-muted]">Thursday 2:30 PM · Preventive Care · 45 min</p>
              </div>
              {[
                { name: "Rangi T.", match: "High — due for recall, lives nearby" },
                { name: "Soha M.", match: "Medium — flexible schedule" },
                { name: "Dev K.", match: "Medium — cancelled last month" },
              ].map((c, i) => (
                <div key={i} className="flex items-center justify-between py-3 border-t border-[--cr-border]">
                  <div>
                    <p className="text-sm font-semibold text-[--cr-text]">{c.name}</p>
                    <p className="text-xs text-[--cr-muted]">{c.match}</p>
                  </div>
                  <span className="text-xs font-semibold px-3 py-1 rounded-full bg-[--cr-teal-light] text-[--cr-teal]">SMS Sent</span>
                </div>
              ))}
              <div className="mt-4 pt-4 border-t border-[--cr-border]">
                <p className="text-xs text-[--cr-muted]">Rangi T. replied: <span className="text-[--cr-teal] font-semibold">&quot;Yes, I can make it!&quot;</span></p>
                <p className="text-xs text-[--cr-muted] mt-1">Slot confirmed — 4 minutes after cancellation.</p>
              </div>
              <WaitlistCtaButton />
            </div>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Build — verify no TypeScript errors**

```bash
cd /root/clinicrelay-landing && npm run build 2>&1 | tail -15
```

Expected: clean build.

- [ ] **Step 3: Commit**

```bash
cd /root/clinicrelay-landing && git add components/landing/waitlist-section.tsx && git commit -m "feat(animation): add scroll-progress rail to waitlist section"
```

---

## Task 5: Dashboard mockup — count-up metrics + toast

**Files:**
- Modify: `components/landing/dashboard-mockup.tsx`

The 4 metric cards (values: 4, 2, 3, 75%) animate from 0 on section entry. A "new reply" toast appears once after 1.2s then fades at 3.7s.

- [ ] **Step 1: Modify dashboard-mockup.tsx**

Replace the `Metric` component and add toast logic. The section header ref triggers the count-up for all four metrics simultaneously.

```tsx
// components/landing/dashboard-mockup.tsx
"use client";

import { memo, useRef, useState } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { dashboardMockData } from "@/lib/content/clinicrelay-landing";
import { useCountUp } from "./hooks/use-count-up";

type Row = {
  slot: string;
  provider: string;
  patient: string;
  outreach: string;
  reply: string;
  task: string;
  status: "Cancelled" | "Pending" | "Booked" | "In Progress";
};

const recoveryRows: Row[] = [
  {
    slot: "Today, 10:30 AM · Dr. Patel",
    provider: "New Patient Consult",
    patient: "Jessica Smith",
    outreach: "SMS sent 10:32 AM",
    reply: "Yes, I can take it.",
    task: "Confirm & book",
    status: "Pending",
  },
  {
    slot: "Today, 1:00 PM · Dr. Lee",
    provider: "Return Visit",
    patient: "Robert Martinez",
    outreach: "SMS sent 12:15 PM",
    reply: "Yes, that works.",
    task: "Completed by Sam",
    status: "Booked",
  },
  {
    slot: "Today, 3:30 PM · Dr. Patel",
    provider: "New Patient Consult",
    patient: "Alyssa Lin",
    outreach: "SMS sent 3:31 PM",
    reply: "No reply",
    task: "First reminder due 3:46 PM",
    status: "In Progress",
  },
];

function statusClass(status: Row["status"]) {
  if (status === "Booked") return "cr-badge cr-badge-success";
  if (status === "Pending") return "cr-badge cr-badge-warning";
  if (status === "Cancelled") return "cr-badge cr-badge-danger";
  return "cr-badge cr-badge-teal";
}

export const DashboardMockup = memo(function DashboardMockup() {
  const [active, setActive] = useState("Waitlist Recovery");
  const headerRef = useRef<HTMLDivElement>(null);
  const inView = useInView(headerRef, { once: true, margin: "-15% 0px" });
  const [showToast, setShowToast] = useState(false);

  // Trigger toast once when section enters view
  const toastFiredRef = useRef(false);
  if (inView && !toastFiredRef.current) {
    toastFiredRef.current = true;
    setTimeout(() => setShowToast(true), 1200);
    setTimeout(() => setShowToast(false), 3700);
  }

  return (
    <section className="py-24 md:py-32 bg-white">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
        <div ref={headerRef} className="mb-14 flex items-center justify-between gap-4 flex-wrap">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[--cr-teal] mb-3">Dashboard</p>
            <h2 className="text-3xl md:text-4xl tracking-tight font-semibold text-[--cr-text]">Proof of recovery in one view.</h2>
          </div>
          <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-[--cr-muted] border border-[--cr-border]">Demo workflow data</span>
        </div>

        <div className="rounded-[2rem] border border-[--cr-border] bg-[--cr-surface-2] overflow-hidden relative" style={{ boxShadow: "var(--cr-shadow)" }}>
          {/* Toast */}
          <AnimatePresence>
            {showToast && (
              <motion.div
                initial={{ opacity: 0, y: -12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.25 }}
                className="absolute top-4 right-4 z-20 rounded-xl border border-[--cr-teal] bg-white px-4 py-2.5 text-xs font-semibold text-[--cr-teal] shadow-md"
              >
                New reply received — Alyssa Lin
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex">
            <aside className="hidden md:flex flex-col w-56 shrink-0 border-r border-[--cr-border] p-4 gap-1 bg-white">
              {dashboardMockData.navItems.map((item) => (
                <button
                  key={item}
                  onClick={() => setActive(item)}
                  className={`text-left text-sm px-3 py-2 rounded-xl transition-colors ${
                    active === item ? "bg-[--cr-teal] text-white font-semibold" : "text-[--cr-muted] hover:bg-[--cr-teal-light] hover:text-[--cr-teal]"
                  }`}
                >
                  {item}
                </button>
              ))}
            </aside>

            <main className="flex-1 p-6 bg-white">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <Metric label="Cancelled Today" rawValue={4} suffix="" tone="danger" inView={inView} />
                <Metric label="Recovery in Progress" rawValue={2} suffix="" tone="warning" inView={inView} />
                <Metric label="Recovered Today" rawValue={3} suffix="" tone="success" inView={inView} />
                <Metric label="Recovery Rate" rawValue={75} suffix="%" tone="teal" inView={inView} />
              </div>

              <div className="md:hidden space-y-3">
                {recoveryRows.map((row, i) => (
                  <motion.div
                    key={`${row.slot}-${row.patient}`}
                    initial={{ opacity: 0, y: 8 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ delay: i * 0.1, duration: 0.3 }}
                    className="rounded-xl border border-[--cr-border] bg-[--cr-slate-light] p-4"
                  >
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div>
                        <p className="font-semibold text-[--cr-text] text-sm">{row.slot}</p>
                        <p className="text-xs text-[--cr-muted]">Cancelled appointment slot · {row.provider}</p>
                      </div>
                      <span className={statusClass(row.status)}>{row.status === "Booked" ? "Slot refilled" : row.status}</span>
                    </div>
                    <div className="space-y-2 text-xs">
                      <p><span className="font-semibold text-[--cr-text]">Match:</span> <span className="text-[--cr-muted]">{row.patient}</span></p>
                      <p><span className="font-semibold text-[--cr-text]">Outreach:</span> <span className="text-[--cr-muted]">{row.outreach}</span></p>
                      <p><span className="font-semibold text-[--cr-text]">Reply:</span> <span className="text-[--cr-muted]">{row.reply}</span></p>
                      <p><span className="font-semibold text-[--cr-text]">Staff task:</span> <span className="text-[--cr-muted]">{row.task}</span></p>
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="hidden md:block overflow-x-auto">
                <table className="w-full min-w-[860px] text-sm">
                  <thead>
                    <tr className="text-left text-xs text-[--cr-muted] border-b border-[--cr-border]">
                      <th className="py-3 pr-3">Slot & Reason</th>
                      <th className="py-3 pr-3">Waitlist Match</th>
                      <th className="py-3 pr-3">Outreach</th>
                      <th className="py-3 pr-3">Patient Reply</th>
                      <th className="py-3 pr-3">Staff Task</th>
                      <th className="py-3">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recoveryRows.map((row, i) => (
                      <motion.tr
                        key={`${row.slot}-${row.patient}`}
                        initial={{ opacity: 0, y: 6 }}
                        animate={inView ? { opacity: 1, y: 0 } : {}}
                        transition={{ delay: 0.2 + i * 0.1, duration: 0.3 }}
                        className="border-b border-[--cr-border] last:border-0 align-top"
                      >
                        <td className="py-3 pr-3">
                          <p className="font-semibold text-[--cr-text]">{row.slot}</p>
                          <p className="text-xs text-[--cr-muted]">Cancelled appointment slot · {row.provider}</p>
                        </td>
                        <td className="py-3 pr-3">
                          <p className="font-semibold text-[--cr-text]">{row.patient}</p>
                          <p className="text-xs text-[--cr-muted]">Eligible waitlist patient</p>
                        </td>
                        <td className="py-3 pr-3">
                          <p className="text-[--cr-text]">{row.outreach}</p>
                          <p className="text-xs text-[--cr-muted]">Recovery offer sent</p>
                        </td>
                        <td className="py-3 pr-3">
                          <p className="text-[--cr-text]">{row.reply}</p>
                          <p className="text-xs text-[--cr-muted]">Patient reply captured</p>
                        </td>
                        <td className="py-3 pr-3">
                          <p className="text-[--cr-text]">{row.task}</p>
                          <p className="text-xs text-[--cr-muted]">Staff confirmation task</p>
                        </td>
                        <td className="py-3">
                          <span className={statusClass(row.status)}>{row.status === "Booked" ? "Slot refilled" : row.status}</span>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </main>
          </div>
        </div>
      </div>
    </section>
  );
});

function Metric({
  label,
  rawValue,
  suffix,
  tone,
  inView,
}: {
  label: string;
  rawValue: number;
  suffix: string;
  tone: "danger" | "warning" | "success" | "teal";
  inView: boolean;
}) {
  const count = useCountUp(rawValue, inView);
  const toneClass = {
    danger: "text-[--cr-danger]",
    warning: "text-[--cr-warning]",
    success: "text-[--cr-success]",
    teal: "text-[--cr-teal]",
  }[tone];

  return (
    <div className="rounded-2xl border border-[--cr-border] bg-[--cr-slate-light] p-4">
      <p className="text-xs font-semibold text-[--cr-muted] mb-1">{label}</p>
      <p className={`text-2xl font-semibold tracking-tight ${toneClass}`}>
        {count}{suffix}
      </p>
    </div>
  );
}
```

- [ ] **Step 2: Build — verify no TypeScript errors**

```bash
cd /root/clinicrelay-landing && npm run build 2>&1 | tail -15
```

Expected: clean build.

- [ ] **Step 3: Commit**

```bash
cd /root/clinicrelay-landing && git add components/landing/dashboard-mockup.tsx && git commit -m "feat(animation): add count-up metrics, toast, and row stagger to dashboard mockup"
```

---

## Task 6: Pre-Visit Readiness — hover micro-interactions

**Files:**
- Modify: `components/landing/pre-visit-readiness.tsx`

Read the current file first, then wrap each feature card div with `motion.div` and add `whileHover`.

- [ ] **Step 1: Read the current file**

```bash
cat /root/clinicrelay-landing/components/landing/pre-visit-readiness.tsx
```

- [ ] **Step 2: Wrap feature cards with motion.div whileHover**

Locate the feature card div (it should be the inner div inside each `AnimatedSection` mapping). Wrap it:

```tsx
// Add to imports:
import { motion } from "framer-motion";

// Wrap each feature card div with:
<motion.div
  className="rounded-2xl border border-[--cr-border] bg-[--cr-slate-light] p-6"
  whileHover={{
    y: -2,
    borderColor: "var(--cr-teal)",
    boxShadow: "0 8px 24px -4px rgba(13,148,136,0.12)",
  }}
  transition={{ duration: 0.2 }}
>
  {/* existing card content — icon, title, copy unchanged */}
</motion.div>
```

The icon element inside the card also gets a subtle translate:

```tsx
// Wrap the icon component with:
<motion.div whileHover={{ y: -3 }} transition={{ duration: 0.2 }}>
  {Icon && <Icon size={24} weight="duotone" className="text-[--cr-teal]" />}
</motion.div>
```

- [ ] **Step 3: Build — verify no TypeScript errors**

```bash
cd /root/clinicrelay-landing && npm run build 2>&1 | tail -15
```

Expected: clean build.

- [ ] **Step 4: Commit**

```bash
cd /root/clinicrelay-landing && git add components/landing/pre-visit-readiness.tsx && git commit -m "feat(animation): add hover micro-interactions to pre-visit readiness cards"
```

---

## Task 7: Metrics section — entry border reveal

**Files:**
- Modify: `components/landing/metrics-section.tsx`

Note: `metricCards` values are qualitative strings ("Track", "Measure") — not numbers. No count-up is used here. Instead, each card gets an animated left border that grows from 0 to full height on entry, reinforcing the scroll entrance.

- [ ] **Step 1: Modify metrics-section.tsx**

```tsx
// components/landing/metrics-section.tsx
"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { AnimatedSection } from "./animated-section";
import { metricCards } from "@/lib/content/clinicrelay-landing";

export function MetricsSection() {
  const headerRef = useRef<HTMLDivElement>(null);
  const headerInView = useInView(headerRef, { once: true, margin: "-15% 0px" });

  return (
    <section className="py-28 md:py-36 bg-[--cr-bg]">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
        <AnimatedSection className="mb-14">
          <div ref={headerRef}>
            <p className="text-4xl md:text-6xl font-semibold tracking-tighter text-[--cr-text] max-w-[18ch]">
              &quot;You cannot improve what your front desk cannot see.&quot;
            </p>
          </div>
        </AnimatedSection>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-10">
          {metricCards.map((m, i) => (
            <AnimatedSection key={m.label} delay={i * 0.08} className="pt-6 relative overflow-hidden">
              {/* Animated top border */}
              <motion.div
                className="absolute top-0 left-0 h-px bg-[--cr-teal] origin-left"
                initial={{ scaleX: 0 }}
                animate={headerInView ? { scaleX: 1 } : { scaleX: 0 }}
                transition={{ delay: i * 0.08 + 0.1, duration: 0.5, ease: "easeOut" }}
                style={{ width: "100%" }}
              />
              {/* Static full border underneath */}
              <div className="absolute top-0 left-0 right-0 h-px bg-[--cr-border]" />
              <p className="text-4xl font-semibold tracking-tighter text-[--cr-teal] mb-2">{m.value}</p>
              <p className="text-base text-[--cr-muted] leading-relaxed">{m.label}</p>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Build — verify no TypeScript errors**

```bash
cd /root/clinicrelay-landing && npm run build 2>&1 | tail -15
```

Expected: clean build.

- [ ] **Step 3: Commit**

```bash
cd /root/clinicrelay-landing && git add components/landing/metrics-section.tsx && git commit -m "feat(animation): add animated teal border reveal to metrics section cards"
```

---

## Task 8: Problem section — icon entry animation

**Files:**
- Modify: `components/landing/problem-section.tsx`

Each pain card icon gets an independent `y: 4→0, opacity: 0→1` animation triggered by its card entering view.

- [ ] **Step 1: Modify problem-section.tsx**

```tsx
// components/landing/problem-section.tsx
import { CalendarX, Phone, ClockClockwise, ChartLineDown, ShieldWarning, ArrowsSplit } from "@phosphor-icons/react/dist/ssr";
import { AnimatedSection } from "./animated-section";
import { painCards } from "@/lib/content/clinicrelay-landing";
import { motion } from "framer-motion";

const iconMap: Record<string, React.ElementType> = {
  CalendarX, Phone, ClockClockwise, ChartLineDown, ShieldWarning, ArrowsSplit,
};

export function ProblemSection() {
  return (
    <section id="product" className="py-28 md:py-36 bg-white">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
        <AnimatedSection className="mb-14">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[--cr-teal] mb-3">The Problem</p>
          <h2 className="text-3xl md:text-5xl tracking-tighter font-semibold text-[--cr-text] max-w-[18ch]">
            Your clinic is not just losing time. It is leaking capacity.
          </h2>
        </AnimatedSection>
        <div className="divide-y divide-[--cr-border] border-y border-[--cr-border]">
          {painCards.map((card, i) => {
            const Icon = iconMap[card.icon];
            return (
              <AnimatedSection key={card.title} delay={i * 0.08} className="py-8 grid grid-cols-1 md:grid-cols-[32px_1fr] gap-5 md:gap-6">
                <div className="pt-1">
                  {Icon && (
                    <motion.div
                      initial={{ opacity: 0, y: 4 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: "-20% 0px" }}
                      transition={{ duration: 0.35, delay: i * 0.08 }}
                    >
                      <Icon size={24} weight="duotone" className="text-[--cr-teal]" />
                    </motion.div>
                  )}
                </div>
                <div>
                  <h3 className="text-xl tracking-tight font-semibold text-[--cr-text] mb-2">{card.title}</h3>
                  <p className="text-base leading-relaxed text-[--cr-muted] max-w-[70ch]">{card.copy}</p>
                </div>
              </AnimatedSection>
            );
          })}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Build and lint**

```bash
cd /root/clinicrelay-landing && npm run lint && npm run build 2>&1 | tail -10
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
cd /root/clinicrelay-landing && git add components/landing/problem-section.tsx && git commit -m "feat(animation): add icon entry animation to problem section pain cards"
```

---

## Task 9: ProductWorkflow — animated connecting line

**Files:**
- Modify: `components/landing/product-workflow.tsx`

On desktop (`lg:grid-cols-5`), a horizontal line connects the 5 steps. It animates from `scaleX: 0` to `1` when the section enters view.

- [ ] **Step 1: Modify product-workflow.tsx**

```tsx
// components/landing/product-workflow.tsx
"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Funnel, CalendarCheck, BellRinging, ArrowsClockwise, ChartBar } from "@phosphor-icons/react/dist/ssr";
import { AnimatedSection } from "./animated-section";
import { workflowSteps } from "@/lib/content/clinicrelay-landing";

const iconMap: Record<string, React.ElementType> = {
  Funnel, CalendarCheck, BellRinging, ArrowsClockwise, ChartBar,
};

export function ProductWorkflow() {
  const lineRef = useRef<HTMLDivElement>(null);
  const lineInView = useInView(lineRef, { once: true, margin: "-20% 0px" });

  return (
    <section className="py-24 md:py-32 bg-white">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
        <AnimatedSection className="mb-14">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[--cr-teal] mb-3">How It Works</p>
          <h2 className="text-3xl md:text-4xl tracking-tight font-semibold text-[--cr-text]">
            Five steps from intake to insight.
          </h2>
        </AnimatedSection>
        <div ref={lineRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 relative">
          {/* Animated connecting line — desktop only */}
          <div className="hidden lg:block absolute top-5 left-[10%] right-[10%] h-px bg-[--cr-border]" />
          <motion.div
            className="hidden lg:block absolute top-5 left-[10%] right-[10%] h-px bg-[--cr-teal] origin-left"
            initial={{ scaleX: 0 }}
            animate={lineInView ? { scaleX: 1 } : { scaleX: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
          />
          {workflowSteps.map((step, i) => {
            const Icon = iconMap[step.icon];
            return (
              <AnimatedSection key={step.number} delay={i * 0.08}>
                <div className="flex flex-col gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[--cr-teal-light] flex items-center justify-center relative z-10">
                    {Icon && <Icon size={20} weight="duotone" className="text-[--cr-teal]" />}
                  </div>
                  <p className="text-2xl font-semibold text-[--cr-text] tracking-tighter">{step.number}</p>
                  <h3 className="text-xl font-semibold text-[--cr-text] tracking-tight">{step.title}</h3>
                  <p className="text-sm text-[--cr-muted] leading-relaxed">{step.copy}</p>
                </div>
              </AnimatedSection>
            );
          })}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Build — verify no TypeScript errors**

```bash
cd /root/clinicrelay-landing && npm run build 2>&1 | tail -10
```

Expected: clean build.

- [ ] **Step 3: Commit**

```bash
cd /root/clinicrelay-landing && git add components/landing/product-workflow.tsx && git commit -m "feat(animation): add animated connecting line to product workflow steps"
```

---

## Task 10: FeatureGrid — card hover interactions

**Files:**
- Modify: `components/landing/feature-grid.tsx`

Each feature card gets `whileHover`: border → teal, icon y: -3px.

- [ ] **Step 1: Read the current file**

```bash
cat /root/clinicrelay-landing/components/landing/feature-grid.tsx
```

- [ ] **Step 2: Wrap feature card divs with motion.div**

Import `motion` from `framer-motion`. Find the innermost feature card `div` in the `PillarCard` sub-component (or wherever individual cards are rendered). Wrap each card:

```tsx
// Add to imports:
import { motion } from "framer-motion";

// Wrap each feature card div:
<motion.div
  className="rounded-2xl border border-[--cr-border] bg-[--cr-surface-2] p-5"
  whileHover={{
    borderColor: "var(--cr-teal)",
    y: -2,
    boxShadow: "0 4px 16px -4px rgba(13,148,136,0.10)",
  }}
  transition={{ duration: 0.18 }}
>
  {/* icon wrapper */}
  <motion.div whileHover={{ y: -3 }} transition={{ duration: 0.18 }}>
    {Icon && <Icon size={20} weight="duotone" className="text-[--cr-teal]" />}
  </motion.div>
  {/* title and copy unchanged */}
</motion.div>
```

The `whileHover` on the icon is nested inside the card — the card's `whileHover` triggers the outer animation, and the icon responds to its own `whileHover`.

- [ ] **Step 3: Build — verify no TypeScript errors**

```bash
cd /root/clinicrelay-landing && npm run build 2>&1 | tail -10
```

Expected: clean build.

- [ ] **Step 4: Commit**

```bash
cd /root/clinicrelay-landing && git add components/landing/feature-grid.tsx && git commit -m "feat(animation): add hover micro-interactions to feature grid cards"
```

---

## Task 11: GrowthSection — pill stagger on entry

**Files:**
- Modify: `components/landing/growth-section.tsx`

Each pillar card's pill badges stagger in individually after the card enters view.

- [ ] **Step 1: Modify growth-section.tsx**

```tsx
// components/landing/growth-section.tsx
"use client";

import { motion } from "framer-motion";
import { AnimatedSection } from "./animated-section";
import { growthPillars } from "@/lib/content/clinicrelay-landing";

export function GrowthSection() {
  return (
    <section id="growth" className="py-28 md:py-36 bg-white">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
        <AnimatedSection className="mb-14">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[--cr-teal] mb-3">Growth</p>
          <h2 className="text-3xl md:text-5xl tracking-tighter font-semibold text-[--cr-text] max-w-[18ch]">
            Four ways clinics grow with ClinicRelay.
          </h2>
        </AnimatedSection>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-10">
          {growthPillars.map((pillar, i) => (
            <AnimatedSection key={pillar.title} delay={i * 0.1} className="border-t border-[--cr-border] pt-6">
              <h3 className="text-xl font-semibold text-[--cr-text] tracking-tight mb-2">{pillar.title}</h3>
              <p className="text-base text-[--cr-muted] leading-relaxed mb-5">{pillar.copy}</p>
              <div className="flex flex-wrap gap-2">
                {pillar.pills.map((pill, j) => (
                  <motion.span
                    key={pill}
                    initial={{ opacity: 0, y: 6 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-20% 0px" }}
                    transition={{ delay: i * 0.1 + j * 0.06, duration: 0.25 }}
                    className="text-xs font-semibold px-3 py-1.5 rounded-full bg-[--cr-teal-light] text-[--cr-teal]"
                  >
                    {pill}
                  </motion.span>
                ))}
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Build — verify no TypeScript errors**

```bash
cd /root/clinicrelay-landing && npm run build 2>&1 | tail -10
```

Expected: clean build.

- [ ] **Step 3: Commit**

```bash
cd /root/clinicrelay-landing && git add components/landing/growth-section.tsx && git commit -m "feat(animation): add pill stagger entrance to growth section cards"
```

---

## Task 12: WebServices — clip-path reveal

**Files:**
- Modify: `components/landing/web-services.tsx`

The primary service card (first `AnimatedSection`) reveals with a vertical clip-path wipe from top on scroll entry.

- [ ] **Step 1: Modify web-services.tsx**

```tsx
// components/landing/web-services.tsx
"use client";

import { motion } from "framer-motion";
import { AnimatedSection } from "./animated-section";
import { serviceCards } from "@/lib/content/clinicrelay-landing";

export function WebServices() {
  return (
    <section className="py-24 md:py-32 bg-[--cr-bg]">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
        <AnimatedSection className="mb-14">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[--cr-teal] mb-3">Clinic Growth Infrastructure</p>
          <h2 className="text-3xl md:text-4xl tracking-tight font-semibold text-[--cr-text]">
            Once recovery is stable, grow demand with confidence.
          </h2>
        </AnimatedSection>

        <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-12">
          <motion.div
            initial={{ clipPath: "inset(0 0 100% 0)" }}
            whileInView={{ clipPath: "inset(0 0 0% 0)" }}
            viewport={{ once: true, margin: "-15% 0px" }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="border-t border-[--cr-border] pt-6"
          >
            <h3 className="text-xl font-semibold text-[--cr-text] tracking-tight mb-3">{serviceCards[0].title}</h3>
            <p className="text-sm text-[--cr-muted] leading-relaxed mb-6 max-w-[60ch]">{serviceCards[0].copy}</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {serviceCards[0].deliverables.map((d) => (
                <p key={d} className="text-sm text-[--cr-muted] py-2 border-t border-[--cr-border]">{d}</p>
              ))}
            </div>
          </motion.div>

          <div className="divide-y divide-[--cr-border] border-y border-[--cr-border]">
            {serviceCards.slice(1).map((card, i) => (
              <AnimatedSection key={card.title} delay={i * 0.08} className="py-5">
                <h4 className="text-base font-semibold text-[--cr-text] tracking-tight mb-1">{card.title}</h4>
                <p className="text-sm text-[--cr-muted] leading-relaxed mb-3">{card.copy}</p>
                <p className="text-xs text-[--cr-muted]">{card.deliverables.join(" • ")}</p>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Build — verify no TypeScript errors**

```bash
cd /root/clinicrelay-landing && npm run build 2>&1 | tail -10
```

Expected: clean build.

- [ ] **Step 3: Commit**

```bash
cd /root/clinicrelay-landing && git add components/landing/web-services.tsx && git commit -m "feat(animation): add clip-path reveal to web services primary card"
```

---

## Task 13: UseCases — tabbed UI with AnimatePresence crossfade

**Files:**
- Modify: `components/landing/use-cases.tsx`

Converts the vertical card list to a tabbed interface. Tab buttons switch the visible use case with a crossfade via `AnimatePresence mode="wait"`.

- [ ] **Step 1: Read the current file to understand the data shape**

```bash
cat /root/clinicrelay-landing/components/landing/use-cases.tsx
```

- [ ] **Step 2: Check useCases data shape in content layer**

```bash
grep -A 20 "export const useCases" /root/clinicrelay-landing/lib/content/clinicrelay-landing.ts | head -25
```

- [ ] **Step 3: Rewrite use-cases.tsx with tab UI**

```tsx
// components/landing/use-cases.tsx
"use client";

import { useState } from "react";
import { Tooth, FirstAid, Eye, Bandaids } from "@phosphor-icons/react/dist/ssr";
import { AnimatedSection } from "./animated-section";
import { useCases } from "@/lib/content/clinicrelay-landing";
import { motion, AnimatePresence } from "framer-motion";

const iconMap: Record<string, React.ElementType> = { Tooth, FirstAid, Eye, Bandaids };

export function UseCases() {
  const [activeIndex, setActiveIndex] = useState(0);
  const active = useCases[activeIndex];

  return (
    <section className="py-24 md:py-32 bg-[--cr-bg]">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
        <AnimatedSection className="mb-14">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[--cr-teal] mb-3">Use Cases</p>
          <h2 className="text-3xl md:text-4xl tracking-tight font-semibold text-[--cr-text]">
            Built for appointment-based clinics.
          </h2>
        </AnimatedSection>

        {/* Tab buttons */}
        <div className="flex flex-wrap gap-2 mb-8">
          {useCases.map((uc, i) => (
            <button
              key={uc.type}
              onClick={() => setActiveIndex(i)}
              className={`text-sm font-semibold px-4 py-2 rounded-full border transition-colors ${
                activeIndex === i
                  ? "bg-[--cr-teal] text-white border-[--cr-teal]"
                  : "bg-white text-[--cr-muted] border-[--cr-border] hover:border-[--cr-teal] hover:text-[--cr-teal]"
              }`}
            >
              {uc.type}
            </button>
          ))}
        </div>

        {/* Animated content panel */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeIndex}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="grid gap-8 items-center rounded-[2rem] border border-[--cr-border] bg-white p-10 grid-cols-1 md:grid-cols-[1.4fr_1fr]"
            style={{ boxShadow: "var(--cr-shadow)" }}
          >
            <div>
              <UseCaseIcon icon={iconMap[active.icon]} />
              <h3 className="text-xl font-semibold text-[--cr-text] tracking-tight mb-2">{active.title}</h3>
              <p className="text-base text-[--cr-muted] leading-relaxed mb-4">{active.copy}</p>
              <div className="flex flex-wrap gap-2">
                {active.pills.map((pill) => (
                  <span key={pill} className="text-xs font-semibold px-3 py-1.5 rounded-full bg-[--cr-teal-light] text-[--cr-teal]">{pill}</span>
                ))}
              </div>
            </div>
            <div className="rounded-2xl bg-[--cr-surface-2] border border-[--cr-border] p-6 flex items-center justify-center min-h-[140px]">
              <p className="text-sm font-semibold text-[--cr-teal]">{active.type} Clinic Workflow</p>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}

function UseCaseIcon({ icon: Icon }: { icon: React.ElementType }) {
  return (
    <motion.div
      className="mb-4 inline-block"
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Icon size={32} weight="duotone" className="text-[--cr-teal]" />
    </motion.div>
  );
}
```

- [ ] **Step 4: Build — verify no TypeScript errors**

```bash
cd /root/clinicrelay-landing && npm run build 2>&1 | tail -15
```

Expected: clean build.

- [ ] **Step 5: Commit**

```bash
cd /root/clinicrelay-landing && git add components/landing/use-cases.tsx && git commit -m "feat(animation): convert use cases to tabbed UI with AnimatePresence crossfade"
```

---

## Task 14: TrustSection — stagger delay increase

**Files:**
- Modify: `components/landing/trust-section.tsx`

The trust section should breathe, not pop. Increase `AnimatedSection` delay increments to 0.12s (from 0.08s) for a calmer entrance cadence. No other changes.

- [ ] **Step 1: Modify trust-section.tsx**

Change `delay={i * 0.08}` to `delay={i * 0.12}`:

```tsx
// In the trustPillars map:
<AnimatedSection key={pillar.title} delay={i * 0.12} className="py-6">
```

- [ ] **Step 2: Commit**

```bash
cd /root/clinicrelay-landing && git add components/landing/trust-section.tsx && git commit -m "feat(animation): slow trust section entrance stagger for calmer feel"
```

---

## Task 15: PricingSection — recommended plan pulse + card hover lift

**Files:**
- Modify: `components/landing/pricing-section.tsx`

The recommended plan card pulses once on entry. All plan cards lift on hover.

- [ ] **Step 1: Modify pricing-section.tsx**

```tsx
// components/landing/pricing-section.tsx
"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { AnimatedSection } from "./animated-section";
import { pricingPackages } from "@/lib/content/clinicrelay-landing";
import { PricingCtaButton } from "./pricing-cta-button";
import { CheckCircle } from "@phosphor-icons/react/dist/ssr";

export function PricingSection() {
  const headerRef = useRef<HTMLDivElement>(null);
  const inView = useInView(headerRef, { once: true, margin: "-15% 0px" });

  return (
    <section id="pricing" className="py-24 md:py-32 bg-white">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
        <AnimatedSection className="mb-14">
          <div ref={headerRef}>
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[--cr-teal] mb-3">Pricing</p>
            <h2 className="text-3xl md:text-4xl tracking-tight font-semibold text-[--cr-text]">
              Custom quote for every clinic.
            </h2>
            <p className="text-base text-[--cr-muted] mt-3 max-w-[55ch]">Every clinic is different. Book a demo and we&apos;ll put together a quote based on your size, services, and goals.</p>
          </div>
        </AnimatedSection>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {pricingPackages.map((pkg, i) => (
            <AnimatedSection key={pkg.name} delay={i * 0.1}>
              <motion.div
                className={`rounded-[2rem] border-2 bg-white p-8 flex flex-col h-full ${pkg.recommended ? "border-[--cr-teal]" : "border-[--cr-border]"}`}
                style={{ boxShadow: pkg.recommended ? "0 0 0 4px rgba(13,148,136,0.08), var(--cr-shadow)" : "var(--cr-shadow)" }}
                animate={pkg.recommended && inView ? { scale: [1, 1.02, 1] } : {}}
                transition={{ duration: 0.5, delay: 0.4 }}
                whileHover={{ y: -4, boxShadow: "0 12px 32px -6px rgba(13,148,136,0.15)" }}
              >
                {pkg.recommended && (
                  <span className="text-xs font-semibold px-3 py-1.5 rounded-full bg-[--cr-teal-light] text-[--cr-teal] self-start mb-4">Recommended</span>
                )}
                <h3 className="text-xl font-semibold text-[--cr-text] tracking-tight mb-2">{pkg.name}</h3>
                <p className="text-sm text-[--cr-muted] mb-6 leading-relaxed">{pkg.tagline}</p>
                <ul className="flex flex-col gap-3 mb-8 flex-1">
                  {pkg.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-[--cr-muted]">
                      <CheckCircle size={16} weight="duotone" className="text-[--cr-teal] mt-0.5 shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <PricingCtaButton />
              </motion.div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Build — verify no TypeScript errors**

```bash
cd /root/clinicrelay-landing && npm run build 2>&1 | tail -10
```

Expected: clean build.

- [ ] **Step 3: Commit**

```bash
cd /root/clinicrelay-landing && git add components/landing/pricing-section.tsx && git commit -m "feat(animation): add recommended plan pulse and card hover lift to pricing section"
```

---

## Task 16: ProcessSection — animated horizontal timeline line

**Files:**
- Modify: `components/landing/process-section.tsx`

The existing static `h-px` line becomes two overlapping lines: a static `--cr-border` track underneath and an animated teal fill on top.

- [ ] **Step 1: Modify process-section.tsx**

```tsx
// components/landing/process-section.tsx
"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { MagnifyingGlass, Wrench, Users, TrendUp } from "@phosphor-icons/react/dist/ssr";
import { AnimatedSection } from "./animated-section";
import { processSteps } from "@/lib/content/clinicrelay-landing";
import React from "react";

const iconMap: Record<string, React.ElementType> = { MagnifyingGlass, Wrench, Users, TrendUp };

export function ProcessSection() {
  const lineRef = useRef<HTMLDivElement>(null);
  const lineInView = useInView(lineRef, { once: true, margin: "-20% 0px" });

  return (
    <section className="py-24 md:py-32 bg-[--cr-bg]">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
        <AnimatedSection className="mb-14">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[--cr-teal] mb-3">Getting Started</p>
          <h2 className="text-3xl md:text-4xl tracking-tight font-semibold text-[--cr-text]">
            From audit to active in four steps.
          </h2>
        </AnimatedSection>
        <div ref={lineRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 relative">
          {/* Static track */}
          <div className="hidden lg:block absolute top-5 left-[12.5%] right-[12.5%] h-px bg-[--cr-border]" />
          {/* Animated teal fill */}
          <motion.div
            className="hidden lg:block absolute top-5 left-[12.5%] right-[12.5%] h-px bg-[--cr-teal] origin-left"
            initial={{ scaleX: 0 }}
            animate={lineInView ? { scaleX: 1 } : { scaleX: 0 }}
            transition={{ duration: 0.9, ease: "easeOut", delay: 0.1 }}
          />
          {processSteps.map((step, i) => {
            const Icon = iconMap[step.icon];
            return (
              <AnimatedSection key={step.number} delay={i * 0.1} className="flex flex-col gap-3">
                <div className="w-10 h-10 rounded-full bg-[--cr-teal] flex items-center justify-center shrink-0 relative z-10">
                  {Icon && React.createElement(Icon, { size: 18, weight: "duotone", className: "text-white" })}
                </div>
                <p className="text-xs font-semibold text-[--cr-teal]">{step.number}</p>
                <h3 className="text-xl font-semibold text-[--cr-text] tracking-tight">{step.title}</h3>
                <p className="text-sm text-[--cr-muted] leading-relaxed">{step.copy}</p>
              </AnimatedSection>
            );
          })}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Build — verify no TypeScript errors**

```bash
cd /root/clinicrelay-landing && npm run build 2>&1 | tail -10
```

Expected: clean build.

- [ ] **Step 3: Commit**

```bash
cd /root/clinicrelay-landing && git add components/landing/process-section.tsx && git commit -m "feat(animation): add animated teal fill to process section timeline line"
```

---

## Task 17: FaqSection — JS progressive enhancement

**Files:**
- Modify: `components/landing/faq-section.tsx`

Keeps native `<details>` semantics. A `toggle` event listener drives chevron rotation and content opacity fade via Framer Motion.

- [ ] **Step 1: Modify faq-section.tsx**

```tsx
// components/landing/faq-section.tsx
"use client";

import { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { faqItems } from "@/lib/content/clinicrelay-landing";

function FaqItem({ question, answer }: { question: string; answer: string }) {
  const detailsRef = useRef<HTMLDetailsElement>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const el = detailsRef.current;
    if (!el) return;
    const handler = () => setOpen(el.open);
    el.addEventListener("toggle", handler);
    return () => el.removeEventListener("toggle", handler);
  }, []);

  return (
    <details ref={detailsRef} className="group py-2">
      <summary className="w-full list-none cursor-pointer flex items-center justify-between py-4 text-left gap-4">
        <span className="text-base font-semibold text-[--cr-text] tracking-tight">{question}</span>
        <motion.span
          className="text-[--cr-muted] shrink-0 text-lg leading-none select-none"
          animate={{ rotate: open ? 45 : 0, color: open ? "var(--cr-teal)" : "var(--cr-muted)" }}
          transition={{ duration: 0.2 }}
        >
          +
        </motion.span>
      </summary>
      <motion.div
        initial={false}
        animate={{ opacity: open ? 1 : 0, height: open ? "auto" : 0 }}
        transition={{ duration: 0.25, ease: "easeInOut" }}
        className="overflow-hidden"
      >
        <p className="text-base text-[--cr-muted] leading-relaxed pb-5">{answer}</p>
      </motion.div>
    </details>
  );
}

export function FaqSection() {
  return (
    <section id="faq" className="py-24 md:py-32 bg-white">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
        <div className="mb-14">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[--cr-teal] mb-3">FAQ</p>
          <h2 className="text-3xl md:text-4xl tracking-tight font-semibold text-[--cr-text]">Common questions.</h2>
        </div>
        <div className="max-w-3xl mx-auto rounded-2xl border border-[--cr-border] bg-[--cr-surface-2] px-6 md:px-8 py-3 divide-y divide-[--cr-border]">
          {faqItems.map((item, i) => (
            <FaqItem key={i} question={item.question} answer={item.answer} />
          ))}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Build — verify no TypeScript errors**

```bash
cd /root/clinicrelay-landing && npm run build 2>&1 | tail -10
```

Expected: clean build.

- [ ] **Step 3: Commit**

```bash
cd /root/clinicrelay-landing && git add components/landing/faq-section.tsx && git commit -m "feat(animation): add JS progressive enhancement to FAQ accordion"
```

---

## Task 18: FinalCta — 4-step mini workflow loop

**Files:**
- Modify: `components/landing/final-cta.tsx`

A subtle 4-step status pill above the headline cycles through the recovery workflow on a 3-second interval.

- [ ] **Step 1: Modify final-cta.tsx**

```tsx
// components/landing/final-cta.tsx
"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { FinalCtaButtons } from "./final-cta-buttons";

const LOOP_STEPS = [
  { label: "Slot cancelled", color: "bg-red-500/20 text-red-300" },
  { label: "Waitlist offer sent", color: "bg-amber-500/20 text-amber-300" },
  { label: "Patient confirmed", color: "bg-teal-500/20 text-teal-300" },
  { label: "Slot refilled", color: "bg-green-500/20 text-green-300" },
] as const;

export function FinalCta() {
  const [step, setStep] = useState(0);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    if (shouldReduceMotion) return;
    const id = setInterval(() => setStep((s) => (s + 1) % LOOP_STEPS.length), 3000);
    return () => clearInterval(id);
  }, [shouldReduceMotion]);

  const current = shouldReduceMotion ? LOOP_STEPS[3] : LOOP_STEPS[step];

  return (
    <section className="py-28 md:py-36 bg-[#0F172A]">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10 text-center">
        {/* Mini loop indicator */}
        <div className="flex items-center justify-center gap-2 mb-8 h-7">
          <AnimatePresence mode="wait">
            <motion.span
              key={current.label}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.25 }}
              className={`text-xs font-semibold px-3 py-1 rounded-full ${current.color}`}
            >
              {current.label}
            </motion.span>
          </AnimatePresence>
        </div>

        <h2 className="text-4xl md:text-6xl tracking-tighter font-semibold text-white mb-6 max-w-[18ch] mx-auto leading-none">
          Stop letting front-desk chaos leak revenue.
        </h2>
        <p className="text-base text-white/75 mb-10 max-w-[56ch] mx-auto leading-relaxed">
          Start with a workflow audit. We&apos;ll identify where cancellations, missed follow-up, and manual coordination are costing your clinic time and capacity.
        </p>
        <FinalCtaButtons />
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Build — verify no TypeScript errors**

```bash
cd /root/clinicrelay-landing && npm run build 2>&1 | tail -10
```

Expected: clean build.

- [ ] **Step 3: Run full test suite**

```bash
cd /root/clinicrelay-landing && npx vitest run
```

Expected: all tests passing.

- [ ] **Step 4: Commit**

```bash
cd /root/clinicrelay-landing && git add components/landing/final-cta.tsx && git commit -m "feat(animation): add 4-step recovery mini loop to final CTA"
```

---

## Final verification

- [ ] **Full build**

```bash
cd /root/clinicrelay-landing && npm run build 2>&1 | tail -20
```

Expected: all 12 routes compile, 0 errors.

- [ ] **Full lint**

```bash
cd /root/clinicrelay-landing && npm run lint
```

Expected: no errors or warnings.

- [ ] **Full test suite**

```bash
cd /root/clinicrelay-landing && npx vitest run
```

Expected: all tests passing (including the 2 new test files from Tasks 1 and 2).
