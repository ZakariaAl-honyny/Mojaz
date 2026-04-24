'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from '@/lib/static-translations';
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
  paymentMethod: 'BankTransfer' as PaymentMethod,
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

  const payment = mockSuccessfulPayment;

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
          className="w-24 h-24 rounded-full bg-primary-100 flex items-center justify-center animate-scale-in"
        >
          <CheckCircle className="w-16 h-16 text-primary-600" />
        </div>

        <h1 className="mt-6 text-2xl font-bold text-neutral-900 animate-fade-in">
          {t('success')}
        </h1>

        <p className="mt-2 text-center text-neutral-500 animate-fade-in-delay">
          {t('successMessage')}
        </p>
      </div>

      {/* Receipt Card */}
      <div className="bg-white border border-neutral-200 rounded-xl overflow-hidden animate-slide-up">
        <div className="bg-primary px-6 py-4">
          <div className="flex items-center gap-2 text-white">
            <Receipt className="w-5 h-5" />
            <span className="font-semibold">{t('receipt')}</span>
          </div>
        </div>

        <div className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-neutral-500">
              {t('history.application')}
            </span>
            <span className="font-mono text-sm text-neutral-900">
              {payment.transactionId}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm text-neutral-500">
              {t('history.application')}
            </span>
            <span className="font-medium text-neutral-900">
              {payment.applicationNumber}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm text-neutral-500">
              {t('fees.applicationFee')}
            </span>
            <span className="text-neutral-900">
              {t(`fees.${feeTypeKeys[payment.feeType]}`)}
            </span>
          </div>

          <div className="flex items-center justify-between py-3 border-t border-b border-neutral-100">
            <span className="font-medium text-neutral-900">
              {t('history.amount')}
            </span>
            <span className="text-xl font-bold text-primary-600">
              {payment.amount.toLocaleString('en-SA', {
                style: 'currency',
                currency: 'SAR',
                minimumFractionDigits: 0,
              })}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm text-neutral-500">
              {t('history.method')}
            </span>
            <div className="flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-neutral-400" />
              <span className="text-neutral-900">
                {t(payment.paymentMethod.toLowerCase())}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm text-neutral-500">
              {t('history.date')}
            </span>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-neutral-400" />
              <span className="text-neutral-900">
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
            <span className="text-sm text-neutral-500">
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
        className="space-y-3 animate-fade-in"
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