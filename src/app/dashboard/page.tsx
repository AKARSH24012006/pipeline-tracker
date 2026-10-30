import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { ensureSchema, sql } from "@/lib/db";
import { getSession } from "@/lib/session";
import { computeStats } from "@/lib/stats";
import type { Application } from "@/lib/status";
import Topbar from "@/components/dashboard/Topbar";
import StatsRow from "@/components/dashboard/StatsRow";
import Upcoming from "@/components/dashboard/Upcoming";
import AddApplicationForm from "@/components/dashboard/AddApplicationForm";
import Board from "@/components/dashboard/Board";

export const metadata: Metadata = { title: "Dashboard" };
export const dynamic = "force-dynamic";

export default async function Dashboard({ searchParams }: { searchParams: Promise<{ welcome?: string }> }) {
  const session = await getSession();
  if (!session) redirect("/login");

  await ensureSchema();
  const apps = await sql<Application[]>`
    SELECT id::text, company, role, status, link, deadline::text, notes, created_at::text
    FROM applications
    WHERE user_id = ${session.userId}
    ORDER BY updated_at DESC`;

  const stats = computeStats(apps);
  const { welcome } = await searchParams;

  return (
    <div className="min-h-screen">
      <Topbar name={session.name} />
      <main className="mx-auto max-w-7xl space-y-6 px-5 py-8">
        <div>
          <h1 className="font-display text-3xl font-bold tracking-tight">
            {welcome ? `Welcome, ${session.name.split(" ")[0]} 👋` : "Your pipeline"}
          </h1>
          <p className="mt-1 text-muted">
            {apps.length === 0
              ? "Add your first application below to get started."
              : `Tracking ${apps.length} application${apps.length === 1 ? "" : "s"}.`}
          </p>
        </div>

        <StatsRow stats={stats} />

        <div className="grid items-start gap-6 lg:grid-cols-[1.4fr_1fr]">
          <AddApplicationForm />
          <Upcoming items={stats.upcoming} />
        </div>

        <Board apps={apps} />
      </main>
    </div>
  );
}
