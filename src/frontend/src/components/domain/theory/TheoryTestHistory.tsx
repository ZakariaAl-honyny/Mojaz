'use client';

import { useQuery } from '@tanstack/react-query';
import theoryService from '@/services/theory.service';
import { TheoryTestDto } from '@/types/theory.types';
import { cn } from '@/lib/utils';
import { History, Calendar, CheckCircle2, XCircle, User, AlertCircle, Bookmark } from 'lucide-react';
import { motion } from 'framer-motion';

interface TheoryTestHistoryProps {
  applicationId: number;
}

export function TheoryTestHistory({ applicationId }: TheoryTestHistoryProps) {
  const { data, isLoading } = useQuery({
    queryKey: ['theory-history', applicationId],
    queryFn: () => theoryService.getHistory(String(applicationId)),
  });

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl md:rounded-2xl p-6 md:p-10 font-arabic animate-pulse" dir="rtl">
        <div className="h-8 w-48 bg-neutral-100 rounded-full mb-6 md:mb-8" />
        <div className="space-y-4 md:space-y-6">
          <div className="h-24 md:h-32 w-full bg-neutral-50 rounded-xl md:rounded-2xl" />
          <div className="h-24 md:h-32 w-full bg-neutral-50 rounded-xl md:rounded-2xl" />
        </div>
      </div>
    );
  }

  const attempts = data?.data?.items || [];

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    try {
      return new Date(dateStr).toLocaleDateString('ar-YE', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="bg-white rounded-xl md:rounded-2xl border border-neutral-200 shadow-sm overflow-hidden font-arabic" dir="rtl">
      <div className="p-4 md:p-6 border-b border-neutral-100 bg-neutral-50/30">
        <div className="flex items-center gap-3 md:gap-4">
           <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-blue-50 flex items-center justify-center text-[#1a3a8f]">
              <History className="w-5 h-5 md:w-6 md:h-6" />
           </div>
           <div>
              <h3 className="text-lg md:text-xl font-black text-neutral-900">سجل الاختبار النظري</h3>
              <p className="text-[10px] md:text-xs font-bold text-neutral-400 mt-0.5">تاريخ جميع محاولات الاختبار النظري والنتائج</p>
           </div>
        </div>
      </div>

      <div className="p-4 md:p-6">
        {attempts.length === 0 ? (
          <div className="text-center py-12 md:py-24">
            <div className="w-16 h-16 md:w-24 md:h-24 rounded-full bg-neutral-50 flex items-center justify-center mx-auto mb-4 md:mb-6">
              <Bookmark className="w-8 h-8 md:w-10 md:h-10 text-neutral-200" />
            </div>
            <p className="text-sm md:text-base text-neutral-400 font-bold">لا توجد محاولات اختبار مسجلة بعد</p>
          </div>
        ) : (
          <div className="relative space-y-8 md:space-y-12 before:absolute before:inset-0 before:start-[23px] before:w-0.5 before:bg-neutral-100 before:h-full">
            {attempts.map((attempt: TheoryTestDto, index) => (
              <motion.div 
                key={attempt.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="relative ps-16"
              >
                {/* Timeline dot */}
                <div className={cn(
                  "absolute start-0 top-0 w-10 h-10 md:w-12 md:h-12 rounded-lg md:rounded-xl shadow-lg border-4 border-white flex items-center justify-center z-10 transition-all duration-500",
                  attempt.result === 'Pass' ? "bg-emerald-500 text-white shadow-emerald-500/20" : "bg-red-500 text-white shadow-red-500/20"
                )}>
                  {attempt.result === 'Pass' ? (
                    <CheckCircle2 className="w-5 h-5 md:w-6 md:h-6 stroke-[3px]" />
                  ) : (
                    <XCircle className="w-5 h-5 md:w-6 md:h-6 stroke-[3px]" />
                  )}
                </div>

                <div className={cn(
                  "rounded-xl md:rounded-2xl p-4 md:p-6 border transition-all duration-500 group",
                  attempt.result === 'Pass' 
                    ? "bg-emerald-50/30 border-emerald-100/50 hover:bg-emerald-50" 
                    : "bg-neutral-50 border-neutral-100 hover:bg-white hover:shadow-lg hover:shadow-blue-900/5 hover:border-blue-100"
                )}>
                  <div className="flex flex-wrap justify-between items-start gap-4 mb-6 md:mb-8">
                    <div>
                      <h4 className="text-base md:text-lg font-black text-neutral-900 tracking-tight">
                        المحاولة رقم {attempt.attemptNumber}
                      </h4>
                      <div className="flex items-center gap-2 text-[10px] md:text-xs font-bold text-neutral-400 mt-1 md:mt-2">
                        <Calendar className="w-3.5 h-3.5 md:w-4 md:h-4" />
                        {formatDate(attempt.conductedAt)}
                      </div>
                    </div>
                    <div className={cn(
                      "px-4 md:px-6 py-1.5 md:py-2 rounded-full text-[9px] md:text-[10px] font-black uppercase tracking-widest",
                      attempt.result === 'Pass' ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/20" : "bg-red-500 text-white shadow-lg shadow-red-500/20"
                    )}>
                      {attempt.isAbsent ? 'غائب' : (attempt.result === 'Pass' ? 'ناجح' : 'راسب')}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 pt-4 md:pt-6 border-t border-dashed border-neutral-200">
                    <div className="space-y-1">
                      <span className="text-[9px] md:text-[10px] font-black text-neutral-400 uppercase tracking-widest block mb-0.5 md:mb-1">الدرجة النهائية</span>
                      <span className="text-2xl md:text-3xl font-black text-[#1a3a8f]">
                        {attempt.isAbsent ? '--' : `${attempt.score} من ${attempt.passingScore}`}
                      </span>
                    </div>
                    <div className="space-y-1">
                      <span className="text-[9px] md:text-[10px] font-black text-neutral-400 uppercase tracking-widest block mb-0.5 md:mb-1 flex items-center gap-2">
                        <User className="w-3 md:w-3.5 h-3 md:h-3.5" />
                        الفاحص المسؤول
                      </span>
                      <span className="text-base md:text-lg font-black text-neutral-700">
                        {attempt.examinerName || '--'}
                      </span>
                    </div>
                  </div>

                  {attempt.notes && (
                    <div className="mt-4 md:mt-6 p-4 md:p-5 bg-white/50 rounded-xl italic text-neutral-500 text-xs md:text-sm font-medium border border-white">
                      "{attempt.notes}"
                    </div>
                  )}

                  {(attempt.result === 'Fail' || attempt.result === 'Absent') && attempt.retakeEligibleAfter && (
                    <div className="mt-4 md:mt-6 p-3 md:p-4 bg-amber-50 rounded-xl text-amber-700 text-[10px] md:text-xs font-black flex items-center gap-2 md:gap-3 border border-amber-100 shadow-sm">
                      <div className="w-8 h-8 rounded-xl bg-white flex items-center justify-center text-amber-500">
                        <AlertCircle className="w-4 h-4" />
                      </div>
                      مؤهل لإعادة الاختبار بتاريخ: {formatDate(attempt.retakeEligibleAfter)}
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default TheoryTestHistory;