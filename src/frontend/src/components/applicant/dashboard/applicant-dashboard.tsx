import React, { memo } from 'react';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { Plus, LayoutDashboard, Clock, CheckCircle2, AlertCircle, Award, Bell, FileText, ArrowUpRight, Download, Star, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/shared/status-badge';
import { DashboardSummaryDto } from '@/types/application.types';

import { Link } from '@/i18n/routing';
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';

interface ApplicantDashboardProps {
  data: DashboardSummaryDto;
  userName: string;
}

const StatCard = memo(({ title, value, icon: Icon, colorClass, delay = 0 }: any) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.95, y: 20 }}
    animate={{ opacity: 1, scale: 1, y: 0 }}
    transition={{ delay, duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
    className="h-full"
  >
    <Card className="h-full border border-white/10 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.3)] bg-white/5 backdrop-blur-3xl group hover:border-primary-500/30 transition-all duration-500 overflow-hidden relative rounded-[2.5rem]">
      <div className={cn("absolute -top-12 -right-12 w-48 h-48 blur-[80px] opacity-20 group-hover:opacity-40 transition-opacity rounded-full", colorClass)} />
      <CardContent className="p-8">
        <div className="flex justify-between items-start relative z-10">
          <div className={cn("p-5 rounded-3xl shadow-xl transition-transform duration-500 group-hover:scale-110", colorClass)}>
            <Icon className="w-8 h-8 text-white" />
          </div>
          <div className="text-end">
            <p className="text-[10px] font-black text-primary-500 uppercase tracking-[0.2em] mb-3 opacity-70 group-hover:opacity-100 transition-opacity">{title}</p>
            <h3 className="text-4xl font-black text-white tracking-tighter drop-shadow-sm">{value}</h3>
          </div>
        </div>
      </CardContent>
    </Card>
  </motion.div>
));

StatCard.displayName = 'StatCard';

