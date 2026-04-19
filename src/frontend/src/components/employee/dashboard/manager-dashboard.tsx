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
    initial={{ opacity: 0, scale: 0.9, y: 30 }}
    animate={{ opacity: 1, scale: 1, y: 0 }}
    transition={{ delay, duration: 0.7, ease: [0.23, 1, 0.32, 1] }}
  >
    <Card className={cn(
      "border border-white/10 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.4)] bg-white/5 backdrop-blur-3xl overflow-hidden relative group transition-all duration-700 rounded-[2.5rem]",
      premium && "ring-1 ring-primary-500/30"
    )}>
      <div className={cn(
        "absolute -right-12 -top-12 w-48 h-48 blur-[100px] opacity-10 group-hover:opacity-30 transition-opacity rounded-full",
        colorClass
      )} />
      
      <CardContent className="p-8">
        <div className="flex justify-between items-start relative z-10">
          <div className={cn(
            "p-5 rounded-3xl transition-all duration-500 group-hover:scale-110 shadow-2xl border border-white/10",
            colorClass
          )}>
            <Icon className="w-8 h-8 text-white shadow-[0_0_15px_rgba(255,255,255,0.4)]" />
          </div>
          <div className="text-end">
            <p className="text-[10px] font-black text-neutral-500 uppercase tracking-[0.25em] mb-4 group-hover:text-primary-400 transition-colors">{title}</p>
            <h3 className="text-4xl font-black text-white tracking-tighter mb-3 drop-shadow-lg">{value}</h3>
            {subtext && (
              <div className="flex items-center justify-end gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_#10B981]" />
                <p className="text-[11px] text-emerald-400 font-black tracking-tight">{subtext}</p>
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
  const t = useTranslations('dashboard');

  return (
    <div className="max-w-7xl mx-auto space-y-12">
      {/* Executive Header */}
      <header className="px-4 py-8 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="flex items-center gap-8"
        >
          <div className="w-[4px] h-20 bg-primary-600 rounded-full shadow-[0_0_30px_px_rgba(30,58,138,0.6)]" />
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-600/10 border border-primary-600/20 text-[10px] font-black uppercase tracking-[0.2em] mb-3 text-primary-400">
               {t('manager.intelligenceReport')}
            </div>
            <h2 className="text-4xl font-black text-white tracking-tighter font-arabic leading-none mb-2">
              {t('manager.systemOverview')}
            </h2>
            <p className="text-neutral-500 font-bold text-lg">{t('manager.operationalInsights')}</p>
          </div>
        </motion.div>
      </header>

      {/* KPI Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 px-4">
        <KpiCard 
          title={t('manager.kpis.todayLoad')} 
          value={data.todayTotalApplications} 
          subtext={t('manager.kpis.todayLoadSubtext')}
          icon={TrendingUp}
          colorClass="bg-primary-600"
          delay={0.1}
          premium
        />
        <KpiCard 
          title={t('manager.kpis.passRate')} 
          value={`${data.todayPassRate}%`} 
          subtext={t('manager.kpis.passRateSubtext')}
          icon={CheckCircle2}
          colorClass="bg-emerald-500"
          delay={0.2} 
        />
        <KpiCard 
          title={t('manager.kpis.stalledApplications')} 
          value={data.totalStalledApplications} 
          subtext={t('manager.kpis.stalledSubtext')}
          icon={AlertTriangle}
          colorClass="bg-amber-500"
          delay={0.3} 
        />
        <KpiCard 
          title={t('manager.kpis.activityPoints')} 
          value="4.8k" 
          subtext={t('manager.kpis.activitySubtext')}
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
          transition={{ delay: 0.5, duration: 0.8 }}
          className="lg:col-span-8"
        >
          <Card className="border border-white/10 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.5)] bg-white/5 backdrop-blur-3xl rounded-[2.5rem] overflow-hidden min-h-[520px] group">
            <CardHeader className="p-12 pb-0">
              <div className="flex items-center justify-between">
                <CardTitle className="text-3xl font-black flex items-center gap-5 text-white uppercase tracking-tight">
                  <div className="p-3 rounded-2xl bg-primary-600/20 text-primary-400 border border-primary-500/20 shadow-xl group-hover:scale-110 transition-transform">
                    <TrendingUp className="w-7 h-7" />
                  </div>
                  {t('manager.charts.weeklyAnalysis')}
                </CardTitle>
                <div className="flex items-center gap-3 text-[10px] font-black text-primary-400 bg-primary-600/10 px-6 py-3 rounded-full border border-primary-500/20">
                  <div className="w-2.5 h-2.5 rounded-full bg-primary-500 animate-pulse" />
                  {t('manager.charts.liveData')}
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-12 pt-16">
              <ActivityLoadChart data={data.last7DaysLoad} />
            </CardContent>
          </Card>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="lg:col-span-4"
        >
          <Card className="border border-white/10 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.6)] bg-neutral-950 rounded-[2.5rem] overflow-hidden text-white min-h-[520px] group relative">
            <div className="absolute top-0 right-0 w-80 h-80 bg-primary-600/20 blur-[100px] -mr-32 -mt-32 transition-all duration-1000 group-hover:bg-primary-500/30" />
            <CardHeader className="p-12 pb-0">
              <CardTitle className="text-2xl font-black text-center font-arabic tracking-tight text-white uppercase">
                {t('manager.charts.statusDistribution')}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-12 relative z-10">
              <StatusDistributionChart data={data.statusDistribution} />
              <div className="mt-12 pt-8 border-t border-white/5 space-y-4">
                <div className="flex justify-between items-center px-1">
                  <span className="text-[10px] font-black text-neutral-500 uppercase tracking-[0.2em]">{t('manager.charts.dataReliability')}</span>
                  <span className="text-emerald-400 font-black text-xs">99.9%</span>
                </div>
                <div className="w-full bg-white/5 h-2.5 rounded-full overflow-hidden border border-white/5">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: '99.9%' }}
                    transition={{ delay: 1, duration: 2.5, ease: "circOut" }}
                    className="h-full bg-gradient-to-r from-emerald-600 to-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.4)]" 
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
