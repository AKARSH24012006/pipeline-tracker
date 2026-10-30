import Link from "next/link";
import Logo from "@/components/Logo";
import { STATUSES } from "@/lib/status";

const problems = [
  ["📋", "Applications scattered", "Spreadsheets, emails, LinkedIn and portals — nobody knows what was sent where."],
  ["⏰", "Deadlines slip past", "OA links expire and application windows close while you're busy with exams."],
  ["📉", "No idea what's working", "Without numbers you can't tell if your resume is getting responses."],
];

const features = [
  ["Kanban pipeline", "Move each application from Wishlist to Offer with one click."],
  ["Deadline radar", "Everything due in the next 7 days, sorted, on your dashboard."],
  ["Response rate", "See what share of applications get an OA, interview or reply."],
  ["Private by default", "Passwords are hashed with bcrypt; every query is scoped to your account."],
];

export default function Landing() {
  return (
    <div className="min-h-screen">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-5 py-5">
        <Logo />
        <nav className="flex items-center gap-2">
          <Link href="/login" className="btn-ghost">Log in</Link>
          <Link href="/signup" className="btn-primary">Sign up free</Link>
        </nav>
      </header>

      <main>
        <section className="mx-auto max-w-6xl px-5 pb-16 pt-10 text-center md:pt-16">
          <p className="mx-auto inline-block rounded-full bg-lime px-3 py-1 text-xs font-bold uppercase tracking-wider">
            For students applying this season
          </p>
          <h1 className="mx-auto mt-6 max-w-3xl font-display text-5xl font-bold leading-[1.02] tracking-tight md:text-7xl">
            Every application. One pipeline.
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-lg text-muted">
            Stop losing track of internships in spreadsheets. Pipeline shows where every application stands,
            what&apos;s due this week, and whether your resume is actually working.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link href="/signup" className="btn-lime px-6 py-3.5 text-base">Start tracking — free</Link>
            <Link href="/login" className="btn-ghost px-6 py-3.5 text-base">I have an account</Link>
          </div>

          <BoardPreview />
        </section>

        <section className="border-y border-line bg-white py-20">
          <div className="mx-auto max-w-6xl px-5">
            <h2 className="text-center font-display text-3xl font-bold md:text-4xl">The problem</h2>
            <div className="mt-10 grid gap-5 md:grid-cols-3">
              {problems.map(([icon, title, body]) => (
                <div key={title} className="rounded-2xl border border-line p-6">
                  <span className="text-2xl" aria-hidden="true">{icon}</span>
                  <h3 className="mt-3 font-semibold">{title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted">{body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-5 py-20">
          <h2 className="text-center font-display text-3xl font-bold md:text-4xl">What Pipeline does</h2>
          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            {features.map(([title, body]) => (
              <div key={title} className="flex gap-4 rounded-2xl bg-forest p-6 text-white">
                <span className="mt-1 h-3 w-3 shrink-0 rounded-full bg-lime" aria-hidden="true" />
                <div>
                  <h3 className="font-semibold">{title}</h3>
                  <p className="mt-1 text-sm text-white/70">{body}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-14 text-center">
            <Link href="/signup" className="btn-primary px-6 py-3.5 text-base">Create your free account</Link>
          </div>
        </section>
      </main>

      <footer className="border-t border-line py-8 text-center text-sm text-muted">
        © {new Date().getFullYear()} Pipeline · Built with Next.js & Postgres
      </footer>
    </div>
  );
}

function BoardPreview() {
  const sample: Record<string, string[]> = {
    wishlist: ["Razorpay"], applied: ["Zepto", "CRED"], oa: ["Atlassian"],
    interview: ["Flipkart"], offer: ["Swiggy"], rejected: ["Meesho"],
  };
  return (
    <div className="mx-auto mt-14 max-w-5xl overflow-x-auto rounded-3xl border border-line bg-white p-4 text-left shadow-xl shadow-ink/5">
      <div className="grid min-w-[720px] grid-cols-6 gap-3">
        {STATUSES.map((s) => (
          <div key={s.id} className="rounded-2xl bg-canvas p-3">
            <p className="flex items-center gap-1.5 text-xs font-semibold">
              <span className={`h-2 w-2 rounded-full ${s.dot}`} />
              {s.label}
            </p>
            {sample[s.id].map((c) => (
              <div key={c} className="mt-2 rounded-xl border border-line bg-white px-3 py-2 text-sm font-medium">
                {c}
                <span className="block text-[11px] font-normal text-muted">SDE Intern</span>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
