import React from "react";
import { CheckCircle2, RefreshCw } from "lucide-react";
import { OfficialSourceBadge } from "../shared/OfficialSourceBadge";
import type { UserLocation } from "@/types/user";

interface EmptyWarningStateProps {
  location: UserLocation;
  onRefresh?: () => void;
  className?: string;
}

export const EmptyWarningState: React.FC<EmptyWarningStateProps> = ({
  location,
  onRefresh,
  className = "",
}) => {
  return (
    <div
      className={`bg-white dark:bg-slate-800 rounded-2xl border border-emerald-200 dark:border-emerald-900/60 p-6 sm:p-8 text-center shadow-xs ${className}`}
      role="region"
      aria-label="Status Cuaca Normal"
    >
      <div className="w-14 h-14 mx-auto rounded-2xl bg-emerald-50 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-4">
        <CheckCircle2 className="w-8 h-8" aria-hidden="true" />
      </div>

      <div className="flex items-center justify-center gap-2 mb-2">
        <OfficialSourceBadge source="BMKG" />
      </div>

      <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">
        Tidak Ada Peringatan Dini Aktif
      </h3>

      <p className="text-sm text-slate-600 dark:text-slate-300 max-w-md mx-auto mt-2 leading-relaxed">
        Tidak ditemukan peringatan cuaca ekstrem BMKG yang cocok dengan wilayah{" "}
        <strong className="text-slate-900 dark:text-slate-100">
          Kec. {location.district}, {location.city}
        </strong>{" "}
        pada saat ini.
      </p>

      <div className="mt-4 p-3 bg-slate-50 dark:bg-slate-900/50 rounded-xl max-w-md mx-auto text-xs text-slate-500 border border-slate-200 dark:border-slate-800">
        <em>
          Catatan: SIAGA tidak menyatakan kondisi cuaca &quot;pasti aman&quot;. Sistem
          hanya mengonfirmasi ketiadaan peringatan dini aktif pada data resmi BMKG.
          Tetap waspada dan pantau pembaruan berkala.
        </em>
      </div>

      {onRefresh && (
        <button
          type="button"
          onClick={onRefresh}
          className="mt-5 inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-600 transition"
        >
          <RefreshCw className="w-3.5 h-3.5" aria-hidden="true" />
          <span>Periksa Ulang Feed BMKG</span>
        </button>
      )}
    </div>
  );
};
