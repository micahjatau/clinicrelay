import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@/lib/lead-gen/pipeline", () => ({
  runPipeline: vi.fn(),
}));

import { POST } from "@/app/api/cron/lead-gen/route";
import { runPipeline } from "@/lib/lead-gen/pipeline";

function makeRequest(authHeader?: string) {
  return new Request("http://localhost/api/cron/lead-gen", {
    method: "POST",
    headers: authHeader ? { authorization: authHeader } : {},
  });
}

beforeEach(() => {
  vi.clearAllMocks();
  process.env.CRON_SECRET = "secret-xyz";
  process.env.LEAD_GEN_CITIES = "Austin TX,Dallas TX";
  process.env.LEAD_GEN_TYPES = "dental,medical";
});

describe("POST /api/cron/lead-gen", () => {
  it("returns 401 when CRON_SECRET env var is not set", async () => {
    delete process.env.CRON_SECRET;
    const res = await POST(makeRequest("Bearer secret-xyz"));
    expect(res.status).toBe(401);
  });

  it("returns 401 when authorization header is missing", async () => {
    const res = await POST(makeRequest());
    expect(res.status).toBe(401);
  });

  it("returns 401 when authorization header is wrong", async () => {
    const res = await POST(makeRequest("Bearer wrong-secret"));
    expect(res.status).toBe(401);
  });

  it("returns 400 when LEAD_GEN_CITIES is not configured", async () => {
    delete process.env.LEAD_GEN_CITIES;
    const res = await POST(makeRequest("Bearer secret-xyz"));
    expect(res.status).toBe(400);
  });

  it("returns 400 when LEAD_GEN_TYPES is not configured", async () => {
    delete process.env.LEAD_GEN_TYPES;
    const res = await POST(makeRequest("Bearer secret-xyz"));
    expect(res.status).toBe(400);
  });

  it("calls runPipeline with parsed cities and types, returns ok", async () => {
    vi.mocked(runPipeline).mockResolvedValue([
      { city: "Austin TX", clinicType: "dental", discovered: 10, enriched: 5 },
    ]);

    const res = await POST(makeRequest("Bearer secret-xyz"));
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.ok).toBe(true);
    expect(body.results).toHaveLength(1);
    expect(runPipeline).toHaveBeenCalledWith({
      cities: ["Austin TX", "Dallas TX"],
      types: ["dental", "medical"],
    });
  });

  it("returns 500 when runPipeline throws", async () => {
    vi.mocked(runPipeline).mockRejectedValue(new Error("pipeline failed"));
    const res = await POST(makeRequest("Bearer secret-xyz"));
    expect(res.status).toBe(500);
  });
});
