import type { Metadata } from "next";
import AuthForm from "@/components/AuthForm";
import AuthShell from "@/components/AuthShell";
import { signup } from "@/app/actions/auth";

export const metadata: Metadata = { title: "Sign up" };

export default function SignupPage() {
  return (
    <AuthShell title="Create your account" sub="Free forever for students. Takes 20 seconds.">
      <AuthForm mode="signup" action={signup} />
    </AuthShell>
  );
}
