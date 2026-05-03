'use client';

import { useState } from 'react';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useQuery, useMutation } from '@tanstack/react-query';
import {
  Calendar,
  Clock,
  MapPin,
  ArrowLeft,
  Stethoscope,
  GraduationCap,
  Car,
  CalendarPlus,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { AppointmentStatus } from '@/lib/enums';
import appointmentService, { AppointmentDto, CancelAppointmentRequest } from '@/services/appointment.service';

// Helper to get type icon
const getTypeIcon = (type: number) => {
  switch (type) {
    case 0: // MedicalExam
      return <Stethoscope className="w-6 h-6" />;
    case 1: // TheoryTest
      return <GraduationCap className="w-6 h-6" />;
    case 2: // PracticalTest
      return <Car className="w-6 h-6" />;
    default:
      return <Calendar className="w-6 h-6" />;
  }
};

// Helper to get type display color
const getTypeColor = (type: number) => {
  switch (type) {
    case 0: // MedicalExam
      return 'bg-blue-50 text-blue-600';
    case 1: // TheoryTest
      return 'bg-purple-50 text-purple-600';
    case 2: // PracticalTest
      return 'bg-primary-50 text-primary-600';
    default:
      return 'bg-neutral-50 text-neutral-600';
  }
};

// Helper to get type name in Arabic
const getTypeName = (type: number) => {
  switch (type) {
    case 0:
      return 'الفحص الطبي';
    case 1:
      return 'الاختبار النظري';
    case 2:
      return 'الاختبار العملي';
    default:
      return 'موعد';
  }
};

// Helper to get status variant
const getStatusVariant = (status: string) => {
  switch (status) {
    case 'Scheduled':
      return 'success';
    case 'Completed':
      return 'default';
    case 'Cancelled':
      return 'destructive';
    case 'NoShow':
      return 'warning';
    default:
      return 'info';
  }
};

// Helper to get status name in Arabic
const getStatusName = (status: string) => {
  switch (status) {
    case 'Scheduled':
      return 'مؤكد';
    case 'Completed':
      return 'مكتمل';
    case 'Cancelled':
      return 'ملغي';
    case 'NoShow':
      return 'لم يحضر';
    default:
      return status;
  }
};

function AppointmentDetailsPage() {
  const params = useParams();
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [cancelReason, setCancelReason] = useState('');

  const appointmentId = parseInt(params.id as string, 10);

  // Mock appointment for demo
  const mockAppointment: AppointmentDto = {
    id: appointmentId,
    applicationId: 1,
    applicationNumber: 'MOJ-2026-11000001',
    appointmentType: 0,
    branchId: 1,
    branchName: 'مركز تعليم القيادة المركزي',
    scheduledDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    timeSlot: '09:00',
    status: 'Scheduled',
    assignedStaffId: null,
    notes: null,
    cancellationReason: null,
    rescheduleCount: 0,
    reminderSent: false,
    createdAt: new Date().toISOString(),
    updatedAt: null,
  };

  // Fetch appointment from API
  const { data: appointmentData, isLoading, error } = useQuery({
    queryKey: ['appointment', appointmentId],
    queryFn: () => appointmentService.getById(String(appointmentId)),
    enabled: !!appointmentId,
  });

  // Use API data or mock
  const appointment = appointmentData?.success ? appointmentData.data : mockAppointment;

  // Cancel mutation
  const cancelMutation = useMutation({
    mutationFn: (request: CancelAppointmentRequest) => 
      appointmentService.cancelAppointment(String(appointmentId), request),
    onSuccess: () => {
      setShowCancelDialog(false);
      // Refresh the page - in production, would invalidate query
      window.location.reload();
    },
  });

  const handleAddToCalendar = () => {
    if (!appointment) return;
    
    // Generate Google Calendar link (with validation)
    const dateStr = appointment?.scheduledDate || new Date().toISOString().split('T')[0];
    const timeStr = appointment?.timeSlot || '09:00';
    const startDateStr = `${dateStr}T${timeStr}:00`;
    
    if (!dateStr || !timeStr) {
      console.log('[Calendar] Invalid date/time');
      return;
    }
    
    const startDate = new Date(startDateStr);
    if (isNaN(startDate.getTime())) {
      console.log('[Calendar] Invalid start date:', startDateStr);
      return;
    }
    
    const endDate = new Date(startDate);
    endDate.setHours(endDate.getHours() + 1);

    try {
      const googleUrl = new URL('https://calendar.google.com/calendar/render');
      googleUrl.searchParams.set('action', 'TEMPLATE');
      googleUrl.searchParams.set('text', `${getTypeName(appointment.appointmentType)} - مُجاز`);
      googleUrl.searchParams.set('dates', `${startDate.toISOString().replace(/[-:]/g, '').split('.')[0]}Z/${endDate.toISOString().replace(/[-:]/g, '').split('.')[0]}Z`);
      googleUrl.searchParams.set('details', `موعد رخصة القيادة في ${appointment.branchName}`);
      googleUrl.searchParams.set('location', appointment.branchName || '');
      window.open(googleUrl.toString(), '_blank');
    } catch (err) {
      console.log('[Calendar] Error:', err);
    }
  };

  const handleCancelAppointment = () => {
    if (!cancelReason.trim()) return;
    cancelMutation.mutate({ reason: cancelReason });
  };

  const isActiveAppointment = appointment?.status === 'Scheduled';

  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary-500 mb-4" />
            <p className="text-neutral-500">جاري تحميل تفاصيل الموعد...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error || !appointment) {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <AlertCircle className="w-8 h-8 text-red-500 mb-4" />
            <p className="text-neutral-500">عذراً، لم يتم العثور على الموعد المطلوب</p>
            <Link href="/appointments" className="mt-4">
              <Button variant="outline">الرجوع إلى المواعيد</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Back Button */}
      <Link href="/appointments">
        <Button variant="ghost" size="sm">
          <ArrowLeft className="w-4 h-4 me-2 rtl:me-0 rtl:ms-2 rtl:rotate-180" />
          المواعيد
        </Button>
      </Link>

      {/* Main Card */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className={cn("p-4 rounded-xl", getTypeColor(appointment.appointmentType))}>
                {getTypeIcon(appointment.appointmentType)}
              </div>
              <div>
                <CardTitle className="text-xl">
                  {getTypeName(appointment.appointmentType)}
                </CardTitle>
                <CardDescription>
                  {appointment.branchName}
                </CardDescription>
              </div>
            </div>
            <Badge variant={getStatusVariant(appointment.status)}>
              {getStatusName(appointment.status)}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Date & Time */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-3 p-4 bg-neutral-50 rounded-xl">
              <Calendar className="w-5 h-5 text-neutral-500" />
              <div>
                <p className="text-sm text-neutral-500">التاريخ</p>
                <p className="font-semibold">
                  {new Date(appointment.scheduledDate).toLocaleDateString('ar-YE', { day: '2-digit', month: 'long', year: 'numeric' })}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 bg-neutral-50 rounded-xl">
              <Clock className="w-5 h-5 text-neutral-500" />
              <div>
                <p className="text-sm text-neutral-500">الوقت</p>
                <p className="font-semibold">{appointment.timeSlot}</p>
              </div>
            </div>
          </div>

          {/* Location */}
          {appointment.branchName && (
            <div className="flex items-start gap-3 p-4 bg-neutral-50 rounded-xl">
              <MapPin className="w-5 h-5 text-neutral-500 mt-0.5" />
              <div>
                <p className="text-sm text-neutral-500">الموقع</p>
                <p className="font-semibold">{appointment.branchName}</p>
              </div>
            </div>
          )}

          {/* Notes */}
          {appointment.notes && (
            <div className="p-4 bg-blue-50 rounded-xl">
              <p className="text-sm text-blue-600">{appointment.notes}</p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Button variant="outline" className="flex-1" onClick={handleAddToCalendar}>
              <CalendarPlus className="w-4 h-4 me-2 rtl:me-0 rtl:ms-2" />
              إضافة إلى التقويم
            </Button>

            {isActiveAppointment && (
              <>
                <Button variant="outline" className="flex-1">
                  إعادة جدولة
                </Button>
                <Button
                  variant="destructive"
                  className="flex-1"
                  onClick={() => setShowCancelDialog(true)}
                >
                  إلغاء الموعد
                </Button>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Cancel Dialog */}
      {showCancelDialog && (
        <Card className="border-red-200">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <AlertCircle className="w-6 h-6 text-red-500" />
              <h3 className="font-semibold text-lg">إلغاء الموعد</h3>
            </div>
            <p className="text-neutral-500 mb-4">
              هل أنت متأكد من رغبتك في إلغاء هذا الموعد؟ لا يمكن التراجع عن هذا الإجراء بعد التنفيذ.
            </p>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">سبب الإلغاء (اختياري)</label>
              <textarea
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                className="w-full p-3 border border-neutral-200 rounded-lg"
                rows={3}
                placeholder="أدخل سبب الإلغاء إن وجد..."
              />
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setShowCancelDialog(false)}>
                تراجع
              </Button>
              <Button 
                variant="destructive" 
                onClick={handleCancelAppointment}
                disabled={cancelMutation.isPending}
              >
                {cancelMutation.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 me-2 animate-spin" />
                    جاري الإلغاء...
                  </>
                ) : (
                  'تأكيد الإلغاء'
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export default function Page() {
  return <AppointmentDetailsPage />;
}