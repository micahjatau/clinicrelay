import { describe, it, expect, vi, beforeEach } from "vitest";

const mockFetch = vi.fn();
vi.stubGlobal("fetch", mockFetch);

import { searchClinics, getAllClinics } from "@/lib/lead-gen/places";

beforeEach(() => {
  vi.clearAllMocks();
  process.env.GOOGLE_PLACES_API_KEY = "test-key";
});

const makePlacesResponse = (count: number, nextPageToken?: string) => ({
  places: Array.from({ length: count }, (_, i) => ({
    id: `place-${i}`,
    displayName: { text: `Clinic ${i}` },
    formattedAddress: `${i} Main St`,
    internationalPhoneNumber: `+1555000${i}`,
    websiteUri: `https://clinic${i}.com`,
    rating: 4.5,
    userRatingCount: 100,
  })),
  ...(nextPageToken ? { nextPageToken } : {}),
});

describe("searchClinics", () => {
  it("returns mapped clinics and nextPageToken", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => makePlacesResponse(2, "token-abc"),
    });

    const result = await searchClinics("dental clinic in Austin TX");

    expect(result.clinics).toHaveLength(2);
    expect(result.clinics[0]).toEqual({
      placeId: "place-0",
      clinicName: "Clinic 0",
      address: "0 Main St",
      phone: "+15550000",
      website: "https://clinic0.com",
      googleRating: 4.5,
      reviewCount: 100,
      sourceQuery: "dental clinic in Austin TX",
    });
    expect(result.nextPageToken).toBe("token-abc");
  });

  it("throws when GOOGLE_PLACES_API_KEY is missing", async () => {
    delete process.env.GOOGLE_PLACES_API_KEY;
    await expect(searchClinics("test")).rejects.toThrow("GOOGLE_PLACES_API_KEY");
  });

  it("throws when Places API returns non-ok response", async () => {
    mockFetch.mockResolvedValueOnce({ ok: false, status: 403 });
    await expect(searchClinics("test")).rejects.toThrow("Places API error: 403");
  });
});

describe("getAllClinics", () => {
  it("paginates through all pages and returns combined results", async () => {
    mockFetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => makePlacesResponse(2, "page-2"),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => makePlacesResponse(1),
      });

    const clinics = await getAllClinics("dental clinic in Austin TX");
    expect(clinics).toHaveLength(3);
  });
});
