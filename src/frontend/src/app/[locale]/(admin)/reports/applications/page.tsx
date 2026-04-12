'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  CheckCircle
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
  PieChart as RechartsPieChart,
  Pie,
  Cell
} from 'recharts';

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

const CATEGORY_COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];

export default function ApplicationsReportPage() {
  const t = useTranslations('reports');
  const { locale } = useParams();
  const isRTL = locale === 'ar';

  const [filters, setFilters] = useState<FilterState>({
    fromDate: '',
    toDate: '',
    status: 'all',
    category: 'all',
    serviceType: 'all'
  });

  const [searchQuery, setSearchQuery] = useState('');

  // Mock data
  const applicationsData: ApplicationData[] = [
    { id: '1', number: 'MOJ-2025-84729163', applicant: 'أحمد محمد علي', category: 'B', status: 'Completed', stage: 'License Issued', submittedDate: '2025-01-15', completedDate: '2025-02-10' },
    { id: '2', number: 'MOJ-2025-92837465', applicant: 'سعيد خالد', category: 'A', status: 'InReview', stage: 'Medical Exam', submittedDate: '2025-01-18', completedDate: null },
    { id: '3', number: 'MOJ-2025-73829104', applicant: 'عبدالله عمر', category: 'C', status: 'Rejected', stage: 'Theory Test', submittedDate: '2025-01-10', completedDate: '2025-02-01', rejectionReason: 'رسب في الاختبار النظري' },
    { id: '4', number: 'MOJ-2025-19283746', applicant: 'فاطمة علي', category: 'B', status: 'Submitted', stage: 'Pending Review', submittedDate: '2025-01-20', completedDate: null },
    { id: '5', number: 'MOJ-2025-56473829', applicant: 'خالد إبراهيم', category: 'D', status: 'Completed', stage: 'License Issued', submittedDate: '2025-01-05', completedDate: '2025-01-25' },
  ];

  const statusData = [
    { name: locale === 'ar' ? 'مكتمل' : 'Completed', value: 245, color: '#10B981' },
    { name: locale === 'ar' ? 'قيد المراجعة' : 'In Review', value: 89, color: '#F59E0B' },
    { name: locale === 'ar' ? 'مستقدم' : 'Submitted', value: 56, color: '#3B82F6' },
    { name: locale === 'ar' ? 'مرفوض' : 'Rejected', value: 23, color: '#EF4444' },
    { name: locale === 'ar' ? 'مسودة' : 'Draft', value: 18, color: '#8B5CF6' },
  ];

  const categoryData = [
    { name: 'فئة A', value: 120 },
    { name: 'فئة B', value: 280 },
    { name: 'فئة C', value: 85 },
    { name: 'فئة D', value: 45 },
    { name: 'فئة E', value: 25 },
    { name: 'فئة F', value: 15 },
  ];

  const trendData = [
    { month: locale === 'ar' ? 'يناير' : 'Jan', applications: 45, completed: 38 },
    { month: locale === 'ar' ? 'فبراير' : 'Feb', applications: 52, completed: 45 },
    { month: locale === 'ar' ? 'مارس' : 'Mar', applications: 48, completed: 42 },
    { month: locale === 'ar' ? 'ابريل' : 'Apr', applications: 61, completed: 55 },
  ];

  const completionTimeData = [
    { stage: locale === 'ar' ? 'الفحص الطبي' : 'Medical Exam', days: 3 },
    { stage: locale === 'ar' ? 'الاختبار النظري' : 'Theory Test', days: 5 },
    { stage: locale === 'ar' ? 'الاختبار العملي' : 'Practical Test', days: 7 },
    { stage: locale === 'ar' ? 'إصدار الرخصة' : 'License Issuance', days: 2 },
  ];

  const rejectionReasons = [
    { reason: locale === 'ar' ? 'رسب في الاختبار' : 'Failed Test', count: 12 },
    { reason: locale === 'ar' ? 'فشل الفحص الطبي' : 'Medical Failure', count: 5 },
    { reason: locale === 'ar' ? 'توثيق غير مكتمل' : 'Incomplete Documents', count: 4 },
    { reason: locale === 'ar' ? 'عمر أقل من المطلوب' : 'Age Below Required', count: 2 },
  ];

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { variant: any; label: string }> = {
      Completed: { variant: 'default', label: locale === 'ar' ? 'مكتمل' : 'Completed' },
      InReview: { variant: 'secondary', label: locale === 'ar' ? 'قيد المراجعة' : 'In Review' },
      Submitted: { variant: 'outline', label: locale === 'ar' ? 'مستقدم' : 'Submitted' },
      Rejected: { variant: 'destructive', label: locale === 'ar' ? 'مرفوض' : 'Rejected' },
      Draft: { variant: 'outline', label: locale === 'ar' ? 'مسودة' : 'Draft' },
    };
    const config = statusMap[status] || { variant: 'outline', label: status };
    return <Badge variant={config.variant as any}>{config.label}</Badge>;
  };

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900">{t('applications.title')}</h1>
          <p className="text-neutral-500 mt-1">{t('applications.subtitle')}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Download className="w-4 h-4" />
            {t('export.csv')}
          </Button>
          <Button variant="outline" className="gap-2">
            <Download className="w-4 h-4" />
            {t('export.excel')}
          </Button>
          <Button variant="outline" className="gap-2">
            <Download className="w-4 h-4" />
            {t('export.pdf')}
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card className="border-0 shadow-sm">
        <CardContent className="p-5">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-neutral-700">{t('filters.fromDate')}</label>
              <Input 
                type="date" 
                value={filters.fromDate}
                onChange={(e) => setFilters({...filters, fromDate: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-neutral-700">{t('filters.toDate')}</label>
              <Input 
                type="date" 
                value={filters.toDate}
                onChange={(e) => setFilters({...filters, toDate: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-neutral-700">{t('filters.status')}</label>
              <Select value={filters.status} onValueChange={(v) => setFilters({...filters, status: v})}>
                <SelectTrigger>
                  <SelectValue placeholder={t('filters.status')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t('common.all') || 'All'}</SelectItem>
                  <SelectItem value="Submitted">{locale === 'ar' ? 'مستقدم' : 'Submitted'}</SelectItem>
                  <SelectItem value="InReview">{locale === 'ar' ? 'قيد المراجعة' : 'In Review'}</SelectItem>
                  <SelectItem value="Completed">{locale === 'ar' ? 'مكتمل' : 'Completed'}</SelectItem>
                  <SelectItem value="Rejected">{locale === 'ar' ? 'مرفوض' : 'Rejected'}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-neutral-700">{t('filters.category')}</label>
              <Select value={filters.category} onValueChange={(v) => setFilters({...filters, category: v})}>
                <SelectTrigger>
                  <SelectValue placeholder={t('filters.category')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t('common.all') || 'All'}</SelectItem>
                  <SelectItem value="A">فئة A</SelectItem>
                  <SelectItem value="B">فئة B</SelectItem>
                  <SelectItem value="C">فئة C</SelectItem>
                  <SelectItem value="D">فئة D</SelectItem>
                  <SelectItem value="E">فئة E</SelectItem>
                  <SelectItem value="F">فئة F</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-neutral-700">{t('filters.serviceType')}</label>
              <Select value={filters.serviceType} onValueChange={(v) => setFilters({...filters, serviceType: v})}>
                <SelectTrigger>
                  <SelectValue placeholder={t('filters.serviceType')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t('common.all') || 'All'}</SelectItem>
                  <SelectItem value="new">{locale === 'ar' ? 'جديد' : 'New'}</SelectItem>
                  <SelectItem value="renewal">{locale === 'ar' ? 'تجديد' : 'Renewal'}</SelectItem>
                  <SelectItem value="upgrade">{locale === 'ar' ? 'ترقية' : 'Upgrade'}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="mt-4 flex gap-2">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
              <Input 
                placeholder={t('filters.search') || 'Search...'}
                className="ps-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button variant="outline" className="gap-2">
              <Filter className="w-4 h-4" />
              {t('filters.apply') || 'Apply'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Charts */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-neutral-500 flex items-center gap-2">
              <PieChart className="w-4 h-4" />
              {t('applications.byStatus')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[180px]">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsPieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={70}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </RechartsPieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-neutral-500 flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              {t('applications.byCategory')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[180px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={categoryData} layout="vertical">
                  <XAxis type="number" hide />
                  <YAxis type="category" dataKey="name" width={40} tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Bar dataKey="value" fill="#006C35" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-neutral-500 flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              {t('applications.trend')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[180px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trendData}>
                  <XAxis dataKey="month" tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
                  <Tooltip />
                  <Line type="monotone" dataKey="applications" stroke="#3B82F6" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-neutral-500 flex items-center gap-2">
              <Clock className="w-4 h-4" />
              {t('applications.avgTime')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[180px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={completionTimeData}>
                  <XAxis dataKey="stage" tick={{ fontSize: 9 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
                  <Tooltip />
                  <Bar dataKey="days" fill="#F59E0B" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Rejection Reasons */}
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <XCircle className="w-5 h-5 text-red-500" />
            {t('applications.rejectionReasons')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {rejectionReasons.map((item, index) => (
              <div key={index} className="p-4 bg-red-50 rounded-xl text-center">
                <p className="text-2xl font-bold text-red-600">{item.count}</p>
                <p className="text-sm text-red-700 mt-1">{item.reason}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <FileText className="w-5 h-5 text-primary-500" />
            {t('applications.table')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-neutral-50 border-b border-neutral-100">
                <tr>
                  <th className="text-start px-4 py-3 text-sm font-medium text-neutral-500">{t('applications.number')}</th>
                  <th className="text-start px-4 py-3 text-sm font-medium text-neutral-500">{t('applications.applicant')}</th>
                  <th className="text-start px-4 py-3 text-sm font-medium text-neutral-500">{t('applications.category')}</th>
                  <th className="text-start px-4 py-3 text-sm font-medium text-neutral-500">{t('applications.status')}</th>
                  <th className="text-start px-4 py-3 text-sm font-medium text-neutral-500">{t('applications.stage')}</th>
                  <th className="text-start px-4 py-3 text-sm font-medium text-neutral-500">{t('applications.submittedDate')}</th>
                  <th className="text-start px-4 py-3 text-sm font-medium text-neutral-500">{t('applications.completedDate')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {applicationsData.map((app) => (
                  <tr key={app.id} className="hover:bg-neutral-50">
                    <td className="px-4 py-3 text-neutral-900 font-medium">{app.number}</td>
                    <td className="px-4 py-3 text-neutral-700">{app.applicant}</td>
                    <td className="px-4 py-3">
                      <Badge variant="outline" className="border-primary-200 text-primary-700">
                        {app.category}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">{getStatusBadge(app.status)}</td>
                    <td className="px-4 py-3 text-neutral-600 text-sm">{app.stage}</td>
                    <td className="px-4 py-3 text-neutral-600 text-sm">{app.submittedDate}</td>
                    <td className="px-4 py-3 text-neutral-600 text-sm">
                      {app.completedDate || '-'}
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