# Lead Gen Pipeline Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build an outbound lead generation pipeline that scrapes dental/medical clinics from Google Places, enriches each with owner/email via ScrapeGraphAI, and persists to a dedicated Supabase table — runnable via CLI and Vercel Cron.

**Architecture:** Three sequential stages (Discover → Enrich → Persist) live in `lib/lead-gen/` so both the CLI script and the Vercel Cron API route can import them. The CLI entry at `scripts/lead-gen/run.ts` loads env vars and parses args; the cron route at `app/api/cron/lead-gen/route.ts` reads env vars. Supabase upserts use Google's `place_id` as the dedup key.

**Tech Stack:** Google Places API v1 (REST), ScrapeGraphAI REST API, Supabase (`@supabase/supabase-js`), Zod, Vitest, Next.js App Router (cron route), `tsx` (CLI runner)

---

## File Structure

**New files:**
| Path | Purpose |
|------|---------|
| `supabase/migrations/0002_outbound_prospects.sql` | `outbound_prospects` table |
| `supabase/migrations/0003_prospect_runs.sql` | `prospect_runs` log table |
| `lib/lead-gen/types.ts` | Shared TypeScript types |
| `lib/lead-gen/places.ts` | Google Places API client |
| `lib/lead-gen/sgai.ts` | ScrapeGraphAI client |
| `lib/lead-gen/stages/discover.ts` | Stage 1: query Places, paginate, return raw clinics |
| `lib/lead-gen/stages/enrich.ts` | Stage 2: enrich each clinic website, tolerate failures |
| `lib/lead-gen/stages/persist.ts` | Stage 3: upsert to Supabase, write run log |
| `lib/lead-gen/pipeline.ts` | Orchestrator: chains all three stages |
| `scripts/lead-gen/run.ts` | CLI entry point — loads `.env.local`, parses args |
| `app/api/cron/lead-gen/route.ts` | Vercel Cron POST endpoint |
| `vercel.json` | Cron schedule config |
| `__tests__/lead-gen/places.test.ts` | Places client unit tests |
| `__tests__/lead-gen/sgai.test.ts` | SGAI client unit tests |
| `__tests__/lead-gen/discover.test.ts` | Discover stage unit tests |
| `__tests__/lead-gen/enrich.test.ts` | Enrich stage unit tests |
| `__tests__/lead-gen/persist.test.ts` | Persist stage unit tests |
| `__tests__/lead-gen/pipeline.test.ts` | Pipeline integration test |
| `__tests__/lead-gen/cron-route.test.ts` | Cron API route tests |

**Modified files:**
| Path | Change |
|------|--------|
| `package.json` | Add `tsx` devDependency |

---

## Task 1: Database Migrations

**Files:**
- Create: `supabase/migrations/0002_outbound_prospects.sql`
- Create: `supabase/migrations/0003_prospect_runs.sql`

- [ ] **Step 1: Write outbound_prospects migration**

Create `supabase/migrations/0002_outbound_prospects.sql`:
```sql
create type prospect_status as enum ('new', 'contacted', 'qualified', 'disqualified');

create table outbound_prospects (
  place_id           text primary key,
  clinic_name        text not null,
  address            text,
  phone              text,
  website            text,
  google_rating      numeric(2,1),
  review_count       integer,
  owner_name         text,
  email              text,
  source_query       text,
  status             prospect_status not null default 'new',
  last_contacted_at  timestamptz,
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now()
);

alter table outbound_prospects enable row level security;
```

- [ ] **Step 2: Write prospect_runs migration**

Create `supabase/migrations/0003_prospect_runs.sql`:
```sql
create table prospect_runs (
  id               uuid primary key default gen_random_uuid(),
  city             text not null,
  clinic_type      text not null,
  count_discovered integer not null default 0,
  count_enriched   integer not null default 0,
  ran_at           timestamptz not null default now()
);

alter table prospect_runs enable row level security;
```

- [ ] **Step 3: Apply migrations**

```bash
npx supabase db push
```
Expected: both migrations applied, no errors.

- [ ] **Step 4: Commit**

