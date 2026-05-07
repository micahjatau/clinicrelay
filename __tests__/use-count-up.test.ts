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
