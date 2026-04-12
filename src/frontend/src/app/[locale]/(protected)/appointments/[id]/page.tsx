'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  ArrowLeft,
  Stethoscope, 
  GraduationCap, 
  Car,
  CalendarPlus,
  AlertCircle
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

// Types
type AppointmentType = 'medical' | 'theory' | 'practical';
type AppointmentStatus = 'confirmed' | 'pending' | 'completed' | 'cancelled';

// Mock appointment data
const mockAppointment = {
  id: '1',
  type: 'medical' as AppointmentType,
  date: '2026-04-15',
  time: '09:00',
  center: 'Riyadh Driving Center',
  location: 'King Abdullah Road, Riyadh',
  status: 'confirmed' as AppointmentStatus,
  notes: 'Please bring your national ID and wear comfortable clothing.'
};

const getTypeIcon = (type: string) => {
  switch (type) {
    case 'medical':
      return <Stethoscope className="w-6 h-6" />;
    case 'theory':
      return <GraduationCap className="w-6 h-6" />;
    case 'practical':
      return <Car className="w-6 h-6" />;
    default:
      return <Calendar className="w-6 h-6" />;
  }
};

const getTypeColor = (type: string) => {
  switch (type) {
    case 'medical':
      return 'bg-blue-50 text-blue-600';
    case 'theory':
      return 'bg-purple-50 text-purple-600';
    case 'practical':
      return 'bg-green-50 text-green-600';
    default:
      return 'bg-neutral-50 text-neutral-600';
  }
};

function AppointmentDetailsPage() {
  const t = useTranslations('appointment');
  const tDetails = useTranslations('appointment.details');
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  
  const appointment = mockAppointment;
  
  const getStatusVariant = (status: string) => {
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

  const handleAddToCalendar = () => {
    // Generate Google Calendar link
    const startDate = new Date(`${appointment.date}T${appointment.time}`);
    const endDate = new Date(startDate);
    endDate.setHours(endDate.getHours() + 1);
    
    const googleUrl = new URL('https://calendar.google.com/calendar/render');
    googleUrl.searchParams.set('action', 'TEMPLATE');
    googleUrl.searchParams.set('text', `${t(`types.${appointment.type}`)} - Mojaz`);
    googleUrl.searchParams.set('dates', `${startDate.toISOString().replace(/[-:]/g, '').split('.')[0]}Z/${endDate.toISOString().replace(/[-:]/g, '').split('.')[0]}Z`);
    googleUrl.searchParams.set('details', `Driving License Appointment at ${appointment.center}`);
    googleUrl.searchParams.set('location', appointment.location);
    
    window.open(googleUrl.toString(), '_blank');
  };

  const isActiveAppointment = appointment.status === 'confirmed' || appointment.status === 'pending';

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Back Button */}
      <Link href="/appointments">
        <Button variant="ghost" size="sm">
          <ArrowLeft className="w-4 h-4 me-2 rtl:me-0 rtl:ms-2 rtl:rotate-180" />
          {tDetails('title')}
        </Button>
      </Link>
      
      {/* Main Card */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className={cn("p-4 rounded-xl", getTypeColor(appointment.type))}>
                {getTypeIcon(appointment.type)}
              </div>
              <div>
                <CardTitle className="text-xl">
                  {t(`types.${appointment.type}`)}
                </CardTitle>
                <CardDescription>
                  {appointment.center}
                </CardDescription>
              </div>
            </div>
            <Badge variant={getStatusVariant(appointment.status)}>
              {t(`status.${appointment.status}`)}
            </Badge>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Date & Time */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-3 p-4 bg-neutral-50 rounded-xl">
              <Calendar className="w-5 h-5 text-neutral-500" />
              <div>
                <p className="text-sm text-neutral-500">{tDetails('date')}</p>
                <p className="font-semibold">{appointment.date}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 bg-neutral-50 rounded-xl">
              <Clock className="w-5 h-5 text-neutral-500" />
              <div>
                <p className="text-sm text-neutral-500">{tDetails('time')}</p>
                <p className="font-semibold">{appointment.time}</p>
              </div>
            </div>
          </div>
          
          {/* Location */}
          <div className="flex items-start gap-3 p-4 bg-neutral-50 rounded-xl">
            <MapPin className="w-5 h-5 text-neutral-500 mt-0.5" />
            <div>
              <p className="text-sm text-neutral-500">{tDetails('location')}</p>
              <p className="font-semibold">{appointment.location}</p>
            </div>
          </div>
          
          {/* Notes */}
          {appointment.notes && (
            <div className="p-4 bg-blue-50 rounded-xl">
              <p className="text-sm text-blue-600">{appointment.notes}</p>
            </div>
          )}
          
          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Button variant="outline" className="flex-1" onClick={handleAddToCalendar}>
              <CalendarPlus className="w-4 h-4 me-2 rtl:me-0 rtl:ms-2" />
              {tDetails('addToCalendar')}
            </Button>
            
            {isActiveAppointment && (
              <>
                <Button variant="outline" className="flex-1">
                  {tDetails('reschedule')}
                </Button>
                <Button 
                  variant="destructive" 
                  className="flex-1"
                  onClick={() => setShowCancelDialog(true)}
                >
                  {tDetails('cancel')}
                </Button>
              </>
            )}
          </div>
        </CardContent>
      </Card>
      
      {/* Cancel Dialog */}
      {showCancelDialog && (
        <Card className="border-red-200">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <AlertCircle className="w-6 h-6 text-red-500" />
              <h3 className="font-semibold text-lg">{tDetails('cancel')}</h3>
            </div>
            <p className="text-neutral-500 mb-4">
              Are you sure you want to cancel this appointment? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setShowCancelDialog(false)}>
                {t('cancel')}
              </Button>
              <Button variant="destructive">
                {t('actions.confirm')}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export default function Page() {
  return <AppointmentDetailsPage />;
}