"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { ensureSchema, sql } from "@/lib/db";
import { getSession } from "@/lib/session";
import { STATUS_IDS } from "@/lib/status";

export type FormState = { error?: string; ok?: number };

const optional = (s: z.ZodString) =>
  z.preprocess((v) => (typeof v === "string" && v.trim() === "" ? undefined : v), s.optional());

const applicationSchema = z.object({
  company: z.string().trim().min(1, "Company is required").max(80),
  role: z.string().trim().min(1, "Role is required").max(80),
  status: z.enum(STATUS_IDS).default("applied"),
  link: optional(z.string().trim().url("Link must be a valid URL").max(500)),
  deadline: optional(z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date")),
  notes: optional(z.string().trim().max(500)),
});

/** Every mutation is scoped to the signed-in user — no cross-account access. */
async function requireUser() {
  const session = await getSession();
  if (!session) redirect("/login");
  await ensureSchema();
  return session.userId;
}

export async function createApplication(prev: FormState, form: FormData): Promise<FormState> {
  const userId = await requireUser();
  const parsed = applicationSchema.safeParse(Object.fromEntries(form));
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  const a = parsed.data;
  await sql`
    INSERT INTO applications (user_id, company, role, status, link, deadline, notes)
    VALUES (${userId}, ${a.company}, ${a.role}, ${a.status},
            ${a.link ?? null}, ${a.deadline ?? null}, ${a.notes ?? null})`;

  revalidatePath("/dashboard");
  return { ok: (prev.ok ?? 0) + 1 };
}

export async function updateStatus(form: FormData) {
  const userId = await requireUser();
  const id = z.coerce.number().int().positive().parse(form.get("id"));
  const status = z.enum(STATUS_IDS).parse(form.get("status"));

  await sql`
    UPDATE applications SET status = ${status}, updated_at = now()
    WHERE id = ${id} AND user_id = ${userId}`;
  revalidatePath("/dashboard");
}

export async function deleteApplication(form: FormData) {
  const userId = await requireUser();
  const id = z.coerce.number().int().positive().parse(form.get("id"));

  await sql`DELETE FROM applications WHERE id = ${id} AND user_id = ${userId}`;
  revalidatePath("/dashboard");
}
