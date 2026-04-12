"use client";

import React, { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";

interface TrainingProgressArcProps {
  completedHours: number;
  totalHours: number;
  size?: number;
  strokeWidth?: number;
  className?: string;
}

/**
 * TrainingProgressArc - A premium circular progress indicator for training completion.
 * Follows the Mojaz ledger aesthetic with smooth CSS animations.
 */
export function TrainingProgressArc({
  completedHours,
  totalHours,
  size = 160,
  strokeWidth = 12,
  className,
}: TrainingProgressArcProps) {
  const t = useTranslations("training.arc");
  const [offset, setOffset] = useState(0);
  
  const percentage = Math.min(100, Math.max(0, (completedHours / totalHours) * 100));
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  useEffect(() => {
    // Adding a timeout for the entry animation "wow" factor
    const timer = setTimeout(() => {
      const progressOffset = circumference - (percentage / 100) * circumference;
      setOffset(progressOffset);
    }, 100);
    return () => clearTimeout(timer);
  }, [percentage, circumference]);

  return (
    <div className={cn("relative flex items-center justify-center", className)} style={{ width: size, height: size }}>
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="transform -rotate-90" // Start from top
      >
        {/* Background Track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="transparent"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-neutral-100 dark:text-neutral-800"
        />
        {/* Progress Arc */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="transparent"
          stroke="url(#arcGradient)"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-1000 ease-out"
          style={{ 
            filter: "drop-shadow(0 0 8px rgba(0, 108, 53, 0.4))",
            transitionProperty: "stroke-dashoffset"
          }}
        />

        {/* Gradient Definition */}
        <defs>
          <linearGradient id="arcGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#006C35" />
            <stop offset="100%" stopColor="#10B981" />
          </linearGradient>
        </defs>
      </svg>
      
      {/* Center Content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <span className="text-3xl font-bold font-mono tracking-tighter text-neutral-900 dark:text-neutral-50">
          {completedHours}
          <span className="text-sm font-medium text-neutral-400 mx-1">/</span>
          <span className="text-xl text-neutral-500">{totalHours}</span>
        </span>
        <span className="text-[10px] uppercase font-bold tracking-widest text-neutral-400 mt-1">
          {t('hoursLabel')}
        </span>
      </div>
      
      {/* Decorative details for ledger look */}
      <div className="absolute -top-1 -left-1 w-2 h-2 border-t border-l border-neutral-300"></div>
      <div className="absolute -top-1 -right-1 w-2 h-2 border-t border-r border-neutral-300"></div>
      <div className="absolute -bottom-1 -left-1 w-2 h-2 border-b border-l border-neutral-300"></div>
      <div className="absolute -bottom-1 -right-1 w-2 h-2 border-b border-r border-neutral-300"></div>
    </div>
  );
}
