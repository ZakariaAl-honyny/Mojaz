'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar as CalendarIcon 
} from 'lucide-react';
import { cn } from '@/lib/utils';

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
  const t = useTranslations('appointment.calendar');
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const weekdays = [
    t('weekdays.sunday'),
    t('weekdays.monday'),
    t('weekdays.tuesday'),
    t('weekdays.wednesday'),
    t('weekdays.thursday'),
    t('weekdays.friday'),
    t('weekdays.saturday')
  ];

  const months = [
    t('months.january'), t('months.february'), t('months.march'),
    t('months.april'), t('months.may'), t('months.june'),
    t('months.july'), t('months.august'), t('months.september'),
    t('months.october'), t('months.november'), t('months.december')
  ];

  const isDateDisabled = (date: Date) => {
    // Before min date
    if (date < minDate) return true;
    // After max date
    if (date > maxDate) return true;
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

  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay();
  };

  const renderDays = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);
    
    const days = [];
    
    // Empty cells for days before the first day
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-10 w-10" />);
    }
    
    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const disabled = isDateDisabled(date);
      const selected = isSelected(date);
      const today = isToday(date);
      
      days.push(
        <button
          key={day}
          onClick={() => !disabled && onDateSelect(date)}
          disabled={disabled}
          className={cn(
            'h-10 w-10 rounded-lg text-sm font-medium transition-all',
            'hover:bg-primary-100 dark:hover:bg-primary-900',
            selected && 'bg-primary-500 text-white hover:bg-primary-600',
            today && !selected && 'border border-primary-500 text-primary-500',
            disabled && 'text-gray-300 dark:text-gray-600 cursor-not-allowed'
          )}
        >
          {day}
        </button>
      );
    }
    
    return days;
  };

  const prevMonth = () => {
    const newMonth = new Date(currentMonth);
    newMonth.setMonth(newMonth.getMonth() - 1);
    if (newMonth >= new Date(minDate.getFullYear(), minDate.getMonth(), 1)) {
      setCurrentMonth(newMonth);
    }
  };

  const nextMonth = () => {
    const newMonth = new Date(currentMonth);
    newMonth.setMonth(newMonth.getMonth() + 1);
    if (newMonth <= new Date(maxDate.getFullYear(), maxDate.getMonth(), 1)) {
      setCurrentMonth(newMonth);
    }
  };

  const goToToday = () => {
    setCurrentMonth(new Date());
    onDateSelect(new Date());
  };

  return (
    <div className={cn('bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm', className)}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          {months[currentMonth.getMonth()]} {currentMonth.getFullYear()}
        </h3>
        <div className="flex items-center gap-2">
          <button
            onClick={goToToday}
            className="px-3 py-1 text-sm font-medium text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900 rounded-lg"
          >
            {t('today')}
          </button>
          <button
            onClick={prevMonth}
            className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <ChevronLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </button>
          <button
            onClick={nextMonth}
            className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <ChevronRight className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </button>
        </div>
      </div>

      {/* Weekday headers */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {weekdays.map((day, index) => (
          <div 
            key={day} 
            className="h-8 flex items-center justify-center text-xs font-medium text-gray-500 dark:text-gray-400"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1">
        {renderDays()}
      </div>
    </div>
  );
}