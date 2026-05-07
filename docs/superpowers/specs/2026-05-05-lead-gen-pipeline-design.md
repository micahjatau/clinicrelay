# Lead Gen Pipeline — Design Spec
**Date:** 2026-05-05
**Status:** Approved

---

## Goal

Build an outbound lead generation pipeline that discovers dental and medical clinics via Google Places API, enriches each clinic with owner/contact info via ScrapeGraphAI, and persists results to a dedicated Supabase table. Runs on-demand via CLI and on a weekly schedule via Vercel Cron.

---

## Architecture

```
scripts/lead-gen/
  run.ts                      ← CLI entry: npx ts-node run.ts --cities "Austin TX,Dallas TX" --types dental,medical
  pipeline.ts                 ← Orchestrator: Discover → Enrich → Persist
  stages/
    1-discover.ts             ← Google Places API, paginates all results per (city, type) query
    2-enrich.ts               ← ScrapeGraphAI extract per clinic website, tolerates failures
    3-persist.ts              ← Upsert by place_id, write run log entry
  lib/
    places.ts                 ← Google Places API client wrapper
    sgai.ts                   ← ScrapeGraphAI client wrapper

app/api/cron/lead-gen/
  route.ts                    ← Vercel Cron endpoint, reads LEAD_GEN_CITIES + LEAD_GEN_TYPES env vars

vercel.json                   ← Cron schedule (weekly)

supabase/migrations/
  0002_outbound_prospects.sql
  0003_prospect_runs.sql
```

---

## Data Model

### `outbound_prospects`

| Column | Type | Notes |
|---|---|---|
| `place_id` | text PRIMARY KEY | Google Places unique ID — dedup key for upserts |
| `clinic_name` | text NOT NULL | |
| `address` | text | |
| `phone` | text | |
| `website` | text | |
| `google_rating` | numeric(2,1) | |
| `review_count` | integer | |
| `owner_name` | text | Nullable — from ScrapeGraphAI |
| `email` | text | Nullable — from ScrapeGraphAI |
| `source_query` | text | Search string that found this record, e.g. "dental clinic, Austin TX" |
| `status` | text | `new` \| `contacted` \| `qualified` \| `disqualified` — default `new` |
| `last_contacted_at` | timestamptz | Nullable |
| `created_at` | timestamptz | DEFAULT now() |
| `updated_at` | timestamptz | Updated on upsert |

### `prospect_runs`

| Column | Type | Notes |
|---|---|---|
| `id` | uuid PRIMARY KEY | DEFAULT gen_random_uuid() |
| `city` | text NOT NULL | |
| `clinic_type` | text NOT NULL | `dental` \| `medical` |
| `count_discovered` | integer | Total Places results returned |
| `count_enriched` | integer | Clinics where ScrapeGraphAI returned owner/email |
| `ran_at` | timestamptz | DEFAULT now() |

---

## Pipeline Flow

### Stage 1 — Discover (`1-discover.ts`)

For each `(city, clinic_type)` pair:
- Search Google Places API: `"${clinic_type} clinic near ${city}"`
- Paginate through all result pages (up to 60 results per query via `next_page_token`)
- Fetch place details for each result: name, address, phone, website, rating, review count
- Return array of raw clinic objects tagged with `source_query`

### Stage 2 — Enrich (`2-enrich.ts`)

For each clinic that has a `website`:
- Call ScrapeGraphAI `extract` with prompt: extract practice owner or practice manager name, and any contact email address
- On success: attach `owner_name` and `email` to the record
- On failure (no website, ScrapeGraphAI error, timeout): leave `owner_name` and `email` as `null` — record is still persisted

Enrichment failures never drop a record from the pipeline.

### Stage 3 — Persist (`3-persist.ts`)

- Upsert all records into `outbound_prospects` by `place_id` (on conflict update all fields except `status`, `last_contacted_at`, `created_at`)
- Write one row to `prospect_runs` per `(city, clinic_type)` pair with discovered/enriched counts

---

## Triggers

### Manual CLI

```bash
npx ts-node scripts/lead-gen/run.ts \
  --cities "Austin TX,Dallas TX,Houston TX" \
  --types dental,medical
```

Runs synchronously, logs progress to stdout.

### Vercel Cron (scheduled)

`vercel.json`:
```json
{
  "crons": [{
    "path": "/api/cron/lead-gen",
    "schedule": "0 6 * * 1"
  }]
}
```

Runs every Monday at 06:00 UTC. The route reads `LEAD_GEN_CITIES` and `LEAD_GEN_TYPES` environment variables for the city/type list.

The cron endpoint is protected by a `CRON_SECRET` header check — requests without the correct secret return 401.

---

## Environment Variables

| Variable | Used by | Notes |
|---|---|---|
| `GOOGLE_PLACES_API_KEY` | `lib/places.ts` | Enable Places API in Google Cloud Console |
| `SGAI_API_KEY` | `lib/sgai.ts` | ScrapeGraphAI API key |
| `LEAD_GEN_CITIES` | `app/api/cron/lead-gen/route.ts` | Comma-separated, e.g. `"Austin TX,Dallas TX"` |
| `LEAD_GEN_TYPES` | `app/api/cron/lead-gen/route.ts` | Comma-separated, e.g. `"dental,medical"` |
| `CRON_SECRET` | `app/api/cron/lead-gen/route.ts` | Vercel sets this automatically on Pro plan |
| `SUPABASE_SERVICE_ROLE_KEY` | `lib/supabase/admin.ts` | Already configured |

---

## Error Handling

- **Google Places pagination errors:** Log and stop pagination for that query; persist results collected so far.
- **ScrapeGraphAI failures:** Null out `owner_name`/`email`, continue to next clinic.
- **Supabase upsert errors:** Log and throw — run is considered failed, no partial run log written.
- **Cron endpoint errors:** Return 500; Vercel will retry once automatically.

---

## Out of Scope

- Outreach automation (email sending, sequences)
- Lead scoring
- Duplicate detection across different `place_id`s for the same physical clinic
- Non-US geographies
