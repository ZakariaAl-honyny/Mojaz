'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { StatusBadge } from '@/components/shared/status-badge';
import { paymentService, PaymentDto } from '@/services/payment.service';
import { cn } from '@/lib/utils';
import { 
  CreditCard, 
  Calendar, 
  Download,
  Search,
  History,
  ShieldCheck,
  Wallet,
  ArrowUpLeft,
  Receipt,
  Zap,
  Tag,
  Clock,
  ArrowLeft
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

const feeTypeLabels: Record<string, string> = {
  ApplicationFee: "رسوم فتح الملف",
  MedicalFee: "رسوم الفحص الطبي",
  TheoryFee: "رسوم الاختبار النظري",
  PracticalFee: "رسوم الاختبار الميداني",
  IssuanceFee: "رسوم طباعة الرخصة",
  RetakeFee: "رسوم إعادة الاختبار",
};

export default function ApplicantPaymentsPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'pending' | 'history'>('pending');
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch payments from API
  const { data: paymentsData, isLoading, error } = useQuery({
    queryKey: ['myPayments'],
    queryFn: () => paymentService.getMyPayments(),
    staleTime: 30000, // 30 seconds
  });

  const allPayments = paymentsData?.data ?? [];
  
  // Split into pending and history
  const pendingPayments = allPayments.filter(p => p.status === 'Pending');
  const historyPayments = allPayments.filter(p => p.status === 'Paid');

  const pendingTotal = pendingPayments.reduce((sum, p) => sum + p.amount, 0);

  const filteredPending = pendingPayments.filter((p) =>
    p.applicationNumber.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredHistory = historyPayments.filter((p) =>
    p.applicationNumber.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-12 font-arabic" dir="rtl">
      {/* Institutional Header */}
      <header className="flex flex-col md:flex-row md:items-end md:justify-between gap-10 px-4">
         <div className="flex items-center gap-8">
            <div className="w-2.5 h-20 bg-[#1a3a8f] rounded-full shadow-2xl shadow-blue-900/40 relative">
                <div className="absolute top-0 left-0 w-full h-1/2 bg-[#D4A017] rounded-full opacity-50 blur-sm" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-black text-neutral-900 tracking-tighter leading-none mb-4">
                الرسوم والمدفوعات
              </h1>
              <p className="text-neutral-500 font-bold text-lg max-w-2xl leading-relaxed">
                بوابة السداد الآمن لإدارة الرسوم الحكومية. يتم معالجة كافة العمليات المالية عبر نظام التشفير السيادي الموحد.
              </p>
            </div>
         </div>
         
         <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-[#1a3a8f] border border-white/10 p-8 rounded-[2.5rem] shadow-2xl flex items-center gap-10 text-white relative overflow-hidden group"
         >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.1),transparent)] pointer-events-none" />
            <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center border border-white/20 group-hover:rotate-12 transition-transform duration-500">
               <Wallet className="w-8 h-8 text-white" />
            </div>
            <div>
               <p className="text-[10px] font-black text-white/50 uppercase tracking-[0.3em] mb-2 text-right">إجمالي المستحقات المعلقة</p>
               <p className="text-3xl font-black tracking-tighter tabular-nums text-white text-right">
                  {pendingTotal.toLocaleString('ar-YE')} <span className="text-sm font-bold text-white/50">ريال يمني</span>
               </p>
            </div>
         </motion.div>
      </header>

      {/* Navigation & Search Shell */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-10 bg-white border border-neutral-100 p-10 rounded-[3rem] shadow-xl shadow-black/5 mx-4">
         <div className="flex items-center gap-3 p-2 bg-neutral-50 rounded-[2rem] w-fit border border-neutral-100">
            <button
              onClick={() => setActiveTab('pending')}
              className={cn(
                "px-10 py-4 rounded-[1.5rem] font-black text-xs uppercase tracking-[0.2em] transition-all duration-500 gap-4 flex items-center relative",
                activeTab === 'pending'
                  ? "bg-[#1a3a8f] text-white shadow-2xl shadow-blue-900/30"
                  : "text-neutral-400 hover:text-[#1a3a8f] hover:bg-white"
              )}
            >
              <CreditCard className="w-4 h-4" />
              المستحقات الحالية
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={cn(
                "px-10 py-4 rounded-[1.5rem] font-black text-xs uppercase tracking-[0.2em] transition-all duration-500 gap-4 flex items-center relative",
                activeTab === 'history'
                  ? "bg-[#1a3a8f] text-white shadow-2xl shadow-blue-900/30"
                  : "text-neutral-400 hover:text-[#1a3a8f] hover:bg-white"
              )}
            >
              <History className="w-4 h-4" />
              سجل العمليات
            </button>
         </div>

         <div className="relative w-full xl:w-[32rem] group">
            <Search className="absolute right-6 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-300 group-focus-within:text-[#1a3a8f] transition-colors duration-500" />
            <Input
              placeholder="البحث عن معاملة مالية عبر رقم الطلب..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pr-16 h-16 border-neutral-100 bg-neutral-50 focus:bg-white focus:ring-8 focus:ring-blue-900/5 focus:border-[#1a3a8f]/30 transition-all duration-500 rounded-[1.5rem] font-bold text-lg text-right shadow-inner"
            />
         </div>
      </div>

      {/* Main Content Area */}
      <div className="px-4 pb-16">
        <AnimatePresence mode="wait">
          {activeTab === 'pending' ? (
            <motion.div
              key="pending"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="space-y-8"
            >
              {filteredPending.length > 0 ? (
                <>
                  <div className="bg-[#1a3a8f] p-10 rounded-[3rem] items-start flex gap-8 shadow-2xl shadow-blue-900/10 relative overflow-hidden group">
                     {/* Decorative Gradients */}
                     <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_bottom_left,rgba(212,160,23,0.1),transparent)] pointer-events-none" />
                     
                     <div className="w-16 h-16 rounded-[1.25rem] bg-white/10 backdrop-blur-md flex items-center justify-center shrink-0 border border-white/20 group-hover:scale-110 transition-transform duration-700">
                        <Tag className="w-8 h-8 text-[#D4A017]" />
                     </div>
                     <div>
                        <h4 className="text-xl font-black text-white mb-2 flex items-center gap-4">
                            إشعار بالسداد الفوري
                            <span className="px-3 py-1 bg-white/10 rounded-lg text-[9px] font-black text-[#D4A017] uppercase tracking-widest border border-[#D4A017]/30">عاجل</span>
                        </h4>
                        <p className="text-white/60 font-medium text-base leading-relaxed max-w-3xl">
                           يتطلب نظام إصدار التراخيص سداد كافة الرسوم المستحقة لتفعيل المراحل التالية من طلبك. يمكنك السداد الآن للحصول على أولوية في المواعيد.
                        </p>
                     </div>
                  </div>

                  <div className="grid grid-cols-1 gap-6">
                    {filteredPending.map((payment) => (
                      <Card 
                        key={payment.id} 
                        className="border border-neutral-100 shadow-sm hover:shadow-2xl hover:border-[#D4A017]/30 transition-all duration-500 rounded-[2.5rem] bg-white group overflow-hidden"
                      >
                        <CardContent className="p-8 md:p-12 flex flex-col xl:flex-row items-center justify-between gap-12">
                           <div className="flex items-center gap-10 flex-1 w-full xl:w-auto">
                              <div className="w-24 h-24 rounded-[2rem] bg-neutral-50 flex items-center justify-center border border-neutral-100 group-hover:bg-[#1a3a8f] transition-all duration-700 shadow-inner overflow-hidden relative">
                                 <Receipt className="w-10 h-10 text-[#1a3a8f] group-hover:text-white transition-colors duration-700 z-10" />
                                 <div className="absolute inset-0 bg-[#1a3a8f] h-full w-full translate-y-full group-hover:translate-y-0 transition-transform duration-700" />
                              </div>
                              <div className="space-y-3 flex-1 text-right">
                                 <h4 className="text-2xl font-black text-neutral-900 group-hover:text-[#1a3a8f] transition-colors tracking-tight">
                                    {feeTypeLabels[payment.feeType]}
                                 </h4>
                                 <div className="flex items-center gap-5">
                                    <div className="flex items-center gap-3">
                                        <div className="w-2 h-2 rounded-full bg-[#D4A017]" />
                                        <span className="text-[11px] font-black text-neutral-400 uppercase tracking-[0.2em] leading-none">رقم المعاملة:</span>
                                    </div>
                                    <span className="text-sm font-black text-neutral-900 tracking-tight leading-none tabular-nums">{payment.applicationNumber}</span>
                                 </div>
                              </div>
                           </div>

                           <div className="flex flex-col md:flex-row items-center gap-12 xl:gap-20 flex-1 justify-center w-full xl:w-auto px-8 border-y xl:border-y-0 xl:border-x border-neutral-50 py-8 xl:py-0">
                               <div className="text-center xl:text-right min-w-[160px]">
                                  <p className="text-[10px] text-neutral-400 font-black uppercase tracking-[0.2em] mb-4">أخر موعد للسداد</p>
                                  <div className="flex items-center gap-3 bg-red-50/50 px-5 py-2.5 rounded-2xl border border-red-100 text-rose-600">
                                     <Clock className="w-4 h-4 animate-pulse" />
                                     <span className="text-base font-black tracking-tight tabular-nums">
                                        {new Date(payment.dueDate).toLocaleDateString('ar-YE', { day: '2-digit', month: 'long' })}
                                     </span>
                                  </div>
                               </div>

                               <div className="text-center xl:text-right min-w-[180px]">
                                  <p className="text-[10px] text-neutral-400 font-black uppercase tracking-[0.2em] mb-4">القيمة الإجمالية</p>
<p className="text-2xl md:text-3xl font-black text-neutral-900 tracking-tighter tabular-nums leading-none">
                                      {payment.amount.toLocaleString('ar-YE')} <span className="text-xs font-bold text-neutral-400">RY</span>
                                   </p>
                               </div>
                           </div>

                           <div className="flex items-center gap-6 w-full xl:w-auto justify-end">
<Button 
                                 onClick={() => router.push(`/payments/${payment.id}`)}
                                 className="h-10 md:h-12 px-6 md:px-8 rounded-md bg-[#1a3a8f] hover:bg-[#152d6f] text-sm md:text-base text-white font-black transition-all duration-500 active:scale-95 gap-3 md:gap-4 group"
                               >
                                  سداد الرسوم الآن
                                  <div className="w-8 h-8 md:w-9 md:h-9 rounded-md bg-white/10 flex items-center justify-center group-hover:-translate-x-1 transition-transform">
                                     <ArrowLeft className="w-4 h-4 md:w-5 md:h-5" />
                                  </div>
                               </Button>
                           </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </>
              ) : (
                <Card className="border-2 border-neutral-100 border-dashed bg-neutral-50/30 rounded-[4rem] p-24">
                  <CardContent className="flex flex-col items-center justify-center text-center">
                    <div className="w-32 h-32 rounded-[2.5rem] bg-white shadow-2xl shadow-black/5 flex items-center justify-center mb-10 border border-neutral-100">
                      <ShieldCheck className="w-14 h-14 text-emerald-500" />
                    </div>
                    <h3 className="text-3xl font-black text-neutral-900 mb-4 tracking-tight">لا توجد رسوم مستحقة</h3>
                    <p className="text-neutral-500 font-bold text-lg mb-4 max-w-sm leading-relaxed">سجلك المالي نظيف تماماً، لقد تم تسداد كافة التكاليف المطلوبة.</p>
                  </CardContent>
                </Card>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="history"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              {filteredHistory.length > 0 ? (
                <div className="bg-white border border-neutral-100 rounded-[3rem] shadow-xl shadow-black/5 overflow-hidden overflow-x-auto p-1">
                   <table className="w-full text-right border-collapse">
                      <thead className="bg-neutral-50/70 border-b border-neutral-100">
                         <tr>
                            <th className="px-10 py-8 text-[11px] font-black text-neutral-400 uppercase tracking-[0.3em]">تاريخ العملية</th>
                            <th className="px-10 py-8 text-[11px] font-black text-neutral-400 uppercase tracking-[0.3em]">البيان المالي</th>
                            <th className="px-10 py-8 text-[11px] font-black text-neutral-400 uppercase tracking-[0.3em]">القيمة المسددة</th>
                            <th className="px-10 py-8 text-[11px] font-black text-neutral-400 uppercase tracking-[0.3em]">وسيلة الدفع</th>
                            <th className="px-10 py-8 text-[11px] font-black text-neutral-400 uppercase tracking-[0.3em] text-left">الإرسالية</th>
                         </tr>
                      </thead>
                      <tbody className="divide-y divide-neutral-50">
                         {filteredHistory.map((p) => (
                            <tr key={p.id} className="group hover:bg-neutral-50 transition-all duration-500">
                               <td className="px-10 py-8">
                                  <div className="flex flex-col">
                                     <span className="text-base font-black text-neutral-900 tracking-tight tabular-nums">{new Date(p.paidAt!).toLocaleDateString('ar-YE', { day: '2-digit', month: '2-digit', year: 'numeric' })}</span>
                                     <span className="text-[10px] font-bold text-[#D4A017] uppercase tracking-widest">توقيت التحصيل</span>
                                  </div>
                               </td>
                               <td className="px-10 py-8">
                                  <div className="flex flex-col">
                                     <span className="text-base font-black text-neutral-900 tracking-tight">{p.applicationNumber}</span>
                                     <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">{feeTypeLabels[p.feeType]}</span>
                                  </div>
                               </td>
                               <td className="px-10 py-8">
                                  <div className="flex items-center gap-3">
                                     <span className="text-xl font-black text-[#1a3a8f] tabular-nums tracking-tighter">{p.amount.toLocaleString('ar-YE')}</span>
                                     <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">ريال يمني</span>
                                  </div>
                               </td>
                               <td className="px-10 py-8">
                                  <span className="inline-flex items-center px-5 py-2 rounded-xl bg-emerald-50 text-emerald-600 text-[10px] font-black border border-emerald-100 uppercase tracking-widest">
                                     {p.paymentMethod === 'Mada' ? 'مدى - MADA' : 'CREDIT CARD'}
                                  </span>
                               </td>
                               <td className="px-10 py-8 text-left">
                                  <Button variant="ghost" size="icon" className="h-14 w-14 text-neutral-300 hover:text-[#1a3a8f] hover:bg-white border border-transparent hover:border-neutral-200 rounded-[1.25rem] transition-all duration-500 shadow-none">
                                     <Download className="w-6 h-6" />
                                  </Button>
                               </td>
                            </tr>
                         ))}
                      </tbody>
                   </table>
                </div>
              ) : (
                <div className="text-center py-24 bg-neutral-50/50 rounded-[4rem] border-2 border-dashed border-neutral-100">
                   <History className="w-20 h-20 mx-auto mb-8 text-neutral-200" />
                   <p className="font-black text-neutral-400 text-xl tracking-tight">لا توجد سجلات تاريخية للعمليات المسددة</p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Trust Badge Footer */}
      <div className="flex justify-center pb-12 opacity-40 select-none">
         <div className="flex items-center gap-6 py-5 px-10 rounded-full border border-neutral-100 bg-white/50 backdrop-blur-sm shadow-sm group hover:opacity-100 transition-opacity">
            <ShieldCheck className="w-6 h-6 text-emerald-600" />
            <span className="text-[11px] font-black uppercase tracking-[0.4em] text-neutral-500">التحقق المالي الموحد - بوابة المعاملات السيادية المؤمنة TLS 1.3</span>
         </div>
      </div>
    </div>
  );
}