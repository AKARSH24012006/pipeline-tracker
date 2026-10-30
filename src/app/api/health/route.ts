import { NextResponse } from "next/server";
import { ensureSchema, sql } from "@/lib/db";

export const dynamic = "force-dynamic";

/** Liveness + database connectivity check: GET /api/health */
export async function GET() {
  const started = Date.now();
  try {
    await ensureSchema();
    const [{ users }] = await sql<{ users: number }[]>`SELECT count(*)::int AS users FROM users`;
    return NextResponse.json({ status: "ok", database: "connected", users, latencyMs: Date.now() - started });
  } catch (err) {
    console.error("health check failed", err);
    return NextResponse.json({ status: "error", database: "unreachable" }, { status: 503 });
  }
}
