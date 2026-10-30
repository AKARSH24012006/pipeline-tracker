import type { Application } from "./status";

/** Pure analytics over a user's applications — unit-testable, no I/O. */
export function computeStats(apps: Application[], today = new Date()) {
  const by = (s: Application["status"]) => apps.filter((a) => a.status === s).length;
  const sent = apps.filter((a) => a.status !== "wishlist").length;
  const responded = by("oa") + by("interview") + by("offer") + by("rejected");

  const start = new Date(today.toISOString().slice(0, 10));
  const inWeek = new Date(start);
  inWeek.setDate(inWeek.getDate() + 7);

  const upcoming = apps
    .filter((a) => a.deadline && !["offer", "rejected"].includes(a.status))
    .map((a) => ({ ...a, due: new Date(a.deadline!) }))
    .filter((a) => a.due >= start && a.due <= inWeek)
    .sort((x, y) => x.due.getTime() - y.due.getTime());

  return {
    total: apps.length,
    sent,
    interviews: by("interview"),
    offers: by("offer"),
    responseRate: sent ? Math.round((responded / sent) * 100) : 0,
    upcoming,
  };
}

export function daysUntil(date: string, today = new Date()) {
  const start = new Date(today.toISOString().slice(0, 10)).getTime();
  return Math.round((new Date(date).getTime() - start) / 86_400_000);
}
