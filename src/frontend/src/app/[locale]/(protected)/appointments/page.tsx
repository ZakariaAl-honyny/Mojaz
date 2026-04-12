'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  ChevronRight, 
  Stethoscope, 
  GraduationCap, 
  Car,
  Plus,
  CalendarCheck
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge, badgeVariants } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

// Mock appointment data
interface Appointment {
  id: string;
  type: 'medical' | 'theory' | 'practical';
  date: string;
  time: string;
  center: string;
  location: string;
  status: 'confirmed' | 'pending' | 'completed' | 'cancelled';
}

const mockUpcomingAppointments: Appointment[] = [
  {
    id: '1',
    type: 'medical',
    date: '2026-04-15',
    time: '09:00',
    center: 'Riyadh Driving Center',
    location: 'King Abdullah Road, Riyadh',
    status: 'confirmed'
  },
  {
    id: '2',
    type: 'theory',
    date: '2026-04-22',
    time: '14:00',
    center: 'Riyadh Driving Center',
    location: 'King Abdullah Road, Riyadh',
    status: 'pending'
  }
];

const mockPastAppointments: Appointment[] = [
  {
    id: '3',
    type: 'medical',
    date: '2026-03-10',
    time: '10:00',
    center: 'Riyadh Driving Center',
    location: 'King Abdullah Road, Riyadh',
    status: 'completed'
  }
];

const getTypeIcon = (type: string) => {
  switch (type) {
    case 'medical':
      return <Stethoscope className="w-5 h-5" />;
    case 'theory':
      return <GraduationCap className="w-5 h-5" />;
    case 'practical':
      return <Car className="w-5 h-5" />;
    default:
      return <Calendar className="w-5 h-5" />;
  }
};

const getTypeColor = (type: string) => {
  switch (type) {
    case 'medical':
      return 'bg-blue-500/10 text-blue-600';
    case 'theory':
      return 'bg-purple-500/10 text-purple-600';
    case 'practical':
      return 'bg-green-500/10 text-green-600';
    default:
      return 'bg-neutral-500/10 text-neutral-600';
  }
};

const getStatusVariant = (status: string): 'success' | 'warning' | 'default' | 'destructive' | 'info' => {
  switch (status) {
    case 'confirmed':
      return 'success';
    case 'pending':
      return 'warning';
    case 'completed':
      return 'default';
    case 'cancelled':
      return 'destructive';
    default:
      return 'info';
  }
};

interface AppointmentCardProps {
  appointment: Appointment;
  isPast?: boolean;
}

function AppointmentCard({ appointment, isPast }: AppointmentCardProps) {
  const t = useTranslations('appointment');
  const tNav = useTranslations('navigation');

  return (
    <Link href={`/appointments/${appointment.id}`}>
      <Card className={cn(
        "hover:shadow-md transition-all duration-200 cursor-pointer",
        isPast && "opacity-75 hover:opacity-100"
      )}>
        <CardContent className="p-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className={cn(
                "p-3 rounded-xl shrink-0",
                getTypeColor(appointment.type)
              )}>
                {getTypeIcon(appointment.type)}
              </div>
              <div className="space-y-1">
                <h4 className="font-semibold text-neutral-900">
                  {t(`types.${appointment.type}`)}
                </h4>
                <div className="flex items-center gap-2 text-sm text-neutral-500">
                  <Calendar className="w-4 h-4" />
                  <span>{appointment.date}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-neutral-500">
                  <Clock className="w-4 h-4" />
                  <span>{appointment.time}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-neutral-500">
                  <MapPin className="w-4 h-4" />
                  <span>{appointment.center}</span>
                </div>
              </div>
            </div>
            <div className="flex flex-col items-end gap-2">
              <Badge variant={getStatusVariant(appointment.status)}>
                {t(`status.${appointment.status}`)}
              </Badge>
              <ChevronRight className="w-5 h-5 text-neutral-400 rtl:rotate-180" />
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

export default function AppointmentsPage() {
  const t = useTranslations('appointment');
  const tNav = useTranslations('navigation');
  const [activeTab, setActiveTab] = useState<'upcoming' | 'history'>('upcoming');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">{t('title')}</h1>
          <p className="text-neutral-500">{t('subtitle')}</p>
        </div>
        <Link href="/appointments/book">
          <Button>
            <Plus className="w-4 h-4 me-2 rtl:me-0 rtl:ms-2" />
            {t('bookNew')}
          </Button>
        </Link>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-neutral-200">
        <button
          onClick={() => setActiveTab('upcoming')}
          className={cn(
            "px-4 py-2 text-sm font-medium border-b-2 transition-colors -mb-px",
            activeTab === 'upcoming'
              ? "border-primary-500 text-primary-600"
              : "border-transparent text-neutral-500 hover:text-neutral-900"
          )}
        >
          {t('upcoming')}
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={cn(
            "px-4 py-2 text-sm font-medium border-b-2 transition-colors -mb-px",
            activeTab === 'history'
              ? "border-primary-500 text-primary-600"
              : "border-transparent text-neutral-500 hover:text-neutral-900"
          )}
        >
          {t('history')}
        </button>
      </div>

      {/* Content */}
      {activeTab === 'upcoming' && (
        <div className="space-y-4">
          {mockUpcomingAppointments.length > 0 ? (
            mockUpcomingAppointments.map((appointment) => (
              <AppointmentCard key={appointment.id} appointment={appointment} />
            ))
          ) : (
            <Card className="p-8">
              <CardContent className="flex flex-col items-center justify-center text-center py-8">
                <CalendarCheck className="w-16 h-16 text-neutral-300 mb-4" />
                <h3 className="text-lg font-semibold text-neutral-900 mb-2">
                  {t('noUpcoming')}
                </h3>
                <p className="text-neutral-500 mb-4">{t('noAppointments')}</p>
                <Link href="/appointments/book">
                  <Button variant="outline">
                    <Plus className="w-4 h-4 me-2 rtl:me-0 rtl:ms-2" />
                    {t('bookNew')}
                  </Button>
                </Link>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {activeTab === 'history' && (
        <div className="space-y-4">
          {mockPastAppointments.length > 0 ? (
            mockPastAppointments.map((appointment) => (
              <AppointmentCard key={appointment.id} appointment={appointment} isPast />
            ))
          ) : (
            <Card className="p-8">
              <CardContent className="flex flex-col items-center justify-center text-center py-8">
                <CalendarCheck className="w-16 h-16 text-neutral-300 mb-4" />
                <h3 className="text-lg font-semibold text-neutral-900 mb-2">
                  {t('pastAppointments')}
                </h3>
                <p className="text-neutral-500">{t('noAppointments')}</p>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}