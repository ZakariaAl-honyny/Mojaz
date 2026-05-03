'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import appointmentService, { CreateAppointmentRequest } from '@/services/appointment.service';
import ApplicationService from '@/services/application.service';
import { AppointmentType, ApplicationStatus } from '@/lib/enums';
import { ApplicationStatusLabels } from '@/lib/enumMappers';
import { Stethoscope, GraduationCap, Car, Check, Loader2, ChevronLeft, ChevronRight, AlertCircle } from 'lucide-react';

const typeToEnum: Record<string, AppointmentType> = {
  'medical': AppointmentType.MedicalExam,
  'theory': AppointmentType.TheoryTest,
  'practical': AppointmentType.PracticalTest
};

const appointmentTypes = [
  { id: 'medical', type: 'medical', label: 'الفحص الطبي', icon: Stethoscope, color: 'bg-blue-50', textColor: 'text-blue-600' },
  { id: 'theory', type: 'theory', label: 'الاختبار النظري', icon: GraduationCap, color: 'bg-purple-50', textColor: 'text-purple-600' },
  { id: 'practical', type: 'practical', label: 'الاختبار العملي', icon: Car, color: 'bg-primary-50', textColor: 'text-primary-600' }
];

// Generate dates for next 2 weeks
const generateDates = () => {
  const dates: { date: Date; day: number; weekday: string; available: boolean }[] = [];
  const today = new Date();
  const startFrom = new Date(today);
  startFrom.setDate(today.getDate() + 1); // Start from tomorrow

  for (let i = 0; i < 14; i++) {
    const date = new Date(startFrom);
    date.setDate(startFrom.getDate() + i);
    const isFriday = date.getDay() === 5;
    dates.push({
      date,
      day: date.getDate(),
      weekday: date.toLocaleDateString('ar-YE', { weekday: 'short' }),
      available: !isFriday
    });
  }
  return dates;
};

const mockDates = generateDates();
const DEFAULT_BRANCH_ID = '1'; // Backend uses int BranchId (1-3)

