import type { Trial, TrialStatus } from "../types";

export interface Filters {
  courtType: "all" | "federal" | "state";
  courtIds: Set<string>;
  dateFrom: string;
  dateTo: string;
  statuses: Set<TrialStatus>;
  search: string;
}

export function defaultFilters(): Filters {
  return {
    courtType: "all",
    courtIds: new Set(),
    dateFrom: "",
    dateTo: "",
    statuses: new Set<TrialStatus>(["scheduled", "vacated", "settled", "unknown"]),
    search: "",
  };
}

export function applyFilters(trials: Trial[], filters: Filters): Trial[] {
  const q = filters.search.trim().toLowerCase();
  return trials.filter((t) => {
    if (filters.courtType !== "all" && t.court.type !== filters.courtType) return false;
    if (filters.courtIds.size > 0 && !filters.courtIds.has(t.court.id)) return false;
    if (filters.dateFrom && t.trialDate < filters.dateFrom) return false;
    if (filters.dateTo && t.trialDate > filters.dateTo) return false;
    if (!filters.statuses.has(t.status)) return false;
    if (q) {
      const hay = `${t.caseName} ${t.docketNumber} ${t.court.name}`.toLowerCase();
      if (!hay.includes(q)) return false;
    }
    return true;
  });
}

export type SortKey = "trialDate" | "caseName" | "docketNumber" | "court";
export type SortDir = "asc" | "desc";

export function sortTrials(
  trials: Trial[],
  key: SortKey,
  dir: SortDir,
): Trial[] {
  const factor = dir === "asc" ? 1 : -1;
  return [...trials].sort((a, b) => {
    let av: string, bv: string;
    switch (key) {
      case "trialDate":
        av = a.trialDate;
        bv = b.trialDate;
        break;
      case "caseName":
        av = a.caseName.toLowerCase();
        bv = b.caseName.toLowerCase();
        break;
      case "docketNumber":
        av = a.docketNumber.toLowerCase();
        bv = b.docketNumber.toLowerCase();
        break;
      case "court":
        av = a.court.shortName.toLowerCase();
        bv = b.court.shortName.toLowerCase();
        break;
    }
    return factor * av.localeCompare(bv);
  });
}
