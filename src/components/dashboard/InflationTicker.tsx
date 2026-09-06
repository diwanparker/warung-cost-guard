import React, { useEffect, useState } from "react";
import { TrendingUp, Info } from "lucide-react";
import type { BpsIndicator } from "@/types/bps";

export function InflationTicker() {
  const [indicator, setIndicator] = useState<BpsIndicator | null>(null);

  useEffect(() => {
    fetch("/api/bps?region=3500")
      .then((res) => res.json())
      .then((data) => setIndicator(data))
      .catch(() => {});
  }, []);

  const latestVal = indicator?.time_series?.[indicator.time_series.length - 1]?.value || 3.19;
  const latestPeriod = indicator?.time_series?.[indicator.time_series.length - 1]?.period || "2026-08";

  return (
    <div className="w-full bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border-l-4 border-amber-500 p-3 rounded-r-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs flex flex-col md:flex-row items-start md:items-center justify-between gap-2">
      <div className="flex items-center gap-2">
        <span className="p-1.5 rounded-md bg-amber-500/20 text-amber-600 dark:text-amber-400">
          <TrendingUp className="w-4 h-4" aria-hidden="true" />
        </span>
        <div className="text-xs">
          <span className="font-bold text-slate-800 dark:text-slate-200">
            Konteks Makro BPS ({latestPeriod}):
          </span>{" "}
          <span className="text-slate-600 dark:text-slate-400">
            Inflasi kelompok Makanan & Minuman Jawa Timur tercatat{" "}
            <strong className="text-amber-600 dark:text-amber-400 font-bold">{latestVal}% (y-on-y)</strong>
            . Tekanan utama disumbang komoditas cabai rawit dan ayam ras.
          </span>
        </div>
      </div>

      <div className="flex items-center gap-1 text-[11px] text-slate-500 dark:text-slate-400 shrink-0">
        <Info className="w-3.5 h-3.5" aria-hidden="true" />
        <span>Sumber: BPS WebAPI / DataRakyat</span>
      </div>
    </div>
  );
}
