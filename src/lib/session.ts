import "server-only";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { createHash } from "node:crypto";

const COOKIE = "pipeline_session";
const MAX_AGE = 60 * 60 * 24 * 7; // 7 days

export type Session = { userId: string; name: string };

function secretKey() {
  const raw =
    process.env.AUTH_SECRET ??
    // Fallback keeps preview deploys working; set AUTH_SECRET in production.
    createHash("sha256").update(`pipeline:${process.env.DATABASE_URL ?? "dev"}`).digest("hex");
  return new TextEncoder().encode(raw);
}

export async function createSession(session: Session) {
  const token = await new SignJWT(session)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${MAX_AGE}s`)
    .sign(secretKey());

  (await cookies()).set(COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: MAX_AGE,
  });
}

export async function verifyToken(token: string | undefined): Promise<Session | null> {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secretKey());
    return { userId: String(payload.userId), name: String(payload.name) };
  } catch {
    return null;
  }
}

export async function getSession() {
  return verifyToken((await cookies()).get(COOKIE)?.value);
}

export async function destroySession() {
  (await cookies()).delete(COOKIE);
}

export const SESSION_COOKIE = COOKIE;
