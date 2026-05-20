import type { Trial } from "../types";

interface Props {
  total: number;
  filtered: number;
  trials: Trial[];
}

export function StatsBar({ total, filtered, trials }: Props) {
  const federal = trials.filter((t) => t.court.type === "federal").length;
  const state = trials.filter((t) => t.court.type === "state").length;
  const scheduled = trials.filter((t) => t.status === "scheduled").length;

  return (
    <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
      <span className="font-semibold text-gray-800">
        {filtered.toLocaleString()}
        {filtered !== total && (
          <span className="text-gray-400 font-normal"> of {total.toLocaleString()}</span>
        )}{" "}
        trial{filtered !== 1 ? "s" : ""}
      </span>
      <Pill color="blue" label={`${federal} federal`} />
      <Pill color="violet" label={`${state} state`} />
      <Pill color="emerald" label={`${scheduled} scheduled`} />
    </div>
  );
}

function Pill({ color, label }: { color: string; label: string }) {
  const colors: Record<string, string> = {
    blue: "bg-blue-100 text-blue-700",
    violet: "bg-violet-100 text-violet-700",
    emerald: "bg-emerald-100 text-emerald-700",
  };
  return (
    <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${colors[color]}`}>
      {label}
    </span>
  );
}
