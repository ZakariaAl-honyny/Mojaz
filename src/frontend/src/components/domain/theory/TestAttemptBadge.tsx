'use client';

import { useTranslations } from 'next-intl';
import { cn } from '@/lib/utils';

interface TestAttemptBadgeProps {
  currentAttempt: number;
  maxAttempts: number;
}

export function TestAttemptBadge({ currentAttempt, maxAttempts }: TestAttemptBadgeProps) {
  const t = useTranslations('theory');
  
  const percentage = (currentAttempt / maxAttempts) * 100;
  
  const badgeColor = 
    percentage < 50 ? 'bg-green-100 text-green-700 border-green-200' :
    percentage <= 66 ? 'bg-amber-100 text-amber-700 border-amber-200' :
    'bg-red-100 text-red-700 border-red-200';
  
  return (
    <div className={cn(
      "inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold border",
      badgeColor
    )}>
      <span>{currentAttempt} / {maxAttempts}</span>
      <span className="text-xs opacity-75">{t('history.attemptBadge')}</span>
    </div>
  );
}