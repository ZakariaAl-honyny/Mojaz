'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  DollarSign,
  TrendingUp,
  TrendingDown,
  Download,
  Calendar,
  CreditCard,
  FileText,
  PieChart,
  BarChart3,
  Wallet,
  RefreshCw,
  AlertCircle
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
  Cell,
  AreaChart,
  Area
} from 'recharts';

interface RevenueSummary {
  total: number;
  thisMonth: number;
  thisYear: number;
  change: number;
}

interface PaymentBreakdown {
  type: string;
  amount: number;
  percentage: number;
  color: string;
}

interface OutstandingPayment {
  id: string;
  applicationNumber: string;
  applicant: string;
  amount: number;
  dueDate: string;
  status: 'pending' | 'overdue';
}

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];

export default function FinancialReportPage() {
  const t = useTranslations('reports');
  const { locale } = useParams();
  const isRTL = locale === 'ar';

  const [dateRange, setDateRange] = useState({ from: '', to: '' });

  // Mock data
  const revenueSummary: RevenueSummary = {
    total: 1250000,
    thisMonth: 185000,
    thisYear: 2100000,
    change: 12.5
  };

  const paymentBreakdown: PaymentBreakdown[] = [
    { type: locale === 'ar' ? 'رسوم الطلب' : 'Application Fees', amount: 450000, percentage: 36, color: '#3B82F6' },
    { type: locale === 'ar' ? 'الفحص الطبي' : 'Medical Exam', amount: 325000, percentage: 26, color: '#10B981' },
    { type: locale === 'ar' ? 'الاختبار النظري' : 'Theory Test', amount: 200000, percentage: 16, color: '#F59E0B' },
    { type: locale === 'ar' ? 'الاختبار العملي' : 'Practical Test', amount: 175000, percentage: 14, color: '#8B5CF6' },
    { type: locale === 'ar' ? 'إصدار الرخصة' : 'License Issuance', amount: 100000, percentage: 8, color: '#EC4899' },
  ];

  const monthlyRevenue = [
    { month: locale === 'ar' ? 'يناير' : 'Jan', revenue: 180000 },
    { month: locale === 'ar' ? 'فبراير' : 'Feb', revenue: 195000 },
    { month: locale === 'ar' ? 'مارس' : 'Mar', revenue: 210000 },
    { month: locale === 'ar' ? 'ابريل' : 'Apr', revenue: 185000 },
    { month: locale === 'ar' ? 'مايو' : 'May', revenue: 225000 },
    { month: locale === 'ar' ? 'يونيو' : 'Jun', revenue: 240000 },
    { month: locale === 'ar' ? 'يوليو' : 'Jul', revenue: 215000 },
    { month: locale === 'ar' ? 'اغسطس' : 'Aug', revenue: 195000 },
    { month: locale === 'ar' ? 'سبتمبر' : 'Sep', revenue: 220000 },
    { month: locale === 'ar' ? 'اكتوبر' : 'Oct', revenue: 235000 },
    { month: locale === 'ar' ? 'نوفمبر' : 'Nov', revenue: 250000 },
    { month: locale === 'ar' ? 'ديسمبر' : 'Dec', revenue: 210000 },
  ];

  const categoryRevenue = [
    { category: 'فئة A', revenue: 350000, count: 1200 },
    { category: 'فئة B', revenue: 620000, count: 2400 },
    { category: 'فئة C', revenue: 180000, count: 450 },
    { category: 'فئة D', revenue: 95000, count: 180 },
    { category: 'فئة E', revenue: 45000, count: 75 },
    { category: 'فئة F', revenue: 60000, count: 120 },
  ];

  const outstandingPayments: OutstandingPayment[] = [
    { id: '1', applicationNumber: 'MOJ-2025-84729163', applicant: 'أحمد محمد', amount: 150, dueDate: '2025-02-01', status: 'overdue' },
    { id: '2', applicationNumber: 'MOJ-2025-92837465', applicant: 'سعيد خالد', amount: 200, dueDate: '2025-02-05', status: 'pending' },
    { id: '3', applicationNumber: 'MOJ-2025-73829104', applicant: 'عبدالله عمر', amount: 100, dueDate: '2025-02-10', status: 'pending' },
  ];

  const refunds = [
    { id: '1', applicationNumber: 'MOJ-2025-12345678', amount: 150, reason: locale === 'ar' ? 'إلغاء الطلب' : 'Application Cancelled', date: '2025-01-28' },
    { id: '2', applicationNumber: 'MOJ-2025-87654321', amount: 200, reason: locale === 'ar' ? 'رفض الاختبار' : 'Test Failed', date: '2025-01-25' },
  ];

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('ar-SA', { style: 'currency', currency: 'SAR', maximumFractionDigits: 0 }).format(value);
  };

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900">{t('financial.title')}</h1>
          <p className="text-neutral-500 mt-1">{t('financial.subtitle')}</p>
        </div>
        <div className="flex gap-2">
          <div className="flex items-center gap-2">
            <Input 
              type="date" 
              value={dateRange.from}
              onChange={(e) => setDateRange({...dateRange, from: e.target.value})}
              className="w-36"
            />
            <span className="text-neutral-400">-</span>
            <Input 
              type="date" 
              value={dateRange.to}
              onChange={(e) => setDateRange({...dateRange, to: e.target.value})}
              className="w-36"
            />
          </div>
          <Button className="gap-2 bg-primary-500 hover:bg-primary-600">
            <Download className="w-4 h-4" />
            {t('export.csv')}
          </Button>
        </div>
      </div>

      {/* Revenue Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="border-0 shadow-sm">
          <CardContent className="p-5">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <p className="text-sm text-neutral-500 font-medium">{t('financial.total')}</p>
                <p className="text-3xl font-bold text-neutral-900">{formatCurrency(revenueSummary.total)}</p>
                <div className="flex items-center gap-1">
                  <TrendingUp className="w-4 h-4 text-green-500" />
                  <span className="text-sm font-medium text-green-600">+{revenueSummary.change}%</span>
                  <span className="text-xs text-neutral-400">{locale === 'ar' ? 'من last month' : 'vs last month'}</span>
                </div>
              </div>
              <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center">
                <Wallet className="w-6 h-6 text-blue-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardContent className="p-5">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <p className="text-sm text-neutral-500 font-medium">{t('financial.thisMonth')}</p>
                <p className="text-3xl font-bold text-neutral-900">{formatCurrency(revenueSummary.thisMonth)}</p>
                <div className="flex items-center gap-1">
                  <TrendingUp className="w-4 h-4 text-green-500" />
                  <span className="text-sm font-medium text-green-600">+8.2%</span>
                  <span className="text-xs text-neutral-400">{locale === 'ar' ? 'من last month' : 'vs last month'}</span>
                </div>
              </div>
              <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center">
                <Calendar className="w-6 h-6 text-green-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardContent className="p-5">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <p className="text-sm text-neutral-500 font-medium">{t('financial.thisYear')}</p>
                <p className="text-3xl font-bold text-neutral-900">{formatCurrency(revenueSummary.thisYear)}</p>
                <div className="flex items-center gap-1">
                  <TrendingUp className="w-4 h-4 text-green-500" />
                  <span className="text-sm font-medium text-green-600">+15.3%</span>
                  <span className="text-xs text-neutral-400">{locale === 'ar' ? 'من last year' : 'vs last year'}</span>
                </div>
              </div>
              <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-purple-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Revenue Trend */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-primary-500" />
              {t('financial.revenueTrend')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={monthlyRevenue}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#006C35" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#006C35" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis dataKey="month" tick={{ fontSize: 11 }} axisLine={{ stroke: '#E5E7EB' }} />
                  <YAxis 
                    tick={{ fontSize: 11 }} 
                    axisLine={{ stroke: '#E5E7EB' }}
                    tickFormatter={(value) => `${(value / 1000)}K`}
                  />
                  <Tooltip 
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                    formatter={(value: number) => [formatCurrency(value), locale === 'ar' ? 'الإيرادات' : 'Revenue']}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="revenue" 
                    stroke="#006C35" 
                    strokeWidth={2}
                    fillOpacity={1} 
                    fill="url(#colorRevenue)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Revenue by Category */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <PieChart className="w-5 h-5 text-primary-500" />
              {t('financial.byCategory')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={categoryRevenue} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis 
                    type="number" 
                    tickFormatter={(value) => `${(value / 1000)}K`}
                    tick={{ fontSize: 11 }}
                  />
                  <YAxis 
                    type="category" 
                    dataKey="category" 
                    width={50}
                    tick={{ fontSize: 11 }}
                  />
                  <Tooltip 
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                    formatter={(value: number) => [formatCurrency(value), locale === 'ar' ? 'الإيرادات' : 'Revenue']}
                  />
                  <Bar dataKey="revenue" fill="#006C35" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Payment Breakdown */}
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-primary-500" />
            {t('financial.breakdown')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {paymentBreakdown.map((item, index) => (
              <div key={index} className="p-4 bg-neutral-50 rounded-xl">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-sm text-neutral-600">{item.type}</span>
                </div>
                <p className="text-xl font-bold text-neutral-900">{formatCurrency(item.amount)}</p>
                <p className="text-sm text-neutral-500">{item.percentage}%</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Outstanding & Refunds */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Outstanding Payments */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-orange-500" />
              {t('financial.outstanding')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {outstandingPayments.map((payment) => (
                <div key={payment.id} className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                  <div>
                    <p className="font-medium text-neutral-900">{payment.applicationNumber}</p>
                    <p className="text-sm text-neutral-500">{payment.applicant}</p>
                  </div>
                  <div className="text-end">
                    <p className="font-bold text-neutral-900">{formatCurrency(payment.amount)}</p>
                    <Badge variant={payment.status === 'overdue' ? 'destructive' : 'secondary'}>
                      {payment.status === 'overdue' ? (locale === 'ar' ? 'متأخر' : 'Overdue') : (locale === 'ar' ? 'معلق' : 'Pending')}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Refunds */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <RefreshCw className="w-5 h-5 text-red-500" />
              {t('financial.refunds')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {refunds.map((refund) => (
                <div key={refund.id} className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                  <div>
                    <p className="font-medium text-neutral-900">{refund.applicationNumber}</p>
                    <p className="text-sm text-neutral-500">{refund.reason}</p>
                  </div>
                  <div className="text-end">
                    <p className="font-bold text-red-600">-{formatCurrency(refund.amount)}</p>
                    <p className="text-xs text-neutral-400">{refund.date}</p>
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