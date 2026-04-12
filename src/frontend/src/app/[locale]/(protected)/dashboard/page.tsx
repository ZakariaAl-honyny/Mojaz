'use client';

import React, { Suspense } from 'react';
import { useAuth } from '@/hooks/useAuth';
import ApplicantDashboardPage from './ApplicantDashboardPage';
import EmployeeDashboardPage from './EmployeeDashboardPage';
import { useTranslations } from 'next-intl';
<<<<<<< Updated upstream
import { useQuery } from '@tanstack/react-query';
import { dashboardService } from '@/services/dashboard.service';
import { Skeleton } from '@/components/ui/skeleton';

const DashboardSkeleton = () => (
  <div className="max-w-7xl mx-auto space-y-12 py-12 px-6">
    <div className="h-40 w-2/3 bg-neutral-200 animate-pulse rounded-[40px]" />
    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
      {[1, 2, 3, 4].map(i => <div key={i} className="h-48 bg-neutral-200 animate-pulse rounded-[32px]" />)}
    </div>
    <div className="h-96 bg-neutral-200 animate-pulse rounded-[40px]" />
  </div>
);
=======
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  FileText,
  FileKey2,
  DollarSign,
  Users,
  TrendingUp,
  TrendingDown,
  Calendar,
  Download,
  BarChart3,
  PieChart,
  Activity
} from "lucide-react";
import { useParams } from 'next/navigation';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';

interface StatusData {
  name: string;
  value: number;
  color: string;
}

interface TrendData {
  date: string;
  applications: number;
  completed: number;
}

interface ActivityItem {
  id: string;
  type: 'application' | 'license' | 'payment' | 'user';
  title: string;
  description: string;
  timestamp: string;
  icon: any;
}

