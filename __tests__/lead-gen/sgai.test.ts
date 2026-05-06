import { describe, it, expect, vi, beforeEach } from "vitest";

const mockFetch = vi.fn();
vi.stubGlobal("fetch", mockFetch);

import { enrichClinic } from "@/lib/lead-gen/sgai";

beforeEach(() => {
  vi.clearAllMocks();
  process.env.SGAI_API_KEY = "test-sgai-key";
});

function mockV2Response(markdown: string) {
  mockFetch.mockResolvedValueOnce({
    ok: true,
    json: async () => ({ content: markdown }),
  });
}

describe("enrichClinic", () => {
  it("sends request to v2 endpoint with correct format", async () => {
    mockV2Response("");
    await enrichClinic("https://clinic.com");
    const [url, init] = mockFetch.mock.calls[0] as [string, RequestInit];
    expect(url).toBe("https://v2-api.scrapegraphai.com/api/scrape");
    const body = JSON.parse(init.body as string);
    expect(body.url).toBe("https://clinic.com");
    expect(body.formats).toEqual([{ type: "markdown", mode: "normal" }]);
    expect(body.fetchConfig.mode).toBe("auto");
  });

  it("extracts email and owner name from markdown content", async () => {
    mockV2Response(
      "## About Us\nDr. Jane Smith founded this practice.\nContact: owner@westclinic.com"
    );
    const result = await enrichClinic("https://clinic.com");
    expect(result).toEqual({ ownerName: "Jane Smith", email: "owner@westclinic.com" });
  });

  it("extracts email when owner name is absent", async () => {
    mockV2Response("For appointments call us or email info@healthcenter.ca");
    const result = await enrichClinic("https://clinic.com");
    expect(result).toEqual({ ownerName: null, email: "info@healthcenter.ca" });
  });

  it("returns nulls when markdown has no identifiable fields", async () => {
    mockV2Response("Welcome to our clinic. We provide quality care.");
    const result = await enrichClinic("https://clinic.com");
    expect(result).toEqual({ ownerName: null, email: null });
  });

  it("handles result array response shape", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        result: [{ type: "markdown", content: "Contact owner@example.com for info." }],
      }),
    });
    const result = await enrichClinic("https://clinic.com");
    expect(result.email).toBe("owner@example.com");
  });

  it("returns nulls when markdown field is missing from response", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({}),
    });
    const result = await enrichClinic("https://clinic.com");
    expect(result).toEqual({ ownerName: null, email: null });
  });

  it("returns nulls when API responds with non-ok status", async () => {
    mockFetch.mockResolvedValueOnce({ ok: false, status: 429 });
    const result = await enrichClinic("https://clinic.com");
    expect(result).toEqual({ ownerName: null, email: null });
  });

  it("returns nulls when fetch throws", async () => {
    mockFetch.mockRejectedValueOnce(new Error("network error"));
    const result = await enrichClinic("https://clinic.com");
    expect(result).toEqual({ ownerName: null, email: null });
  });

  it("throws when SGAI_API_KEY is missing", async () => {
    delete process.env.SGAI_API_KEY;
    await expect(enrichClinic("https://clinic.com")).rejects.toThrow("SGAI_API_KEY");
  });
});
