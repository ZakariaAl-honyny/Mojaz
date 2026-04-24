"use client";

import { cn } from "@/lib/utils";
import { TrainingStatusString } from "@/types/training.types";
import { Clock, CheckCircle2, ShieldCheck, HelpCircle } from "lucide-react";

interface TrainingStatusBadgeProps {
  status: TrainingStatusString;
  className?: string;
  variant?: "solid" | "outline";
}

export function TrainingStatusBadge({ 
  status, 
  className,
  variant = "outline" 
}: TrainingStatusBadgeProps) {
  const getStatusConfig = (statusValue: string) => {
    switch (statusValue) {
      case "Required":
        return {
          label: "مطلوب",
          icon: HelpCircle,
          styles: "bg-neutral-50 text-neutral-400 border-neutral-100",
        };
      case "InProgress":
        return {
          label: "قيد التدريب",
          icon: Clock,
          styles: "bg-amber-50 text-amber-600 border-amber-100",
          animate: true,
        };
      case "Completed":
        return {
          label: "مكتمل",
          icon: CheckCircle2,
          styles: "bg-emerald-50 text-emerald-600 border-emerald-100",
        };
      case "Exempted":
        return {
          label: "مُعفى",
          icon: ShieldCheck,
          styles: "bg-blue-50 text-[#1a3a8f] border-blue-100",
        };
      default:
        return {
          label: "غير معروف",
          icon: HelpCircle,
          styles: "bg-neutral-50 text-neutral-300 border-neutral-100",
        };
    }
  };

  const config = getStatusConfig(status);
  const Icon = config.icon;

  return (
    <span 
      className={cn(
        "inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border transition-all duration-300 font-arabic",
        config.styles,
        className
      )}
    >
      {config.animate && (
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
        </span>
      )}
      <Icon className="w-3.5 h-3.5" />
      {config.label}
    </span>
  );
}

export default TrainingStatusBadge;
