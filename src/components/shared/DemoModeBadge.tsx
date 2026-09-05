import React from "react";
import { FlaskConical } from "lucide-react";

interface DemoModeBadgeProps {
  scenarioName?: string;
  className?: string;
}

export const DemoModeBadge: React.FC<DemoModeBadgeProps> = ({
  scenarioName,
  className = "",
}) => {
  return (
    <div
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-purple-100 text-purple-900 border border-purple-300 dark:bg-purple-950 dark:text-purple-200 dark:border-purple-800 ${className}`}
      role="note"
      aria-label="Mode Demo Aktif"
    >
      <FlaskConical className="w-3.5 h-3.5 text-purple-700 dark:text-purple-400" aria-hidden="true" />
      <span>MODE DEMO: DATA SIMULASI {scenarioName ? `(${scenarioName})` : ""}</span>
    </div>
  );
};
