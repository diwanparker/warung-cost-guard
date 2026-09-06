import React from "react";
import { Store, MapPin, Sparkles } from "lucide-react";
import { DemoModeBadge } from "@/components/shared/DemoModeBadge";

interface DashboardHeaderProps {
  isDemoMode?: boolean;
  scenarioName?: string;
  city?: string;
  onOpenChat?: () => void;
}

export function DashboardHeader({
  isDemoMode = true,
  scenarioName,
  city = "Surabaya",
  onOpenChat,
}: DashboardHeaderProps) {
  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 shadow-xs">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center shadow-md shadow-emerald-500/20">
            <Store className="w-5 h-5" aria-hidden="true" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-bold tracking-tight text-slate-900 dark:text-white">
                WARUNG COST GUARD
              </h1>
              <span className="hidden md:inline-block text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                Hacktiv8 × IBM
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 hidden sm:block">
              Copilot Harga Pangan & Analisis Margin Rasional Pedagang Kecil
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-medium">
            <MapPin className="w-3.5 h-3.5 text-emerald-600" aria-hidden="true" />
            <span>Kota {city} (Pasar Rakyat SP2KP / PIHPS)</span>
          </div>

          {isDemoMode && <DemoModeBadge scenarioName={scenarioName} />}

          {onOpenChat && (
            <button
              type="button"
              onClick={onOpenChat}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs transition"
            >
              <Sparkles className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Tanya Bob</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
