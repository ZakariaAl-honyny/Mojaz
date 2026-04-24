'use client';

import { cn } from '@/lib/utils';
import { FeeType, PaymentStatus } from '@/types/payment.types';
import { Check, Clock, AlertCircle, Receipt } from 'lucide-react';

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

const feeTypeLabelsAr: Record<FeeType, string> = {
  ApplicationFee: 'رسوم تقديم الطلب',
  MedicalFee: 'رسوم الفحص الطبي',
  TheoryFee: 'رسوم الاختبار النظري',
  PracticalFee: 'رسوم الاختبار العملي',
  IssuanceFee: 'رسوم إصدار الرخصة',
  RetakeFee: 'رسوم إعادة الاختبار',
};

export function FeeBreakdown({ fees, total, paid, pending, className }: FeeBreakdownProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ar-YE', {
      style: 'currency',
      currency: 'YER',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className={cn('space-y-8 font-arabic', className)} dir="rtl">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
         <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-[#1a3a8f]">
            <Receipt className="w-6 h-6" />
         </div>
         <div>
            <h3 className="text-xl font-black text-neutral-900">تفاصيل الرسوم</h3>
            <p className="text-xs font-bold text-neutral-400 mt-0.5">تفصيل كامل للمستحقات المالية والمدفوعات</p>
         </div>
      </div>

      {/* Fee Items */}
      <div className="space-y-4">
        {fees.map((fee) => (
          <div
            key={fee.type}
            className={cn(
              'flex items-center justify-between p-5 rounded-[1.5rem] transition-all duration-300 border border-transparent',
              fee.isPaid 
                ? 'bg-emerald-50/30' 
                : 'bg-neutral-50 hover:bg-white hover:shadow-xl hover:shadow-blue-900/5 hover:border-blue-100'
            )}
          >
            <div className="flex items-center gap-5">
              {/* Status Icon */}
              <div
                className={cn(
                  'w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-500',
                  fee.isPaid
                    ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20'
                    : 'bg-white text-neutral-300 shadow-sm'
                )}
              >
                {fee.isPaid ? (
                  <Check className="w-5 h-5 stroke-[4px]" />
                ) : (
                  <Clock className="w-5 h-5" />
                )}
              </div>

              {/* Fee Type Label */}
              <div>
                <p className={cn(
                  "text-base font-black tracking-tight",
                  fee.isPaid ? "text-emerald-700" : "text-neutral-900"
                )}>
                  {feeTypeLabelsAr[fee.type]}
                </p>
                {fee.status === 'Overdue' && (
                  <p className="flex items-center gap-1 text-[10px] font-black text-red-500 mt-1 uppercase tracking-widest">
                    <AlertCircle className="w-3 h-3" />
                    تجاوز تاريخ الاستحقاق
                  </p>
                )}
              </div>
            </div>

            {/* Amount */}
            <div className="text-left font-arabic">
              <p className={cn(
                'text-lg font-black',
                fee.isPaid ? 'text-emerald-600' : 'text-[#1a3a8f]'
              )}>
                {formatCurrency(fee.amount)}
              </p>
              {fee.isPaid && (
                <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mt-1">
                  تم السداد
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Summary Section */}
      <div className="p-8 rounded-[2.5rem] bg-white border border-blue-50/50 shadow-2xl shadow-blue-900/5 space-y-4">
        <div className="flex items-center justify-between pb-4 border-b border-dashed border-neutral-100">
          <span className="text-sm font-bold text-neutral-400">الإجمالي المدفوع</span>
          <span className="text-lg font-black text-emerald-600">
            {formatCurrency(paid)}
          </span>
        </div>
        
        <div className="flex items-center justify-between pb-4 border-b border-dashed border-neutral-100">
          <span className="text-sm font-bold text-neutral-400">المستحقات المعلقة</span>
          <span className="text-lg font-black text-amber-600">
            {formatCurrency(pending)}
          </span>
        </div>

        <div className="flex items-center justify-between pt-4 mt-4 bg-blue-50/50 rounded-2xl px-6 py-5">
          <div>
             <span className="text-sm font-black text-[#1a3a8f] uppercase tracking-widest">المبلغ الإجمالي</span>
          </div>
          <span className="text-3xl font-black text-[#1a3a8f]">
            {formatCurrency(total)}
          </span>
        </div>
      </div>
    </div>
  );
}

export default FeeBreakdown;