```bash
git add supabase/migrations/0002_outbound_prospects.sql supabase/migrations/0003_prospect_runs.sql
git commit -m "feat(db): add outbound_prospects and prospect_runs tables"
```

---

## Task 2: Shared Types

**Files:**
- Create: `lib/lead-gen/types.ts`

- [ ] **Step 1: Write types**

Create `lib/lead-gen/types.ts`:
```typescript
export interface RawClinic {
  placeId: string;
  clinicName: string;
  address: string;
  phone: string | null;
  website: string | null;
  googleRating: number | null;
  reviewCount: number | null;
  sourceQuery: string;
}

export interface EnrichedClinic extends RawClinic {
  ownerName: string | null;
  email: string | null;
}

export interface PipelineConfig {
  cities: string[];
  types: string[];
}

export interface RunResult {
  city: string;
  clinicType: string;
  discovered: number;
  enriched: number;
}
```

- [ ] **Step 2: Commit**

```bash
git add lib/lead-gen/types.ts
git commit -m "feat(lead-gen): add shared types"
```

---

## Task 3: Google Places Client

**Files:**
- Create: `lib/lead-gen/places.ts`
- Create: `__tests__/lead-gen/places.test.ts`

- [ ] **Step 1: Write failing tests**

Create `__tests__/lead-gen/places.test.ts`:
```typescript
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
```

- [ ] **Step 2: Run tests — verify they fail**

```bash
npx vitest run __tests__/lead-gen/places.test.ts
```
Expected: FAIL — module not found.

- [ ] **Step 3: Implement places client**

Create `lib/lead-gen/places.ts`:
```typescript
import type { RawClinic } from "./types";

const PLACES_BASE = "https://places.googleapis.com/v1";
const FIELD_MASK = [
  "places.id",
  "places.displayName",
  "places.formattedAddress",
  "places.internationalPhoneNumber",
  "places.websiteUri",
  "places.rating",
  "places.userRatingCount",
].join(",");

export async function searchClinics(
  query: string,
  pageToken?: string
): Promise<{ clinics: RawClinic[]; nextPageToken?: string }> {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  if (!apiKey) throw new Error("GOOGLE_PLACES_API_KEY not set");

  const body: Record<string, unknown> = { textQuery: query, maxResultCount: 20 };
  if (pageToken) body.pageToken = pageToken;

  const res = await fetch(`${PLACES_BASE}/places:searchText`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Goog-Api-Key": apiKey,
      "X-Goog-FieldMask": FIELD_MASK,
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) throw new Error(`Places API error: ${res.status}`);
  const data = await res.json() as {
    places?: Record<string, unknown>[];
    nextPageToken?: string;
  };

  const clinics: RawClinic[] = (data.places ?? []).map((p) => ({
    placeId: p.id as string,
    clinicName: (p.displayName as { text: string })?.text ?? "",
    address: (p.formattedAddress as string) ?? "",
    phone: (p.internationalPhoneNumber as string) ?? null,
    website: (p.websiteUri as string) ?? null,
    googleRating: (p.rating as number) ?? null,
    reviewCount: (p.userRatingCount as number) ?? null,
    sourceQuery: query,
  }));

  return { clinics, nextPageToken: data.nextPageToken };
}

export async function getAllClinics(query: string): Promise<RawClinic[]> {
  const all: RawClinic[] = [];
  let pageToken: string | undefined;

  do {
    const { clinics, nextPageToken } = await searchClinics(query, pageToken);
    all.push(...clinics);
    pageToken = nextPageToken;
    // Places API requires a short delay between paginated requests
    if (pageToken) await new Promise((r) => setTimeout(r, 2000));
  } while (pageToken);

  return all;
}
```

- [ ] **Step 4: Run tests — verify they pass**

```bash
npx vitest run __tests__/lead-gen/places.test.ts
```
Expected: PASS — 4 tests.

- [ ] **Step 5: Commit**

```bash
git add lib/lead-gen/places.ts __tests__/lead-gen/places.test.ts
git commit -m "feat(lead-gen): Google Places client with pagination"
```

---

