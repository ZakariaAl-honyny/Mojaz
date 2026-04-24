'use client';

import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { isAdminRole, isEmployeeRole } from '@/lib/enums';
import ApplicantDashboardPage from './ApplicantDashboardPage';
import EmployeeDashboardPage from './EmployeeDashboardPage';
import { useQuery } from '@tanstack/react-query';
import { dashboardService } from '@/services/dashboard.service';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StatsCard } from "@/components/ui/stats-card";
import { AdminKpiDto, ActivityItem as AdminActivityItem } from '@/types/application.types';
import {
  FileText,
  FileKey2,
  DollarSign,
  Users,
  Calendar,
  Download,
  BarChart3,
  PieChart,
  Activity,
  ChevronLeft,
  RefreshCw,
  AlertCircle
} from "lucide-react";
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

const DashboardSkeleton = () => (
  <div className="max-w-5xl mx-auto space-y-6 md:space-y-8 py-6 md:py-10 px-4 md:px-6">
    <div className="h-24 md:h-32 w-full md:w-1/2 bg-neutral-100 animate-pulse rounded-xl md:rounded-2xl" />
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
      {[1, 2, 3, 4].map(i => <div key={i} className="h-24 md:h-32 bg-neutral-100 animate-pulse rounded-xl" />)}
    </div>
    <div className="h-64 md:h-80 bg-neutral-100 animate-pulse rounded-xl md:rounded-2xl" />
  </div>
);

// Error State Component
interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

