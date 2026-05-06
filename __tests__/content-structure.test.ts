import { describe, it, expect } from "vitest";
import { featureCards, readinessFeatures, commandCenterItems } from "@/lib/content/clinicrelay-landing";

describe("feature grid pillars", () => {
  it("every feature card has a pillar field", () => {
    featureCards.forEach((card) => {
      expect(card).toHaveProperty("pillar");
    });
  });

  it("all three pillars are represented", () => {
    const pillars = new Set(featureCards.map((c) => c.pillar));
    expect(pillars.has("Access")).toBe(true);
    expect(pillars.has("Readiness")).toBe(true);
    expect(pillars.has("Recovery")).toBe(true);
  });

  it("insurance and patient portal appear in Readiness or Access pillar", () => {
    const titles = featureCards
      .filter((c) => (["Readiness", "Access"] as string[]).includes(c.pillar))
      .map((c) => c.title);
    const hasInsurance = titles.some((t) => t.toLowerCase().includes("insurance"));
    const hasPortal = titles.some((t) => t.toLowerCase().includes("portal"));
    expect(hasInsurance).toBe(true);
    expect(hasPortal).toBe(true);
  });
});

describe("pre-visit readiness content", () => {
  it("exports readinessFeatures with at least 4 items", () => {
    expect(readinessFeatures.length).toBeGreaterThanOrEqual(4);
  });

  it("every readiness feature has icon, title, and copy", () => {
    readinessFeatures.forEach((f) => {
      expect(f).toHaveProperty("icon");
      expect(f).toHaveProperty("title");
      expect(f).toHaveProperty("copy");
    });
  });
});

describe("front desk command center content", () => {
  it("exports commandCenterItems with at least 5 items", () => {
    expect(commandCenterItems.length).toBeGreaterThanOrEqual(5);
  });

  it("every command center item has label, count, and status", () => {
    commandCenterItems.forEach((item) => {
      expect(item).toHaveProperty("label");
      expect(item).toHaveProperty("count");
      expect(item).toHaveProperty("status");
    });
  });

  it("status values are restricted to action, pending, done", () => {
    const valid = new Set(["action", "pending", "done"]);
    commandCenterItems.forEach((item) => {
      expect(valid.has(item.status)).toBe(true);
    });
  });
});