## Task 4: ScrapeGraphAI Client

**Files:**
- Create: `lib/lead-gen/sgai.ts`
- Create: `__tests__/lead-gen/sgai.test.ts`

- [ ] **Step 1: Write failing tests**

Create `__tests__/lead-gen/sgai.test.ts`:
```typescript
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
```

- [ ] **Step 2: Run tests — verify they fail**

```bash
npx vitest run __tests__/lead-gen/sgai.test.ts
```
Expected: FAIL — module not found.

- [ ] **Step 3: Implement SGAI client**

Create `lib/lead-gen/sgai.ts`:
```typescript
export interface EnrichmentResult {
  ownerName: string | null;
  email: string | null;
}

export async function enrichClinic(websiteUrl: string): Promise<EnrichmentResult> {
  const apiKey = process.env.SGAI_API_KEY;
  if (!apiKey) throw new Error("SGAI_API_KEY not set");

  try {
    const res = await fetch("https://api.scrapegraphai.com/v1/smartscraper", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "SGAI-APIKEY": apiKey,
      },
      body: JSON.stringify({
        website_url: websiteUrl,
        user_prompt:
          "Find the practice owner, practice manager, or medical director name and any contact email address. Return owner_name (string or null) and email (string or null).",
      }),
    });

    if (!res.ok) return { ownerName: null, email: null };

    const data = await res.json() as { result?: Record<string, unknown> };
    const result = data.result ?? {};
    return {
      ownerName: (result.owner_name as string) ?? null,
      email: (result.email as string) ?? null,
    };
  } catch {
    return { ownerName: null, email: null };
  }
}
```

- [ ] **Step 4: Run tests — verify they pass**

```bash
npx vitest run __tests__/lead-gen/sgai.test.ts
```
Expected: PASS — 5 tests.

- [ ] **Step 5: Commit**

```bash
git add lib/lead-gen/sgai.ts __tests__/lead-gen/sgai.test.ts
git commit -m "feat(lead-gen): ScrapeGraphAI enrichment client"
```

---

## Task 5: Discover Stage

**Files:**
- Create: `lib/lead-gen/stages/discover.ts`
- Create: `__tests__/lead-gen/discover.test.ts`

- [ ] **Step 1: Write failing tests**

Create `__tests__/lead-gen/discover.test.ts`:
```typescript
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
```

- [ ] **Step 2: Run tests — verify they fail**

```bash
npx vitest run __tests__/lead-gen/discover.test.ts
```
Expected: FAIL — module not found.

- [ ] **Step 3: Implement discover stage**

Create `lib/lead-gen/stages/discover.ts`:
```typescript
import { getAllClinics } from "../places";
import type { RawClinic } from "../types";

export async function discover(cities: string[], types: string[]): Promise<RawClinic[]> {
  const all: RawClinic[] = [];

  for (const city of cities) {
    for (const type of types) {
      const query = `${type} clinic in ${city}`;
      try {
        const clinics = await getAllClinics(query);
        all.push(...clinics);
      } catch (err) {
        console.error(`discover: failed for query "${query}":`, err);
      }
    }
  }

  return all;
}
```

- [ ] **Step 4: Run tests — verify they pass**

```bash
npx vitest run __tests__/lead-gen/discover.test.ts
```
Expected: PASS — 3 tests.

- [ ] **Step 5: Commit**

```bash
git add lib/lead-gen/stages/discover.ts __tests__/lead-gen/discover.test.ts
git commit -m "feat(lead-gen): discover stage — Google Places query per city/type pair"
```

---

## Task 6: Enrich Stage

**Files:**
- Create: `lib/lead-gen/stages/enrich.ts`
- Create: `__tests__/lead-gen/enrich.test.ts`

- [ ] **Step 1: Write failing tests**

Create `__tests__/lead-gen/enrich.test.ts`:
```typescript
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
```

- [ ] **Step 2: Run tests — verify they fail**

```bash
npx vitest run __tests__/lead-gen/enrich.test.ts
```
Expected: FAIL — module not found.

- [ ] **Step 3: Implement enrich stage**

