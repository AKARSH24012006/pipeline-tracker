/** Application stages, in board order. Shared by server and client code. */
export const STATUSES = [
  { id: "wishlist", label: "Wishlist", dot: "bg-slate-400" },
  { id: "applied", label: "Applied", dot: "bg-sky-500" },
  { id: "oa", label: "Online test", dot: "bg-violet-500" },
  { id: "interview", label: "Interview", dot: "bg-amber-500" },
  { id: "offer", label: "Offer", dot: "bg-emerald-500" },
  { id: "rejected", label: "Rejected", dot: "bg-rose-500" },
] as const;

export type Status = (typeof STATUSES)[number]["id"];
export const STATUS_IDS = STATUSES.map((s) => s.id) as [Status, ...Status[]];

export type Application = {
  id: string;
  company: string;
  role: string;
  status: Status;
  link: string | null;
  deadline: string | null; // YYYY-MM-DD
  notes: string | null;
  created_at: string;
};
