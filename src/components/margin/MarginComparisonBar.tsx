import React from "react";
import { formatRupiah } from "@/lib/margin/calculator";

interface MarginComparisonBarProps {
  effectiveCost: number;
  sellingPrice: number;
  marketReference: number;
  unit: string;
}

export function MarginComparisonBar({
  effectiveCost,
  sellingPrice,
  marketReference,
  unit,
}: MarginComparisonBarProps) {
  const maxVal = Math.max(effectiveCost, sellingPrice, marketReference) * 1.15;
  const costWidth = Math.min(100, Math.max(5, (effectiveCost / maxVal) * 100));
  const sellWidth = Math.min(100, Math.max(5, (sellingPrice / maxVal) * 100));
  const marketWidth = Math.min(100, Math.max(5, (marketReference / maxVal) * 100));

  return (
    <div className="space-y-2.5 text-xs py-2">
      <div>
        <div className="flex justify-between text-slate-500 dark:text-slate-400 mb-1">
          <span>Biaya Efektif Nyata (Modal + Susut)</span>
          <strong className="text-slate-700 dark:text-slate-200">{formatRupiah(effectiveCost)}/{unit}</strong>
        </div>
        <div className="h-2.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
          <div className="h-full bg-rose-500 rounded-full transition-all duration-300" style={{ width: `${costWidth}%` }} />
        </div>
      </div>

      <div>
        <div className="flex justify-between text-slate-500 dark:text-slate-400 mb-1">
          <span>Harga Jual Anda</span>
          <strong className="text-emerald-600 dark:text-emerald-400 font-bold">{formatRupiah(sellingPrice)}/{unit}</strong>
        </div>
        <div className="h-2.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
          <div className="h-full bg-emerald-500 rounded-full transition-all duration-300" style={{ width: `${sellWidth}%` }} />
        </div>
      </div>

      <div>
        <div className="flex justify-between text-slate-500 dark:text-slate-400 mb-1">
          <span>Referensi Pasar Lokal (Median SP2KP / PIHPS)</span>
          <strong className="text-blue-600 dark:text-blue-400">{formatRupiah(marketReference)}/{unit}</strong>
        </div>
        <div className="h-2.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
          <div className="h-full bg-blue-500 rounded-full transition-all duration-300" style={{ width: `${marketWidth}%` }} />
        </div>
      </div>
    </div>
  );
}
