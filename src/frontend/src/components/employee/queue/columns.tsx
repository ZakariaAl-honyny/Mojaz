'use client';

import { ColumnDef } from '@tanstack/react-table';
import { ApplicationSummaryDto } from '@/types/application.types';
import { StatusBadge } from '@/components/shared/status-badge';
import { Button } from '@/components/ui/button';
import { Eye, Clock, MoreHorizontal } from 'lucide-react';
import Link from 'next/link';

export const columns: ColumnDef<ApplicationSummaryDto>[] = [
  {
    accessorKey: 'applicationNumber',
    header: 'رقم الطلب',
    cell: ({ row }) => {
      return (
        <div className="flex flex-col">
          <span className="font-mono text-sm font-bold text-primary-700">
            {row.getValue('applicationNumber')}
          </span>
          <span className="text-[10px] text-muted-foreground uppercase tracking-tighter">
            {row.original.serviceType}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: 'applicantName',
    header: 'مقدم الطلب',
    cell: ({ row }) => (
      <div className="font-medium text-sm">
        {row.getValue('applicantName')}
      </div>
    ),
  },
  {
    accessorKey: 'licenseCategoryCode',
    header: 'الفئة',
    cell: ({ row }) => (
      <div className="inline-flex items-center px-2 py-0.5 rounded-md bg-neutral-100 text-neutral-700 text-xs font-bold border border-neutral-200">
        فئة {row.getValue('licenseCategoryCode')}
      </div>
    ),
  },
  {
    accessorKey: 'currentStage',
    header: 'المرحلة',
    cell: ({ row }) => (
      <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
        <Clock className="w-3 h-3" />
        {row.getValue('currentStage')}
      </div>
    ),
  },
  {
    accessorKey: 'status',
    header: 'الحالة',
    cell: ({ row }) => (
      <StatusBadge status={row.getValue('status')} />
    ),
  },
  {
    accessorKey: 'submittedDate',
    header: 'تاريخ التقديم',
    cell: ({ row }) => (
      <div className="text-xs text-muted-foreground">
        {new Date(row.getValue('submittedDate')).toLocaleDateString('ar-SA')}
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
            <Button variant="ghost" size="icon" className="h-8 w-8 text-primary-600 hover:text-primary-700 hover:bg-primary-50">
              <Eye className="w-4 h-4" />
            </Button>
          </Link>
          <Button variant="ghost" size="icon" className="h-8 w-8 text-neutral-400">
            <MoreHorizontal className="w-4 h-4" />
          </Button>
        </div>
      );
    },
  },
];