function DashboardErrorState({ 
  title = 'حدث خطأ في تحميل البيانات', 
  message = 'يرجى المحاولة مرة أخرى أو الاتصال بالدعم الفني في حال استمرار المشكلة.',
  onRetry 
}: ErrorStateProps) {
  return (
    <div className="max-w-5xl mx-auto py-10 px-4">
      <Card className="border border-red-200 bg-red-50/50 rounded-xl overflow-hidden">
        <CardContent className="p-8 md:p-12 flex flex-col items-center justify-center text-center space-y-6">
          <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center">
            <AlertCircle className="w-8 h-8 text-red-500" />
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-black text-red-700">{title}</h3>
            <p className="text-sm text-neutral-500 font-medium max-w-md">{message}</p>
          </div>
          {onRetry && (
            <Button 
              onClick={onRetry}
              className="h-10 px-6 bg-[#1a3a8f] hover:bg-[#152d6f] text-white rounded-lg font-bold gap-2 shadow-lg"
            >
              <RefreshCw className="w-4 h-4" />
              إعادة المحاولة
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// Helper to get icon by type
const getActivityIcon = (type: string) => {
  switch (type) {
    case 'application': return FileText;
    case 'license': return FileKey2;
    case 'payment': return DollarSign;
    case 'user': return Users;
    default: return FileText;
  }
};

interface AdminDashboardContentProps {
  data: AdminKpiDto;
}

function AdminDashboardContent({ data }: AdminDashboardContentProps) {
  const { todayStats, statusDistribution, weeklyTrend, recentActivity } = data;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('ar-YE', { 
      style: 'currency', 
      currency: 'YER', 
      maximumFractionDigits: 0 
    }).format(value);
  };

  return (
    <div className="max-w-5xl mx-auto py-6 sm:py-10 px-4 space-y-8 sm:space-y-10 font-arabic" dir="rtl">
      {/* Admin Header */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-5 px-0 md:px-4">
        <div className="flex items-center gap-3 md:gap-4">
          <div className="w-1 md:w-1.5 h-8 md:h-10 bg-[#1a3a8f] rounded-full shadow-lg shadow-blue-900/20" />
          <div>
            <h1 className="text-xl md:text-2xl font-black text-neutral-900 tracking-tight leading-none mb-1 md:mb-1.5">
              لوحة الإشراف الإداري
            </h1>
            <p className="text-neutral-500 font-bold text-[10px] uppercase tracking-widest leading-none">إحصائيات المنصة والرقابة العملياتية الشاملة</p>
          </div>
        </div>
        
        <div className="flex gap-2 sm:gap-2.5">
          <Button variant="outline" className="h-9 md:h-10 px-4 md:px-5 rounded-lg border-neutral-200 bg-white hover:bg-neutral-50 gap-2 font-black text-[9px] md:text-[10px] uppercase tracking-widest transition-all">
            <Calendar className="w-3.5 h-3.5 text-neutral-400" />
            تقرير اليوم
          </Button>
          <Button className="h-9 md:h-10 px-4 md:px-5 rounded-lg bg-[#1a3a8f] hover:bg-[#152d6f] text-white shadow-lg shadow-blue-900/10 gap-2 font-black text-[9px] md:text-[10px] uppercase tracking-widest transition-all">
            <Download className="w-3.5 h-3.5" />
            تصدير البيانات
          </Button>
        </div>
      </header>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5 px-0 md:px-4">
        <StatsCard 
          label="الطلبات المستلمة اليوم" 
          value={todayStats.applications} 
          trend={todayStats.applicationsChange}
          trendDirection={todayStats.applicationsChange >= 0 ? 'up' : 'down'}
          icon={<FileText className="w-5 h-5 md:w-6 md:h-6 text-[#1a3a8f]" />}
        />
        <StatsCard 
          label="الرخص المُصدرة اليوم" 
          value={todayStats.licenses} 
          trend={todayStats.licensesChange}
          trendDirection={todayStats.licensesChange >= 0 ? 'up' : 'down'}
          icon={<FileKey2 className="w-5 h-5 md:w-6 md:h-6 text-emerald-600" />}
        />
        <StatsCard 
          label="إجمالي الإيرادات" 
          value={formatCurrency(todayStats.revenue)} 
          trend={todayStats.revenueChange}
          trendDirection={todayStats.revenueChange >= 0 ? 'up' : 'down'}
          icon={<DollarSign className="w-5 h-5 md:w-6 md:h-6 text-indigo-600" />}
        />
        <StatsCard 
          label="المستخدمين الجدد" 
          value={todayStats.activeUsers} 
          trend={todayStats.usersChange}
          trendDirection={todayStats.usersChange >= 0 ? 'up' : 'down'}
          icon={<Users className="w-5 h-5 md:w-6 md:h-6 text-amber-600" />}
        />
      </div>

      {/* Analytics Section */}
      <div className="grid lg:grid-cols-3 gap-6 md:gap-8 px-0 md:px-4">
        <Card className="lg:col-span-2 border border-neutral-200 shadow-sm rounded-xl md:rounded-2xl overflow-hidden bg-white">
          <CardHeader className="p-4 md:p-5 border-b border-neutral-100 flex flex-row items-center justify-between space-y-0">
            <div className="flex items-center gap-3">
               <div className="w-8 h-8 rounded-lg bg-primary-50 flex items-center justify-center">
                  <BarChart3 className="w-4 h-4 text-[#1a3a8f]" />
               </div>
               <CardTitle className="text-base md:text-lg font-black text-neutral-900 tracking-tight">مخطط الكفاءة التشغيلية</CardTitle>
            </div>
            <div className="text-[8px] md:text-[9px] font-black text-neutral-400 bg-neutral-50 px-2.5 py-1 rounded-full uppercase tracking-widest border border-neutral-100">
               بيانات أسبوعية
            </div>
          </CardHeader>
          <CardContent className="p-4 md:p-6 lg:p-8 pt-6 md:pt-10">
            <div className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={weeklyTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                  <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94A3B8', fontWeight: 900 }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94A3B8', fontWeight: 900 }} dx={-10} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 40px -10px rgba(0,0,0,0.1)', fontFamily: 'inherit' }}
                  />
                  <Legend verticalAlign="top" align="right" iconType="circle" wrapperStyle={{ paddingBottom: '30px', fontSize: '12px', fontWeight: '900' }} />
                  <Line type="stepAfter" dataKey="applications" name="طلبات جديدة" stroke="#1a3a8f" strokeWidth={4} dot={false} activeDot={{ r: 8, strokeWidth: 0, fill: '#1a3a8f' }} />
                  <Line type="monotone" dataKey="completed" name="عمليات مكتملة" stroke="#D4A017" strokeWidth={4} dot={false} activeDot={{ r: 8, strokeWidth: 0, fill: '#D4A017' }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-[#1a3a8f] shadow-lg bg-[#0f1e4a] rounded-xl md:rounded-2xl overflow-hidden text-white relative">
          <div className="absolute top-0 right-0 w-48 md:w-64 h-48 md:h-64 bg-[#1a3a8f]/40 blur-[60px] md:blur-[80px] -mr-24 md:-mr-32 -mt-24 md:-mt-32" />
          <CardHeader className="p-4 md:p-6 pb-3 relative z-10">
             <div className="flex flex-col items-center gap-2">
               <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center border border-white/10">
                  <PieChart className="w-5 h-5 text-[#D4A017]" />
               </div>
               <CardTitle className="text-base md:text-lg font-black text-center tracking-tight">حالات الرخص</CardTitle>
             </div>
          </CardHeader>
          <CardContent className="p-4 md:p-6 lg:p-8 relative z-10 mt-2 md:mt-4">
            <div className="h-[200px] md:h-[250px] flex items-center justify-center relative">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsPieChart>
                  <Pie data={statusDistribution} cx="50%" cy="50%" innerRadius={60} outerRadius={85} paddingAngle={6} dataKey="value" stroke="none" cornerRadius={8}>
                    {statusDistribution.map((entry, index) => (<Cell key={`cell-${index}`} fill={entry.color} />))}
                  </Pie>
                  <Tooltip />
                </RechartsPieChart>
              </ResponsiveContainer>
              <div className="absolute flex flex-col items-center justify-center mt-1 md:mt-2">
                <span className="text-2xl md:text-3xl font-black text-white tracking-widest">
                  {statusDistribution.reduce((sum, item) => sum + item.value, 0)}
                </span>
                <span className="text-[8px] md:text-[9px] font-black text-white/40 uppercase tracking-[0.25em]">الإجمالي التشغيلي</span>
              </div>
            </div>
            
            <div className="mt-8 space-y-3">
               {statusDistribution.slice(0, 3).map((item, i) => (
                 <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5">
                    <div className="flex items-center gap-3">
                       <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                       <span className="text-xs font-black text-white/80">{item.name}</span>
                    </div>
                    <span className="text-xs font-black text-[#D4A017]">{item.value}+</span>
                 </div>
               ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Activity Log */}
      <Card className="border border-neutral-200 shadow-sm bg-white rounded-xl overflow-hidden mx-0 md:mx-4">
        <CardHeader className="p-4 md:p-5 border-b border-neutral-100 flex flex-row items-center justify-between space-y-0">
          <div className="flex items-center gap-3">
             <div className="w-8 h-8 rounded-lg bg-neutral-100 flex items-center justify-center">
                <Activity className="w-4 h-4 text-neutral-500" />
             </div>
             <CardTitle className="text-base md:text-xl font-black text-neutral-900 tracking-tight">سجل النشاطات الرقابي</CardTitle>
          </div>
          <Button variant="ghost" className="text-[#1a3a8f] font-black text-xs md:text-sm hover:bg-[#1a3a8f]/5 gap-1.5 md:gap-2 group h-9 md:h-10 px-3 md:px-4">
            عرض التفاصيل
            <ChevronLeft className="w-3.5 h-3.5 md:w-4 md:h-4 group-hover:-translate-x-1 transition-transform" />
          </Button>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-neutral-50">
            {recentActivity.map((item: AdminActivityItem) => {
              const IconComponent = getActivityIcon(item.type);
              return (
                <div key={item.id} className="flex items-center gap-4 md:gap-6 p-4 md:p-6 hover:bg-neutral-50/50 transition-all group">
                  <div className={`w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center transition-transform group-hover:scale-105 border shadow-sm flex-shrink-0 ${
                    item.type === 'application' ? 'bg-primary-50 text-[#1a3a8f] border-primary-100/50' : 
                    item.type === 'license' ? 'bg-emerald-50 text-emerald-600 border-emerald-100/50' : 
                    item.type === 'payment' ? 'bg-amber-50 text-[#D4A017] border-amber-100/50' : 
                    'bg-indigo-50 text-indigo-600 border-indigo-100/50'
                  }`}>
                    <IconComponent className="w-5 h-5 md:w-6 md:h-6" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 md:gap-3 mb-1">
                       <p className="text-sm md:text-base font-black text-neutral-900 leading-none truncate">{item.title}</p>
                       <span className="text-[8px] md:text-[10px] font-black text-neutral-400 bg-neutral-100 px-2 py-0.5 md:py-1 rounded-md uppercase tracking-tight shadow-none flex-shrink-0">{item.timestamp}</span>
                    </div>
                    <p className="text-xs md:text-sm text-neutral-500 font-bold leading-relaxed line-clamp-1">{item.description}</p>
                  </div>
                  <Button variant="outline" className="hidden sm:flex h-9 px-4 rounded-lg border-neutral-200 text-[10px] font-black shadow-sm bg-white hover:bg-neutral-50 transition-all opacity-0 group-hover:opacity-100">
                      تحقق
                  </Button>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function DashboardPage() {
  const { user } = useAuth();

  const isAdmin = isAdminRole(user?.role);
  const isEmployee = isEmployeeRole(user?.role);

  // Fetch Applicant Dashboard Data
  const { 
    data: applicantData, 
    isLoading: isApplicantLoading,
    error: applicantError,
    refetch: refetchApplicant 
  } = useQuery({
    queryKey: ['applicant-dashboard'],
    queryFn: () => dashboardService.getApplicantDashboard(),
    enabled: !!user && !isEmployee,
  });

  // Fetch Manager/Employee Data (if applicable)
  const { 
    data: managerData, 
    isLoading: isManagerLoading,
    error: managerError,
    refetch: refetchManager 
  } = useQuery({
    queryKey: ['manager-dashboard'],
    queryFn: () => dashboardService.getManagerDashboard(),
    enabled: !!user && !!isEmployee,
  });

  // Fetch Admin Dashboard Data
  const { 
    data: adminData, 
    isLoading: isAdminLoading,
    error: adminError,
    refetch: refetchAdmin 
  } = useQuery({
    queryKey: ['admin-dashboard'],
    queryFn: () => dashboardService.getAdminDashboard(),
    enabled: !!user && !!isAdmin,
  });

  // Loading state
  if (!user || isApplicantLoading || isManagerLoading || isAdminLoading) {
    return <DashboardSkeleton />;
  }

  // Error state for Applicant
  if (!isEmployee && !isAdmin && applicantError) {
    return <DashboardErrorState onRetry={() => refetchApplicant()} />;
  }

  // Error state for Manager/Employee
  if (isEmployee && !isAdmin && managerError) {
    return <DashboardErrorState onRetry={() => refetchManager()} />;
  }

  // Error state for Admin
  if (isAdmin && adminError) {
    return <DashboardErrorState onRetry={() => refetchAdmin()} />;
  }

  // Admin Dashboard (connected to API)
  if (isAdmin) {
    return <AdminDashboardContent data={adminData?.data!} />;
  }

  // Employee/Manager Dashboard
  if (isEmployee) {
    return (
      <EmployeeDashboardPage 
        data={managerData?.data} 
      />
    );
  }

  // Applicant Dashboard
  return (
    <ApplicantDashboardPage 
      data={applicantData?.data} 
      userName={user?.fullName || ''} 
    />
  );
}