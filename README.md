# ClinicRelay Landing

Marketing and lead-capture landing page for ClinicRelay, built with Next.js App Router.

## Stack

- Next.js 16
- React 19
- Tailwind CSS v4
- Framer Motion
- Phosphor Icons
- Supabase (lead submission API)

## Local development

```bash
npm install
npm run dev
```

Open http://localhost:3000

## Environment variables

Create `.env.local`:

```bash
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
```

Notes:
- `/api/leads` uses `SUPABASE_SERVICE_ROLE_KEY` server-side.
- If Supabase env vars are missing, lead submissions return a safe error response.

## Scripts

```bash
npm run dev      # local dev
npm run lint     # eslint
npm run test     # vitest
npm run build    # production build
npm run start    # run built app
```

## Project structure

- `app/` — routes, layout, global styles, API route
- `components/landing/` — landing page sections and UI
- `components/ui/` — reusable UI primitives (shadcn-style)
- `context/` — modal context
- `lib/content/clinicrelay-landing.ts` — structured page content
- `lib/supabase/` — Supabase clients
- `__tests__/` — API tests

## Deployment

Deployed on Vercel.

- Production: https://clinicrelay-landing.vercel.app
- Repo: https://github.com/micahjatau/clinicrelay
