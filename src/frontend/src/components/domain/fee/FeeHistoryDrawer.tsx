'use client';

/**
 * FeeHistoryDrawer Component
 * Drawer showing audit history for fee changes
 */

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { useLocale } from 'next-intl';
import { FeeListItemDto, FeeAuditLogDto } from '@/types/fee.types';
import FeeService from '@/services/fee.service';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
} from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import { format } from 'date-fns';
import { arSA, enUS } from 'date-fns/locale';
import { History, User, Calendar, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FeeHistoryDrawerProps {
  fee: FeeListItemDto | null;
  isOpen: boolean;
  onClose: () => void;
}

export function FeeHistoryDrawer({ fee, isOpen, onClose }: FeeHistoryDrawerProps) {
  const t = useTranslations('fee');
  const locale = useLocale();
  const isRTL = locale === 'ar';
  const dateLocale = isRTL ? arSA : enUS;

  const [history, setHistory] = useState<FeeAuditLogDto[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (fee && isOpen) {
      loadHistory();
    }
  }, [fee, isOpen]);

  const loadHistory = async () => {
    if (!fee) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await FeeService.getFeeHistory(fee.id);
      if (response.success && response.data) {
        setHistory(response.data);
      } else {
        setError(response.message || 'Failed to load history');
      }
    } catch (err) {
      console.error('Failed to load fee history:', err);
      setError('Failed to load history');
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateStr: string) => {
    return format(new Date(dateStr), 'PPP p', { locale: dateLocale });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat(locale === 'ar' ? 'ar-YE' : 'en-YE', {
      style: 'currency',
      currency: 'YER',
      currencyDisplay: 'symbol',
    }).format(amount);
  };

  const getFeeTypeName = () => {
    if (!fee) return '';
    const key = `feeTypes.${fee.feeType}` as const;
    return t(key as any) !== key ? t(key as any) : fee.feeType;
  };

  const renderLoadingState = () => (
    <div className="space-y-4 p-4">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="flex flex-col gap-2">
          <Skeleton className="h-20 w-full" />
        </div>
      ))}
    </div>
  );

  const renderEmptyState = () => (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="rounded-full bg-neutral-100 p-4 mb-4 dark:bg-neutral-800">
        <History className="h-8 w-8 text-neutral-400" />
      </div>
      <p className="text-neutral-500 dark:text-neutral-400 font-medium">
        {t('history.noChanges')}
      </p>
    </div>
  );

  const renderHistoryItem = (item: FeeAuditLogDto, index: number) => (
    <div key={item.id} className="relative">
      <div className={cn(
        "flex gap-4 p-4 rounded-lg bg-neutral-50 dark:bg-neutral-900/50",
        "border border-neutral-200 dark:border-neutral-800"
      )}>
        {/* Timeline indicator */}
        <div className="flex flex-col items-center">
          <div className="size-3 rounded-full bg-primary-500 ring-4 ring-primary-100 dark:ring-primary-900/30" />
          {index < history.length - 1 && (
            <div className="w-0.5 flex-1 bg-neutral-200 dark:bg-neutral-700 mt-2" />
          )}
        </div>

        {/* Content */}
        <div className="flex-1 space-y-3">
          {/* Amount change */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-neutral-500 dark:text-neutral-400">
              {t('history.oldAmount')}:
            </span>
            <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300 line-through">
              {formatCurrency(item.oldAmount)}
            </span>
            <ArrowRight className="h-4 w-4 text-neutral-400" />
            <span className="text-sm text-neutral-500 dark:text-neutral-400">
              {t('history.newAmount')}:
            </span>
            <span className="text-sm font-bold text-primary-600 dark:text-primary-400">
              {formatCurrency(item.newAmount)}
            </span>
          </div>

          {/* Metadata */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-neutral-500 dark:text-neutral-400">
            <div className="flex items-center gap-1">
              <User className="h-4 w-4" />
              <span>{item.changedBy}</span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <span>{formatDate(item.changedAt)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <Drawer open={isOpen} onClose={onClose} direction={isRTL ? 'left' : 'right'}>
      <DrawerContent className="sm:max-w-lg w-[90vw]">
        <DrawerHeader className="border-b border-neutral-200 dark:border-neutral-800">
          <DrawerTitle className="text-xl font-bold text-primary-900 dark:text-primary-100 flex items-center gap-2">
            <History className="h-5 w-5" />
            {t('history.title')}
          </DrawerTitle>
          <DrawerDescription className="text-neutral-500 dark:text-neutral-400">
            {getFeeTypeName()}
          </DrawerDescription>
        </DrawerHeader>

        <div className="flex-1 overflow-y-auto p-4">
          {isLoading ? (
            renderLoadingState()
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <p className="text-red-500 dark:text-red-400 mb-4">{error}</p>
              <Button variant="outline" onClick={loadHistory}>
                {t('retry') || 'Retry'}
              </Button>
            </div>
          ) : history.length === 0 ? (
            renderEmptyState()
          ) : (
            <div className="space-y-4">
              {history.map((item, index) => renderHistoryItem(item, index))}
            </div>
          )}
        </div>

        <DrawerFooter className="border-t border-neutral-200 dark:border-neutral-800">
          <Button variant="outline" onClick={onClose}>
            {t('common.close') || 'Close'}
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}