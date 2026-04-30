'use client';

import { useState, useMemo } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar as CalendarIcon,
  RotateCcw
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

interface AppointmentCalendarProps {
  selectedDate: Date | null;
  onDateSelect: (date: Date) => void;
  minDate?: Date;
  maxDate?: Date;
  disabledDates?: Date[];
  className?: string;
}

export function AppointmentCalendar({
  selectedDate,
  onDateSelect,
  minDate = new Date(),
  maxDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days ahead
  disabledDates = [],
  className
}: AppointmentCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const weekdays = ['أحد', 'أثنين', 'ثلاثاء', 'أربعاء', 'خميس', 'جمعة', 'سبت'];
  const months = [
    'يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو',
    'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'
  ];

  const isDateDisabled = (date: Date) => {
    // Before min date (normalized to start of day)
    const normalizedMinDate = new Date(minDate);
    normalizedMinDate.setHours(0, 0, 0, 0);
    
    const normalizedDate = new Date(date);
    normalizedDate.setHours(0, 0, 0, 0);

    if (normalizedDate < normalizedMinDate) return true;
    if (normalizedDate > maxDate) return true;
    
    // Check disabled dates
    return disabledDates.some(d => 
      d.getFullYear() === date.getFullYear() && 
      d.getMonth() === date.getMonth() && 
      d.getDate() === date.getDate()
    );
  };

  const isSelected = (date: Date) => {
    if (!selectedDate) return false;
    return date.getFullYear() === selectedDate.getFullYear() && 
           date.getMonth() === selectedDate.getMonth() && 
           date.getDate() === selectedDate.getDate();
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.getFullYear() === today.getFullYear() && 
           date.getMonth() === today.getMonth() && 
           date.getDate() === today.getDate();
  };

  const calendarData = useMemo(() => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDay = new Date(year, month, 1).getDay();
    
    const days = [];
    // Padding
    for (let i = 0; i < firstDay; i++) {
      days.push({ day: null, date: null });
    }
    // Content
    for (let day = 1; day <= daysInMonth; day++) {
      days.push({ day, date: new Date(year, month, day) });
    }
    return days;
  }, [currentMonth]);

  const prevMonth = () => {
    const newMonth = new Date(currentMonth);
    newMonth.setMonth(newMonth.getMonth() - 1);
    setCurrentMonth(newMonth);
  };

  const nextMonth = () => {
    const newMonth = new Date(currentMonth);
    newMonth.setMonth(newMonth.getMonth() + 1);
    setCurrentMonth(newMonth);
  };

  const goToToday = () => {
    const today = new Date();
    setCurrentMonth(today);
    onDateSelect(today);
  };

  return (
    <div className={cn('bg-white rounded-[2.5rem] p-8 shadow-2xl shadow-blue-900/5 border border-blue-50/50 font-arabic', className)} dir="rtl">
      {/* Header */}
      <div className="flex items-center justify-between mb-10">
        <div className="flex items-center gap-4">
           <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-[#1a3a8f]">
              <CalendarIcon className="w-6 h-6" />
           </div>
           <div>
              <h3 className="text-xl font-black text-neutral-900">
                {months[currentMonth.getMonth()]} {currentMonth.getFullYear()}
              </h3>
              <p className="text-xs font-bold text-neutral-400 mt-0.5">اختر موعد الحضور للمقر</p>
           </div>
        </div>
        
        <div className="flex items-center gap-3">
          <button
            onClick={goToToday}
            className="w-10 h-10 flex items-center justify-center text-neutral-400 hover:text-[#1a3a8f] hover:bg-blue-50 rounded-xl transition-all"
            title="العودة لليوم"
          >
            <RotateCcw className="w-5 h-5" />
          </button>
          <div className="flex items-center bg-neutral-50 rounded-xl p-1 border border-neutral-100">
            <button
              onClick={prevMonth}
              className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-white hover:shadow-sm text-neutral-600 transition-all"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
            <button
              onClick={nextMonth}
              className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-white hover:shadow-sm text-neutral-600 transition-all"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Weekday headers */}
      <div className="grid grid-cols-7 gap-3 mb-4">
        {weekdays.map((day) => (
          <div 
            key={day} 
            className="h-10 flex items-center justify-center text-xs font-black text-neutral-300"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-3">
        {calendarData.map((item, idx) => {
          if (!item.date) return <div key={`empty-${idx}`} />;
          
          const disabled = isDateDisabled(item.date);
          const selected = isSelected(item.date);
          const today = isToday(item.date);
          
          return (
            <button
              key={idx}
              onClick={() => !disabled && onDateSelect(item.date!)}
              disabled={disabled}
              className={cn(
                'relative h-14 w-full rounded-2xl text-base font-black transition-all duration-300 flex items-center justify-center',
                'hover:bg-blue-50 active:scale-95',
                selected && 'bg-[#1a3a8f] text-white shadow-xl shadow-blue-900/20 hover:bg-blue-900',
                today && !selected && 'border-2 border-blue-100 text-[#1a3a8f]',
                disabled && 'text-neutral-200 cursor-not-allowed hover:bg-transparent grayscale opacity-50'
              )}
            >
              {item.day}
              {today && !selected && (
                <div className="absolute top-2 end-2 w-1.5 h-1.5 rounded-full bg-[#1a3a8f]" />
              )}
            </button>
          );
        })}
      </div>

      {/* Legend */}
      <div className="mt-8 pt-8 border-t border-dashed border-neutral-100 flex items-center gap-6 justify-center">
         <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#1a3a8f]" />
            <span className="text-[10px] font-black text-neutral-400">الموعد المختار</span>
         </div>
         <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full border border-blue-100" />
            <span className="text-[10px] font-black text-neutral-400">اليوم الحالي</span>
         </div>
         <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-neutral-100" />
            <span className="text-[10px] font-black text-neutral-400">مواعيد غير متاحة</span>
         </div>
      </div>
    </div>
  );
}