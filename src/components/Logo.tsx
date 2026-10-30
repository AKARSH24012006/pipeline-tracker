import Link from "next/link";

export default function Logo({ href = "/" }: { href?: string }) {
  return (
    <Link href={href} className="flex items-center gap-2" aria-label="Pipeline home">
      <svg width="28" height="28" viewBox="0 0 28 28" aria-hidden="true">
        <rect width="28" height="28" rx="8" fill="#10130f" />
        <circle cx="8" cy="14" r="2.5" fill="#c6f135" />
        <circle cx="14" cy="14" r="2.5" fill="#c6f135" opacity=".7" />
        <circle cx="20" cy="14" r="2.5" fill="#c6f135" opacity=".4" />
      </svg>
      <span className="font-display text-lg font-bold tracking-tight">Pipeline</span>
    </Link>
  );
}
