'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Filter,
  Grid3X3,
  List,
  ChevronLeft,
  ChevronRight,
  Stethoscope, 
  GraduationCap, 
  Car,
  User,
  Search
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

// Types
interface Appointment {
  id: string;
  applicantName: string;
  type: 'medical' | 'theory' | 'practical';
  date: string;
  time: string;
  center: string;
  status: 'confirmed' | 'pending' | 'completed' | 'cancelled' | 'noShow';
}

// Mock data
const mockAppointments: Appointment[] = [
  { id: '1', applicantName: 'Ahmed Al-Rashid', type: 'medical', date: '2026-04-12', time: '09:00', center: 'Riyadh Driving Center', status: 'completed' },
  { id: '2', applicantName: 'Fatima Al-Hassan', type: 'medical', date: '2026-04-12', time: '09:30', center: 'Riyadh Driving Center', status: 'confirmed' },
  { id: '3', applicantName: 'Ali Mohammed', type: 'theory', date: '2026-04-12', time: '10:00', center: 'Riyadh Driving Center', status: 'pending' },
  { id: '4', applicantName: 'Sara Abdullah', type: 'practical', date: '2026-04-12', time: '14:00', center: 'Riyadh Driving Center', status: 'confirmed' },
  { id: '5', applicantName: 'Omar Khalid', type: 'medical', date: '2026-04-13', time: '09:00', center: 'Riyadh Driving Center', status: 'confirmed' },
  { id: '6', applicantName: 'Layla Youssef', type: 'theory', date: '2026-04-13', time: '10:00', center: 'Riyadh Driving Center', status: 'pending' },
];

const appointmentTypes = ['medical', 'theory', 'practical'] as const;
const appointmentStatuses = ['confirmed', 'pending', 'completed', 'cancelled', 'noShow'] as const;

const getTypeIcon = (type: string) => {
  switch (type) {
    case 'medical': return <Stethoscope className="w-4 h-4" />;
    case 'theory': return <GraduationCap className="w-4 h-4" />;
    case 'practical': return <Car className="w-4 h-4" />;
    default: return <Calendar className="w-4 h-4" />;
  }
};

const getStatusVariant = (status: string) => {
  switch (status) {
    case 'confirmed': return 'success';
    case 'pending': return 'warning';
    case 'completed': return 'default';
    case 'cancelled': return 'destructive';
    case 'noShow': return 'info';
    default: return 'info';
  }
};

export default function EmployeeAppointmentsPage() {
  const t = useTranslations('appointment');
  const tEmployee = useTranslations('appointment.employee');
  
  const [viewMode, setViewMode] = useState<'calendar' | 'list'>('list');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [filterType, setFilterType] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  const filteredAppointments = mockAppointments.filter(apt => {
    if (filterType !== 'all' && apt.type !== filterType) return false;
    if (filterStatus !== 'all' && apt.status !== filterStatus) return false;
    if (searchQuery && !apt.applicantName.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">{tEmployee('title')}</h1>
          <p className="text-neutral-500">{tEmployee('subtitle')}</p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant={viewMode === 'list' ? 'default' : 'outline'} 
            size="icon"
            onClick={() => setViewMode('list')}
          >
            <List className="w-4 h-4" />
          </Button>
          <Button 
            variant={viewMode === 'calendar' ? 'default' : 'outline'} 
            size="icon"
            onClick={() => setViewMode('calendar')}
          >
            <Grid3X3 className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
              <Input 
                placeholder={tEmployee('search') || 'Search...'}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="ps-10"
              />
            </div>
            
            {/* Type Filter */}
            <select 
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-3 py-2 rounded-lg border border-neutral-200 bg-white"
            >
              <option value="all">{t('types.medical')}</option>
              <option value="medical">{t('types.medical')}</option>
              <option value="theory">{t('types.theory')}</option>
              <option value="practical">{t('types.practical')}</option>
            </select>
            
            {/* Status Filter */}
            <select 
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 rounded-lg border border-neutral-200 bg-white"
            >
              <option value="all">All Status</option>
              <option value="confirmed">{t('status.confirmed')}</option>
              <option value="pending">{t('status.pending')}</option>
              <option value="completed">{t('status.completed')}</option>
              <option value="cancelled">{t('status.cancelled')}</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Calendar Navigation */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="sm" onClick={() => {
          const newDate = new Date(selectedDate);
          newDate.setDate(newDate.getDate() - 7);
          setSelectedDate(newDate);
        }}>
          <ChevronLeft className="w-4 h-4 rtl:rotate-180" />
        </Button>
        <h2 className="text-lg font-semibold">
          {selectedDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
        </h2>
        <Button variant="ghost" size="sm" onClick={() => {
          const newDate = new Date(selectedDate);
          newDate.setDate(newDate.getDate() + 7);
          setSelectedDate(newDate);
        }}>
          <ChevronRight className="w-4 h-4 rtl:rotate-180" />
        </Button>
      </div>

      {/* List View */}
      {viewMode === 'list' && (
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-neutral-100">
                    <th className="text-start p-4 font-semibold text-neutral-600">{tEmployee('title')}</th>
                    <th className="text-start p-4 font-semibold text-neutral-600">{t('details.time')}</th>
                    <th className="text-start p-4 font-semibold text-neutral-600">{t('types.medical')}</th>
                    <th className="text-start p-4 font-semibold text-neutral-600">{t('details.center')}</th>
                    <th className="text-start p-4 font-semibold text-neutral-600">{t('details.status')}</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAppointments.map((apt) => (
                    <tr key={apt.id} className="border-b border-neutral-50 hover:bg-neutral-50">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-neutral-100 flex items-center justify-center">
                            <User className="w-4 h-4 text-neutral-500" />
                          </div>
                          <span className="font-medium">{apt.applicantName}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-neutral-400" />
                          {apt.time}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          {getTypeIcon(apt.type)}
                          {t(`types.${apt.type}`)}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-neutral-400" />
                          {apt.center}
                        </div>
                      </td>
                      <td className="p-4">
                        <Badge variant={getStatusVariant(apt.status)}>
                          {t(`status.${apt.status}`)}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {filteredAppointments.length === 0 && (
              <div className="p-8 text-center text-neutral-500">
                No appointments found.
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Calendar View */}
      {viewMode === 'calendar' && (
        <div className="grid grid-cols-7 gap-2">
          {/* Day headers */}
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
            <div key={day} className="p-2 text-center font-semibold text-neutral-500 text-sm">
              {day}
            </div>
          ))}
          
          {/* Generate calendar days */}
          {Array.from({ length: 35 }, (_, i) => {
            const date = new Date(selectedDate);
            date.setDate(date.getDate() - date.getDay() + i);
            const dayAppointments = filteredAppointments.filter(apt => apt.date === date.toISOString().split('T')[0]);
            
            return (
              <div 
                key={i} 
                className={cn(
                  "min-h-24 p-2 rounded-lg border border-neutral-100",
                  date.toDateString() === new Date().toDateString() && "bg-primary-500/5 border-primary-200"
                )}
              >
                <div className="text-sm font-medium mb-1">{date.getDate()}</div>
                {dayAppointments.slice(0, 3).map((apt) => (
                  <div 
                    key={apt.id} 
                    className="text-xs p-1 mb-1 rounded bg-primary-100 text-primary-700 truncate"
                  >
                    {apt.time} - {apt.applicantName.split(' ')[0]}
                  </div>
                ))}
                {dayAppointments.length > 3 && (
                  <div className="text-xs text-neutral-500">+{dayAppointments.length - 3} more</div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}