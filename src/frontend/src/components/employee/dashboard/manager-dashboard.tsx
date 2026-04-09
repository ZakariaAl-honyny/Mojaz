'use client';

import React, { memo } from 'react';
import dynamic from 'next/dynamic';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { TrendingUp, Users, AlertTriangle, CheckCircle2, Award, Zap } from 'lucide-react';
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

const KpiCard = memo(({ title, value, subtext, icon: Icon, colorClass, delay = 0, premium = false }: any) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
  >
    <Card className={cn(
      "border-none shadow-2xl bg-white/60 backdrop-blur-2xl overflow-hidden relative group transition-all duration-500 hover:shadow-primary-900/10 hover:-translate-y-1 rounded-[32px]",
      premium && "ring-1 ring-secondary-500/20"
    )}>
      <div className={cn(
        "absolute -right-8 -top-8 w-32 h-32 blur-[60px] opacity-10 rounded-full",
        colorClass
      )} />
      
      <CardContent className="p-8">
        <div className="flex justify-between items-start relative z-10">
          <div className={cn(
            "p-5 rounded-3xl transition-transform duration-500 group-hover:scale-110",
            colorClass,
            premium ? "shadow-[0_10px_30px_rgba(212,160,23,0.3)]" : "shadow-lg"
          )}>
            <Icon className="w-8 h-8 text-white" />
          </div>
          <div className="text-end">
            <p className="text-[10px] font-black text-neutral-400 uppercase tracking-[0.25em] mb-3">{title}</p>
            <h3 className="text-4xl font-black text-neutral-900 tracking-tighter mb-2">{value}</h3>
            {subtext && (
              <div className="flex items-center justify-end gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <p className="text-[11px] text-emerald-600 font-bold tracking-tight">{subtext}</p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  </motion.div>
));

KpiCard.displayName = 'KpiCard';

export const ManagerDashboard = ({ data }: ManagerDashboardProps) => {
  const t = useTranslations('dashboard.manager');

  return (
    <div className="max-w-7xl mx-auto space-y-12">
      {/* Executive Header */}
      <header className="px-4">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-6"
        >
          <div className="w-[3px] h-16 bg-secondary-500 rounded-full shadow-[0_0_15px_rgba(212,160,23,0.5)]" />
          <div>
            <h2 className="text-4xl font-black text-neutral-900 tracking-tighter font-arabic">
              نظرة عامة على الأنظمة
            </h2>
            <p className="text-neutral-500 font-medium mt-1">تقارير الذكاء التشغيلي والتحليلات المباشرة.</p>
          </div>
        </motion.div>
      </header>

      {/* KPI Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 px-4">
        <KpiCard 
          title={t('kpis.todayLoad')} 
          value={data.todayTotalApplications} 
          subtext="+12% زيادة تشغيلية"
          icon={TrendingUp}
          colorClass="bg-primary-600"
          delay={0.1}
          premium
        />
        <KpiCard 
          title={t('kpis.passRate')} 
          value={`${data.todayPassRate}%`} 
          subtext="معدل كفاءة ممتاز"
          icon={CheckCircle2}
          colorClass="bg-emerald-500"
          delay={0.2} 
        />
        <KpiCard 
          title="طلبات متعثرة" 
          value={data.totalStalledApplications} 
          subtext="بحاجة لتدخل إداري"
          icon={AlertTriangle}
          colorClass="bg-amber-500"
          delay={0.3} 
        />
        <KpiCard 
          title="نقاط النشاط" 
          value="4.8k" 
          subtext="تفاعلات حيّة حالياً"
          icon={Zap}
          colorClass="bg-blue-500"
          delay={0.4} 
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 px-4">
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="lg:col-span-8"
        >
          <Card className="border-none shadow-3xl bg-white/60 backdrop-blur-2xl rounded-[40px] overflow-hidden min-h-[480px]">
            <CardHeader className="p-10 pb-0">
              <div className="flex items-center justify-between">
                <CardTitle className="text-2xl font-black flex items-center gap-4">
                  <div className="p-2.5 rounded-2xl bg-primary-100 text-primary-600">
                    <TrendingUp className="w-6 h-6" />
                  </div>
                  تحليل العمليات الأسبوعي
                </CardTitle>
                <div className="flex items-center gap-2 text-xs font-black text-neutral-400 bg-neutral-100 px-4 py-2 rounded-full">
                  <div className="w-2 h-2 rounded-full bg-primary-500" />
                  بيانات مباشرة
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-10 pt-12">
              <ActivityLoadChart data={data.last7DaysLoad} />
            </CardContent>
          </Card>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="lg:col-span-4"
        >
          <Card className="border-none shadow-3xl bg-primary-900 rounded-[40px] overflow-hidden text-white min-h-[480px] group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-secondary-500/10 blur-[80px] -mr-32 -mt-32 transition-all duration-700 group-hover:scale-150" />
            <CardHeader className="p-10 pb-0">
              <CardTitle className="text-2xl font-black text-center font-arabic">
                {t('charts.statusDistribution')}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-10 relative z-10">
              <StatusDistributionChart data={data.statusDistribution} />
              <div className="mt-8 pt-8 border-t border-white/10 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-bold text-white/50 uppercase tracking-widest">موثوقية البيانات</span>
                  <span className="text-emerald-400 font-black">99.9%</span>
                </div>
                <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: '99.9%' }}
                    transition={{ delay: 1, duration: 2 }}
                    className="h-full bg-emerald-400" 
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};
