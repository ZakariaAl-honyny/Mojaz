'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { Calendar, Plus, Loader2, ChevronLeft } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import appointmentService, { AppointmentDto } from '@/services/appointment.service';

const typeLabels: Record<number, string> = {
  0: 'الفحص الطبي',
  1: 'الاختبار النظري', 
  2: 'الاختبار العملي'
};

function AppointmentCard({ appointment, isPast }: { appointment: AppointmentDto; isPast?: boolean }) {
  return (
    <Link href={`/appointments/${appointment.id}`}>
      <Card className={cn("border-2 border-neutral-100 rounded-2xl hover:border-[#1a3a8f]/30 transition-all", isPast && "opacity-50")}>
        <CardContent className="p-6 flex items-center justify-between gap-6">
          <div className="flex items-center gap-4 flex-1">
            <div className={cn(
              "w-14 h-14 rounded-xl flex items-center justify-center text-xl font-bold",
              appointment.status === 'Scheduled' ? "bg-blue-50 text-blue-600" : "bg-neutral-100 text-neutral-400"
            )}>
              {typeLabels[appointment.appointmentType]?.[0] || 'ع'}
            </div>
            <div>
              <p className="text-lg font-bold">{typeLabels[appointment.appointmentType] || 'موعد'}</p>
              <p className="text-sm text-neutral-400">{appointment.branchName}</p>
            </div>
          </div>
          <div className="text-left pl-6 border-r border-neutral-100">
            <p className="text-sm text-neutral-400 mb-1">{appointment.scheduledDate}</p>
            <p className="text-xl font-bold">{appointment.timeSlot}</p>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

export default function AppointmentsPage() {
  const [activeTab, setActiveTab] = useState<'upcoming' | 'history'>('upcoming');

  const mockAppointments: AppointmentDto[] = [
    { id: 1, applicationId: 1, applicationNumber: 'MOJ-2026-11000001', appointmentType: 0, branchId: 1, branchName: 'مركز تعليم القيادة المركزي', scheduledDate: '2026-05-05', timeSlot: '09:00', status: 'Scheduled', assignedStaffId: null, notes: null, cancellationReason: null, rescheduleCount: 0, reminderSent: false, createdAt: '', updatedAt: null },
    { id: 2, applicationId: 2, applicationNumber: 'MOJ-2026-11000002', appointmentType: 1, branchId: 2, branchName: 'مركز الاختبارات النظري', scheduledDate: '2026-05-12', timeSlot: '10:00', status: 'Scheduled', assignedStaffId: null, notes: null, cancellationReason: null, rescheduleCount: 0, reminderSent: false, createdAt: '', updatedAt: null }
  ];

  const { data: appointmentsData, isLoading } = useQuery({
    queryKey: ['my-appointments'],
    queryFn: () => appointmentService.getMyAppointments(),
  });

  const appointments = appointmentsData?.success && appointmentsData?.data?.length > 0 ? appointmentsData.data : mockAppointments;
  const today = new Date().toISOString().split('T')[0];
  const upcoming = appointments.filter(a => a.scheduledDate >= today && a.status !== 'Cancelled');
  const history = appointments.filter(a => a.scheduledDate < today || a.status === 'Completed');
  const list = activeTab === 'upcoming' ? upcoming : history;

  return (
    <div className="max-w-2xl mx-auto p-6 font-arabic" dir="rtl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Link href="/dashboard" className="p-2 rounded-lg hover:bg-neutral-100">
            <ChevronLeft className="w-6 h-6 text-neutral-600" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold">المواعيد</h1>
            <p className="text-sm text-neutral-400">جدول زياراتك للمرور</p>
          </div>
        </div>
        <Link href="/appointments/book">
          <Button className="h-12 px-6 rounded-xl bg-[#1a3a8f] text-base font-bold">
            <Plus className="w-5 h-5 me-2" />
            حجز موعد جديد
          </Button>
        </Link>
      </div>

      {/* Tabs */}
      <div className="flex gap-3 mb-6">
        <button 
          onClick={() => setActiveTab('upcoming')} 
          className={cn(
            "flex-1 py-4 px-6 rounded-xl text-base font-bold text-center",
            activeTab === 'upcoming' ? "bg-[#1a3a8f] text-white shadow-lg" : "bg-white text-neutral-600 border border-neutral-200"
          )}
        >
          المواعيد النشطة ({upcoming.length})
        </button>
        <button 
          onClick={() => setActiveTab('history')} 
          className={cn(
            "flex-1 py-4 px-6 rounded-xl text-base font-bold text-center",
            activeTab === 'history' ? "bg-[#1a3a8f] text-white shadow-lg" : "bg-white text-neutral-600 border border-neutral-200"
          )}
        >
          السجل ({history.length})
        </button>
      </div>

      {/* List */}
      {isLoading ? (
        <div className="py-16 text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-[#1a3a8f]" />
          <p className="mt-4 text-neutral-400">جاري التحميل...</p>
        </div>
      ) : (
        <div className="space-y-4">
          {list.map(appointment => (
            <AppointmentCard 
              key={appointment.id} 
              appointment={appointment} 
              isPast={activeTab === 'history'} 
            />
          ))}
          {list.length === 0 && (
            <div className="py-16 text-center bg-neutral-50 rounded-2xl">
              <Calendar className="w-16 h-16 text-neutral-300 mx-auto mb-4" />
              <p className="text-lg text-neutral-400">
                {activeTab === 'upcoming' ? 'لا توجد مواعيد نشطة' : 'سجل المواعيد فارٍ'}
              </p>
              <p className="text-sm text-neutral-400 mt-2">قم بحجز موعد جديد للبدء</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}