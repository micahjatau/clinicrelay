import { describe, it, expect } from "vitest";
import {
  workflowSteps,
  faqItems,
  growthPillars,
} from "@/lib/content/clinicrelay-landing";

describe("content overclaim guardrails", () => {
  it("workflowSteps must not claim cancellations trigger automatic outreach", () => {
    const allCopy = workflowSteps.map((s) => s.copy).join(" ");
    expect(allCopy).not.toContain(
      "trigger automatic waitlist outreach before the slot can go to waste"
    );
    expect(allCopy).toContain("ClinicRelay prepares recovery outreach based on your clinic's workflow rules");
  });

  it("faqItems must not claim read-only schedule view", () => {
    const pmsAnswer = faqItems.find((f) =>
      f.question.includes("practice management software")
    );
    expect(pmsAnswer?.answer).not.toContain("read-only schedule view");
    expect(pmsAnswer?.answer).toContain("lightweight coordination layer");
  });

  it("growthPillars must not use 30-day pilot language", () => {
    const allPills = growthPillars.flatMap((p) => p.pills).join(" ");
    expect(allPills).not.toContain("30-day pilot");
    const allPillsArr = growthPillars.flatMap((p) => p.pills);
    expect(allPillsArr).toContain("Controlled workflow pilot");
  });
});
