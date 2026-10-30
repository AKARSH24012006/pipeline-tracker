import { daysUntil } from "@/lib/stats";
import type { Application } from "@/lib/status";

export default function Upcoming({ items }: { items: (Application & { due: Date })[] }) {
  return (
    <section className="rounded-2xl border border-line bg-white p-5">
      <h2 className="flex items-center gap-2 font-semibold">⏰ Due in the next 7 days</h2>
      {items.length === 0 ? (
        <p className="mt-3 text-sm text-muted">Nothing due this week. Add deadlines to applications to see them here.</p>
      ) : (
        <ul className="mt-3 space-y-2">
          {items.map((a) => {
            const d = daysUntil(a.deadline!);
            return (
              <li key={a.id} className="flex items-center justify-between gap-3 rounded-xl bg-canvas px-3 py-2.5 text-sm">
                <span className="min-w-0">
                  <span className="block truncate font-medium">{a.company}</span>
                  <span className="block truncate text-xs text-muted">{a.role}</span>
                </span>
                <span className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${d <= 1 ? "bg-rose-100 text-rose-700" : "bg-amber-100 text-amber-800"}`}>
                  {d === 0 ? "Today" : d === 1 ? "Tomorrow" : `${d} days`}
                </span>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
