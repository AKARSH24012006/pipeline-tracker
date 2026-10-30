"use client";

import { updateStatus } from "@/app/actions/applications";
import { STATUSES, type Status } from "@/lib/status";

/** Changing the dropdown submits immediately — moves the card to its new column. */
export default function StatusSelect({ id, status, label }: { id: string; status: Status; label: string }) {
  return (
    <form action={updateStatus} className="min-w-0 flex-1">
      <input type="hidden" name="id" value={id} />
      <select
        name="status"
        defaultValue={status}
        aria-label={`Move ${label} to stage`}
        onChange={(e) => e.currentTarget.form?.requestSubmit()}
        className="w-full rounded-lg border border-line bg-canvas px-2 py-1 text-xs font-medium outline-none focus:border-ink"
      >
        {STATUSES.map((s) => (
          <option key={s.id} value={s.id}>{s.label}</option>
        ))}
      </select>
    </form>
  );
}
