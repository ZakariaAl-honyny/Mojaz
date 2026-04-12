'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FeeType, PaymentMethod } from '@/types/payment.types';
import { 
  CheckCircle, 
  Download, 
  ChevronRight,
  CreditCard,
  Calendar,
  Receipt
} from 'lucide-react';

// Mock successful payment data
const mockSuccessfulPayment = {
  id: '1',
  applicationId: 'app-001',
  applicationNumber: 'MOJ-2025-12345678',
  applicantFullName: 'أحمد محمد',
  feeType: 'ApplicationFee' as FeeType,
  amount: 200,
  status: 'Paid' as const,
  dueDate: '2025-04-20',
  paidAt: new Date().toISOString(),
  paymentMethod: 'Mada' as PaymentMethod,
  transactionId: 'TXN-SUCCESS-123',
};

const feeTypeKeys: Record<FeeType, string> = {
  ApplicationFee: 'applicationFee',
  MedicalFee: 'medicalFee',
  TheoryFee: 'theoryFee',
  PracticalFee: 'practicalFee',
  IssuanceFee: 'issuanceFee',
  RetakeFee: 'retakeFee',
};

export default function PaymentSuccessPage() {
  const t = useTranslations('payment');
  const tNav = useTranslations('navigation');
  const router = useRouter();
  const [showAnimation, setShowAnimation] = useState(false);

  const payment = mockSuccessfulPayment;

  useEffect(() => {
    setShowAnimation(true);
  }, []);

  const handleDownloadReceipt = () => {
    console.log('Downloading receipt for payment:', payment.id);
  };

  const handleContinue = () => {
    router.push('/payments');
  };

  const handleGoToDashboard = () => {
    router.push('/dashboard');
  };

  return (
    <div className="max-w-md mx-auto space-y-6">
      {/* Success Animation */}
      <div className="flex flex-col items-center py-8">
        <div 
          className={`
            w-24 h-24 rounded-full bg-green-100 dark:bg-green-900/30 
            flex items-center justify-center
            transition-all duration-700 transform
            ${showAnimation ? 'scale-100 opacity-100' : 'scale-0 opacity-0'}
          `}
        >
          <CheckCircle className="w-16 h-16 text-green-600 dark:text-green-400" />
        </div>
        
        <h1 
          className={`
            mt-6 text-2xl font-bold text-neutral-900 dark:text-neutral-100
            transition-all duration-500 delay-300
            ${showAnimation ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
          `}
        >
          {t('success')}
        </h1>
        
        <p 
          className={`
            mt-2 text-center text-neutral-500 dark:text-neutral-400
            transition-all duration-500 delay-500
            ${showAnimation ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
          `}
        >
          {t('successMessage')}
        </p>
      </div>

      {/* Receipt Card */}
      <div 
        className={`
          bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 
          rounded-xl overflow-hidden
          transition-all duration-700 delay-700
          ${showAnimation ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}
        `}
      >
        <div className="bg-primary px-6 py-4">
          <div className="flex items-center gap-2 text-white">
            <Receipt className="w-5 h-5" />
            <span className="font-semibold">{t('receipt')}</span>
          </div>
        </div>

        <div className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-neutral-500 dark:text-neutral-400">
              {t('history.application')}
            </span>
            <span className="font-mono text-sm text-neutral-900 dark:text-neutral-100">
              {payment.transactionId}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm text-neutral-500 dark:text-neutral-400">
              {t('history.application')}
            </span>
            <span className="font-medium text-neutral-900 dark:text-neutral-100">
              {payment.applicationNumber}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm text-neutral-500 dark:text-neutral-400">
              {t('fees.applicationFee')}
            </span>
            <span className="text-neutral-900 dark:text-neutral-100">
              {t(`fees.${feeTypeKeys[payment.feeType]}`)}
            </span>
          </div>

          <div className="flex items-center justify-between py-3 border-t border-b border-neutral-100 dark:border-neutral-800">
            <span className="font-medium text-neutral-900 dark:text-neutral-100">
              {t('history.amount')}
            </span>
            <span className="text-xl font-bold text-primary-600 dark:text-primary-400">
              {payment.amount.toLocaleString('en-SA', {
                style: 'currency',
                currency: 'SAR',
                minimumFractionDigits: 0,
              })}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm text-neutral-500 dark:text-neutral-400">
              {t('history.method')}
            </span>
            <div className="flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-neutral-400" />
              <span className="text-neutral-900 dark:text-neutral-100">
                {t(payment.paymentMethod.toLowerCase())}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm text-neutral-500 dark:text-neutral-400">
              {t('history.date')}
            </span>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-neutral-400" />
              <span className="text-neutral-900 dark:text-neutral-100">
                {payment.paidAt
                  ? new Date(payment.paidAt).toLocaleString('ar-SA', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })
                  : '-'}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <span className="text-sm text-neutral-500 dark:text-neutral-400">
              {t('history.status')}
            </span>
            <Badge variant="success">
              {t('status.paid')}
            </Badge>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div 
        className={`
          space-y-3
          transition-all duration-700 delay-1000
          ${showAnimation ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}
        `}
      >
        <Button
          onClick={handleDownloadReceipt}
          variant="outline"
          className="w-full"
        >
          <Download className="w-4 h-4 me-2" />
          {t('downloadReceipt')}
        </Button>

        <Button
          onClick={handleContinue}
          className="w-full"
        >
          {t('continueButton')}
          <ChevronRight className="w-4 h-4 ms-2 rtl:rotate-180" />
        </Button>

        <Button
          onClick={handleGoToDashboard}
          variant="ghost"
          className="w-full"
        >
          {tNav('dashboard')}
        </Button>
      </div>
    </div>
  );
}