import type { Court } from "../types";

export function CourtBadge({ court }: { court: Court }) {
  const isF = court.type === "federal";
  return (
    <span
      title={court.name}
      className={`inline-flex items-center gap-1 rounded px-2 py-0.5 text-xs font-medium ${
        isF
          ? "bg-blue-100 text-blue-800"
          : "bg-violet-100 text-violet-800"
      }`}
    >
      <span className="opacity-60 text-[10px] uppercase tracking-wide">
        {isF ? "Fed" : "State"}
      </span>
      {court.shortName}
    </span>
  );
}
