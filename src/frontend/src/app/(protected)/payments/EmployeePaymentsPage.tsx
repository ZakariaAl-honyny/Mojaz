'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { StatusBadge } from '@/components/shared/status-badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { PaymentDto, PaymentStatus } from '@/types/payment.types';
import { paymentService } from '@/services/payment.service';
import { cn } from '@/lib/utils';
import { 
  CreditCard, 
  Search,
  Download,
  Filter,
  Eye,
  RefreshCcw,
  AlertCircle,
  TrendingUp,
  Wallet,
  Calendar,
  ShieldCheck,
  MoreVertical,
  Activity,
  ArrowUpRight,
  TrendingDown,
  ChevronRight,
  ChevronLeft
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export default function EmployeePaymentsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<PaymentStatus | ''>('');
  const [selectedPayment, setSelectedPayment] = useState<PaymentDto | null>(null);
  const [showRefundDialog, setShowRefundDialog] = useState(false);
  const [page, setPage] = useState(1);

  // Fetch all payments from API
  const { data: paymentsData, isLoading, refetch } = useQuery({
    queryKey: ['allPayments', page, statusFilter, searchQuery],
    queryFn: () => paymentService.getAllPayments(page, 20, statusFilter || undefined, searchQuery || undefined),
    staleTime: 30000,
  });

  const payments = paymentsData?.data?.items ?? [];
  const totalCount = paymentsData?.data?.totalCount ?? 0;
  const totalPages = paymentsData?.data?.totalPages ?? 0;

  // Filter payments (for client-side filtering if needed)
  const filteredPayments = payments.filter((payment) => {
    const matchesSearch = 
      payment.applicationNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payment.applicantFullName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = !statusFilter || payment.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Calculate stats
  const totalAmount = payments.filter(p => p.status === 'Paid').reduce((sum, p) => sum + p.amount, 0);
  const pendingAmount = payments.filter(p => p.status === 'Pending').reduce((sum, p) => sum + p.amount, 0);

  return (
    <div className="space-y-10 font-arabic" dir="rtl">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-end md:justify-between gap-8 px-4">
         <div className="flex items-center gap-6">
            <div className="w-1.5 h-16 bg-[#1a3a8f] rounded-full shadow-lg shadow-blue-900/20" />
            <div>
              <h1 className="text-4xl lg:text-5xl font-black text-neutral-900 tracking-tight leading-none mb-3">
                الرقابة المالية المؤسسية
              </h1>
              <p className="text-neutral-500 font-bold text-sm max-w-xl leading-relaxed">
                متابعة التدفقات النقدية وتحصيل الرسوم السيادية المرتبطة بخدمات التراخيص.
              </p>
            </div>
         </div>
<Button onClick={() => {}} className="h-10 md:h-12 px-6 md:px-8 rounded-md bg-white border border-neutral-200 text-[#1a3a8f] hover:bg-neutral-50 text-sm md:text-base font-black transition-all gap-3">
             <Download className="w-4 h-4 md:w-5 md:h-5" />
             تصدير التقرير المالي
           </Button>
      </header>

{/* KPI Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 px-4">
          {[
            { label: 'إجمالي التحصيل', value: totalAmount.toLocaleString('ar-YE') + ' ريال', icon: TrendingUp, color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100' },
            { label: 'مستحقات معلقة', value: pendingAmount.toLocaleString('ar-YE') + ' ريال', icon: Wallet, color: 'text-[#D4A017]', bg: 'bg-[#D4A017]/5', border: 'border-[#D4A017]/10' },
            { label: 'عمليات ناجحة', value: payments.filter(p => p.status === 'Paid').length, icon: ShieldCheck, color: 'text-[#1a3a8f]', bg: 'bg-[#1a3a8f]/5', border: 'border-[#1a3a8f]/10' },
            { label: 'طلبات متأخرة', value: payments.filter(p => p.status === 'Overdue').length, icon: AlertCircle, color: 'text-rose-600', bg: 'bg-rose-50', border: 'border-rose-100' },
          ].map((stat, i) => (
           <Card key={i} className={cn("border shadow-sm rounded-3xl overflow-hidden bg-white p-6", stat.border)}>
              <div className="flex items-center justify-between mb-4">
                 <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center", stat.bg)}>
                    <stat.icon className={cn("w-6 h-6", stat.color)} />
                 </div>
                 <div className="w-8 h-8 rounded-full bg-neutral-50 flex items-center justify-center border border-neutral-100">
                    <ArrowUpRight className="w-4 h-4 text-neutral-300" />
                 </div>
              </div>
              <div>
                 <p className="text-[10px] font-black text-neutral-400 uppercase tracking-widest mb-1">{stat.label}</p>
                 <p className={cn("text-2xl font-black tracking-tighter tabular-nums", stat.color)}>{stat.value}</p>
              </div>
           </Card>
         ))}
      </div>

      {/* Toolbar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 bg-white border border-neutral-200 p-8 rounded-[2.5rem] shadow-sm mx-4">
        <div className="relative w-full lg:w-[420px] group">
          <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 group-focus-within:text-[#1a3a8f] transition-colors" />
          <Input
            placeholder="البحث في العمليات (رقم الطلب، اسم المستفيد)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pr-12 h-12 border-neutral-100 bg-neutral-50/50 focus:bg-white focus:ring-4 focus:ring-blue-100 transition-all rounded-xl font-bold text-sm text-right"
          />
        </div>
        
        <div className="flex items-center gap-3">
           <div className="flex items-center gap-2 bg-neutral-50 px-4 py-1.5 rounded-xl border border-neutral-200">
              <Filter className="w-4 h-4 text-neutral-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as PaymentStatus | '')}
                className="bg-transparent border-none text-xs font-black text-[#1a3a8f] focus:ring-0 cursor-pointer"
              >
                <option value="">جميع العمليات</option>
                <option value="Paid">تم التحصيل</option>
                <option value="Pending">قيد المراجعة</option>
                <option value="Overdue">متأخرات</option>
                <option value="Failed">عمليات فاشلة</option>
              </select>
           </div>
<Button variant="ghost" size="icon" onClick={() => refetch()} className="h-12 w-12 rounded-xl border border-neutral-200 hover:bg-neutral-50 transition-all shadow-sm">
              <RefreshCcw className="w-4 h-4 text-neutral-400" />
            </Button>
        </div>
      </div>

      {/* Main Table Grid */}
      <div className="relative mx-4">
        <Card className="border border-neutral-200 shadow-sm rounded-[2.5rem] overflow-hidden bg-white">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-right border-collapse">
                <thead>
                  <tr className="bg-neutral-50/50">
                    <th className="px-8 py-6 text-[10px] font-black text-neutral-400 uppercase tracking-[0.25em] border-b border-neutral-100">رقم المعاملة</th>
                    <th className="px-8 py-6 text-[10px] font-black text-neutral-400 uppercase tracking-[0.25em] border-b border-neutral-100">المستفيد</th>
                    <th className="px-8 py-6 text-[10px] font-black text-neutral-400 uppercase tracking-[0.25em] border-b border-neutral-100">نوع الرسم</th>
                    <th className="px-8 py-6 text-[10px] font-black text-neutral-400 uppercase tracking-[0.25em] border-b border-neutral-100">القيمة</th>
                    <th className="px-8 py-6 text-[10px] font-black text-neutral-400 uppercase tracking-[0.25em] border-b border-neutral-100">الحالة</th>
                    <th className="px-8 py-6 text-[10px] font-black text-neutral-400 uppercase tracking-[0.25em] border-b border-neutral-100 text-left">الإجراء</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {filteredPayments.map((p, index) => (
                    <motion.tr
                      key={p.id}
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="group hover:bg-neutral-50/30 transition-all cursor-pointer"
                    >
                      <td className="px-8 py-6 font-black text-xs text-[#1a3a8f] tracking-tight">{p.applicationNumber}</td>
                      <td className="px-8 py-6">
                         <p className="font-black text-neutral-900 text-sm">{p.applicantFullName}</p>
                         <p className="text-[10px] text-neutral-400 font-bold">بموجب الطلب الإلكتروني</p>
                      </td>
                      <td className="px-8 py-6 text-xs font-bold text-neutral-500">
                        {p.feeType === 'ApplicationFee' ? "فتح الملف" : "الفحص الطبي"}
                      </td>
                      <td className="px-8 py-6">
                        <p className="font-black text-neutral-900 text-sm tabular-nums">{p.amount.toLocaleString('ar-YE')} <span className="text-[10px] text-neutral-400">ريال</span></p>
                      </td>
                      <td className="px-8 py-6">
                        <StatusBadge status={p.status as any} />
                      </td>
                      <td className="px-8 py-6 text-left">
                        <div className="flex justify-end gap-2 text-left">
                           <Button variant="ghost" size="icon" className="h-10 w-10 text-neutral-400 hover:text-[#1a3a8f] hover:bg-white border border-transparent hover:border-neutral-200 rounded-xl transition-all shadow-none">
                              <Eye className="w-5 h-5" />
                           </Button>
                           {p.status === 'Paid' && (
                              <Button variant="ghost" size="icon" onClick={() => { setSelectedPayment(p); setShowRefundDialog(true); }} className="h-10 w-10 text-neutral-400 hover:text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-100 rounded-xl transition-all shadow-none">
                                 <TrendingDown className="w-5 h-5" />
                              </Button>
                           )}
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="p-8 flex items-center justify-between border-t border-neutral-100 bg-neutral-50/30">
              <div className="text-[10px] font-black text-neutral-400 uppercase tracking-[0.2em] flex items-center gap-3">
                عرض <span className="text-[#1a3a8f]">{filteredPayments.length}</span> من أصل <span className="text-neutral-900">{totalCount}</span> سجلات مالية
              </div>
              <div className="flex items-center gap-3">
                <Button 
                  variant="outline" 
                  className="h-10 w-10 rounded-xl border-neutral-200 bg-white shadow-sm disabled:opacity-30"
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page <= 1}
                >
                  <ChevronRight className="h-4 h-4 rtl:rotate-180" />
                </Button>
                <span className="text-sm font-black text-neutral-500 px-3">
                  {page} / {totalPages}
                </span>
                <Button 
                  variant="outline" 
                  className="h-10 w-10 rounded-xl border-neutral-200 bg-white shadow-sm disabled:opacity-30"
                  onClick={() => setPage(p => p + 1)}
                  disabled={page >= totalPages}
                >
                  <ChevronLeft className="h-4 h-4 rtl:rotate-180" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-center pb-10 opacity-30 select-none">
         <div className="flex items-center gap-4 py-3 px-6 rounded-full border border-neutral-200">
            <ShieldCheck className="w-4 h-4" />
            <span className="text-[10px] font-black uppercase tracking-[0.25em]">مركز الرقابة والامتثال المالي - نظام سيادي آمن</span>
         </div>
      </div>

      {/* Refund Dialog */}
      <Dialog open={showRefundDialog} onOpenChange={setShowRefundDialog}>
        <DialogContent className="max-w-md rounded-[2.5rem] border-none shadow-2xl p-10 font-arabic" dir="rtl">
          <DialogHeader className="text-right">
             <div className="w-16 h-16 rounded-2xl bg-rose-50 flex items-center justify-center mb-6 border border-rose-100">
                <AlertCircle className="w-8 h-8 text-rose-600" />
             </div>
            <DialogTitle className="text-2xl font-black text-neutral-900 tracking-tight">إجراء استرجاع مالي</DialogTitle>
            <DialogDescription className="text-neutral-500 font-bold text-sm leading-relaxed mt-2">
              أنت على وشك البدء في عملية استرجاع الرسوم المالية للمستفيد. هذه العملية سيادية وسيتم تسجيلها في سجلات الرقابة المالية.
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-6">
             <div className="p-6 bg-neutral-50 rounded-2xl border border-neutral-100 border-dashed">
                <p className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">القيمة المستردة</p>
                <p className="text-3xl font-black text-[#1a3a8f] tracking-tighter tabular-nums mt-1">
                   {selectedPayment?.amount.toLocaleString('ar-YE')} <span className="text-sm font-bold text-neutral-400">ريال</span>
                </p>
             </div>
          </div>

          <DialogFooter className="flex-row-reverse gap-3 mt-4">
            <Button variant="ghost" onClick={() => setShowRefundDialog(false)} className="flex-1 h-10 md:h-11 rounded-md font-black text-neutral-500">إلغاء الإجراء</Button>
            <Button variant="destructive" onClick={() => setShowRefundDialog(false)} className="flex-1 h-10 md:h-11 rounded-md bg-rose-600 hover:bg-rose-700 font-black text-sm md:text-base">تأكيد الاسترجاع</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}