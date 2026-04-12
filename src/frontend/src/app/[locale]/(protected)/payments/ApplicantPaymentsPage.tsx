'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { FeeBreakdown } from '@/components/domain/payment/FeeBreakdown';
import { PaymentDto, PaymentStatus, FeeType } from '@/types/payment.types';
import { cn } from '@/lib/utils';
import { 
  CreditCard, 
  Calendar, 
  Download,
  Search 
} from 'lucide-react';

// Mock data for demonstration - in production, this will come from the API
const mockPendingPayments: PaymentDto[] = [
  {
    id: '1',
    applicationId: 'app-001',
    applicationNumber: 'MOJ-2025-12345678',
    applicantFullName: 'أحمد محمد',
    feeType: 'ApplicationFee',
    amount: 200,
    status: 'Pending',
    dueDate: '2025-04-20',
  },
  {
    id: '2',
    applicationId: 'app-001',
    applicationNumber: 'MOJ-2025-12345678',
    applicantFullName: 'أحمد محمد',
    feeType: 'MedicalFee',
    amount: 150,
    status: 'Pending',
    dueDate: '2025-04-25',
  },
];

const mockPaymentHistory: PaymentDto[] = [
  {
    id: '3',
    applicationId: 'app-002',
    applicationNumber: 'MOJ-2025-87654321',
    applicantFullName: 'أحمد محمد',
    feeType: 'ApplicationFee',
    amount: 200,
    status: 'Paid',
    dueDate: '2025-03-15',
    paidAt: '2025-03-14',
    paymentMethod: 'Mada',
    transactionId: 'TXN-001',
  },
  {
    id: '4',
    applicationId: 'app-002',
    applicationNumber: 'MOJ-2025-87654321',
    applicantFullName: 'أحمد محمد',
    feeType: 'MedicalFee',
    amount: 150,
    status: 'Paid',
    dueDate: '2025-03-20',
    paidAt: '2025-03-18',
    paymentMethod: 'Visa',
    transactionId: 'TXN-002',
  },
];

const feeTypeKeys: Record<FeeType, string> = {
  ApplicationFee: 'applicationFee',
  MedicalFee: 'medicalFee',
  TheoryFee: 'theoryFee',
  PracticalFee: 'practicalFee',
  IssuanceFee: 'issuanceFee',
  RetakeFee: 'retakeFee',
};

const statusVariants: Record<PaymentStatus, 'success' | 'warning' | 'destructive' | 'default'> = {
  Pending: 'warning',
  Paid: 'success',
  Overdue: 'destructive',
  Failed: 'destructive',
  Refunded: 'default',
};