export const ApplicantDashboard = ({ data, userName }: ApplicantDashboardProps) => {
  const [isMounted, setIsMounted] = useState(false);
  const t = useTranslations('dashboard');

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <div className="max-w-7xl mx-auto space-y-12" data-testid="dashboard-summary">
      {/* Editorial Header */}
      <header className="relative py-12 px-4 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-5xl h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-10">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
            className="max-w-2xl"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest mb-8 text-primary-400">
              <Clock className="w-3.5 h-3.5" />
              {isMounted ? new Date().toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) : '...'}
            </div>
            <h1 className="text-4xl md:text-4xl font-black text-white leading-[0.9] tracking-tighter mb-8 font-arabic drop-shadow-2xl">
              {t.rich('applicant.welcome', {
                name: userName,
                highlight: (chunks) => <span className="text-primary-500 drop-shadow-[0_0_30px_rgba(30,58,138,0.3)]">{chunks}</span>
              })}
            </h1>
            <p className="text-xl text-neutral-400 font-bold leading-relaxed font-arabic max-w-xl">
              {t('applicant.headerDescription')}
            </p>
          </motion.div>

          <Link href="/applications/new">
            <Button data-testid="new-application-btn" className="bg-primary-600 hover:bg-primary-500 text-white h-20 px-12 rounded-[2rem] shadow-[0_20px_40px_rgba(30,58,138,0.4)] transition-all hover:scale-105 active:scale-95 text-xl font-black group">
              <Plus className="me-4 w-7 h-7 group-hover:rotate-90 transition-transform" />
              {t('applicant.startNew')}
            </Button>
          </Link>
        </div>
      </header>

      {/* Grid Layout - 2/3 and 1/3 */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 px-4">
        {/* Left Column - Stats & Summary */}
        <div className="lg:col-span-8 space-y-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatCard
              title={t('applicant.activeApplications')}
              value={data.activeApplicationsCount}
              icon={LayoutDashboard}
              colorClass="bg-primary-600"
              delay={0.1}
            />
            <StatCard
              title={t('applicant.pendingActions')}
              value={data.pendingActionsCount}
              icon={Clock}
              colorClass="bg-amber-500"
              delay={0.2}
            />
            <StatCard
              title={t('applicant.totalCompleted')}
              value={data.stats.totalSubmitted}
              icon={CheckCircle2}
              colorClass="bg-emerald-500"
              delay={0.3}
            />
          </div>

          {/* Activity Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            <Card className="border border-white/10 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.5)] bg-white/5 backdrop-blur-3xl rounded-[2.5rem] overflow-hidden">
              <CardHeader className="p-10 pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-3xl font-black flex items-center gap-4 text-white uppercase tracking-tight">
                    <div className="w-2.5 h-10 bg-primary-500 rounded-full shadow-[0_0_20px_rgba(30,58,138,0.5)]" />
                    {t('applicant.recentApplications')}
                  </CardTitle>
                  <Link href="/applications" className="text-xs font-black text-primary-500 bg-primary-600/10 px-6 py-3 rounded-full border border-primary-500/20 hover:bg-primary-600 hover:text-white transition-all tracking-widest uppercase">
                    {t('applicant.viewAll')}
                  </Link>
                </div>
              </CardHeader>
              <CardContent className="p-10 pt-6">
                <div className="overflow-x-auto">
                  <table className="w-full text-start border-separate border-spacing-y-3">
                    <thead>
                      <tr>
                        <th className="pb-4 ps-4 text-[10px] font-black text-neutral-500 uppercase tracking-[0.2em] text-start">{t('applicant.table.id')}</th>
                        <th className="pb-4 text-[10px] font-black text-neutral-500 uppercase tracking-[0.2em] text-start">{t('applicant.table.category')}</th>
                        <th className="pb-4 text-[10px] font-black text-neutral-500 uppercase tracking-[0.2em] text-start">{t('applicant.table.stage')}</th>
                        <th className="pb-4 text-[10px] font-black text-neutral-500 uppercase tracking-[0.2em] text-start">{t('applicant.table.status')}</th>
                        <th className="pb-4 pe-4 text-[10px] font-black text-neutral-500 uppercase tracking-[0.2em] text-end">{t('applicant.table.update')}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.applications.map((app) => (
                        <tr
                          key={app.id}
                          className="group cursor-pointer"
                        >
                          <td className="py-5 ps-4 rounded-s-2xl bg-white/[0.03] group-hover:bg-white/[0.08] border-y border-s border-white/5 transition-colors font-black text-primary-400 tracking-tight">{app.applicationNumber}</td>
                          <td className="py-5 bg-white/[0.03] group-hover:bg-white/[0.08] border-y border-white/5 transition-colors">
                            <span className="font-black text-white/90 bg-white/10 px-3 py-1 rounded-lg text-xs border border-white/10">
                              {app.licenseCategoryCode}
                            </span>
                          </td>
                          <td className="py-5 bg-white/[0.03] group-hover:bg-white/[0.08] border-y border-white/5 transition-colors text-sm font-bold text-neutral-300">
                            {app.currentStage}
                          </td>
                          <td className="py-5 bg-white/[0.03] group-hover:bg-white/[0.08] border-y border-white/5 transition-colors">
                            <StatusBadge status={app.status} />
                          </td>
                          <td className="py-5 pe-4 rounded-e-2xl bg-white/[0.03] group-hover:bg-white/[0.08] border-y border-e border-white/5 transition-colors text-end">
                            <span className="text-xs text-neutral-500 font-bold whitespace-nowrap">
                              {isMounted ? new Date(app.updatedAt).toLocaleDateString() : '...'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Right Column - Featured Card */}
        <div className="lg:col-span-4">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="sticky top-24"
          >
            <div className="bg-neutral-950 rounded-[2.5rem] p-10 text-white relative overflow-hidden group shadow-[0_32px_64px_-16px_rgba(0,0,0,0.6)] border border-white/5 min-h-[460px] flex flex-col justify-between">
              <div className="absolute top-0 right-0 w-80 h-80 bg-primary-600/30 blur-[100px] -mr-32 -mt-32 group-hover:bg-primary-500/40 transition-colors duration-700" />
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-1/2 bg-gradient-to-t from-black to-transparent" />

              <div className="relative z-10">
                <div className="w-20 h-20 bg-white/10 backdrop-blur-2xl rounded-3xl flex items-center justify-center mb-10 border border-white/10 shadow-2xl group-hover:scale-110 transition-transform duration-500">
                  <CheckCircle2 className="w-10 h-10 text-primary-500" />
                </div>
                <h3 className="text-4xl font-black mb-6 font-arabic leading-[1.1] tracking-tighter">{t('applicant.readyForTest.title')}</h3>
                <p className="text-lg text-neutral-400 mb-10 leading-relaxed font-bold font-arabic">
                  {t('applicant.readyForTest.description')}
                </p>
              </div>

              <div className="relative z-10">
                <button className="w-full bg-primary-600 text-white font-black h-20 rounded-[1.8rem] hover:bg-primary-500 transition-all hover:scale-105 active:scale-95 px-8 text-lg flex items-center justify-between group/btn shadow-[0_20px_40px_rgba(30,58,138,0.4)]">
                  <span>{t('applicant.readyForTest.button')}</span>
                  <Download className="w-6 h-6 group-hover/btn:translate-y-1 transition-transform" />
                </button>
              </div>
            </div>

            <div className="mt-8 p-10 bg-white/5 backdrop-blur-xl rounded-[2.5rem] border border-white/5 group hover:border-primary-500/20 transition-all duration-500 shadow-2xl shadow-black/20">
              <div className="flex gap-6">
                <div className="w-16 h-16 bg-primary-600/10 rounded-[1.5rem] flex items-center justify-center shrink-0 border border-primary-500/20 group-hover:scale-110 transition-transform">
                  <Star className="w-8 h-8 text-primary-500" />
                </div>
                <div className="space-y-2">
                  <h4 className="font-black text-primary-500 text-xs uppercase tracking-[0.2em] mb-1">{t('applicant.tip.title')}</h4>
                  <p className="text-lg text-white font-black leading-[1.3] font-arabic tracking-tight">
                    {t('applicant.tip.text')}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};
