'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Users,
  Clock,
  CheckCircle2,
  XCircle,
  Search,
  Filter,
  UserCheck,
  UserX,
  Timer,
  ShieldCheck,
  Calendar,
  ChevronLeft,
  ArrowUpRight,
  Loader2
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { StatusBadge } from '@/components/domain/application/StatusBadge';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import appointmentService, { AppointmentDto } from '@/services/appointment.service';

// Map appointment type to status
const mapAppointmentToAttendanceStatus = (appointment: AppointmentDto): 'pending' | 'present' | 'late' | 'absent' => {
  if (appointment.checkInTime) {
    // Compare check-in time with scheduled time
    const scheduled = appointment.timeSlot.replace('ص', '').replace('م', '');
    const checkIn = appointment.checkInTime;
    return 'present'; // Could add late logic here
  }
  if (appointment.status === 'Cancelled') return 'absent';
  return 'pending';
};

// Helper to map numeric AppointmentType to string type
const mapAppointmentTypeToString = (type: number): 'medical' | 'theory' | 'practical' => {
  switch (type) {
    case 0: return 'medical';
    case 1: return 'theory';
    case 2: return 'practical';
    default: return 'medical';
  }
};

// Map appointment type to Arabic label
const mapTypeToLabel = (type: number): string => {
  switch (type) {
    case 0: return "الفحص الطبي";
    case 1: return "الاختبار النظري";
    case 2: return "الاختبار الميداني";
    default: return "غير محدد";
  }
};

// Helper to get applicant name from application
const getApplicantName = (appointment: AppointmentDto): string => {
  // In a real app, this would come from the application data
  return appointment.applicationId.substring(0, 8).toUpperCase();
};

const typeLabels: Record<string, string> = {
  medical: "الفحص الطبي",
  theory: "الاختبار النظري",
  practical: "الاختبار الميداني"
};

