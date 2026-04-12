'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { 
  CalendarDays, 
  Clock, 
  Coffee,
  Calendar,
  Plus,
  Trash2,
  Save
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

// Days of week
const daysOfWeek = [
  { id: 0, key: 'sunday' },
  { id: 1, key: 'monday' },
  { id: 2, key: 'tuesday' },
  { id: 3, key: 'wednesday' },
  { id: 4, key: 'thursday' },
  { id: 5, key: 'friday' },
  { id: 6, key: 'saturday' }
];

// Time slot interface
interface TimeSlot {
  id: string;
  startTime: string;
  endTime: string;
  isBreak?: boolean;
}

// Working hours interface
interface DaySchedule {
  dayId: number;
  isActive: boolean;
  slots: TimeSlot[];
}

// Initial schedule
const initialSchedule: DaySchedule[] = daysOfWeek.map(day => ({
  dayId: day.id,
  isActive: day.id < 5, // Sunday to Thursday are working days
  slots: day.id < 5 ? [
    { id: '1', startTime: '08:00', endTime: '12:00' },
    { id: '2', startTime: '12:00', endTime: '12:30', isBreak: true },
    { id: '3', startTime: '12:30', endTime: '16:00' }
  ] : []
}));

export default function ScheduleManagementPage() {
  const t = useTranslations('appointment');
  const tSlots = useTranslations('appointment.slots');
  
  const [schedule, setSchedule] = useState<DaySchedule[]>(initialSchedule);
  const [slotDuration, setSlotDuration] = useState(30); // minutes
  const [hasChanges, setHasChanges] = useState(false);
  
  const handleToggleDay = (dayId: number) => {
    setSchedule(prev => prev.map(day => 
      day.dayId === dayId ? { ...day, isActive: !day.isActive } : day
    ));
    setHasChanges(true);
  };
  
  const handleAddSlot = (dayId: number) => {
    setSchedule(prev => prev.map(day => {
      if (day.dayId !== dayId) return day;
      const lastSlot = day.slots[day.slots.length - 1];
      const newStartTime = lastSlot ? lastSlot.endTime : '08:00';
      const [hours, mins] = newStartTime.split(':').map(Number);
      const endHours = mins + slotDuration >= 60 ? hours + 1 : hours;
      const endMins = (mins + slotDuration) % 60;
      const newEndTime = `${String(endHours).padStart(2, '0')}:${String(endMins).padStart(2, '0')}`;
      
      return {
        ...day,
        slots: [...day.slots, { 
          id: String(day.slots.length + 1), 
          startTime: newStartTime, 
          endTime: newEndTime 
        }]
      };
    }));
    setHasChanges(true);
  };
  
  const handleRemoveSlot = (dayId: number, slotId: string) => {
    setSchedule(prev => prev.map(day => {
      if (day.dayId !== dayId) return day;
      return {
        ...day,
        slots: day.slots.filter(slot => slot.id !== slotId)
      };
    }));
    setHasChanges(true);
  };
  
  const handleUpdateSlot = (dayId: number, slotId: string, field: 'startTime' | 'endTime', value: string) => {
    setSchedule(prev => prev.map(day => {
      if (day.dayId !== dayId) return day;
      return {
        ...day,
        slots: day.slots.map(slot => 
          slot.id === slotId ? { ...slot, [field]: value } : slot
        )
      };
    }));
    setHasChanges(true);
  };
  
  const handleSave = () => {
    // API call would go here
    console.log('Saving schedule:', schedule);
    setHasChanges(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">{tSlots('create')}</h1>
          <p className="text-neutral-500">{t('employee.schedule')}</p>
        </div>
        <Button onClick={handleSave} disabled={!hasChanges}>
          <Save className="w-4 h-4 me-2 rtl:me-0 rtl:ms-2" />
          {tSlots('save')}
        </Button>
      </div>

      {/* Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{tSlots('weekly')}</CardTitle>
          <CardDescription>{t('employee.workingHours')}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Label>{t('employee.slotDuration')}</Label>
              <select 
                value={slotDuration}
                onChange={(e) => setSlotDuration(Number(e.target.value))}
                className="w-full mt-1 px-3 py-2 rounded-lg border border-neutral-200 bg-white"
              >
                <option value={15}>15 {t('employee.minutes')}</option>
                <option value={30}>30 {t('employee.minutes')}</option>
                <option value={45}>45 {t('employee.minutes')}</option>
                <option value={60}>1 {t('employee.hour')}</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Weekly Schedule */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">{tSlots('weekly')}</h2>
        
        {schedule.map((day) => (
          <Card key={day.dayId}>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={day.isActive}
                    onChange={() => handleToggleDay(day.dayId)}
                    className="w-5 h-5 rounded border-neutral-300 text-primary-500 focus:ring-primary-500"
                  />
                  <CardTitle className="text-base">
                    {daysOfWeek[day.dayId].key.charAt(0).toUpperCase() + daysOfWeek[day.dayId].key.slice(1)}
                  </CardTitle>
                </div>
                {day.isActive && (
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => handleAddSlot(day.dayId)}
                  >
                    <Plus className="w-4 h-4 me-1" />
                    Add Slot
                  </Button>
                )}
              </div>
            </CardHeader>
            {day.isActive && (
              <CardContent>
                <div className="space-y-2">
                  {day.slots.map((slot) => (
                    <div 
                      key={slot.id} 
                      className={cn(
                        "flex items-center gap-2 p-2 rounded-lg",
                        slot.isBreak && "bg-yellow-50"
                      )}
                    >
                      {slot.isBreak ? (
                        <Coffee className="w-4 h-4 text-yellow-600" />
                      ) : (
                        <Clock className="w-4 h-4 text-neutral-400" />
                      )}
                      <Input
                        type="time"
                        value={slot.startTime}
                        onChange={(e) => handleUpdateSlot(day.dayId, slot.id, 'startTime', e.target.value)}
                        className="w-28"
                      />
                      <span className="text-neutral-400">-</span>
                      <Input
                        type="time"
                        value={slot.endTime}
                        onChange={(e) => handleUpdateSlot(day.dayId, slot.id, 'endTime', e.target.value)}
                        className="w-28"
                      />
                      {!slot.isBreak && (
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleRemoveSlot(day.dayId, slot.id)}
                        >
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            )}
          </Card>
        ))}
      </div>

      {/* Holidays */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{tSlots('holidays')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {/* Sample holidays */}
            {[
              { date: '2026-01-01', name: 'New Year' },
              { date: '2026-04-23', name: 'National Day' }
            ].map((holiday, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Calendar className="w-4 h-4 text-neutral-500" />
                  <span>{holiday.date}</span>
                  <span className="font-medium">{holiday.name}</span>
                </div>
                <Button variant="ghost" size="sm">
                  <Trash2 className="w-4 h-4 text-red-500" />
                </Button>
              </div>
            ))}
            <Button variant="outline" className="w-full">
              <Plus className="w-4 h-4 me-2 rtl:me-0 rtl:ms-2" />
              {tSlots('holidays')}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}