"use client";

import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { ApplicationStatus } from "@/types/api.types";

interface StatusBadgeProps {
  status: ApplicationStatus | string;
  className?: string;
  showIcon?: boolean;
}

export function StatusBadge({ status, className, showIcon = true }: StatusBadgeProps) {
  const t = useTranslations("status");

  let colorClass = "bg-white/5 text-neutral-400 border-white/10";
  let dotClass = "bg-neutral-500 shadow-[0_0_8px_rgba(115,115,115,0.5)]";
  
  switch (status) {
    case "Draft":
      colorClass = "bg-white/5 text-neutral-500 border-white/5";
      dotClass = "bg-neutral-600";
      break;
    case "Submitted":
    case "InReview":
      colorClass = "bg-blue-500/10 text-blue-400 border-blue-500/20";
      dotClass = "bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.6)]";
      break;
    case "Paid":
    case "Approved":
    case "Issued":
      colorClass = "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
      dotClass = "bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.6)]";
      break;
    case "Rejected":
    case "Cancelled":
      colorClass = "bg-red-500/10 text-red-400 border-red-500/20";
      dotClass = "bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.6)]";
      break;
    case "MedicalDone":
    case "TheoryDone":
    case "PracticalDone":
      colorClass = "bg-primary-500/10 text-primary-400 border-primary-500/20";
      dotClass = "bg-primary-500 shadow-[0_0_10px_rgba(30,58,138,0.6)]";
      break;
  }

  const translatedStatus = t(status.toString() as any) || status;

  return (
    <span className={cn("inline-flex items-center px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border backdrop-blur-md transition-all duration-300", colorClass, className)}>
      {showIcon && (
        <span className="me-2.5 flex h-2 w-2 relative">
          <span className={cn("animate-ping absolute inline-flex h-full w-full rounded-full opacity-40", dotClass)}></span>
          <span className={cn("relative inline-flex rounded-full h-2 w-2", dotClass)}></span>
        </span>
      )}
      {translatedStatus}
    </span>
  );
}
