"use server";

import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { z } from "zod";
import { ensureSchema, sql } from "@/lib/db";
import { createSession, destroySession } from "@/lib/session";

export type AuthState = { error?: string; fields?: { name?: string; email?: string } };

const signupSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters").max(60),
  email: z.string().trim().toLowerCase().email("Enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters").max(72),
});

const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email("Enter a valid email"),
  password: z.string().min(1, "Enter your password"),
});

export async function signup(_: AuthState, form: FormData): Promise<AuthState> {
  const raw = Object.fromEntries(form);
  const parsed = signupSchema.safeParse(raw);
  const fields = { name: String(raw.name ?? ""), email: String(raw.email ?? "") };
  if (!parsed.success) return { error: parsed.error.issues[0].message, fields };

  const { name, email, password } = parsed.data;
  await ensureSchema();

  const hash = await bcrypt.hash(password, 10);
  const rows = await sql<{ id: string }[]>`
    INSERT INTO users (name, email, password_hash)
    VALUES (${name}, ${email}, ${hash})
    ON CONFLICT (email) DO NOTHING
    RETURNING id`;
  if (rows.length === 0) return { error: "An account with this email already exists", fields };

  await createSession({ userId: String(rows[0].id), name });
  redirect("/dashboard?welcome=1");
}

export async function login(_: AuthState, form: FormData): Promise<AuthState> {
  const raw = Object.fromEntries(form);
  const parsed = loginSchema.safeParse(raw);
  const fields = { email: String(raw.email ?? "") };
  if (!parsed.success) return { error: parsed.error.issues[0].message, fields };

  await ensureSchema();
  const [user] = await sql<{ id: string; name: string; password_hash: string }[]>`
    SELECT id, name, password_hash FROM users WHERE email = ${parsed.data.email}`;

  const ok = user && (await bcrypt.compare(parsed.data.password, user.password_hash));
  if (!ok) return { error: "Incorrect email or password", fields };

  await createSession({ userId: String(user.id), name: user.name });
  redirect("/dashboard");
}

export async function logout() {
  await destroySession();
  redirect("/");
}
