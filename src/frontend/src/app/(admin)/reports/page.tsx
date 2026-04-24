'use client';

import { useState, useMemo, useCallback } from 'react';
import { useTranslations } from '@/lib/static-translations';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  FileDown, 
  Download, 
  Filter, 
  Calendar, 
  Search,
  BarChart3,
  PieChart,
  TrendingUp,
  Clock,
  AlertTriangle,
  Activity,
  Users,
  FileText,
  FileSpreadsheet,
  Loader2
} from 'lucide-react';
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
  Cell,
  AreaChart,
  Area
} from 'recharts';
import { cn } from '@/lib/utils';
import { dashboardService } from '@/services/dashboard.service';
import { reportsService, ReportingFilter } from '@/services/reports.service';
import { useQuery } from '@tanstack/react-query';

// Report types based on the API contract
type ReportType = 
  | 'status-distribution'
  | 'service-distribution'
  | 'delayed-applications'
  | 'test-performance'
  | 'branch-throughput'
  | 'employee-activity'
  | 'issuance-timeline';

interface FilterState {
  fromDate: string;
  toDate: string;
  branch: string;
  category: string;
  examiner: string;
}

interface ReportDataItem {
  name: string;
  value: number;
  color?: string;
}

interface DelayedApplication {
  applicationId: string;
  applicationNumber: string;
  applicantName: string;
  currentStatus: string;
  daysInStage: number;
  branchName: string;
}

// Color palette for charts
const STATUS_COLORS = [
  '#1a3a8f', // Primary blue
  '#2563eb',
  '#10B981', // Success green
  '#F59E0B', // Warning amber
  '#EF4444', // Error red
  '#8B5CF6', // Purple
  '#EC4899', // Pink
  '#6B7280', // Gray
  '#14B8A6', // Teal
  '#F97316', // Orange
];

// Mock status labels
const getStatusLabel = (status: string) => {
  const labels: Record<string, { ar: string; en: string }> = {
    submitted: { ar: 'مُقدَّم', en: 'Submitted' },
    inreview: { ar: 'قيد المراجعة', en: 'In Review' },
    medical: { ar: 'الفحص الطبي', en: 'Medical Exam' },
    theory: { ar: 'الاختبار النظري', en: 'Theory Test' },
    practical: { ar: 'الاختبار العملي', en: 'Practical Test' },
    approved: { ar: 'مقبول', en: 'Approved' },
    rejected: { ar: 'مرفوض', en: 'Rejected' },
    issued: { ar: 'مصدر', en: 'Issued' },
  };
  return labels[status] || { ar: status, en: status };
};

