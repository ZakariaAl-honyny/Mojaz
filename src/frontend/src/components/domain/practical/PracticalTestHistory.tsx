'use client';

import { useQuery } from '@tanstack/react-query';
import { practicalService } from '@/services/practical.service';
import { TestResult } from '@/lib/enums';
import { TestAttemptBadge } from './TestAttemptBadge';
import { Calendar, User, FileText, CheckCircle2, AlertCircle, History, Car } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface PracticalTestHistoryProps {
  applicationId: string;
}

export function PracticalTestHistory({ applicationId }: PracticalTestHistoryProps) {
  const { data, isLoading, error } = useQuery({
    queryKey: ['practicalHistory', applicationId],
    queryFn: () => practicalService.getHistory(applicationId),
  });

  if (isLoading) {
    return (
      <div className="space-y-6 font-arabic animate-pulse" dir="rtl">
        <div className="h-40 w-full bg-neutral-50 rounded-[2rem]" />
        <div className="h-40 w-full bg-neutral-50 rounded-[2rem]" />
      </div>
    );
  }

  const attempts = data?.data?.items || [];

  const formatDateAr = (dateStr: string) => {
    if (!dateStr) return '';
    try {
      return new Date(dateStr).toLocaleDateString('ar-YE', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  if (error || attempts.length === 0) {
    return (
      <div className="bg-neutral-50 rounded-[2.5rem] border-2 border-dashed border-neutral-200 p-16 text-center font-arabic" dir="rtl">
        <History className="w-16 h-16 mx-auto mb-6 text-neutral-200" />
        <p className="text-lg font-black text-neutral-400">لا يوجد سجل محاولات اختبار عملي حالياً</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 font-arabic" dir="rtl">
      <div className="flex items-center gap-4 mb-2">
         <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-[#1a3a8f]">
            <History className="w-6 h-6" />
         </div>
         <div>
            <h3 className="text-2xl font-black text-neutral-900">سجل الاختبار العملي</h3>
            <p className="text-xs font-bold text-neutral-400 mt-0.5">تتبع نتائج القيادة الميدانية والملاحظات الفنية</p>
         </div>
      </div>

      <div className="relative space-y-10 before:absolute before:inset-0 before:start-[27px] before:w-0.5 before:bg-neutral-100 before:h-full pb-4">
        {attempts.map((test, index) => (
          <motion.div 
            key={test.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="relative ps-20"
          >
            {/* Timeline dot */}
            <div className={cn(
              "absolute start-0 top-0 w-14 h-14 rounded-2xl shadow-xl border-4 border-white flex items-center justify-center z-10 transition-all duration-500",
              test.result === TestResult.Pass ? "bg-emerald-500 text-white shadow-emerald-500/20" : "bg-red-500 text-white shadow-red-500/20"
            )}>
              <Car className="w-6 h-6" />
            </div>

            <div className={cn(
              "rounded-[2.5rem] p-10 border transition-all duration-500 hover:shadow-2xl hover:shadow-blue-900/5",
              test.result === TestResult.Pass 
                ? "bg-emerald-50/20 border-emerald-100/30" 
                : "bg-white border-neutral-100"
            )}>
              <div className="flex flex-wrap justify-between items-start gap-6 mb-10">
                <div>
                  <h4 className="text-xl font-black text-neutral-900 tracking-tight">المحاولة رقم {test.attemptNumber}</h4>
                  <div className="flex items-center gap-2 text-xs font-bold text-neutral-400 mt-2">
                    <Calendar className="w-4 h-4" />
                    {formatDateAr(test.conductedAt)}
                  </div>
                </div>
                <TestAttemptBadge result={test.result} />
              </div>

              {test.isAbsent ? (
                <div className="flex items-start gap-4 p-6 bg-amber-50 rounded-[1.5rem] border border-amber-100 shadow-sm shadow-amber-500/5 transition-all">
                  <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-amber-500 shadow-sm">
                    <AlertCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-black text-amber-900 text-lg">لم يتم الحضور</p>
                    <p className="text-amber-700/70 text-xs font-bold mt-1 tracking-tight">تم تسجيل المتدرب كغائب في هذا الموعد المحدد. يرجى مراجعة الإدارة.</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-10">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
                    <div className="space-y-1">
                      <span className="text-[10px] font-black text-neutral-400 uppercase tracking-widest block mb-2">النتيجة والدرجة</span>
                      <span className="text-3xl font-black text-[#1a3a8f]">{test.score} من {test.passingScore}</span>
                    </div>
                    {test.vehicleUsed && (
                      <div className="space-y-1">
                        <span className="text-[10px] font-black text-neutral-400 uppercase tracking-widest block mb-2">المركبة المستخدمة</span>
                        <div className="flex items-center gap-3">
                           <div className="w-8 h-8 rounded-lg bg-neutral-100 flex items-center justify-center text-neutral-400">
                              <Car className="w-4 h-4" />
                           </div>
                           <span className="text-lg font-black text-neutral-700">{test.vehicleUsed}</span>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="pt-8 border-t border-dashed border-neutral-200">
                    <div className="flex items-center gap-3 mb-6 font-black text-neutral-900">
                      <User className="w-4 h-4 text-[#1a3a8f]" />
                      <span>الفاحص الميداني: {test.examinerName || '--'}</span>
                    </div>

                    {test.notes && (
                      <div className="p-8 bg-neutral-50 rounded-[1.5rem] border border-neutral-100/50 relative overflow-hidden group/notes">
                        <div className="absolute top-0 start-0 w-1 h-full bg-blue-100" />
                        <span className="text-[10px] font-black text-neutral-300 uppercase tracking-widest block mb-3 flex items-center gap-2">
                           <FileText className="w-3.5 h-3.5" />
                           ملاحظات الفحص الفنية
                        </span>
                        <div className="text-neutral-600 font-bold leading-relaxed">
                          {test.notes}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
