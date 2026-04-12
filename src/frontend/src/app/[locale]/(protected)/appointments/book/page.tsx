'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from '@/i18n/routing';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  ChevronRight, 
  ChevronLeft,
  Stethoscope, 
  GraduationCap, 
  Car,
  Check,
  Loader2
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

// Types
interface AppointmentType {
  id: string;
  type: 'medical' | 'theory' | 'practical';
  icon: React.ReactNode;
  color: string;
  textColor: string;
}

interface TimeSlot {
  id: string;
  time: string;
  available: boolean;
}

interface Center {
  id: string;
  name: string;
  address: string;
  hours: string;
}

// Mock data
const appointmentTypes: AppointmentType[] = [
  { 
    id: 'medical', 
    type: 'medical', 
    icon: <Stethoscope className="w-8 h-8" />,
    color: 'bg-blue-50',
    textColor: 'text-blue-600'
  },
  { 
    id: 'theory', 
    type: 'theory', 
    icon: <GraduationCap className="w-8 h-8" />,
    color: 'bg-purple-50',
    textColor: 'text-purple-600'
  },
  { 
    id: 'practical', 
    type: 'practical', 
    icon: <Car className="w-8 h-8" />,
    color: 'bg-green-50',
    textColor: 'text-green-600'
  }
];

const timeSlots: TimeSlot[] = [
  { id: '1', time: '08:00', available: true },
  { id: '2', time: '08:30', available: false },
  { id: '3', time: '09:00', available: true },
  { id: '4', time: '09:30', available: true },
  { id: '5', time: '10:00', available: false },
  { id: '6', time: '10:30', available: true },
  { id: '7', time: '11:00', available: true },
  { id: '8', time: '11:30', available: false },
  { id: '9', time: '16:00', available: true },
  { id: '10', time: '16:30', available: true },
  { id: '11', time: '17:00', available: true },
  { id: '12', time: '17:30', available: false },
  { id: '13', time: '18:00', available: true },
  { id: '14', time: '18:30', available: true },
  { id: '15', time: '19:00', available: true },
];

const centers: Center[] = [
  { 
    id: '1', 
    name: 'Riyadh Driving Center', 
    address: 'King Abdullah Road, Riyadh', 
    hours: '08:00 - 20:00' 
  },
  { 
    id: '2', 
    name: 'Jeddah Driving Center', 
    address: 'Al-Madinah Road, Jeddah', 
    hours: '08:00 - 20:00' 
  },
  { 
    id: '3', 
    name: 'Dammam Driving Center', 
    address: 'King Faisal Road, Dammam', 
    hours: '08:00 - 20:00' 
  }
];

// Generate dates for next 2 weeks
const generateDates = () => {
  const dates: { date: Date; day: number; weekday: string; available: boolean }[] = [];
  const today = new Date();
  
  for (let i = 0; i < 14; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    
    // Skip Fridays (weekend in Saudi Arabia)
    const isFriday = date.getDay() === 5;
    const isPast = date < today;
    
    dates.push({
      date,
      day: date.getDate(),
      weekday: date.toLocaleDateString('en-US', { weekday: 'short' }),
      available: !isFriday && !isPast
    });
  }
  
  return dates;
};

const mockDates = generateDates();