Create `lib/lead-gen/stages/enrich.ts`:
```typescript
import { enrichClinic } from "../sgai";
import type { RawClinic, EnrichedClinic } from "../types";

export async function enrich(clinics: RawClinic[]): Promise<EnrichedClinic[]> {
  return Promise.all(
    clinics.map(async (clinic) => {
      if (!clinic.website) {
        return { ...clinic, ownerName: null, email: null };
      }
      const { ownerName, email } = await enrichClinic(clinic.website);
      return { ...clinic, ownerName, email };
    })
  );
}
```

- [ ] **Step 4: Run tests — verify they pass**

```bash
npx vitest run __tests__/lead-gen/enrich.test.ts
```
Expected: PASS — 3 tests.

- [ ] **Step 5: Commit**

```bash
git add lib/lead-gen/stages/enrich.ts __tests__/lead-gen/enrich.test.ts
git commit -m "feat(lead-gen): enrich stage — ScrapeGraphAI per clinic website"
```

---

## Task 7: Persist Stage

**Files:**
- Create: `lib/lead-gen/stages/persist.ts`
- Create: `__tests__/lead-gen/persist.test.ts`

- [ ] **Step 1: Write failing tests**

Create `__tests__/lead-gen/persist.test.ts`:
```typescript
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
```

- [ ] **Step 2: Run tests — verify they fail**

```bash
npx vitest run __tests__/lead-gen/persist.test.ts
```
Expected: FAIL — module not found.

- [ ] **Step 3: Implement persist stage**

Create `lib/lead-gen/stages/persist.ts`:
```typescript
import { getSupabaseAdminClient } from "@/lib/supabase/admin";
import type { EnrichedClinic, RunResult } from "../types";

export async function persistClinics(
  clinics: EnrichedClinic[],
  city: string,
  clinicType: string
): Promise<RunResult> {
  const db = getSupabaseAdminClient();
  if (!db) throw new Error("Supabase admin client unavailable");

  const rows = clinics.map((c) => ({
    place_id: c.placeId,
    clinic_name: c.clinicName,
    address: c.address,
    phone: c.phone,
    website: c.website,
    google_rating: c.googleRating,
    review_count: c.reviewCount,
    owner_name: c.ownerName,
    email: c.email,
    source_query: c.sourceQuery,
    updated_at: new Date().toISOString(),
  }));

  const { error: upsertError } = await db
    .from("outbound_prospects")
    .upsert(rows, {
      onConflict: "place_id",
      ignoreDuplicates: false,
    });

  if (upsertError) throw new Error(upsertError.message);

  const enriched = clinics.filter((c) => c.ownerName !== null || c.email !== null).length;

  const { error: insertError } = await db.from("prospect_runs").insert({
    city,
    clinic_type: clinicType,
    count_discovered: clinics.length,
    count_enriched: enriched,
  });

  if (insertError) throw new Error(insertError.message);

  return { city, clinicType, discovered: clinics.length, enriched };
}
```

- [ ] **Step 4: Run tests — verify they pass**

```bash
npx vitest run __tests__/lead-gen/persist.test.ts
```
Expected: PASS — 4 tests.

- [ ] **Step 5: Commit**

```bash
git add lib/lead-gen/stages/persist.ts __tests__/lead-gen/persist.test.ts
git commit -m "feat(lead-gen): persist stage — upsert to Supabase by place_id"
```

---

## Task 8: Pipeline Orchestrator

**Files:**
- Create: `lib/lead-gen/pipeline.ts`
- Create: `__tests__/lead-gen/pipeline.test.ts`

- [ ] **Step 1: Write failing test**

Create `__tests__/lead-gen/pipeline.test.ts`:
```typescript
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
```

- [ ] **Step 2: Run test — verify it fails**

```bash
npx vitest run __tests__/lead-gen/pipeline.test.ts
```
Expected: FAIL — module not found.

- [ ] **Step 3: Implement pipeline**

