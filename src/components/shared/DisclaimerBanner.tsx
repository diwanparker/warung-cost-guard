import React from "react";
import { ShieldCheck } from "lucide-react";

export function DisclaimerBanner() {
  return (
    <footer className="w-full bg-slate-50 dark:bg-slate-900/80 border-t border-slate-200 dark:border-slate-800 py-3 px-4 text-center">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-center gap-2 text-xs text-slate-500 dark:text-slate-400">
        <div className="flex items-center gap-1.5 font-medium text-slate-700 dark:text-slate-300">
          <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
          <span>Responsible AI & Kepatuhan Regulasi:</span>
        </div>
        <p>
          Bukan penetap harga otomatis atau sarana koordinasi harga (UU No. 5/1999). Rekomendasi dirancang untuk analisis biaya internal satu usaha secara mandiri dengan verifikasi batas HET resmi.
        </p>
      </div>
    </footer>
  );
}