export default function BookAppointmentPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [applicationId, setApplicationId] = useState<string>('');

  const totalSteps = 4;

  const { data: applicationsData, isLoading: appsLoading } = useQuery({
    queryKey: ['my-applications'],
    queryFn: async () => {
      const response = await ApplicationService.getApplications({ page: 1, pageSize: 50 });
      return response.data?.items || [];
    }
  });

  const eligibleApplications = applicationsData?.filter((app: any) => {
    const status = typeof app.status === 'number' ? app.status : app.status;
    // Issued = 15, Active = 16, Rejected = 17, Cancelled = 18
    return ![15, 16, 17, 18, 'Issued', 'Active', 'Cancelled', 'Rejected'].includes(status);
  }) || [];

  useEffect(() => {
    if (eligibleApplications.length > 0 && !applicationId) {
      setApplicationId(eligibleApplications[0].id.toString());
    }
  }, [eligibleApplications, applicationId]);

  const handleNext = () => currentStep < totalSteps && setCurrentStep(currentStep + 1);
  const handleBack = () => currentStep > 1 && setCurrentStep(currentStep - 1);

  const selectedApp = eligibleApplications.find((app: any) => app.id.toString() === applicationId);

  const getStageNumber = (app: any): number => {
    if (!app) return 0;
    
    // 1. Direct field from DTO (if added later)
    if (app.currentStageNumber) return app.currentStageNumber;
    
    // 2. Parse from string "04: Medical" or "04-Medical"
    if (app.currentStage) {
      const match = app.currentStage.match(/^(\d+)/);
      if (match) return parseInt(match[1]);
    }
    
    // 3. Fallback to numeric status if it's a number
    if (typeof app.status === 'number') return app.status;
    
    // 4. Map from string status
    const statusMap: Record<string, number> = {
      'Draft': 0,
      'Submitted': 1,
      'DocumentReview': 2,
      'InReview': 3,
      'MedicalExam': 4,
      'Training': 5,
      'TheoryTest': 6,
      'PracticalTest': 7,
      'FinalApproval': 8,
      'IssuancePayment': 9,
      'Issuance': 10
    };
    
    return statusMap[app.status] || 0;
  };

  const getEligibility = (typeId: string) => {
    if (!selectedApp) return { eligible: false, message: 'يرجى اختيار الطلب أولاً' };
    
    const type = appointmentTypes.find(t => t.id === typeId);
    if (!type) return { eligible: false, message: '' };

    // Get robust numeric stage number
    const stageNum = getStageNumber(selectedApp);

    if (typeId === 'medical') {
      // Relaxed for testing: allow booking if Submitted (1) or later
      if (stageNum < 1) return { eligible: false, message: 'يجب تقديم الطلب أولاً' };
      if (stageNum > 4) return { eligible: false, message: 'لقد تجاوزت هذه المرحلة بالفعل' };
      return { eligible: true, message: '' };
    }

    if (typeId === 'theory') {
      // Must be at MedicalExam (4), Training (5), or Theory (6)
      if (stageNum < 4) return { eligible: false, message: 'يجب إكمال الفحص الطبي والدورة التدريبية أولاً' };
      if (stageNum > 6) return { eligible: false, message: 'لقد تجاوزت هذه المرحلة بالفعل' };
      return { eligible: true, message: '' };
    }

    if (typeId === 'practical') {
      // Must be at Theory (6) or Practical (7)
      if (stageNum < 6) return { eligible: false, message: 'يجب اجتياز الاختبار النظري أولاً' };
      if (stageNum > 7) return { eligible: false, message: 'لقد تجاوزت هذه المرحلة بالفعل' };
      return { eligible: true, message: '' };
    }

    return { eligible: true, message: '' };
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1: return !!applicationId;
      case 2: return !!selectedType && getEligibility(selectedType).eligible;
      case 3: return !!selectedDate;
      case 4: return !!selectedTime;
    }
  };

  const handleConfirmBooking = async () => {
    if (!selectedType || !selectedDate || !selectedTime) return;
    setIsProcessing(true);
    
    try {
      const request: CreateAppointmentRequest = {
        applicationId: parseInt(applicationId),
        type: typeToEnum[selectedType],
        branchId: parseInt(DEFAULT_BRANCH_ID),
        scheduledDate: selectedDate.toISOString().split('T')[0],
        timeSlot: selectedTime,
        notes: ''
      };
      await appointmentService.createAppointment(applicationId, request);
      toast.success('تم حجز الموعد بنجاح');
      router.push('/appointments');
    } catch (error: any) {
      const apiErrors = error?.response?.data?.errors;
      const errorMsg = (apiErrors && Array.isArray(apiErrors) && apiErrors.length > 0) 
        ? apiErrors[0] 
        : error?.response?.data?.message || error?.message || 'فشل في حجز الموعد';
      
      toast.error(errorMsg);
      console.error('[Booking] Error:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-2">
            <p className="text-sm text-neutral-500 font-bold mb-4">اختر الطلب الذي ترغب بحجز موعد له:</p>
            {appsLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-[#1a3a8f] opacity-20" />
              </div>
            ) : eligibleApplications.length === 0 ? (
              <div className="text-center py-8 bg-neutral-50 rounded-2xl border border-dashed border-neutral-200">
                <p className="text-sm text-neutral-500 font-bold mb-4">لا توجد لديك طلبات نشطة حالياً</p>
                <Button onClick={() => router.push('/applications/new')} className="bg-[#1a3a8f] rounded-xl">
                  إنشاء طلب جديد
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {eligibleApplications.map((app: any) => {
                  const statusLabel = ApplicationStatusLabels[app.status as keyof typeof ApplicationStatusLabels] || app.status;
                  return (
                    <button
                      key={app.id}
                      onClick={() => setApplicationId(app.id.toString())}
                      className={cn(
                        "w-full p-4 rounded-2xl border-2 text-start transition-all relative overflow-hidden group",
                        applicationId === app.id.toString()
                          ? "border-[#1a3a8f] bg-[#1a3a8f]/5 shadow-md"
                          : "border-neutral-100 hover:border-neutral-200 bg-white"
                      )}
                    >
                      <div className="flex items-center justify-between relative z-10">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                             <p className="text-sm font-black text-neutral-900">{app.applicationNumber}</p>
                             {applicationId === app.id.toString() && <Check className="w-4 h-4 text-[#1a3a8f]" />}
                          </div>
                          <p className="text-xs text-neutral-500 font-bold">فئة {app.licenseCategoryNameAr || app.licenseCategory}</p>
                        </div>
                        <span className={cn(
                          "text-[10px] px-2 py-1 rounded-lg font-black",
                          applicationId === app.id.toString() ? "bg-[#1a3a8f] text-white" : "bg-neutral-100 text-neutral-600"
                        )}>
                          {statusLabel}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <p className="text-sm text-neutral-500 font-bold">اختر نوع الموعد المتاح لطلبك:</p>
            <div className="grid grid-cols-1 gap-3">
              {appointmentTypes.map((type) => {
                const Icon = type.icon;
                const { eligible, message } = getEligibility(type.id);
                
                return (
                  <button
                    key={type.id}
                    disabled={!eligible}
                    onClick={() => eligible && setSelectedType(type.id)}
                    className={cn(
                      "p-4 rounded-2xl border-2 text-start transition-all flex items-center justify-between group",
                      !eligible ? "opacity-50 grayscale bg-neutral-50 cursor-not-allowed border-neutral-100" :
                      selectedType === type.id
                        ? "border-[#1a3a8f] bg-[#1a3a8f]/5 shadow-md"
                        : "border-neutral-100 hover:border-neutral-200 bg-white"
                    )}
                  >
                    <div className="flex items-center gap-4">
                      <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110", type.color)}>
                        <Icon className={cn("w-6 h-6", type.textColor)} />
                      </div>
                      <div>
                        <span className="text-sm font-black block text-neutral-900">{type.label}</span>
                        {!eligible && (
                          <div className="flex items-center gap-1 mt-1 text-rose-500">
                            <AlertCircle className="w-3 h-3" />
                            <span className="text-[10px] font-bold">{message}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    {eligible && selectedType === type.id && (
                      <div className="w-6 h-6 rounded-full bg-[#1a3a8f] flex items-center justify-center">
                        <Check className="w-4 h-4 text-white" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <p className="text-sm text-neutral-500 font-bold">اختر التاريخ المفضل للموعد:</p>
            <div className="grid grid-cols-7 gap-2">
              {mockDates.map((dateObj, index) => (
                <button
                  key={index}
                  onClick={() => dateObj.available && setSelectedDate(dateObj.date)}
                  disabled={!dateObj.available}
                  className={cn(
                    "aspect-square rounded-xl flex flex-col items-center justify-center transition-all border-2",
                    selectedDate?.toDateString() === dateObj.date.toDateString()
                      ? "bg-[#1a3a8f] border-[#1a3a8f] text-white shadow-lg scale-105"
                      : dateObj.available
                        ? "bg-white border-neutral-100 hover:border-[#1a3a8f]/30 hover:bg-[#1a3a8f]/5"
                        : "bg-neutral-50 border-transparent text-neutral-300 cursor-not-allowed"
                  )}
                >
                  <span className="text-[9px] font-black opacity-60 uppercase mb-0.5">{dateObj.weekday}</span>
                  <span className="font-black text-sm">{dateObj.day}</span>
                </button>
              ))}
            </div>
          </div>
        );

      case 4:
        const timeSlots = [
          { id: '1', time: '08:00', available: true },
          { id: '2', time: '09:00', available: true },
          { id: '3', time: '10:00', available: true },
          { id: '4', time: '11:00', available: false },
          { id: '5', time: '12:00', available: true },
          { id: '6', time: '14:00', available: true },
          { id: '7', time: '15:00', available: true },
        ];
        return (
          <div className="space-y-4">
            <p className="text-sm text-neutral-500 font-bold">اختر الوقت المناسب لك:</p>
            <div className="grid grid-cols-3 gap-3">
              {timeSlots.map((slot) => (
                <button
                  key={slot.id}
                  onClick={() => slot.available && setSelectedTime(slot.time)}
                  disabled={!slot.available}
                  className={cn(
                    "p-3 rounded-xl border-2 text-center transition-all font-black text-sm",
                    selectedTime === slot.time
                      ? "bg-[#1a3a8f] border-[#1a3a8f] text-white shadow-lg"
                      : slot.available
                        ? "bg-white border-neutral-100 hover:border-[#1a3a8f]/30 hover:bg-[#1a3a8f]/5"
                        : "bg-neutral-50 border-transparent text-neutral-300 cursor-not-allowed line-through"
                  )}
                >
                  {slot.time}
                </button>
              ))}
            </div>
          </div>
        );
    }
  };

  return (
    <div className="max-w-lg mx-auto p-4 font-arabic pb-20" dir="rtl">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-black text-neutral-900">حجز موعد جديد</h1>
        <p className="text-sm text-neutral-500 font-bold mt-1">يرجى اتباع الخطوات لحجز موعدك بنجاح</p>
      </div>

      {/* Progress */}
      <div className="flex items-center gap-2 mb-8">
        {[1, 2, 3, 4].map((step) => (
          <div key={step} className="flex-1 h-2 rounded-full overflow-hidden bg-neutral-100 border border-neutral-200/50">
            <div className={cn(
              "h-full transition-all duration-500 ease-out",
              step <= currentStep ? "bg-gradient-to-r from-[#1a3a8f] to-[#2a4abf]" : "bg-transparent"
            )} />
          </div>
        ))}
      </div>

      {/* Step indicator */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex flex-col">
          <span className="text-[10px] font-black text-[#1a3a8f] uppercase tracking-widest">الخطوة {currentStep} من 4</span>
          <span className="text-lg font-black text-neutral-900">
            {['اختيار الطلب', 'نوع الموعد', 'التاريخ', 'الوقت'][currentStep - 1]}
          </span>
        </div>
        <div className="w-10 h-10 rounded-xl bg-[#1a3a8f]/5 flex items-center justify-center border border-[#1a3a8f]/10">
           <span className="font-black text-[#1a3a8f]">{currentStep}</span>
        </div>
      </div>

      {/* Content */}
      <div className="min-h-[300px]">
        {renderStep()}
      </div>

      {/* Navigation */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/80 backdrop-blur-md border-t border-neutral-100 flex gap-3 z-50">
        <div className="max-w-lg mx-auto w-full flex gap-3">
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={currentStep === 1}
            className="h-12 flex-1 rounded-xl text-sm font-black border-2 hover:bg-neutral-50"
          >
            <ChevronLeft className="w-5 h-5 ms-1" />
            السابق
          </Button>
          {currentStep < totalSteps ? (
            <Button 
              onClick={handleNext} 
              disabled={!canProceed()} 
              className="h-12 flex-1 rounded-xl text-sm font-black bg-[#1a3a8f] hover:bg-[#1a3a8f]/90 shadow-lg shadow-[#1a3a8f]/20"
            >
              التالي
              <ChevronRight className="w-5 h-5 me-1" />
            </Button>
          ) : (
            <Button 
              onClick={handleConfirmBooking} 
              disabled={isProcessing} 
              className="h-12 flex-1 rounded-xl text-sm font-black bg-emerald-600 hover:bg-emerald-700 shadow-lg shadow-emerald-600/20"
            >
              {isProcessing ? <Loader2 className="w-5 h-5 animate-spin" /> : 'تأكيد وحجز الموعد'}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