Create `lib/lead-gen/pipeline.ts`:
```typescript
import { discover } from "./stages/discover";
import { enrich } from "./stages/enrich";
import { persistClinics } from "./stages/persist";
import type { PipelineConfig, RunResult } from "./types";

export async function runPipeline(config: PipelineConfig): Promise<RunResult[]> {
  const { cities, types } = config;
  const results: RunResult[] = [];

  for (const city of cities) {
    for (const type of types) {
      console.log(`[lead-gen] Discovering ${type} clinics in ${city}...`);
      const raw = await discover([city], [type]);
      console.log(`[lead-gen] Found ${raw.length} clinics. Enriching...`);

      const enriched = await enrich(raw);
      const enrichedCount = enriched.filter((c) => c.ownerName || c.email).length;
      console.log(`[lead-gen] Enriched ${enrichedCount}/${raw.length}. Persisting...`);

      const result = await persistClinics(enriched, city, type);
      results.push(result);
      console.log(`[lead-gen] Done: ${city} / ${type} — ${result.discovered} discovered, ${result.enriched} enriched.`);
    }
  }

  return results;
}
```

- [ ] **Step 4: Run test — verify it passes**

```bash
npx vitest run __tests__/lead-gen/pipeline.test.ts
```
Expected: PASS — 1 test.

- [ ] **Step 5: Commit**

```bash
git add lib/lead-gen/pipeline.ts __tests__/lead-gen/pipeline.test.ts
git commit -m "feat(lead-gen): pipeline orchestrator — chains discover/enrich/persist"
```

---

## Task 9: CLI Entry Point

**Files:**
- Create: `scripts/lead-gen/run.ts`
- Modify: `package.json`

- [ ] **Step 1: Add tsx devDependency**

```bash
npm install --save-dev tsx
```

- [ ] **Step 2: Add script to package.json**

In `package.json`, add to `"scripts"`:
```json
"lead-gen": "tsx --env-file .env.local scripts/lead-gen/run.ts"
```

- [ ] **Step 3: Create CLI entry**

Create `scripts/lead-gen/run.ts`:
```typescript
import { runPipeline } from "../../lib/lead-gen/pipeline";

function parseArg(args: string[], flag: string): string[] {
  const idx = args.indexOf(flag);
  if (idx === -1 || idx + 1 >= args.length) return [];
  return args[idx + 1].split(",").map((s) => s.trim()).filter(Boolean);
}

async function main() {
  const args = process.argv.slice(2);
  const cities = parseArg(args, "--cities");
  const types = parseArg(args, "--types");

  if (!cities.length || !types.length) {
    console.error("Usage: npm run lead-gen -- --cities \"Austin TX,Dallas TX\" --types dental,medical");
    process.exit(1);
  }

  console.log(`[lead-gen] Starting run for cities: ${cities.join(", ")} | types: ${types.join(", ")}`);

  try {
    const results = await runPipeline({ cities, types });
    console.log("\n[lead-gen] Run complete:");
    for (const r of results) {
      console.log(`  ${r.city} / ${r.clinicType}: ${r.discovered} discovered, ${r.enriched} enriched`);
    }
  } catch (err) {
    console.error("[lead-gen] Fatal error:", err);
    process.exit(1);
  }
}

main();
```

- [ ] **Step 4: Verify the script loads without error (dry run)**

```bash
npm run lead-gen -- --help 2>&1 | head -5
```
Expected: prints usage error and exits (no TypeScript or import errors).

- [ ] **Step 5: Commit**

```bash
git add scripts/lead-gen/run.ts package.json package-lock.json
git commit -m "feat(lead-gen): CLI entry point with --cities and --types args"
```

---

## Task 10: Vercel Cron Endpoint

**Files:**
- Create: `app/api/cron/lead-gen/route.ts`
- Create: `__tests__/lead-gen/cron-route.test.ts`

- [ ] **Step 1: Write failing tests**

Create `__tests__/lead-gen/cron-route.test.ts`:
```typescript
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
```

- [ ] **Step 2: Run tests — verify they fail**

```bash
npx vitest run __tests__/lead-gen/cron-route.test.ts
```
Expected: FAIL — module not found.

- [ ] **Step 3: Implement cron route**

