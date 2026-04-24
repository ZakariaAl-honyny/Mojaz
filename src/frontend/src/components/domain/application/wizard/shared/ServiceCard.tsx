'use client';

import React from 'react';
import * as LucideIcons from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface ServiceCardProps {
  titleAr: string;
  descriptionAr: string;
  iconName: string;
  selected: boolean;
  onClick: () => void;
  disabled?: boolean;
}

export default function ServiceCard({
  titleAr,
  descriptionAr,
  iconName,
  selected,
  onClick,
  disabled = false,
}: ServiceCardProps) {
  // Dynamic icon component
  const Icon = (LucideIcons as any)[iconName] || LucideIcons.HelpCircle;

  return (
    <div
      onClick={() => !disabled && onClick()}
      className={cn(
        "relative p-6 md:p-8 lg:p-10 cursor-pointer transition-all duration-700 border border-transparent group rounded-xl md:rounded-2xl lg:rounded-[2.5rem] overflow-hidden font-arabic bg-white",
        selected 
          ? "border-[#1a3a8f]/20 shadow-2xl shadow-blue-900/10 scale-[1.02] z-10" 
          : "hover:bg-white hover:shadow-2xl hover:border-neutral-100/50 hover:-translate-y-1.5",
        disabled && "opacity-60 cursor-not-allowed grayscale pointer-events-none"
      )}
      dir="rtl"
    >
      {/* Background Interactive Patterns */}
      <div className={cn(
        "absolute inset-0 transition-opacity duration-1000 pointer-events-none",
        selected ? "opacity-100" : "opacity-0 group-hover:opacity-10"
      )}>
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#1a3a8f]/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-[#1a3a8f]/5 rounded-full blur-[40px] translate-y-1/3 -translate-x-1/3" />
      </div>

      <div className="flex flex-col gap-8 relative z-10 text-right">
        {/* Header Indicator */}
        <div className="flex items-center justify-between">
            <div className={cn(
              "w-12 h-12 md:w-16 md:h-16 lg:w-20 lg:h-20 rounded-xl md:rounded-2xl lg:rounded-3xl flex items-center justify-center transition-all duration-700 shadow-sm relative overflow-hidden",
              selected 
                ? "bg-[#1a3a8f] text-white shadow-xl shadow-blue-900/30 scale-110 rotate-3" 
                : "bg-neutral-50 text-neutral-300 group-hover:bg-[#1a3a8f] group-hover:text-white"
            )}>
              <Icon className="w-6 h-6 md:w-8 md:h-8 lg:w-10 lg:h-10 relative z-10" />
              <div className="absolute inset-0 bg-gradient-to-tr from-black/20 to-transparent opacity-40" />
            </div>

            {selected ? (
                <motion.div 
                   initial={{ scale: 0, rotate: -45 }}
                   animate={{ scale: 1, rotate: 0 }}
                   className="w-10 h-10 md:w-12 md:h-12 bg-emerald-500 text-white rounded-lg md:rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20"
                >
                    <LucideIcons.Check className="w-5 h-5 md:w-7 md:h-7 stroke-[4px]" />
                </motion.div>
            ) : disabled && (
                <span className="text-[10px] font-black uppercase tracking-[0.3em] bg-neutral-100 text-neutral-400 px-4 md:px-6 py-2 md:py-2.5 rounded-full border border-neutral-200">
                    قريباً
                </span>
            )}
        </div>

        {/* Content Section */}
        <div className="space-y-3 md:space-y-4">
          <div className="space-y-1">
             <span className={cn(
                "text-[9px] md:text-[10px] font-black uppercase tracking-[0.4em] block transition-colors",
                selected ? "text-[#1a3a8f]/60" : "text-neutral-400"
             )}>
                التصنيف الرقمي
             </span>
             <h3 className={cn(
                "text-xl md:text-2xl font-black transition-colors duration-700 tracking-tight leading-none",
                selected ? "text-[#1a3a8f]" : "text-neutral-900"
             )}>
                {titleAr}
             </h3>
          </div>
          <p className={cn(
             "text-sm md:text-base font-bold leading-relaxed transition-colors duration-700",
             selected ? "text-[#1a3a8f]/70" : "text-neutral-400 group-hover:text-neutral-600"
          )}>
            {descriptionAr}
          </p>
        </div>

        {/* Action Suggestion */}
        <div className={cn(
            "pt-6 border-t font-black text-xs flex items-center gap-3 transition-colors duration-700",
            selected ? "border-[#1a3a8f]/10 text-[#1a3a8f]" : "border-transparent text-transparent group-hover:text-[#1a3a8f]/40"
        )}>
            <LucideIcons.ArrowLeft className="w-4 h-4" />
            <span>المتابعة إلى الخطوة القادمة</span>
        </div>
      </div>
    </div>
  );
}
