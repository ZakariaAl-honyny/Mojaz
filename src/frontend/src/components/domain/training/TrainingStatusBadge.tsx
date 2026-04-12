"use client";

import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { TrainingStatusString } from "@/types/training.types";

interface TrainingStatusBadgeProps {
  status: TrainingStatusString;
  className?: string;
  variant?: "solid" | "outline" | "ghost";
}

/**
 * TrainingStatusBadge - Themed badge for training status tracking.
 * Uses Royal Green for Completed and Government Gold for In Progress.
 */
export function TrainingStatusBadge({ 
  status, 
  className,
  variant = "outline" 
}: TrainingStatusBadgeProps) {
  const t = useTranslations("training.status");

  let colorClass = "";
  
  switch (status) {
    case "Required":
      colorClass = "bg-neutral-100 text-neutral-600 border-neutral-300";
      break;
    case "InProgress":
      colorClass = "bg-amber-50 text-amber-700 border-amber-200"; // Government Gold-ish
      break;
    case "Completed":
      colorClass = "bg-primary-50 text-primary-700 border-primary-200"; // Royal Green
      break;
    case "Exempted":
      colorClass = "bg-blue-50 text-blue-700 border-blue-200";
      break;
    default:
      colorClass = "bg-neutral-100 text-neutral-800 border-neutral-200";
  }

  // Simplified variant logic for Mojaz aesthetic
  const variantStyles = variant === "solid" 
    ? colorClass.replace("-50", "-600").replace("text-", "text-white ") 
    : colorClass;

  const translatedLabel = t(status.toLowerCase());

  return (
    <span 
      className={cn(
        "inline-flex items-center px-2.5 py-1 rounded-md text-[10px] uppercase tracking-wider font-bold border transition-colors",
        variantStyles,
        className
      )}
    >
      {status === 'InProgress' && (
        <span className="me-1.5 flex h-1.5 w-1.5">
          <span className="animate-ping absolute inline-flex h-1.5 w-1.5 rounded-full bg-amber-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-amber-500"></span>
        </span>
      )}
      {translatedLabel}
    </span>
  );
}
