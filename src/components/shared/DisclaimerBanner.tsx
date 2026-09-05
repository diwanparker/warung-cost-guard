import React from "react";
import { Info } from "lucide-react";

interface DisclaimerBannerProps {
  className?: string;
}

export const DisclaimerBanner: React.FC<DisclaimerBannerProps> = ({
  className = "",
}) => {
  return (
    <footer
      className={`border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 py-4 px-4 text-xs text-slate-500 dark:text-slate-400 ${className}`}
    >
      <div className="max-w-6xl mx-auto flex items-start gap-2.5">
        <Info className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" aria-hidden="true" />
        <p className="leading-relaxed">
          <strong className="font-semibold text-slate-700 dark:text-slate-300">
            Batasan & Tanggung Jawab SIAGA:{" "}
          </strong>
          SIAGA membantu menerjemahkan informasi peringatan resmi menjadi rencana tindakan operasional.
          SIAGA tidak membuat prakiraan cuaca independen. Seluruh data cuaca resmi bersumber langsung dari BMKG.
          Tindakan eksternal memerlukan konfirmasi pengguna manusia.
        </p>
      </div>
    </footer>
  );
};
