import React from "react";
import type { CommodityInfo } from "@/types/commodity";
import type { MarginResult } from "@/types/margin";
import type { MarketPriceResult } from "@/types/market";
import { formatRupiah } from "@/lib/margin/calculator";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Calculator, Sparkles, Scale, AlertCircle } from "lucide-react";

interface CommodityCardProps {
  commodity: CommodityInfo;
  marginResult: MarginResult;
  marketPrice?: MarketPriceResult;
  isSelected?: boolean;
  onSelect: (commodityId: string) => void;
  onAskBob: (commodityId: string) => void;
}

export function CommodityCard({
  commodity,
  marginResult,
  marketPrice,
  isSelected,
  onSelect,
  onAskBob,
}: CommodityCardProps) {
  const medianRef = marketPrice?.median_reference || commodity.defaultSellingPrice;
  const isAboveMarket = marginResult.selling_price > medianRef * 1.05;
  const isBelowMarket = marginResult.selling_price < medianRef * 0.95;

  return (
    <div
      className={`rounded-xl p-4 transition-all duration-200 border bg-white dark:bg-slate-900 shadow-2xs flex flex-col justify-between ${
        isSelected
          ? "border-emerald-500 ring-2 ring-emerald-500/20 shadow-md"
          : "border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700"
      }`}
    >
      <div>
        <div className="flex items-start justify-between gap-2 mb-2">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
              {commodity.category.replace("_", " ")}
            </span>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white leading-tight">
              {commodity.name}
            </h3>
          </div>
          <StatusBadge status={marginResult.status} marginPct={marginResult.gross_margin_pct} />
        </div>

        {commodity.hetPrice && (
          <div className="mb-2.5 px-2 py-1 rounded bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 text-[11px] text-amber-800 dark:text-amber-300 flex items-center gap-1.5">
            <Scale className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
            <span>
              Batas HET Resmi: <strong>{formatRupiah(commodity.hetPrice)}</strong>/{commodity.unit}
            </span>
          </div>
        )}

        {/* Pricing Metrics Matrix */}
        <div className="grid grid-cols-2 gap-2 py-2 border-y border-slate-100 dark:border-slate-800 text-xs">
          <div>
            <span className="text-slate-400 block text-[11px]">Modal Kulakan:</span>
            <span className="font-semibold text-slate-700 dark:text-slate-300">
              {formatRupiah(marginResult.purchase_price)}
            </span>
            <span className="text-[10px] text-slate-400 block">
              + Ongkir {formatRupiah(marginResult.transport_cost)}
            </span>
          </div>

          <div>
            <span className="text-slate-400 block text-[11px]">Biaya Efektif:</span>
            <span className="font-bold text-slate-900 dark:text-white">
              {formatRupiah(marginResult.effective_cost)}
            </span>
            <span className="text-[10px] text-slate-400 block">
              Susut {marginResult.waste_pct}%
            </span>
          </div>

          <div>
            <span className="text-slate-400 block text-[11px]">Harga Jual Anda:</span>
            <span className="font-bold text-slate-900 dark:text-white text-sm">
              {formatRupiah(marginResult.selling_price)}
            </span>
            <span className="text-[10px] font-medium text-emerald-600 dark:text-emerald-400 block">
              Laba +{formatRupiah(marginResult.gross_profit)}
            </span>
          </div>

          <div>
            <span className="text-slate-400 block text-[11px]">Pasar Surabaya:</span>
            <span className="font-semibold text-slate-700 dark:text-slate-300">
              {formatRupiah(medianRef)}
            </span>
            <span
              className={`text-[10px] block font-medium ${
                isAboveMarket
                  ? "text-rose-500"
                  : isBelowMarket
                  ? "text-emerald-600 dark:text-emerald-400"
                  : "text-slate-400"
              }`}
            >
              {isAboveMarket ? "▲ Di atas pasar" : isBelowMarket ? "▼ Di bawah pasar" : "≈ Sesuai pasar"}
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 mt-3 pt-2">
        <button
          type="button"
          onClick={() => onSelect(commodity.id)}
          className={`flex-1 py-1.5 px-2.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition ${
            isSelected
              ? "bg-emerald-600 text-white"
              : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200"
          }`}
        >
          <Calculator className="w-3.5 h-3.5" aria-hidden="true" />
          <span>Kalkulator</span>
        </button>

        <button
          type="button"
          onClick={() => onAskBob(commodity.id)}
          className="py-1.5 px-2.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/60 dark:hover:bg-emerald-900 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-xs font-semibold flex items-center justify-center gap-1 transition"
          title="Tanyakan rekomendasi harga ke Bob Copilot"
        >
          <Sparkles className="w-3.5 h-3.5" aria-hidden="true" />
          <span>Tanya Bob</span>
        </button>
      </div>
    </div>
  );
}
