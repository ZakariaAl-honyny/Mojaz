'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import {
  Calendar,
  Clock,
  MapPin,
  ChevronRight,
  Stethoscope,
  GraduationCap,
  Car,
  Plus,
  CalendarCheck,
  ShieldCheck,
  Timer,
  History,
  ArrowRight,
  Loader2
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/shared/status-badge';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import appointmentService, { AppointmentDto } from '@/services/appointment.service';

// Helper to convert API status to frontend status
const mapStatus = (status: string): 'confirmed' | 'pending' | 'completed' | 'cancelled' => {
  switch (status) {
    case 'Scheduled':
      return 'confirmed';
    case 'Completed':
      return 'completed';
    case 'Cancelled':
      return 'cancelled';
    default:
      return 'pending';
  }
};

// Helper to convert appointment type
const mapType = (type: number): 'medical' | 'theory' | 'practical' => {
  switch (type) {
    case 0: return 'medical';
    case 1: return 'theory';
    case 2: return 'practical';
    default: return 'medical';
  }
};

const getTypeIcon = (type: string) => {
  switch (type) {
    case 'medical':
      return <Stethoscope className="w-6 h-6" />;
    case 'theory':
      return <GraduationCap className="w-6 h-6" />;
    case 'practical':
      return <Car className="w-6 h-6" />;
    default:
      return <Calendar className="w-6 h-6" />;
  }
};

const typeLabels = {
  medical: "الفحص الطبي الشامل",
  theory: "الاختبار النظري (المعرفي)",
  practical: "الاختبار العملي (الميداني)"
};

interface AppointmentCardProps {
  appointment: AppointmentDto;
  isPast?: boolean;
}

function AppointmentCard({ appointment, isPast }: AppointmentCardProps) {
  const appointmentStatus = mapStatus(appointment.status);
  const appointmentType = mapType(appointment.appointmentType);
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="group"
    >
      <Link href={`/appointments/${appointment.id}`}>
        <Card className={cn(
          "border border-neutral-100 shadow-sm hover:shadow-2xl hover:border-[#1a3a8f]/20 transition-all duration-500 bg-white rounded-[2.5rem] overflow-hidden relative",
          isPast && "opacity-60 grayscale-[0.5]"
        )}>
           {/* Decorative Accent */}
          <div className={cn(
            "absolute top-0 right-0 w-2 h-full transition-all duration-500",
            appointmentStatus === 'confirmed' ? "bg-emerald-500" : 
            appointmentStatus === 'pending' ? "bg-[#D4A017]" : "bg-neutral-200"
          )} />

          <CardContent className="p-8 lg:p-10 flex flex-col lg:flex-row items-center justify-between gap-10">
            <div className="flex items-center gap-8 flex-1 w-full lg:w-auto">
              <div className={cn(
                "w-20 h-20 rounded-[1.5rem] flex items-center justify-center shadow-inner border transition-all duration-500 group-hover:scale-110 group-hover:rotate-3",
                appointmentStatus === 'confirmed' ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-blue-50 text-[#1a3a8f] border-blue-100"
              )}>
                {getTypeIcon(appointmentType)}
              </div>
              <div className="space-y-2 flex-1 text-right">
                <div className="flex items-center gap-3 mb-1">
                   {isPast && <span className="px-3 py-1 bg-neutral-100 text-neutral-500 text-[10px] font-black rounded-lg uppercase tracking-widest">منتهي</span>}
                   <h4 className="text-2xl font-black text-neutral-900 group-hover:text-[#1a3a8f] transition-colors tracking-tight">
                    {typeLabels[appointmentType]}
                  </h4>
                </div>
                <div className="flex flex-wrap items-center gap-x-8 gap-y-3">
                   <div className="flex items-center gap-2.5 text-neutral-400 group-hover:text-neutral-600 transition-colors">
                      <MapPin className="w-4 h-4 text-[#D4A017]" />
                      <span className="text-sm font-bold">{appointment.branchName}</span>
                   </div>
                   <div className="flex items-center gap-2.5 text-neutral-400 group-hover:text-neutral-600 transition-colors">
                      <Timer className="w-4 h-4 text-[#1a3a8f]" />
                      <span className="text-sm font-black tracking-tight">{appointment.timeSlot}</span>
                   </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-10 lg:gap-16 flex-1 justify-center w-full lg:w-auto px-6 border-y lg:border-y-0 lg:border-x border-neutral-50 py-6 lg:py-0">
              <div className="text-center lg:text-right min-w-[140px]">
                <p className="text-[10px] text-neutral-400 font-black uppercase tracking-[0.2em] mb-3">تاريخ الحجز</p>
                <div className="flex items-center gap-2.5 bg-neutral-50 px-5 py-2.5 rounded-2xl border border-neutral-100 group-hover:bg-white group-hover:border-[#D4A017]/20 transition-all">
                   <Calendar className="w-4 h-4 text-[#D4A017]" />
                   <span className="text-base font-black text-neutral-900 tracking-tight">
                      {new Date(appointment.scheduledDate).toLocaleDateString('ar-YE', { day: '2-digit', month: 'long', year: 'numeric' })}
                   </span>
                </div>
              </div>

              <div className="text-center lg:text-right min-w-[140px]">
                <p className="text-[10px] text-neutral-400 font-black uppercase tracking-[0.2em] mb-3">حالة الموعد</p>
                <StatusBadge status={appointmentStatus} />
              </div>
            </div>

            <div className="flex items-center gap-4 w-full lg:w-auto justify-end">
              <Button
                variant="ghost"
                size="icon"
                className="h-16 w-16 rounded-[1.5rem] bg-neutral-50 text-neutral-400 group-hover:bg-[#1a3a8f] group-hover:text-white transition-all duration-500 border border-neutral-100 shadow-inner group-hover:shadow-blue-900/20"
              >
                <ArrowRight className="w-7 h-7" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  );
}

