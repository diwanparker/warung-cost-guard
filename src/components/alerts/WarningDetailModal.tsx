import React from "react";
import { X, ShieldCheck, MapPin, Calendar, Clock, ExternalLink } from "lucide-react";
import { formatWibRange, formatWibTime } from "@/lib/bmkg/temporal";
import type { BmkgWarning } from "@/types/bmkg";

interface WarningDetailModalProps {
  warning: BmkgWarning;
  isOpen: boolean;
  onClose: () => void;
}

export const WarningDetailModal: React.FC<WarningDetailModalProps> = ({
  warning,
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-2xl w-full border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 flex items-start justify-between gap-4 bg-slate-50/50 dark:bg-slate-800/40">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 border border-blue-200 dark:bg-blue-950 dark:text-blue-200 dark:border-blue-800">
                <ShieldCheck className="w-3 h-3 text-blue-600" aria-hidden="true" />
                <span>Dokumen Resmi BMKG CAP</span>
              </span>
              <span className="text-xs text-slate-400 font-mono">
                ID: {warning.id}
              </span>
            </div>
            <h2 id="modal-title" className="text-lg font-bold text-slate-900 dark:text-slate-100">
              {warning.headline || warning.event}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 dark:hover:bg-slate-800 transition"
            aria-label="Tutup dialog"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4 text-sm">
          {/* Official Timing Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60">
            <div className="flex items-center gap-2.5">
              <Clock className="w-4 h-4 text-slate-400 shrink-0" aria-hidden="true" />
              <div>
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                  Periode Berlaku (WIB)
                </span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  {formatWibRange(warning.effective, warning.expires)}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <Calendar className="w-4 h-4 text-slate-400 shrink-0" aria-hidden="true" />
              <div>
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                  Waktu Publikasi
                </span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  {formatWibTime(warning.sent)} WIB
                </span>
              </div>
            </div>
          </div>

          {/* Official Narrative Description */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
              Uraian Peringatan Resmi (Asli BMKG)
            </h3>
            <div className="p-3.5 rounded-xl bg-amber-50/60 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/40 text-slate-800 dark:text-slate-200 leading-relaxed font-sans">
              {warning.description || "Tidak ada rincian narasi tambahan dari feed BMKG."}
            </div>
          </div>

          {/* Areas Listed in CAP */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-slate-400" aria-hidden="true" />
              <span>Daftar Wilayah Terdampak Tercantum</span>
            </h3>
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
              {warning.areas.map((area, idx) => (
                <div key={idx} className="flex items-start gap-1.5">
                  <span className="text-blue-500 font-bold">•</span>
                  <span>{area}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Sender & Source Link */}
          <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between text-xs text-slate-500 gap-2 border-t border-slate-100 dark:border-slate-800">
            <div>Penerbit: <strong>{warning.senderName}</strong></div>
            {warning.sourceUrl && (
              <a
                href={warning.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 font-medium"
              >
                <span>Lihat Data Asli BMKG</span>
                <ExternalLink className="w-3 h-3" aria-hidden="true" />
              </a>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 dark:bg-slate-200 text-white dark:text-slate-900 hover:bg-slate-700 transition"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
