'use client';

import React, { Suspense } from 'react';
import { useAuth } from '@/hooks/useAuth';
import ApplicantDashboardPage from './ApplicantDashboardPage';
import EmployeeDashboardPage from './EmployeeDashboardPage';
import { useTranslations } from 'next-intl';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { dashboardService } from '@/services/dashboard.service';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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

const DashboardSkeleton = () => (
  <div className="max-w-7xl mx-auto space-y-12 py-12 px-6">
    <div className="h-40 w-2/3 bg-neutral-200 animate-pulse rounded-[40px]" />
    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
      {[1, 2, 3, 4].map(i => <div key={i} className="h-48 bg-neutral-200 animate-pulse rounded-[32px]" />)}
    </div>
    <div className="h-96 bg-neutral-200 animate-pulse rounded-[40px]" />
  </div>
);

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
  const t = useTranslations('dashboard');
  const tAdmin = useTranslations('admin');

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
    { name: t('admin.status.completed'), value: 245, color: '#10B981' },
    { name: t('admin.status.inReview'), value: 89, color: '#F59E0B' },
    { name: t('admin.status.submitted'), value: 56, color: '#3B82F6' },
    { name: t('admin.status.cancelled'), value: 23, color: '#EF4444' },
    { name: t('admin.status.draft'), value: 18, color: '#8B5CF6' },
  ];

  const trendData: TrendData[] = [
    { date: t('common.weekdays.sun'), applications: 32, completed: 28 },
    { date: t('common.weekdays.mon'), applications: 45, completed: 38 },
    { date: t('common.weekdays.tue'), applications: 38, completed: 35 },
    { date: t('common.weekdays.wed'), applications: 52, completed: 42 },
    { date: t('common.weekdays.thu'), applications: 47, completed: 41 },
    { date: t('common.weekdays.fri'), applications: 28, completed: 25 },
    { date: t('common.weekdays.sat'), applications: 15, completed: 12 },
  ];

  const recentActivity: ActivityItem[] = [
    { id: '1', type: 'application', title: tAdmin('recentActivity.applicationSubmitted'), description: t('admin.recentActivity.appSubmittedDesc', { id: 'MOJ-2025-84729163' }), timestamp: 'منذ 5 دقائق', icon: FileText },
    { id: '2', type: 'license', title: tAdmin('recentActivity.licenseIssued'), description: t('admin.recentActivity.licenseIssuedDesc', { id: 'MOJ-2025-12345678' }), timestamp: 'منذ 12 دقيقة', icon: FileKey2 },
    { id: '3', type: 'payment', title: tAdmin('recentActivity.paymentReceived'), description: t('admin.recentActivity.paymentReceivedDesc', { amount: 150, desc: 'رسوم اختبار نظري' }), timestamp: 'منذ 25 دقيقة', icon: DollarSign },
    { id: '4', type: 'user', title: tAdmin('recentActivity.userRegistered'), description: t('admin.recentActivity.userRegisteredDesc', { name: 'أحمد محمد' }), timestamp: 'منذ 45 دقيقة', icon: Users },
    { id: '5', type: 'application', title: t('common.recentActivity'), description: t('admin.recentActivity.appRejectedDesc', { id: 'MOJ-2025-92837465', reason: 'عدم الأهلية' }), timestamp: 'منذ ساعة', icon: FileText },
  ];

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('ar-SA', { style: 'currency', currency: 'SAR', maximumFractionDigits: 0 }).format(value);
  };

  const StatCard = ({ title, value, change, icon: Icon, index }: { title: string; value: string | number; change: number; icon: any; index: number }) => (
    <Card className="border border-white/10 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.3)] bg-white/5 backdrop-blur-3xl group hover:border-primary-500/30 transition-all duration-500 overflow-hidden relative rounded-[2.5rem]">
      <div className={cn(
        "absolute -top-12 -right-12 w-48 h-48 blur-[80px] opacity-10 group-hover:opacity-30 transition-opacity rounded-full",
        index === 0 ? 'bg-blue-500' : index === 1 ? 'bg-King blue-500' : index === 2 ? 'bg-amber-500' : 'bg-purple-500'
      )} />
      <CardContent className="p-8">
        <div className="flex items-start justify-between relative z-10">
          <div className="space-y-4">
            <p className="text-[10px] font-black text-neutral-500 uppercase tracking-[0.2em] mb-3 group-hover:text-primary-400 transition-colors">{title}</p>
            <h3 className="text-4xl font-black text-white tracking-tighter drop-shadow-sm">{value}</h3>
            <div className="flex items-center gap-2">
              <div className={cn(
                "flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black",
                change >= 0 ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'
              )}>
                {change >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                <span>{Math.abs(change)}%</span>
              </div>
              <span className="text-[10px] text-neutral-600 font-bold uppercase tracking-widest">{t('common.lastMonth')}</span>
            </div>
          </div>
          <div className={cn(
            "w-14 h-14 rounded-2xl flex items-center justify-center shadow-2xl transition-transform duration-500 group-hover:scale-110 border border-white/10",
            index === 0 ? 'bg-blue-600/20 text-blue-400' : index === 1 ? 'bg-King blue-600/20 text-King blue-400' : index === 2 ? 'bg-amber-600/20 text-amber-400' : 'bg-purple-600/20 text-purple-400'
          )}>
            <Icon className="w-7 h-7" />
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="max-w-7xl mx-auto py-12 px-6 space-y-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-10">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-500/10 border border-primary-500/20 text-[10px] font-black uppercase tracking-widest mb-4 text-primary-400">
            <Activity className="w-3.5 h-3.5" />
            {t('admin.systemStatus')}
          </div>
          <h1 className="text-4xl font-black text-white tracking-tighter font-arabic leading-none">{tAdmin('dashboard.title')}</h1>
          <p className="text-neutral-500 mt-3 text-lg font-bold font-arabic">{tAdmin('dashboard.subtitle')}</p>
        </motion.div>
        <div className="flex gap-4">
          <Button variant="outline" className="h-14 px-8 rounded-[1.25rem] border-white/10 bg-white/5 text-white font-black hover:bg-white/10 gap-3">
            <Calendar className="w-5 h-5 text-primary-400" />
            {t('common.today')}
          </Button>
          <Button className="h-14 px-8 rounded-[1.25rem] bg-primary-600 hover:bg-primary-500 text-white font-black gap-3 shadow-xl shadow-primary-900/40">
            <Download className="w-5 h-5" />
            {t('common.export')}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title={t('common.applicationsToday')} value={todayStats.applications} change={todayStats.applicationsChange} icon={FileText} index={0} />
        <StatCard title={t('common.licensesIssued')} value={todayStats.licenses} change={todayStats.licensesChange} icon={FileKey2} index={1} />
        <StatCard title={t('common.revenue')} value={formatCurrency(todayStats.revenue)} change={todayStats.revenueChange} icon={DollarSign} index={2} />
        <StatCard title={t('common.activeUsers')} value={todayStats.activeUsers} change={todayStats.usersChange} icon={Users} index={3} />
      </div>

      <div className="grid md:grid-cols-2 gap-10">
        <Card className="border border-white/10 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.5)] bg-white/5 backdrop-blur-3xl rounded-[2.5rem] overflow-hidden group">
          <CardHeader className="p-10 pb-4">
            <CardTitle className="text-2xl font-black flex items-center gap-4 text-white uppercase tracking-tight">
              <div className="w-2.5 h-10 bg-primary-500 rounded-full shadow-[0_0_20px_rgba(0,108,53,0.5)]" />
              {t('common.applicationsByStatus')}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-10 pt-4">
            <div className="h-[320px]">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsPieChart>
                  <Pie data={statusData} cx="50%" cy="50%" innerRadius={80} outerRadius={120} paddingAngle={4} dataKey="value">
                    {statusData.map((entry, index) => (<Cell key={`cell-${index}`} fill={entry.color} />))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0a0a0a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '1rem', color: '#fff' }}
                    itemStyle={{ fontSize: '12px', fontWeight: '900', textTransform: 'uppercase' }}
                  />
                  <Legend verticalAlign="bottom" height={36} wrapperStyle={{ paddingTop: '20px', fontSize: '10px', fontWeight: '900', textTransform: 'uppercase', opacity: 0.6 }} />
                </RechartsPieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-white/10 shadow-[0_32_64px_-16px_rgba(0,0,0,0.5)] bg-white/5 backdrop-blur-3xl rounded-[2.5rem] overflow-hidden group">
          <CardHeader className="p-10 pb-4">
            <CardTitle className="text-2xl font-black flex items-center gap-4 text-white uppercase tracking-tight">
              <div className="w-2.5 h-10 bg-blue-500 rounded-full shadow-[0_0_20px_rgba(59,130,246,0.5)]" />
              {t('common.applicationsTrend')}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-10 pt-4">
            <div className="h-[320px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#6B7280', fontWeight: '900' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 10, fill: '#6B7280', fontWeight: '900' }} axisLine={false} tickLine={false} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0a0a0a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '1rem', color: '#fff' }}
                  />
                  <Legend verticalAlign="bottom" height={36} wrapperStyle={{ paddingTop: '20px', fontSize: '10px', fontWeight: '900', textTransform: 'uppercase', opacity: 0.6 }} />
                  <Line type="monotone" dataKey="applications" name={t('common.applicationsToday')} stroke="#3B82F6" strokeWidth={4} dot={{ fill: '#3B82F6', r: 5, strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 8, strokeWidth: 0 }} />
                  <Line type="monotone" dataKey="completed" name={t('admin.status.completed')} stroke="#10B981" strokeWidth={4} dot={{ fill: '#10B981', r: 5, strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 8, strokeWidth: 0 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border border-white/10 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.5)] bg-white/5 backdrop-blur-3xl rounded-[2.5rem] overflow-hidden group">
        <CardHeader className="p-10 pb-4">
          <CardTitle className="text-2xl font-black flex items-center gap-4 text-white uppercase tracking-tight">
            <div className="w-2.5 h-10 bg-amber-500 rounded-full shadow-[0_0_20px_rgba(245,158,11,0.5)]" />
            {t('common.recentActivity')}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-10 pt-4">
          <div className="space-y-3">
            {recentActivity.map((item) => (
              <div key={item.id} className="flex items-center gap-6 p-6 rounded-[1.5rem] bg-white/[0.03] border border-white/5 hover:bg-white/[0.08] hover:border-primary-500/20 transition-all group/item">
                <div className={cn(
                  "w-14 h-14 rounded-2xl flex items-center justify-center shadow-xl group-hover/item:scale-110 transition-transform border border-white/5",
                  item.type === 'application' ? 'bg-blue-600/20 text-blue-400' : item.type === 'license' ? 'bg-King blue-600/20 text-King blue-400' : item.type === 'payment' ? 'bg-amber-600/20 text-amber-400' : 'bg-purple-600/20 text-purple-400'
                )}>
                  <item.icon className="w-7 h-7" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1">
                    <p className="font-black text-white text-lg tracking-tight font-arabic">{item.title}</p>
                    <span className="w-1.5 h-1.5 rounded-full bg-white/20" />
                    <span className="text-[10px] text-neutral-500 font-black uppercase tracking-widest">{item.timestamp}</span>
                  </div>
                  <p className="text-neutral-400 font-bold font-arabic truncate">{item.description}</p>
                </div>
                <Button variant="ghost" size="icon" className="text-neutral-500 hover:text-white hover:bg-white/10 rounded-xl opacity-0 group-hover/item:opacity-100 transition-opacity">
                  <TrendingUp className="w-5 h-5" />
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function DashboardPage() {
  const { user } = useAuth();

  const isAdmin = user?.role === 'Admin';
  const isEmployee = !!user?.role && ['Receptionist', 'Doctor', 'Examiner', 'Manager', 'Security'].includes(user.role);

  // Fetch Applicant Dashboard Data
  const { data: applicantData, isLoading: isApplicantLoading } = useQuery({
    queryKey: ['applicant-dashboard'],
    queryFn: () => dashboardService.getApplicantDashboard(),
    enabled: !!user && !isEmployee && !isAdmin,
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

  if (isAdmin) {
    return (
      <Suspense fallback={<DashboardSkeleton />}>
        <AdminDashboardContent />
      </Suspense>
    );
  }

  return (
    <Suspense fallback={<DashboardSkeleton />}>
      {isEmployee ? (
        <EmployeeDashboardPage data={managerData?.data || undefined} />
      ) : (
        <ApplicantDashboardPage data={applicantData?.data || undefined} user={user} />
      )}
    </Suspense>
  );
}