export default function BookAppointmentPage() {
  const t = useTranslations('appointment');
  const tBook = useTranslations('appointment.book');
  const router = useRouter();
  
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [selectedCenter, setSelectedCenter] = useState<Center | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const totalSteps = 5;
  
  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };
  
  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };
  
  const handleConfirmBooking = async () => {
    setIsProcessing(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsProcessing(false);
    router.push('/appointments');
  };
  
  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return !!selectedType;
      case 2:
        return !!selectedDate;
      case 3:
        return !!selectedTime;
      case 4:
        return !!selectedCenter;
      case 5:
        return true;
      default:
        return false;
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1: // Select Type
        return (
          <div className="space-y-4">
            <p className="text-neutral-500">{tBook('selectTypeDesc')}</p>
            <div className="grid gap-4 sm:grid-cols-3">
              {appointmentTypes.map((type) => (
                <button
                  key={type.id}
                  onClick={() => setSelectedType(type.id)}
                  className={cn(
                    "p-6 rounded-xl border-2 transition-all text-center",
                    selectedType === type.id
                      ? "border-primary-500 bg-primary-500/5"
                      : "border-neutral-200 hover:border-primary-300"
                  )}
                >
                  <div className={cn("mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-3", type.color)}>
                    <span className={type.textColor}>{type.icon}</span>
                  </div>
                  <h3 className="font-semibold text-neutral-900">{tBook(`types.${type.type}`)}</h3>
                  {selectedType === type.id && (
                    <Check className="w-5 h-5 text-primary-500 mx-auto mt-2" />
                  )}
                </button>
              ))}
            </div>
          </div>
        );
        
      case 2: // Select Date
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-7 gap-2">
              {mockDates.map((dateObj, index) => (
                <button
                  key={index}
                  onClick={() => dateObj.available && setSelectedDate(dateObj.date)}
                  disabled={!dateObj.available}
                  className={cn(
                    "p-3 rounded-lg text-center transition-all",
                    selectedDate?.toDateString() === dateObj.date.toDateString()
                      ? "bg-primary-500 text-white"
                      : dateObj.available
                        ? "bg-neutral-100 hover:bg-primary-100 text-neutral-900"
                        : "bg-neutral-100 text-neutral-300 cursor-not-allowed",
                    "disabled:cursor-not-allowed"
                  )}
                >
                  <div className="text-xs text-neutral-500 mb-1">{dateObj.weekday}</div>
                  <div className="text-lg font-bold">{dateObj.day}</div>
                </button>
              ))}
            </div>
            <p className="text-sm text-neutral-500 text-center">
              {tBook('selectDate')}
            </p>
          </div>
        );
        
      case 3: // Select Time
        return (
          <div className="space-y-6">
            {/* Morning */}
            <div>
              <h4 className="font-semibold text-neutral-900 mb-3 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-yellow-500" />
                {t('calendar.morning')}
              </h4>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                {timeSlots.slice(0, 8).map((slot) => (
                  <button
                    key={slot.id}
                    onClick={() => slot.available && setSelectedTime(slot.time)}
                    disabled={!slot.available}
                    className={cn(
                      "p-3 rounded-lg text-center transition-all",
                      selectedTime === slot.id
                        ? "bg-primary-500 text-white"
                        : slot.available
                          ? "bg-neutral-100 hover:bg-primary-100 text-neutral-900"
                          : "bg-neutral-50 text-neutral-300 cursor-not-allowed line-through",
                      "disabled:cursor-not-allowed"
                    )}
                  >
                    {slot.time}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Afternoon */}
            <div>
              <h4 className="font-semibold text-neutral-900 mb-3 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-orange-500" />
                {t('calendar.afternoon')}
              </h4>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                {timeSlots.slice(8).map((slot) => (
                  <button
                    key={slot.id}
                    onClick={() => slot.available && setSelectedTime(slot.time)}
                    disabled={!slot.available}
                    className={cn(
                      "p-3 rounded-lg text-center transition-all",
                      selectedTime === slot.id
                        ? "bg-primary-500 text-white"
                        : slot.available
                          ? "bg-neutral-100 hover:bg-primary-100 text-neutral-900"
                          : "bg-neutral-50 text-neutral-300 cursor-not-allowed line-through",
                      "disabled:cursor-not-allowed"
                    )}
                  >
                    {slot.time}
                  </button>
                ))}
              </div>
            </div>
          </div>
        );
        
      case 4: // Select Center
        return (
          <div className="space-y-4">
            <div className="grid gap-4">
              {centers.map((center) => (
                <button
                  key={center.id}
                  onClick={() => setSelectedCenter(center)}
                  className={cn(
                    "p-4 rounded-xl border-2 transition-all text-start",
                    selectedCenter?.id === center.id
                      ? "border-primary-500 bg-primary-500/5"
                      : "border-neutral-200 hover:border-primary-300"
                  )}
                >
                  <h4 className="font-semibold text-neutral-900">{center.name}</h4>
                  <div className="flex items-center gap-2 mt-1 text-sm text-neutral-500">
                    <MapPin className="w-4 h-4" />
                    {center.address}
                  </div>
                  <div className="flex items-center gap-2 mt-1 text-sm text-neutral-500">
                    <Clock className="w-4 h-4" />
                    {center.hours}
                  </div>
                </button>
              ))}
            </div>
          </div>
        );
        
      case 5: // Confirmation
        const typeName = selectedType ? tBook(`types.${selectedType}`) : '';
        const dateStr = selectedDate?.toLocaleDateString() || '';
        
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>{tBook('confirm')}</CardTitle>
                <CardDescription>{tBook('subtitle')}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between py-2 border-b border-neutral-100">
                  <span className="text-neutral-500">{tBook('selectType')}</span>
                  <span className="font-semibold">{typeName}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-neutral-100">
                  <span className="text-neutral-500">{t('details.date')}</span>
                  <span className="font-semibold">{dateStr}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-neutral-100">
                  <span className="text-neutral-500">{t('details.time')}</span>
                  <span className="font-semibold">{selectedTime}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-neutral-100">
                  <span className="text-neutral-500">{t('details.center')}</span>
                  <span className="font-semibold">{selectedCenter?.name}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-neutral-500">{t('details.location')}</span>
                  <span className="font-semibold">{selectedCenter?.address}</span>
                </div>
              </CardContent>
            </Card>
            
            <Button 
              onClick={handleConfirmBooking} 
              disabled={isProcessing}
              className="w-full"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 me-2 rtl:me-0 rtl:ms-2 animate-spin" />
                  {tBook('processing')}
                </>
              ) : (
                tBook('confirmBooking')
              )}
            </Button>
          </div>
        );
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-neutral-900">{tBook('title')}</h1>
        <p className="text-neutral-500">{tBook('subtitle')}</p>
      </div>
      
      {/* Progress Steps */}
      <div className="flex items-center justify-between">
        {[1, 2, 3, 4, 5].map((step) => (
          <div key={step} className="flex items-center">
            <div className={cn(
              "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all",
              step === currentStep
                ? "bg-primary-500 text-white"
                : step < currentStep
                  ? "bg-primary-500 text-white"
                  : "bg-neutral-200 text-neutral-500"
            )}>
              {step < currentStep ? <Check className="w-4 h-4" /> : step}
            </div>
            {step < totalSteps && (
              <div className={cn(
                "w-12 sm:w-20 h-1 mx-1",
                step < currentStep ? "bg-primary-500" : "bg-neutral-200"
              )} />
            )}
          </div>
        ))}
      </div>
      
      {/* Step Title */}
      <div className="flex items-center gap-2">
        <span className="text-sm text-neutral-500">
          {tBook('step')} {currentStep} {tBook('of')} {totalSteps}
        </span>
      </div>
      
      {/* Step Content */}
      <Card>
        <CardContent className="p-6">
          {renderStep()}
        </CardContent>
      </Card>
      
      {/* Navigation */}
      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={handleBack}
          disabled={currentStep === 1}
        >
          <ChevronLeft className="w-4 h-4 me-2 rtl:me-0 rtl:ms-2" />
          {tBook('back')}
        </Button>
        
        {currentStep < totalSteps && (
          <Button onClick={handleNext} disabled={!canProceed()}>
            {tBook('next')}
            <ChevronRight className="w-4 h-4 ms-2 rtl:ms-0 rtl:me-2" />
          </Button>
        )}
      </div>
    </div>
  );
}