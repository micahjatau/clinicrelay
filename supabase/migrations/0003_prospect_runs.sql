create table prospect_runs (
  id               uuid primary key default gen_random_uuid(),
  city             text not null,
  clinic_type      text not null,
  count_discovered integer not null default 0,
  count_enriched   integer not null default 0,
  ran_at           timestamptz not null default now()
);

alter table prospect_runs enable row level security;
