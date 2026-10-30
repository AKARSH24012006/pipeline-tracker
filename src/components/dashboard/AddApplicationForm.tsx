"use client";

import { useActionState, useEffect, useRef } from "react";
import { createApplication } from "@/app/actions/applications";
import { STATUSES } from "@/lib/status";

export default function AddApplicationForm() {
  const [state, action, pending] = useActionState(createApplication, {});
  const formRef = useRef<HTMLFormElement>(null);

  // Clear the form after each successful save.
  useEffect(() => {
    if (state.ok) formRef.current?.reset();
  }, [state.ok]);

  return (
    <section className="rounded-2xl border border-line bg-white p-5">
      <h2 className="font-semibold">Add an application</h2>
      <form ref={formRef} action={action} className="mt-4 space-y-3" noValidate>
        <div className="grid gap-3 sm:grid-cols-2">
          <input name="company" placeholder="Company *" aria-label="Company" className="field" required />
          <input name="role" placeholder="Role, e.g. SDE Intern *" aria-label="Role" className="field" required />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <select name="status" defaultValue="applied" aria-label="Status" className="field">
            {STATUSES.map((s) => (
              <option key={s.id} value={s.id}>{s.label}</option>
            ))}
          </select>
          <input name="deadline" type="date" aria-label="Deadline" className="field" />
        </div>
        <input name="link" type="url" placeholder="Job link (optional)" aria-label="Job link" className="field" />
        <textarea name="notes" rows={2} placeholder="Notes (optional)" aria-label="Notes" className="field resize-none" />

        {state.error && <p role="alert" className="text-sm font-medium text-rose-700">{state.error}</p>}
        {state.ok && !state.error && <p role="status" className="text-sm font-medium text-forest">✓ Saved to your pipeline</p>}

        <button type="submit" disabled={pending} className="btn-lime w-full">
          {pending ? "Saving…" : "+ Add to pipeline"}
        </button>
      </form>
    </section>
  );
}
