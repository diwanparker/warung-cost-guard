import React from "react";
import type { PriceActionOutput } from "@/types/action";
import { Lightbulb, CheckCircle2, ShieldAlert, MessageSquare, ArrowRight } from "lucide-react";

interface ActionRecommendationCardProps {
  actionResult: PriceActionOutput;
  commodityName: string;
  onOpenNegotiation: () => void;
}

export function ActionRecommendationCard({
  actionResult,
  commodityName,
  onOpenNegotiation,
}: ActionRecommendationCardProps) {
  let badgeColor = "bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-950/70 dark:text-emerald-300";
  if (actionResult.action === "REVIEW_COST" || actionResult.action === "SUPPLIER_SWITCH") {
    badgeColor = "bg-rose-100 text-rose-800 border-rose-300 dark:bg-rose-950/70 dark:text-rose-300";
  } else if (actionResult.action === "OPTIMIZE" || actionResult.action === "PORTION_CONTROL") {
    badgeColor = "bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-950/70 dark:text-amber-300";
  }

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <span className="p-2 rounded-lg bg-teal-100 dark:bg-teal-950 text-teal-600 dark:text-teal-400">
            <Lightbulb className="w-5 h-5" aria-hidden="true" />
          </span>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400">
              Rekomendasi Tindakan Cerdas (AI Copilot)
            </span>
            <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
              {actionResult.headline}
            </h3>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${badgeColor}`}>
            {actionResult.action}
          </span>
          <span className="text-[11px] text-slate-400">
            Keyakinan: {actionResult.confidence.toUpperCase()}
          </span>
        </div>
      </div>

      {actionResult.het_warning && (
        <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 text-xs text-amber-900 dark:text-amber-200 flex items-start gap-2">
          <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" aria-hidden="true" />
          <span>{actionResult.het_warning}</span>
        </div>
      )}

      {/* 3 Action Options */}
      <div className="space-y-2">
        <div className="text-xs font-bold text-slate-700 dark:text-slate-300">
          Opsi Tindakan Paling Rasional:
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          {actionResult.options.map((option, idx) => (
            <div
              key={idx}
              className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs flex items-start gap-2"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" aria-hidden="true" />
              <span className="text-slate-700 dark:text-slate-300 leading-snug">{option}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Explanation Reasoning */}
      <div className="p-3 rounded-xl bg-slate-50/70 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
        <strong className="text-slate-800 dark:text-slate-200 block mb-1">
          Pertimbangan Berbasis Data:
        </strong>
        {actionResult.reasoning}
      </div>

      {/* Suggested Supplier Action */}
      {actionResult.suggested_supplier_msg && (
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-100 dark:border-slate-800">
          <div className="text-xs text-slate-500">
            Draf pesan negosiasi WhatsApp telah disiapkan oleh Bob untuk komoditas ini.
          </div>
          <button
            type="button"
            onClick={onOpenNegotiation}
            className="w-full sm:w-auto px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs transition"
          >
            <MessageSquare className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Kirim Draf Negosiasi ke Supplier</span>
            <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
          </button>
        </div>
      )}
    </div>
  );
}
