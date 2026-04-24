'use client';

import { useState } from 'react';
import { 
  TrendingUp, 
  Activity, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  BookOpen,
  Car,
  GraduationCap,
  Award,
  Download,
  ChevronRight,
  ShieldCheck,
  Zap,
  Target,
  Medal,
  Dna
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

// Mock data for progress tracking
const mockProgress = {
  overall: 65,
  medical: {
    status: 'passed',
    date: '2025-02-15',
    passed: true
  },
  theoryTraining: {
    hoursCompleted: 18,
    hoursRequired: 20,
    completed: true
  },
  theoryTest: {
    attempts: 1,
    maxAttempts: 3,
    score: 82,
    date: '2025-03-10',
    passed: true
  },
  practicalTraining: {
    hoursCompleted: 12,
    hoursRequired: 30,
    completed: false,
    instructor: 'أحمد عبدالله العامري',
    center: 'مركز التدريب والتعليم المروري - صنعاء'
  },
  practicalTest: {
    attempts: 0,
    maxAttempts: 3,
    score: null,
    passed: false,
    date: null,
    pending: true
  }
};

const CustomProgressBar = ({ value, color = "#1a3a8f" }: { value: number; color?: string }) => (
  <div className="w-full h-2 bg-neutral-100 rounded-full overflow-hidden shadow-inner">
    <motion.div 
      initial={{ width: 0 }}
      animate={{ width: `${value}%` }}
      transition={{ delay: 0.5, duration: 1.5, ease: "circOut" }}
      className="h-full rounded-full shadow-[0_0_8px_rgba(26,58,143,0.3)]"
      style={{ backgroundColor: color }}
    />
  </div>
);

const ProgressStage = ({ 
  title, 
  status, 
  icon: Icon, 
  children,
  colorClass = "text-[#1a3a8f]",
  bgClass = "bg-[#1a3a8f]/5"
}: { 
  title: string; 
  status: string;
  icon: any;
  children: React.ReactNode;
  colorClass?: string;
  bgClass?: string;
}) => (
  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
    <Card className="border border-neutral-200 shadow-sm rounded-[2.5rem] overflow-hidden bg-white hover:shadow-xl transition-all duration-500 group h-full">
      <CardHeader className="p-8 pb-4">
        <div className="flex items-center justify-between">
          <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center border shadow-sm group-hover:scale-105 transition-transform", bgClass)}>
            <Icon className={cn("w-7 h-7", colorClass)} />
          </div>
          <div className="flex items-center gap-2 bg-neutral-50 px-3 py-1 rounded-xl border border-neutral-100 text-[10px] font-black uppercase tracking-widest text-neutral-500">
             {status}
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-8 pt-2 space-y-6">
        <h3 className="text-xl font-black text-neutral-900 tracking-tight">{title}</h3>
        {children}
      </CardContent>
    </Card>
  </motion.div>
);

export default function ProgressPage() {
  const [progress] = useState(mockProgress);

  return (
    <div className="space-y-10 font-arabic pb-16" dir="rtl">
      {/* Header & Overall Progress */}
      <header className="flex flex-col xl:flex-row xl:items-center justify-between gap-8 px-4">
         <div className="flex items-center gap-6">
            <div className="w-1.5 h-16 bg-[#1a3a8f] rounded-full shadow-lg shadow-blue-900/20" />
            <div>
              <h1 className="text-2xl md:text-3xl font-black text-neutral-900 tracking-tight leading-none mb-3">
                خريطة الإنجاز
              </h1>
              <p className="text-neutral-500 font-bold text-sm max-w-xl leading-relaxed">
                تتبع مسارك التدريبي والمهاري لحظة بلحظة حتى استلام رخصتك السيادية.
              </p>
            </div>
         </div>

         <div className="flex items-center gap-6 bg-white border border-neutral-200 p-6 rounded-[2rem] shadow-sm min-w-[320px]">
            <div className="flex-1 space-y-3">
               <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-[#1a3a8f]">
                  <span>إجمالي الإنجاز</span>
                  <span className="text-lg tracking-tighter tabular-nums">{progress.overall}%</span>
               </div>
               <CustomProgressBar value={progress.overall} />
            </div>
            <div className="w-16 h-16 rounded-2xl bg-[#1a3a8f] flex items-center justify-center shadow-lg shadow-blue-900/20">
               <TrendingUp className="w-8 h-8 text-white" />
            </div>
         </div>
      </header>

      {/* Grid of Stages */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-4">
        {/* Medical */}
        <ProgressStage 
          title="الفحص البيومتري والطبي" 
          status={progress.medical.passed ? "اجتياز" : "قيد الإجراء"}
          icon={Activity}
          colorClass="text-emerald-600"
          bgClass="bg-emerald-50"
        >
          <div className="space-y-4">
            <div className="flex justify-between items-center bg-neutral-50 p-4 rounded-xl border border-neutral-100 border-dashed">
              <span className="text-xs font-bold text-neutral-400">تاريخ الاعتماد</span>
              <span className="text-sm font-black text-neutral-900 tracking-tight">15 فبراير 2025</span>
            </div>
            {progress.medical.passed && (
              <Button 
                variant="outline" 
                className="w-full h-12 bg-white border-neutral-200 text-[#1a3a8f] hover:bg-neutral-50 rounded-xl font-black text-xs transition-all gap-3 shadow-none"
              >
                <Download className="w-4 h-4" />
                تحميل التقرير البيومتري
              </Button>
            )}
          </div>
        </ProgressStage>

        {/* Theory Training */}
        <ProgressStage 
          title="الأكاديمية - التدريب النظري"
          status={progress.theoryTraining.completed ? "منجز" : "قيد الحضور"}
          icon={BookOpen}
          colorClass="text-[#1a3a8f]"
          bgClass="bg-blue-50"
        >
          <div className="space-y-4">
            <div className="flex justify-between items-center mb-1">
               <span className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">تراكم الساعات</span>
               <span className="text-sm font-black text-[#1a3a8f] tracking-tighter">{progress.theoryTraining.hoursCompleted} ساعة</span>
            </div>
            <CustomProgressBar value={(progress.theoryTraining.hoursCompleted / progress.theoryTraining.hoursRequired) * 100} />
            <p className="text-[10px] font-bold text-neutral-400 leading-relaxed italic text-center">بانتظار استكمال {progress.theoryTraining.hoursRequired - progress.theoryTraining.hoursCompleted} ساعات لإغلاق المرحلة.</p>
          </div>
        </ProgressStage>

        {/* Theory Test */}
        <ProgressStage 
          title="الاختبار المعرفي (النظري)" 
          status={progress.theoryTest.passed ? "اجتياز" : "قيد التقييم"}
          icon={Target}
          colorClass="text-orange-600"
          bgClass="bg-orange-50"
        >
          <div className="space-y-4">
            <div className="flex justify-between items-center mb-2">
               <span className="text-sm font-bold text-neutral-500">الدرجة المحققة</span>
               <span className="text-3xl font-black text-emerald-600 tracking-tighter tabular-nums">{progress.theoryTest.score}%</span>
            </div>
            {progress.theoryTest.passed && (
              <Button 
                variant="outline" 
                className="w-full h-12 bg-white border-neutral-200 text-[#1a3a8f] hover:bg-neutral-50 rounded-xl font-black text-xs transition-all gap-3 shadow-none"
              >
                <Medal className="w-4 h-4 text-[#D4A017]" />
                تحميل شهادة القدرات
              </Button>
            )}
          </div>
        </ProgressStage>

        {/* Practical Training */}
        <ProgressStage 
          title="الميدان - التدريب العملي"
          status={progress.practicalTraining.completed ? "منجز" : "قيد الحضور"}
          icon={Car}
          colorClass="text-[#1a3a8f]"
          bgClass="bg-blue-50"
        >
          <div className="space-y-4">
            <div className="flex justify-between items-center mb-1">
               <span className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">الساعات المنجزة</span>
               <span className="text-sm font-black text-[#D4A017] tracking-tighter">{progress.practicalTraining.hoursCompleted} / {progress.practicalTraining.hoursRequired}</span>
            </div>
            <CustomProgressBar value={(progress.practicalTraining.hoursCompleted / progress.practicalTraining.hoursRequired) * 100} color="#D4A017" />
            <div className="p-4 bg-neutral-50 rounded-xl border border-neutral-100 text-[9px] font-bold text-neutral-500 space-y-1">
               <p>المدرب: <span className="text-neutral-900 font-black">{progress.practicalTraining.instructor}</span></p>
               <p>المركز: <span className="text-neutral-900 font-black">{progress.practicalTraining.center}</span></p>
            </div>
          </div>
        </ProgressStage>

        {/* Practical Test */}
        <ProgressStage 
          title="التقييم الميداني النهائي" 
          status={progress.practicalTest.pending ? 'بانتظار الموعد' : 'راسب'}
          icon={Medal}
          colorClass="text-[#1a3a8f]"
          bgClass="bg-neutral-50"
        >
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-neutral-500">محاولات الاختبارات</span>
              <span className="text-sm font-black text-neutral-900">{progress.practicalTest.attempts} / {progress.practicalTest.maxAttempts}</span>
            </div>
            {progress.practicalTest.pending ? (
              <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl flex items-center gap-3">
                 <Zap className="w-4 h-4 text-[#1a3a8f] animate-pulse" />
                 <p className="text-xs font-black text-[#1a3a8f]">سيتم تفعيل الرابط فور الاعتماد</p>
              </div>
            ) : (
                <Button className="w-full h-12 bg-[#D4A017] hover:bg-[#b88a14] text-white rounded-xl font-black text-xs uppercase tracking-widest shadow-lg shadow-black/5 gap-3">
                   <Clock className="w-4 h-4" />
                   حجز موعد إعادة
                </Button>
            )}
          </div>
        </ProgressStage>
      </div>

      {/* Final Credential Hero Card */}
      <motion.div 
         initial={{ opacity: 0, y: 30 }} 
         whileInView={{ opacity: 1, y: 0 }} 
         viewport={{ once: true }}
         className="px-4"
      >
        <Card className="border-none shadow-2xl rounded-[3rem] overflow-hidden bg-gradient-to-br from-[#1a3a8f] to-[#152d6f] text-white relative group">
          <div className="absolute top-0 right-0 w-full h-full opacity-10 pointer-events-none overflow-hidden">
             <Dna className="w-[120%] h-[120%] -translate-x-12 -translate-y-12" />
          </div>
          <CardContent className="p-10 flex flex-col lg:flex-row items-center justify-between gap-10 relative z-10">
            <div className="flex items-center gap-8">
              <div className="w-24 h-24 bg-white/10 backdrop-blur-md rounded-[2.5rem] flex items-center justify-center border border-white/20 transform group-hover:rotate-12 transition-transform">
                <Award className="w-12 h-12 text-white" />
              </div>
              <div className="space-y-2">
                <h3 className="text-3xl font-black tracking-tight leading-none">وثيقة الرخص السيادية</h3>
                <p className="text-blue-100 font-bold text-sm max-w-md">يمكنك استحقاق وتحميل الشهادة النهائية فور اكتمال كافة مراحل التدريب والتقييم بنجاح واجتماع اللجنة العليا.</p>
              </div>
            </div>
            <Button disabled className="h-10 md:h-12 px-6 md:px-8 rounded-md bg-white text-[#1a3a8f] font-black text-sm md:text-base transition-all">
              <Download className="w-4 h-4 md:w-5 md:h-5 ml-2 md:ml-3" />
              تحميل الشهادة الموحدة
            </Button>
          </CardContent>
        </Card>
      </motion.div>

      <div className="flex justify-center pt-4 opacity-30 select-none">
         <div className="flex items-center gap-4 py-3 px-6 rounded-full border border-neutral-200">
            <ShieldCheck className="w-4 h-4" />
            <span className="text-[10px] font-black uppercase tracking-[0.25em]">المركز الوطني للإصدار - وزارة الداخلية</span>
         </div>
      </div>
    </div>
  );
}