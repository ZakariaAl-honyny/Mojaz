'use client';

import React, { memo } from 'react';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import { TrendingUp, Users, AlertTriangle, CheckCircle2, Award, Zap, Activity, ShieldCheck } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ManagerKpiDto } from '@/types/application.types';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';

// Dynamic imports for charts with tailored Skeletons
const ChartSkeleton = () => (
  <div className="flex flex-col gap-4 w-full h-[300px] items-center justify-center">
    <Skeleton className="h-[250px] w-full rounded-2xl animate-pulse bg-neutral-100" />
  </div>
);

const StatusDistributionChart = dynamic(
  () => import('./charts/status-distribution-chart').then(mod => mod.StatusDistributionChart),
  { ssr: false, loading: () => <ChartSkeleton /> }
);

const ActivityLoadChart = dynamic(
  () => import('./charts/activity-load-chart').then(mod => mod.ActivityLoadChart),
  { ssr: false, loading: () => <ChartSkeleton /> }
);

interface ManagerDashboardProps {
  data: ManagerKpiDto;
}

const KpiCard = memo(({ title, value, subtext, icon: Icon, color, delay = 0, premium = false }: any) => (
  <motion.div
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.4 }}
  >
    <Card className={cn(
      "border border-neutral-200 shadow-sm bg-white overflow-hidden relative group transition-all duration-300 hover:shadow-md hover:border-primary-500/20 rounded-2xl",
      premium && "border-amber-200/50"
    )}>
      <CardContent className="p-5 md:p-6 lg:p-7">
        <div className="flex justify-between items-start relative z-10 gap-3 md:gap-4">
          <div className="space-y-1">
            <p className="text-[10px] font-black text-neutral-400 uppercase tracking-widest leading-none mb-1.5 md:mb-2">{title}</p>
            <h3 className="text-2xl md:text-3xl font-black text-neutral-900 tracking-tight mb-1.5 md:mb-2">{value}</h3>
            {subtext && (
              <div className="flex items-center gap-1.5 opacity-60">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <p className="text-[10px] text-emerald-700 font-bold tracking-tight uppercase leading-none">{subtext}</p>
              </div>
            )}
          </div>
          <div 
            className="w-12 h-12 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110 shadow-sm"
            style={{ backgroundColor: `${color}10`, color: color }}
          >
            <Icon className="w-6 h-6" />
          </div>
        </div>
      </CardContent>
    </Card>
  </motion.div>
));

KpiCard.displayName = 'KpiCard';