Create `app/api/cron/lead-gen/route.ts`:
```typescript
import { NextResponse } from "next/server";
import { runPipeline } from "@/lib/lead-gen/pipeline";

export async function POST(req: Request) {
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const cities = process.env.LEAD_GEN_CITIES?.split(",").map((s) => s.trim()).filter(Boolean) ?? [];
  const types = process.env.LEAD_GEN_TYPES?.split(",").map((s) => s.trim()).filter(Boolean) ?? [];

  if (!cities.length || !types.length) {
    return NextResponse.json(
      { error: "LEAD_GEN_CITIES and LEAD_GEN_TYPES must be configured" },
      { status: 400 }
    );
  }

  try {
    const results = await runPipeline({ cities, types });
    return NextResponse.json({ ok: true, results });
  } catch (err) {
    console.error("[cron/lead-gen] Pipeline failed:", err);
    return NextResponse.json({ error: "Pipeline failed" }, { status: 500 });
  }
}
```

- [ ] **Step 4: Run tests — verify they pass**

```bash
npx vitest run __tests__/lead-gen/cron-route.test.ts
```
Expected: PASS — 5 tests.

- [ ] **Step 5: Commit**

```bash
git add app/api/cron/lead-gen/route.ts __tests__/lead-gen/cron-route.test.ts
git commit -m "feat(lead-gen): Vercel Cron API route with CRON_SECRET guard"
```

---

## Task 11: Vercel Cron Config

**Files:**
- Create: `vercel.json`

- [ ] **Step 1: Create vercel.json**

Create `vercel.json`:
```json
{
  "crons": [
    {
      "path": "/api/cron/lead-gen",
      "schedule": "0 6 * * 1"
    }
  ]
}
```

This runs every Monday at 06:00 UTC. Vercel automatically sends the `CRON_SECRET` as `Authorization: Bearer <secret>` on Pro plan.

- [ ] **Step 2: Run full test suite to verify nothing broken**

```bash
npm test
```
Expected: all tests pass.

- [ ] **Step 3: Commit**

```bash
git add vercel.json
git commit -m "feat(lead-gen): add Vercel Cron schedule — weekly Monday 06:00 UTC"
```

---

## Task 12: Environment Variables Setup

No code changes — configuration only.

- [ ] **Step 1: Add to `.env.local`**

Add to `.env.local` (never commit this file):
```
GOOGLE_PLACES_API_KEY=your_key_here
SGAI_API_KEY=your_key_here
LEAD_GEN_CITIES=Austin TX,Dallas TX
LEAD_GEN_TYPES=dental,medical
CRON_SECRET=your_random_secret_here
```

- [ ] **Step 2: Add to Vercel environment variables**

In the Vercel dashboard for `clinicrelay` project → Settings → Environment Variables, add:
- `GOOGLE_PLACES_API_KEY`
- `SGAI_API_KEY`
- `LEAD_GEN_CITIES` (comma-separated cities)
- `LEAD_GEN_TYPES` (e.g. `dental,medical`)

Note: `CRON_SECRET` is set automatically by Vercel on Pro plan.

- [ ] **Step 3: Enable Google Places API**

In Google Cloud Console:
1. Enable "Places API (New)" for your project
2. Create an API key restricted to "Places API (New)"
3. Optionally restrict by IP or referrer

- [ ] **Step 4: Get ScrapeGraphAI API key**

Sign up at `scrapegraphai.com`, copy API key from dashboard, add to env vars above.

---

## Post-Implementation Smoke Test

Once all env vars are set and migrations applied:

```bash
# Test with a single city to verify end-to-end
npm run lead-gen -- --cities "Austin TX" --types dental
```

Expected output:
```
[lead-gen] Starting run for cities: Austin TX | types: dental
[lead-gen] Discovering dental clinics in Austin TX...
[lead-gen] Found N clinics. Enriching...
[lead-gen] Enriched M/N. Persisting...
[lead-gen] Done: Austin TX / dental — N discovered, M enriched.
```

Verify rows appear in Supabase `outbound_prospects` table and a row in `prospect_runs`.
