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
