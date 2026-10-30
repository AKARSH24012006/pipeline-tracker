import { STATUSES, type Application } from "@/lib/status";
import AppCard from "./AppCard";

export default function Board({ apps }: { apps: Application[] }) {
  return (
    <section aria-label="Application board" className="overflow-x-auto pb-2">
      <div className="grid min-w-[960px] grid-cols-6 gap-3">
        {STATUSES.map((col) => {
          const items = apps.filter((a) => a.status === col.id);
          return (
            <div key={col.id} className="flex min-h-[260px] flex-col rounded-2xl bg-white/60 p-3 ring-1 ring-line">
              <h3 className="flex items-center justify-between px-1 text-sm font-semibold">
                <span className="flex items-center gap-1.5">
                  <span className={`h-2 w-2 rounded-full ${col.dot}`} aria-hidden="true" />
                  {col.label}
                </span>
                <span className="rounded-full bg-canvas px-2 py-0.5 text-xs text-muted">{items.length}</span>
              </h3>
              <div className="mt-3 flex flex-1 flex-col gap-2">
                {items.length === 0 ? (
                  <p className="rounded-xl border border-dashed border-line px-3 py-6 text-center text-xs text-muted">Empty</p>
                ) : (
                  items.map((a) => <AppCard key={a.id} app={a} />)
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
