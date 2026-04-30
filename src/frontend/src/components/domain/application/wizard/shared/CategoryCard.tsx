'use client';

import React from 'react';
import * as LucideIcons from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card } from '@/components/ui/card';
import { LicenseCategoryCode } from '@/types/wizard.types';
import { motion, AnimatePresence } from 'framer-motion';

interface CategoryCardProps {
  code: string;
  nameAr: string;
  minAge: number;
  descriptionAr: string;
  selected: boolean;
  onClick: () => void;
  iconName?: string;
  disabled?: boolean;
}

export default function CategoryCard({
  code,
  nameAr,
  minAge,
  descriptionAr,
  selected,
  onClick,
  iconName = 'Car',
  disabled = false,
}: CategoryCardProps) {
  const Icon = (LucideIcons[iconName as keyof typeof LucideIcons] as React.ElementType) || LucideIcons.Car;

  return (
    <Card
      onClick={() => !disabled && onClick()}
      className={cn(
        "relative p-8 cursor-pointer transition-all duration-700 border border-transparent group rounded-[2.5rem] overflow-hidden bg-white hover:bg-white font-arabic",
        selected 
          ? "border-[#1a3a8f]/20 shadow-2xl shadow-blue-900/10 scale-[1.03] z-10" 
          : "hover:shadow-[0_30px_70px_-20px_rgba(26,58,143,0.1)] hover:border-neutral-100 hover:-translate-y-2",
        disabled && "opacity-60 cursor-not-allowed grayscale pointer-events-none bg-neutral-50/50"
      )}
    >
      {/* Institutional Background Glow */}
      <div className={cn(
        "absolute inset-0 transition-opacity duration-1000 pointer-events-none",
        selected ? "opacity-100" : "opacity-0 group-hover:opacity-10"
      )}>
          <div className="absolute top-0 end-0 w-32 h-32 bg-[#1a3a8f]/10 rounded-full blur-[60px]" />
      </div>

      <div className="flex flex-col gap-6 relative z-10">
        <div className="flex items-center justify-between">
            {/* Category Code Node */}
            <div className={cn(
              "w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-black transition-all duration-700 shadow-sm relative overflow-hidden",
              selected 
                ? "bg-[#1a3a8f] text-white shadow-xl shadow-blue-900/30 scale-110" 
                : "bg-neutral-50 text-neutral-400 group-hover:bg-[#1a3a8f] group-hover:text-white"
            )}>
              <span className="relative z-10">{code}</span>
              <div className="absolute inset-0 bg-gradient-to-tr from-black/10 to-transparent opacity-20" />
            </div>

            {/* Selection Checkmark */}
            <AnimatePresence>
                {selected && (
                    <motion.div 
                       initial={{ scale: 0, rotate: -45 }}
                       animate={{ scale: 1, rotate: 0 }}
                       className="w-10 h-10 bg-emerald-500 text-white rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20"
                    >
                        <LucideIcons.Check className="w-6 h-6 stroke-[4px]" />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>

        <div className="space-y-4">
          <div className="flex flex-col gap-1">
             <div className="flex items-center justify-between">
                <span className={cn(
                    "text-[9px] font-black uppercase tracking-[0.3em] block transition-colors",
                    selected ? "text-[#1a3a8f]/60" : "text-neutral-400"
                )}>
                   تصنيف الرخصة
                </span>
                <span className={cn(
                   "text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest border transition-all duration-700",
                   selected ? "bg-[#1a3a8f] text-white border-[#1a3a8f]" : "bg-neutral-50 text-neutral-400 border-neutral-100"
                )}>
                  للأعمار {minAge}+
                </span>
             </div>
             <h3 className={cn(
               "text-2xl font-black transition-colors duration-700 tracking-tight leading-none pt-1",
               selected ? "text-[#1a3a8f]" : "text-neutral-900"
             )}>
                {nameAr}
             </h3>
          </div>
          <p className={cn(
             "text-sm font-bold leading-relaxed line-clamp-2 transition-colors duration-700",
             selected ? "text-[#1a3a8f]/70" : "text-neutral-400 group-hover:text-neutral-600"
          )}>
            {descriptionAr}
          </p>
        </div>
        
        {/* Policy Footer */}
        <div className={cn(
            "pt-4 border-t transition-opacity duration-700",
            selected ? "border-[#1a3a8f]/10 opacity-100" : "opacity-0 invisible"
        )}>
            <div className="flex items-center gap-2 text-[10px] font-black text-[#1a3a8f]/40 uppercase tracking-widest">
                <LucideIcons.ShieldCheck className="w-3.5 h-3.5" />
                <span>مطابق لمعايير الأهلية العمرية</span>
            </div>
        </div>
      </div>
    </Card>
  );
}