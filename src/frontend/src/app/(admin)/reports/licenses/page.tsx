'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  FileKey2,
  TrendingUp,
  TrendingDown,
  Calendar,
  Download,
  BarChart3,
  PieChart,
  RefreshCw,
  Car,
  Users,
  AlertTriangle,
  Award,
  ShieldCheck,
  Clock3,
  UserCheck
} from "lucide-react";
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { reportsService, ReportingFilter } from '@/services/reports.service';
import licenseService from '@/services/license.service';
import { useQuery } from '@tanstack/react-query';

interface LicenseStats {
  totalIssued: number;
  active: number;
  expired: number;
  suspended: number;
  expiredSoon: number;
  renewalRate: number;
}

interface ClassBreakdown {
  class: string;
  count: number;
  percentage: number;
}

interface MonthlyData {
  month: string;
  issued: number;
  renewed: number;
}

export default function LicenseReportsPage() {
  const apiFilter: ReportingFilter = {};

  // Fetch real data from API
  const { data: summaryData, isLoading: summaryLoading } = useQuery({
    queryKey: ['reportLicenseSummary'],
    queryFn: () => reportsService.getSummary(apiFilter),
    enabled: true,
  });

  // Transform API data or use defaults
  const stats = {
    totalIssued: summaryData?.data?.totalLicenses || 124500,
    active: summaryData?.data?.activeLicenses || 89200,
    expired: summaryData?.data?.expiredLicenses || 31200,
    suspended: summaryData?.data?.suspendedLicenses || 4100,
    expiredSoon: summaryData?.data?.expiringSoon || 5200,
    renewalRate: summaryData?.data?.renewalRate || 78.5
  };

  // Mock static data for breakdown and trends (would require additional API endpoints)
  const classBreakdown = [
    { class: 'خصوصي', count: 52000, percentage: 41.8 },
    { class: 'دراجة نارية', count: 31000, percentage: 24.9 },
    { class: 'نقل خفيف', count: 21000, percentage: 16.9 },
    { class: 'نقل ثقيل', count: 10500, percentage: 8.4 },
    { class: 'حافلة', count: 6500, percentage: 5.2 },
    { class: 'إنشائية', count: 3500, percentage: 2.8 }
  ];

  const monthlyData = [
    { month: 'يناير', issued: 3200, renewed: 2800 },
    { month: 'فبراير', issued: 2900, renewed: 3100 },
    { month: 'مارس', issued: 3500, renewed: 2900 },
    { month: 'أبريل', issued: 3100, renewed: 3300 },
    { month: 'مايو', issued: 2800, renewed: 2700 },
    { month: 'يونيو', issued: 3400, renewed: 3000 }
  ];

  const getMaxCount = () => Math.max(...classBreakdown.map(c => c.count));

  return (
    <div className="max-w-7xl mx-auto py-10 px-4 space-y-10 font-arabic" dir="rtl">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 border-b border-neutral-100 pb-10">
        <div className="space-y-2">
          <div className="flex items-center gap-4">
             <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-[#1a3a8f] shadow-sm">
               <Award className="w-6 h-6" />
             </div>
             <div>
               <h1 className="text-4xl font-black text-neutral-900 tracking-tight">تقارير التراخيص المعتمدة</h1>
               <p className="text-lg text-neutral-400 font-bold">إحصائيات الرخص النشطة، المنتهية، وحركة التجديد الدورية</p>
             </div>
          </div>
        </div>
        <Button className="h-10 md:h-12 px-6 md:px-8 rounded-md bg-[#1a3a8f] hover:bg-black font-black text-sm md:text-base gap-2 md:gap-3 transition-all">
          <Download className="w-4 h-4 md:w-5 md:h-5" />
          تصدير تقرير التراخيص
        </Button>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-6">
        {[
          { icon: FileKey2, value: stats.totalIssued, label: 'إجمالي الرخص', color: 'text-neutral-900', bg: 'bg-white' },
          { icon: ShieldCheck, value: stats.active, label: 'رخص نشطة', color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { icon: AlertTriangle, value: stats.expired, label: 'رخص منتهية', color: 'text-red-600', bg: 'bg-red-50' },
          { icon: Clock3, value: stats.suspended, label: 'رخص موقوفة', color: 'text-amber-600', bg: 'bg-amber-50' },
          { icon: TrendingUp, value: stats.expiredSoon, label: 'توشك على الانتهاء', color: 'text-orange-600', bg: 'bg-orange-50' },
          { icon: RefreshCw, value: `${stats.renewalRate}%`, label: 'معدل التجديد', color: 'text-[#1a3a8f]', bg: 'bg-blue-50' },
        ].map((item, idx) => (
          <Card key={idx} className={cn("border-none shadow-xl rounded-[2rem] overflow-hidden", item.bg)}>
            <CardContent className="p-6 text-center space-y-2">
              <item.icon className={cn("w-6 h-6 mx-auto mb-2 opacity-80", item.color)} />
              <p className={cn("text-2xl font-black leading-none", item.color)}>{item.value.toLocaleString()}</p>
              <p className="text-[10px] text-neutral-400 font-black uppercase tracking-widest">{item.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* By Class Breakdown */}
        <Card className="border-none shadow-2xl rounded-[2.5rem] bg-white overflow-hidden">
          <CardHeader className="p-10 border-b border-neutral-50 bg-white">
            <CardTitle className="text-2xl font-black flex items-center gap-4 text-neutral-800">
              <PieChart className="w-8 h-8 text-[#1a3a8f]" />
              توزيع الرخص حسب الفئة
            </CardTitle>
          </CardHeader>
          <CardContent className="p-10">
            <div className="space-y-8">
              {classBreakdown.map((item, idx) => (
                <div key={idx} className="group">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-base font-black text-neutral-700">فئة {item.class}</span>
                    <span className="text-sm font-black text-[#1a3a8f]">{item.count.toLocaleString()} رخصة ({item.percentage}%)</span>
                  </div>
                  <div className="w-full bg-neutral-50 rounded-full h-4 overflow-hidden border border-neutral-100 p-0.5">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(item.count / getMaxCount()) * 100}%` }}
                      transition={{ duration: 1, delay: idx * 0.1 }}
                      className="bg-[#1a3a8f] h-full rounded-full shadow-inner"
                    ></motion.div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Monthly Trends */}
        <Card className="border-none shadow-2xl rounded-[2.5rem] bg-white overflow-hidden">
          <CardHeader className="p-10 border-b border-neutral-50 bg-white">
            <CardTitle className="text-2xl font-black flex items-center gap-4 text-neutral-800">
              <BarChart3 className="w-8 h-8 text-amber-500" />
              حركة الإصدار والتجديد (2025)
            </CardTitle>
          </CardHeader>
          <CardContent className="p-10">
            <div className="space-y-8">
              {monthlyData.map((item, index) => (
                <div key={index} className="flex items-center gap-6 group">
                  <span className="w-16 text-sm font-black text-neutral-400 group-hover:text-[#1a3a8f] transition-colors">{item.month}</span>
                  <div className="flex-1 space-y-3">
                    <div className="flex items-center gap-4">
                      <div className="w-12 text-[10px] font-black text-neutral-400 uppercase tracking-widest">إصدار</div>
                      <div className="flex-1 bg-neutral-50 rounded-full h-2 overflow-hidden border border-neutral-100">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${(item.issued / 4000) * 100}%` }}
                          className="bg-[#1a3a8f] h-full rounded-full"
                        ></motion.div>
                      </div>
                      <span className="text-xs font-black text-neutral-700 w-12 text-left">{item.issued}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="w-12 text-[10px] font-black text-neutral-400 uppercase tracking-widest">تجديد</div>
                      <div className="flex-1 bg-neutral-50 rounded-full h-2 overflow-hidden border border-neutral-100">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${(item.renewed / 4000) * 100}%` }}
                          className="bg-emerald-500 h-full rounded-full"
                        ></motion.div>
                      </div>
                      <span className="text-xs font-black text-neutral-700 w-12 text-left">{item.renewed}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-8 flex justify-center gap-8 border-t border-neutral-50 pt-8">
               <div className="flex items-center gap-2">
                 <div className="w-3 h-3 bg-[#1a3a8f] rounded-full"></div>
                 <span className="text-xs font-black text-neutral-500">رخص حديثة</span>
               </div>
               <div className="flex items-center gap-2">
                 <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
                 <span className="text-xs font-black text-neutral-500">رخص مجددة</span>
               </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Expiring Soon Table */}
      <Card className="border-none shadow-2xl rounded-[2.5rem] bg-white overflow-hidden">
        <CardHeader className="p-10 border-b border-neutral-50">
          <CardTitle className="text-2xl font-black flex items-center gap-4 text-neutral-800">
            <AlertTriangle className="w-8 h-8 text-orange-500" />
            تراخيص تشارف على الانتهاء
          </CardTitle>
          <CardDescription className="font-bold text-neutral-400 mt-1">المواجهة بانتهاء الصلاحية خلال 60 يوماً القادمة</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-right">
              <thead className="bg-neutral-50/50 border-b border-neutral-100">
                <tr>
                  <th className="px-8 py-6 text-sm font-black text-neutral-400 uppercase tracking-widest">رقم الرخصة</th>
                  <th className="px-8 py-6 text-sm font-black text-neutral-400 uppercase tracking-widest">حامل الرخصة</th>
                  <th className="px-8 py-6 text-sm font-black text-neutral-400 uppercase tracking-widest">الفئة</th>
                  <th className="px-8 py-6 text-sm font-black text-neutral-400 uppercase tracking-widest">تاريخ الانتهاء</th>
                  <th className="px-8 py-6 text-sm font-black text-neutral-400 uppercase tracking-widest">المهلة المتبقية</th>
                  <th className="px-8 py-6 text-sm font-black text-neutral-400 uppercase tracking-widest text-left">التنبيه</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-50">
                {[
                  { number: 'MOJ-2023-12345678', holder: 'أحمد فؤاد السلمي', category: 'خصوصي', expiry: '2025-02-15', days: 24 },
                  { number: 'MOJ-2023-87654321', holder: 'سعيد خالد ناصر', category: 'دراجة نارية', expiry: '2025-02-20', days: 29 },
                  { number: 'MOJ-2023-11223344', holder: 'عبدالله عمر محسن', category: 'نقل ثقيل', expiry: '2025-02-28', days: 37 },
                  { number: 'MOJ-2023-99887766', holder: 'فاطمة علي ناصر', category: 'خصوصي', expiry: '2025-03-05', days: 42 },
                ].map((item, index) => (
                  <tr key={index} className="hover:bg-orange-50/30 transition-colors group">
                    <td className="px-8 py-6 text-neutral-900 font-black">{item.number}</td>
                    <td className="px-8 py-6 flex items-center gap-3">
                       <div className="w-10 h-10 bg-neutral-100 rounded-xl flex items-center justify-center text-[#1a3a8f] font-black">{item.holder.charAt(0)}</div>
                       <span className="text-neutral-700 font-bold">{item.holder}</span>
                    </td>
                    <td className="px-8 py-6">
                      <Badge variant="outline" className="border-blue-100 text-blue-600 bg-blue-50 px-4 py-1 rounded-lg font-bold">
                        {item.category}
                      </Badge>
                    </td>
                    <td className="px-8 py-6">
                       <span className="text-neutral-500 font-black text-sm">{item.expiry}</span>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-1.5 bg-neutral-100 rounded-full overflow-hidden">
                          <div className="h-full bg-orange-500" style={{ width: `${(item.days/60)*100}%` }}></div>
                        </div>
                        <span className="text-orange-600 font-black text-sm">{item.days} يوم</span>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-left">
                       <Button variant="ghost" size="sm" className="rounded-xl font-bold text-orange-600 opacity-0 group-hover:opacity-100 transition-opacity">
                         إرسال إشعار
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
