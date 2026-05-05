import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@/lib/lead-gen/sgai", () => ({
  enrichClinic: vi.fn(),
}));

import { enrich } from "@/lib/lead-gen/stages/enrich";
import { enrichClinic } from "@/lib/lead-gen/sgai";
import type { RawClinic } from "@/lib/lead-gen/types";

const makeRaw = (overrides: Partial<RawClinic> = {}): RawClinic => ({
  placeId: "place-1",
  clinicName: "Test Clinic",
  address: "1 Main St",
  phone: "+15550001",
  website: "https://test.com",
  googleRating: 4.5,
  reviewCount: 80,
  sourceQuery: "dental clinic in Austin TX",
  ...overrides,
});

beforeEach(() => vi.clearAllMocks());

describe("enrich", () => {
  it("merges enrichment data onto each clinic with a website", async () => {
    vi.mocked(enrichClinic).mockResolvedValue({ ownerName: "Dr. Smith", email: "smith@clinic.com" });

    const result = await enrich([makeRaw()]);

    expect(enrichClinic).toHaveBeenCalledWith("https://test.com");
    expect(result[0].ownerName).toBe("Dr. Smith");
    expect(result[0].email).toBe("smith@clinic.com");
  });

  it("sets ownerName and email to null for clinics without a website", async () => {
    const result = await enrich([makeRaw({ website: null })]);

    expect(enrichClinic).not.toHaveBeenCalled();
    expect(result[0].ownerName).toBeNull();
    expect(result[0].email).toBeNull();
  });

  it("preserves clinics where enrichment returns nulls", async () => {
    vi.mocked(enrichClinic).mockResolvedValue({ ownerName: null, email: null });

    const result = await enrich([makeRaw()]);
    expect(result).toHaveLength(1);
    expect(result[0].ownerName).toBeNull();
  });
});
