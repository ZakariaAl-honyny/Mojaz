"use client";

import { useState, useEffect, useMemo } from "react";
import { paymentService } from "@/services/payment.service";
import { PaymentDto, PaymentStatus, FeeType } from "@/types/payment.types";
import { ReceiptDownloadButton } from "./ReceiptDownloadButton";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { StatusBadge } from "@/components/domain/application/StatusBadge";
import { ApplicationStatus } from "@/lib/enums";
import { CreditCard, Calendar, Hash, Receipt, ArrowLeftRight, Clock, CheckCircle2, AlertCircle } from "lucide-react";
import { format } from "date-fns";
import { ar } from "date-fns/locale";
import { cn } from "@/lib/utils";

// Fee type names mapping
const FEE_TYPE_NAMES: Record<FeeType, string> = {
  [FeeType.ApplicationFee]: 'رسوم الطلب',
  [FeeType.MedicalExamFee]: 'الفحص الطبي',
  [FeeType.TheoryTestFee]: 'الاختبار النظري',
  [FeeType.PracticalTestFee]: 'الاختبار العملي',
  [FeeType.IssuanceFee]: 'إصدار الرخصة',
  [FeeType.RetakeFee]: 'إعادة الاختبار',
  [FeeType.RenewalFee]: 'تجديد الرخصة',
  [FeeType.ReplacementFee]: 'استخراج بدل',
  [FeeType.CategoryUpgrade]: 'ترقية الفئة',
};

interface PaymentHistoryListProps {
  applicationNumber: string;
}

export function PaymentHistoryList({ applicationNumber }: PaymentHistoryListProps) {
  const [payments, setPayments] = useState<PaymentDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchPayments();
  }, [applicationNumber]);

  const fetchPayments = async () => {
    if (!applicationNumber) return;
    
    try {
      setIsLoading(true);
      const res = await paymentService.getPaymentsByApplication(applicationNumber);
      if (res.success && res.data) {
        setPayments(res.data);
      }
    } catch (error) {
      console.error("Failed to fetch payment history:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getFeeLabelAr = (feeType: string): string => {
    const map: Record<string, string> = {
      'ApplicationFee': 'رسوم طلب جديد',
      'MedicalFee': 'رسوم الفحص الطبي',
      'TheoryFee': 'رسوم الاختبار النظري',
      'PracticalFee': 'رسوم الاختبار العملي',
      'IssuanceFee': 'رسوم إصدار الرخصة',
      'RetakeFee': 'رسوم إعادة الاختبار',
    };
    return map[feeType] || feeType;
  };

  if (isLoading) {
    return (
      <Card className="border border-neutral-200 shadow-sm rounded-xl md:rounded-2xl bg-white overflow-hidden font-arabic" dir="rtl">
        <CardHeader className="p-4 md:p-6 border-b border-neutral-50">
           <div className="h-6 w-1/3 bg-neutral-100 rounded-full animate-pulse" />
        </CardHeader>
        <CardContent className="p-0">
          {[1, 2].map((i) => (
            <div key={i} className="p-4 md:p-6 border-b border-neutral-50 last:border-0">
               <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-neutral-50 rounded-xl animate-pulse" />
                  <div className="flex-1 space-y-2">
                     <div className="h-4 w-1/4 bg-neutral-50 rounded-full animate-pulse" />
                     <div className="h-3 w-1/2 bg-neutral-50 rounded-full animate-pulse" />
                  </div>
               </div>
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  if (payments.length === 0) return null;

  return (
    <Card className="border border-neutral-200 shadow-sm rounded-xl md:rounded-2xl bg-white overflow-hidden font-arabic" dir="rtl">
      <CardHeader className="bg-white p-4 md:p-6 border-b border-neutral-50">
        <div className="flex gap-3 md:gap-4 gap-start-center">
           <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-blue-50 flex items-center justify-center text-[#1a3a8f]">
              <ArrowLeftRight className="w-5 h-5 md:w-6 md:h-6" />
           </div>
           <div>
              <CardTitle className="text-lg md:text-xl font-black text-neutral-900">سجل المدفوعات</CardTitle>
              <p className="text-[10px] md:text-xs font-bold text-neutral-400 mt-0.5">تتبع تاريخ جميع العمليات المالية الخاصة بطلبك</p>
           </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y divide-neutral-50">
          {payments.map((payment) => (
            <div key={payment.id} className="p-4 md:p-6 hover:bg-neutral-50 transition-all duration-300 group">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 md:gap-8">
                <div className="flex items-start gap-4 md:gap-6">
                  <div className={cn(
                    "mt-1 w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl flex items-center justify-center transition-all duration-500",
                    payment.status === PaymentStatus.Paid ? "bg-emerald-50 text-emerald-600" : "bg-neutral-50 text-neutral-300"
                  )}>
                    {payment.status === PaymentStatus.Paid ? <CheckCircle2 className="w-5 h-5 md:w-6 md:h-6" /> : (payment.status === PaymentStatus.Failed ? <AlertCircle className="w-5 h-5 md:w-6 md:h-6" /> : <Clock className="w-5 h-5 md:w-6 md:h-6" />)}
                  </div>
                  <div className="space-y-1.5 md:space-y-2">
                    <div className="flex items-center gap-3 md:gap-4">
                      <span className="font-black text-[#1a3a8f] text-lg md:text-xl">
                        {payment.amount.toLocaleString('ar-YE', { style: 'currency', currency: 'YER', minimumFractionDigits: 0 })}
                      </span>
                      <StatusBadge 
                        status={getStatusString(payment.status) as ApplicationStatus} 
                      />
                    </div>
                    <div className="text-sm md:text-base font-black text-neutral-700">
                      {FEE_TYPE_NAMES[payment.feeType] || 'رسوم'}
                    </div>
                    <div className="flex flex-wrap gap-x-4 md:gap-x-6 gap-y-1.5 pt-1.5">
                      <div className="flex items-center gap-1.5 text-[10px] md:text-xs font-bold text-neutral-400">
                        <Calendar className="w-3.5 h-3.5" />
                        {payment.paidAt ? format(new Date(payment.paidAt), "PPP", { locale: ar }) : '-'}
                      </div>
                      <div className="flex items-center gap-1.5 text-[10px] md:text-xs font-bold text-neutral-400">
                        <Hash className="w-3.5 h-3.5" />
                        المرجع: {payment.transactionId || '-'}
                      </div>
                    </div>
                  </div>
                </div>

                {payment.status === PaymentStatus.Paid && (
                  <ReceiptDownloadButton 
                    paymentId={payment.id} 
                    className="md:w-auto w-full h-10 md:h-12 px-6 rounded-lg md:rounded-xl bg-neutral-50 hover:bg-blue-50 text-neutral-900 font-bold transition-all border border-neutral-100" 
                  />
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// Helper to map enum status to StatusBadge format
function getStatusString(status: PaymentStatus): ApplicationStatus {
  switch (status) {
    case PaymentStatus.Pending: return ApplicationStatus.Submitted;
    case PaymentStatus.Paid: return ApplicationStatus.Approved;
    case PaymentStatus.Failed: return ApplicationStatus.Rejected;
    case PaymentStatus.Refunded: return ApplicationStatus.Cancelled;
    default: return ApplicationStatus.Submitted;
  }
}