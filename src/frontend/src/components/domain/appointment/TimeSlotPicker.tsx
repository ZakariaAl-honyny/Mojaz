'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Clock, Check, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { AvailableSlotDto } from '@/services/appointment.service';

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
  const t = useTranslations('appointment');

  if (isLoading) {
    return (
      <div className={cn('bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm', className)}>
        <div className="animate-pulse space-y-3">
          <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-lg" />
          <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-lg" />
          <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-lg" />
        </div>
      </div>
    );
  }

  if (slots.length === 0) {
    return (
      <div className={cn('bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm text-center', className)}>
        <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-3" />
        <p className="text-gray-600 dark:text-gray-400">{t('noSlotsAvailable')}</p>
      </div>
    );
  }

  // Group slots by time period (morning, afternoon)
  const morningSlots = slots.filter(s => {
    const hour = parseInt(s.time.split(':')[0]);
    return hour < 12;
  });
  
  const afternoonSlots = slots.filter(s => {
    const hour = parseInt(s.time.split(':')[0]);
    return hour >= 12;
  });

  const renderSlotGroup = (groupSlots: AvailableSlotDto[], title: string) => {
    if (groupSlots.length === 0) return null;
    
    return (
      <div className="mb-4">
        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{title}</h4>
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
          {groupSlots.map((slot) => (
            <button
              key={slot.time}
              onClick={() => slot.isAvailable && onSlotSelect(slot)}
              disabled={!slot.isAvailable}
              className={cn(
                'relative p-3 rounded-lg border-2 transition-all text-center',
                selectedSlot === slot.time
                  ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/30'
                  : 'border-gray-200 dark:border-gray-700 hover:border-primary-300',
                !slot.isAvailable && 'opacity-50 cursor-not-allowed bg-gray-50 dark:bg-gray-800'
              )}
            >
              <div className="flex items-center justify-center gap-1">
                <Clock className="w-4 h-4 text-gray-500" />
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {slot.time}
                </span>
              </div>
              <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                {slot.isAvailable ? (
                  <span className="text-green-600 dark:text-green-400">
                    {slot.availableCapacity} {t('slotAvailable').toLowerCase()}
                  </span>
                ) : (
                  <span className="text-red-500">{t('slotFull')}</span>
                )}
              </div>
              {selectedSlot === slot.time && (
                <div className="absolute top-2 end-2">
                  <Check className="w-4 h-4 text-primary-500" />
                </div>
              )}
            </button>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className={cn('bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm', className)}>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        {t('selectTime')}
      </h3>
      
      {renderSlotGroup(morningSlots, 'Morning')}
      {renderSlotGroup(afternoonSlots, 'Afternoon')}
    </div>
  );
}