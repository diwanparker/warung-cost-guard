import React, { useState } from "react";
import {
  AlertTriangle,
  Clock,
  MapPin,
  FileText,
  ArrowRight,
  ShieldCheck,
  CheckCircle,
} from "lucide-react";
import { OfficialSourceBadge } from "../shared/OfficialSourceBadge";
import { StatusBadge } from "../shared/StatusBadge";
import { WarningDetailModal } from "./WarningDetailModal";
import { formatWibRange, getTimeRemaining } from "@/lib/bmkg/temporal";
import type { WarningMatchResult } from "@/types/bmkg";

interface WarningStatusCardProps {
  matchResult: WarningMatchResult;
  onGenerateActionPlan?: () => void;
  className?: string;
}

export const WarningStatusCard: React.FC<WarningStatusCardProps> = ({
  matchResult,
  onGenerateActionPlan,
  className = "",
}) => {
  const [showDetailModal, setShowDetailModal] = useState(false);

  const { warning, matchedLocation, reason, status, confidence } = matchResult;
  if (!warning) return null;

  const timeRemaining = getTimeRemaining(warning.expires);

  return (
    <>
      <div
        className={`bg-white dark:bg-slate-800 rounded-2xl border-2 border-amber-300 dark:border-amber-700/80 shadow-md shadow-amber-500/5 p-5 sm:p-7 transition-all ${className}`}
        role="region"
        aria-label="Peringatan Dini Cuaca BMKG"
      >
        {/* Top Badges */}
        <div className="flex flex-wrap items-center justify-between gap-2.5 pb-4 border-b border-slate-100 dark:border-slate-700/60">
          <div className="flex items-center gap-2">
            <StatusBadge status={status} size="md" />
            <OfficialSourceBadge source="BMKG" />
          </div>

          <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-800 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/60 px-2.5 py-1 rounded-full border border-amber-200 dark:border-amber-900/50">
            <Clock className="w-3.5 h-3.5 text-amber-600" aria-hidden="true" />
            <span>{timeRemaining.text}</span>
          </div>
        </div>

        {/* Main Event Headline */}
        <div className="mt-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-900/60 text-amber-700 dark:text-amber-300 flex items-center justify-center shrink-0 mt-0.5">
              <AlertTriangle className="w-5 h-5" aria-hidden="true" />
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400 block">
                {warning.event}
              </span>
              <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight leading-snug mt-0.5">
                {warning.headline}
              </h2>
            </div>
          </div>
        </div>

        {/* Core Metadata Info Boxes */}
        <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-700/40 border border-slate-200 dark:border-slate-700 flex items-start gap-2.5">
            <Clock className="w-4 h-4 text-slate-500 mt-0.5 shrink-0" aria-hidden="true" />
            <div>
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                Periode Berlaku
              </span>
              <span className="text-sm font-bold text-slate-800 dark:text-slate-100">
                {formatWibRange(warning.effective, warning.expires)}
              </span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-700/40 border border-slate-200 dark:border-slate-700 flex items-start gap-2.5">
            <MapPin className="w-4 h-4 text-slate-500 mt-0.5 shrink-0" aria-hidden="true" />
            <div>
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                Wilayah Cocok
              </span>
              <span className="text-sm font-bold text-slate-800 dark:text-slate-100">
                {matchedLocation || "Wilayah Terpantau"}
              </span>
            </div>
          </div>
        </div>

        {/* Relevancy Explanation - Section 13 Spec Requirement */}
        <div className="mt-4 p-3.5 rounded-xl bg-blue-50/70 dark:bg-blue-950/40 border border-blue-200/80 dark:border-blue-900/50 text-xs">
          <div className="font-bold text-blue-950 dark:text-blue-200 flex items-center gap-1.5 mb-1">
            <ShieldCheck className="w-4 h-4 text-blue-600" aria-hidden="true" />
            <span>Mengapa Peringatan Ini Relevan?</span>
          </div>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
            {reason}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-700/60 flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => setShowDetailModal(true)}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-600 transition"
          >
            <FileText className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Lihat Rincian Asli BMKG</span>
          </button>

          {onGenerateActionPlan && (
            <button
              type="button"
              onClick={onGenerateActionPlan}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-amber-600 hover:bg-amber-700 text-white shadow-sm shadow-amber-500/20 active:scale-98 transition"
            >
              <span>Buat Rencana Tindakan</span>
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </button>
          )}
        </div>
      </div>

      <WarningDetailModal
        warning={warning}
        isOpen={showDetailModal}
        onClose={() => setShowDetailModal(false)}
      />
    </>
  );
};
