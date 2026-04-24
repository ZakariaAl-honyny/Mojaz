'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
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
  Percent,
  Award,
  Zap,
  ShieldCheck,
  Star
} from "lucide-react";
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
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { reportsService, ReportingFilter } from '@/services/reports.service';
import { dashboardService } from '@/services/dashboard.service';
import { useQuery } from '@tanstack/react-query';

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
  const apiFilter: ReportingFilter = {};

  // Fetch real data from API
  const { data: summaryData, isLoading: summaryLoading } = useQuery({
    queryKey: ['reportSummary'],
    queryFn: () => reportsService.getSummary(apiFilter),
    enabled: true,
  });

  const { data: branchData, isLoading: branchLoading } = useQuery({
    queryKey: ['reportBranchThroughput'],
    queryFn: () => reportsService.getBranchThroughput(apiFilter),
    enabled: true,
  });

  // Transform API data
  const kpis = [
    { label: 'متوسط وقت المعالجة', value: summaryData?.data?.avgProcessingDays || '4.2 يوم', change: -8.5, target: '5 أيام' },
    { label: 'نسبة النجاح العامة', value: '78%', change: 3.2, target: '80%' },
    { label: 'متوسط الأداء اليومي', value: `${summaryData?.data?.totalApplications || 124} طلب`, change: 12.1, target: '100 طلب' },
    { label: 'رضا المراجعين', value: '4.8/5', change: 5.8, target: '4.5/5' },
  ];

  const trendData = [
    { month: 'يناير', processingTime: 6.2, approvalRate: 72 },
    { month: 'فبراير', processingTime: 5.8, approvalRate: 74 },
    { month: 'مارس', processingTime: 5.5, approvalRate: 76 },
    { month: 'أبريل', processingTime: 5.2, approvalRate: 78 },
  ];

  const centerPerformance = (branchData?.data || []).map((item: any) => ({
    center: item.branch || item.name,
    applications: item.totalProcessed || item.count || 0,
    passRate: item.passRate || 75,
    avgTime: item.avgDays || 5,
  }));

  // Mock static data for employee and radar (would require additional API endpoints)
  const employeePerformance = [
    { id: '1', name: 'أحمد فؤاد السلمي', role: 'ضابط فحص', applicationsProcessed: 156, approvalRate: 82, avgProcessingTime: 4.5, rating: 4.8 },
    { id: '2', name: 'محمد علي منصور', role: 'موظف استقبال', applicationsProcessed: 142, approvalRate: 78, avgProcessingTime: 5.2, rating: 4.2 },
    { id: '3', name: 'ياسين محمود عمر', role: 'ضابط مراجعة', applicationsProcessed: 188, approvalRate: 85, avgProcessingTime: 3.8, rating: 4.9 },
    { id: '4', name: 'سناء يحيى الحيمي', role: 'محاسب', applicationsProcessed: 134, approvalRate: 98, avgProcessingTime: 2.1, rating: 4.7 },
  ];

  const radarData = [
    { subject: 'السرعة', A: 85, fullMark: 100 },
    { subject: 'الدقة', A: 92, fullMark: 100 },
    { subject: 'الالتزام', A: 88, fullMark: 100 },
    { subject: 'الجودة', A: 78, fullMark: 100 },
    { subject: 'الإنتاجية', A: 95, fullMark: 100 },
  ];

  const KPICard = ({ kpi, index }: { kpi: KPI; index: number }) => (
    <Card className="border-none shadow-xl rounded-[2.5rem] bg-white group hover:scale-[1.02] transition-all overflow-hidden relative">
      <div className="absolute top-0 right-0 w-32 h-32 bg-[#1a3a8f]/5 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700"></div>
      <CardContent className="p-8">
        <div className="space-y-4 relative z-10">
          <div className="flex items-center justify-between">
            <p className="text-xs font-black text-neutral-400 uppercase tracking-widest">{kpi.label}</p>
            <Badge className="bg-blue-50 text-[#1a3a8f] border-none font-black text-[10px] px-3 py-1 rounded-lg">
              الهدف: {kpi.target}
            </Badge>
          </div>
          <p className="text-4xl font-black text-neutral-900 leading-none">{kpi.value}</p>
          <div className="flex items-center gap-2">
            <div className={cn(
              "flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-black",
              (kpi.change > 0 && index !== 0) || (kpi.change < 0 && index === 0) 
              ? 'bg-emerald-50 text-emerald-600' 
              : 'bg-red-50 text-red-600'
            )}>
              <TrendingUp className={cn("w-3 h-3", kpi.change < 0 && index === 0 ? "" : kpi.change > 0 ? "" : "rotate-180")} />
              <span>{Math.abs(kpi.change)}%</span>
            </div>
            <span className="text-[10px] text-neutral-400 font-bold italic">مقارنة بالشهر السابق</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="max-w-7xl mx-auto py-10 px-4 space-y-10 font-arabic" dir="rtl">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 border-b border-neutral-100 pb-10">
        <div className="space-y-2">
          <div className="flex items-center gap-4">
             <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-[#1a3a8f] shadow-sm">
               <Target className="w-6 h-6" />
             </div>
             <div>
               <h1 className="text-4xl font-black text-neutral-900 tracking-tight">مؤشرات الأداء والكفاءة</h1>
               <p className="text-lg text-neutral-400 font-bold">تحليل إنتاجية الفروع وجودة المخرجات التشغيلية</p>
             </div>
          </div>
        </div>
        <Button className="h-10 md:h-12 px-6 md:px-8 rounded-md bg-[#1a3a8f] hover:bg-black font-black text-sm md:text-base gap-2 md:gap-3 transition-all">
          <Download className="w-4 h-4 md:w-5 md:h-5" />
          تصدير تقرير الأداء
        </Button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {kpis.map((kpi, index) => (
          <KPICard key={index} kpi={kpi} index={index} />
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Trend Analysis */}
        <Card className="border-none shadow-2xl rounded-[2.5rem] bg-white overflow-hidden">
          <CardHeader className="p-10 pb-0 border-b border-neutral-50 bg-white">
            <CardTitle className="text-2xl font-black flex items-center gap-4 text-neutral-800">
              <Activity className="w-8 h-8 text-[#1a3a8f]" />
              تحليل الكفاءة الزمنية
            </CardTitle>
          </CardHeader>
          <CardContent className="p-10">
            <div className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f1f1" vertical={false} />
                  <XAxis dataKey="month" tick={{ fontSize: 12, fontWeight: 'bold' }} axisLine={false} tickLine={false} />
                  <YAxis yAxisId="left" tick={{ fontSize: 12, fontWeight: 'bold' }} axisLine={false} tickLine={false} />
                  <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 12, fontWeight: 'bold' }} axisLine={false} tickLine={false} />
                  <Tooltip
                    contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 20px 40px rgba(0,0,0,0.1)', padding: '20px' }}
                    labelStyle={{ fontWeight: '900', color: '#1a3a8f' }}
                  />
                  <Legend iconType="circle" />
                  <Line yAxisId="left" type="monotone" dataKey="processingTime" name="وقت المعالجة" stroke="#1a3a8f" strokeWidth={4} dot={{ r: 6, fill: '#1a3a8f' }} />
                  <Line yAxisId="right" type="monotone" dataKey="approvalRate" name="معدل الموافقة" stroke="#10B981" strokeWidth={4} dot={{ r: 6, fill: '#10B981' }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Overall Performance Radar */}
        <Card className="border-none shadow-2xl rounded-[2.5rem] bg-white overflow-hidden">
          <CardHeader className="p-10 pb-0 border-b border-neutral-50 bg-white">
            <CardTitle className="text-2xl font-black flex items-center gap-4 text-neutral-800">
              <Zap className="w-8 h-8 text-amber-500" />
              توازن المكونات التشغيلية
            </CardTitle>
          </CardHeader>
          <CardContent className="p-10">
            <div className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radarData}>
                  <PolarGrid stroke="#f1f1f1" />
                  <PolarAngleAxis dataKey="subject" tick={{ fontSize: 12, fontWeight: 'bold' }} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 10, fontWeight: 'bold' }} />
                  <Radar name="الأداء الفعلي" dataKey="A" stroke="#1a3a8f" strokeWidth={3} fill="#1a3a8f" fillOpacity={0.2} />
                  <Tooltip contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* By Employee */}
      <Card className="border-none shadow-2xl rounded-[2.5rem] bg-white overflow-hidden">
        <CardHeader className="p-10 border-b border-neutral-50 flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-2xl font-black flex items-center gap-4 text-neutral-800">
              <Users className="w-8 h-8 text-[#1a3a8f]" />
              أداء الكادر البشري
            </CardTitle>
            <CardDescription className="font-bold text-neutral-400 mt-1">تتبع جودة المعاملات وسرعة الإنجاز لكل موظف</CardDescription>
          </div>
          <Badge className="bg-emerald-50 text-emerald-600 px-6 py-2 rounded-full font-black text-sm">أعلى كفاءة (+12%)</Badge>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-right">
              <thead className="bg-neutral-50/50 border-b border-neutral-100">
                <tr>
                  <th className="px-8 py-6 text-sm font-black text-neutral-400 uppercase tracking-widest">الموظف</th>
                  <th className="px-8 py-6 text-sm font-black text-neutral-400 uppercase tracking-widest">المسمى الوظيفي</th>
                  <th className="px-8 py-6 text-sm font-black text-neutral-400 uppercase tracking-widest text-center">الإنتاجية</th>
                  <th className="px-8 py-6 text-sm font-black text-neutral-400 uppercase tracking-widest">الجودة (الموافقة)</th>
                  <th className="px-8 py-6 text-sm font-black text-neutral-400 uppercase tracking-widest">متوسط الوقت</th>
                  <th className="px-8 py-6 text-sm font-black text-neutral-400 uppercase tracking-widest">التقييم</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-50">
                {employeePerformance.map((emp) => (
                  <tr key={emp.id} className="hover:bg-neutral-50/50 transition-colors group">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-neutral-100 rounded-xl flex items-center justify-center text-[#1a3a8f] font-black">{emp.name.charAt(0)}</div>
                        <span className="text-neutral-900 font-black">{emp.name}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-neutral-500 font-bold text-sm">{emp.role}</td>
                    <td className="px-8 py-6 text-center">
                       <span className="bg-blue-50 text-[#1a3a8f] px-3 py-1 rounded-lg font-black">{emp.applicationsProcessed} طلب</span>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-24 bg-neutral-100 rounded-full h-2.5 overflow-hidden border border-neutral-200">
                          <div
                            className={cn("h-full transition-all", emp.approvalRate >= 80 ? 'bg-emerald-500' : 'bg-amber-500')}
                            style={{ width: `${emp.approvalRate}%` }}
                          />
                        </div>
                        <span className="text-sm font-black text-neutral-700">{emp.approvalRate}%</span>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-neutral-500 font-bold">{emp.avgProcessingTime} يوم</td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-1.5 text-amber-500 bg-amber-50/50 w-fit px-4 py-1.5 rounded-full border border-amber-100">
                        <Star className="w-4 h-4 fill-current" />
                        <span className="font-black">{emp.rating}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* By Center */}
      <Card className="border-none shadow-2xl rounded-[2.5rem] bg-white overflow-hidden">
        <CardHeader className="p-10 border-b border-neutral-50">
          <CardTitle className="text-2xl font-black flex items-center gap-4 text-neutral-800">
            <Building2 className="w-8 h-8 text-[#1a3a8f]" />
            مقارنة الفروع التشغيلية
          </CardTitle>
          <CardDescription className="font-bold text-neutral-400 mt-1">توزيع حمل العمل وكفاءة الفروع على مستوى المحافظات</CardDescription>
        </CardHeader>
        <CardContent className="p-10">
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={centerPerformance}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f1f1" vertical={false} />
                <XAxis dataKey="center" tick={{ fontSize: 12, fontWeight: 'bold' }} axisLine={false} tickLine={false} />
                <YAxis yAxisId="left" tick={{ fontSize: 12, fontWeight: 'bold' }} axisLine={false} tickLine={false} />
                <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11, fontWeight: 'black' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }} />
                <Legend iconType="circle" />
                <Bar yAxisId="left" dataKey="applications" name="إجمالي الطلبات" fill="#1a3a8f" radius={[15, 15, 0, 0]} />
                <Bar yAxisId="right" dataKey="passRate" name="معدل النجاح (%)" fill="#10B981" radius={[15, 15, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}