import { describe, it, expect, vi, beforeEach } from "vitest";

const mockFetch = vi.fn();
vi.stubGlobal("fetch", mockFetch);

import { enrichClinic } from "@/lib/lead-gen/sgai";

beforeEach(() => {
  vi.clearAllMocks();
  process.env.SGAI_API_KEY = "test-sgai-key";
});

describe("enrichClinic", () => {
  it("returns owner name and email on success", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        result: { owner_name: "Dr. Jane Smith", email: "jane@clinic.com" },
      }),
    });

    const result = await enrichClinic("https://clinic.com");
    expect(result).toEqual({ ownerName: "Dr. Jane Smith", email: "jane@clinic.com" });
  });

  it("returns nulls when result fields are absent", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ result: {} }),
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
