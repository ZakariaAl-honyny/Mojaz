'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { PaymentDto, PaymentStatus, FeeType } from '@/types/payment.types';
import { cn } from '@/lib/utils';
import { 
  CreditCard, 
  Search,
  Download,
  Filter,
  Eye,
  RefreshCcw,
  AlertCircle
} from 'lucide-react';

// Mock data for all payments
const mockPayments: PaymentDto[] = [
  {
    id: '1',
    applicationId: 'app-001',
    applicationNumber: 'MOJ-2025-12345678',
    applicantFullName: 'أحمد محمد',
    feeType: 'ApplicationFee',
    amount: 200,
    status: 'Paid',
    dueDate: '2025-04-15',
    paidAt: '2025-04-14',
    paymentMethod: 'Mada',
    transactionId: 'TXN-001',
  },
  {
    id: '2',
    applicationId: 'app-001',
    applicationNumber: 'MOJ-2025-12345678',
    applicantFullName: 'أحمد محمد',
    feeType: 'MedicalFee',
    amount: 150,
    status: 'Paid',
    dueDate: '2025-04-20',
    paidAt: '2025-04-18',
    paymentMethod: 'Visa',
    transactionId: 'TXN-002',
  },
  {
    id: '3',
    applicationId: 'app-002',
    applicationNumber: 'MOJ-2025-87654321',
    applicantFullName: 'خالد علي',
    feeType: 'ApplicationFee',
    amount: 200,
    status: 'Pending',
    dueDate: '2025-04-25',
  },
  {
    id: '4',
    applicationId: 'app-003',
    applicationNumber: 'MOJ-2025-11223344',
    applicantFullName: 'سارة أحمد',
    feeType: 'ApplicationFee',
    amount: 200,
    status: 'Overdue',
    dueDate: '2025-04-10',
  },
  {
    id: '5',
    applicationId: 'app-004',
    applicationNumber: 'MOJ-2025-55667788',
    applicantFullName: 'علي محمد',
    feeType: 'TheoryFee',
    amount: 100,
    status: 'Failed',
    dueDate: '2025-04-12',
  },
];

const statusOptions: { value: PaymentStatus | ''; labelKey: string }[] = [
  { value: '', labelKey: 'all' },
  { value: 'Pending', labelKey: 'pending' },
  { value: 'Paid', labelKey: 'paid' },
  { value: 'Overdue', labelKey: 'overdue' },
  { value: 'Failed', labelKey: 'failed' },
  { value: 'Refunded', labelKey: 'refunded' },
];

const feeTypeKeys: Record<FeeType, string> = {
  ApplicationFee: 'applicationFee',
  MedicalFee: 'medicalFee',
  TheoryFee: 'theoryFee',
  PracticalFee: 'practicalFee',
  IssuanceFee: 'issuanceFee',
  RetakeFee: 'retakeFee',
};

const statusVariants: Record<PaymentStatus, 'success' | 'warning' | 'destructive' | 'default' | 'secondary'> = {
  Pending: 'warning',
  Paid: 'success',
  Overdue: 'destructive',
  Failed: 'destructive',
  Refunded: 'secondary',
};