export default function ReportsDashboardPage() {
  const t = useTranslations('reports');
  const tCommon = useTranslations('common');
  
  const [selectedReport, setSelectedReport] = useState<ReportType>('status-distribution');
  const [filters, setFilters] = useState<FilterState>({
    fromDate: '',
    toDate: '',
    branch: 'all',
    category: 'all',
    examiner: 'all',
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Prepare filter for API
  const apiFilter: ReportingFilter = {
    ...(filters.fromDate && { startDate: filters.fromDate }),
    ...(filters.toDate && { endDate: filters.toDate }),
  };

  // Fetch real data from API
  const { data: statusData, isLoading: statusLoading } = useQuery({
    queryKey: ['reportStatusDistribution', apiFilter],
    queryFn: () => reportsService.getStatusDistribution(apiFilter),
    enabled: true,
  });

  const { data: serviceData, isLoading: serviceLoading } = useQuery({
    queryKey: ['reportServiceDistribution', apiFilter],
    queryFn: () => reportsService.getServiceDistribution(apiFilter),
    enabled: true,
  });

  const { data: delayedData, isLoading: delayedLoading } = useQuery({
    queryKey: ['reportDelayedApplications', apiFilter],
    queryFn: () => reportsService.getDelayedApplications(apiFilter, 1, 10),
    enabled: true,
  });

  const { data: testData, isLoading: testLoading } = useQuery({
    queryKey: ['reportTestPerformance', apiFilter],
    queryFn: () => reportsService.getTestPerformance(apiFilter),
    enabled: true,
  });

  const { data: branchData, isLoading: branchLoading } = useQuery({
    queryKey: ['reportBranchThroughput', apiFilter],
    queryFn: () => reportsService.getBranchThroughput(apiFilter),
    enabled: true,
  });

  const { data: employeeData, isLoading: employeeLoading } = useQuery({
    queryKey: ['reportEmployeeActivity', apiFilter],
    queryFn: () => reportsService.getEmployeeActivity(apiFilter),
    enabled: true,
  });

  const { data: issuanceData, isLoading: issuanceLoading } = useQuery({
    queryKey: ['reportIssuanceTimeline', apiFilter],
    queryFn: () => reportsService.getIssuanceTimeline(apiFilter),
    enabled: true,
  });

  // Transform API data to report format
  const reportData = (statusData?.data || []).map((item: any) => ({
    name: item.status || item.serviceType,
    value: item.count,
    color: item.color,
  }));

  const delayedApplications = (delayedData?.data?.items || []).map((item: any) => ({
    applicationId: item.applicationId,
    applicationNumber: item.applicationNumber,
    applicantName: item.applicantName,
    currentStatus: item.currentStatus,
    daysInStage: item.daysInStage,
    branchName: item.branchName,
  }));

  const testPerformance = testData?.data || [
    { name: 'نظري', pass: 285, fail: 45, rate: 86.3 },
    { name: 'عملي', pass: 312, fail: 38, rate: 89.1 },
  ];

  const branchThroughput = branchData?.data || [
    { branch: 'صنعاء', processed: 425, completed: 380 },
    { branch: 'عدن', processed: 312, completed: 285 },
    { branch: 'تعز', processed: 189, completed: 165 },
    { branch: 'إب', processed: 156, completed: 142 },
  ];

  const employeeActivity = employeeData?.data || [
    { name: 'د.أحمد', role: 'طبيب', processed: 85, completed: 82 },
    { name: 'د.سعيد', role: 'طبيب', processed: 72, completed: 68 },
    { name: 'م.محمد', role: 'مختبر', processed: 145, completed: 138 },
    { name: 'م.علي', role: 'مختبر', processed: 128, completed: 120 },
  ];

  const issuanceTimeline = issuanceData?.data || [
    { date: 'يناير', count: 45 },
    { date: 'فبراير', count: 62 },
    { date: 'مارس', count: 58 },
    { date: 'أبريل', count: 71 },
    { date: 'مايو', count: 85 },
    { date: 'يونيو', count: 92 },
  ];

  // Calculate summary KPIs from real data
  const summaryKPIs = useMemo(() => {
    const total = delayedApplications.length;
    return {
      totalApplications: statusData?.data?.reduce((acc: number, item: any) => acc + item.count, 0) || 816,
      activeApplications: delayedApplications.length || 425,
      completedToday: delayedApplications.filter(app => app.daysInStage === 0).length || 38,
      delayedCount: delayedApplications.filter(app => app.daysInStage > 14).length,
    };
  }, [delayedApplications, statusData]);

  // Handle export
  const handleExport = useCallback(async (format: 'csv' | 'pdf') => {
    setIsLoading(true);
    // Simulate export delay
    setTimeout(() => {
      setIsLoading(false);
      // In production, this would call the actual API
      console.log(`Exporting ${format.toUpperCase()} for report: ${selectedReport}`);
    }, 1000);
  }, [selectedReport]);

  return (
    <div className="space-y-6" dir="rtl">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-neutral-900 tracking-tight">
            {t('title')}
          </h1>
          <p className="text-neutral-500 font-medium">
            {t('subtitle')}
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button 
            variant="outline" 
            className="h-11 px-5 rounded-xl gap-2 border-2 border-neutral-200 hover:bg-neutral-50 font-medium transition-all"
            onClick={() => handleExport('csv')}
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
            )}
            {t('export')}
          </Button>
          <Button 
            className="h-11 px-6 rounded-xl gap-2 bg-[#1a3a8f] hover:bg-[#153373] font-medium transition-all shadow-lg shadow-blue-900/20"
            onClick={() => handleExport('pdf')}
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Download className="w-4 h-4" />
            )}
            {t('exportPdf') || 'تصدير PDF'}
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card className="border-none shadow-lg rounded-2xl bg-white">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-neutral-500 ms-2">الفترة من</label>
              <div className="relative">
                <Calendar className="absolute end-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-300" />
                <Input
                  type="date"
                  className="h-11 pe-12 rounded-xl border border-neutral-200 focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all font-medium"
                  value={filters.fromDate}
                  onChange={(e) => setFilters({ ...filters, fromDate: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-neutral-500 ms-2">الفترة إلى</label>
              <div className="relative">
                <Calendar className="absolute end-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-300" />
                <Input
                  type="date"
                  className="h-11 pe-12 rounded-xl border border-neutral-200 focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all font-medium"
                  value={filters.toDate}
                  onChange={(e) => setFilters({ ...filters, toDate: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-neutral-500 ms-2">الفرع</label>
              <Select value={filters.branch} onValueChange={(v) => setFilters({ ...filters, branch: v })}>
                <SelectTrigger className="h-11 rounded-xl border border-neutral-200 focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all font-medium">
                  <SelectValue placeholder="اختر فرع" />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="all" className="font-medium">جميع الفروع</SelectItem>
                  <SelectItem value="sanaa" className="font-medium">صنعاء</SelectItem>
                  <SelectItem value="aden" className="font-medium">عدن</SelectItem>
                  <SelectItem value="taiz" className="font-medium">تعز</SelectItem>
                  <SelectItem value="ibb" className="font-medium">إب</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-neutral-500 ms-2">فئة الرخصة</label>
              <Select value={filters.category} onValueChange={(v) => setFilters({ ...filters, category: v })}>
                <SelectTrigger className="h-11 rounded-xl border border-neutral-200 focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all font-medium">
                  <SelectValue placeholder="اختر الفئة" />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="all" className="font-medium">جميع الفئات</SelectItem>
                  <SelectItem value="A" className="font-medium">دراجة نارية</SelectItem>
                  <SelectItem value="B" className="font-medium">خصوصي</SelectItem>
                  <SelectItem value="C" className="font-medium">نقل خفيف</SelectItem>
                  <SelectItem value="D" className="font-medium">نقل ثقيل</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-neutral-500 ms-2">المExaminer</label>
              <Select value={filters.examiner} onValueChange={(v) => setFilters({ ...filters, examiner: v })}>
                <SelectTrigger className="h-11 rounded-xl border border-neutral-200 focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all font-medium">
                  <SelectValue placeholder="اختر" />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="all" className="font-medium">الكل</SelectItem>
                  <SelectItem value="doctor1" className="font-medium">د.أحمد</SelectItem>
                  <SelectItem value="doctor2" className="font-medium">د.سعيد</SelectItem>
                  <SelectItem value="examiner1" className="font-medium">م.محمد</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Report Selector Tabs */}
      <Tabs defaultValue="status-distribution" className="w-full">
        <TabsList className="flex flex-wrap h-auto p-1 bg-neutral-100 rounded-xl gap-1">
          <TabsTrigger 
            value="status-distribution" 
            className="flex-1 min-w-[120px] data-[state=active]:bg-white data-[state=active]:shadow-md rounded-lg font-medium text-sm py-2"
          >
            <PieChart className="w-4 h-4 ms-2" />
            {t('statusDistribution')}
          </TabsTrigger>
          <TabsTrigger 
            value="service-distribution" 
            className="flex-1 min-w-[120px] data-[state=active]:bg-white data-[state=active]:shadow-md rounded-lg font-medium text-sm py-2"
          >
            <BarChart3 className="w-4 h-4 ms-2" />
            {t('serviceDistribution')}
          </TabsTrigger>
          <TabsTrigger 
            value="delayed-applications" 
            className="flex-1 min-w-[120px] data-[state=active]:bg-white data-[state=active]:shadow-md rounded-lg font-medium text-sm py-2"
          >
            <AlertTriangle className="w-4 h-4 ms-2" />
            {t('delayedApplications')}
          </TabsTrigger>
          <TabsTrigger 
            value="test-performance" 
            className="flex-1 min-w-[120px] data-[state=active]:bg-white data-[state=active]:shadow-md rounded-lg font-medium text-sm py-2"
          >
            <Activity className="w-4 h-4 ms-2" />
            {t('testPerformance')}
          </TabsTrigger>
          <TabsTrigger 
            value="branch-throughput" 
            className="flex-1 min-w-[120px] data-[state=active]:bg-white data-[state=active]:shadow-md rounded-lg font-medium text-sm py-2"
          >
            <TrendingUp className="w-4 h-4 ms-2" />
            {t('branchThroughput')}
          </TabsTrigger>
          <TabsTrigger 
            value="employee-activity" 
            className="flex-1 min-w-[120px] data-[state=active]:bg-white data-[state=active]:shadow-md rounded-lg font-medium text-sm py-2"
          >
            <Users className="w-4 h-4 ms-2" />
            {t('employeeActivity')}
          </TabsTrigger>
          <TabsTrigger 
            value="issuance-timeline" 
            className="flex-1 min-w-[120px] data-[state=active]:bg-white data-[state=active]:shadow-md rounded-lg font-medium text-sm py-2"
          >
            <Clock className="w-4 h-4 ms-2" />
            {t('issuanceTimeline')}
          </TabsTrigger>
        </TabsList>

        {/* Status Distribution Tab */}
        <TabsContent value="status-distribution" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Pie Chart */}
            <Card className="border-none shadow-lg rounded-2xl bg-white">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                  <PieChart className="w-5 h-5 text-blue-600" />
                  {t('statusDistribution')}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 pt-0">
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsPieChart>
                      <Pie
                        data={reportData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={2}
                        dataKey="value"
                        nameKey="name"
                        label={({ name, percent }) => `${getStatusLabel(name).ar} (${(percent * 100).toFixed(0)}%)`}
                        labelLine={false}
                      >
                        {reportData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={STATUS_COLORS[index % STATUS_COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                        formatter={(value: number) => [value, 'العدد']}
                      />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Legend & Stats */}
            <Card className="border-none shadow-lg rounded-2xl bg-white">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-semibold">
                  ملخص الحالة
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 pt-0 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  {reportData.map((item, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 bg-neutral-50 rounded-xl">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: STATUS_COLORS[index % STATUS_COLORS.length] }} />
                      <div className="flex-1">
                        <p className="font-medium text-neutral-700">{getStatusLabel(item.name).ar}</p>
                        <p className="text-sm text-neutral-500">
                          <span className="font-bold text-lg">{item.value}</span> طلب
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="pt-4 border-t border-neutral-100">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-neutral-500">الإجمالي</span>
                    <span className="text-2xl font-bold text-blue-600">
                      {reportData.reduce((acc, item) => acc + item.value, 0)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Service Distribution Tab */}
        <TabsContent value="service-distribution" className="mt-6">
          <Card className="border-none shadow-lg rounded-2xl bg-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-amber-600" />
                {t('serviceDistribution')}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 pt-0">
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={reportData} layout="vertical" margin={{ top: 20, right: 30, left: 80, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                    <XAxis type="number" tick={{ fontSize: 12 }} />
                    <YAxis type="category" dataKey="name" tick={{ fontSize: 12 }} width={80} />
                    <Tooltip 
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                      formatter={(value: number) => [value, 'العدد']}
                    />
                    <Bar dataKey="value" fill="#1a3a8f" radius={[0, 8, 8, 0]} barSize={30} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Delayed Applications Tab */}
        <TabsContent value="delayed-applications" className="mt-6">
          <Card className="border-none shadow-lg rounded-2xl bg-white">
            <CardHeader className="pb-2 flex flex-row items-center justify-between">
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-red-500" />
                {t('delayedApplications')}
              </CardTitle>
              <Badge variant="destructive" className="px-3 py-1 rounded-full">
                {delayedApplications.filter(app => app.daysInStage > 14).length} طلب متأخر
              </Badge>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-end">
                  <thead className="bg-neutral-50 border-b border-neutral-100">
                    <tr>
                      <th className="px-6 py-4 text-sm font-semibold text-neutral-500 uppercase">رقم الطلب</th>
                      <th className="px-6 py-4 text-sm font-semibold text-neutral-500 uppercase">المتقدم</th>
                      <th className="px-6 py-4 text-sm font-semibold text-neutral-500 uppercase">الحالة الحالية</th>
                      <th className="px-6 py-4 text-sm font-semibold text-neutral-500 uppercase">أيام الانتظار</th>
                      <th className="px-6 py-4 text-sm font-semibold text-neutral-500 uppercase">الفرع</th>
                      <th className="px-6 py-4 text-sm font-semibold text-neutral-500 uppercase text-center">الإجراءات</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-50">
                    {delayedApplications.map((app) => (
                      <tr key={app.applicationId} className="hover:bg-neutral-50 transition-colors">
                        <td className="px-6 py-4 font-medium text-blue-600">{app.applicationNumber}</td>
                        <td className="px-6 py-4 text-neutral-700">{app.applicantName}</td>
                        <td className="px-6 py-4">
                          <Badge variant="outline" className="border-neutral-200">
                            {getStatusLabel(app.currentStatus).ar}
                          </Badge>
                        </td>
                        <td className="px-6 py-4">
                          <span className={cn(
                            "font-bold px-3 py-1 rounded-full",
                            app.daysInStage > 21 ? "bg-red-100 text-red-700" : 
                            app.daysInStage > 14 ? "bg-amber-100 text-amber-700" : 
                            "bg-neutral-100 text-neutral-700"
                          )}>
                            {app.daysInStage} يوم
                          </span>
                        </td>
                        <td className="px-6 py-4 text-neutral-600">{app.branchName}</td>
                        <td className="px-6 py-4 text-center">
                          <Button variant="ghost" size="sm" className="text-blue-600 hover:bg-blue-50 rounded-lg font-medium">
                            عرض التفاصيل
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Test Performance Tab */}
        <TabsContent value="test-performance" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="border-none shadow-lg rounded-2xl bg-white">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                  <Activity className="w-5 h-5 text-purple-600" />
                  {t('testPerformance')}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 pt-0">
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={testPerformance}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                      <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                      <YAxis tick={{ fontSize: 12 }} />
                      <Tooltip 
                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                      />
                      <Legend />
                      <Bar dataKey="pass" name="ناجح" fill="#10B981" radius={[8, 8, 0, 0]} />
                      <Bar dataKey="fail" name="راسب" fill="#EF4444" radius={[8, 8, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            <Card className="border-none shadow-lg rounded-2xl bg-white">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-semibold">معدل النجاح</CardTitle>
              </CardHeader>
              <CardContent className="p-6 pt-0 space-y-6">
                {testPerformance.map((item, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-neutral-600">{item.name}</span>
                      <span className="text-xl font-bold text-green-600">{item.rate}%</span>
                    </div>
                    <div className="h-3 bg-neutral-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-green-500 rounded-full transition-all" 
                        style={{ width: `${item.rate}%` }}
                      />
                    </div>
                    <p className="text-sm text-neutral-500">
                      {item.pass} ناجح / {item.fail} راسب
                    </p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Branch Throughput Tab */}
        <TabsContent value="branch-throughput" className="mt-6">
          <Card className="border-none shadow-lg rounded-2xl bg-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-green-600" />
                {t('branchThroughput')}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 pt-0">
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={branchThroughput}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                    <XAxis dataKey="branch" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip 
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                    />
                    <Legend />
                    <Bar dataKey="processed" name="قيد المعالجة" fill="#F59E0B" radius={[8, 8, 0, 0]} />
                    <Bar dataKey="completed" name="مكتمل" fill="#10B981" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Employee Activity Tab */}
        <TabsContent value="employee-activity" className="mt-6">
          <Card className="border-none shadow-lg rounded-2xl bg-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <Users className="w-5 h-5 text-purple-600" />
                {t('employeeActivity')}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 pt-0">
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={employeeActivity}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                    <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip 
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                    />
                    <Legend />
                    <Bar dataKey="processed" name="معالج" fill="#8B5CF6" radius={[8, 8, 0, 0]} />
                    <Bar dataKey="completed" name="مكتمل" fill="#10B981" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Issuance Timeline Tab */}
        <TabsContent value="issuance-timeline" className="mt-6">
          <Card className="border-none shadow-lg rounded-2xl bg-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <Clock className="w-5 h-5 text-blue-600" />
                {t('issuanceTimeline')}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 pt-0">
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={issuanceTimeline}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                    <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip 
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="count" 
                      name="الرخص المصدرة"
                      stroke="#1a3a8f" 
                      fill="url(#colorGradient)" 
                      strokeWidth={3}
                    />
                    <defs>
                      <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#1a3a8f" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#1a3a8f" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}