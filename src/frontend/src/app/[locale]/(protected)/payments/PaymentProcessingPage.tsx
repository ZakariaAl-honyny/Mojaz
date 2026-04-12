'use client';

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { PaymentMethod, FeeType, PaymentDto } from '@/types/payment.types';
import { cn } from '@/lib/utils';
import { 
  CreditCard, 
  ChevronLeft,
  CheckCircle,
  Lock,
  Loader2,
  Apple
} from 'lucide-react';

// Mock payment data - in production, fetch from API
const mockPayment: PaymentDto = {
  id: '1',
  applicationId: 'app-001',
  applicationNumber: 'MOJ-2025-12345678',
  applicantFullName: 'أحمد محمد',
  feeType: 'ApplicationFee',
  amount: 200,
  status: 'Pending',
  dueDate: '2025-04-20',
};

const paymentMethods: { id: PaymentMethod; labelKey: string; icon: React.ReactNode }[] = [
  { id: 'Mada', labelKey: 'mada', icon: <CreditCard className="w-6 h-6" /> },
  { id: 'Visa', labelKey: 'visa', icon: <CreditCard className="w-6 h-6" /> },
  { id: 'MasterCard', labelKey: 'masterCard', icon: <CreditCard className="w-6 h-6" /> },
  { id: 'ApplePay', labelKey: 'applePay', icon: <Apple className="w-6 h-6" /> },
];

const feeTypeKeys: Record<FeeType, string> = {
  ApplicationFee: 'applicationFee',
  MedicalFee: 'medicalFee',
  TheoryFee: 'theoryFee',
  PracticalFee: 'practicalFee',
  IssuanceFee: 'issuanceFee',
  RetakeFee: 'retakeFee',
};

type PaymentState = 'selecting' | 'processing' | 'success' | 'failed';

