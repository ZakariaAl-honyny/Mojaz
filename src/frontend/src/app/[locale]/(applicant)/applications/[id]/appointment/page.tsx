'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Calendar, Clock, MapPin, AlertCircle, CheckCircle, Loader2 } from 'lucide-react';
import { AppointmentCalendar } from '@/components/domain/appointment/AppointmentCalendar';
import { TimeSlotPicker } from '@/components/domain/appointment/TimeSlotPicker';
import AppointmentService, { 
  AppointmentType, 
  AvailableSlotDto, 
  DaySlotsDto,
  CreateAppointmentRequest 
} from '@/services/appointment.service';
import { cn } from '@/lib/utils';

interface PageProps {
  params: Promise<{ 
    locale: string;
    id: string;
  }>;
}

export default function AppointmentBookingPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const t = useTranslations('appointment');
  const router = useRouter();
  
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<AvailableSlotDto | null>(null);
  const [availableSlots, setAvailableSlots] = useState<DaySlotsDto[]>([]);
  const [isLoadingSlots, setIsLoadingSlots] = useState(false);
  const [isBooking, setIsBooking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  
  const [appointmentType, setAppointmentType] = useState<AppointmentType>('PracticalTest');
  // Default branch - in a real app this would come from user context or settings
  const branchId = '00000000-0000-0000-0000-000000000001';

  // Load slots when date changes
  useEffect(() => {
    if (selectedDate) {
      loadAvailableSlots();
    }
  }, [selectedDate]);

  const loadAvailableSlots = async () => {
    if (!selectedDate) return;
    
    setIsLoadingSlots(true);
    setError(null);
    
    try {
      const dateStr = selectedDate.toISOString().split('T')[0];
      const response = await AppointmentService.getAvailableSlots(
        appointmentType,
        branchId,
        dateStr
      );
      
      if (response.success && response.data) {
        setAvailableSlots(response.data);
      } else {
        setError(response.message || 'Failed to load available slots');
      }
    } catch (err) {
      setError('Failed to load available slots. Please try again.');
    } finally {
      setIsLoadingSlots(false);
    }
  };

  const handleSlotSelect = (slot: AvailableSlotDto) => {
    setSelectedSlot(slot);
  };

  const handleBookAppointment = async () => {
    if (!selectedDate || !selectedSlot) return;
    
    setIsBooking(true);
    setError(null);
    
    try {
      const request: CreateAppointmentRequest = {
        applicationId: resolvedParams.id,
        type: appointmentType,
        branchId: branchId,
        scheduledDate: selectedDate.toISOString().split('T')[0],
        timeSlot: selectedSlot.time
      };
      
      const response = await AppointmentService.createAppointment(request);
      
      if (response.success) {
        setSuccess(true);
        // Redirect to application detail after a short delay
        setTimeout(() => {
          router.push(`/${resolvedParams.locale}/applications/${resolvedParams.id}`);
        }, 2000);
      } else {
        setError(response.message || 'Failed to book appointment');
      }
    } catch (err) {
      setError('Failed to book appointment. Please try again.');
    } finally {
      setIsBooking(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg max-w-md w-full text-center">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            {t('bookingSuccess')}
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            {selectedDate?.toLocaleDateString()} at {selectedSlot?.time}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
            {t('title')}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            {t('selectDate')} & {t('selectTime')}
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
            <p className="text-red-700 dark:text-red-400">{error}</p>
          </div>
        )}

        {/* Type Selection */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Type
          </label>
          <div className="flex gap-2">
            {(['MedicalExam', 'TheoryTest', 'PracticalTest'] as AppointmentType[]).map((type) => (
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
                    ? 'bg-primary-500 text-white'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:border-primary-500'
                )}
              >
                {t(`types.${type === 'MedicalExam' ? 'medicalExam' : type === 'TheoryTest' ? 'theoryTest' : 'practicalTest'}`)}
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
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm text-center">
                <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600 dark:text-gray-400">
                  {t('selectDate')}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Selected Summary & Book Button */}
        {selectedDate && selectedSlot && (
          <div className="mt-6 bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              {t('confirmBooking')}
            </h3>
            
            <div className="flex flex-wrap gap-4 mb-4">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-primary-500" />
                <span className="text-gray-700 dark:text-gray-300">
                  {selectedDate.toLocaleDateString()}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-primary-500" />
                <span className="text-gray-700 dark:text-gray-300">
                  {selectedSlot.time}
                </span>
              </div>
            </div>

            <button
              onClick={handleBookAppointment}
              disabled={isBooking}
              className={cn(
                'w-full md:w-auto px-6 py-3 rounded-lg font-medium transition-all',
                'bg-primary-500 text-white hover:bg-primary-600',
                'disabled:opacity-50 disabled:cursor-not-allowed',
                'flex items-center justify-center gap-2'
              )}
            >
              {isBooking ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <CheckCircle className="w-5 h-5" />
                  {t('book')}
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}