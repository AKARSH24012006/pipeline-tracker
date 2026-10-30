import { deleteApplication } from "@/app/actions/applications";
import type { Application } from "@/lib/status";
import StatusSelect from "./StatusSelect";

export default function AppCard({ app }: { app: Application }) {
  return (
    <article className="rounded-xl border border-line bg-white p-3 shadow-sm" data-testid="app-card">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <h4 className="truncate text-sm font-semibold">{app.company}</h4>
          <p className="truncate text-xs text-muted">{app.role}</p>
        </div>
        <form action={deleteApplication}>
          <input type="hidden" name="id" value={app.id} />
          <button type="submit" aria-label={`Delete ${app.company}`} className="rounded-md px-1.5 text-muted hover:bg-rose-50 hover:text-rose-600">
            ×
          </button>
        </form>
      </div>

      {app.deadline && <p className="mt-2 text-[11px] text-muted">Due {formatDate(app.deadline)}</p>}
      {app.notes && <p className="mt-1 line-clamp-2 text-[11px] text-muted">{app.notes}</p>}

      <div className="mt-2.5 flex items-center gap-2">
        <StatusSelect id={app.id} status={app.status} label={app.company} />
        {app.link && (
          <a href={app.link} target="_blank" rel="noopener noreferrer" className="text-xs font-medium underline underline-offset-2">
            Link
          </a>
        )}
      </div>
    </article>
  );
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short" });
}
