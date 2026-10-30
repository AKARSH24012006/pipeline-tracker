import type { Metadata } from "next";
import AuthForm from "@/components/AuthForm";
import AuthShell from "@/components/AuthShell";
import { login } from "@/app/actions/auth";

export const metadata: Metadata = { title: "Log in" };

export default function LoginPage() {
  return (
    <AuthShell title="Welcome back" sub="Log in to see your pipeline.">
      <AuthForm mode="login" action={login} />
    </AuthShell>
  );
}
