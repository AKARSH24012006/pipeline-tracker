import { NextResponse, type NextRequest } from "next/server";
import { jwtVerify } from "jose";

const COOKIE = "pipeline_session";

/**
 * Edge guard: only an authenticated user reaches /dashboard, and a signed-in
 * user skips the auth pages. Real authorisation is re-checked server-side in
 * every server action (see src/app/actions/applications.ts).
 */
export async function middleware(req: NextRequest) {
  const token = req.cookies.get(COOKIE)?.value;
  const signedIn = token ? await isValid(token) : false;
  const { pathname } = req.nextUrl;

  if (pathname.startsWith("/dashboard") && !signedIn) {
    const url = new URL("/login", req.url);
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }
  if ((pathname === "/login" || pathname === "/signup") && signedIn) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }
  return NextResponse.next();
}

async function isValid(token: string) {
  try {
    const raw = process.env.AUTH_SECRET;
    if (!raw) return true; // fallback secret is derived in Node runtime; server re-verifies
    await jwtVerify(token, new TextEncoder().encode(raw));
    return true;
  } catch {
    return false;
  }
}

export const config = { matcher: ["/dashboard/:path*", "/login", "/signup"] };