export default function PaymentProcessingPage() {
  const t = useTranslations('payment');
  const router = useRouter();
  const params = useParams();
  const [paymentState, setPaymentState] = useState<PaymentState>('selecting');
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(null);
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [cardHolderName, setCardHolderName] = useState('');
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Use mock data - in production, fetch from API using params.id
  const payment = mockPayment;

  const handleMethodSelect = (method: PaymentMethod) => {
    setSelectedMethod(method);
  };

  const handleSubmit = async () => {
    if (!selectedMethod || !agreedToTerms) return;
    
    setIsLoading(true);
    setPaymentState('processing');

    // Simulate payment processing
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      // Redirect to success page
      router.push('/payments/success');
    } catch {
      setPaymentState('failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    router.push('/payments');
  };

  const formatCardNumber = (value: string) => {
    const cleaned = value.replace(/\D/g, '');
    const chunks = [];
    for (let i = 0; i < cleaned.length && i < 16; i += 4) {
      chunks.push(cleaned.slice(i, i + 4));
    }
    return chunks.join(' ');
  };

  const formatExpiryDate = (value: string) => {
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.length >= 2) {
      return `${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}`;
    }
    return cleaned;
  };

  const showCardForm = selectedMethod && selectedMethod !== 'ApplePay' && selectedMethod !== 'Mada';

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Back Button */}
      <Button variant="ghost" onClick={handleCancel} className="me-auto">
        <ChevronLeft className="w-4 h-4 me-1" />
        {t('continueButton')}
      </Button>

      {/* Header */}
      <div className="text-center">
        <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
          {t('payNow')}
        </h1>
        <p className="text-neutral-500 dark:text-neutral-400 mt-1">
          {payment.applicationNumber}
        </p>
      </div>

      {/* Payment Summary Card */}
      <div className="bg-neutral-50 dark:bg-neutral-800/50 rounded-xl p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-neutral-500 dark:text-neutral-400">
              {t(`fees.${feeTypeKeys[payment.feeType]}`)}
            </p>
            <p className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mt-1">
              {payment.applicationNumber}
            </p>
          </div>
          <div className="text-end">
            <p className="text-sm text-neutral-500 dark:text-neutral-400">
              {t('payAmount')}
            </p>
            <p className="text-2xl font-bold text-primary-600 dark:text-primary-400">
              {payment.amount.toLocaleString('en-SA', {
                style: 'currency',
                currency: 'SAR',
                minimumFractionDigits: 0,
              })}
            </p>
          </div>
        </div>
      </div>

      {/* Payment Method Selection */}
      <div className="space-y-4">
        <Label className="text-base font-medium">
          {t('paymentMethod')}
        </Label>
        <div className="grid grid-cols-2 gap-3">
          {paymentMethods.map((method) => (
            <button
              key={method.id}
              onClick={() => handleMethodSelect(method.id)}
              disabled={paymentState === 'processing'}
              className={cn(
                'flex items-center gap-3 p-4 rounded-xl border-2 transition-all',
                selectedMethod === method.id
                  ? 'border-primary bg-primary/5 dark:bg-primary/10'
                  : 'border-neutral-200 dark:border-neutral-700 hover:border-primary/50',
                paymentState === 'processing' && 'opacity-50 cursor-not-allowed'
              )}
            >
              <div className={cn(
                'w-10 h-10 rounded-lg flex items-center justify-center',
                selectedMethod === method.id
                  ? 'bg-primary text-white'
                  : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-500'
              )}>
                {method.icon}
              </div>
              <span className={cn(
                'font-medium',
                selectedMethod === method.id
                  ? 'text-primary'
                  : 'text-neutral-700 dark:text-neutral-300'
              )}>
                {t(method.labelKey)}
              </span>
              {selectedMethod === method.id && (
                <CheckCircle className="w-5 h-5 text-primary ms-auto" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Card Details Form */}
      {showCardForm && (
        <div className="space-y-4">
          <Label className="text-base font-medium">
            {t('enterCardDetails')}
          </Label>
          <div className="bg-neutral-50 dark:bg-neutral-800/50 rounded-xl p-6 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="cardNumber">{t('cardNumber')}</Label>
              <Input
                id="cardNumber"
                placeholder="1234 5678 9012 3456"
                value={cardNumber}
                onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                maxLength={19}
                disabled={paymentState === 'processing'}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="expiryDate">{t('expiryDate')}</Label>
                <Input
                  id="expiryDate"
                  placeholder="MM/YY"
                  value={expiryDate}
                  onChange={(e) => setExpiryDate(formatExpiryDate(e.target.value))}
                  maxLength={5}
                  disabled={paymentState === 'processing'}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cvv">{t('cvv')}</Label>
                <Input
                  id="cvv"
                  placeholder="123"
                  value={cvv}
                  onChange={(e) => setCvv(e.target.value.replace(/\D/g, '').slice(0, 4))}
                  maxLength={4}
                  type="password"
                  disabled={paymentState === 'processing'}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="cardHolderName">{t('cardHolder')}</Label>
              <Input
                id="cardHolderName"
                placeholder="أحمد محمد"
                value={cardHolderName}
                onChange={(e) => setCardHolderName(e.target.value)}
                disabled={paymentState === 'processing'}
              />
            </div>
          </div>
        </div>
      )}

      {/* Terms */}
      <div className="flex items-start gap-3">
        <Checkbox
          id="terms"
          checked={agreedToTerms}
          onCheckedChange={(checked) => setAgreedToTerms(checked as boolean)}
          disabled={paymentState === 'processing'}
        />
        <Label
          htmlFor="terms"
          className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed cursor-pointer"
        >
          {t('selectMethod')}{' '}
          <a href="#" className="text-primary hover:underline">
            {t('termsLink')}
          </a>
        </Label>
      </div>

      {/* Security Note */}
      <div className="flex items-center gap-2 text-sm text-neutral-500 dark:text-neutral-400">
        <Lock className="w-4 h-4" />
        <span>Your payment information is secure and encrypted</span>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 pt-4">
        <Button
          variant="outline"
          onClick={handleCancel}
          disabled={isLoading}
          className="flex-1"
        >
          {t('cancel')}
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={!selectedMethod || !agreedToTerms || isLoading}
          className="flex-1"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 me-2 animate-spin" />
              {t('processing')}
            </>
          ) : (
            t('confirmPayment')
          )}
        </Button>
      </div>

      {/* Error Message */}
      {paymentState === 'failed' && (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
          <p className="text-red-600 dark:text-red-400 text-center">
            {t('paymentFailed')}
          </p>
          <Button
            variant="outline"
            onClick={() => setPaymentState('selecting')}
            className="w-full mt-3"
          >
            {t('tryAgain')}
          </Button>
        </div>
      )}
    </div>
  );
}