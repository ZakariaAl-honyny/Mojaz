'use client';

import { useTranslations } from 'next-intl';
import { cn } from '@/lib/utils';
import { FeeType, PaymentStatus } from '@/types/payment.types';

interface FeeItem {
  type: FeeType;
  amount: number;
  status: PaymentStatus;
  isPaid?: boolean;
}

interface FeeBreakdownProps {
  fees: FeeItem[];
  total: number;
  paid: number;
  pending: number;
  className?: string;
}

const feeTypeKeys: Record<FeeType, string> = {
  ApplicationFee: 'applicationFee',
  MedicalFee: 'medicalFee',
  TheoryFee: 'theoryFee',
  PracticalFee: 'practicalFee',
  IssuanceFee: 'issuanceFee',
  RetakeFee: 'retakeFee',
};

export function FeeBreakdown({ fees, total, paid, pending, className }: FeeBreakdownProps) {
  const t = useTranslations('payment');

  return (
    <div className={cn('space-y-4', className)}>
      {/* Fee Items */}
      <div className="space-y-3">
        {fees.map((fee) => (
          <div
            key={fee.type}
            className={cn(
              'flex items-center justify-between py-3 border-b border-neutral-100 last:border-0',
              fee.isPaid && 'opacity-60'
            )}
          >
            <div className="flex items-center gap-3">
              {/* Status Icon */}
              <div
                className={cn(
                  'w-8 h-8 rounded-full flex items-center justify-center',
                  fee.isPaid
                    ? 'bg-green-100 dark:bg-green-900/30'
                    : 'bg-neutral-100 dark:bg-neutral-800'
                )}
              >
                {fee.isPaid ? (
                  <svg
                    className="w-4 h-4 text-green-600 dark:text-green-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                ) : (
                  <svg
                    className="w-4 h-4 text-neutral-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                )}
              </div>

              {/* Fee Type Label */}
              <div>
                <p className="font-medium text-neutral-900 dark:text-neutral-100">
                  {t(`fees.${feeTypeKeys[fee.type]}`)}
                </p>
                {fee.status === 'Overdue' && (
                  <p className="text-xs text-red-500 mt-0.5">
                    {t('fees.overdue')}
                  </p>
                )}
              </div>
            </div>

            {/* Amount */}
            <div className="text-end">
              <p
                className={cn(
                  'font-semibold',
                  fee.isPaid
                    ? 'text-green-600 dark:text-green-400'
                    : 'text-neutral-900 dark:text-neutral-100'
                )}
              >
                {fee.amount.toLocaleString('en-SA', {
                  style: 'currency',
                  currency: 'SAR',
                  minimumFractionDigits: 0,
                })}
              </p>
              {fee.isPaid && (
                <p className="text-xs text-green-600 dark:text-green-400">
                  {t('fees.paid')}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Summary */}
      <div className="pt-4 border-t-2 border-neutral-200 dark:border-neutral-700">
        <div className="flex items-center justify-between py-2">
          <span className="text-neutral-600 dark:text-neutral-400">
            {t('fees.paid')}
          </span>
          <span className="font-semibold text-green-600 dark:text-green-400">
            {paid.toLocaleString('en-SA', {
              style: 'currency',
              currency: 'SAR',
              minimumFractionDigits: 0,
            })}
          </span>
        </div>
        <div className="flex items-center justify-between py-2">
          <span className="text-neutral-600 dark:text-neutral-400">
            {t('fees.pending')}
          </span>
          <span className="font-semibold text-neutral-900 dark:text-neutral-100">
            {pending.toLocaleString('en-SA', {
              style: 'currency',
              currency: 'SAR',
              minimumFractionDigits: 0,
            })}
          </span>
        </div>
        <div className="flex items-center justify-between py-3 mt-2 bg-neutral-50 dark:bg-neutral-800/50 rounded-lg px-4">
          <span className="font-semibold text-neutral-900 dark:text-neutral-100">
            {t('fees.total')}
          </span>
          <span className="text-xl font-bold text-primary-600 dark:text-primary-400">
            {total.toLocaleString('en-SA', {
              style: 'currency',
              currency: 'SAR',
              minimumFractionDigits: 0,
            })}
          </span>
        </div>
      </div>
    </div>
  );
}

export default FeeBreakdown;