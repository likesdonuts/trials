import type { TrialStatus } from "../types";

const CONFIG: Record<TrialStatus, { label: string; classes: string }> = {
  scheduled: {
    label: "Scheduled",
    classes: "bg-emerald-100 text-emerald-800 ring-emerald-300",
  },
  vacated: {
    label: "Vacated",
    classes: "bg-red-100 text-red-800 ring-red-300",
  },
  settled: {
    label: "Settled",
    classes: "bg-amber-100 text-amber-800 ring-amber-300",
  },
  unknown: {
    label: "Unknown",
    classes: "bg-gray-100 text-gray-600 ring-gray-300",
  },
};

export function StatusBadge({ status }: { status: TrialStatus }) {
  const { label, classes } = CONFIG[status] ?? CONFIG.unknown;
  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset ${classes}`}
    >
      {label}
    </span>
  );
}
