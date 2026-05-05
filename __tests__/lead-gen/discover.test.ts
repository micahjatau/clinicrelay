import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@/lib/lead-gen/places", () => ({
  getAllClinics: vi.fn(),
}));

import { discover } from "@/lib/lead-gen/stages/discover";
import { getAllClinics } from "@/lib/lead-gen/places";
import type { RawClinic } from "@/lib/lead-gen/types";

const makeClinic = (i: number): RawClinic => ({
  placeId: `place-${i}`,
  clinicName: `Clinic ${i}`,
  address: `${i} Main St`,
  phone: null,
  website: `https://clinic${i}.com`,
  googleRating: 4.2,
  reviewCount: 50,
  sourceQuery: "dental clinic in Austin TX",
});

beforeEach(() => vi.clearAllMocks());

describe("discover", () => {
  it("builds queries for each (city, type) pair and returns combined clinics", async () => {
    vi.mocked(getAllClinics)
      .mockResolvedValueOnce([makeClinic(0), makeClinic(1)])
      .mockResolvedValueOnce([makeClinic(2)]);

    const result = await discover(["Austin TX"], ["dental", "medical"]);

    expect(getAllClinics).toHaveBeenCalledTimes(2);
    expect(getAllClinics).toHaveBeenCalledWith("dental clinic in Austin TX");
    expect(getAllClinics).toHaveBeenCalledWith("medical clinic in Austin TX");
    expect(result).toHaveLength(3);
  });

  it("returns empty array when no clinics found", async () => {
    vi.mocked(getAllClinics).mockResolvedValue([]);
    const result = await discover(["Austin TX"], ["dental"]);
    expect(result).toEqual([]);
  });

  it("continues with remaining queries when one fails", async () => {
    vi.mocked(getAllClinics)
      .mockRejectedValueOnce(new Error("API failure"))
      .mockResolvedValueOnce([makeClinic(0)]);

    const result = await discover(["Austin TX"], ["dental", "medical"]);
    expect(result).toHaveLength(1);
  });
});
