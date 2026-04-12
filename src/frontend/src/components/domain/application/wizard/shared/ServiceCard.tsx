'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import * as LucideIcons from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card } from '@/components/ui/card';

interface ServiceCardProps {
  titleKey: string;
  descriptionKey: string;
  iconName: string;
  selected: boolean;
  onClick: () => void;
  disabled?: boolean;
}

export default function ServiceCard({
  titleKey,
  descriptionKey,
  iconName,
  selected,
  onClick,
  disabled = false,
}: ServiceCardProps) {
  const t = useTranslations();
  
  // Dynamic icon component
  const Icon = (LucideIcons as any)[iconName] || LucideIcons.HelpCircle;

  return (
    <Card
      onClick={() => !disabled && onClick()}
      className={cn(
        "relative p-6 cursor-pointer transition-all duration-300 border-2 group",
        selected 
          ? "border-primary-500 bg-primary-50/50 dark:bg-primary-900/10 ring-2 ring-primary-100 dark:ring-primary-900/20" 
          : "border-neutral-100 dark:border-neutral-800 hover:border-primary-200 dark:hover:border-primary-800 hover:bg-neutral-50 dark:hover:bg-neutral-800/50",
        disabled && "opacity-50 cursor-not-allowed grayscale"
      )}
    >
      <div className="flex items-start gap-4">
        {/* Icon Container */}
        <div className={cn(
          "w-12 h-12 rounded-lg flex items-center justify-center transition-colors duration-300",
          selected 
            ? "bg-primary-500 text-white" 
            : "bg-neutral-100 dark:bg-neutral-800 text-neutral-500 group-hover:bg-primary-100 group-hover:text-primary-600"
        )}>
          <Icon className="w-6 h-6" />
        </div>

        {/* Content */}
        <div className="flex-1">
          <h3 className={cn(
            "text-lg font-bold mb-1 transition-colors duration-300",
            selected ? "text-primary-700 dark:text-primary-400" : "text-neutral-900 dark:text-neutral-100"
          )}>
            {t(titleKey)}
          </h3>
          <p className="text-sm text-neutral-500 dark:text-neutral-400 line-clamp-2">
            {t(descriptionKey)}
          </p>
        </div>

        {/* Selected Checkmark Overlay */}
        {selected && (
          <div className="absolute top-2 end-2">
            <div className="bg-primary-500 text-white rounded-full p-1 shadow-sm">
              <LucideIcons.Check className="w-3 h-3 stroke-[4px]" />
            </div>
          </div>
        )}
        
        {/* Unavailable Badge */}
        {disabled && (
          <div className="absolute top-2 end-2">
            <span className="text-[10px] font-bold uppercase tracking-wider bg-neutral-200 dark:bg-neutral-700 text-neutral-500 px-2 py-0.5 rounded-full">
              {t('wizard.step1.notAvailable')}
            </span>
          </div>
        )}
      </div>
    </Card>
  );
}
