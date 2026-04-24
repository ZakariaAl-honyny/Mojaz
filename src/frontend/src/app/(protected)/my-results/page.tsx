'use client';

import { useState } from 'react';
import {
  Award,
  CheckCircle2,
  XCircle,
  Download,
  Target,
  Car,
  Clock,
  Calendar,
  FileText,
  RefreshCw,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  AlertTriangle,
  Zap,
  Info,
  Medal,
  Dna
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

// Mock test results data
const mockTestResults = {
  theory: [
    {
      id: '1',
      attemptNumber: 1,
      date: '2025-03-10',
      score: 82,
      passingScore: 70,
      passed: true,
      certificateAvailable: true
    }
  ],
  practical: [
    {
      id: 'p1',
      attemptNumber: 1,
      date: null,
      score: null,
      passingScore: 70,
      passed: false,
      pending: true,
      scheduledDate: '2025-04-15'
    }
  ]
};

const ResultCard = ({
  type,
  results
}: {
  type: 'theory' | 'practical';
  results: any[];
}) => {
  const hasPassed = results.some(r => r.passed);
  const attemptCount = results.length;

  return (
    <Card className="border border-neutral-200 shadow-sm rounded-[2.5rem] overflow-hidden bg-white">
      <CardHeader className="p-8 pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-5">
            <div className={cn(
              "w-14 h-14 rounded-2xl flex items-center justify-center border shadow-sm",
              type === 'theory' ? "bg-orange-50 border-orange-100 text-orange-600" : "bg-blue-50 border-blue-100 text-[#1a3a8f]"
            )}>
              {type === 'theory' ? (
                <Target className="w-7 h-7" />
              ) : (
                <Car className="w-7 h-7" />
              )}
            </div>
            <div>
              <CardTitle className="text-xl font-black text-neutral-900 tracking-tight">
                {type === 'theory' ? "المعارف النظرية" : "القدرة الميدانية"}
              </CardTitle>
              <p className="text-[10px] text-neutral-400 font-black uppercase tracking-widest mt-1">
                 إجمالي المحاولات: {attemptCount}
              </p>
            </div>
          </div>

          {hasPassed && (
            <div className="flex items-center gap-2 bg-emerald-50 text-emerald-600 px-4 py-1.5 rounded-xl border border-emerald-100 text-[10px] font-black uppercase tracking-widest">
              <CheckCircle2 className="w-3.5 h-3.5" />
              تم الاجتياز بنجاح
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="p-8 pt-0 space-y-6">
        <div className="space-y-4">
          {results.map((result) => (
            <div
              key={result.id}
              className={cn(
                "p-6 rounded-2xl border transition-all duration-300",
                result.passed
                  ? "bg-emerald-50/50 border-emerald-100/50"
                  : result.pending
                    ? "bg-neutral-50/50 border-neutral-100"
                    : "bg-rose-50/50 border-rose-100/50"
              )}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-black text-neutral-900 bg-white px-3 py-1 rounded-lg border border-neutral-100 shadow-sm">
                    المحاولة رقم {result.attemptNumber}
                  </span>
                  {result.passed && (
                    <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center">
                       <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                    </div>
                  )}
                </div>
                <span className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">
                  {result.date ? new Date(result.date).toLocaleDateString('ar-YE') : 'قيد الانتظار'}
                </span>
              </div>

              {result.score !== null && (
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-bold text-neutral-500">الدرجة المحققة</span>
                  <div className="flex items-end gap-2">
<span className="text-2xl md:text-3xl font-black tracking-tighter tabular-nums leading-none">
                        {result.score}
                      </span>
                     <span className="text-xs font-bold text-neutral-400 mb-1">/ 100</span>
                  </div>
                </div>
              )}

              {result.pending && (
                <div className="bg-white/50 border border-neutral-200/50 p-4 rounded-xl flex items-center gap-4">
                  <Clock className="w-5 h-5 text-[#1a3a8f]" />
                  <div>
                     <p className="text-[10px] font-black text-neutral-400 uppercase tracking-widest leading-none mb-1">موعد الاختبار القادم</p>
                     <p className="text-sm font-black text-[#1a3a8f] tracking-tight leading-none">
                        {new Date(result.scheduledDate).toLocaleDateString('ar-YE', { day: '2-digit', month: 'long', year: 'numeric' })}
                     </p>
                  </div>
                </div>
              )}

              {result.certificateAvailable && result.passed && (
                <Button
                  className="w-full mt-4 h-12 bg-[#1a3a8f] hover:bg-[#152d6f] text-white rounded-xl font-black text-xs uppercase tracking-widest shadow-xl shadow-blue-900/10 gap-3"
                >
                  <Download className="w-4 h-4" />
                  تحميل وثيقة النجاح المعتمدة
                </Button>
              )}
            </div>
          ))}
        </div>

        {!hasPassed && attemptCount > 0 && !results.some(r => r.pending) && (
          <div className="mt-8 p-6 bg-[#D4A017]/5 rounded-2xl border border-[#D4A017]/10 flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-[#D4A017]/10 flex items-center justify-center shrink-0 border border-[#D4A017]/20">
               <RefreshCw className="w-5 h-5 text-[#D4A017]" />
            </div>
            <div>
               <h4 className="text-sm font-black text-[#D4A017] mb-1">مؤهل لإعادة المحاولة</h4>
               <p className="text-xs font-bold text-[#D4A017]/60 leading-relaxed mb-4">
                 لديك فرصة أخرى لإعادة الاختبار. يرجى مراجعة المنهج جيداً قبل حجز الموعد القادم.
               </p>
               <Button size="sm" className="bg-[#D4A017] hover:bg-[#b88a14] text-white rounded-lg font-black text-[10px] px-6">
                  حجز موعد إدراك جديد
               </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default function MyResultsPage() {
  const [results] = useState(mockTestResults);

  const theoryPassed = results.theory.some(r => r.passed);
  const practicalPassed = results.practical.some(r => r.passed);

  return (
    <div className="space-y-10 font-arabic pb-12" dir="rtl">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-end md:justify-between gap-8 px-4">
         <div className="flex items-center gap-6">
            <div className="w-1.5 h-16 bg-[#1a3a8f] rounded-full shadow-lg shadow-blue-900/20" />
            <div>
              <h1 className="text-2xl md:text-3xl font-black text-neutral-900 tracking-tight leading-none mb-3">
                سجل النتائج والأداء
              </h1>
              <p className="text-neutral-500 font-bold text-sm max-w-xl leading-relaxed">
                مركز تتبع نتائجك المعتمدة من الإدارة العامة للمرور - وزارة الداخلية.
              </p>
            </div>
         </div>
      </header>

      {/* Aggregate Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 px-4">
        {[
          { 
            label: 'مكانة المتقدم في النظري', 
            status: theoryPassed ? 'مجتاز بامتياز' : 'قيد التقييم', 
            icon: Target, 
            passed: theoryPassed, 
            gradient: 'from-[#1a3a8f] to-[#152d6f]',
            secondary: 'text-blue-200'
          },
          { 
            label: 'مكانة المتقدم في الميداني', 
            status: practicalPassed ? 'مجتاز بامتياز' : 'تحت الاختبار', 
            icon: Car, 
            passed: practicalPassed, 
            gradient: practicalPassed ? 'from-emerald-600 to-emerald-700' : 'from-neutral-800 to-neutral-900',
            secondary: practicalPassed ? 'text-emerald-100' : 'text-neutral-400'
          }
        ].map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: i === 0 ? 20 : -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 * i }}
          >
            <Card className={cn(
              "border-none shadow-2xl rounded-[2.5rem] overflow-hidden relative group h-48",
              `bg-gradient-to-br ${stat.gradient} text-white`
            )}>
              <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                 <Dna className="w-64 h-64 -translate-x-12 translate-y-12" />
              </div>
              <CardContent className="p-10 flex h-full items-center justify-between relative z-10">
                <div className="flex items-center gap-8">
                  <div className="w-20 h-20 bg-white/10 backdrop-blur-md rounded-3xl flex items-center justify-center border border-white/20 transform group-hover:rotate-12 transition-transform">
                    <stat.icon className="w-10 h-10 text-white" />
                  </div>
                  <div className="space-y-1">
                    <p className={cn("text-xs font-black uppercase tracking-widest", stat.secondary)}>{stat.label}</p>
                    <p className="text-4xl font-black tracking-tight leading-none">
                      {stat.status}
                    </p>
                  </div>
                </div>
                {stat.passed && (
                  <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center animate-pulse">
                     <Medal className="w-8 h-8 text-white" />
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Detailed Result Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 px-4">
        <ResultCard type="theory" results={results.theory} />
        <ResultCard type="practical" results={results.practical} />
      </div>

      {/* Official Credentials Archive */}
      <AnimatePresence>
        {(theoryPassed || practicalPassed) && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="px-4"
          >
            <Card className="border border-[#1a3a8f]/10 shadow-xl rounded-[2.5rem] overflow-hidden bg-[#1a3a8f]/5">
              <CardHeader className="p-8 pb-4">
                <CardTitle className="text-2xl font-black text-neutral-900 flex items-center gap-4">
                  <Medal className="w-8 h-8 text-[#D4A017]" />
                  أرشيف الوثائق المؤمنة
                </CardTitle>
                <p className="text-xs font-bold text-neutral-500 mt-1">تتوفر هنا نسخ رقمية رسمية من جميع شهادات الاجتياز المعتمدة.</p>
              </CardHeader>
              <CardContent className="p-8 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {theoryPassed && (
                    <div className="p-6 bg-white rounded-2xl border border-neutral-100 flex items-center justify-between group hover:border-[#1a3a8f]/50 transition-all shadow-sm">
                      <div className="flex items-center gap-5">
                        <div className="w-14 h-14 bg-orange-50 rounded-2xl flex items-center justify-center border border-orange-100 text-orange-500">
                          <Target className="w-7 h-7" />
                        </div>
                        <div>
                          <p className="font-black text-neutral-900 tracking-tight">شهادة الكفاءة المعرفية</p>
                          <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-widest mt-1">رمز التحقق: <span className="text-[#1a3a8f]">AUTH-982</span></p>
                        </div>
                      </div>
                      <Button variant="ghost" size="icon" className="h-12 w-12 text-neutral-400 group-hover:text-[#1a3a8f] group-hover:bg-[#1a3a8f]/5 rounded-xl border border-transparent group-hover:border-[#1a3a8f]/10">
                        <Download className="w-6 h-6" />
                      </Button>
                    </div>
                  )}

                  {practicalPassed && (
                    <div className="p-6 bg-white rounded-2xl border border-neutral-100 flex items-center justify-between group hover:border-emerald-500/50 transition-all shadow-sm">
                      <div className="flex items-center gap-5">
                        <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center border border-emerald-100 text-emerald-600">
                          <Medal className="w-7 h-7" />
                        </div>
                        <div>
                          <p className="font-black text-neutral-900 tracking-tight">وثيقة المهارة الميدانية</p>
                          <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-widest mt-1">رمز التحقق: <span className="text-emerald-600">CERT-412</span></p>
                        </div>
                      </div>
                      <Button variant="ghost" size="icon" className="h-12 w-12 text-neutral-400 group-hover:text-emerald-600 group-hover:bg-emerald-50 rounded-xl border border-transparent group-hover:border-emerald-100">
                        <Download className="w-6 h-6" />
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex justify-center pt-8 opacity-30 select-none">
         <div className="flex items-center gap-4 py-3 px-6 rounded-full border border-neutral-200">
            <ShieldCheck className="w-4 h-4" />
            <span className="text-[10px] font-black uppercase tracking-[0.25em]">مركز المعلومات الوطني - نظام التحقق المركزي</span>
         </div>
      </div>
    </div>
  );
}