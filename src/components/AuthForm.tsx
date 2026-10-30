"use client";

import Link from "next/link";
import { useActionState } from "react";
import type { AuthState } from "@/app/actions/auth";

type Props = {
  mode: "login" | "signup";
  action: (state: AuthState, form: FormData) => Promise<AuthState>;
};

export default function AuthForm({ mode, action }: Props) {
  const [state, formAction, pending] = useActionState(action, {});
  const isSignup = mode === "signup";

  return (
    <form action={formAction} className="space-y-4" noValidate>
      {isSignup && (
        <Field label="Full name" name="name" autoComplete="name" defaultValue={state.fields?.name} />
      )}
      <Field label="Email" name="email" type="email" autoComplete="email" defaultValue={state.fields?.email} />
      <Field
        label="Password"
        name="password"
        type="password"
        autoComplete={isSignup ? "new-password" : "current-password"}
        hint={isSignup ? "At least 8 characters" : undefined}
      />

      {state.error && (
        <p role="alert" className="rounded-xl bg-rose-50 px-3.5 py-2.5 text-sm font-medium text-rose-700">
          {state.error}
        </p>
      )}

      <button type="submit" disabled={pending} className="btn-primary w-full py-3">
        {pending ? "Please wait…" : isSignup ? "Create account" : "Log in"}
      </button>

      <p className="text-center text-sm text-muted">
        {isSignup ? "Already have an account? " : "New to Pipeline? "}
        <Link href={isSignup ? "/login" : "/signup"} className="font-semibold text-ink underline underline-offset-4">
          {isSignup ? "Log in" : "Sign up free"}
        </Link>
      </p>
    </form>
  );
}

function Field(props: {
  label: string; name: string; type?: string; autoComplete?: string; defaultValue?: string; hint?: string;
}) {
  const { label, hint, ...input } = props;
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium">{label}</span>
      <input {...input} id={input.name} required className="field" />
      {hint && <span className="mt-1 block text-xs text-muted">{hint}</span>}
    </label>
  );
}