export default function AppointmentsPage() {
  const [activeTab, setActiveTab] = useState<'upcoming' | 'history'>('upcoming');

  // Fetch appointments from API
  const { data: appointmentsData, isLoading } = useQuery({
    queryKey: ['my-appointments'],
    queryFn: () => appointmentService.getMyAppointments(),
  });

  const appointments = appointmentsData?.data ?? [];
  const today = new Date().toISOString().split('T')[0];
  
  const upcomingAppointments = appointments.filter((apt) => apt.scheduledDate >= today && apt.status !== 'Cancelled');
  const pastAppointments = appointments.filter((apt) => apt.scheduledDate < today || apt.status === 'Completed');

  return (
    <div className="space-y-12 font-arabic" dir="rtl">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-end md:justify-between gap-10 px-4">
         <div className="flex items-center gap-8">
            <div className="w-2.5 h-20 bg-[#1a3a8f] rounded-full shadow-2xl shadow-blue-900/40 relative">
                <div className="absolute top-0 left-0 w-full h-1/2 bg-[#D4A017] rounded-full opacity-50 blur-sm" />
            </div>
            <div>
<h1 className="text-2xl md:text-3xl font-black text-neutral-900 tracking-tighter leading-none mb-4">
                  إدارة المواعيد
                </h1>
              <p className="text-neutral-500 font-bold text-lg max-w-2xl leading-relaxed">
                تنظيم وجدولة زياراتك لمراكز الخدمة التابعة للإدارة العامة للمرور. كن على موعد مع التميز الحكومي.
              </p>
            </div>
         </div>
         <Link href="/appointments/book">
<Button className="h-10 md:h-12 px-6 md:px-8 rounded-md bg-[#1a3a8f] hover:bg-[#152d6f] text-white text-sm md:text-base font-black transition-all gap-3 md:gap-4 group">
              <Plus className="w-4 h-4 md:w-5 md:h-5 group-hover:rotate-90 transition-transform duration-500" />
              حجز موعد جديد
            </Button>
         </Link>
      </header>

      {/* Navigation Tabs - Modernized Segmented Control */}
      <div className="flex items-center gap-3 bg-white border border-neutral-200 p-2.5 rounded-[2rem] shadow-xl shadow-black/5 mx-4 w-fit relative overflow-hidden group">
        <div className="absolute inset-0 bg-neutral-50/50 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
        <button
          onClick={() => setActiveTab('upcoming')}
          className={cn(
            "px-10 py-4 rounded-[1.5rem] font-black text-xs uppercase tracking-[0.2em] transition-all duration-500 gap-4 flex items-center relative z-10",
            activeTab === 'upcoming'
              ? "bg-[#1a3a8f] text-white shadow-2xl shadow-blue-900/30"
              : "text-neutral-400 hover:text-neutral-600 hover:bg-neutral-50"
          )}
        >
          <Timer className="w-4 h-4" />
          المواعيد النشطة
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={cn(
            "px-10 py-4 rounded-[1.5rem] font-black text-xs uppercase tracking-[0.2em] transition-all duration-500 gap-4 flex items-center relative z-10",
            activeTab === 'history'
              ? "bg-[#1a3a8f] text-white shadow-2xl shadow-blue-900/30"
              : "text-neutral-400 hover:text-neutral-600 hover:bg-neutral-50"
          )}
        >
          <History className="w-4 h-4" />
          سجل المواعيد
        </button>
      </div>

      {/* Content Section */}
      <div className="grid grid-cols-1 gap-8 px-4 pb-16">
        <AnimatePresence mode="wait">
          {activeTab === 'upcoming' ? (
            <motion.div 
              key="upcoming"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              {isLoading ? (
                <Card className="border-none shadow-xl rounded-[3rem] p-24">
                  <CardContent className="flex flex-col items-center justify-center">
                    <Loader2 className="w-10 h-10 animate-spin text-[#1a3a8f] mb-4" />
                    <p className="text-neutral-400 font-bold">جاري تحميل المواعيد...</p>
                  </CardContent>
                </Card>
              ) : upcomingAppointments.length > 0 ? (
                upcomingAppointments.map((appointment) => (
                  <AppointmentCard key={appointment.id} appointment={appointment} />
                ))
              ) : (
                <Card className="border-2 border-neutral-100 border-dashed bg-neutral-50/30 rounded-[4rem] p-24">
                  <CardContent className="flex flex-col items-center justify-center text-center">
                    <div className="w-32 h-32 rounded-[2.5rem] bg-white shadow-2xl shadow-black/5 flex items-center justify-center mb-10 border border-neutral-100 relative group">
                      <CalendarCheck className="w-14 h-14 text-neutral-200 group-hover:text-[#1a3a8f] transition-colors duration-700" />
                      <div className="absolute -top-2 -right-2 w-8 h-8 bg-[#D4A017] rounded-full border-4 border-white shadow-lg" />
                    </div>
                    <h3 className="text-3xl font-black text-neutral-900 mb-4 tracking-tight">لا يوجد جدول مواعيد حالي</h3>
                    <p className="text-neutral-400 font-bold text-lg mb-10 max-w-sm leading-relaxed">
                      لم نجد أي مواعيد مجدولة في سجلاتك النشطة. يمكنك حجز موعد جديد في أي مركز متاح.
                    </p>
                    <Link href="/appointments/book">
                      <Button className="h-10 md:h-12 px-6 md:px-8 rounded-md bg-[#D4A017] text-white font-black text-sm md:text-base transition-transform gap-2 md:gap-3">
                        حجز موعد الآن
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              )}
            </motion.div>
          ) : (
            <motion.div 
              key="history"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-6"
            >
              {isLoading ? (
                <Card className="border-none shadow-xl rounded-[3rem] p-24">
                  <CardContent className="flex flex-col items-center justify-center">
                    <Loader2 className="w-10 h-10 animate-spin text-[#1a3a8f] mb-4" />
                  </CardContent>
                </Card>
              ) : pastAppointments.length > 0 ? (
                pastAppointments.map((appointment) => (
                  <AppointmentCard key={appointment.id} appointment={appointment} isPast />
                ))
              ) : (
                <Card className="border-2 border-neutral-100 border-dashed bg-neutral-50/30 rounded-[4rem] p-24">
                  <CardContent className="flex flex-col items-center justify-center text-center">
                    <History className="w-20 h-20 text-neutral-200 mb-8" />
                    <h3 className="text-2xl font-black text-neutral-400">سجل المواعيد خالٍ</h3>
                  </CardContent>
                </Card>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Security Footer */}
      <div className="flex justify-center pb-12 opacity-40 select-none">
         <div className="flex items-center gap-5 py-4 px-8 rounded-full border border-neutral-100 bg-white/50 backdrop-blur-sm shadow-sm group hover:opacity-100 transition-opacity">
            <ShieldCheck className="w-5 h-5 text-[#1a3a8f]" />
            <span className="text-[11px] font-black uppercase tracking-[0.3em] text-neutral-500">نظام التوثيق الموحد - الإدارة العامة للمرور</span>
         </div>
      </div>
    </div>
  );
}