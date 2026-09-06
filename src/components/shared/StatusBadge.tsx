import React from "react";
import type { MarginStatus } from "@/types/margin";
import { CheckCircle2, AlertTriangle, AlertOctagon } from "lucide-react";

interface StatusBadgeProps {
  status: MarginStatus;
  marginPct?: number;
}

export function StatusBadge({ status, marginPct }: StatusBadgeProps) {
  if (status === "healthy") {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
        <CheckCircle2 className="w-3.5 h-3.5" aria-hidden="true" />
        <span>Margin Sehat {marginPct !== undefined ? `(${marginPct.toFixed(1)}%)` : ""}</span>
      </span>
    );
  }

  if (status === "warning") {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 dark:bg-amber-950/70 dark:text-amber-300 border border-amber-300 dark:border-amber-800">
        <AlertTriangle className="w-3.5 h-3.5" aria-hidden="true" />
        <span>Margin Waspada {marginPct !== undefined ? `(${marginPct.toFixed(1)}%)` : ""}</span>
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-100 text-rose-800 dark:bg-rose-950/70 dark:text-rose-300 border border-rose-300 dark:border-rose-800">
      <AlertOctagon className="w-3.5 h-3.5" aria-hidden="true" />
      <span>Margin Kritis {marginPct !== undefined ? `(${marginPct.toFixed(1)}%)` : ""}</span>
    </span>
  );
}
