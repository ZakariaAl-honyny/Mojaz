'use client';

import { 
  Clock, 
  Check, 
  AlertCircle, 
  Sunrise, 
  Sunset,
  Loader2,
  CalendarCheck
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { AvailableSlotDto } from '@/services/appointment.service';
import { motion, AnimatePresence } from 'framer-motion';

interface TimeSlotPickerProps {
  slots: AvailableSlotDto[];
  selectedSlot: string | null;
  onSlotSelect: (slot: AvailableSlotDto) => void;
  isLoading?: boolean;
  className?: string;
}

export function TimeSlotPicker({
  slots,
  selectedSlot,
  onSlotSelect,
  isLoading = false,
  className
}: TimeSlotPickerProps) {

  if (isLoading) {
    return (
      <div className={cn('bg-white rounded-[2.5rem] p-10 shadow-2xl shadow-blue-900/5 border border-blue-50/50 font-arabic', className)} dir="rtl">
        <div className="flex items-center gap-4 mb-10">
           <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-[#1a3a8f]">
              <Loader2 className="w-6 h-6 animate-spin" />
           </div>
           <div>
              <div className="h-6 w-32 bg-neutral-100 rounded-full animate-pulse mb-2" />
              <div className="h-4 w-48 bg-neutral-50 rounded-full animate-pulse" />
           </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-24 bg-neutral-50 rounded-2xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (slots.length === 0) {
    return (
      <div className={cn('bg-white rounded-[2.5rem] p-16 shadow-2xl shadow-blue-900/5 border border-blue-50/50 text-center font-arabic', className)} dir="rtl">
        <div className="w-24 h-24 rounded-[2rem] bg-neutral-50 flex items-center justify-center mx-auto mb-8 shadow-inner">
           <AlertCircle className="w-12 h-12 text-neutral-300" />
        </div>
        <h3 className="text-xl font-black text-neutral-900 mb-2">لا توجد مواعيد متاحة</h3>
        <p className="text-neutral-400 font-bold max-w-xs mx-auto leading-relaxed">عذراً، لا تتوفر مواعيد حجز في التاريخ المحدد حالياً. يرجى اختيار تاريخ آخر.</p>
      </div>
    );
  }

  // Group slots by time period
  const morningSlots = slots.filter(s => {
    const hour = parseInt(s.time.split(':')[0]);
    return hour < 12;
  });
  
  const afternoonSlots = slots.filter(s => {
    const hour = parseInt(s.time.split(':')[0]);
    return hour >= 12;
  });

  const renderSlotGroup = (groupSlots: AvailableSlotDto[], title: string, Icon: any) => {
    if (groupSlots.length === 0) return null;
    
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3">
           <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-[#1a3a8f]">
              <Icon className="w-5 h-5" />
           </div>
           <h4 className="text-sm font-black text-neutral-800 uppercase tracking-widest">{title}</h4>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-4 gap-4">
          {groupSlots.map((slot) => (
            <motion.button
              key={slot.time}
              whileHover={slot.isAvailable ? { scale: 1.05 } : {}}
              whileTap={slot.isAvailable ? { scale: 0.95 } : {}}
              onClick={() => slot.isAvailable && onSlotSelect(slot)}
              disabled={!slot.isAvailable}
              className={cn(
                'group relative p-5 rounded-2xl border-none transition-all duration-500 text-right overflow-hidden',
                selectedSlot === slot.time
                  ? 'bg-[#1a3a8f] text-white shadow-xl shadow-blue-900/20 ring-4 ring-blue-100/50'
                  : 'bg-neutral-50 hover:bg-white hover:shadow-xl hover:shadow-blue-900/5 hover:ring-2 hover:ring-blue-100',
                !slot.isAvailable && 'opacity-30 cursor-not-allowed bg-neutral-100 shadow-none grayscale'
              )}
            >
              <div className="flex items-center gap-3 mb-3">
                <Clock className={cn(
                  "w-5 h-5 transition-colors",
                  selectedSlot === slot.time ? "text-blue-100" : "text-[#1a3a8f]"
                )} />
                <span className={cn(
                  "text-lg font-black tracking-tight",
                  selectedSlot === slot.time ? "text-white" : "text-neutral-900"
                )}>
                  {slot.time}
                </span>
              </div>
              <div className={cn(
                "text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full w-fit",
                selectedSlot === slot.time 
                  ? "bg-white/10 text-white" 
                  : slot.isAvailable ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600"
              )}>
                {slot.isAvailable ? (
                  `${slot.availableCapacity} متاح`
                ) : (
                  'كامل'
                )}
              </div>
              
              {selectedSlot === slot.time && (
                <div className="absolute -bottom-2 -start-2 opacity-10">
                   <Check className="w-16 h-16 text-white stroke-[4px]" />
                </div>
              )}
            </motion.button>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className={cn('bg-white rounded-[2.5rem] p-10 shadow-2xl shadow-blue-900/5 border border-blue-50/50 font-arabic', className)} dir="rtl">
      <div className="flex items-center gap-4 mb-12">
         <div className="w-12 h-12 rounded-[1.25rem] bg-blue-50 flex items-center justify-center text-[#1a3a8f] shadow-inner">
            <CalendarCheck className="w-6 h-6" />
         </div>
         <div>
            <h3 className="text-2xl font-black text-neutral-900">
               اختر الوقت المناسب
            </h3>
            <p className="text-xs font-bold text-neutral-400 mt-0.5">المواعيد المتاحة للفترة الصباحية والمسائية</p>
         </div>
      </div>
      
      <div className="space-y-12">
        {renderSlotGroup(morningSlots, 'الفترة الصباحية', Sunrise)}
        {renderSlotGroup(afternoonSlots, 'الفترة المسائية', Sunset)}
      </div>
    </div>
  );
}