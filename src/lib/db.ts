import "server-only";
import postgres from "postgres";

/**
 * Single Postgres connection pool, reused across hot reloads and
 * serverless invocations. Works with Neon, Supabase or any Postgres URL.
 */
const globalForDb = globalThis as unknown as { sql?: postgres.Sql; schemaReady?: Promise<void> };

function createClient() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL is not set. See README → Environment variables.");
  const isLocal = /localhost|127\.0\.0\.1|host=\/tmp/.test(url);
  return postgres(url, {
    ssl: isLocal ? false : "require",
    max: 5,
    idle_timeout: 20,
    prepare: false, // required for pooled (pgbouncer) connections
  });
}

function client() {
  globalForDb.sql ??= createClient();
  return globalForDb.sql;
}

/**
 * Lazy proxy: the pool is only created on the first query, so `next build`
 * never needs a database and a missing env var fails at request time.
 */
export const sql = new Proxy((() => {}) as unknown as postgres.Sql, {
  apply: (_t, thisArg, args) => Reflect.apply(client() as unknown as (...a: unknown[]) => unknown, thisArg, args),
  get: (_t, prop) => Reflect.get(client(), prop),
});

const SCHEMA = `
CREATE TABLE IF NOT EXISTS users (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS applications (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  company TEXT NOT NULL,
  role TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'applied'
    CHECK (status IN ('wishlist','applied','oa','interview','offer','rejected')),
  link TEXT,
  deadline DATE,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS applications_user_idx ON applications (user_id, status);
`;

/** Idempotent schema bootstrap — runs once per server instance. */
export function ensureSchema() {
  globalForDb.schemaReady ??= sql.unsafe(SCHEMA).then(() => undefined);
  return globalForDb.schemaReady;
}
