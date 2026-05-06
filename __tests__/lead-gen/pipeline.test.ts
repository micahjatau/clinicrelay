import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@/lib/lead-gen/stages/discover", () => ({ discover: vi.fn() }));
vi.mock("@/lib/lead-gen/stages/enrich", () => ({ enrich: vi.fn() }));
vi.mock("@/lib/lead-gen/stages/persist", () => ({ persistClinics: vi.fn() }));

import { runPipeline } from "@/lib/lead-gen/pipeline";
import { discover } from "@/lib/lead-gen/stages/discover";
import { enrich } from "@/lib/lead-gen/stages/enrich";
import { persistClinics } from "@/lib/lead-gen/stages/persist";
import type { RawClinic, EnrichedClinic } from "@/lib/lead-gen/types";

const rawClinic: RawClinic = {
  placeId: "p1",
  clinicName: "Test",
  address: "1 St",
  phone: null,
  website: "https://test.com",
  googleRating: 4.0,
  reviewCount: 10,
  sourceQuery: "dental clinic in Austin TX",
};
const enrichedClinic: EnrichedClinic = { ...rawClinic, ownerName: null, email: null };

beforeEach(() => vi.clearAllMocks());

describe("runPipeline", () => {
  it("calls all three stages and returns results", async () => {
    vi.mocked(discover).mockResolvedValue([rawClinic]);
    vi.mocked(enrich).mockResolvedValue([enrichedClinic]);
    vi.mocked(persistClinics).mockResolvedValue({
      city: "Austin TX",
      clinicType: "dental",
      discovered: 1,
      enriched: 0,
    });

    const results = await runPipeline({ cities: ["Austin TX"], types: ["dental"] });

    expect(discover).toHaveBeenCalledWith(["Austin TX"], ["dental"]);
    expect(enrich).toHaveBeenCalledWith([rawClinic]);
    expect(persistClinics).toHaveBeenCalledWith([enrichedClinic], "Austin TX", "dental");
    expect(results).toHaveLength(1);
    expect(results[0].discovered).toBe(1);
  });
});
