import { useMemo } from "react";
import type { Trial, TrialStatus } from "../types";
import type { Filters } from "../utils/filters";

interface Props {
  trials: Trial[];
  filters: Filters;
  onChange: (f: Filters) => void;
}

const STATUS_OPTIONS: { value: TrialStatus; label: string }[] = [
  { value: "scheduled", label: "Scheduled" },
  { value: "vacated", label: "Vacated" },
  { value: "settled", label: "Settled" },
  { value: "unknown", label: "Unknown" },
];

export function FilterBar({ trials, filters, onChange }: Props) {
  const courts = useMemo(() => {
    const map = new Map<string, Trial["court"]>();
    for (const t of trials) {
      if (!map.has(t.court.id)) map.set(t.court.id, t.court);
    }
    return [...map.values()].sort((a, b) =>
      a.shortName.localeCompare(b.shortName),
    );
  }, [trials]);

  const federalCourts = courts.filter((c) => c.type === "federal");
  const stateCourts = courts.filter((c) => c.type === "state");
  const visibleCourts =
    filters.courtType === "federal"
      ? federalCourts
      : filters.courtType === "state"
        ? stateCourts
        : courts;

  function setCourtType(t: Filters["courtType"]) {
    onChange({ ...filters, courtType: t, courtIds: new Set() });
  }

  function toggleCourt(id: string) {
    const next = new Set(filters.courtIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    onChange({ ...filters, courtIds: next });
  }

  function toggleStatus(s: TrialStatus) {
    const next = new Set(filters.statuses);
    if (next.has(s)) next.delete(s);
    else next.add(s);
    onChange({ ...filters, statuses: next });
  }

  return (
    <aside className="w-72 shrink-0 flex flex-col gap-6">
      {/* Search */}
      <div>
        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
          Search
        </label>
        <input
          type="text"
          placeholder="Case name or docket…"
          value={filters.search}
          onChange={(e) => onChange({ ...filters, search: e.target.value })}
          className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Court type */}
      <div>
        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
          Jurisdiction
        </label>
        <div className="flex rounded-lg overflow-hidden border border-gray-200 text-sm font-medium">
          {(["all", "federal", "state"] as const).map((v) => (
            <button
              key={v}
              onClick={() => setCourtType(v)}
              className={`flex-1 py-1.5 capitalize transition-colors ${
                filters.courtType === v
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-600 hover:bg-gray-50"
              }`}
            >
              {v}
            </button>
          ))}
        </div>
      </div>

      {/* Court selector */}
      <div>
        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
          Court{" "}
          {filters.courtIds.size > 0 && (
            <button
              onClick={() => onChange({ ...filters, courtIds: new Set() })}
              className="ml-1 text-blue-500 hover:text-blue-700 normal-case font-normal"
            >
              Clear
            </button>
          )}
        </label>
        <div className="flex flex-col gap-1 max-h-52 overflow-y-auto pr-1">
          {visibleCourts.map((c) => (
            <label key={c.id} className="flex items-start gap-2 cursor-pointer group">
              <input
                type="checkbox"
                checked={filters.courtIds.has(c.id)}
                onChange={() => toggleCourt(c.id)}
                className="mt-0.5 shrink-0 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700 group-hover:text-gray-900 leading-snug">
                {c.shortName}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Date range */}
      <div>
        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
          Date Range
        </label>
        <div className="flex flex-col gap-2">
          <div>
            <span className="text-xs text-gray-400 mb-0.5 block">From</span>
            <input
              type="date"
              value={filters.dateFrom}
              onChange={(e) => onChange({ ...filters, dateFrom: e.target.value })}
              className="w-full rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <span className="text-xs text-gray-400 mb-0.5 block">To</span>
            <input
              type="date"
              value={filters.dateTo}
              onChange={(e) => onChange({ ...filters, dateTo: e.target.value })}
              className="w-full rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Status */}
      <div>
        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
          Status
        </label>
        <div className="flex flex-col gap-1">
          {STATUS_OPTIONS.map(({ value, label }) => (
            <label key={value} className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.statuses.has(value)}
                onChange={() => toggleStatus(value)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">{label}</span>
            </label>
          ))}
        </div>
      </div>
    </aside>
  );
}