export default function AttendanceTrackingPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  
  const queryClient = useQueryClient();

  // Fetch attendance data from API
  const { data: attendanceData, isLoading } = useQuery({
    queryKey: ['attendance', selectedDate],
    queryFn: () => appointmentService.getAttendance(selectedDate),
    enabled: !!selectedDate,
  });

  // Check-in mutation
  const checkInMutation = useMutation({
    mutationFn: (appointmentId: string) => appointmentService.checkIn(appointmentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['attendance', selectedDate] });
    },
  });

  const attendance = attendanceData?.data ?? [];
  
  // Transform API data to local format for display
  const transformedAttendance = attendance.map(apt => ({
    id: apt.id,
    applicantName: apt.applicationId.substring(0, 8).toUpperCase(), // Placeholder - would come from actual user data
    applicantId: apt.applicationId.substring(0, 8),
    appointmentTime: apt.timeSlot,
    appointmentType: mapAppointmentTypeToString(apt.appointmentType),
    checkInTime: apt.checkInTime ?? null,
    status: mapAppointmentToAttendanceStatus(apt),
    date: apt.scheduledDate
  }));

  const filteredAttendance = transformedAttendance.filter(record => {
    const matchesSearch = !searchQuery || 
      record.applicantName.includes(searchQuery) || 
      record.applicantId.includes(searchQuery);
    const matchesStatus = filterStatus === 'all' || record.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: transformedAttendance.length,
    present: transformedAttendance.filter(r => r.status === 'present').length,
    late: transformedAttendance.filter(r => r.status === 'late').length,
    absent: transformedAttendance.filter(r => r.status === 'absent').length,
    pending: transformedAttendance.filter(r => r.status === 'pending').length,
  };

  return (
    <div className="space-y-12 font-arabic" dir="rtl">
      {/* Institutional Header */}
      <header className="flex flex-col md:flex-row md:items-end md:justify-between gap-10 px-4">
         <div className="flex items-center gap-8">
            <div className="w-2.5 h-20 bg-[#1a3a8f] rounded-full shadow-2xl shadow-blue-900/40" />
            <div>
<h1 className="text-2xl md:text-3xl font-black text-neutral-900 tracking-tighter leading-none mb-4">
                  تحضير المتقدمين
                </h1>
              <p className="text-neutral-500 font-bold text-lg max-w-2xl leading-relaxed">
                 إدارة الحضور والانصراف لمراكز الخدمة. تتبع المواعيد النشطة وتوثيق وصول المتقدمين بصيغة سيادية.
              </p>
            </div>
         </div>
         <div className="flex items-center gap-4 bg-white p-3 rounded-[1.5rem] border border-neutral-100 shadow-xl shadow-black/5">
             <Calendar className="w-5 h-5 text-[#D4A017]" />
             <Input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="border-none bg-transparent font-black text-neutral-900 focus-visible:ring-0 w-40 tabular-nums shadow-none"
              />
         </div>
      </header>

      {/* Modern High-Fidelity Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-6 px-4">
        {[
          { label: 'إجمالي المواعيد', value: stats.total, icon: Users, color: 'neutral' },
          { label: 'حاضر', value: stats.present, icon: UserCheck, color: 'emerald' },
          { label: 'متأخر', value: stats.late, icon: Timer, color: 'amber' },
          { label: 'غائب', value: stats.absent, icon: UserX, color: 'rose' },
          { label: 'قيد الانتظار', value: stats.pending, icon: Clock, color: 'blue' },
        ].map((stat, i) => (
          <Card key={i} className="border-none shadow-xl shadow-black/5 rounded-[2rem] overflow-hidden group hover:scale-105 transition-all duration-500">
             <CardContent className="p-8 space-y-4">
                <div className={cn(
                  "w-12 h-12 rounded-2xl flex items-center justify-center transition-colors duration-500 shadow-inner border border-transparent",
                  stat.color === 'emerald' ? "bg-emerald-50 text-emerald-600 border-emerald-100" :
                  stat.color === 'amber' ? "bg-amber-50 text-amber-600 border-amber-100" :
                  stat.color === 'rose' ? "bg-rose-50 text-rose-600 border-rose-100" :
                  stat.color === 'blue' ? "bg-blue-50 text-[#1a3a8f] border-blue-100" :
                  "bg-neutral-50 text-neutral-500 border-neutral-100"
                )}>
                   <stat.icon className="w-6 h-6" />
                </div>
                <div>
                   <p className="text-4xl font-black text-neutral-900 tracking-tighter tabular-nums">{stat.value}</p>
                   <p className="text-[10px] font-black text-neutral-400 uppercase tracking-widest mt-1">{stat.label}</p>
                </div>
             </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters Area */}
      <Card className="border-none shadow-2xl shadow-black/5 rounded-[2.5rem] overflow-hidden bg-white p-4 mx-4">
        <CardContent className="p-8 flex flex-col md:flex-row gap-8 items-center justify-between">
           <div className="relative flex-1 group w-full">
              <Search className="absolute right-6 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-300 group-focus-within:text-[#1a3a8f] transition-all" />
              <Input
                placeholder="البحث بالاسم أو رقم الهوية..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pr-16 h-16 rounded-2xl border-none bg-neutral-50 focus:bg-white focus:ring-8 focus:ring-blue-900/5 font-bold text-lg transition-all shadow-inner"
              />
           </div>
           
           <div className="flex items-center gap-4 w-full md:w-auto">
              <div className="p-2 bg-neutral-50 rounded-2xl border border-neutral-100 flex gap-1">
                 {['all', 'present', 'pending', 'absent'].map((s) => (
                    <button
                      key={s}
                      onClick={() => setFilterStatus(s)}
                      className={cn(
                        "px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                        filterStatus === s ? "bg-[#1a3a8f] text-white shadow-lg" : "text-neutral-400 hover:text-neutral-700"
                      )}
                    >
                       {s === 'all' ? 'الكل' : s === 'present' ? 'حاضر' : s === 'pending' ? 'انتظار' : 'غائب'}
                    </button>
                 ))}
              </div>
           </div>
        </CardContent>
      </Card>

{/* Attendance List */}
      <Card className="border-none shadow-2xl shadow-black/5 rounded-[3rem] overflow-hidden bg-white mx-4 p-4">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-right border-collapse">
              <thead>
                <tr className="border-b border-neutral-50">
                  <th className="px-10 py-10 text-[11px] font-black text-neutral-300 uppercase tracking-[0.3em]">المتقدم</th>
                  <th className="px-10 py-10 text-[11px] font-black text-neutral-300 uppercase tracking-[0.3em]">توقيت الموعد</th>
                  <th className="px-10 py-10 text-[11px] font-black text-neutral-300 uppercase tracking-[0.3em]">نوع الإجراء</th>
                  <th className="px-10 py-10 text-[11px] font-black text-neutral-300 uppercase tracking-[0.3em]">وقت الحضور</th>
                  <th className="px-10 py-10 text-[11px] font-black text-neutral-300 uppercase tracking-[0.3em]">الحالة الانضباطية</th>
                  <th className="px-10 py-10 text-[11px] font-black text-neutral-300 uppercase tracking-[0.3em] text-left">الإجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-50">
                {isLoading ? (
                  <tr>
                    <td colSpan={6} className="px-10 py-24 text-center">
                      <Loader2 className="w-10 h-10 animate-spin text-[#1a3a8f] mx-auto" />
                    </td>
                  </tr>
                ) : filteredAttendance.length > 0 ? (
                  filteredAttendance.map((record) => (
                    <tr key={record.id} className="group hover:bg-neutral-50/70 transition-all duration-500">
                      <td className="px-10 py-8">
                         <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-neutral-100 flex items-center justify-center border border-transparent group-hover:bg-white group-hover:border-neutral-100 shadow-sm transition-all">
                               <Users className="w-6 h-6 opacity-30" />
                            </div>
                            <div className="flex flex-col">
                               <span className="font-black text-neutral-900 group-hover:text-[#1a3a8f] transition-all">{record.applicantName}</span>
                               <span className="text-[10px] font-bold text-neutral-400 font-mono tracking-tighter">ID: {record.applicantId}</span>
                            </div>
                         </div>
                      </td>
                      <td className="px-10 py-8">
                        <div className="flex items-center gap-3 bg-neutral-50/50 w-fit px-4 py-2 rounded-xl border border-neutral-100 group-hover:bg-white transition-all">
                          <Clock className="w-4 h-4 text-[#D4A017]" />
                          <span className="text-sm font-black text-neutral-900 tabular-nums">{record.appointmentTime}</span>
                        </div>
                      </td>
                      <td className="px-10 py-8">
                        <span className="px-4 py-1.5 rounded-full border border-[#1a3a8f]/10 bg-[#1a3a8f]/5 text-[#1a3a8f] text-[10px] font-black uppercase tracking-widest">
                          {typeLabels[record.appointmentType]}
                        </span>
                      </td>
                      <td className="px-10 py-8">
                        {record.checkInTime ? (
                          <div className="flex flex-col">
                             <span className={cn(
                               "text-sm font-black tabular-nums",
                               record.status === 'late' ? "text-rose-600" : "text-emerald-600"
                             )}>
                               {record.checkInTime}
                             </span>
                             <span className="text-[9px] font-bold text-neutral-300 uppercase tracking-widest">توقيت البوابة</span>
                          </div>
                        ) : (
                          <div className="w-8 h-1 bg-neutral-100 rounded-full" />
                        )}
                      </td>
                      <td className="px-10 py-8">
                         <StatusBadge status={record.status} />
                      </td>
                      <td className="px-10 py-8 text-left">
                         <AnimatePresence mode="wait">
                          {record.status === 'pending' ? (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                              <Button
                                size="sm"
                                className="h-12 px-8 rounded-2xl bg-[#1a3a8f] hover:bg-[#152d6f] text-white font-black text-xs shadow-xl shadow-blue-900/10 transition-all hover:scale-105 active:scale-95 flex items-center gap-3"
                                onClick={() => checkInMutation.mutate(record.id)}
                                disabled={checkInMutation.isPending}
                              >
                                {checkInMutation.isPending ? (
                                  <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                  <>
                                    إثبات حضور المتقدم
                                    <UserCheck className="w-4 h-4" />
                                  </>
                                )}
                              </Button>
                            </motion.div>
                          ) : record.status === 'present' ? (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                               <Button
                                 variant="ghost"
                                 className="h-12 px-8 rounded-2xl bg-neutral-50 text-neutral-400 hover:text-rose-600 hover:bg-rose-50 border border-neutral-100 font-black text-xs transition-all gap-3"
                               >
                                 <UserX className="w-4 h-4" />
                                 إلغاء الحضور
                               </Button>
                            </motion.div>
                          ) : (
                            <Button variant="ghost" size="icon" className="h-12 w-12 rounded-2xl text-neutral-300 hover:bg-neutral-50 hover:text-neutral-900 transition-all">
                               <ChevronLeft className="w-6 h-6 rtl:rotate-180" />
                            </Button>
                          )}
                         </AnimatePresence>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="px-10 py-24 text-center">
                      <Users className="w-20 h-20 mx-auto text-neutral-200" />
                      <p className="text-xl font-black text-neutral-400 mt-4">لا يوجد سجلات مطابقة لعملية البحث</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Trust Footer */}
      <div className="flex justify-center pb-12 opacity-30 select-none">
         <div className="flex items-center gap-6 py-5 px-10 rounded-full border border-neutral-100 bg-white shadow-sm group hover:opacity-100 transition-opacity">
            <ShieldCheck className="w-6 h-6 text-[#1a3a8f]" />
            <span className="text-[11px] font-black uppercase tracking-[0.4em] text-neutral-500 font-mono">التحقق الانضباطي الموحد - بوابات الدخول السيادية</span>
         </div>
      </div>
    </div>
  );
}