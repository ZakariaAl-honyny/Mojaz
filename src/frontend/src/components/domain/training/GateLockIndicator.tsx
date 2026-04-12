"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { Lock, Unlock, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

interface GateLockIndicatorProps {
  isLocked: boolean;
  gateLabel?: string;
  className?: string;
}

/**
 * GateLockIndicator - Visual representation of a workflow gate (e.g. Gate 3).
 * Shows a padlock if requirements are not met.
 */
export function GateLockIndicator({ isLocked, gateLabel, className }: GateLockIndicatorProps) {
  const t = useTranslations("common.gates");

  return (
    <div className={cn(
      "flex items-center gap-3 p-3 rounded-lg border transition-all duration-500",
      isLocked 
        ? "bg-neutral-50 border-neutral-200 opacity-80" 
        : "bg-primary-50 border-primary-100 shadow-sm",
      className
    )}>
      <div className={cn(
        "w-10 h-10 rounded-full flex items-center justify-center transition-colors duration-500",
        isLocked ? "bg-white text-neutral-400 border border-neutral-100" : "bg-primary-600 text-white"
      )}>
        {isLocked ? <Lock className="w-5 h-5" /> : <ShieldCheck className="w-5 h-5" />}
      </div>
      
      <div className="flex flex-col">
        <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-[0.2em]">
          {gateLabel || "GATE 03"}
        </span>
        <span className={cn(
          "text-sm font-bold",
          isLocked ? "text-neutral-500" : "text-primary-700"
        )}>
          {isLocked ? "Requirements Pending" : "Gate Cleared"}
        </span>
      </div>
      
      {!isLocked && (
        <div className="ms-auto">
          <div className="flex h-2 w-2 rounded-full bg-primary-500 animate-pulse"></div>
        </div>
      )}
    </div>
  );
}
