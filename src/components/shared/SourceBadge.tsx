import React from "react";
import type { PriceSource } from "@/types/market";

interface SourceBadgeProps {
  source: PriceSource | string;
  marketName?: string;
}

export function SourceBadge({ source, marketName }: SourceBadgeProps) {
  let badgeColor = "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-800";
  if (source === "PIHPS") {
    badgeColor = "bg-sky-50 text-sky-700 border-sky-200 dark:bg-sky-950/60 dark:text-sky-300 dark:border-sky-800";
  } else if (source === "Bapanas") {
    badgeColor = "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800";
  } else if (source === "SP2KP") {
    badgeColor = "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800";
  } else if (source === "BPS") {
    badgeColor = "bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/60 dark:text-indigo-300 dark:border-indigo-800";
  }

  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold border ${badgeColor}`}
      title={marketName ? `Sumber: ${source} (${marketName})` : `Sumber: ${source}`}
    >
      <span>{source}</span>
      {marketName && <span className="opacity-75 font-normal">• {marketName}</span>}
    </span>
  );
}
