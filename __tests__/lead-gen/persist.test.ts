import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@/lib/supabase/admin", () => ({
  getSupabaseAdminClient: vi.fn(),
}));

import { persistClinics } from "@/lib/lead-gen/stages/persist";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";
import type { EnrichedClinic } from "@/lib/lead-gen/types";

const makeEnriched = (i: number): EnrichedClinic => ({
  placeId: `place-${i}`,
  clinicName: `Clinic ${i}`,
  address: `${i} Main St`,
  phone: "+15550001",
  website: `https://clinic${i}.com`,
  googleRating: 4.2,
  reviewCount: 30,
  sourceQuery: "dental clinic in Austin TX",
  ownerName: "Dr. Smith",
  email: "smith@clinic.com",
});

function mockSupabase(upsertError: unknown = null, insertError: unknown = null) {
  const upsert = vi.fn().mockResolvedValue({ error: upsertError });
  const insert = vi.fn().mockResolvedValue({ error: insertError });
  const from = vi.fn().mockImplementation((table: string) => {
    if (table === "outbound_prospects") return { upsert };
    if (table === "prospect_runs") return { insert };
    return {};
  });
  vi.mocked(getSupabaseAdminClient).mockReturnValue({ from } as never);
  return { upsert, insert };
}

beforeEach(() => vi.clearAllMocks());

describe("persistClinics", () => {
  it("upserts clinics and inserts run log, returns counts", async () => {
    const { upsert, insert } = mockSupabase();
    const clinics = [makeEnriched(0), makeEnriched(1)];

    const result = await persistClinics(clinics, "Austin TX", "dental");

    expect(upsert).toHaveBeenCalledOnce();
    expect(insert).toHaveBeenCalledOnce();
    expect(result.discovered).toBe(2);
    expect(result.enriched).toBe(2);
  });

  it("counts enriched correctly — only clinics with owner or email", async () => {
    mockSupabase();
    const clinics: EnrichedClinic[] = [
      { ...makeEnriched(0), ownerName: null, email: null },
      { ...makeEnriched(1), ownerName: "Dr. X", email: null },
    ];

    const result = await persistClinics(clinics, "Austin TX", "dental");
    expect(result.enriched).toBe(1);
  });

  it("throws when Supabase client is unavailable", async () => {
    vi.mocked(getSupabaseAdminClient).mockReturnValue(null as never);
    await expect(persistClinics([makeEnriched(0)], "Austin TX", "dental")).rejects.toThrow(
      "Supabase admin client unavailable"
    );
  });

  it("throws when upsert fails", async () => {
    mockSupabase({ message: "upsert error" });
    await expect(persistClinics([makeEnriched(0)], "Austin TX", "dental")).rejects.toThrow(
      "upsert error"
    );
  });
});
