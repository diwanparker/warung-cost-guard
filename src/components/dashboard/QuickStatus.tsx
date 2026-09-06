import React from "react";
import { Layers, AlertTriangle, Percent, CheckCircle } from "lucide-react";

interface QuickStatusProps {
  totalCommodities: number;
  alertCount: number;
  avgMarginPct: number;
  targetMarginPct: number;
}

export function QuickStatus({
  totalCommodities,
  alertCount,
  avgMarginPct,
  targetMarginPct,
}: QuickStatusProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
          <Layers className="w-5 h-5" aria-hidden="true" />
        </div>
        <div>
          <div className="text-xl font-bold text-slate-900 dark:text-white">
            {totalCommodities}
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400">Komoditas Pokok</div>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
          <AlertTriangle className="w-5 h-5" aria-hidden="true" />
        </div>
        <div>
          <div className="text-xl font-bold text-amber-600 dark:text-amber-400">
            {alertCount}
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400">Margin Tertekan</div>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
          <Percent className="w-5 h-5" aria-hidden="true" />
        </div>
        <div>
          <div className="text-xl font-bold text-slate-900 dark:text-white">
            {avgMarginPct.toFixed(1)}%
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400">
            Rata-rata Margin (Target {targetMarginPct}%)
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-teal-100 dark:bg-teal-950 text-teal-600 dark:text-teal-400 flex items-center justify-center shrink-0">
          <CheckCircle className="w-5 h-5" aria-hidden="true" />
        </div>
        <div>
          <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1">
            <span>SP2KP • PIHPS</span>
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400">
            Bapanas & BPS Terhubung
          </div>
        </div>
      </div>
    </div>
  );
}
