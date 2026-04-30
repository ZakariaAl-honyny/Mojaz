'use client';

import { ColumnDef } from '@tanstack/react-table';
import { ApplicationSummaryDto } from '@/types/application.types';
import { StatusBadge } from '@/components/shared/status-badge';
import { Button } from '@/components/ui/button';
import { Eye, Clock, MoreHorizontal, User, Tag } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export const columns: ColumnDef<ApplicationSummaryDto>[] = [
  {
    accessorKey: 'applicationNumber',
    header: () => <div className="text-start">رقم الطلب</div>,
    cell: ({ row }) => {
      const app = row.original;
      return (
        <div className="flex items-center gap-4 text-start">
          <div className="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center shrink-0 border border-primary-100/50">
             <Tag className="w-5 h-5 text-[#1a3a8f]" />
          </div>
          <div className="flex flex-col">
            <span className="font-black text-[#1a3a8f] tracking-tight leading-none mb-1">
            {row.getValue('applicationNumber')}
            </span>
            <span className="text-[9px] text-neutral-400 font-black uppercase tracking-widest leading-none">
              {app.serviceType}
            </span>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: 'applicantName',
    header: () => <div className="text-start">مقدم الطلب</div>,
    cell: ({ row }) => (
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-neutral-100 flex items-center justify-center border border-neutral-200">
           <User className="w-4 h-4 text-neutral-500" />
        </div>
        <div className="flex flex-col">
          <span className="font-black text-neutral-800 text-sm leading-none mb-1">
            {row.getValue('applicantName')}
          </span>
          <span className="text-[9px] text-neutral-400 font-bold uppercase tracking-tighter leading-none">
             مواطن بموجب الهوية
          </span>
        </div>
      </div>
    ),
  },
  {
    accessorKey: 'licenseCategoryCode',
    header: () => <div className="text-start">الفئة</div>,
    cell: ({ row }) => (
      <div className="inline-flex items-center px-3 py-1 rounded-lg bg-neutral-100 text-neutral-900 text-[10px] font-black border border-neutral-200 uppercase tracking-widest">
        {row.getValue('licenseCategoryCode')}
      </div>
    ),
  },
  {
    accessorKey: 'currentStage',
    header: () => <div className="text-start">المرحلة الحالية</div>,
    cell: ({ row }) => (
      <div className="flex items-center gap-2 text-[11px] text-neutral-600 font-bold justify-start">
        <div className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse shrink-0" />
        {row.getValue('currentStage')}
      </div>
    ),
  },
  {
    accessorKey: 'status',
    header: () => <div className="text-start">الحالة</div>,
    cell: ({ row }) => (
      <div className="flex justify-start">
        <StatusBadge status={row.getValue('status')} />
      </div>
    ),
  },
  {
    accessorKey: 'submittedDate',
    header: () => <div className="text-start">تاريخ التقديم</div>,
    cell: ({ row }) => (
      <div className="flex flex-col items-start gap-1">
        <span className="text-xs text-neutral-900 font-black tracking-tight leading-none">
          {new Date(row.getValue('submittedDate')).toLocaleDateString('ar-YE', { day: '2-digit', month: '2-digit', year: 'numeric' })}
        </span>
        <span className="text-[9px] text-neutral-400 font-bold uppercase tracking-widest leading-none">
           بتوقيت النظام
        </span>
      </div>
    ),
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const app = row.original;

      return (
        <div className="flex justify-end gap-2">
          <Link href={`/employee/applications/${app.id}`}>
            <Button 
              data-testid="view-application-btn" 
              variant="outline" 
              className="h-10 px-4 bg-white border-neutral-200 text-[#1a3a8f] hover:bg-neutral-50 hover:border-primary-200 rounded-xl font-black text-xs transition-all gap-2"
            >
              <Eye className="w-4 h-4" />
              عرض التفاصيل
            </Button>
          </Link>
          <Button variant="ghost" size="icon" className="h-10 w-10 text-neutral-300 rounded-xl border border-transparent hover:border-neutral-200">
            <MoreHorizontal className="w-5 h-5" />
          </Button>
        </div>
      );
    },
  },
];
