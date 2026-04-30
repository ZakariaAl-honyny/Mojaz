'use client';

import { cn } from '@/lib/utils';
import { CheckCircle2, XCircle, Clock } from 'lucide-react';
import { TestResult } from '@/lib/enums';

interface TestAttemptBadgeProps {
  result: TestResult;
}

export function TestAttemptBadge({ result }: TestAttemptBadgeProps) {
  const getStatusConfig = (res: TestResult) => {
    switch (res) {
      case TestResult.Pass:
        return {
          label: 'ناجح (اجتياز)',
          icon: CheckCircle2,
          styles: 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20',
        };
      case TestResult.Fail:
        return {
          label: 'راسب (لم يجتز)',
          icon: XCircle,
          styles: 'bg-red-500 text-white shadow-lg shadow-red-500/20',
        };
      case TestResult.Absent:
        return {
          label: 'غائب',
          icon: Clock,
          styles: 'bg-amber-500 text-white shadow-lg shadow-amber-500/20',
        };
      default:
        return {
          label: 'غير معروف',
          icon: Clock,
          styles: 'bg-neutral-500 text-white shadow-lg shadow-neutral-500/20',
        };
    }
  };

  const config = getStatusConfig(result);
  const Icon = config.icon;

  return (
    <div className={cn(
      "inline-flex items-center gap-2 px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.15em] transition-all duration-500 font-arabic",
      config.styles
    )}>
      <Icon className="w-3.5 h-3.5" />
      {config.label}
    </div>
  );
}

