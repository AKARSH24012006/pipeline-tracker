import Logo from "./Logo";

export default function AuthShell({ title, sub, children }: { title: string; sub: string; children: React.ReactNode }) {
  return (
    <div className="grid min-h-screen place-items-center px-5 py-10">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex justify-center"><Logo /></div>
        <div className="rounded-3xl border border-line bg-white p-7 shadow-xl shadow-ink/5">
          <h1 className="font-display text-2xl font-bold">{title}</h1>
          <p className="mb-6 mt-1 text-sm text-muted">{sub}</p>
          {children}
        </div>
      </div>
    </div>
  );
}
