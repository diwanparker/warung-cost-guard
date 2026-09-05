import React from "react";
import {
  AlertTriangle,
  Clock,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  XCircle,
} from "lucide-react";
import type { WarningStatus } from "@/types/bmkg";

interface StatusBadgeProps {
  status: WarningStatus;
  className?: string;
  size?: "sm" | "md" | "lg";
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  className = "",
  size = "md",
}) => {
  const sizeClasses = {
    sm: "px-2 py-0.5 text-xs gap-1",
    md: "px-3 py-1 text-sm gap-1.5",
    lg: "px-4 py-1.5 text-base gap-2 font-bold",
  };

  const iconSizes = {
    sm: "w-3 h-3",
    md: "w-4 h-4",
    lg: "w-5 h-5",
  };

  switch (status) {
    case "active":
      return (
        <span
          className={`inline-flex items-center rounded-full font-semibold bg-amber-100 text-amber-900 border border-amber-300 dark:bg-amber-950 dark:text-amber-200 dark:border-amber-800 ${sizeClasses[size]} ${className}`}
          role="status"
          aria-label="Status: Peringatan Dini Aktif"
        >
          <AlertTriangle className={`${iconSizes[size]} text-amber-600 dark:text-amber-400`} aria-hidden="true" />
          <span>Peringatan Aktif</span>
        </span>
      );

    case "expired":
      return (
        <span
          className={`inline-flex items-center rounded-full font-medium bg-slate-100 text-slate-700 border border-slate-300 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700 ${sizeClasses[size]} ${className}`}
          role="status"
          aria-label="Status: Peringatan Telah Berakhir"
        >
          <Clock className={`${iconSizes[size]} text-slate-500`} aria-hidden="true" />
          <span>Telah Berakhir</span>
        </span>
      );

    case "upcoming":
      return (
        <span
          className={`inline-flex items-center rounded-full font-semibold bg-sky-100 text-sky-900 border border-sky-300 dark:bg-sky-950 dark:text-sky-200 dark:border-sky-800 ${sizeClasses[size]} ${className}`}
          role="status"
          aria-label="Status: Peringatan Mendatang"
        >
          <Clock className={`${iconSizes[size]} text-sky-600`} aria-hidden="true" />
          <span>Peringatan Mendatang</span>
        </span>
      );

    case "no_match":
      return (
        <span
          className={`inline-flex items-center rounded-full font-semibold bg-emerald-50 text-emerald-800 border border-emerald-300 dark:bg-emerald-950 dark:text-emerald-200 dark:border-emerald-800 ${sizeClasses[size]} ${className}`}
          role="status"
          aria-label="Status: Tidak Ditemukan Peringatan Aktif"
        >
          <CheckCircle2 className={`${iconSizes[size]} text-emerald-600 dark:text-emerald-400`} aria-hidden="true" />
          <span>Tidak Ada Peringatan Aktif</span>
        </span>
      );

    case "unavailable":
      return (
        <span
          className={`inline-flex items-center rounded-full font-semibold bg-rose-50 text-rose-800 border border-rose-300 dark:bg-rose-950 dark:text-rose-200 dark:border-rose-800 ${sizeClasses[size]} ${className}`}
          role="status"
          aria-label="Status: Data BMKG Sementara Tidak Tersedia"
        >
          <XCircle className={`${iconSizes[size]} text-rose-600 dark:text-rose-400`} aria-hidden="true" />
          <span>Layanan Tidak Tersedia</span>
        </span>
      );

    case "ambiguous":
      return (
        <span
          className={`inline-flex items-center rounded-full font-semibold bg-purple-50 text-purple-800 border border-purple-300 dark:bg-purple-950 dark:text-purple-200 dark:border-purple-800 ${sizeClasses[size]} ${className}`}
          role="status"
          aria-label="Status: Lokasi Perlu Diperjelas"
        >
          <HelpCircle className={`${iconSizes[size]} text-purple-600`} aria-hidden="true" />
          <span>Lokasi Ambigu</span>
        </span>
      );

    default:
      return (
        <span
          className={`inline-flex items-center rounded-full font-medium bg-gray-100 text-gray-700 ${sizeClasses[size]} ${className}`}
        >
          <AlertCircle className={iconSizes[size]} aria-hidden="true" />
          <span>{status}</span>
        </span>
      );
  }
};
