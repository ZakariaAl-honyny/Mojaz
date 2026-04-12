'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { 
  Users, 
  Clock, 
  CheckCircle2,
  XCircle,
  AlertCircle,
  Search,
  Filter,
  UserCheck,
  UserX,
  Timer
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

// Types
interface AttendanceRecord {
  id: string;
  applicantName: string;
  appointmentTime: string;
  appointmentType: 'medical' | 'theory' | 'practical';
  checkInTime: string | null;
  status: 'pending' | 'present' | 'late' | 'absent';
  date: string;
}

// Mock data
const mockAttendance: AttendanceRecord[] = [
  { id: '1', applicantName: 'Ahmed Al-Rashid', appointmentTime: '09:00', appointmentType: 'medical', checkInTime: '08:55', status: 'present', date: '2026-04-12' },
  { id: '2', applicantName: 'Fatima Al-Hassan', appointmentTime: '09:30', appointmentType: 'medical', checkInTime: '09:35', status: 'late', date: '2026-04-12' },
  { id: '3', applicantName: 'Ali Mohammed', appointmentTime: '10:00', appointmentType: 'theory', checkInTime: null, status: 'pending', date: '2026-04-12' },
  { id: '4', applicantName: 'Sara Abdullah', appointmentTime: '14:00', appointmentType: 'practical', checkInTime: null, status: 'pending', date: '2026-04-12' },
  { id: '5', applicantName: 'Omar Khalid', appointmentTime: '09:00', appointmentType: 'medical', checkInTime: null, status: 'absent', date: '2026-04-12' },
];

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'present':
      return <CheckCircle2 className="w-5 h-5 text-green-500" />;
    case 'late':
      return <Timer className="w-5 h-5 text-yellow-500" />;
    case 'absent':
      return <XCircle className="w-5 h-5 text-red-500" />;
    default:
      return <Clock className="w-5 h-5 text-neutral-400" />;
  }
};

const getStatusVariant = (status: string) => {
  switch (status) {
    case 'present':
      return 'success';
    case 'late':
      return 'warning';
    case 'absent':
      return 'destructive';
    default:
      return 'info';
  }
};

export default function AttendanceTrackingPage() {
  const t = useTranslations('appointment');
  const tEmployee = useTranslations('appointment.employee');
  
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [selectedDate, setSelectedDate] = useState('2026-04-12');
  
  const filteredAttendance = mockAttendance.filter(record => {
    if (searchQuery && !record.applicantName.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    if (filterStatus !== 'all' && record.status !== filterStatus) return false;
    return true;
  });
  
  const stats = {
    total: mockAttendance.length,
    present: mockAttendance.filter(r => r.status === 'present').length,
    late: mockAttendance.filter(r => r.status === 'late').length,
    absent: mockAttendance.filter(r => r.status === 'absent').length,
    pending: mockAttendance.filter(r => r.status === 'pending').length,
  };

  const handleCheckIn = (id: string) => {
    console.log('Check in:', id);
    // API call
  };
  
  const handleCheckOut = (id: string) => {
    console.log('Check out:', id);
    // API call
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">{tEmployee('attendance')}</h1>
          <p className="text-neutral-500">{selectedDate}</p>
        </div>
        <div className="flex gap-2">
          <Input 
            type="date" 
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="w-auto"
          />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-neutral-100">
                <Users className="w-5 h-5 text-neutral-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.total}</p>
                <p className="text-sm text-neutral-500">Total</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-50">
                <UserCheck className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.present}</p>
                <p className="text-sm text-neutral-500">{tEmployee('present')}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-yellow-50">
                <Timer className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.late}</p>
                <p className="text-sm text-neutral-500">{tEmployee('late')}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-red-50">
                <UserX className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.absent}</p>
                <p className="text-sm text-neutral-500">{tEmployee('absent')}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-50">
                <Clock className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.pending}</p>
                <p className="text-sm text-neutral-500">Pending</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
              <Input 
                placeholder="Search by name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="ps-10"
              />
            </div>
            <select 
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 rounded-lg border border-neutral-200 bg-white"
            >
              <option value="all">All Status</option>
              <option value="present">{tEmployee('present')}</option>
              <option value="late">{tEmployee('late')}</option>
              <option value="absent">{tEmployee('absent')}</option>
              <option value="pending">Pending</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Attendance List */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-neutral-100">
                  <th className="text-start p-4 font-semibold text-neutral-600">Applicant</th>
                  <th className="text-start p-4 font-semibold text-neutral-600">Appointment</th>
                  <th className="text-start p-4 font-semibold text-neutral-600">Type</th>
                  <th className="text-start p-4 font-semibold text-neutral-600">Check In</th>
                  <th className="text-start p-4 font-semibold text-neutral-600">Status</th>
                  <th className="text-start p-4 font-semibold text-neutral-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredAttendance.map((record) => (
                  <tr key={record.id} className="border-b border-neutral-50 hover:bg-neutral-50">
                    <td className="p-4">
                      <span className="font-medium">{record.applicantName}</span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-neutral-400" />
                        {record.appointmentTime}
                      </div>
                    </td>
                    <td className="p-4">
                      <Badge variant="outline">
                        {t(`types.${record.appointmentType}`)}
                      </Badge>
                    </td>
                    <td className="p-4">
                      {record.checkInTime ? (
                        <span className={cn(
                          record.status === 'late' && "text-yellow-600 font-medium"
                        )}>
                          {record.checkInTime}
                        </span>
                      ) : (
                        <span className="text-neutral-400">-</span>
                      )}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(record.status)}
                        <Badge variant={getStatusVariant(record.status)}>
                          {tEmployee(record.status)}
                        </Badge>
                      </div>
                    </td>
                    <td className="p-4">
                      {record.status === 'pending' && (
                        <div className="flex gap-2">
                          <Button 
                            size="sm" 
                            onClick={() => handleCheckIn(record.id)}
                          >
                            {tEmployee('checkIn')}
                          </Button>
                        </div>
                      )}
                      {record.status === 'present' && (
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleCheckOut(record.id)}
                        >
                          {tEmployee('checkOut')}
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filteredAttendance.length === 0 && (
            <div className="p-8 text-center text-neutral-500">
              No attendance records found.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}