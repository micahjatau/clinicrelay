import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@/lib/supabase/admin", () => ({
  getSupabaseAdminClient: vi.fn(),
}));

import { POST } from "@/app/api/leads/route";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";

function makeRequest(body: unknown) {
  return new Request("http://localhost/api/leads", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

function mockSupabase(insertError: unknown = null) {
  const insert = vi.fn().mockResolvedValue({ error: insertError });
  const from = vi.fn().mockReturnValue({ insert });
  vi.mocked(getSupabaseAdminClient).mockReturnValue({ from } as never);
  return { from, insert };
}

describe("POST /api/leads", () => {
  beforeEach(() => vi.clearAllMocks());

  it("returns 422 when required fields are missing", async () => {
    mockSupabase();
    const res = await POST(makeRequest({ name: "Alex" }));
    expect(res.status).toBe(422);
    const body = await res.json();
    expect(body.error).toBe("Invalid fields.");
  });

  it("inserts lead and returns ok when required fields present", async () => {
    mockSupabase();
    const res = await POST(
      makeRequest({ name: "Dr. Sana Mir", email: "sana@clinic.ca", clinic_name: "Westview Family Health" })
    );
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.ok).toBe(true);
  });

  it("returns 500 when supabase client is unavailable", async () => {
    vi.mocked(getSupabaseAdminClient).mockReturnValue(null as never);
    const res = await POST(makeRequest({ name: "A", email: "a@b.com", clinic_name: "X" }));
    expect(res.status).toBe(500);
  });

  it("returns 500 when supabase insert fails", async () => {
    mockSupabase({ message: "DB error" });
    const res = await POST(makeRequest({ name: "A", email: "a@b.com", clinic_name: "X" }));
    expect(res.status).toBe(500);
  });
});
