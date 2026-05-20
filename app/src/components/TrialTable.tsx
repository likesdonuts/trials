import { useState } from "react";
import type { Trial } from "../types";
import type { SortKey, SortDir } from "../utils/filters";
import { sortTrials } from "../utils/filters";
import { StatusBadge } from "./StatusBadge";
import { CourtBadge } from "./CourtBadge";

const PAGE_SIZE = 50;

interface Props {
  trials: Trial[];
}

function formatDate(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function SortIcon({ active, dir }: { active: boolean; dir: SortDir }) {
  if (!active)
    return (
      <svg className="w-3.5 h-3.5 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4-4 4 4M16 15l-4 4-4-4" />
      </svg>
    );
  return dir === "asc" ? (
    <svg className="w-3.5 h-3.5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
    </svg>
  ) : (
    <svg className="w-3.5 h-3.5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
    </svg>
  );
}

const COLUMNS: { key: SortKey; label: string; width: string }[] = [
  { key: "trialDate", label: "Trial Date", width: "w-32" },
  { key: "docketNumber", label: "Docket #", width: "w-40" },
  { key: "caseName", label: "Case Name", width: "" },
  { key: "court", label: "Court", width: "w-52" },
];

export function TrialTable({ trials }: Props) {
  const [sortKey, setSortKey] = useState<SortKey>("trialDate");
  const [sortDir, setSortDir] = useState<SortDir>("asc");
  const [page, setPage] = useState(0);
  const [expanded, setExpanded] = useState<string | null>(null);

  function handleSort(key: SortKey) {
    if (key === sortKey) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
    setPage(0);
  }

  const sorted = sortTrials(trials, sortKey, sortDir);
  const pageCount = Math.ceil(sorted.length / PAGE_SIZE);
  const slice = sorted.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  if (trials.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-gray-400">
        <svg className="w-12 h-12 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
        <p className="text-sm font-medium">No trials match the current filters</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm bg-white">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50">
              {COLUMNS.map((col) => (
                <th
                  key={col.key}
                  className={`px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer select-none hover:bg-gray-100 transition-colors ${col.width}`}
                  onClick={() => handleSort(col.key)}
                >
                  <div className="flex items-center gap-1.5">
                    {col.label}
                    <SortIcon active={sortKey === col.key} dir={sortDir} />
                  </div>
                </th>
              ))}
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider w-28">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {slice.map((trial) => {
              const isExpanded = expanded === trial.id;
              return (
                <>
                  <tr
                    key={trial.id}
                    className={`hover:bg-blue-50/40 transition-colors cursor-pointer ${
                      isExpanded ? "bg-blue-50/60" : ""
                    }`}
                    onClick={() => setExpanded(isExpanded ? null : trial.id)}
                  >
                    <td className="px-4 py-3 text-gray-700 whitespace-nowrap font-medium">
                      {formatDate(trial.trialDate)}
                      {trial.trialTime && (
                        <span className="ml-1.5 text-xs text-gray-400">
                          {trial.trialTime}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 font-mono text-xs text-gray-600 whitespace-nowrap">
                      {trial.docketNumber || <span className="text-gray-300 italic">—</span>}
                    </td>
                    <td className="px-4 py-3 text-gray-800 max-w-xs">
                      <div className="line-clamp-2 leading-snug">{trial.caseName}</div>
                    </td>
                    <td className="px-4 py-3">
                      <CourtBadge court={trial.court} />
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={trial.status} />
                    </td>
                  </tr>
                  {isExpanded && (
                    <tr key={`${trial.id}-detail`} className="bg-blue-50/40">
                      <td colSpan={5} className="px-6 py-4">
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-8 gap-y-2 text-sm">
                          <Detail label="Full Court Name" value={trial.court.name} />
                          <Detail label="Court Type" value={trial.court.type === "federal" ? "Federal" : "State"} />
                          {trial.judge && <Detail label="Judge" value={trial.judge} />}
                          {trial.department && <Detail label="Department" value={trial.department} />}
                          <Detail label="Event Type" value={trial.eventType} />
                          <Detail label="Source" value={trial.sourceFile} mono />
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pageCount > 1 && (
        <div className="flex items-center justify-between text-sm text-gray-500">
          <span>
            Showing {page * PAGE_SIZE + 1}–{Math.min((page + 1) * PAGE_SIZE, sorted.length)} of{" "}
            {sorted.length}
          </span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={page === 0}
              className="px-3 py-1 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              ‹ Prev
            </button>
            {Array.from({ length: pageCount }, (_, i) => (
              <button
                key={i}
                onClick={() => setPage(i)}
                className={`w-8 h-8 rounded-lg text-xs font-medium transition-colors ${
                  i === page
                    ? "bg-blue-600 text-white"
                    : "border border-gray-200 bg-white hover:bg-gray-50 text-gray-600"
                }`}
              >
                {i + 1}
              </button>
            ))}
            <button
              onClick={() => setPage((p) => Math.min(pageCount - 1, p + 1))}
              disabled={page === pageCount - 1}
              className="px-3 py-1 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              Next ›
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function Detail({
  label,
  value,
  mono = false,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div>
      <dt className="text-xs font-medium text-gray-400 uppercase tracking-wide">{label}</dt>
      <dd className={`mt-0.5 text-gray-700 ${mono ? "font-mono text-xs" : ""}`}>{value}</dd>
    </div>
  );
}
