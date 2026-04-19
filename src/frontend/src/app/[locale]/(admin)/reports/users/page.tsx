'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  UserPlus,
  Activity,
  TrendingUp,
  TrendingDown,
  Download,
  PieChart,
  BarChart3,
  Crown,
  Shield,
  Stethoscope,
  ClipboardList,
  FileText,
  Clock
} from "lucide-react";
import { useTranslations, useFormatter } from 'next-intl';
import { useParams } from 'next/navigation';
import { useState } from 'react';
import {
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';

interface UserStats {
  total: number;
  activeThisMonth: number;
  newRegistrations: number;
  change: number;
}

interface RoleData {
  role: string;
  count: number;
  color: string;
}

interface NationalityData {
  nationality: string;
  count: number;
  percentage: number;
}

interface MostActiveUser {
  id: string;
  name: string;
  email: string;
  applications: number;
  lastActive: string;
}

const ROLE_COLORS = {
  Applicant: '#3B82F6',
  Admin: '#EF4444',
  Manager: '#8B5CF6',
  Receptionist: '#10B981',
  Doctor: '#F59E0B',
  Examiner: '#EC4899',
  Security: '#6366F1'
};

export default function UsersReportPage() {
  const t = useTranslations('admin');
  const format = useFormatter();
  const { locale } = useParams();
  const isRTL = locale === 'ar';

  // Mock data
  const userStats: UserStats = {
    total: 8542,
    activeThisMonth: 3250,
    newRegistrations: 456,
    change: 8.5
  };

  const roleData: RoleData[] = [
    { role: t('users.roles.Applicant'), count: 7820, color: ROLE_COLORS.Applicant },
    { role: t('users.roles.Receptionist'), count: 45, color: ROLE_COLORS.Receptionist },
    { role: t('users.roles.Manager'), count: 12, color: ROLE_COLORS.Manager },
    { role: t('users.roles.Doctor'), count: 28, color: ROLE_COLORS.Doctor },
    { role: t('users.roles.Examiner'), count: 35, color: ROLE_COLORS.Examiner },
    { role: t('users.roles.Security'), count: 22, color: ROLE_COLORS.Security },
    { role: t('users.roles.Admin'), count: 8, color: ROLE_COLORS.Admin },
  ];

  const nationalityData: NationalityData[] = [
    { nationality: t('nationalities.yem'), count: 6250, percentage: 73.2 },
    { nationality: t('nationalities.egy'), count: 890, percentage: 10.4 },
    { nationality: t('nationalities.jor'), count: 520, percentage: 6.1 },
    { nationality: t('nationalities.pal'), count: 380, percentage: 4.4 },
    { nationality: t('nationalities.som'), count: 290, percentage: 3.4 },
    { nationality: t('reports.common.all'), count: 212, percentage: 2.5 },
  ];

  const mostActiveUsers: MostActiveUser[] = [
    { id: '1', name: locale === 'ar' ? 'أحمد محمد' : 'Ahmed Mohammed', email: 'ahmed@example.com', applications: 12, lastActive: '2026-02-01 09:15:23' },
    { id: '2', name: locale === 'ar' ? 'سعيد خالد' : 'Said Khalid', email: 'saeed@example.com', applications: 10, lastActive: '2026-02-01 08:45:12' },
    { id: '3', name: locale === 'ar' ? 'عبدالله عمر' : 'Abdullah Omar', email: 'abdullah@example.com', applications: 8, lastActive: '2026-02-01 07:22:45' },
    { id: '4', name: locale === 'ar' ? 'فاطمة علي' : 'Fatima Ali', email: 'fatima@example.com', applications: 7, lastActive: '2026-02-01 05:55:30' },
  ];

  const inactiveUsers = [
    { id: '1', name: locale === 'ar' ? 'خالد إبراهيم' : 'Khalid Ibrahim', email: 'khaled@example.com', lastLogin: '2026-01-10', daysInactive: 25 },
    { id: '2', name: locale === 'ar' ? 'نورة محمد' : 'Nora Mohammed', email: 'nora@example.com', lastLogin: '2026-01-15', daysInactive: 20 },
    { id: '3', name: locale === 'ar' ? 'عمر سعيد' : 'Omar Said', email: 'omar@example.com', lastLogin: '2026-01-18', daysInactive: 17 },
  ];

  const registrationTrend = [
    { month: t('months.jan'), registrations: 120 },
    { month: t('months.feb'), registrations: 145 },
    { month: t('months.mar'), registrations: 168 },
    { month: t('months.apr'), registrations: 156 },
  ];

  const StatCard = ({
    title,
    value,
    change,
    icon: Icon,
    index
  }: {
    title: string;
    value: string | number;
    change: number;
    icon: any;
    index: number;
  }) => (
    <Card className="border-0 shadow-sm">
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <p className="text-sm text-neutral-500 font-medium">{title}</p>
            <p className="text-2xl font-bold text-neutral-900">{value.toLocaleString()}</p>
            <div className="flex items-center gap-1">
              {change >= 0 ? (
                <TrendingUp className="w-4 h-4 text-primary-500" />
              ) : (
                <TrendingDown className="w-4 h-4 text-red-500" />
              )}
              <span className={`text-sm font-medium ${change >= 0 ? 'text-primary-600' : 'text-red-600'}`}>
                {Math.abs(change)}%
              </span>
              <span className="text-xs text-neutral-400">{t('reports.financial.vsLastMonth')}</span>
            </div>
          </div>
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${index === 0 ? 'bg-blue-50' :
              index === 1 ? 'bg-primary-50' :
                index === 2 ? 'bg-purple-50' : 'bg-amber-50'
            }`}>
            <Icon className={`w-6 h-6 ${index === 0 ? 'text-blue-500' :
                index === 1 ? 'text-primary-500' :
                  index === 2 ? 'text-purple-500' : 'text-amber-500'
              }`} />
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900">{t('reports.users.title')}</h1>
          <p className="text-neutral-500 mt-1">{t('reports.users.subtitle')}</p>
        </div>
        <Button className="gap-2 bg-primary-500 hover:bg-primary-600">
          <Download className="w-4 h-4" />
          {t('reports.common.exportCSV')}
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title={t('reports.users.totalUsers')}
          value={userStats.total}
          change={userStats.change}
          icon={Users}
          index={0}
        />
        <StatCard
          title={t('reports.users.activeUsers')}
          value={userStats.activeThisMonth}
          change={5.2}
          icon={Activity}
          index={1}
        />
        <StatCard
          title={t('reports.users.newRegistrations')}
          value={userStats.newRegistrations}
          change={12.8}
          icon={UserPlus}
          index={2}
        />
        <StatCard
          title={t('reports.users.activityRate')}
          value={format.number(0.38, { style: 'percent' })}
          change={2.1}
          icon={TrendingUp}
          index={3}
        />
      </div>

      {/* Charts Row */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Role Distribution - Pie Chart */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <PieChart className="w-5 h-5 text-primary-500" />
              {t('reports.users.byRole')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsPieChart>
                  <Pie
                    data={roleData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={2}
                    dataKey="count"
                    nameKey="role"
                  >
                    {roleData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                  />
                  <Legend
                    formatter={(value) => <span className="text-sm text-neutral-600">{value}</span>}
                  />
                </RechartsPieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Registration Trend - Bar Chart */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-primary-500" />
              {t('reports.users.activityTrend')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={registrationTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} axisLine={{ stroke: '#E5E7EB' }} />
                  <YAxis tick={{ fontSize: 12 }} axisLine={{ stroke: '#E5E7EB' }} />
                  <Tooltip
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                  />
                  <Bar dataKey="registrations" fill="#6366F1" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Nationality Breakdown */}
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Users className="w-5 h-5 text-primary-500" />
            {t('reports.users.byNationality')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {nationalityData.map((item, index) => (
              <div key={index} className="p-4 bg-neutral-50 rounded-xl text-center">
                <p className="text-xl font-bold text-neutral-900">{item.count.toLocaleString()}</p>
                <p className="text-sm text-neutral-600 mt-1">{item.nationality}</p>
                <p className="text-xs text-neutral-400 mt-1">{item.percentage}%</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Most Active & Inactive Users */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Most Active Users */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Activity className="w-5 h-5 text-primary-500" />
              {t('reports.users.mostActive')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mostActiveUsers.map((user, index) => (
                <div key={user.id} className="flex items-center gap-4 p-3 rounded-lg hover:bg-neutral-50">
                  <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 font-bold">
                    {index + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-neutral-900">{user.name}</p>
                    <p className="text-sm text-neutral-500 truncate">{user.email}</p>
                  </div>
                  <div className="text-end">
                    <p className="font-bold text-primary-600">{user.applications}</p>
                    <p className="text-xs text-neutral-400">{t('reports.users.applications')}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Inactive Users */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Clock className="w-5 h-5 text-orange-500" />
              {t('reports.users.inactive')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {inactiveUsers.map((user) => (
                <div key={user.id} className="flex items-center gap-4 p-3 rounded-lg hover:bg-neutral-50">
                  <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
                    <Clock className="w-5 h-5 text-orange-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-neutral-900">{user.name}</p>
                    <p className="text-sm text-neutral-500 truncate">{user.email}</p>
                  </div>
                  <div className="text-end">
                    <Badge variant="outline" className="text-orange-600 border-orange-200">
                      {user.daysInactive} {t('common.units.days')}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}