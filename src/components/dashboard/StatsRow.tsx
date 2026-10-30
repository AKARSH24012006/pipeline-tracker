import type { computeStats } from "@/lib/stats";

type Stats = ReturnType<typeof computeStats>;

export default function StatsRow({ stats }: { stats: Stats }) {
  const tiles = [
    { label: "Applications sent", value: stats.sent, sub: `${stats.total} tracked in total` },
    { label: "Response rate", value: `${stats.responseRate}%`, sub: "got an OA, interview or reply" },
    { label: "Interviews", value: stats.interviews, sub: "currently in progress" },
    { label: "Offers", value: stats.offers, sub: stats.offers ? "congrats! 🎉" : "keep going" },
  ];
  return (
    <section aria-label="Statistics" className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      {tiles.map((t, i) => (
        <div key={t.label} className={`rounded-2xl border p-5 ${i === 1 ? "border-forest bg-forest text-white" : "border-line bg-white"}`}>
          <p className={`text-xs font-semibold uppercase tracking-wider ${i === 1 ? "text-lime" : "text-muted"}`}>{t.label}</p>
          <p className="mt-2 font-display text-3xl font-bold">{t.value}</p>
          <p className={`mt-1 text-xs ${i === 1 ? "text-white/60" : "text-muted"}`}>{t.sub}</p>
        </div>
      ))}
    </section>
  );
}
