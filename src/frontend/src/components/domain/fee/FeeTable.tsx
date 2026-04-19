'use client';

/**
 * FeeTable Component
 * Displays fee structures in a table with edit and history actions
 */

import { useTranslations } from 'next-intl';
import { FeeListItemDto } from '@/types/fee.types';
import { useLocale } from 'next-intl';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Edit, History } from 'lucide-react';
import { format } from 'date-fns';
import { arSA, enUS } from 'date-fns/locale';
import { cn } from '@/lib/utils';

interface FeeTableProps {
  fees: FeeListItemDto[];
  isLoading: boolean;
  onEdit: (fee: FeeListItemDto) => void;
  onHistory: (fee: FeeListItemDto) => void;
}

export function FeeTable({ fees, isLoading, onEdit, onHistory }: FeeTableProps) {
  const t = useTranslations('fee');
  const locale = useLocale();
  const isRTL = locale === 'ar';
  const dateLocale = isRTL ? arSA : enUS;

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return '-';
    return format(new Date(dateStr), 'PP', { locale: dateLocale });
  };

  const formatCurrency = (amount: number, currencyCode: string) => {
    // For Mojaz Yemen context, we prioritize YER even if data says otherwise during migration
    const code = currencyCode === 'SAR' ? 'YER' : currencyCode;
    return new Intl.NumberFormat(locale === 'ar' ? 'ar-YE' : 'en-YE', {
      style: 'currency',
      currency: code,
      currencyDisplay: 'symbol',
    }).format(amount);
  };

  const getFeeTypeName = (feeType: string) => {
    const key = `feeTypes.${feeType}` as const;
    return t(key as any) !== key ? t(key as any) : feeType;
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex items-center gap-4 p-4 border rounded-lg">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-6 w-24" />
            <Skeleton className="h-6 w-28" />
            <Skeleton className="h-6 w-28" />
            <Skeleton className="h-6 w-20" />
            <Skeleton className="h-10 w-32" />
          </div>
        ))}
      </div>
    );
  }

  if (fees.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="rounded-full bg-neutral-100 p-4 mb-4 dark:bg-neutral-800">
          <History className="h-8 w-8 text-neutral-400" />
        </div>
        <p className="text-neutral-500 text-lg font-medium">
          {t('history.noChanges')}
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-neutral-200 dark:border-neutral-800 overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-neutral-50 dark:bg-neutral-900/50">
            <TableHead className="font-semibold text-neutral-700 dark:text-neutral-300">
              {t('table.feeType')}
            </TableHead>
            <TableHead className="font-semibold text-neutral-700 dark:text-neutral-300">
              {t('table.amount')}
            </TableHead>
            <TableHead className="font-semibold text-neutral-700 dark:text-neutral-300">
              {t('table.effectiveFrom')}
            </TableHead>
            <TableHead className="font-semibold text-neutral-700 dark:text-neutral-300">
              {t('table.effectiveTo')}
            </TableHead>
            <TableHead className="font-semibold text-neutral-700 dark:text-neutral-300">
              {t('table.status')}
            </TableHead>
            <TableHead className="font-semibold text-neutral-700 dark:text-neutral-300 text-end">
              {t('table.actions')}
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {fees.map((fee) => (
            <TableRow 
              key={fee.id}
              className="hover:bg-neutral-50 dark:hover:bg-neutral-900/30 transition-colors"
            >
              <TableCell className="font-medium text-neutral-900 dark:text-neutral-100">
                {getFeeTypeName(fee.feeType)}
              </TableCell>
              <TableCell className="text-primary-600 dark:text-primary-400 font-semibold">
                {formatCurrency(fee.amount, fee.currency)}
              </TableCell>
              <TableCell className="text-neutral-600 dark:text-neutral-400">
                {formatDate(fee.effectiveFrom)}
              </TableCell>
              <TableCell className="text-neutral-600 dark:text-neutral-400">
                {formatDate(fee.effectiveTo)}
              </TableCell>
              <TableCell>
                <Badge 
                  variant={fee.isActive ? 'default' : 'secondary'}
                  className={cn(
                    fee.isActive 
                      ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' 
                      : 'bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400'
                  )}
                >
                  {fee.isActive ? t('status.active') : t('status.inactive')}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="flex items-center justify-end gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onEdit(fee)}
                    className="text-primary-600 hover:text-primary-700 hover:bg-primary-50 dark:hover:bg-primary-900/20"
                  >
                    <Edit className="h-4 w-4 me-1" />
                    {t('actions.edit')}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onHistory(fee)}
                    className="text-neutral-600 hover:text-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800"
                  >
                    <History className="h-4 w-4 me-1" />
                    {t('actions.history')}
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}