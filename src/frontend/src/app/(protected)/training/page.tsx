'use client';

import { useState } from 'react';
import { 
  GraduationCap, 
  Calendar, 
  Clock, 
  User, 
  MapPin, 
  CheckCircle2,
  Plus,
  Filter,
  Search,
  BookOpen,
  Car,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Zap,
  Target,
  Medal,
  Dna,
  Infinity
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

// Mock training sessions data
const mockTrainingSessions = {
  completed: [
    {
      id: '1',
      date: '2025-03-15',
      time: '08:00 - 10:00',
      duration: 2,
      instructor: 'أحمد عبدالله العامري',
      center: 'مركز التدريب والتعليم المروري - صنعاء',
      type: 'practical',
      notes: 'التركيز على تغيير المسارات والاندماج في الطرق السريعة.'
    },
    {
      id: '2',
      date: '2025-03-12',
      time: '08:00 - 10:00',
      duration: 2,
      instructor: 'أحمد عبدالله العامري',
      center: 'مركز التدريب والتعليم المروري - صنعاء',
      type: 'practical',
      notes: 'التدريب على المواقف المتوازية والرجوع للخلف.'
    },
    {
      id: '3',
      date: '2025-03-08',
      time: '16:00 - 18:00',
      duration: 2,
      instructor: 'سعود عبدالعزيز الدوسري',
      center: 'مركز التدريب والتعليم المروري - صنعاء',
      type: 'practical',
      notes: 'التعرف على الإشارات المرورية والالتزام بها.'
    },
    {
      id: '4',
      date: '2025-03-05',
      time: '08:00 - 10:00',
      duration: 2,
      instructor: 'سعود عبدالعزيز الدوسري',
      center: 'مركز التدريب والتعليم المروري - صنعاء',
      type: 'practical',
      notes: 'التحكم الأساسي في المركبة والبدء بالحركة.'
    }
  ],
  upcoming: [
    {
      id: 'up1',
      date: '2025-04-01',
      time: '08:00 - 10:00',
      duration: 2,
      instructor: 'أحمد عبدالله العامري',
      center: 'مركز التدريب والتعليم المروري - صنعاء',
      type: 'practical',
      notes: 'الملاحة في الدوارات والتقاطعات المزدحمة.'
    }
  ],
  totalHoursCompleted: 12,
  hoursRequired: 30
};

const SessionCard = ({ session, isUpcoming = false }: { session: any; isUpcoming?: boolean }) => {
  return (
    <Card className={cn(
      "border border-neutral-200 shadow-sm rounded-[2rem] overflow-hidden bg-white transition-all hover:shadow-xl hover:border-[#1a3a8f]/20 group",
      isUpcoming ? "ring-1 ring-[#1a3a8f]/30 bg-blue-50/20" : ""
    )}>
      <CardContent className="p-7 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="flex items-center gap-6">
          <div className={cn(
            "w-16 h-16 rounded-2xl flex items-center justify-center border shadow-sm group-hover:scale-105 transition-transform duration-500",
            isUpcoming ? "bg-[#1a3a8f] text-white border-[#1a3a8f]/10" : "bg-emerald-50 text-emerald-600 border-emerald-100"
          )}>
            {isUpcoming ? (
              <Calendar className="w-8 h-8" />
            ) : (
              <CheckCircle2 className="w-8 h-8" />
            )}
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-3 mb-1">
              <h4 className="text-xl font-black text-neutral-900 tracking-tight leading-none">
                {new Date(session.date).toLocaleDateString('ar-YE', { day: '2-digit', month: 'long', year: 'numeric' })}
              </h4>
              <span className="text-[10px] font-black text-neutral-400 uppercase tracking-widest leading-none bg-neutral-100/50 px-2 py-1 rounded-md">
                 {session.time}
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-4 text-xs font-bold">
              <span className="flex items-center gap-2 text-neutral-500">
                <User className="w-4 h-4 text-[#1a3a8f]/40" />
                المدرب: <span className="text-neutral-900">{session.instructor}</span>
              </span>
              <span className="flex items-center gap-2 text-neutral-500">
                <MapPin className="w-4 h-4 text-[#1a3a8f]/40" />
                {session.center}
              </span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          {isUpcoming ? (
            <Button className="h-12 px-8 bg-[#1a3a8f] hover:bg-[#152d6f] text-white rounded-xl font-black text-xs uppercase tracking-widest shadow-lg shadow-blue-900/10 transition-all">
              الانضمام للمنصة
            </Button>
          ) : (
            <div className="flex items-center gap-2 px-4 py-1.5 rounded-xl bg-emerald-50 border border-emerald-100 text-[10px] font-black uppercase tracking-widest text-emerald-600">
               محاضرة مكتملة
            </div>
          )}
          
          <Button variant="ghost" size="icon" className="h-12 w-12 rounded-xl text-neutral-300 hover:text-[#1a3a8f] hover:bg-neutral-50 transition-all">
             <ChevronLeft className="w-6 h-6" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default function TrainingPage() {
  const [sessions] = useState(mockTrainingSessions);
  const [filter, setFilter] = useState<'all' | 'completed' | 'upcoming'>('all');

  const filteredSessions = filter === 'all' 
    ? [...sessions.upcoming, ...sessions.completed]
    : filter === 'completed'
      ? sessions.completed
      : sessions.upcoming;

  return (
    <div className="space-y-10 font-arabic pb-16" dir="rtl">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-end md:justify-between gap-8 px-4">
         <div className="flex items-center gap-6">
            <div className="w-1.5 h-16 bg-[#1a3a8f] rounded-full shadow-lg shadow-blue-900/20" />
            <div>
<h1 className="text-2xl md:text-3xl font-black text-neutral-900 tracking-tight leading-none mb-3">
                  الأكاديمية - سجل التدريب
                </h1>
              <p className="text-neutral-500 font-bold text-sm max-w-xl leading-relaxed">
                متابعة الحصص الميدانية والنظرية الموثقة من قبل اللجنة الفنية والمدربين المعتمدين.
              </p>
            </div>
         </div>
<Button className="h-10 md:h-12 px-6 md:px-8 rounded-md bg-[#1a3a8f] hover:bg-[#152d6f] text-white font-black text-xs md:text-sm uppercase tracking-[0.2em] gap-3 md:gap-4 transition-all">
             <Plus className="w-4 h-4 md:w-5 md:h-5" />
             حجز حصة إضافية
          </Button>
      </header>

      {/* Analytics Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 px-4">
        {/* Hours Card */}
        <Card className="border-none shadow-2xl rounded-[2.5rem] overflow-hidden bg-gradient-to-br from-[#1a3a8f] to-[#152d6f] text-white relative group">
          <div className="absolute top-0 right-0 w-full h-full opacity-10 pointer-events-none">
             <Dna className="w-full h-full -translate-x-12 translate-y-12" />
          </div>
          <CardContent className="p-10 relative z-10">
            <div className="flex items-center justify-between mb-8">
              <p className="text-xs font-black uppercase tracking-widest text-blue-200">إجمالي زمن الحضور</p>
              <div className="w-14 h-14 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/20">
                <Clock className="w-7 h-7 text-white" />
              </div>
            </div>
            <div className="space-y-4">
               <div className="flex items-baseline gap-2">
                  <span className="text-2xl md:text-3xl font-black tracking-tighter tabular-nums">{sessions.totalHoursCompleted}</span>
                  <span className="text-xl font-bold text-blue-300">/ {sessions.hoursRequired}</span>
                  <span className="text-xs font-black uppercase tracking-widest text-blue-400 mr-2">ساعة تدريبية</span>
               </div>
               <div className="h-2 bg-white/10 rounded-full overflow-hidden shadow-inner">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${(sessions.totalHoursCompleted / sessions.hoursRequired) * 100}%` }}
                    className="h-full bg-white rounded-full shadow-[0_0_10px_white]"
                  />
               </div>
               <p className="text-[10px] font-black text-blue-200 uppercase tracking-widest leading-none">
                  متبقي {sessions.hoursRequired - sessions.totalHoursCompleted} ساعات لاستكمال المتطلبات
               </p>
            </div>
          </CardContent>
        </Card>

        {/* Stats 1 */}
        <Card className="border border-neutral-200 shadow-sm rounded-[2.5rem] overflow-hidden bg-white p-10 flex flex-col justify-center">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-neutral-400 mb-2">المحاضرات المنجزة</p>
                <div className="flex items-baseline gap-2">
                   <h3 className="text-2xl md:text-3xl font-black text-neutral-900 tracking-tighter tabular-nums">{sessions.completed.length}</h3>
                   <span className="text-xs font-black text-neutral-400 uppercase tracking-widest">مكتملة</span>
                </div>
              </div>
              <div className="w-20 h-20 bg-emerald-50 rounded-3xl flex items-center justify-center border border-emerald-100 text-emerald-600 shadow-inner">
                <CheckCircle2 className="w-10 h-10" />
              </div>
            </div>
            <p className="text-[10px] font-bold text-neutral-300 mt-6 leading-relaxed italic">
               تم اعتماد الساعات من قبل الإدارة العامة للمرور ونظام الأتمتة المركزي.
            </p>
        </Card>

        {/* Stats 2 */}
        <Card className="border border-neutral-200 shadow-sm rounded-[2.5rem] overflow-hidden bg-white p-10 flex flex-col justify-center">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-neutral-400 mb-2">المواعيد القادمة</p>
                <div className="flex items-baseline gap-2">
                   <h3 className="text-2xl md:text-3xl font-black text-[#1a3a8f] tracking-tighter tabular-nums">{sessions.upcoming.length}</h3>
                   <span className="text-xs font-black text-[#1a3a8f]/60 uppercase tracking-widest">مجولة</span>
                </div>
              </div>
              <div className="w-20 h-20 bg-blue-50 rounded-3xl flex items-center justify-center border border-blue-100 text-[#1a3a8f] shadow-inner">
                <Calendar className="w-10 h-10" />
              </div>
            </div>
            {sessions.upcoming[0] && (
               <div className="mt-6 flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-[#1a3a8f] animate-pulse" />
                  <p className="text-[10px] font-black text-[#1a3a8f] uppercase tracking-widest">الجلسة القادمة: {new Date(sessions.upcoming[0].date).toLocaleDateString('ar-YE')}</p>
               </div>
            )}
        </Card>
      </div>

      {/* Toolbar & Filter */}
      <div className="flex flex-col xl:flex-row gap-6 justify-between bg-white border border-neutral-200 p-8 rounded-[2.5rem] shadow-sm mx-4">
         <div className="relative flex-1 group max-w-xl">
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 group-focus-within:text-[#1a3a8f] transition-colors" />
            <Input
              placeholder="البحث في سجل المحاضرات..."
              className="pr-12 h-12 border-neutral-100 bg-neutral-50/50 focus:bg-white focus:ring-4 focus:ring-blue-100 transition-all rounded-xl font-bold text-sm text-right"
            />
         </div>

         <div className="flex items-center gap-2 flex-wrap">
            {[
              { id: 'all', label: 'كافة الحصص' },
              { id: 'upcoming', label: 'المواعيد القادمة' },
              { id: 'completed', label: 'سجل الإنجاز' },
            ].map((tab) => (
              <Button
                key={tab.id}
                onClick={() => setFilter(tab.id as any)}
                className={cn(
                  "h-10 px-5 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all gap-2 border",
                  filter === tab.id 
                    ? "bg-[#1a3a8f] text-white border-[#1a3a8f] shadow-lg shadow-blue-900/10" 
                    : "bg-white text-neutral-400 border-neutral-100 hover:bg-neutral-50"
                )}
              >
                {tab.label}
              </Button>
            ))}
         </div>
      </div>

      {/* Session List */}
      <div className="grid grid-cols-1 gap-4 px-4">
        <AnimatePresence mode="popLayout">
          {filteredSessions.length > 0 ? (
            filteredSessions.map((session, idx) => (
              <motion.div
                key={session.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.2, delay: idx * 0.03 }}
              >
                <SessionCard 
                  session={session} 
                  isUpcoming={sessions.upcoming.some(s => s.id === session.id)}
                />
              </motion.div>
            ))
          ) : (
            <div className="py-24 text-center bg-neutral-50/50 rounded-[3rem] border border-dashed border-neutral-200 mx-4">
               <GraduationCap className="w-20 h-20 text-neutral-200 mx-auto mb-6" />
               <h3 className="text-xl font-black text-neutral-400 italic">لا توجد سجلات تدريبية مدرجة</h3>
            </div>
          )}
        </AnimatePresence>
      </div>

      {/* Instructor Insights Section */}
      <motion.div 
         initial={{ opacity: 0, y: 20 }} 
         whileInView={{ opacity: 1, y: 0 }} 
         viewport={{ once: true }}
         className="px-4"
      >
        <Card className="border border-neutral-200 shadow-xl rounded-[2.5rem] overflow-hidden bg-[#1a3a8f]/5">
          <CardHeader className="p-8 pb-4">
            <CardTitle className="text-2xl font-black text-neutral-900 flex items-center gap-4">
              <BookOpen className="w-8 h-8 text-[#1a3a8f]" />
              ملاحظات وتوجيهات المدربين
            </CardTitle>
            <p className="text-xs font-bold text-neutral-500 mt-1">توجيهات مباشرة لتحسين مستوى الأداء الميداني.</p>
          </CardHeader>
          <CardContent className="p-8 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {sessions.completed.slice(0, 4).map((session) => (
                <div key={session.id} className="p-6 bg-white rounded-2xl border border-neutral-100 hover:border-[#1a3a8f]/20 transition-all shadow-sm">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                       <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center font-black text-[#1a3a8f] text-xs">
                          {session.instructor.split(' ')[0][0]}
                       </div>
                       <div>
                          <p className="text-xs font-black text-neutral-900 tracking-tight">{session.instructor}</p>
                          <p className="text-[10px] font-bold text-neutral-400">{new Date(session.date).toLocaleDateString('ar-YE')}</p>
                       </div>
                    </div>
                    <Badge className="bg-[#1a3a8f]/10 text-[#1a3a8f] rounded-lg text-[9px] font-black uppercase tracking-widest">{session.duration} ساعة</Badge>
                  </div>
                  <p className="text-xs font-bold text-neutral-600 leading-relaxed italic border-r-2 border-primary-100 pr-3">
                     {session.notes}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <div className="flex justify-center pt-8 opacity-30 select-none">
         <div className="flex items-center gap-4 py-3 px-6 rounded-full border border-neutral-200">
            <ShieldCheck className="w-4 h-4" />
            <span className="text-[10px] font-black uppercase tracking-[0.25em]">أكاديمية تدريب السائقين - المركز التقني الموحد</span>
         </div>
      </div>
    </div>
  );
}