'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { PaymentMethod, FeeType, paymentService } from '@/services/payment.service';
import { cn } from '@/lib/utils';
import {
  CreditCard,
  ChevronLeft,
  CheckCircle,
  Lock,
  Loader2,
  Wallet,
  ShieldCheck,
  Zap,
  Fingerprint,
  Building2
} from 'lucide-react';
import { usePaymentStore } from '@/stores/payment-store';
import { motion, AnimatePresence } from 'framer-motion';

const paymentMethods = [
  {
    id: PaymentMethod.Jeeb,
    label: 'محفظة جيب',
    description: 'الدفع السريع والآمن',
    icon: <Wallet className="w-6 h-6" />,
    color: 'bg-emerald-500'
  },
  {
    id: PaymentMethod.BankTransfer,
    label: 'بنك الكريمي',
    description: 'عبر تطبيق كريمي جوال',
    icon: <Building2 className="w-6 h-6" />,
    color: 'bg-blue-600'
  },
  {
    id: PaymentMethod.Mada,
    label: 'بطاقة بنكية',
    description: 'مدى، فيزا، ماستركارد',
    icon: <CreditCard className="w-6 h-6" />,
    color: 'bg-[#1a3a8f]'
  }
];

const feeTypeLabels: Record<string, string> = {
  'ApplicationFee': 'رسوم تقديم الطلب',
  'MedicalExamFee': 'رسوم الفحص الطبي',
  'TheoryTestFee': 'رسوم الاختبار النظري',
  'PracticalTestFee': 'رسوم الاختبار العملي',
  'IssuanceFee': 'رسوم إصدار الرخصة',
  'RetakeFee': 'رسوم إعادة الاختبار',
};

type PaymentState = 'selecting' | 'processing' | 'success' | 'failed';

