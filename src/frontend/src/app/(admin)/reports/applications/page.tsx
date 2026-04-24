'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  FileText,
  Download,
  Filter,
  Calendar,
  Search,
  BarChart3,
  PieChart,
  TrendingUp,
  Clock,
  XCircle,
  CheckCircle,
  FileSpreadsheet,
  FileDown
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
  PieChart as RechartsPieChart,
  Pie,
  Cell
} from 'recharts';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { reportsService, ReportingFilter, StatusDistributionDto, ServiceStatsDto, DelayedApplicationEntry } from '@/services/reports.service';
import { useQuery } from '@tanstack/react-query';

interface ApplicationData {
  id: string;
  number: string;
  applicant: string;
  category: string;
  status: string;
  stage: string;
  submittedDate: string;
  completedDate: string | null;
  rejectionReason?: string;
}

interface FilterState {
  fromDate: string;
  toDate: string;
  status: string;
  category: string;
  serviceType: string;
}

const CATEGORY_COLORS = ['#1a3a8f', '#2563eb', '#3b82f6', '#60a5fa', '#93c5fd', '#dbeafe'];

export default function ApplicationsReportPage() {
  const [filters, setFilters] = useState<FilterState>({
    fromDate: '',
    toDate: '',
    status: 'all',
    category: 'all',
    serviceType: 'all'
  });

  const [searchQuery, setSearchQuery] = useState('');

  // Prepare filter for API
  const apiFilter: ReportingFilter = {
    ...(filters.fromDate && { startDate: filters.fromDate }),
    ...(filters.toDate && { endDate: filters.toDate }),
  };

  // Fetch real data from API
  const { data: statusDataResponse, isLoading: statusLoading } = useQuery({
    queryKey: ['reportStatusDistribution', apiFilter],
    queryFn: () => reportsService.getStatusDistribution(apiFilter),
    enabled: true,
  });

  const { data: serviceDataResponse, isLoading: serviceLoading } = useQuery({
    queryKey: ['reportServiceDistribution', apiFilter],
    queryFn: () => reportsService.getServiceDistribution(apiFilter),
    enabled: true,
  });

  const { data: delayedDataResponse, isLoading: delayedLoading } = useQuery({
    queryKey: ['reportDelayedApplications', apiFilter],
    queryFn: () => reportsService.getDelayedApplications(apiFilter, 1, 5),
    enabled: true,
  });

  const statusData = (statusDataResponse?.data || []).map((item: StatusDistributionDto) => ({
    name: item.status,
    value: item.count,
    color: item.color,
  }));

  const categoryData = (serviceDataResponse?.data || []).map((item: ServiceStatsDto) => ({
    name: item.serviceType,
    value: item.count,
  }));

  const applicationsData = (delayedDataResponse?.data?.items || []).map((item: DelayedApplicationEntry, idx: number) => ({
    id: item.applicationId,
    number: item.applicationNumber,
    applicant: item.applicantName,
    category: item.currentStatus,
    status: item.currentStatus,
    stage: item.currentStatus,
    submittedDate: '',
    completedDate: null,
  }));

  // Mock static data for charts
  const trendData = [
    { month: 'يناير', applications: 45, completed: 38 },
    { month: 'فبراير', applications: 52, completed: 45 },
    { month: 'مارس', applications: 48, completed: 42 },
    { month: 'أبريل', applications: 61, completed: 55 },
  ];

  const completionTimeData = [
    { stage: 'الفحص الطبي', days: 3 },
    { stage: 'الاختبار النظري', days: 5 },
    { stage: 'الاختبار العملي', days: 7 },
    { stage: 'إصدار الرخصة', days: 2 },
  ];

  const rejectionReasons = [
    { reason: 'الرسوب في الاختبارات', count: 12 },
    { reason: 'عدم اللياقة الطبية', count: 5 },
    { reason: 'نقص الوثائق المطلوبة', count: 4 },
    { reason: 'مخالفة شروط السن', count: 2 },
  ];

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { variant: any; label: string; className: string }> = {
      Completed: { variant: 'default', label: 'مكتمل', className: 'bg-emerald-500 hover:bg-emerald-600' },
      InReview: { variant: 'secondary', label: 'قيد المراجعة', className: 'bg-amber-500 hover:bg-amber-600 text-white' },
      Submitted: { variant: 'outline', label: 'قيد التدقيق', className: 'border-blue-200 text-blue-700 bg-blue-50' },
      Rejected: { variant: 'destructive', label: 'مرفوض', className: 'bg-red-500 hover:bg-red-600' },
      Draft: { variant: 'outline', label: 'مسودة', className: 'border-neutral-200 text-neutral-500' },
    };
    const config = statusMap[status] || { variant: 'outline', label: status, className: '' };
    return <Badge variant={config.variant as any} className={cn("px-4 py-1 rounded-xl font-black", config.className)}>{config.label}</Badge>;
  };

  return (
    <div className="max-w-7xl mx-auto py-10 px-4 space-y-10 font-arabic" dir="rtl">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 border-b border-neutral-100 pb-10">
        <div className="space-y-2">
          <h1 className="text-2xl md:text-3xl font-black text-neutral-900 tracking-tight">تقارير وإحصائيات الطلبات</h1>
          <p className="text-lg text-neutral-400 font-bold">تحليل شامل لحركة إصدار التراخيص ومراحل معالجة الطلبات</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button variant="outline" className="h-12 px-6 rounded-2xl gap-3 border-2 hover:bg-neutral-50 font-black transition-all">
            <FileDown className="w-5 h-5 text-blue-500" />
            تصدير CSV
          </Button>
          <Button variant="outline" className="h-12 px-6 rounded-2xl gap-3 border-2 hover:bg-neutral-50 font-black transition-all">
            <FileSpreadsheet className="w-5 h-5 text-emerald-500" />
            تصدير Excel
          </Button>
          <Button className="h-12 px-6 rounded-2xl gap-3 bg-[#1a3a8f] hover:bg-black font-black transition-all shadow-xl shadow-blue-900/20">
            <Download className="w-5 h-5" />
            تصدير PDF
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card className="border-none shadow-2xl rounded-[2.5rem] bg-white p-2">
        <CardContent className="p-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="space-y-3">
              <label className="text-sm font-black text-neutral-500 ms-2">من تاريخ</label>
              <div className="relative">
                <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-300" />
                <Input
                  type="date"
                  className="h-14 pe-12 rounded-2xl border-2 border-neutral-50 bg-neutral-50/50 focus:bg-white focus:ring-4 focus:ring-blue-50 transition-all font-bold"
                  value={filters.fromDate}
                  onChange={(e) => setFilters({ ...filters, fromDate: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-3">
              <label className="text-sm font-black text-neutral-500 ms-2">إلى تاريخ</label>
              <div className="relative">
                <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-300" />
                <Input
                  type="date"
                  className="h-14 pe-12 rounded-2xl border-2 border-neutral-50 bg-neutral-50/50 focus:bg-white focus:ring-4 focus:ring-blue-50 transition-all font-bold"
                  value={filters.toDate}
                  onChange={(e) => setFilters({ ...filters, toDate: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-3">
              <label className="text-sm font-black text-neutral-500 ms-2">حالة الطلب</label>
              <Select value={filters.status} onValueChange={(v) => setFilters({ ...filters, status: v })}>
                <SelectTrigger className="h-14 rounded-2xl border-2 border-neutral-50 bg-neutral-50/50 focus:bg-white focus:ring-4 focus:ring-blue-50 transition-all font-bold px-6">
                  <SelectValue placeholder="اختر الحالة" />
                </SelectTrigger>
                <SelectContent className="rounded-2xl border-none shadow-2xl">
                  <SelectItem value="all" className="font-bold">جميع الحالات</SelectItem>
                  <SelectItem value="Submitted" className="font-bold text-blue-600">قيد التدقيق</SelectItem>
                  <SelectItem value="InReview" className="font-bold text-amber-600">قيد المراجعة</SelectItem>
                  <SelectItem value="Completed" className="font-bold text-emerald-600">مكتمل</SelectItem>
                  <SelectItem value="Rejected" className="font-bold text-red-600">مرفوض</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-3">
              <label className="text-sm font-black text-neutral-500 ms-2">فئة الرخصة</label>
              <Select value={filters.category} onValueChange={(v) => setFilters({ ...filters, category: v })}>
                <SelectTrigger className="h-14 rounded-2xl border-2 border-neutral-50 bg-neutral-50/50 focus:bg-white focus:ring-4 focus:ring-blue-50 transition-all font-bold px-6">
                  <SelectValue placeholder="اختر الفئة" />
                </SelectTrigger>
                <SelectContent className="rounded-2xl border-none shadow-2xl">
                  <SelectItem value="all" className="font-bold">جميع الفئات</SelectItem>
                  <SelectItem value="A" className="font-bold">دراجة نارية</SelectItem>
                  <SelectItem value="B" className="font-bold">خصوصي</SelectItem>
                  <SelectItem value="C" className="font-bold">نقل خفيف</SelectItem>
                  <SelectItem value="D" className="font-bold">نقل ثقيل</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="mt-8 flex flex-col md:flex-row gap-4">
            <div className="relative flex-1 group">
              <Search className="absolute right-5 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-300 group-focus-within:text-[#1a3a8f] transition-colors" />
              <Input
                placeholder="ابحث برقم الطلب، اسم المتقدم، أو رقم الهوية..."
                className="h-16 pe-14 rounded-[2rem] border-2 border-neutral-50 bg-neutral-50/50 focus:bg-white focus:ring-4 focus:ring-blue-50 transition-all font-bold text-lg"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button className="h-10 md:h-12 px-6 md:px-8 rounded-md bg-neutral-900 hover:bg-black text-sm md:text-base font-black gap-2 md:gap-3 transition-all">
              <Filter className="w-4 h-4 md:w-5 md:h-5" />
              تطبيق التصفية
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {[
          { icon: PieChart, title: 'توزيع الحالات', data: statusData, type: 'pie', color: 'text-blue-500' },
          { icon: BarChart3, title: 'الطلبات حسب الفئة', data: categoryData, type: 'bar', color: 'text-amber-500' },
          { icon: TrendingUp, title: 'نمو الطلبات', data: trendData, type: 'line', color: 'text-emerald-500' },
          { icon: Clock, title: 'متوسط الإنجاز (أيام)', data: completionTimeData, type: 'stage', color: 'text-purple-500' },
        ].map((item, idx) => (
          <Card key={idx} className="border-none shadow-xl rounded-[2.5rem] bg-white overflow-hidden group hover:shadow-2xl transition-all">
            <CardHeader className="pb-2 p-8 uppercase tracking-widest">
              <CardTitle className="text-xs font-black text-neutral-400 flex items-center gap-3">
                <item.icon className={cn("w-5 h-5", item.color)} />
                {item.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8 pt-0">
              <div className="h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  {item.type === 'pie' ? (
                    <RechartsPieChart>
                      <Pie data={statusData} cx="50%" cy="50%" innerRadius={45} outerRadius={70} paddingAngle={2} dataKey="value">
                        {statusData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                      </Pie>
                      <Tooltip />
                    </RechartsPieChart>
                  ) : item.type === 'bar' ? (
                    <BarChart data={categoryData} layout="vertical">
                      <XAxis type="number" hide />
                      <YAxis type="category" dataKey="name" width={70} tick={{ fontSize: 10, fontWeight: 'bold' }} />
                      <Tooltip />
                      <Bar dataKey="value" fill="#1a3a8f" radius={[0, 10, 10, 0]} />
                    </BarChart>
                  ) : item.type === 'line' ? (
                    <LineChart data={trendData}>
                      <XAxis dataKey="month" tick={{ fontSize: 10, fontWeight: 'bold' }} axisLine={false} tickLine={false} />
                      <Tooltip />
                      <Line type="monotone" dataKey="applications" stroke="#3B82F6" strokeWidth={4} dot={{ r: 4, fill: '#3B82F6' }} />
                    </LineChart>
                  ) : (
                    <BarChart data={completionTimeData}>
                      <XAxis dataKey="stage" tick={{ fontSize: 9, fontWeight: 'bold' }} axisLine={false} tickLine={false} />
                      <Tooltip />
                      <Bar dataKey="days" fill="#F59E0B" radius={[10, 10, 0, 0]} />
                    </BarChart>
                  )}
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Rejection Reasons */}
      <Card className="border-none shadow-2xl rounded-[2.5rem] bg-white overflow-hidden">
        <CardHeader className="p-10 border-b border-neutral-50">
          <CardTitle className="text-2xl font-black flex items-center gap-4 text-neutral-800">
            <XCircle className="w-8 h-8 text-red-500" />
            تحليل أسباب الرفض
          </CardTitle>
        </CardHeader>
        <CardContent className="p-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {rejectionReasons.map((item, index) => (
              <div key={index} className="p-8 bg-neutral-50/50 rounded-[2rem] border-2 border-neutral-50 text-center hover:bg-red-50 hover:border-red-100 transition-all cursor-default">
                <p className="text-4xl font-black text-neutral-900 mb-2">{item.count}</p>
                <p className="text-sm font-black text-neutral-400">{item.reason}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card className="border-none shadow-2xl rounded-[2.5rem] bg-white overflow-hidden">
        <CardHeader className="p-10 border-b border-neutral-50 flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-2xl font-black flex items-center gap-4 text-neutral-800">
              <FileText className="w-8 h-8 text-[#1a3a8f]" />
              سجل الطلبات التفصيلي
            </CardTitle>
          </div>
          <Badge className="bg-blue-50 text-[#1a3a8f] hover:bg-blue-100 border-none px-6 py-2 rounded-full font-black">
            إجمالي السجلات: {applicationsData.length}
          </Badge>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-right">
              <thead className="bg-neutral-50/50 border-b border-neutral-100">
                <tr>
                  <th className="px-8 py-6 text-sm font-black text-neutral-400 uppercase tracking-widest">رقم الطلب</th>
                  <th className="px-8 py-6 text-sm font-black text-neutral-400 uppercase tracking-widest">اسم المتقدم</th>
                  <th className="px-8 py-6 text-sm font-black text-neutral-400 uppercase tracking-widest">الفئة</th>
                  <th className="px-8 py-6 text-sm font-black text-neutral-400 uppercase tracking-widest">الحالة</th>
                  <th className="px-8 py-6 text-sm font-black text-neutral-400 uppercase tracking-widest">المرحلة الحالية</th>
                  <th className="px-8 py-6 text-sm font-black text-neutral-400 uppercase tracking-widest">تاريخ التقديم</th>
                  <th className="px-8 py-6 text-sm font-black text-neutral-400 uppercase tracking-widest text-left">الإجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-50">
                {applicationsData.map((app) => (
                  <tr key={app.id} className="hover:bg-neutral-50/50 transition-colors group">
                    <td className="px-8 py-6 text-neutral-900 font-black">{app.number}</td>
                    <td className="px-8 py-6 text-neutral-700 font-bold">{app.applicant}</td>
                    <td className="px-8 py-6">
                      <Badge variant="outline" className="border-blue-100 text-blue-600 bg-blue-50 px-4 py-1 rounded-lg font-bold">
                        {app.category}
                      </Badge>
                    </td>
                    <td className="px-8 py-6">{getStatusBadge(app.status)}</td>
                    <td className="px-8 py-6 text-neutral-500 font-bold text-sm">{app.stage}</td>
                    <td className="px-8 py-6 text-neutral-500 font-bold text-sm">{app.submittedDate}</td>
                    <td className="px-8 py-6 text-left">
                       <Button variant="ghost" size="sm" className="rounded-xl font-bold text-[#1a3a8f] opacity-0 group-hover:opacity-100 transition-opacity">
                         تفاصيل
                       </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}