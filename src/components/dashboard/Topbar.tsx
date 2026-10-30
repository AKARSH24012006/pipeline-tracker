import Logo from "@/components/Logo";
import { logout } from "@/app/actions/auth";

export default function Topbar({ name }: { name: string }) {
  const initials = name.split(" ").map((p) => p[0]).slice(0, 2).join("").toUpperCase();
  return (
    <header className="border-b border-line bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-3.5">
        <Logo href="/dashboard" />
        <div className="flex items-center gap-3">
          <span className="hidden text-sm text-muted sm:block">{name}</span>
          <span className="grid h-9 w-9 place-items-center rounded-full bg-lime text-sm font-bold" aria-hidden="true">
            {initials}
          </span>
          <form action={logout}>
            <button type="submit" className="btn-ghost py-2">Log out</button>
          </form>
        </div>
      </div>
    </header>
  );
}
