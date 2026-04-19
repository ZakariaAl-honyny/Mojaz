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
import { useTranslations, useFormatter } from 'next-intl';
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
  const t = useTranslations('admin');
  const format = useFormatter();
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
    { id: '1', number: 'MOJ-2026-84729163', applicant: locale === 'ar' ? 'أحمد محمد علي' : 'Ahmed Mohammed Ali', category: 'B', status: 'Completed', stage: t('reports.applications.stages.licenseIssuance'), submittedDate: '2026-01-15', completedDate: '2026-02-10' },
    { id: '2', number: 'MOJ-2026-92837465', applicant: locale === 'ar' ? 'سعيد خالد' : 'Said Khalid', category: 'A', status: 'InReview', stage: t('reports.applications.stages.medicalExam'), submittedDate: '2026-01-18', completedDate: null },
    { id: '3', number: 'MOJ-2026-73829104', applicant: locale === 'ar' ? 'عبدالله عمر' : 'Abdullah Omar', category: 'C', status: 'Rejected', stage: t('reports.applications.stages.theoryTest'), submittedDate: '2026-01-10', completedDate: '2026-02-01', rejectionReason: t('reports.reasons.failedTest') },
    { id: '4', number: 'MOJ-2026-19283746', applicant: locale === 'ar' ? 'فاطمة علي' : 'Fatima Ali', category: 'B', status: 'Submitted', stage: t('reports.applications.stages.pendingReview'), submittedDate: '2026-01-20', completedDate: null },
    { id: '5', number: 'MOJ-2026-56473829', applicant: locale === 'ar' ? 'خالد إبراهيم' : 'Khalid Ibrahim', category: 'D', status: 'Completed', stage: t('reports.applications.stages.licenseIssuance'), submittedDate: '2026-01-05', completedDate: '2026-01-25' },
  ];

  const statusData = [
    { name: t('status.completed'), value: 245, color: '#10B981' },
    { name: t('status.inReview'), value: 89, color: '#F59E0B' },
    { name: t('status.submitted'), value: 56, color: '#3B82F6' },
    { name: t('status.rejected'), value: 23, color: '#EF4444' },
    { name: t('status.draft'), value: 18, color: '#8B5CF6' },
  ];

  const categoryData = [
    { name: `${t('reports.common.category')} A`, value: 120 },
    { name: `${t('reports.common.category')} B`, value: 280 },
    { name: `${t('reports.common.category')} C`, value: 85 },
    { name: `${t('reports.common.category')} D`, value: 45 },
    { name: `${t('reports.common.category')} E`, value: 25 },
    { name: `${t('reports.common.category')} F`, value: 15 },
  ];

  const trendData = [
    { month: t('months.jan'), applications: 45, completed: 38 },
    { month: t('months.feb'), applications: 52, completed: 45 },
    { month: t('months.mar'), applications: 48, completed: 42 },
    { month: t('months.apr'), applications: 61, completed: 55 },
  ];

  const completionTimeData = [
    { stage: t('reports.applications.stages.medicalExam'), days: 3 },
    { stage: t('reports.applications.stages.theoryTest'), days: 5 },
    { stage: t('reports.applications.stages.practicalTest'), days: 7 },
    { stage: t('reports.applications.stages.licenseIssuance'), days: 2 },
  ];

  const rejectionReasons = [
    { reason: t('reports.reasons.failedTest'), count: 12 },
    { reason: t('reports.reasons.medicalFailure'), count: 5 },
    { reason: t('reports.reasons.incompleteDocuments'), count: 4 },
    { reason: t('reports.reasons.ageBelowRequired'), count: 2 },
  ];

  const getStatusBadge = (status: string) => {
    const statusKey = status.charAt(0).toLowerCase() + status.slice(1);
    const statusMap: Record<string, { variant: any }> = {
      Completed: { variant: 'default' },
      InReview: { variant: 'secondary' },
      Submitted: { variant: 'outline' },
      Rejected: { variant: 'destructive' },
      Draft: { variant: 'outline' },
    };
    const config = statusMap[status] || { variant: 'outline' };
    return <Badge variant={config.variant as any}>{t(`status.${statusKey}`)}</Badge>;
  };

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900">{t('reports.applications.title')}</h1>
          <p className="text-neutral-500 mt-1">{t('reports.applications.subtitle')}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Download className="w-4 h-4" />
            {t('reports.common.exportCSV')}
          </Button>
          <Button variant="outline" className="gap-2">
            <Download className="w-4 h-4" />
            {t('reports.common.exportExcel')}
          </Button>
          <Button variant="outline" className="gap-2">
            <Download className="w-4 h-4" />
            {t('reports.common.exportPDF')}
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card className="border-0 shadow-sm">
        <CardContent className="p-5">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-neutral-700">{t('reports.common.fromDate')}</label>
              <Input 
                type="date" 
                value={filters.fromDate}
                onChange={(e) => setFilters({...filters, fromDate: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-neutral-700">{t('reports.common.toDate')}</label>
              <Input 
                type="date" 
                value={filters.toDate}
                onChange={(e) => setFilters({...filters, toDate: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-neutral-700">{t('reports.common.status')}</label>
              <Select value={filters.status} onValueChange={(v) => setFilters({...filters, status: v})}>
                <SelectTrigger>
                  <SelectValue placeholder={t('reports.common.status')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t('reports.common.all')}</SelectItem>
                  <SelectItem value="Submitted">{t('status.submitted')}</SelectItem>
                  <SelectItem value="InReview">{t('status.inReview')}</SelectItem>
                  <SelectItem value="Completed">{t('status.completed')}</SelectItem>
                  <SelectItem value="Rejected">{t('status.rejected')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-neutral-700">{t('reports.common.category')}</label>
              <Select value={filters.category} onValueChange={(v) => setFilters({...filters, category: v})}>
                <SelectTrigger>
                  <SelectValue placeholder={t('reports.common.category')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t('reports.common.all')}</SelectItem>
                  <SelectItem value="A">{t('reports.common.category')} A</SelectItem>
                  <SelectItem value="B">{t('reports.common.category')} B</SelectItem>
                  <SelectItem value="C">{t('reports.common.category')} C</SelectItem>
                  <SelectItem value="D">{t('reports.common.category')} D</SelectItem>
                  <SelectItem value="E">{t('reports.common.category')} E</SelectItem>
                  <SelectItem value="F">{t('reports.common.category')} F</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-neutral-700">{t('reports.common.serviceType')}</label>
              <Select value={filters.serviceType} onValueChange={(v) => setFilters({...filters, serviceType: v})}>
                <SelectTrigger>
                  <SelectValue placeholder={t('reports.common.serviceType')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t('reports.common.all')}</SelectItem>
                  <SelectItem value="new">{t('reports.common.new')}</SelectItem>
                  <SelectItem value="renewal">{t('reports.common.renewal')}</SelectItem>
                  <SelectItem value="upgrade">{t('reports.common.upgrade')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="mt-4 flex gap-2">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
              <Input 
                placeholder={t('reports.common.search')}
                className="ps-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button variant="outline" className="gap-2">
              <Filter className="w-4 h-4" />
              {t('reports.common.apply')}
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
              {t('reports.applications.byStatus')}
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
              {t('reports.applications.byCategory')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[180px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={categoryData} layout="vertical">
                  <XAxis type="number" hide />
                  <YAxis type="category" dataKey="name" width={40} tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Bar dataKey="value" fill="#6366F1" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-neutral-500 flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              {t('reports.applications.trend')}
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
              {t('reports.applications.avgTime')}
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
            {t('reports.applications.rejectionReasons')}
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
            {t('reports.applications.table')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-neutral-50 border-b border-neutral-100">
                <tr>
                  <th className="text-start px-4 py-3 text-sm font-medium text-neutral-500">{t('reports.applications.number')}</th>
                  <th className="text-start px-4 py-3 text-sm font-medium text-neutral-500">{t('reports.applications.applicant')}</th>
                  <th className="text-start px-4 py-3 text-sm font-medium text-neutral-500">{t('reports.applications.category')}</th>
                  <th className="text-start px-4 py-3 text-sm font-medium text-neutral-500">{t('reports.applications.status')}</th>
                  <th className="text-start px-4 py-3 text-sm font-medium text-neutral-500">{t('reports.applications.stage')}</th>
                  <th className="text-start px-4 py-3 text-sm font-medium text-neutral-500">{t('reports.applications.submittedDate')}</th>
                  <th className="text-start px-4 py-3 text-sm font-medium text-neutral-500">{t('reports.applications.completedDate')}</th>
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
                    <td className="px-4 py-3 text-neutral-600 text-sm">
                      {format.dateTime(new Date(app.submittedDate), { dateStyle: 'medium' })}
                    </td>
                    <td className="px-4 py-3 text-neutral-600 text-sm">
                      {app.completedDate ? format.dateTime(new Date(app.completedDate), { dateStyle: 'medium' }) : '-'}
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