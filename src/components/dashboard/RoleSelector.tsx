import React from "react";
import { BUSINESS_ROLES, type BusinessRole } from "@/types/user";
import { Utensils, ShoppingBag, Store, ChefHat } from "lucide-react";

interface RoleSelectorProps {
  selectedRole: BusinessRole;
  onSelectRole: (role: BusinessRole) => void;
}

export function RoleSelector({ selectedRole, onSelectRole }: RoleSelectorProps) {
  const getIcon = (roleId: BusinessRole) => {
    switch (roleId) {
      case "warteg":
        return <Utensils className="w-4 h-4" aria-hidden="true" />;
      case "warung_kelontong":
        return <Store className="w-4 h-4" aria-hidden="true" />;
      case "pedagang_pasar":
        return <ShoppingBag className="w-4 h-4" aria-hidden="true" />;
      case "umkm_kuliner":
        return <ChefHat className="w-4 h-4" aria-hidden="true" />;
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl p-3 border border-slate-200 dark:border-slate-800 shadow-2xs">
      <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2">
        Pilih Profil Usaha Pedagang:
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {BUSINESS_ROLES.map((r) => {
          const isSelected = selectedRole === r.id;
          return (
            <button
              key={r.id}
              type="button"
              onClick={() => onSelectRole(r.id)}
              className={`flex items-center gap-2 p-2 rounded-lg text-left text-xs transition border ${
                isSelected
                  ? "bg-emerald-50 dark:bg-emerald-950/70 border-emerald-500 text-emerald-900 dark:text-emerald-100 font-semibold shadow-2xs"
                  : "bg-slate-50 dark:bg-slate-800/50 border-transparent text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              }`}
            >
              <span
                className={`p-1.5 rounded-md ${
                  isSelected
                    ? "bg-emerald-600 text-white"
                    : "bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-300"
                }`}
              >
                {getIcon(r.id)}
              </span>
              <div className="min-w-0 flex-1">
                <div className="truncate font-medium">{r.label}</div>
                <div className="text-[10px] opacity-75">Target ~{r.defaultTargetMarginPct}%</div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
