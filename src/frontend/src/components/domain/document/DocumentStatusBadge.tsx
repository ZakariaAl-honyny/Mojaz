'use client';

import { DocumentStatus } from '@/types/document.types';
import { cn } from '@/lib/utils';
import { Clock, CheckCircle2, AlertCircle, HelpCircle } from 'lucide-react';

interface DocumentStatusBadgeProps {
  status: DocumentStatus;
  className?: string;
}

export function DocumentStatusBadge({ status, className = '' }: DocumentStatusBadgeProps) {
  const getStatusConfig = (statusValue: DocumentStatus) => {
    switch (statusValue) {
      case DocumentStatus.Pending:
        return {
          label: 'قيد المراجعة',
          icon: Clock,
          styles: 'bg-amber-50 text-amber-600 ring-1 ring-amber-100',
        };
      case DocumentStatus.Approved:
        return {
          label: 'مقبول',
          icon: CheckCircle2,
          styles: 'bg-emerald-50 text-emerald-600 ring-1 ring-emerald-100',
        };
      case DocumentStatus.Rejected:
        return {
          label: 'مرفوض',
          icon: AlertCircle,
          styles: 'bg-red-50 text-red-600 ring-1 ring-red-100',
        };
      default:
        return {
          label: 'غير معروف',
          icon: HelpCircle,
          styles: 'bg-neutral-50 text-neutral-400 ring-1 ring-neutral-100',
        };
    }
  };

  const config = getStatusConfig(status);
  const Icon = config.icon;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all duration-300 font-arabic",
        config.styles,
        className
      )}
    >
      <Icon className="w-3.5 h-3.5" />
      {config.label}
    </span>
  );
}

export default DocumentStatusBadge;