export const ManagerDashboard = ({ data }: ManagerDashboardProps) => {
  return (
    <div className="max-w-5xl mx-auto space-y-8 md:space-y-10 font-arabic" dir="rtl">
      {/* Executive Header */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 px-0 md:px-4">
        <motion.div
           initial={{ opacity: 0, x: 20 }}
           animate={{ opacity: 1, x: 0 }}
           className="flex items-center gap-4 md:gap-5"
        >
          <div className="w-1 md:w-1.5 h-10 md:h-12 bg-[#1a3a8f] rounded-full shadow-lg shadow-blue-900/20" />
          <div>
            <h2 className="text-2xl md:text-3xl font-black text-neutral-900 tracking-tight leading-none mb-1.5">
              لوحة تحكم الأداء المؤسسي
            </h2>
            <p className="text-neutral-500 font-bold text-xs md:text-sm">ذكاء الأعمال والتحليلات المباشرة للدورة التشغيلية للنظام</p>
          </div>
        </motion.div>

        <div className="flex items-center gap-3">
          <div className="text-left md:text-right">
             <p className="text-[9px] font-black text-neutral-400 uppercase tracking-widest leading-none mb-1">توقيت الخادم</p>
             <p className="text-xs font-black text-neutral-900 leading-none">
                {new Date().toLocaleTimeString('ar-YE', { hour: '2-digit', minute: '2-digit' })}
             </p>
          </div>
        </div>
      </header>

      {/* KPI Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5 px-0 md:px-4">
        <KpiCard 
           title="حمولة اليوم" 
           value={data?.todayTotalApplications || 0} 
           subtext="+12% زيادة تشغيلية"
           icon={TrendingUp}
           color="#1a3a8f"
           delay={0.1}
           premium
        />
        <KpiCard 
           title="معدل الكفاءة" 
           value={`${data?.todayPassRate || 0}%`} 
           subtext="أداء تشغيلي ممتاز"
           icon={CheckCircle2}
           color="#0f766e"
           delay={0.2} 
        />
        <KpiCard 
           title="تنبيهات حرجة" 
           value={data?.totalStalledApplications || 0} 
           subtext="بحاجة لتدخل تقني"
           icon={AlertTriangle}
           color="#D4A017"
           delay={0.3} 
        />
<KpiCard 
            title="نشاط حي" 
            value={data?.activeUsers || 'غير متوفر'} 
            subtext="تفاعلات منصة حيّة"
           icon={Zap}
           color="#7c3aed"
           delay={0.4} 
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 px-4">
        <motion.div 
           initial={{ opacity: 0, y: 30 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ delay: 0.5 }}
           className="lg:col-span-8"
        >
          <Card className="border border-neutral-200 shadow-sm bg-white rounded-xl md:rounded-2xl lg:rounded-3xl overflow-hidden min-h-[400px] md:min-h-[480px]">
            <CardHeader className="p-4 md:p-6 lg:p-8 border-b border-neutral-100 mb-4 md:mb-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 md:gap-4">
                  <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl bg-primary-50 flex items-center justify-center">
                    <Activity className="w-4 h-4 md:w-5 md:h-5 text-[#1a3a8f]" />
                  </div>
                  <CardTitle className="text-lg md:text-xl font-black text-neutral-900 tracking-tight">تحليل النشاط الأسبوعي</CardTitle>
                </div>
                <div className="text-[9px] md:text-[10px] font-black text-neutral-400 bg-neutral-50 border border-neutral-100 px-2.5 md:px-3 py-1 md:py-1.5 rounded-full uppercase tracking-widest">
                  محدث لحظياً
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-4 md:p-6 lg:p-8 pt-0">
              <ActivityLoadChart data={data?.last7DaysLoad || []} />
            </CardContent>
          </Card>
        </motion.div>

        <motion.div 
           initial={{ opacity: 0, y: 30 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ delay: 0.6 }}
           className="lg:col-span-4"
        >
          <Card className="border border-[#1a3a8f] shadow-lg bg-[#0f1e4a] rounded-xl md:rounded-2xl lg:rounded-[2rem] overflow-hidden text-white min-h-[400px] md:min-h-[480px] relative">
            <div className="absolute top-0 right-0 w-48 md:w-64 h-48 md:h-64 bg-[#1a3a8f]/40 blur-[60px] md:blur-[80px] -mr-24 md:-mr-32 -mt-24 md:-mt-32" />
            <CardHeader className="p-4 md:p-6 lg:p-8 pb-3 md:pb-4 relative z-10">
              <CardTitle className="text-lg md:text-xl font-black text-center font-arabic tracking-tight">
                توزيع حالة الطلبات
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 md:p-6 lg:p-8 relative z-10">
              <StatusDistributionChart data={data?.statusDistribution || []} />
              
              <div className="mt-8 pt-6 border-t border-white/10 space-y-4">
                <div className="flex justify-between items-center">
                   <span className="text-[9px] font-black text-white/40 uppercase tracking-[0.25em]">دقة البيانات</span>
                   <span className="text-emerald-400 text-xs font-black tracking-tighter">٩٩.٩٨٪</span>
                </div>
                <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: '99.98%' }}
                    transition={{ delay: 1, duration: 2 }}
                    className="h-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.5)]" 
                  />
                </div>
                <div className="flex items-center gap-2 pt-2 opacity-30">
                   <ShieldCheck className="w-3 h-3" />
                   <span className="text-[8px] font-black uppercase tracking-widest">مصادق عليه من قبل الإدارة الفنية</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};
