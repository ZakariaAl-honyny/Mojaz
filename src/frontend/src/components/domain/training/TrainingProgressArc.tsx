"use client";

import React, { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface TrainingProgressArcProps {
  completedHours: number;
  totalHours: number;
  size?: number;
  strokeWidth?: number;
  className?: string;
}

export function TrainingProgressArc({
  completedHours,
  totalHours,
  size = 180,
  strokeWidth = 14,
  className,
}: TrainingProgressArcProps) {
  const [offset, setOffset] = useState(0);

  const percentage = Math.min(100, Math.max(0, (completedHours / totalHours) * 100));
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  // Set initial state for circumference to handle animation
  const initialOffset = circumference;

  useEffect(() => {
    const timer = setTimeout(() => {
      const progressOffset = circumference - (percentage / 100) * circumference;
      setOffset(progressOffset);
    }, 200);
    return () => clearTimeout(timer);
  }, [percentage, circumference]);

  return (
    <div className={cn("relative flex items-center justify-center font-arabic", className)} style={{ width: size, height: size }} dir="rtl">
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="transform -rotate-90"
      >
        {/* Background Track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="transparent"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-neutral-50/50"
        />
        {/* Progress Arc */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="transparent"
          stroke="url(#kingBlueGradient)"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset === 0 ? initialOffset : offset}
          strokeLinecap="round"
          className="transition-all duration-[1500ms] ease-in-out"
          style={{
            filter: "drop-shadow(0 0 12px rgba(26, 58, 143, 0.2))",
          }}
        />

        {/* Gradient Definition */}
        <defs>
          <linearGradient id="kingBlueGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1a3a8f" />
            <stop offset="100%" stopColor="#3b82f6" />
          </linearGradient>
        </defs>
      </svg>

      {/* Center Content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center pt-2">
        <div className="flex items-baseline gap-1 animate-in fade-in zoom-in duration-700">
           <span className="text-4xl font-black text-[#1a3a8f] tracking-tighter">
             {completedHours}
           </span>
           <span className="text-lg font-bold text-neutral-300">/</span>
           <span className="text-xl font-bold text-neutral-400">{totalHours}</span>
        </div>
        <div className="mt-2 flex flex-col items-center">
           <span className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400">ساعة تدريبية</span>
           <div className="w-8 h-1 bg-[#1a3a8f]/10 rounded-full mt-2" />
        </div>
      </div>

      {/* Visual Accents */}
      <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-blue-50/50 rounded-tr-lg" />
      <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-blue-50/50 rounded-bl-lg" />
    </div>
  );
}

export default TrainingProgressArc;
