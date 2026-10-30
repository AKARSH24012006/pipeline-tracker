-- Pipeline database schema (PostgreSQL)
-- Applied automatically on first request by src/lib/db.ts, or manually:
--   psql "$DATABASE_URL" -f db/schema.sql

CREATE TABLE IF NOT EXISTS users (
  id            BIGSERIAL PRIMARY KEY,
  name          TEXT        NOT NULL,
  email         TEXT        NOT NULL UNIQUE,
  password_hash TEXT        NOT NULL,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS applications (
  id         BIGSERIAL PRIMARY KEY,
  user_id    BIGINT      NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  company    TEXT        NOT NULL,
  role       TEXT        NOT NULL,
  status     TEXT        NOT NULL DEFAULT 'applied'
             CHECK (status IN ('wishlist','applied','oa','interview','offer','rejected')),
  link       TEXT,
  deadline   DATE,
  notes      TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS applications_user_idx ON applications (user_id, status);
