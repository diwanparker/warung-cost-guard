import React from "react";
import { AlertTriangle, CheckSquare, Bell, Clock } from "lucide-react";

interface QuickStatusProps {
  activeWarningCount: number;
  recommendedActionCount: number;
  teamsToNotifyCount: number;
  timeRemainingText?: string;
  className?: string;
}

export const QuickStatus: React.FC<QuickStatusProps> = ({
  activeWarningCount,
  recommendedActionCount,
  teamsToNotifyCount,
  timeRemainingText,
  className = "",
}) => {
  return (
    <div className={`grid grid-cols-2 md:grid-cols-4 gap-3 ${className}`}>
      <div className="bg-white dark:bg-slate-800 rounded-xl p-3.5 border border-slate-200 dark:border-slate-700 shadow-xs flex items-center gap-3">
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
          activeWarningCount > 0
            ? "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300"
            : "bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300"
        }`}>
          <AlertTriangle className="w-5 h-5" aria-hidden="true" />
        </div>
        <div>
          <div className="text-xl font-bold text-slate-900 dark:text-slate-100 leading-none">
            {String(activeWarningCount).padStart(2, "0")}
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">
            Peringatan Aktif
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-xl p-3.5 border border-slate-200 dark:border-slate-700 shadow-xs flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300 flex items-center justify-center">
          <CheckSquare className="w-5 h-5" aria-hidden="true" />
        </div>
        <div>
          <div className="text-xl font-bold text-slate-900 dark:text-slate-100 leading-none">
            {String(recommendedActionCount).padStart(2, "0")}
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">
            Tindakan SOP
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-xl p-3.5 border border-slate-200 dark:border-slate-700 shadow-xs flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 flex items-center justify-center">
          <Bell className="w-5 h-5" aria-hidden="true" />
        </div>
        <div>
          <div className="text-xl font-bold text-slate-900 dark:text-slate-100 leading-none">
            {String(teamsToNotifyCount).padStart(2, "0")}
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">
            Tim Lapangan
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-xl p-3.5 border border-slate-200 dark:border-slate-700 shadow-xs flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300 flex items-center justify-center">
          <Clock className="w-5 h-5" aria-hidden="true" />
        </div>
        <div className="truncate">
          <div className="text-sm font-semibold text-slate-900 dark:text-slate-100 truncate leading-tight">
            {timeRemainingText || "Tidak ada timer"}
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">
            Status Waktu
          </div>
        </div>
      </div>
    </div>
  );
};
