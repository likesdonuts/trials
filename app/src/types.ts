export type CourtType = "federal" | "state";

export type TrialStatus = "scheduled" | "vacated" | "settled" | "unknown";

export interface Court {
  id: string;
  name: string;
  shortName: string;
  type: CourtType;
  state: string;
  division?: string;
}

/**
 * A single trial event in the canonical normalized format.
 *
 * Every source file (CSV, XLSX, PDF) is mapped into this shape by the
 * normalization pipeline before being stored in public/data/trials.json.
 */
export interface Trial {
  /** Synthetic stable identifier (source filename + index). */
  id: string;

  /** Case/docket number exactly as it appears in the source. */
  docketNumber: string;

  /** Case caption / title as it appears in the source. */
  caseName: string;

  /** ISO 8601 date string: "YYYY-MM-DD". */
  trialDate: string;

  /** 24-hour "HH:MM" string when the source provides a time. */
  trialTime?: string;

  court: Court;

  /** Raw event-type label from the source ("Jury Trial", "Non-Jury Trial", etc.). */
  eventType: string;

  judge?: string;

  /** Courtroom, department number, or division label. */
  department?: string;

  status: TrialStatus;

  /** Original filename for provenance / debugging. */
  sourceFile: string;
}
