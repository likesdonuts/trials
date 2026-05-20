import { useState } from "react";
import { useTrials } from "./hooks/useTrials";
import { FilterBar } from "./components/FilterBar";
import { StatsBar } from "./components/StatsBar";
import { TrialTable } from "./components/TrialTable";
import { defaultFilters, applyFilters } from "./utils/filters";
import type { Filters } from "./utils/filters";

export default function App() {
  const loadState = useTrials();
  const [filters, setFilters] = useState<Filters>(defaultFilters);

  if (loadState.status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-3 text-gray-400">
          <svg className="w-8 h-8 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
          </svg>
          <span className="text-sm">Loading trial calendar…</span>
        </div>
      </div>
    );
  }

  if (loadState.status === "error") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center text-red-500 text-sm">
          <p className="font-semibold text-base mb-1">Failed to load data</p>
          <p>{loadState.message}</p>
        </div>
      </div>
    );
  }

  const { data: trials } = loadState;
  const filtered = applyFilters(trials, filters);

  function resetFilters() {
    setFilters(defaultFilters());
  }

  const hasActiveFilters =
    filters.courtType !== "all" ||
    filters.courtIds.size > 0 ||
    filters.dateFrom !== "" ||
    filters.dateTo !== "" ||
    filters.search !== "" ||
    filters.statuses.size < 4;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-screen-xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center shadow">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-3m6 3l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-3m0-3v3m0 3h.01M12 10h.01"
                />
              </svg>
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900 leading-tight">
                Court Trial Calendar
              </h1>
              <p className="text-xs text-gray-400 leading-none mt-0.5">
                Upcoming trials · state &amp; federal courts
              </p>
            </div>
          </div>
          {hasActiveFilters && (
            <button
              onClick={resetFilters}
              className="text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors"
            >
              Reset filters
            </button>
          )}
        </div>
      </header>

      {/* Body */}
      <main className="max-w-screen-xl mx-auto px-6 py-8 flex gap-8 items-start">
        {/* Sidebar filters */}
        <FilterBar trials={trials} filters={filters} onChange={setFilters} />

        {/* Content */}
        <div className="flex-1 min-w-0 flex flex-col gap-4">
          <StatsBar total={trials.length} filtered={filtered.length} trials={filtered} />
          <TrialTable trials={filtered} />
        </div>
      </main>
    </div>
  );
}
