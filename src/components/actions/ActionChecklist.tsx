import React from "react";
import { Check, ShieldCheck, AlertOctagon, HelpCircle } from "lucide-react";
import type { RecommendedAction, ActionPriority } from "@/types/action";

interface ActionChecklistProps {
  priorityActions: RecommendedAction[];
  recommendedActions: RecommendedAction[];
  monitoringActions: RecommendedAction[];
  onToggleAction: (actionId: string) => void;
  className?: string;
}

export const ActionChecklist: React.FC<ActionChecklistProps> = ({
  priorityActions,
  recommendedActions,
  monitoringActions,
  onToggleAction,
  className = "",
}) => {
  const renderPriorityBadge = (priority: ActionPriority) => {
    switch (priority) {
      case "high":
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-rose-100 text-rose-800 border border-rose-200 dark:bg-rose-950 dark:text-rose-300 dark:border-rose-800">
            Prioritas Tinggi
          </span>
        );
      case "medium":
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-amber-100 text-amber-800 border border-amber-200 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-800">
            Selanjutnya
          </span>
        );
      case "low":
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-slate-100 text-slate-700 border border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700">
            Monitoring
          </span>
        );
    }
  };

  const renderSection = (
    title: string,
    subtitle: string,
    items: RecommendedAction[],
    badgeColor: string
  ) => {
    if (items.length === 0) return null;

    return (
      <div className="space-y-2.5">
        <div className="flex items-center gap-2">
          <span className={`w-2.5 h-2.5 rounded-full ${badgeColor}`} aria-hidden="true" />
          <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-800 dark:text-slate-200">
            {title}
          </h4>
          <span className="text-[11px] text-slate-400">({items.length} tindakan)</span>
        </div>
        <p className="text-[11px] text-slate-500 -mt-1">{subtitle}</p>

        <div className="space-y-2">
          {items.map((item) => (
            <div
              key={item.id}
              onClick={() => onToggleAction(item.id)}
              className={`p-3.5 rounded-xl border transition-all cursor-pointer select-none flex items-start gap-3 ${
                item.completed
                  ? "bg-slate-50 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800 opacity-60"
                  : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-slate-300 shadow-2xs"
              }`}
            >
              {/* Checkbox Box */}
              <div
                className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                  item.completed
                    ? "bg-emerald-600 border-emerald-600 text-white"
                    : "border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700"
                }`}
                role="checkbox"
                aria-checked={item.completed}
              >
                {item.completed && <Check className="w-3.5 h-3.5 stroke-[3]" />}
              </div>

              {/* Action Details */}
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <span
                    className={`text-sm font-semibold text-slate-900 dark:text-slate-100 ${
                      item.completed ? "line-through text-slate-400" : ""
                    }`}
                  >
                    {item.action}
                  </span>
                  {renderPriorityBadge(item.priority)}
                </div>

                <div className="text-xs text-slate-500 dark:text-slate-400 leading-normal">
                  <strong className="text-slate-600 dark:text-slate-300">Alasan:</strong> {item.reason}
                </div>

                <div className="mt-1 flex items-center gap-1.5 text-[11px] text-blue-600 dark:text-blue-400">
                  <ShieldCheck className="w-3 h-3" aria-hidden="true" />
                  <span>Sumber: {item.source}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {renderSection(
        "Prioritas Utama (Tindakan Segera)",
        "Wajib dieksekusi sesegera mungkin untuk mitigasi bahaya langsung.",
        priorityActions,
        "bg-rose-500"
      )}

      {renderSection(
        "Tindakan Pendukung & Fasilitas",
        "Pencegahan kerusakan aset dan pengamanan operasional gedung.",
        recommendedActions,
        "bg-amber-500"
      )}

      {renderSection(
        "Pengawasan Berkala (Monitoring)",
        "Pantau perkembangan sampai periode peringatan dinyatakan selesai.",
        monitoringActions,
        "bg-slate-400"
      )}
    </div>
  );
};
