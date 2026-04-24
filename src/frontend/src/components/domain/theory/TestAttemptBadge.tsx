'use client';

import { cn } from '@/lib/utils';
import { Target, AlertCircle, CheckCircle2 } from 'lucide-react';

interface TestAttemptBadgeProps {
  currentAttempt: number;
  maxAttempts: number;
}

export function TestAttemptBadge({ currentAttempt, maxAttempts }: TestAttemptBadgeProps) {
  const percentage = (currentAttempt / maxAttempts) * 100;
  
  const config = 
    percentage < 50 ? { 
      styles: 'bg-emerald-50 text-emerald-600 ring-1 ring-emerald-100',
      icon: CheckCircle2,
      label: 'محاولة مبكرة'
    } :
    percentage <= 66 ? { 
      styles: 'bg-amber-50 text-amber-600 ring-1 ring-amber-100',
      icon: Target,
      label: 'محاولة متوسطة'
    } :
    { 
      styles: 'bg-red-50 text-red-600 ring-1 ring-red-100',
      icon: AlertCircle,
      label: 'المحاولة الأخيرة'
    };
  
  const Icon = config.icon;

  return (
    <div className={cn(
      "inline-flex items-center gap-3 px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all duration-500 font-arabic",
      config.styles
    )}>
      <Icon className="w-3.5 h-3.5" />
      <span className="flex items-center gap-1.5">
        <span className="text-sm font-black">{currentAttempt}</span>
        <span className="opacity-40">/</span>
        <span className="text-sm font-black">{maxAttempts}</span>
      </span>
      <span className="opacity-60 border-s border-current ps-3 ms-1 hidden sm:inline">
        {config.label}
      </span>
    </div>
  );
}