export default function ApplicantPaymentsPage() {
  const t = useTranslations('payment');
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'pending' | 'history'>('pending');
  const [searchQuery, setSearchQuery] = useState('');

  // Calculate totals
  const pendingTotal = mockPendingPayments.reduce((sum, p) => sum + p.amount, 0);
  const historyTotal = mockPaymentHistory.reduce((sum, p) => sum + p.amount, 0);

  // Filter payments based on search
  const filteredPending = mockPendingPayments.filter((p) =>
    p.applicationNumber.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredHistory = mockPaymentHistory.filter((p) =>
    p.applicationNumber.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
          {t('title')}
        </h1>
        <p className="text-neutral-500 dark:text-neutral-400">
          {t('subtitle')}
        </p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-neutral-200 dark:border-neutral-700">
        <button
          onClick={() => setActiveTab('pending')}
          className={cn(
            'flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors',
            activeTab === 'pending'
              ? 'border-primary text-primary-600 dark:text-primary-400'
              : 'border-transparent text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300'
          )}
        >
          <CreditCard className="w-4 h-4" />
          {t('pendingPayments')}
          {filteredPending.length > 0 && (
            <Badge variant="secondary" className="ms-1">
              {filteredPending.length}
            </Badge>
          )}
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={cn(
            'flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors',
            activeTab === 'history'
              ? 'border-primary text-primary-600 dark:text-primary-400'
              : 'border-transparent text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300'
          )}
        >
          <Calendar className="w-4 h-4" />
          {t('paymentHistory')}
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
        <Input
          placeholder={t('employee.filters.search')}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pe-4 ps-10"
        />
      </div>

      {/* Content */}
      {activeTab === 'pending' ? (
        <div className="space-y-4">
          {filteredPending.length === 0 ? (
            <div className="text-center py-12">
              <CreditCard className="w-12 h-12 mx-auto mb-4 text-neutral-300" />
              <p className="text-neutral-500 dark:text-neutral-400">
                {t('noPendingPayments')}
              </p>
              <p className="text-sm text-neutral-400 dark:text-neutral-500 mt-1">
                {t('allPaid')}
              </p>
            </div>
          ) : (
            <>
              {/* Fee Summary */}
              <div className="bg-neutral-50 dark:bg-neutral-800/50 rounded-xl p-4">
                <FeeBreakdown
                  fees={filteredPending.map((p) => ({
                    type: p.feeType,
                    amount: p.amount,
                    status: p.status,
                    isPaid: false,
                  }))}
                  total={pendingTotal + historyTotal}
                  paid={historyTotal}
                  pending={pendingTotal}
                />
              </div>

              {/* Pending Payments List */}
              <div className="space-y-3">
                {filteredPending.map((payment) => (
                  <div
                    key={payment.id}
                    className="flex items-center justify-between p-4 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-xl hover:border-primary/30 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      {/* Icon */}
                      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                        <CreditCard className="w-6 h-6 text-primary" />
                      </div>

                      {/* Details */}
                      <div>
                        <p className="font-semibold text-neutral-900 dark:text-neutral-100">
                          {t(`fees.${feeTypeKeys[payment.feeType]}`)}
                        </p>
                        <p className="text-sm text-neutral-500 dark:text-neutral-400">
                          {payment.applicationNumber}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <Calendar className="w-3 h-3 text-neutral-400" />
                          <span className="text-xs text-neutral-400 dark:text-neutral-500">
                            {t('fees.dueDate')}: {new Date(payment.dueDate).toLocaleDateString('ar-SA')}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      {/* Status Badge */}
                      <Badge variant={statusVariants[payment.status]}>
                        {t(`status.${payment.status.toLowerCase()}`)}
                      </Badge>

                      {/* Amount */}
                      <div className="text-end">
                        <p className="text-lg font-bold text-neutral-900 dark:text-neutral-100">
                          {payment.amount.toLocaleString('en-SA', {
                            style: 'currency',
                            currency: 'SAR',
                            minimumFractionDigits: 0,
                          })}
                        </p>
                      </div>

                      {/* Pay Button */}
                      <Button
                        onClick={() => router.push(`/payments/${payment.id}`)}
                      >
                        {t('payNow')}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredHistory.length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="w-12 h-12 mx-auto mb-4 text-neutral-300" />
              <p className="text-neutral-500 dark:text-neutral-400">
                {t('paymentHistory')}
              </p>
            </div>
          ) : (
            /* History Table */
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-neutral-200 dark:border-neutral-700">
                    <th className="text-start py-3 px-4 text-sm font-medium text-neutral-500 dark:text-neutral-400">
                      {t('history.date')}
                    </th>
                    <th className="text-start py-3 px-4 text-sm font-medium text-neutral-500 dark:text-neutral-400">
                      {t('history.application')}
                    </th>
                    <th className="text-start py-3 px-4 text-sm font-medium text-neutral-500 dark:text-neutral-400">
                      {t('history.amount')}
                    </th>
                    <th className="text-start py-3 px-4 text-sm font-medium text-neutral-500 dark:text-neutral-400">
                      {t('history.method')}
                    </th>
                    <th className="text-start py-3 px-4 text-sm font-medium text-neutral-500 dark:text-neutral-400">
                      {t('history.status')}
                    </th>
                    <th className="text-end py-3 px-4 text-sm font-medium text-neutral-500 dark:text-neutral-400">
                      {t('history.actions')}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredHistory.map((payment) => (
                    <tr
                      key={payment.id}
                      className="border-b border-neutral-100 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-800/30"
                    >
                      <td className="py-3 px-4 text-sm text-neutral-900 dark:text-neutral-100">
                        {payment.paidAt
                          ? new Date(payment.paidAt).toLocaleDateString('ar-SA')
                          : '-'}
                      </td>
                      <td className="py-3 px-4 text-sm text-neutral-900 dark:text-neutral-100">
                        {payment.applicationNumber}
                      </td>
                      <td className="py-3 px-4 text-sm font-medium text-neutral-900 dark:text-neutral-100">
                        {payment.amount.toLocaleString('en-SA', {
                          style: 'currency',
                          currency: 'SAR',
                          minimumFractionDigits: 0,
                        })}
                      </td>
                      <td className="py-3 px-4 text-sm text-neutral-500 dark:text-neutral-400">
                        {payment.paymentMethod
                          ? t(payment.paymentMethod.toLowerCase())
                          : '-'}
                      </td>
                      <td className="py-3 px-4">
                        <Badge variant={statusVariants[payment.status]}>
                          {t(`status.${payment.status.toLowerCase()}`)}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-end">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => router.push(`/payments/${payment.id}/receipt`)}
                        >
                          <Download className="w-4 h-4 me-1" />
                          {t('receipt')}
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}