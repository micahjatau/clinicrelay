create table clinicrelay_leads (
  id               uuid primary key default gen_random_uuid(),
  created_at       timestamptz default now(),
  name             text not null,
  clinic_name      text not null,
  role             text,
  email            text not null,
  phone            text,
  clinic_type      text,
  location_count   text,
  website_url      text,
  pain_points      text[],
  interest         text[],
  message          text,
  status           text default 'new'
);

alter table clinicrelay_leads enable row level security;
