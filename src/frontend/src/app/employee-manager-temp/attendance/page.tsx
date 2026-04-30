'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { UserRole, isManagerRole } from '@/lib/enums';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  Search, 
  Timer,
  Calendar,
  Clock,
  CheckCircle2,
  XCircle,
  Loader2,
  Filter,
  Download,
  TrendingUp
} from 'lucide-react';

interface AttendanceRecord {
  id: string;
  userId: string;
  userName: string;
  role: string;
  date: string;
  checkIn: string;
  checkOut: string | null;
  status: 'present' | 'absent' | 'late' | 'on-leave';
}

export default function ManagerAttendancePage() {
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState<string>(new Date().toISOString().split('T')[0]);
  const { user, isAuthenticated, isLoading: isAuthLoading } = useAuth();
  const router = useRouter();

  // RBAC check
  useEffect(() => {
    if (!isAuthLoading && (!isAuthenticated || (!isManagerRole(user?.role) && user?.role !== UserRole.Admin))) {
      router.replace('/forbidden');
    }
  }, [user, isAuthenticated, isAuthLoading, router]);

  // Mock data fetching (replace with real API)
  useEffect(() => {
    let isMounted = true;
    
    const fetchAttendance = async () => {
      try {
        setLoading(true);
        // Mock data - replace with real API call
        const mockData: AttendanceRecord[] = [
          { id: '1', userId: '1', userName: 'أحمد محمد', role: 'طبيب', date: dateFilter, checkIn: '08:00', checkOut: '16:30', status: 'present' },
          { id: '2', userId: '2', userName: 'سارة علي', role: 'مفتش', date: dateFilter, checkIn: '08:15', checkOut: '16:00', status: 'late' },
          { id: '3', userId: '3', userName: 'خالد يوسف', role: 'موظف استقبال', date: dateFilter, checkIn: '09:00', checkOut: null, status: 'absent' },
          { id: '4', userId: '4', userName: 'فاطمة عبدالله', role: 'أمن', date: dateFilter, checkIn: '07:45', checkOut: '15:45', status: 'present' },
          { id: '5', userId: '5', userName: 'محمد سعيد', role: 'مدير', date: dateFilter, checkIn: '08:00', checkOut: '17:00', status: 'present' },
        ];
        
        if (isMounted) {
          setRecords(mockData);
        }
      } catch (error) {
        console.error('فشل في تحميل الحضور:', error);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };
    
    if (isAuthenticated && (isManagerRole(user?.role) || user?.role === UserRole.Admin)) {
      fetchAttendance();
    }
    
    return () => { isMounted = false; };
  }, [user, isAuthenticated, dateFilter]);

  // Filter records
  const filteredRecords = records.filter(r => {
    const matchesSearch = !searchTerm || 
      r.userName.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  // Stats
  const presentCount = records.filter(r => r.status === 'present').length;
  const lateCount = records.filter(r => r.status === 'late').length;
  const absentCount = records.filter(r => r.status === 'absent').length;

  // Get status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'present':
        return <Badge className="bg-emerald-100 text-emerald-700 gap-1"><CheckCircle2 className="w-3 h-3" /> حاضر</Badge>;
      case 'late':
        return <Badge className="bg-amber-100 text-amber-700 gap-1"><Clock className="w-3 h-3" /> متأخر</Badge>;
      case 'absent':
        return <Badge className="bg-red-100 text-red-700 gap-1"><XCircle className="w-3 h-3" /> غائب</Badge>;
      case 'on-leave':
        return <Badge className="bg-blue-100 text-blue-700 gap-1"><Calendar className="w-3 h-3" /> بإجازة</Badge>;
      default:
        return null;
    }
  };

  // Get role label
  const getRoleLabel = (role: string): string => {
    const roles: Record<string, string> = {
      'موظف استقبال': 'موظف استقبال',
      'طبيب': 'طبيب',
      'مفتش': 'مفتش',
      'مدير': 'مدير',
      'أمن': 'أمن',
    };
    return roles[role] || role;
  };

  if (isAuthLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]" dir="rtl">
        <Loader2 className="w-10 h-10 animate-spin text-[#1a3a8f]" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-4 md:py-8 px-3 md:px-4 space-y-4 md:space-y-6 font-arabic" dir="rtl">
      {/* Header */}
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="w-10 h-10 sm:w-12 bg-[#1a3a8f] rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0">
            <Timer className="w-5 h-5 sm:w-6 text-white" />
          </div>
          <div>
            <h1 className="text-lg sm:text-2xl font-black text-neutral-900">الحضور والانصراف</h1>
            <p className="text-xs sm:text-sm text-neutral-500 hidden sm:block">سجل attendance الموظفين</p>
          </div>
        </div>
        <Button variant="outline" className="gap-2">
          <Download className="w-4 h-4" />
          تصدير
        </Button>
      </header>

      {/* Stats Cards */}
      <div className="grid grid-cols-3 gap-3">
        <Card className="border-none shadow-md">
          <CardContent className="p-4 text-center">
            <CheckCircle2 className="w-6 h-6 text-emerald-600 mx-auto mb-2" />
            <p className="text-2xl font-black text-emerald-600">{presentCount}</p>
            <p className="text-xs text-neutral-500">حاضر</p>
          </CardContent>
        </Card>
        <Card className="border-none shadow-md">
          <CardContent className="p-4 text-center">
            <Clock className="w-6 h-6 text-amber-600 mx-auto mb-2" />
            <p className="text-2xl font-black text-amber-600">{lateCount}</p>
            <p className="text-xs text-neutral-500">متأخر</p>
          </CardContent>
        </Card>
        <Card className="border-none shadow-md">
          <CardContent className="p-4 text-center">
            <XCircle className="w-6 h-6 text-red-600 mx-auto mb-2" />
            <p className="text-2xl font-black text-red-600">{absentCount}</p>
            <p className="text-xs text-neutral-500">غائب</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
          <Input 
            placeholder="البحث بالاسم..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pe-10 h-10"
          />
        </div>
        <Input 
          type="date"
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
          className="h-10"
        />
      </div>

      {/* Attendance List */}
      <div className="grid gap-3">
        {filteredRecords.length > 0 ? filteredRecords.map((record) => (
          <Card key={record.id} className="border-none shadow-md">
            <CardContent className="p-4">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#1a3a8f]/10 flex items-center justify-center">
                    <Users className="w-5 h-5 text-[#1a3a8f]" />
                  </div>
                  <div>
                    <p className="font-bold text-neutral-900">{record.userName}</p>
                    <p className="text-xs text-neutral-500">{getRoleLabel(record.role)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-left">
                    <p className="text-xs text-neutral-500">الدخول</p>
                    <p className="font-bold">{record.checkIn}</p>
                  </div>
                  <div className="text-left">
                    <p className="text-xs text-neutral-500">الخروج</p>
                    <p className="font-bold">{record.checkOut || '-'}</p>
                  </div>
                  {getStatusBadge(record.status)}
                </div>
              </div>
            </CardContent>
          </Card>
        )) : (
          <Card className="border-none shadow-lg">
            <CardContent className="p-8 text-center">
              <Users className="w-12 h-12 text-neutral-200 mx-auto mb-4" />
              <p className="text-neutral-500">لا توجد بيانات</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}