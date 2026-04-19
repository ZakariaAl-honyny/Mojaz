'use client';

import { ColumnDef } from '@tanstack/react-table';
import { ApplicationSummaryDto } from '@/types/application.types';
import { StatusBadge } from '@/components/shared/status-badge';
import { Button } from '@/components/ui/button';
import { Eye, Clock, MoreHorizontal } from 'lucide-react';
import { Link } from '@/i18n/routing';

export const getColumns = (t: any): ColumnDef<ApplicationSummaryDto>[] => [
  {
    accessorKey: 'applicationNumber',
    header: t('columns.id'),
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
    header: t('columns.applicant'),
    cell: ({ row }) => (
      <div className="font-medium text-sm">
        {row.getValue('applicantName')}
      </div>
    ),
  },
  {
    accessorKey: 'licenseCategoryCode',
    header: t('columns.category'),
    cell: ({ row }) => (
      <div className="inline-flex items-center px-2 py-0.5 rounded-md bg-neutral-100 text-neutral-700 text-xs font-bold border border-neutral-200">
        {t('columns.categoryPrefix')} {row.getValue('licenseCategoryCode')}
      </div>
    ),
  },
  {
    accessorKey: 'currentStage',
    header: t('columns.stage'),
    cell: ({ row }) => (
      <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
        <Clock className="w-3 h-3" />
        {row.getValue('currentStage')}
      </div>
    ),
  },
  {
    accessorKey: 'status',
    header: t('columns.status'),
    cell: ({ row }) => (
      <StatusBadge status={row.getValue('status')} />
    ),
  },
  {
    accessorKey: 'submittedAt',
    header: t('columns.date'),
    cell: ({ row }) => (
      <div className="text-xs text-muted-foreground whitespace-nowrap">
        {row.getValue('submittedAt') ? new Date(row.getValue('submittedAt') as string).toLocaleDateString() : '-'}
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
            <Button data-testid="view-application-btn" variant="ghost" size="icon" className="h-8 w-8 text-primary-600 hover:text-primary-700 hover:bg-primary-50">
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
