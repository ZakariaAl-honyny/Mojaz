'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
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
  AlertCircle,
  Coins,
  History,
  ArrowUpRight,
  ArrowDownRight
} from "lucide-react";
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
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

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

const COLORS = ['#1a3a8f', '#2563eb', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

export default function FinancialReportPage() {
  const [dateRange, setDateRange] = useState({ from: '', to: '' });

  // Mock data for Sana'a context (YER)
  const revenueSummary: RevenueSummary = {
    total: 12500000,
    thisMonth: 1850000,
    thisYear: 21000000,
    change: 12.5
  };

  const paymentBreakdown: PaymentBreakdown[] = [
    { type: 'رسوم الطلب الجديدة', amount: 4500000, percentage: 36, color: '#1a3a8f' },
    { type: 'رسوم الفحص الطبي', amount: 3250000, percentage: 26, color: '#10B981' },
    { type: 'رسوم الاختبار النظري', amount: 2000000, percentage: 16, color: '#F59E0B' },
    { type: 'رسوم الاختبار العملي', amount: 1750000, percentage: 14, color: '#2563eb' },
    { type: 'رسوم طباعة الرخصة', amount: 1000000, percentage: 8, color: '#3b82f6' },
  ];

  const monthlyRevenue = [
    { month: 'يناير', revenue: 1800000 },
    { month: 'فبراير', revenue: 1950000 },
    { month: 'مارس', revenue: 2100000 },
    { month: 'أبريل', revenue: 1850000 },
    { month: 'مايو', revenue: 2250000 },
    { month: 'يونيو', revenue: 2400000 },
    { month: 'يوليو', revenue: 2150000 },
    { month: 'أغسطس', revenue: 1950000 },
    { month: 'سبتمبر', revenue: 2200000 },
    { month: 'أكتوبر', revenue: 2350000 },
    { month: 'نوفمبر', revenue: 2500000 },
    { month: 'ديسمبر', revenue: 2100000 },
  ];

  const categoryRevenue = [
    { category: 'خصوصي', revenue: 8200000 },
    { category: 'دراجة نارية', revenue: 2500000 },
    { category: 'نقل خفيف', revenue: 3800000 },
    { category: 'نقل ثقيل', revenue: 1500000 },
    { category: 'حافلة', revenue: 950000 },
    { category: 'إنشائية', revenue: 450000 },
  ];

  const outstandingPayments: OutstandingPayment[] = [
    { id: '1', applicationNumber: 'MOJ-2025-84729163', applicant: 'أحمد محمد علي', amount: 15000, dueDate: '2025-02-01', status: 'overdue' },
    { id: '2', applicationNumber: 'MOJ-2025-92837465', applicant: 'سعيد خالد ناصر', amount: 20000, dueDate: '2025-02-05', status: 'pending' },
    { id: '3', applicationNumber: 'MOJ-2025-73829104', applicant: 'عبدالله عمر محسن', amount: 10000, dueDate: '2025-02-10', status: 'pending' },
  ];

  const refunds = [
    { id: '1', applicationNumber: 'MOJ-2025-12345678', amount: 15000, reason: 'إلغاء الطلب من قبل المستخدم', date: '2025-01-28' },
    { id: '2', applicationNumber: 'MOJ-2025-87654321', amount: 20000, reason: 'خطأ في سداد الرسوم', date: '2025-01-25' },
  ];

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('ar-YE', { style: 'currency', currency: 'YER', maximumFractionDigits: 0 }).format(value);
  };

  return (
    <div className="max-w-7xl mx-auto py-10 px-4 space-y-10 font-arabic" dir="rtl">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 border-b border-neutral-100 pb-10">
        <div className="space-y-2">
          <h1 className="text-4xl font-black text-neutral-900 tracking-tight flex items-center gap-4">
             التقارير المالية والتحصيل
          </h1>
          <p className="text-lg text-neutral-400 font-bold">متابعة الإيرادات، المدفوعات المعلقة، وإحصائيات السداد الرقمي</p>
        </div>
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-3 bg-neutral-50/50 p-2 rounded-2xl border border-neutral-100">
            <Input
              type="date"
              value={dateRange.from}
              onChange={(e) => setDateRange({ ...dateRange, from: e.target.value })}
              className="w-40 h-10 border-none bg-white rounded-xl font-bold text-sm focus:ring-2 focus:ring-blue-100"
            />
            <span className="text-neutral-300 font-black">-</span>
            <Input
              type="date"
              value={dateRange.to}
              onChange={(e) => setDateRange({ ...dateRange, to: e.target.value })}
              className="w-40 h-10 border-none bg-white rounded-xl font-bold text-sm focus:ring-2 focus:ring-blue-100"
            />
          </div>
          <Button className="h-12 px-8 rounded-2xl gap-3 bg-[#1a3a8f] hover:bg-black font-black transition-all shadow-xl shadow-blue-900/20">
            <Download className="w-5 h-5" />
            تحميل التقرير المالي
          </Button>
        </div>
      </div>

      {/* Revenue Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          { title: 'إجمالي الإيرادات', value: revenueSummary.total, change: revenueSummary.change, icon: Wallet, color: 'text-blue-600', bg: 'bg-blue-50' },
          { title: 'إيرادات الشهر الحالي', value: revenueSummary.thisMonth, change: 8.2, icon: Calendar, color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { title: 'إيرادات العام (2025)', value: revenueSummary.thisYear, change: 15.3, icon: TrendingUp, color: 'text-[#1a3a8f]', bg: 'bg-blue-100/50' },
        ].map((card, idx) => (
          <Card key={idx} className="border-none shadow-2xl rounded-[2.5rem] bg-white overflow-hidden group hover:scale-[1.02] transition-all">
            <CardContent className="p-8">
              <div className="flex items-start justify-between">
                <div className="space-y-4">
                  <p className="text-xs font-black text-neutral-400 uppercase tracking-widest">{card.title}</p>
                  <p className="text-3xl font-black text-neutral-900 leading-none">{formatCurrency(card.value)}</p>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1 bg-emerald-50 text-emerald-600 px-2 py-1 rounded-lg text-xs font-black">
                      <ArrowUpRight className="w-3 h-3" />
                      {card.change}%
                    </div>
                    <span className="text-[10px] text-neutral-400 font-bold italic">مقارنة بالفترة السابقة</span>
                  </div>
                </div>
                <div className={cn("w-16 h-16 rounded-3xl flex items-center justify-center shadow-sm", card.bg)}>
                  <card.icon className={cn("w-8 h-8", card.color)} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Revenue Trend */}
        <Card className="border-none shadow-2xl rounded-[2.5rem] bg-white overflow-hidden">
          <CardHeader className="p-10 pb-0 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-2xl font-black flex items-center gap-4 text-neutral-800">
                <BarChart3 className="w-8 h-8 text-[#1a3a8f]" />
                منحنى الإيرادات الشهري
              </CardTitle>
              <CardDescription className="font-bold text-neutral-400 mt-1">تتبع التدفق المالي على مدار العام الحالي</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="p-10">
            <div className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={monthlyRevenue}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#1a3a8f" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#1a3a8f" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f1f1" vertical={false} />
                  <XAxis dataKey="month" tick={{ fontSize: 11, fontWeight: 'bold' }} axisLine={false} tickLine={false} />
                  <YAxis
                    tick={{ fontSize: 11, fontWeight: 'bold' }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(value) => `${(value / 1000000)}M`}
                  />
                  <Tooltip
                    contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 20px 40px rgba(0,0,0,0.1)', padding: '20px' }}
                    labelStyle={{ fontWeight: '900', marginBottom: '8px', color: '#1a3a8f' }}
                    formatter={(value: number) => [formatCurrency(value), 'الإيرادات']}
                  />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="#1a3a8f"
                    strokeWidth={4}
                    fillOpacity={1}
                    fill="url(#colorRevenue)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Revenue by Category */}
        <Card className="border-none shadow-2xl rounded-[2.5rem] bg-white overflow-hidden">
          <CardHeader className="p-10 pb-0">
            <CardTitle className="text-2xl font-black flex items-center gap-4 text-neutral-800">
              <PieChart className="w-8 h-8 text-amber-500" />
              توزيع الإيرادات حسب الفئة
            </CardTitle>
            <CardDescription className="font-bold text-neutral-400 mt-1">تصنيف الدخل المالي وفقاً لأنواع رخص القيادة</CardDescription>
          </CardHeader>
          <CardContent className="p-10">
            <div className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={categoryRevenue} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f1f1" horizontal={false} />
                  <XAxis
                    type="number"
                    tickFormatter={(value) => `${(value / 1000000)}M`}
                    tick={{ fontSize: 11, fontWeight: 'bold' }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    type="category"
                    dataKey="category"
                    width={80}
                    tick={{ fontSize: 11, fontWeight: 'bold' }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip
                    contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 20px 40px rgba(0,0,0,0.1)', padding: '20px' }}
                    formatter={(value: number) => [formatCurrency(value), 'الإيرادات']}
                  />
                  <Bar dataKey="revenue" fill="#1a3a8f" radius={[0, 15, 15, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Payment Breakdown */}
      <Card className="border-none shadow-2xl rounded-[2.5rem] bg-white overflow-hidden">
        <CardHeader className="p-10 border-b border-neutral-50">
          <CardTitle className="text-2xl font-black flex items-center gap-4 text-neutral-800">
            <CreditCard className="w-8 h-8 text-[#1a3a8f]" />
            تحليل أنواع المدفوعات
          </CardTitle>
        </CardHeader>
        <CardContent className="p-10">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
            {paymentBreakdown.map((item, index) => (
              <div key={index} className="p-8 bg-neutral-50/50 rounded-[2rem] border-2 border-neutral-50 hover:bg-white hover:shadow-xl hover:border-blue-100 transition-all cursor-default">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-4 h-4 rounded-full shadow-sm" style={{ backgroundColor: item.color }} />
                  <span className="text-xs font-black text-neutral-400 uppercase tracking-widest">{item.type}</span>
                </div>
                <p className="text-xl font-black text-neutral-900 mb-1">{formatCurrency(item.amount)}</p>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-black text-[#1a3a8f]">{item.percentage}%</span>
                  <div className="w-16 h-1 bg-neutral-100 rounded-full overflow-hidden">
                    <div className="h-full bg-[#1a3a8f]" style={{ width: `${item.percentage}%` }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Outstanding & Refunds */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Outstanding Payments */}
        <Card className="border-none shadow-2xl rounded-[2.5rem] bg-white overflow-hidden">
          <CardHeader className="p-10 border-b border-neutral-50">
            <CardTitle className="text-2xl font-black flex items-center gap-4 text-neutral-800">
              <AlertCircle className="w-8 h-8 text-amber-500" />
              المبالغ المعلقة والمتأخرة
            </CardTitle>
          </CardHeader>
          <CardContent className="p-10">
            <div className="space-y-6">
              {outstandingPayments.map((payment) => (
                <div key={payment.id} className="flex items-center justify-between p-6 bg-neutral-50/30 rounded-[2rem] border border-neutral-50 group hover:bg-amber-50/50 hover:border-amber-100 transition-all">
                  <div className="flex items-center gap-4">
                    <div className={cn(
                      "w-12 h-12 rounded-2xl flex items-center justify-center",
                      payment.status === 'overdue' ? "bg-red-100 text-red-600" : "bg-amber-100 text-amber-600"
                    )}>
                      <History className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="font-black text-neutral-900">{payment.applicationNumber}</p>
                      <p className="text-sm font-bold text-neutral-400">{payment.applicant}</p>
                    </div>
                  </div>
                  <div className="text-left">
                    <p className="font-black text-neutral-900 mb-1">{formatCurrency(payment.amount)}</p>
                    <Badge className={cn(
                      "px-4 py-1 rounded-full font-black border-none",
                      payment.status === 'overdue' ? "bg-red-500 text-white" : "bg-amber-500 text-white"
                    )}>
                      {payment.status === 'overdue' ? 'متأخر جداً' : 'بانتظار السداد'}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Refunds */}
        <Card className="border-none shadow-2xl rounded-[2.5rem] bg-white overflow-hidden">
          <CardHeader className="p-10 border-b border-neutral-50">
            <CardTitle className="text-2xl font-black flex items-center gap-4 text-neutral-800">
              <RefreshCw className="w-8 h-8 text-red-500" />
              سجل استرداد الرسوم
            </CardTitle>
          </CardHeader>
          <CardContent className="p-10">
            <div className="space-y-6">
              {refunds.map((refund) => (
                <div key={refund.id} className="flex items-center justify-between p-6 bg-neutral-50/30 rounded-[2rem] border border-neutral-50 group hover:bg-red-50/50 hover:border-red-100 transition-all">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-red-100 rounded-2xl flex items-center justify-center text-red-600">
                      <ArrowDownRight className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="font-black text-neutral-900">{refund.applicationNumber}</p>
                      <p className="text-sm font-bold text-neutral-400">{refund.reason}</p>
                    </div>
                  </div>
                  <div className="text-left">
                    <p className="font-black text-red-600 mb-1">-{formatCurrency(refund.amount)}</p>
                    <p className="text-[10px] text-neutral-400 font-black uppercase tracking-widest">{refund.date}</p>
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