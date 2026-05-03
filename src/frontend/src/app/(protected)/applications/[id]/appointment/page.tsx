'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';

import { Calendar, Clock, MapPin, AlertCircle, CheckCircle, Loader2 } from 'lucide-react';
import { AppointmentCalendar } from '@/components/domain/appointment/AppointmentCalendar';
import { TimeSlotPicker } from '@/components/domain/appointment/TimeSlotPicker';
import AppointmentService, {
  AvailableSlotDto,
  DaySlotsDto,
  CreateAppointmentRequest
} from '@/services/appointment.service';
import { paymentService, FeeType, PaymentStatus } from '@/services/payment.service';
import { AppointmentType } from '@/lib/enums';
import { cn } from '@/lib/utils';

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function AppointmentBookingPage({ params }: PageProps) {
  const resolvedParams = use(params);

  const router = useRouter();

  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<AvailableSlotDto | null>(null);
  const [availableSlots, setAvailableSlots] = useState<DaySlotsDto[]>([]);
  const [isLoadingSlots, setIsLoadingSlots] = useState(false);
  const [isBooking, setIsBooking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [appointmentType, setAppointmentType] = useState<AppointmentType>(AppointmentType.PracticalTest);
  // Default branch - in a real app this would come from user context or settings
  const branchId = '00000000-0000-0000-0000-000000000001';

  // Check if application fee is paid before allowing booking
  const { data: paymentsData } = useQuery({
    queryKey: ['application-payments', resolvedParams.id],
    queryFn: () => paymentService.getPaymentsByApplication(resolvedParams.id),
    enabled: !!resolvedParams.id
  });

  const hasApplicationFeePaid = paymentsData?.data?.some(
    p => p.feeType === FeeType.ApplicationFee && p.status === PaymentStatus.Paid
  ) ?? false;

  useEffect(() => {
    if (!hasApplicationFeePaid && paymentsData) {
      setError("يجب سداد رسوم الطلب أولاً قبل حجز الموعد. يرجى الذهاب إلى تفاصيل الطلب وسداد الرسوم.");
    }
  }, [hasApplicationFeePaid, paymentsData]);

  // If fee not paid, show medical exam as the default option to allow booking first
  useEffect(() => {
    if (!hasApplicationFeePaid && paymentsData) {
      setAppointmentType(AppointmentType.MedicalExam);
    }
  }, [hasApplicationFeePaid, paymentsData]);

  // Fetch available slots when date changes - inline pattern to avoid hook ordering issues
  useEffect(() => {
    if (!selectedDate) return;
    
    let isMounted = true;
    
    const fetchSlots = async () => {
      setIsLoadingSlots(true);
      setError(null);

      try {
        const dateStr = selectedDate.toISOString().split('T')[0];
        const response = await AppointmentService.getAvailableSlots(
          appointmentType,
          branchId,
          dateStr
        );

        if (isMounted) {
          if (response.success && response.data) {
            setAvailableSlots(response.data);
          } else {
            setError(response.message || 'فشل تحميل المواعيد المتاحة');
          }
        }
      } catch (err) {
        if (isMounted) {
          setError('فشل تحميل المواعيد المتاحة، يرجى المحاولة مرة أخرى');
        }
      } finally {
        if (isMounted) {
          setIsLoadingSlots(false);
        }
      }
    };
    
    fetchSlots();
    
    return () => {
      isMounted = false;
    };
  }, [selectedDate, appointmentType, branchId]);

  const handleSlotSelect = (slot: AvailableSlotDto) => {
    setSelectedSlot(slot);
  };

  const handleBookAppointment = async () => {
    if (!selectedDate || !selectedSlot) return;

    setIsBooking(true);
    setError(null);

    try {
      const request: CreateAppointmentRequest = {
        applicationId: Number(resolvedParams.id),
        type: appointmentType,
        branchId: Number(branchId),
        scheduledDate: selectedDate.toISOString().split('T')[0],
        timeSlot: selectedSlot.time
      };

      const response = await AppointmentService.createAppointment(resolvedParams.id, request);

      if (response.success) {
        setSuccess(true);
        // Redirect to application detail after a short delay
        setTimeout(() => {
          router.push(`/applications/${resolvedParams.id}`);
        }, 2000);
      } else {
        setError(response.message || 'فشلت عملية حجز الموعد');
      }
    } catch (err) {
      setError('خطأ في حجز الموعد، يرجى المحاولة مرة أخرى لاحقاً');
    } finally {
      setIsBooking(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center p-4" dir="rtl">
        <div className="bg-white rounded-xl p-8 shadow-lg max-w-md w-full text-center">
          <CheckCircle className="w-16 h-16 text-[#10B981] mx-auto mb-4" />
          <h2 className="text-2xl font-black text-neutral-900 mb-2">
            تم حجز الموعد بنجاح
          </h2>
          <p className="text-neutral-500 font-bold">
            {selectedDate?.toLocaleDateString('ar-YE', { day: '2-digit', month: 'long', year: 'numeric' })} في تمام الساعة {selectedSlot?.time}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 p-4 md:p-8 font-arabic" dir="rtl">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8 border-r-4 border-[#1a3a8f] pr-6">
          <h1 className="text-2xl md:text-3xl font-black text-neutral-900">
            حجز موعد جديد
          </h1>
          <p className="text-neutral-500 font-bold mt-1 text-lg">
            يرجى اختيار التاريخ والوقت المناسبين للموعد
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-[#EF4444] flex-shrink-0" />
            <p className="text-[#EF4444] font-bold">{error}</p>
          </div>
        )}

        {/* Type Selection */}
        <div className="mb-4">
          <label className="block text-sm font-black text-neutral-700 mb-2">
            نوع الموعد
          </label>
          <div className="flex gap-2">
            {([AppointmentType.MedicalExam, AppointmentType.TheoryTest, AppointmentType.PracticalTest] as AppointmentType[]).map((type) => (
              <button
                key={type}
                onClick={() => {
                  setAppointmentType(type);
                  setSelectedDate(null);
                  setSelectedSlot(null);
                  setAvailableSlots([]);
                }}
                className={cn(
                  'px-4 py-2 rounded-lg text-sm font-medium transition-all',
                  appointmentType === type
                    ? 'bg-[#1a3a8f] text-white shadow-lg shadow-blue-900/20'
                    : 'bg-white text-neutral-500 border border-neutral-200 hover:border-[#1a3a8f] hover:text-[#1a3a8f]'
                )}
              >
                {type === AppointmentType.MedicalExam ? 'فحص طبي' : type === AppointmentType.TheoryTest ? 'اختبار نظري' : 'اختبار عملي'}
              </button>
            ))}
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Calendar */}
          <AppointmentCalendar
            selectedDate={selectedDate}
            onDateSelect={setSelectedDate}
          />

          {/* Time Slots */}
          <div>
            {selectedDate ? (
              <TimeSlotPicker
                slots={availableSlots.length > 0 ? availableSlots[0].slots : []}
                selectedSlot={selectedSlot?.time || null}
                onSlotSelect={handleSlotSelect}
                isLoading={isLoadingSlots}
              />
            ) : (
              <div className="bg-white rounded-xl p-10 shadow-sm text-center border border-neutral-100">
                <Calendar className="w-16 h-16 text-neutral-200 mx-auto mb-4" />
                <p className="text-neutral-400 font-black text-lg">
                  اختر تاريخ الموعد أولاً
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Selected Summary & Book Button */}
        {selectedDate && selectedSlot && (
          <div className="mt-8 bg-white rounded-xl p-8 shadow-sm border border-neutral-100">
            <h3 className="text-xl font-black text-neutral-900 mb-6 border-b pb-4">
              تأكيد تفاصيل الحجز
            </h3>

            <div className="flex flex-wrap gap-4 mb-4">
              <div className="flex items-center gap-3 bg-neutral-50 px-4 py-3 rounded-xl border border-neutral-100">
                <Calendar className="w-5 h-5 text-[#D4A017]" />
                <span className="text-neutral-900 font-black">
                  {selectedDate.toLocaleDateString('ar-YE', { day: '2-digit', month: 'long', year: 'numeric' })}
                </span>
              </div>
              <div className="flex items-center gap-3 bg-neutral-50 px-4 py-3 rounded-xl border border-neutral-100">
                <Clock className="w-5 h-5 text-[#1a3a8f]" />
                <span className="text-neutral-900 font-black">
                  {selectedSlot.time}
                </span>
              </div>
            </div>

            <button
              onClick={handleBookAppointment}
              disabled={isBooking}
              className={cn(
                'w-full md:w-auto px-10 py-4 rounded-xl font-black transition-all text-lg',
                'bg-[#1a3a8f] text-white hover:bg-[#152d6f] shadow-lg shadow-blue-900/20',
                'disabled:opacity-50 disabled:cursor-not-allowed',
                'flex items-center justify-center gap-3'
              )}
            >
              {isBooking ? (
                <>
                  <Loader2 className="w-6 h-6 animate-spin" />
                  جاري معالجة الطلب...
                </>
              ) : (
                <>
                  <CheckCircle className="w-6 h-6" />
                  تأكيد وحجز الموعد الآن
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}