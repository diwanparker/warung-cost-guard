import React from "react";
import { FlaskConical } from "lucide-react";

interface DemoModeBadgeProps {
  scenarioName?: string;
}

export function DemoModeBadge({ scenarioName }: DemoModeBadgeProps) {
  return (
    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-purple-100 dark:bg-purple-950/80 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800 animate-pulse">
      <FlaskConical className="w-3.5 h-3.5" aria-hidden="true" />
      <span>MODE DEMO: DATA SIMULASI</span>
      {scenarioName && (
        <span className="hidden sm:inline font-normal text-purple-600 dark:text-purple-400">
          • {scenarioName}
        </span>
      )}
    </div>
  );
}
