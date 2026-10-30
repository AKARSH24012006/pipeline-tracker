# Pipeline: internship application tracker

**Finlatics ANDP · Project 5 · Capstone SaaS Launch**

Students applying for internships lose track of what they sent where. Applications are spread across
spreadsheets, email and job portals, OA links expire unnoticed, and nobody knows whether their resume is
actually getting responses. **Pipeline** puts every application on one board, with deadline alerts and a
live response rate.

## Features
- **Accounts:** email/password sign-up and login (bcrypt-hashed passwords, signed JWT in an httpOnly cookie)
- **Kanban board:** Wishlist → Applied → Online test → Interview → Offer / Rejected; a card moves when you change its stage dropdown
- **Add, update and delete applications** with company, role, stage, deadline, job link and notes
- **Deadline radar:** everything due in the next 7 days, soonest first
- **Analytics:** applications sent, response rate, interviews, offers
- **Health endpoint:** `GET /api/health` checks database connectivity

## Architecture
```
src/
├─ app/
│  ├─ page.tsx                  Landing page (problem → solution → CTA)
│  ├─ signup/ · login/          Auth pages (server actions + useActionState)
│  ├─ dashboard/page.tsx        Server component: loads the user's data, renders board
│  ├─ actions/auth.ts           signup / login / logout (zod-validated)
│  ├─ actions/applications.ts   create / updateStatus / delete (always scoped to user_id)
│  └─ api/health/route.ts       DB health check
├─ components/                  UI (dashboard/ holds Board, AppCard, StatsRow, Upcoming…)
├─ lib/
│  ├─ db.ts                     Lazy Postgres pool + idempotent schema bootstrap
│  ├─ session.ts                JWT session create/verify/destroy
│  ├─ stats.ts                  Pure analytics functions
│  └─ status.ts                 Shared stage definitions + types
└─ middleware.ts                Edge route guard for /dashboard
db/schema.sql                   Database schema (users, applications)
```

**Security:** every query that reads or writes applications filters on `user_id` taken from the verified
session, so no user can see or change another user's data. Inputs are validated with zod and SQL uses
parameterised tagged templates.

## Stack
Next.js 15 (App Router, Server Actions) · TypeScript · Tailwind CSS v4 · PostgreSQL (Neon) via `postgres` · bcryptjs · jose · zod

## Environment variables
| Name | Required | Description |
|---|---|---|
| `DATABASE_URL` | yes | Postgres connection string (Neon, Supabase, or local). `POSTGRES_URL` is also accepted |
| `AUTH_SECRET` | recommended | Random string, 32+ characters, used to sign session tokens. If unset, a key is derived from the database URL |

## Live
- App: https://pipeline-tracker-omega.vercel.app
- Health check: https://pipeline-tracker-omega.vercel.app/api/health

## Run locally
```bash
npm install
cp .env.example .env.local   # fill in DATABASE_URL and AUTH_SECRET
npm run dev                  # tables are created automatically on first request
```

## Deploy
Import the repo on Vercel, add a Neon Postgres database from the Storage tab (this sets `DATABASE_URL`),
add `AUTH_SECRET`, then deploy.
