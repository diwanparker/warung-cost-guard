import React from "react";
import { USER_ROLES } from "@/types/user";
import type { UserRole } from "@/types/user";
import { UserCheck } from "lucide-react";

interface RoleSelectorProps {
  selectedRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  className?: string;
}

export const RoleSelector: React.FC<RoleSelectorProps> = ({
  selectedRole,
  onRoleChange,
  className = "",
}) => {
  return (
    <div className={`space-y-2 ${className}`}>
      <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
        <UserCheck className="w-3.5 h-3.5 text-blue-600" aria-hidden="true" />
        <span>Pilih Peran Operasional Anda:</span>
      </label>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
        {USER_ROLES.slice(0, 4).map((role) => {
          const isSelected = role.id === selectedRole;
          return (
            <button
              key={role.id}
              type="button"
              onClick={() => onRoleChange(role.id)}
              className={`text-left p-3 rounded-xl border transition-all ${
                isSelected
                  ? "bg-blue-50/80 dark:bg-blue-950/60 border-blue-500 shadow-xs ring-1 ring-blue-500"
                  : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-slate-300"
              }`}
            >
              <div className="text-xs font-bold text-slate-900 dark:text-slate-100">
                {role.label}
              </div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-2 leading-tight">
                {role.description}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
