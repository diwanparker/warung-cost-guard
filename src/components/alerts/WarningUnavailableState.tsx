import React from "react";
import { AlertCircle, ExternalLink, RefreshCw } from "lucide-react";

interface WarningUnavailableStateProps {
  onRetry?: () => void;
  className?: string;
}

export const WarningUnavailableState: React.FC<WarningUnavailableStateProps> = ({
  onRetry,
  className = "",
}) => {
  return (
    <div
      className={`bg-rose-50/70 dark:bg-rose-950/40 rounded-2xl border border-rose-200 dark:border-rose-800 p-6 sm:p-8 text-center shadow-xs ${className}`}
      role="alert"
    >
      <div className="w-14 h-14 mx-auto rounded-2xl bg-rose-100 dark:bg-rose-900/60 text-rose-600 dark:text-rose-400 flex items-center justify-center mb-4">
        <AlertCircle className="w-8 h-8" aria-hidden="true" />
      </div>

      <h3 className="text-xl font-bold text-rose-900 dark:text-rose-200">
        Data BMKG Sementara Tidak Dapat Diakses
      </h3>

      <p className="text-sm text-rose-700 dark:text-rose-300 max-w-lg mx-auto mt-2 leading-relaxed">
        Sistem tidak dapat terhubung ke endpoint feed CAP BMKG atau sedang mengalami
        kendala jaringan.
      </p>

      <div className="mt-4 p-3.5 bg-white/80 dark:bg-slate-900/60 rounded-xl max-w-md mx-auto text-xs text-slate-700 dark:text-slate-300 border border-rose-200 dark:border-rose-900/50 text-left">
        <strong className="block font-semibold text-rose-800 dark:text-rose-300 mb-1">
          Prinsip Responsible AI:
        </strong>
        SIAGA <strong>tidak akan pernah</strong> mengarang informasi cuaca atau
        membuat peringatan dini buatan ketika data sumber resmi tidak tersedia.
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        {onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-rose-600 hover:bg-rose-700 text-white transition shadow-xs"
          >
            <RefreshCw className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Coba Hubungkan Kembali</span>
          </button>
        )}

        <a
          href="https://www.bmkg.go.id"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-700 hover:bg-slate-50 transition"
        >
          <span>Kunjungi Portal Resmi BMKG</span>
          <ExternalLink className="w-3 h-3 text-slate-400" aria-hidden="true" />
        </a>
      </div>
    </div>
  );
};
