import React from "react";
import { ShieldCheck } from "lucide-react";

interface OfficialSourceBadgeProps {
  source?: string;
  className?: string;
}

export const OfficialSourceBadge: React.FC<OfficialSourceBadgeProps> = ({
  source = "BMKG",
  className = "",
}) => {
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-800 border border-blue-200 ${className}`}
      title="Data bersumber langsung dari portal resmi BMKG"
    >
      <ShieldCheck className="w-3.5 h-3.5 text-blue-600" aria-hidden="true" />
      <span>Sumber: {source}</span>
    </span>
  );
};
