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
  const Icon = (LucideIcons[iconName as keyof typeof LucideIcons] as React.ElementType) || LucideIcons.HelpCircle;

  return (
    <div
      onClick={() => !disabled && onClick()}
      className={cn(
        "h-full min-h-[140px] p-3 cursor-pointer transition-all duration-300 border group rounded-lg overflow-hidden font-arabic bg-white",
        selected 
          ? "border-[#1a3a8f] shadow-md ring-1 ring-[#1a3a8f]/20" 
          : "hover:border-neutral-300 hover:shadow-sm border-neutral-100",
        disabled && "opacity-50 cursor-not-allowed grayscale pointer-events-none"
      )}
      dir="rtl"
    >
      {/* Icon Row - Always same size */}
      <div className="flex items-center justify-between mb-2">
        <div className={cn(
          "w-8 h-8 rounded-md flex items-center justify-center transition-all duration-300",
          selected 
            ? "bg-[#1a3a8f] text-white" 
            : "bg-neutral-100 text-neutral-400 group-hover:bg-[#1a3a8f] group-hover:text-white"
        )}>
          <Icon className="w-4 h-4" />
        </div>

        {selected ? (
            <motion.div 
               initial={{ scale: 0 }}
               animate={{ scale: 1 }}
               className="w-5 h-5 bg-emerald-500 text-white rounded-full flex items-center justify-center"
            >
                <LucideIcons.Check className="w-3 h-3 stroke-[3px]" />
            </motion.div>
        ) : disabled && (
            <span className="text-[8px] font-bold uppercase tracking-wider bg-neutral-100 text-neutral-400 px-1.5 py-0.5 rounded">
                قريباً
            </span>
        )}
      </div>

      {/* Content - Fixed sizes */}
      <div className="space-y-1">
         <span className={cn(
           "text-[8px] font-bold uppercase tracking-wider block",
           selected ? "text-[#1a3a8f]/60" : "text-neutral-400"
         )}>
           التصنيف
        </span>
        <h3 className={cn(
           "text-sm font-bold transition-colors",
           selected ? "text-[#1a3a8f]" : "text-neutral-800"
        )}>
          {titleAr}
        </h3>
        <p className={cn(
           "text-[11px] font-medium transition-colors line-clamp-2",
           selected ? "text-[#1a3a8f]/70" : "text-neutral-400"
        )}>
          {descriptionAr}
        </p>
      </div>
    </div>
  );
}