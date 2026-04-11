'use client';

import React from 'react';
import { useLocale } from 'next-intl';
import * as LucideIcons from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card } from '@/components/ui/card';
import { LicenseCategoryCode } from '@/types/wizard.types';

interface CategoryCardProps {
  code: LicenseCategoryCode;
  nameAr: string;
  nameEn: string;
  minAge: number;
  descriptionAr: string;
  descriptionEn: string;
  selected: boolean;
  onClick: () => void;
  iconName?: string;
  disabled?: boolean;
}

export default function CategoryCard({
  code,
  nameAr,
  nameEn,
  minAge,
  descriptionAr,
  descriptionEn,
  selected,
  onClick,
  iconName = 'Car',
  disabled = false,
}: CategoryCardProps) {
  const locale = useLocale();
  const Icon = (LucideIcons as any)[iconName] || LucideIcons.Car;

  const name = locale === 'ar' ? nameAr : nameEn;
  const description = locale === 'ar' ? descriptionAr : descriptionEn;

  return (
    <Card
      onClick={() => !disabled && onClick()}
      className={cn(
        "relative p-5 cursor-pointer transition-all duration-300 border-2",
        selected 
          ? "border-primary-500 bg-primary-50/30 dark:bg-primary-900/10 shadow-md ring-1 ring-primary-100 dark:ring-primary-900/20" 
          : "border-neutral-100 dark:border-neutral-800 hover:border-primary-200 dark:hover:border-primary-800",
        disabled && "opacity-50 cursor-not-allowed grayscale"
      )}
    >
      <div className="flex items-center gap-4">
        {/* Category Circle */}
        <div className={cn(
          "w-12 h-12 rounded-full flex items-center justify-center text-xl font-black transition-colors duration-300 shadow-sm",
          selected ? "bg-primary-600 text-white" : "bg-neutral-100 dark:bg-neutral-800 text-neutral-400"
        )}>
          {code}
        </div>

        <div className="flex-1">
          <div className="flex items-center justify-between mb-1">
            <h3 className={cn(
              "font-bold transition-colors duration-300",
              selected ? "text-primary-700 dark:text-primary-400" : "text-neutral-900 dark:text-neutral-100"
            )}>
              {name}
            </h3>
            <span className={cn(
              "text-[10px] font-bold px-2 py-0.5 rounded-full",
              selected ? "bg-primary-100 text-primary-700" : "bg-neutral-100 text-neutral-500"
            )}>
              {minAge}+
            </span>
          </div>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 line-clamp-1">
            {description}
          </p>
        </div>

        {selected && (
          <div className="absolute top-2 end-2">
            <LucideIcons.CheckCircle2 className="w-4 h-4 text-primary-600 fill-primary-50" />
          </div>
        )}
      </div>
    </Card>
  );
}