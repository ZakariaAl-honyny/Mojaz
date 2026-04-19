'use client';

import { useState } from 'react';
import { useTranslations, useFormatter } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { PaymentDto, PaymentStatus, FeeType } from '@/types/payment.types';
import { cn } from '@/lib/utils';
import { 
  CreditCard, 
  Calendar,
  ChevronRight,
  Download,
  AlertCircle,
  Clock,
  CheckCircle2,
  XCircle,
  ArrowUpRight,
  RefreshCcw
} from 'lucide-react';
import { Link } from '@/i18n/routing';
import { useParams } from 'next/navigation';

// Mock data for applicant's payments
const mockPayments: PaymentDto[] = [
  {
    id: '1',
    applicationId: 'app-001',
    applicationNumber: 'MOJ-2026-12345678',
    applicantFullName: 'أحمد محمد',
    feeType: 'ApplicationFee',
    amount: 200,
    status: 'Paid',
    dueDate: '2026-04-15',
    paidAt: '2026-04-14',
    paymentMethod: 'Mada',
    transactionId: 'TXN-001',
  },
  {
    id: '2',
    applicationId: 'app-001',
    applicationNumber: 'MOJ-2026-12345678',
    applicantFullName: 'أحمد محمد',
    feeType: 'MedicalFee',
    amount: 150,
    status: 'Paid',
    dueDate: '2026-04-20',
    paidAt: '2026-04-18',
    paymentMethod: 'Visa',
    transactionId: 'TXN-002',
  },
  {
    id: '3',
    applicationId: 'app-001',
    applicationNumber: 'MOJ-2026-12345678',
    applicantFullName: 'أحمد محمد',
    feeType: 'TheoryFee',
    amount: 100,
    status: 'Pending',
    dueDate: '2026-04-25',
  },
  {
    id: '4',
    applicationId: 'app-001',
    applicationNumber: 'MOJ-2026-12345678',
    applicantFullName: 'أحمد محمد',
    feeType: 'PracticalFee',
    amount: 300,
    status: 'Overdue',
    dueDate: '2026-04-10',
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

const statusVariants: Record<PaymentStatus, 'success' | 'warning' | 'destructive' | 'default' | 'secondary'> = {
  Pending: 'warning',
  Paid: 'success',
  Overdue: 'destructive',
  Failed: 'destructive',
  Refunded: 'secondary',
};

const statusIcons = {
  Pending: <Clock className="w-4 h-4 text-warning" />,
  Paid: <CheckCircle2 className="w-4 h-4 text-success" />,
  Overdue: <AlertCircle className="w-4 h-4 text-destructive" />,
  Failed: <XCircle className="w-4 h-4 text-destructive" />,
  Refunded: <RefreshCcw className="w-4 h-4 text-neutral-400" />,
};

export default function ApplicantPaymentsPage() {
  const t = useTranslations('payment');
  const format = useFormatter();
  const params = useParams();
  const locale = params.locale as string;
  const [activeTab, setActiveTab] = useState<string>('all');

  const filteredPayments = mockPayments.filter((payment) => {
    if (activeTab === 'pending') return payment.status === 'Pending' || payment.status === 'Overdue';
    if (activeTab === 'paid') return payment.status === 'Paid';
    return true;
  });

  const stats = {
    pendingCount: mockPayments.filter(p => p.status === 'Pending' || p.status === 'Overdue').length,
    paidCount: mockPayments.filter(p => p.status === 'Paid').length,
    totalAmount: mockPayments.filter(p => p.status === 'Paid').reduce((acc, curr) => acc + curr.amount, 0),
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
          {t('title')}
        </h1>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-xl p-6 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-warning/10 flex items-center justify-center">
            <Clock className="w-6 h-6 text-warning" />
          </div>
          <div>
            <p className="text-sm text-neutral-500 dark:text-neutral-400">{t('history.status')}</p>
            <p className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">{stats.pendingCount}</p>
          </div>
        </div>
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-xl p-6 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-success/10 flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6 text-success" />
          </div>
          <div>
            <p className="text-sm text-neutral-500 dark:text-neutral-400">{t('status.paid')}</p>
            <p className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">{stats.paidCount}</p>
          </div>
        </div>
        <div className="bg-primary/5 border border-primary/10 rounded-xl p-6 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-primary">
            <CreditCard className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-primary/70">{t('payAmount')}</p>
            <p className="text-2xl font-bold text-primary">
              {format.number(stats.totalAmount, {
                style: 'currency',
                currency: 'YER',
              })}
            </p>
          </div>
        </div>
      </div>

      {/* Tabs and List */}
      <Tabs defaultValue="all" className="w-full" onValueChange={setActiveTab}>
        <div className="flex items-center justify-between border-b border-neutral-200 dark:border-neutral-700 mb-6">
          <TabsList className="bg-transparent h-auto p-0 gap-8">
            <TabsTrigger 
              value="all" 
              className="px-0 py-4 bg-transparent data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary rounded-none"
            >
              {t('history.tabs.all')}
            </TabsTrigger>
            <TabsTrigger 
              value="pending"
              className="px-0 py-4 bg-transparent data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary rounded-none"
            >
              {t('history.tabs.pending')}
              <Badge variant="secondary" className="ms-2">
                {stats.pendingCount}
              </Badge>
            </TabsTrigger>
            <TabsTrigger 
              value="paid"
              className="px-0 py-4 bg-transparent data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary rounded-none"
            >
              {t('history.tabs.paid')}
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value={activeTab} className="mt-0 space-y-4">
          {filteredPayments.length === 0 ? (
            <div className="text-center py-12 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-xl">
              <CreditCard className="w-12 h-12 text-neutral-300 mx-auto mb-4" />
              <p className="text-neutral-500 dark:text-neutral-400">
                {t('noPayments')}
              </p>
            </div>
          ) : (
            filteredPayments.map((payment) => (
              <div 
                key={payment.id}
                className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-xl overflow-hidden hover:border-primary/50 transition-colors"
              >
                <div className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="flex items-start gap-4">
                    <div className={cn(
                      "w-12 h-12 rounded-xl flex items-center justify-center shrink-0",
                      payment.status === 'Paid' ? "bg-success/10 text-success" : "bg-warning/10 text-warning"
                    )}>
                      {statusIcons[payment.status]}
                    </div>
                    <div>
                      <h3 className="font-semibold text-neutral-900 dark:text-neutral-100">
                        {t(`fees.${feeTypeKeys[payment.feeType]}`)}
                      </h3>
                      <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
                        {payment.applicationNumber}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-3 gap-8 flex-1 md:max-w-2xl">
                    <div>
                      <p className="text-xs text-neutral-400 uppercase tracking-wider font-medium mb-1">
                        {t('employee.columns.amount')}
                      </p>
                      <p className="font-bold text-neutral-900 dark:text-neutral-100">
                        {format.number(payment.amount, {
                          style: 'currency',
                          currency: 'YER',
                        })}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-neutral-400 uppercase tracking-wider font-medium mb-1">
                        {payment.status === 'Paid' ? t('history.paidAt') : t('history.dueDate')}
                      </p>
                      <div className="flex items-center gap-1.5 text-neutral-700 dark:text-neutral-300">
                        <Calendar className="w-4 h-4 text-neutral-400" />
                        <span className="text-sm">
                          {payment.paidAt 
                            ? format.dateTime(new Date(payment.paidAt), {
                                year: 'numeric',
                                month: '2-digit',
                                day: '2-digit',
                              })
                            : format.dateTime(new Date(payment.dueDate), {
                              year: 'numeric',
                              month: '2-digit',
                              day: '2-digit',
                            })
                          }
                        </span>
                      </div>
                    </div>

                    <div className="col-span-2 md:col-span-1">
                      <p className="text-xs text-neutral-400 uppercase tracking-wider font-medium mb-1">
                        {t('history.status')}
                      </p>
                      <Badge variant={statusVariants[payment.status]} className="h-6">
                        {t(`status.${payment.status.toLowerCase()}`)}
                      </Badge>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    {payment.status === 'Paid' ? (
                      <Button variant="outline" size="sm" className="w-full md:w-auto">
                        <Download className="w-4 h-4 me-2" />
                        {t('history.downloadInvoice')}
                      </Button>
                    ) : (
                      <Button asChild size="sm" className="w-full md:w-auto">
                        <Link href={`/payments/process/${payment.id}`}>
                          {t('history.payNow')}
                          <ArrowUpRight className="w-4 h-4 ms-2" />
                        </Link>
                      </Button>
                    )}
                  </div>
                </div>

                {payment.transactionId && (
                  <div className="px-6 py-3 bg-neutral-50 dark:bg-neutral-800/50 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between text-xs">
                    <span className="text-neutral-500">{t('history.transactionId')}</span>
                    <span className="font-mono text-neutral-700 dark:text-neutral-300">{payment.transactionId}</span>
                  </div>
                )}
              </div>
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}