export default function PaymentProcessingPage() {
  const router = useRouter();
  const params = useParams();
  const paymentId = params.id as string;
  const [paymentState, setPaymentState] = useState<PaymentState>('selecting');
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(null);
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [cardHolderName, setCardHolderName] = useState('');
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { isProcessing, startProcessing, stopProcessing, clearSession } = usePaymentStore();

  useEffect(() => {
    return () => {
      setCardNumber('');
      setCvv('');
      setExpiryDate('');
      setCardHolderName('');
      clearSession();
    };
  }, []);

  const { data: paymentData, isLoading: isFetchingPayment, isError: fetchError } = useQuery({
    queryKey: ['payment', paymentId],
    queryFn: () => paymentService.getPaymentById(paymentId),
    enabled: !!paymentId,
  });

  const payment = paymentData?.data;

  const handleSubmit = async () => {
    if (!selectedMethod || !agreedToTerms || !payment || isLoading || isProcessing) return;

    setIsLoading(true);
    startProcessing(payment.id);
    setPaymentState('processing');
    setError(null);

    try {
      // Use processPayment for demo - simulates immediate successful payment
      const result = await paymentService.processPayment(payment.id);

      if (result.success) {
        router.push('/payments/success');
      } else {
        setPaymentState('failed');
        setError(result.message || 'فشلت عملية الدفع');
      }
    } catch (err: any) {
      setPaymentState('failed');
      setError(err.message || 'حدث خطأ أثناء معالجة الدفع');
    } finally {
      setIsLoading(false);
      stopProcessing();
    }
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

  const isCardMethod = selectedMethod === PaymentMethod.Mada || selectedMethod === PaymentMethod.Visa || selectedMethod === PaymentMethod.MasterCard;

  return (
    <div className="max-w-3xl mx-auto space-y-10 font-arabic p-4 pb-20" dir="rtl">
      {/* Header */}
      <header className="flex items-center justify-between gap-6">
        <div className="flex items-center gap-6">
          <div className="w-1.5 h-10 bg-[#1a3a8f] rounded-full shadow-lg" />
          <div>
            <div className="flex items-center gap-2 mb-1">
              <button onClick={() => router.back()} className="text-[10px] font-black text-[#1a3a8f] uppercase tracking-widest flex items-center gap-1 hover:pe-1 transition-all">
                <ChevronLeft className="w-3.5 h-3.5 rotate-180" />
                العودة
              </button>
            </div>
            <h1 className="text-2xl font-black text-neutral-900 tracking-tight">سداد الرسوم الحكومية</h1>
          </div>
        </div>
        <div className="hidden md:flex items-center gap-3 px-5 py-2.5 bg-emerald-50 rounded-2xl border border-emerald-100">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span className="text-[10px] font-black text-emerald-700 uppercase tracking-widest">نظام سداد آمن</span>
        </div>
      </header>

      {/* Payment Details Card */}
      <Card className="border-none shadow-xl rounded-3xl overflow-hidden bg-white border border-neutral-100/50">
        <CardContent className="p-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="space-y-2">
              <p className="text-[10px] font-black text-neutral-400 uppercase tracking-[0.2em]">بيان المعاملة</p>
              <h2 className="text-xl font-black text-neutral-900 tracking-tight">
                {isFetchingPayment ? <Skeleton className="h-7 w-48" /> : (feeTypeLabels[payment?.feeType as any] || 'رسوم إدارية')}
              </h2>
              <p className="text-sm font-bold text-neutral-400 tabular-nums">
                {isFetchingPayment ? <Skeleton className="h-4 w-32 mt-2" /> : payment?.applicationNumber}
              </p>
            </div>
            <div className="bg-neutral-50 px-8 py-5 rounded-2xl border border-neutral-100 text-center md:text-left min-w-[200px]">
              <p className="text-[10px] font-black text-neutral-400 uppercase tracking-[0.2em] mb-2">المبلغ المستحق</p>
              <div className="text-3xl font-black text-[#1a3a8f] tracking-tighter tabular-nums">
                {isFetchingPayment ? <Skeleton className="h-9 w-24 mx-auto" /> : (
                  <>
                    {payment?.amount.toLocaleString('ar-YE')}
                    <span className="text-sm font-bold text-neutral-400 ms-2">ريال</span>
                  </>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payment Method Selection */}
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <Zap className="w-5 h-5 text-[#D4A017]" />
          <h3 className="text-lg font-black text-neutral-800">اختر وسيلة الدفع</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {paymentMethods.map((method) => (
            <button
              key={method.id}
              onClick={() => setSelectedMethod(method.id)}
              disabled={paymentState === 'processing'}
              className={cn(
                "flex flex-col items-center gap-4 p-6 rounded-2xl border-2 transition-all duration-500 text-center group relative overflow-hidden",
                selectedMethod === method.id
                  ? "border-[#1a3a8f] bg-blue-50/30 shadow-lg"
                  : "border-neutral-100 bg-white hover:border-[#1a3a8f]/30"
              )}
            >
              <div className={cn(
                "w-14 h-14 rounded-xl flex items-center justify-center text-white shadow-lg transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6",
                method.color
              )}>
                {method.icon}
              </div>
              <div className="flex-1">
                <p className={cn("text-base font-black tracking-tight", selectedMethod === method.id ? "text-[#1a3a8f]" : "text-neutral-900")}>
                  {method.label}
                </p>
                <p className="text-[10px] font-bold text-neutral-400 mt-1">{method.description}</p>
              </div>
              {selectedMethod === method.id && (
                <div className="absolute top-3 left-3">
                  <CheckCircle className="w-4 h-4 text-[#1a3a8f]" />
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Dynamic Form Area */}
      <AnimatePresence mode="wait">
        {isCardMethod && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            <Card className="border-none shadow-xl rounded-3xl overflow-hidden bg-neutral-50 p-8 border border-neutral-100">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <Label className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">رقم البطاقة</Label>
                  <Input
                    placeholder="**** **** **** ****"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                    className="h-12 rounded-xl border-neutral-200 bg-white font-black text-lg tracking-widest text-center tabular-nums focus:ring-4 focus:ring-blue-900/5 transition-all"
                    maxLength={19}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <Label className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">تاريخ الانتهاء</Label>
                    <Input
                      placeholder="MM/YY"
                      value={expiryDate}
                      onChange={(e) => setExpiryDate(formatExpiryDate(e.target.value))}
                      className="h-12 rounded-xl border-neutral-200 bg-white font-black text-lg text-center tabular-nums focus:ring-4 focus:ring-blue-900/5 transition-all"
                      maxLength={5}
                    />
                  </div>
                  <div className="space-y-3">
                    <Label className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">رمز التحقق CVV</Label>
                    <Input
                      placeholder="***"
                      type="password"
                      value={cvv}
                      onChange={(e) => setCvv(e.target.value.replace(/\D/g, '').slice(0, 3))}
                      className="h-12 rounded-xl border-neutral-200 bg-white font-black text-lg text-center tabular-nums focus:ring-4 focus:ring-blue-900/5 transition-all"
                      maxLength={3}
                    />
                  </div>
                </div>
                <div className="md:col-span-2 space-y-3">
                  <Label className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">اسم صاحب البطاقة</Label>
                  <Input
                    placeholder="الاسم كما هو مكتوب على البطاقة"
                    value={cardHolderName}
                    onChange={(e) => setCardHolderName(e.target.value)}
                    className="h-12 rounded-xl border-neutral-200 bg-white font-black text-lg focus:ring-4 focus:ring-blue-900/5 transition-all"
                  />
                </div>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Consent and Action */}
      <div className="space-y-8 pt-4">
        <div className="flex items-start gap-4 p-5 bg-neutral-50 rounded-2xl border border-neutral-100">
          <Checkbox
            id="terms"
            checked={agreedToTerms}
            onCheckedChange={(checked) => setAgreedToTerms(checked as boolean)}
            className="mt-1 border-neutral-300 data-[state=checked]:bg-[#1a3a8f]"
          />
          <Label htmlFor="terms" className="text-xs font-bold text-neutral-500 leading-relaxed cursor-pointer">
            أقر بصحة البيانات المدخلة وأوافق على <span className="text-[#1a3a8f] underline">شروط وأحكام الدفع الإلكتروني</span> والرسوم المقررة قانوناً.
          </Label>
        </div>

        <div className="flex flex-col md:flex-row gap-4">
          <Button
            onClick={handleSubmit}
            disabled={!selectedMethod || !agreedToTerms || isLoading}
            className="flex-1 h-14 rounded-2xl bg-[#1a3a8f] hover:bg-[#152d6f] text-white font-black text-lg shadow-xl shadow-blue-900/20 transition-all hover:scale-[1.02] active:scale-95 gap-4"
          >
            {isLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : <Lock className="w-5 h-5" />}
            تأكيد وعملية السداد
          </Button>
          <Button
            variant="outline"
            onClick={() => router.back()}
            disabled={isLoading}
            className="h-14 px-10 rounded-2xl border-neutral-200 font-black text-neutral-400 hover:bg-neutral-50 hover:text-neutral-600 transition-all"
          >
            إلغاء العملية
          </Button>
        </div>

        {/* Security Signifier */}
        <div className="flex items-center justify-center gap-6 opacity-40 grayscale pt-8">
          <img src="/images/mada.svg" alt="Mada" className="h-6" />
          <img src="/images/visa.svg" alt="Visa" className="h-6" />
          <img src="/images/mastercard.svg" alt="Mastercard" className="h-6" />
          <div className="w-px h-6 bg-neutral-300" />
          <div className="flex items-center gap-2">
            <Lock className="w-3.5 h-3.5" />
            <span className="text-[9px] font-black uppercase tracking-widest">تشفير AES-256 بنكي</span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="flex justify-center opacity-30 select-none pt-12 text-center">
        <div className="flex flex-col items-center gap-4">
          <div className="flex items-center gap-6 py-4 px-8 rounded-full border border-neutral-100 bg-white shadow-sm">
            <Fingerprint className="w-5 h-5 text-[#1a3a8f]" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-neutral-500">نظام التحصيل المالي السيادي الموحد</span>
          </div>
          <p className="text-[9px] font-black uppercase tracking-widest text-neutral-400">جميع الحقوق محفوظة © وزارة الداخلية - Mojaz Platform</p>
        </div>
      </footer>
    </div>
  );
}