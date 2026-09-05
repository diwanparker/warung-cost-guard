import React, { useState } from "react";
import {
  ListChecks,
  AlertOctagon,
  ShieldAlert,
  Send,
  BookOpen,
  Users,
  CheckCircle2,
} from "lucide-react";
import { RoleSelector } from "./RoleSelector";
import { ActionChecklist } from "./ActionChecklist";
import type { ActionPlan } from "@/types/action";
import type { UserRole } from "@/types/user";

interface ActionPlanCardProps {
  actionPlan: ActionPlan;
  selectedRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  onOutdoorToggle: (outdoor: boolean) => void;
  isOutdoorEvent: boolean;
  onOpenConfirmation: () => void;
  className?: string;
}

export const ActionPlanCard: React.FC<ActionPlanCardProps> = ({
  actionPlan,
  selectedRole,
  onRoleChange,
  onOutdoorToggle,
  isOutdoorEvent,
  onOpenConfirmation,
  className = "",
}) => {
  const [actions, setActions] = useState(actionPlan);

  // Sync state if actionPlan prop updates
  React.useEffect(() => {
    setActions(actionPlan);
  }, [actionPlan]);

  const toggleAction = (id: string) => {
    setActions((prev) => {
      const updateList = (list: typeof prev.priorityActions) =>
        list.map((item) =>
          item.id === id ? { ...item, completed: !item.completed } : item
        );

      return {
        ...prev,
        priorityActions: updateList(prev.priorityActions),
        recommendedActions: updateList(prev.recommendedActions),
        monitoring: updateList(prev.monitoring),
      };
    });
  };

  const totalActions =
    actions.priorityActions.length +
    actions.recommendedActions.length +
    actions.monitoring.length;

  const completedActions = [
    ...actions.priorityActions,
    ...actions.recommendedActions,
    ...actions.monitoring,
  ].filter((a) => a.completed).length;

  const progressPct = totalActions > 0 ? Math.round((completedActions / totalActions) * 100) : 0;

  return (
    <div
      className={`bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm p-5 sm:p-7 space-y-6 ${className}`}
      role="region"
      aria-label="Rencana Tindakan Kesiapsiagaan"
    >
      {/* Card Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-slate-100 dark:border-slate-700/60">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 flex items-center justify-center shrink-0">
            <ListChecks className="w-5 h-5" aria-hidden="true" />
          </div>
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 block">
              Rencana Tindakan Operasional
            </span>
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
              Checklist Kesiapsiagaan Darurat
            </h3>
          </div>
        </div>

        {/* Progress Pill */}
        <div className="flex items-center gap-2 self-start sm:self-auto bg-slate-50 dark:bg-slate-700/60 px-3.5 py-1.5 rounded-full border border-slate-200 dark:border-slate-600 text-xs">
          <span className="font-semibold text-slate-700 dark:text-slate-200">
            Progres: {completedActions}/{totalActions} ({progressPct}%)
          </span>
          <div className="w-16 h-2 rounded-full bg-slate-200 dark:bg-slate-600 overflow-hidden">
            <div
              className="h-full bg-blue-600 transition-all duration-300"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>
      </div>

      {/* Role Selection */}
      <RoleSelector selectedRole={selectedRole} onRoleChange={onRoleChange} />

      {/* Outdoor Event Context Toggle */}
      <div className="p-3.5 rounded-xl bg-indigo-50/60 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-900/50 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <Users className="w-4 h-4 text-indigo-600 shrink-0" aria-hidden="true" />
          <div>
            <div className="text-xs font-bold text-indigo-950 dark:text-indigo-200">
              Konteks Khusus: Sedang Ada Kegiatan Lapangan / Outdoor
            </div>
            <div className="text-[11px] text-indigo-800/80 dark:text-indigo-300/80">
              Aktifkan untuk menambahkan SOP kontinjensi massa dan evakuasi acara terbuka.
            </div>
          </div>
        </div>

        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={isOutdoorEvent}
            onChange={(e) => onOutdoorToggle(e.target.checked)}
            className="sr-only peer"
          />
          <div className="w-9 h-5 bg-slate-300 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-600"></div>
        </label>
      </div>

      {/* Executive Summary & Risk Context */}
      <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 space-y-2 text-xs">
        <div className="text-slate-800 dark:text-slate-200 leading-relaxed font-medium">
          {actions.summary}
        </div>
        <div className="text-slate-600 dark:text-slate-400 leading-relaxed border-t border-slate-200 dark:border-slate-800 pt-2">
          <strong className="text-slate-700 dark:text-slate-300">Penilaian Risiko: </strong>
          {actions.riskContext}
        </div>
      </div>

      {/* Prioritized Checklist */}
      <ActionChecklist
        priorityActions={actions.priorityActions}
        recommendedActions={actions.recommendedActions}
        monitoringActions={actions.monitoring}
        onToggleAction={toggleAction}
      />

      {/* Prohibitions (Hal yang Dilarang) */}
      {actions.doNotDo.length > 0 && (
        <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50">
          <h4 className="text-xs font-bold uppercase tracking-wider text-rose-800 dark:text-rose-300 flex items-center gap-1.5 mb-2">
            <AlertOctagon className="w-4 h-4 text-rose-600" aria-hidden="true" />
            <span>Tindakan Terlarang (Hal yang Tidak Boleh Dilakukan):</span>
          </h4>
          <ul className="space-y-1 text-xs text-rose-700 dark:text-rose-300 list-disc list-inside">
            {actions.doNotDo.map((dnd, idx) => (
              <li key={idx} className="leading-relaxed">
                {dnd}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Sources Attribution */}
      <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-700 text-[11px] text-slate-500 space-y-1">
        <div className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
          <BookOpen className="w-3.5 h-3.5 text-blue-600" aria-hidden="true" />
          <span>Dasar Dokumen SOP Resmi yang Dirujuk:</span>
        </div>
        <div className="space-y-0.5 pl-5">
          {actions.sopSources.map((src, idx) => (
            <div key={idx}>• {src}</div>
          ))}
        </div>
      </div>

      {/* Human Confirmation Trigger Button */}
      <div className="pt-4 border-t border-slate-100 dark:border-slate-700/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="text-xs text-slate-500">
          Tindakan eksternal (notifikasi/email) <strong>wajib</strong> disetujui
          secara manual oleh petugas operator.
        </div>

        <button
          type="button"
          onClick={onOpenConfirmation}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-sm shadow-blue-500/20 active:scale-98 transition shrink-0"
        >
          <Send className="w-3.5 h-3.5" aria-hidden="true" />
          <span>Kirim Notifikasi ke Tim (Butuh Konfirmasi)</span>
        </button>
      </div>
    </div>
  );
};
