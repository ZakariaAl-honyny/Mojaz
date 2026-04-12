'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Clock,
  CheckCircle2,
  TrendingUp,
  Download,
  BarChart3,
  Users,
  Building2,
  Target,
  Activity,
  Timer,
  Percent
} from "lucide-react";
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import { useState } from 'react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from 'recharts';

interface KPI {
  label: string;
  value: string;
  change: number;
  target: string;
}

interface EmployeePerformance {
  id: string;
  name: string;
  role: string;
  applicationsProcessed: number;
  approvalRate: number;
  avgProcessingTime: number;
  rating: number;
}

interface CenterPerformance {
  center: string;
  applications: number;
  passRate: number;
  avgTime: number;
}

export default function PerformanceReportPage() {
  const t = useTranslations('reports');
  const { locale } = useParams();
  const isRTL = locale === 'ar';

  // KPIs
  const kpis: KPI[] = [
    { label: locale === 'ar' ? 'متوسط وقت المعالجة' : 'Avg. Processing Time', value: '5.2 ' + (locale === 'ar' ? 'أيام' : 'days'), change: -8.5, target: locale === 'ar' ? '5 أيام' : '5 days' },
    { label: locale === 'ar' ? 'معدل الموافقة' : 'Approval Rate', value: '78%', change: 3.2, target: '80%' },
    { label: locale === 'ar' ? 'معدل الرفض' : 'Rejection Rate', value: '12%', change: -2.1, target: locale === 'ar' ? 'أقل من 15%' : '<15%' },
    { label: locale === 'ar' ? 'رضا العملاء' : 'Customer Satisfaction', value: '4.2/5', change: 5.8, target: '4.5/5' },
  ];

  const employeePerformance: EmployeePerformance[] = [
    { id: '1', name: 'أحمد محمد', role: locale === 'ar' ? 'موظف استقبال' : 'Receptionist', applicationsProcessed: 156, approvalRate: 82, avgProcessingTime: 4.5, rating: 4.5 },
    { id: '2', name: 'سعيد خالد', role: locale === 'ar' ? 'موظف استقبال' : 'Receptionist', applicationsProcessed: 142, approvalRate: 78, avgProcessingTime: 5.2, rating: 4.2 },
    { id: '3', name: 'عبدالله عمر', role: locale === 'ar' ? 'مدير' : 'Manager', applicationsProcessed: 98, approvalRate: 85, avgProcessingTime: 3.8, rating: 4.8 },
    { id: '4', name: 'فاطمة علي', role: locale === 'ar' ? 'موظف استقبال' : 'Receptionist', applicationsProcessed: 134, approvalRate: 75, avgProcessingTime: 5.8, rating: 4.0 },
    { id: '5', name: 'خالد إبراهيم', role: locale === 'ar' ? 'موظف استقبال' : 'Receptionist', applicationsProcessed: 128, approvalRate: 80, avgProcessingTime: 4.9, rating: 4.3 },
  ];

  const centerPerformance: CenterPerformance[] = [
    { center: locale === 'ar' ? 'الرياض' : 'Riyadh', applications: 2450, passRate: 82, avgTime: 4.8 },
    { center: locale === 'ar' ? 'جدة' : 'Jeddah', applications: 1890, passRate: 78, avgTime: 5.2 },
    { center: locale === 'ar' ? 'الدمام' : 'Dammam', applications: 1450, passRate: 85, avgTime: 4.5 },
    { center: locale === 'ar' ? 'الظهران' : 'Dhahran', applications: 980, passRate: 80, avgTime: 5.0 },
  ];

  const trendData = [
    { month: locale === 'ar' ? 'يناير' : 'Jan', processingTime: 6.2, approvalRate: 72 },
    { month: locale === 'ar' ? 'فبراير' : 'Feb', processingTime: 5.8, approvalRate: 74 },
    { month: locale === 'ar' ? 'مارس' : 'Mar', processingTime: 5.5, approvalRate: 76 },
    { month: locale === 'ar' ? 'ابريل' : 'Apr', processingTime: 5.2, approvalRate: 78 },
  ];

  const radarData = [
    { subject: locale === 'ar' ? 'السرعة' : 'Speed', A: 85, fullMark: 100 },
    { subject: locale === 'ar' ? 'الدقة' : 'Accuracy', A: 92, fullMark: 100 },
    { subject: locale === 'ar' ? 'الالتزام' : 'Compliance', A: 88, fullMark: 100 },
    { subject: locale === 'ar' ? 'الخدمة' : 'Service', A: 78, fullMark: 100 },
    { subject: locale === 'ar' ? 'التوثيق' : 'Documentation', A: 95, fullMark: 100 },
  ];

  const KPICard = ({ kpi, index }: { kpi: KPI; index: number }) => (
    <Card className="border-0 shadow-sm">
      <CardContent className="p-5">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-sm text-neutral-500 font-medium">{kpi.label}</p>
            <Badge variant={index === 1 ? 'default' : index === 2 ? 'destructive' : 'secondary'} className="text-xs">
              {locale === 'ar' ? 'هدف' : 'Target'}: {kpi.target}
            </Badge>
          </div>
          <p className="text-3xl font-bold text-neutral-900">{kpi.value}</p>
          <div className="flex items-center gap-2">
            <div className={`flex items-center gap-1 px-2 py-1 rounded-full ${
              (kpi.change > 0 && index !== 2) || (kpi.change < 0 && index === 0) 
                ? 'bg-green-50 text-green-600' 
                : 'bg-red-50 text-red-600'
            }`}>
              <TrendingUp className={`w-3 h-3 ${kpi.change < 0 && index === 0 ? '' : kpi.change > 0 ? '' : 'rotate-180'}`} />
              <span className="text-sm font-medium">{Math.abs(kpi.change)}%</span>
            </div>
            <span className="text-xs text-neutral-400">{locale === 'ar' ? 'من last month' : 'vs last month'}</span>
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
          <h1 className="text-3xl font-bold text-neutral-900">{t('performance.title')}</h1>
          <p className="text-neutral-500 mt-1">{t('performance.subtitle')}</p>
        </div>
        <Button className="gap-2 bg-primary-500 hover:bg-primary-600">
          <Download className="w-4 h-4" />
          {t('export.csv')}
        </Button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi, index) => (
          <KPICard key={index} kpi={kpi} index={index} />
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Trend Analysis */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Activity className="w-5 h-5 text-primary-500" />
              {locale === 'ar' ? 'تحليل الاتجاهات' : 'Trend Analysis'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} axisLine={{ stroke: '#E5E7EB' }} />
                  <YAxis yAxisId="left" tick={{ fontSize: 12 }} axisLine={{ stroke: '#E5E7EB' }} />
                  <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 12 }} axisLine={{ stroke: '#E5E7EB' }} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                  />
                  <Legend />
                  <Line yAxisId="left" type="monotone" dataKey="processingTime" name={locale === 'ar' ? 'وقت المعالجة' : 'Processing Time'} stroke="#3B82F6" strokeWidth={2} />
                  <Line yAxisId="right" type="monotone" dataKey="approvalRate" name={locale === 'ar' ? 'معدل الموافقة' : 'Approval Rate'} stroke="#10B981" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Overall Performance Radar */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Target className="w-5 h-5 text-primary-500" />
              {locale === 'ar' ? 'الأداء العام' : 'Overall Performance'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radarData}>
                  <PolarGrid stroke="#E5E7EB" />
                  <PolarAngleAxis dataKey="subject" tick={{ fontSize: 12 }} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 10 }} />
                  <Radar name={locale === 'ar' ? 'الأداء' : 'Performance'} dataKey="A" stroke="#006C35" fill="#006C35" fillOpacity={0.3} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* By Employee */}
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Users className="w-5 h-5 text-primary-500" />
            {locale === 'ar' ? 'الأداء حسب الموظف' : 'Performance by Employee'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-neutral-50 border-b border-neutral-100">
                <tr>
                  <th className="text-start px-4 py-3 text-sm font-medium text-neutral-500">{locale === 'ar' ? 'الموظف' : 'Employee'}</th>
                  <th className="text-start px-4 py-3 text-sm font-medium text-neutral-500">{locale === 'ar' ? 'الدور' : 'Role'}</th>
                  <th className="text-start px-4 py-3 text-sm font-medium text-neutral-500">{locale === 'ar' ? 'المعالجة' : 'Processed'}</th>
                  <th className="text-start px-4 py-3 text-sm font-medium text-neutral-500">{t('performance.approvalRate')}</th>
                  <th className="text-start px-4 py-3 text-sm font-medium text-neutral-500">{t('performance.processingTime')}</th>
                  <th className="text-start px-4 py-3 text-sm font-medium text-neutral-500">{locale === 'ar' ? 'التقييم' : 'Rating'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {employeePerformance.map((emp) => (
                  <tr key={emp.id} className="hover:bg-neutral-50">
                    <td className="px-4 py-3 text-neutral-900 font-medium">{emp.name}</td>
                    <td className="px-4 py-3 text-neutral-600 text-sm">{emp.role}</td>
                    <td className="px-4 py-3 text-neutral-600">{emp.applicationsProcessed}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-neutral-100 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full ${emp.approvalRate >= 80 ? 'bg-green-500' : emp.approvalRate >= 70 ? 'bg-amber-500' : 'bg-red-500'}`}
                            style={{ width: `${emp.approvalRate}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium">{emp.approvalRate}%</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-neutral-600">{emp.avgProcessingTime} {locale === 'ar' ? 'أيام' : 'days'}</td>
                    <td className="px-4 py-3">
                      <Badge variant="outline" className="border-primary-200 text-primary-700">
                        {emp.rating}/5
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* By Center */}
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Building2 className="w-5 h-5 text-primary-500" />
            {locale === 'ar' ? 'الأداء حسب المركز' : 'Performance by Center'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={centerPerformance}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="center" tick={{ fontSize: 12 }} axisLine={{ stroke: '#E5E7EB' }} />
                <YAxis yAxisId="left" tick={{ fontSize: 12 }} axisLine={{ stroke: '#E5E7EB' }} />
                <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 12 }} axisLine={{ stroke: '#E5E7EB' }} />
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                />
                <Legend />
                <Bar yAxisId="left" dataKey="applications" name={locale === 'ar' ? 'الطلبات' : 'Applications'} fill="#3B82F6" radius={[4, 4, 0, 0]} />
                <Bar yAxisId="right" dataKey="passRate" name={locale === 'ar' ? 'نسبة النجاح' : 'Pass Rate'} fill="#10B981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}