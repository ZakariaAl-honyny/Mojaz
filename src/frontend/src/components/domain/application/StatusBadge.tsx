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
  const t = useTranslations("application.status");

  let colorClass = "bg-neutral-100 text-neutral-800 border-neutral-200";
  let dotClass = "bg-neutral-500";
  
  switch (status) {
    case "Draft":
      colorClass = "bg-neutral-100 text-neutral-600 border-neutral-200";
      dotClass = "bg-neutral-400";
      break;
    case "Submitted":
    case "InReview":
      colorClass = "bg-blue-50 text-blue-700 border-blue-200";
      dotClass = "bg-blue-500";
      break;
    case "Paid":
    case "Approved":
    case "Issued":
      colorClass = "bg-green-50 text-green-700 border-green-200";
      dotClass = "bg-green-500";
      break;
    case "Rejected":
    case "Cancelled":
      colorClass = "bg-red-50 text-red-700 border-red-200";
      dotClass = "bg-red-500";
      break;
    case "MedicalDone":
    case "TheoryDone":
    case "PracticalDone":
      colorClass = "bg-purple-50 text-purple-700 border-purple-200";
      dotClass = "bg-purple-500";
      break;
  }

  // Handle translation fallback if key doesn't exist. Assuming exact translation match for simplicity.
  // In a robust implementation, you'd verify the key exists.
  const translatedStatus = t(status.toString().toLowerCase() as any) || status;

  return (
    <span className={cn("inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border", colorClass, className)}>
      {showIcon && (
        <span className="me-1.5 flex h-2 w-2">
          <span className={cn("animate-ping absolute inline-flex h-2 w-2 rounded-full opacity-75", dotClass)}></span>
          <span className={cn("relative inline-flex rounded-full h-2 w-2", dotClass)}></span>
        </span>
      )}
      {translatedStatus}
    </span>
  );
}
