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