function AdminDashboardContent() {
  const t = useTranslations('admin');
  const { locale } = useParams();

  const todayStats = {
    applications: 47,
    licenses: 23,
    revenue: 45250,
    activeUsers: 156,
    applicationsChange: 12.5,
    licensesChange: 8.3,
    revenueChange: 15.2,
    usersChange: -2.1
  };

  const statusData: StatusData[] = [
    { name: 'مكتمل', value: 245, color: '#10B981' },
    { name: 'قيد المراجعة', value: 89, color: '#F59E0B' },
    { name: 'مستقدم', value: 56, color: '#3B82F6' },
    { name: 'ملغي', value: 23, color: '#EF4444' },
    { name: 'مسودة', value: 18, color: '#8B5CF6' },
  ];

  const trendData: TrendData[] = [
    { date: 'الأحد', applications: 32, completed: 28 },
    { date: 'الاثنين', applications: 45, completed: 38 },
    { date: 'الثلاثاء', applications: 38, completed: 35 },
    { date: 'الأربعاء', applications: 52, completed: 42 },
    { date: 'الخميس', applications: 47, completed: 41 },
    { date: 'الجمعة', applications: 28, completed: 25 },
    { date: 'السبت', applications: 15, completed: 12 },
  ];

  const recentActivity: ActivityItem[] = [
    { id: '1', type: 'application', title: 'طلب جديد', description: 'تم تقديم طلب جديد - MOJ-2025-84729163', timestamp: 'منذ 5 دقائق', icon: FileText },
    { id: '2', type: 'license', title: 'رخصة مُصدرة', description: 'تم إصدار رخصة القيادة رقم MOJ-2025-12345678', timestamp: 'منذ 12 دقيقة', icon: FileKey2 },
    { id: '3', type: 'payment', title: 'دفعة مستلمة', description: 'دفعة بقيمة 150 ريال - رسوم اختبار نظري', timestamp: 'منذ 25 دقيقة', icon: DollarSign },
    { id: '4', type: 'user', title: 'مستخدم جديد', description: 'تم تسجيل مستخدم جديد: أحمد محمد', timestamp: 'منذ 45 دقيقة', icon: Users },
    { id: '5', type: 'application', title: 'طلب مرفوض', description: 'تم رفض طلب MOJ-2025-92837465 - عدم الأهلية', timestamp: 'منذ ساعة', icon: FileText },
  ];

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('ar-SA', { style: 'currency', currency: 'SAR', maximumFractionDigits: 0 }).format(value);
  };

  const StatCard = ({ title, value, change, icon: Icon, index }: { title: string; value: string | number; change: number; icon: any; index: number }) => (
    <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <p className="text-sm text-neutral-500 font-medium">{title}</p>
            <p className="text-2xl font-bold text-neutral-900">{value}</p>
            <div className="flex items-center gap-1">
              {change >= 0 ? <TrendingUp className="w-4 h-4 text-green-500" /> : <TrendingDown className="w-4 h-4 text-red-500" />}
              <span className={`text-sm font-medium ${change >= 0 ? 'text-green-600' : 'text-red-600'}`}>{Math.abs(change)}%</span>
            </div>
          </div>
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${index === 0 ? 'bg-blue-50' : index === 1 ? 'bg-green-50' : index === 2 ? 'bg-amber-50' : 'bg-purple-50'}`}>
            <Icon className={`w-6 h-6 ${index === 0 ? 'text-blue-500' : index === 1 ? 'text-green-500' : index === 2 ? 'text-amber-500' : 'text-purple-500'}`} />
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900">{t('dashboard.title')}</h1>
          <p className="text-neutral-500 mt-1">{t('dashboard.subtitle')}</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="gap-2">
            <Calendar className="w-4 h-4" />
            {t('dashboard.today')}
          </Button>
          <Button className="gap-2 bg-primary-500 hover:bg-primary-600">
            <Download className="w-4 h-4" />
            {t('dashboard.export')}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title={t('dashboard.applicationsToday')} value={todayStats.applications} change={todayStats.applicationsChange} icon={FileText} index={0} />
        <StatCard title={t('dashboard.licensesIssued')} value={todayStats.licenses} change={todayStats.licensesChange} icon={FileKey2} index={1} />
        <StatCard title={t('dashboard.revenue')} value={formatCurrency(todayStats.revenue)} change={todayStats.revenueChange} icon={DollarSign} index={2} />
        <StatCard title={t('dashboard.activeUsers')} value={todayStats.activeUsers} change={todayStats.usersChange} icon={Users} index={3} />
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <PieChart className="w-5 h-5 text-primary-500" />
              {t('dashboard.applicationsByStatus')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsPieChart>
                  <Pie data={statusData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={2} dataKey="value">
                    {statusData.map((entry, index) => (<Cell key={`cell-${index}`} fill={entry.color} />))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </RechartsPieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-primary-500" />
              {t('dashboard.applicationsTrend')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis dataKey="date" tick={{ fontSize: 12, fill: '#6B7280' }} />
                  <YAxis tick={{ fontSize: 12, fill: '#6B7280' }} />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="applications" name="طلبات" stroke="#3B82F6" strokeWidth={2} dot={{ fill: '#3B82F6', r: 4 }} />
                  <Line type="monotone" dataKey="completed" name="مكتمل" stroke="#10B981" strokeWidth={2} dot={{ fill: '#10B981', r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Activity className="w-5 h-5 text-primary-500" />
            {t('dashboard.recentActivity')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivity.map((item) => (
              <div key={item.id} className="flex items-start gap-4 p-4 rounded-xl hover:bg-neutral-50 transition-colors">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${item.type === 'application' ? 'bg-blue-50' : item.type === 'license' ? 'bg-green-50' : item.type === 'payment' ? 'bg-amber-50' : 'bg-purple-50'}`}>
                  <item.icon className={`w-5 h-5 ${item.type === 'application' ? 'text-blue-500' : item.type === 'license' ? 'text-green-500' : item.type === 'payment' ? 'text-amber-500' : 'text-purple-500'}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-neutral-900">{item.title}</p>
                  <p className="text-sm text-neutral-500 truncate">{item.description}</p>
                </div>
                <span className="text-xs text-neutral-400 whitespace-nowrap">{item.timestamp}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
>>>>>>> Stashed changes

export default function DashboardPage() {
  const { user } = useAuth();
  const t = useTranslations('dashboard');

<<<<<<< Updated upstream
  const isEmployee = !!user?.role && ['Receptionist', 'Doctor', 'Examiner', 'Manager', 'Security'].includes(user.role);
=======
  const isAdmin = user?.role === 'Admin';
  const isEmployee = user?.role && ['Receptionist', 'Doctor', 'Examiner', 'Manager', 'Security'].includes(user.role);
>>>>>>> Stashed changes

  // Fetch Applicant Dashboard Data
  const { data: applicantData, isLoading: isApplicantLoading } = useQuery({
    queryKey: ['applicant-dashboard'],
    queryFn: () => dashboardService.getApplicantDashboard(),
    enabled: !!user && !isEmployee,
  });

  // Fetch Manager/Employee Data (if applicable)
  const { data: managerData, isLoading: isManagerLoading } = useQuery({
    queryKey: ['manager-dashboard'],
    queryFn: () => dashboardService.getManagerDashboard(),
    enabled: !!user && isEmployee,
  });

  if (!user || isApplicantLoading || isManagerLoading) {
    return <DashboardSkeleton />;
  }

<<<<<<< Updated upstream
  return (
    <Suspense fallback={<DashboardSkeleton />}>
      {isEmployee ? (
        <EmployeeDashboardPage data={managerData?.data || undefined} />
      ) : (
        <ApplicantDashboardPage data={applicantData?.data || undefined} user={user} />
      )}
    </Suspense>
  );
=======
  if (isAdmin) {
    return <AdminDashboardContent />;
  }

  return isEmployee ? <EmployeeDashboardPage /> : <ApplicantDashboardPage />;
>>>>>>> Stashed changes
}