export default function EmployeePaymentsPage() {
  const t = useTranslations('payment');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<PaymentStatus | ''>('');
  const [selectedPayment, setSelectedPayment] = useState<PaymentDto | null>(null);
  const [showRefundDialog, setShowRefundDialog] = useState(false);

  // Filter payments
  const filteredPayments = mockPayments.filter((payment) => {
    const matchesSearch = 
      payment.applicationNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payment.applicantFullName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = !statusFilter || payment.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Calculate stats
  const stats = {
    total: mockPayments.length,
    pending: mockPayments.filter(p => p.status === 'Pending').length,
    paid: mockPayments.filter(p => p.status === 'Paid').length,
    overdue: mockPayments.filter(p => p.status === 'Overdue').length,
  };

  const handleViewDetails = (payment: PaymentDto) => {
    // In production, navigate to payment details
    console.log('View details:', payment.id);
  };

  const handleRefund = (payment: PaymentDto) => {
    setSelectedPayment(payment);
    setShowRefundDialog(true);
  };

  const handleConfirmRefund = () => {
    // In production, call API to process refund
    console.log('Processing refund for:', selectedPayment?.id);
    setShowRefundDialog(false);
    setSelectedPayment(null);
  };

  const handleExport = () => {
    // In production, export to CSV/Excel
    console.log('Exporting payments...');
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
          {t('employee.title')}
        </h1>
        <p className="text-neutral-500 dark:text-neutral-400">
          {t('employee.subtitle')}
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-xl p-4">
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            {t('employee.filters.status')}
          </p>
          <p className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mt-1">
            {stats.total}
          </p>
        </div>
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-xl p-4">
          <p className="text-sm text-warning">{t('status.pending')}</p>
          <p className="text-2xl font-bold text-warning mt-1">
            {stats.pending}
          </p>
        </div>
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-xl p-4">
          <p className="text-sm text-success">{t('status.paid')}</p>
          <p className="text-2xl font-bold text-success mt-1">
            {stats.paid}
          </p>
        </div>
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-xl p-4">
          <p className="text-sm text-destructive">{t('status.overdue')}</p>
          <p className="text-2xl font-bold text-destructive mt-1">
            {stats.overdue}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
          <Input
            placeholder={t('employee.filters.search')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pe-4 ps-10"
          />
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-neutral-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as PaymentStatus | '')}
            className="h-10 px-3 rounded-md border border-input bg-background text-sm"
          >
            {statusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.value ? t(`status.${option.labelKey}`) : t(`applications.filters.${option.labelKey}`)}
              </option>
            ))}
          </select>
        </div>

        {/* Export Button */}
        <Button variant="outline" onClick={handleExport}>
          <Download className="w-4 h-4 me-2" />
          {t('employee.export')}
        </Button>
      </div>

      {/* Payments Table */}
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800/50">
                <th className="text-start py-3 px-4 text-sm font-medium text-neutral-500 dark:text-neutral-400">
                  {t('employee.columns.application')}
                </th>
                <th className="text-start py-3 px-4 text-sm font-medium text-neutral-500 dark:text-neutral-400">
                  {t('employee.columns.applicant')}
                </th>
                <th className="text-start py-3 px-4 text-sm font-medium text-neutral-500 dark:text-neutral-400">
                  {t('employee.columns.feeType')}
                </th>
                <th className="text-start py-3 px-4 text-sm font-medium text-neutral-500 dark:text-neutral-400">
                  {t('employee.columns.amount')}
                </th>
                <th className="text-start py-3 px-4 text-sm font-medium text-neutral-500 dark:text-neutral-400">
                  {t('employee.columns.status')}
                </th>
                <th className="text-start py-3 px-4 text-sm font-medium text-neutral-500 dark:text-neutral-400">
                  {t('employee.columns.paidAt')}
                </th>
                <th className="text-start py-3 px-4 text-sm font-medium text-neutral-500 dark:text-neutral-400">
                  {t('employee.columns.method')}
                </th>
                <th className="text-end py-3 px-4 text-sm font-medium text-neutral-500 dark:text-neutral-400">
                  {t('employee.columns.actions')}
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredPayments.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-neutral-500 dark:text-neutral-400">
                    {t('noPayments')}
                  </td>
                </tr>
              ) : (
                filteredPayments.map((payment) => (
                  <tr
                    key={payment.id}
                    className="border-b border-neutral-100 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-800/30"
                  >
                    <td className="py-3 px-4">
                      <span className="font-medium text-neutral-900 dark:text-neutral-100">
                        {payment.applicationNumber}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-neutral-600 dark:text-neutral-400">
                      {payment.applicantFullName}
                    </td>
                    <td className="py-3 px-4 text-neutral-600 dark:text-neutral-400">
                      {t(`fees.${feeTypeKeys[payment.feeType]}`)}
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-medium text-neutral-900 dark:text-neutral-100">
                        {payment.amount.toLocaleString('en-SA', {
                          style: 'currency',
                          currency: 'SAR',
                          minimumFractionDigits: 0,
                        })}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <Badge variant={statusVariants[payment.status]}>
                        {t(`status.${payment.status.toLowerCase()}`)}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-neutral-600 dark:text-neutral-400">
                      {payment.paidAt
                        ? new Date(payment.paidAt).toLocaleDateString('ar-SA')
                        : '-'}
                    </td>
                    <td className="py-3 px-4">
                      {payment.paymentMethod ? (
                        <div className="flex items-center gap-2">
                          <CreditCard className="w-4 h-4 text-neutral-400" />
                          <span className="text-neutral-600 dark:text-neutral-400">
                            {t(payment.paymentMethod.toLowerCase())}
                          </span>
                        </div>
                      ) : (
                        <span className="text-neutral-400">-</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-end">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleViewDetails(payment)}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        {payment.status === 'Paid' && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRefund(payment)}
                          >
                            <RefreshCcw className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Refund Dialog */}
      <Dialog open={showRefundDialog} onOpenChange={setShowRefundDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('employee.refundDialog.title')}</DialogTitle>
            <DialogDescription>
              {t('employee.refundDialog.description')}
            </DialogDescription>
          </DialogHeader>
          
          {selectedPayment && (
            <div className="py-4">
              <div className="flex items-center justify-between p-4 bg-neutral-50 dark:bg-neutral-800 rounded-xl">
                <div>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400">
                    {selectedPayment.applicationNumber}
                  </p>
                  <p className="font-medium text-neutral-900 dark:text-neutral-100 mt-1">
                    {t(`fees.${feeTypeKeys[selectedPayment.feeType]}`)}
                  </p>
                </div>
                <div className="text-end">
                  <p className="text-xl font-bold text-neutral-900 dark:text-neutral-100">
                    {selectedPayment.amount.toLocaleString('en-SA', {
                      style: 'currency',
                      currency: 'SAR',
                      minimumFractionDigits: 0,
                    })}
                  </p>
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowRefundDialog(false)}
            >
              {t('employee.refundDialog.cancel')}
            </Button>
            <Button
              variant="destructive"
              onClick={handleConfirmRefund}
            >
              {t('employee.confirmRefund')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}