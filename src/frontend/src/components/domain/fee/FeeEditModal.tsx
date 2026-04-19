'use client';

/**
 * FeeEditModal Component
 * Modal dialog for editing fee amount and effective dates
 */

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useLocale } from 'next-intl';
import { FeeListItemDto, UpdateFeeRequest } from '@/types/fee.types';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { arSA, enUS } from 'date-fns/locale';
import { Calendar as CalendarIcon, Loader2 } from 'lucide-react';

interface FeeEditModalProps {
  fee: FeeListItemDto | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (id: string, data: UpdateFeeRequest) => Promise<void>;
  isSaving?: boolean;
}

const feeEditSchema = z.object({
  amount: z.number({ required_error: 'Amount is required' })
    .positive('Amount must be positive')
    .max(5000000, 'Amount cannot exceed 5,000,000'),
  effectiveFrom: z.string().optional(),
  effectiveTo: z.string().optional(),
}).refine((data) => {
  if (data.effectiveFrom && data.effectiveTo) {
    return new Date(data.effectiveTo) >= new Date(data.effectiveFrom);
  }
  return true;
}, {
  message: 'End date must be after start date',
  path: ['effectiveTo'],
});

type FeeEditFormValues = z.infer<typeof feeEditSchema>;

export function FeeEditModal({ fee, isOpen, onClose, onSave, isSaving = false }: FeeEditModalProps) {
  const t = useTranslations('fee');
  const locale = useLocale();
  const isRTL = locale === 'ar';
  const dateLocale = isRTL ? arSA : enUS;
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FeeEditFormValues>({
    resolver: zodResolver(feeEditSchema),
    defaultValues: {
      amount: 0,
      effectiveFrom: '',
      effectiveTo: '',
    },
  });

  const { reset, handleSubmit, formState: { errors }, setValue, watch } = form;
  const watchedEffectiveFrom = watch('effectiveFrom');
  const watchedEffectiveTo = watch('effectiveTo');

  // Reset form when fee changes
  useEffect(() => {
    if (fee) {
      reset({
        amount: fee.amount,
        effectiveFrom: fee.effectiveFrom ? fee.effectiveFrom.split('T')[0] : '',
        effectiveTo: fee.effectiveTo ? fee.effectiveTo.split('T')[0] : '',
      });
    }
  }, [fee, reset]);

  const onSubmit = async (data: FeeEditFormValues) => {
    if (!fee) return;
    
    setIsSubmitting(true);
    try {
      const updateData: UpdateFeeRequest = {
        amount: data.amount,
        effectiveFrom: data.effectiveFrom || undefined,
        effectiveTo: data.effectiveTo || undefined,
      };
      await onSave(fee.id, updateData);
      onClose();
    } catch (error) {
      console.error('Failed to save fee:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const formatDisplayDate = (dateStr: string | undefined) => {
    if (!dateStr) return '';
    return format(new Date(dateStr), 'PPP', { locale: dateLocale });
  };

  const parseDate = (dateStr: string | undefined): Date | undefined => {
    if (!dateStr) return undefined;
    const date = new Date(dateStr);
    return isNaN(date.getTime()) ? undefined : date;
  };

  if (!fee) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-primary-900 dark:text-primary-100">
            {t('edit.title')}
          </DialogTitle>
          <DialogDescription className="text-neutral-500 dark:text-neutral-400">
            {`${t('feeTypes.' + fee.feeType) || fee.feeType}`}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Amount Field */}
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <Label htmlFor="amount" className="text-neutral-700 dark:text-neutral-300">
                    {t('edit.amount')} (YER)
                  </Label>
                  <FormControl>
                    <Input
                      id="amount"
                      type="number"
                      step="0.01"
                      min="0"
                      max="100000"
                      placeholder="0.00"
                      className="mt-1"
                      {...field}
                      onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                      disabled={isSubmitting || isSaving}
                    />
                  </FormControl>
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />

            {/* Effective From Date */}
            <FormField
              control={form.control}
              name="effectiveFrom"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <Label className="text-neutral-700 dark:text-neutral-300 mb-1">
                    {t('edit.effectiveFrom')}
                  </Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full mt-1 justify-start text-start font-normal",
                            !field.value && "text-neutral-400 dark:text-neutral-500"
                          )}
                          disabled={isSubmitting || isSaving}
                        >
                          <CalendarIcon className="h-4 w-4 ms-2" />
                          {field.value ? formatDisplayDate(field.value) : t('edit.effectiveFrom')}
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={parseDate(field.value)}
                        onSelect={(date) => field.onChange(date ? format(date, 'yyyy-MM-dd') : '')}
                        disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />

            {/* Effective To Date */}
            <FormField
              control={form.control}
              name="effectiveTo"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <Label className="text-neutral-700 dark:text-neutral-300 mb-1">
                    {t('edit.effectiveTo')}
                  </Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full mt-1 justify-start text-start font-normal",
                            !field.value && "text-neutral-400 dark:text-neutral-500"
                          )}
                          disabled={isSubmitting || isSaving}
                        >
                          <CalendarIcon className="h-4 w-4 ms-2" />
                          {field.value ? formatDisplayDate(field.value) : t('edit.effectiveTo')}
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={parseDate(field.value)}
                        onSelect={(date) => field.onChange(date ? format(date, 'yyyy-MM-dd') : '')}
                        disabled={(date) => {
                          const fromDate = watchedEffectiveFrom ? new Date(watchedEffectiveFrom) : null;
                          return fromDate ? date <= fromDate : false;
                        }}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />

            <DialogFooter className="gap-2 sm:gap-0">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={isSubmitting || isSaving}
                className="w-full sm:w-auto"
              >
                {t('edit.cancel')}
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting || isSaving}
                className="w-full sm:w-auto bg-primary-600 hover:bg-primary-700"
              >
                {(isSubmitting || isSaving) && (
                  <Loader2 className="h-4 w-4 animate-spin me-2" />
                )}
                {t('edit.save')}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}