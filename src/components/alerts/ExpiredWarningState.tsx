import React from "react";
import { Clock, History, RotateCcw } from "lucide-react";
import { OfficialSourceBadge } from "../shared/OfficialSourceBadge";
import { formatWibTime } from "@/lib/bmkg/temporal";
import type { BmkgWarning } from "@/types/bmkg";

interface ExpiredWarningStateProps {
  warning: BmkgWarning;
  onRefresh?: () => void;
  className?: string;
}

export const ExpiredWarningState: React.FC<ExpiredWarningStateProps> = ({
  warning,
  onRefresh,
  className = "",
}) => {
  return (
    <div
      className={`bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-300 dark:border-slate-700 p-6 sm:p-8 text-center shadow-xs ${className}`}
      role="region"
      aria-label="Peringatan Telah Berakhir"
    >
      <div className="w-14 h-14 mx-auto rounded-2xl bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 flex items-center justify-center mb-4">
        <Clock className="w-8 h-8" aria-hidden="true" />
      </div>

      <div className="flex items-center justify-center gap-2 mb-2">
        <OfficialSourceBadge source="BMKG" />
        <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-200">
          <History className="w-3 h-3" aria-hidden="true" />
          <span>Status: Telah Berakhir</span>
        </span>
      </div>

      <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200">
        Peringatan Dini Telah Berakhir
      </h3>

      <div className="mt-2 text-sm text-slate-600 dark:text-slate-400">
        Peringatan <strong>{warning.event}</strong> sebelumnya berlaku sampai pukul{" "}
        <strong className="text-slate-900 dark:text-slate-100">
          {formatWibTime(warning.expires)} WIB
        </strong>
        .
      </div>

      <p className="mt-2 text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
        Data ini diarsipkan dan tidak lagi dianggap sebagai peringatan aktif yang
        membutuhkan tindakan tanggap darurat baru.
      </p>

      {onRefresh && (
        <button
          type="button"
          onClick={onRefresh}
          className="mt-5 inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-600 hover:bg-slate-100 transition"
        >
          <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
          <span>Muat Ulang Status Terkini</span>
        </button>
      )}
    </div>
  );
};
