import React from "react";
import type { CommodityInfo } from "@/types/commodity";
import type { MarginInput, MarginResult } from "@/types/margin";
import type { MarketPriceResult } from "@/types/market";
import { formatRupiah } from "@/lib/margin/calculator";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { MarginComparisonBar } from "./MarginComparisonBar";
import { Calculator, Sparkles, RefreshCw, AlertCircle } from "lucide-react";

interface MarginCalculatorProps {
  commodity: CommodityInfo;
  marginInput: MarginInput;
  marginResult: MarginResult;
  marketPrice?: MarketPriceResult;
  onInputChange: (newInput: MarginInput) => void;
  onReset: () => void;
  onAskBob: () => void;
}

export function MarginCalculator({
  commodity,
  marginInput,
  marginResult,
  marketPrice,
  onInputChange,
  onReset,
  onAskBob,
}: MarginCalculatorProps) {
  const medianRef = marketPrice?.median_reference || commodity.defaultSellingPrice;

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <span className="p-2 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400">
            <Calculator className="w-5 h-5" aria-hidden="true" />
          </span>
          <div>
            <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
              Kalkulator Margin Deterministik: {commodity.name}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Perhitungan murni matematis (non-LLM) dengan penyesuaian susut & biaya transportasi.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <StatusBadge status={marginResult.status} marginPct={marginResult.gross_margin_pct} />
          <button
            type="button"
            onClick={onReset}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            title="Reset nilai ke standar pasar"
          >
            <RefreshCw className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>
      </div>

      {/* Input Form Fields */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Harga Beli Supplier (Rp/{commodity.unit})
          </label>
          <input
            type="number"
            value={marginInput.purchase_price}
            onChange={(e) =>
              onInputChange({
                ...marginInput,
                purchase_price: Number(e.target.value) || 0,
              })
            }
            className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-emerald-500"
          />
          <span className="text-[11px] text-slate-400 mt-0.5 block">Modal beli faktur</span>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Ongkos Angkut (Rp/{commodity.unit})
          </label>
          <input
            type="number"
            value={marginInput.transport_cost ?? 0}
            onChange={(e) =>
              onInputChange({
                ...marginInput,
                transport_cost: Number(e.target.value) || 0,
              })
            }
            className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-emerald-500"
          />
          <span className="text-[11px] text-slate-400 mt-0.5 block">Bensin / kurir / kuli</span>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Susut Fisik / Waste (%)
          </label>
          <input
            type="number"
            min="0"
            max="95"
            step="0.5"
            value={marginInput.waste_pct ?? 0}
            onChange={(e) =>
              onInputChange({
                ...marginInput,
                waste_pct: Number(e.target.value) || 0,
              })
            }
            className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-emerald-500"
          />
          <span className="text-[11px] text-slate-400 mt-0.5 block">Penyusutan timbangan</span>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Harga Jual Anda (Rp/{commodity.unit})
          </label>
          <input
            type="number"
            value={marginInput.selling_price}
            onChange={(e) =>
              onInputChange({
                ...marginInput,
                selling_price: Number(e.target.value) || 0,
              })
            }
            className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-emerald-500"
          />
          <span className="text-[11px] text-slate-400 mt-0.5 block">Harga ke konsumen</span>
        </div>
      </div>

      {/* Output Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
        <div>
          <span className="text-[11px] text-slate-500 dark:text-slate-400 block">Biaya Efektif Riil:</span>
          <span className="text-base font-bold text-slate-900 dark:text-white">
            {formatRupiah(marginResult.effective_cost)}
          </span>
          <span className="text-[10px] text-slate-400 block">Biaya per unit siap jual</span>
        </div>

        <div>
          <span className="text-[11px] text-slate-500 dark:text-slate-400 block">Laba Kotor per Unit:</span>
          <span
            className={`text-base font-bold ${
              marginResult.gross_profit >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600"
            }`}
          >
            {formatRupiah(marginResult.gross_profit)}
          </span>
          <span className="text-[10px] text-slate-400 block">Sisa setelah potong modal</span>
        </div>

        <div>
          <span className="text-[11px] text-slate-500 dark:text-slate-400 block">Gross Margin %:</span>
          <span
            className={`text-base font-bold ${
              marginResult.status === "healthy"
                ? "text-emerald-600"
                : marginResult.status === "warning"
                ? "text-amber-600"
                : "text-rose-600"
            }`}
          >
            {marginResult.gross_margin_pct}%
          </span>
          <span className="text-[10px] text-slate-400 block">Target {commodity.targetMarginPct}%</span>
        </div>

        <div>
          <span className="text-[11px] text-slate-500 dark:text-slate-400 block">Markup Efektif:</span>
          <span className="text-base font-bold text-slate-700 dark:text-slate-300">
            {marginResult.markup_pct}%
          </span>
          <span className="text-[10px] text-slate-400 block">Markup dari modal</span>
        </div>
      </div>

      {/* Visual Comparison Bar */}
      <MarginComparisonBar
        effectiveCost={marginResult.effective_cost}
        sellingPrice={marginResult.selling_price}
        marketReference={medianRef}
        unit={commodity.unit}
      />

      {/* Action Trigger */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
        <div className="text-xs text-slate-500 flex items-center gap-1.5">
          <AlertCircle className="w-4 h-4 text-emerald-600" aria-hidden="true" />
          <span>Analisis Bob mempertimbangkan SOP penetapan harga internal & kepatuhan regulasi.</span>
        </div>

        <button
          type="button"
          onClick={onAskBob}
          className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white text-xs font-bold shadow-md shadow-emerald-500/20 flex items-center justify-center gap-2 transition"
        >
          <Sparkles className="w-4 h-4" aria-hidden="true" />
          <span>Minta Analisis & Rekomendasi Bob</span>
        </button>
      </div>
    </div>
  );
}
