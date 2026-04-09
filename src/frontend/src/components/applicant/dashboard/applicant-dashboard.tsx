import React, { memo } from 'react';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { Plus, LayoutDashboard, Clock, CheckCircle2, AlertCircle, Award, Bell, FileText, ArrowUpRight, Download, Star, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/shared/status-badge';
import { DashboardSummaryDto } from '@/types/application.types';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface ApplicantDashboardProps {
  data: DashboardSummaryDto;
  userName: string;
}

const StatCard = memo(({ title, value, icon: Icon, colorClass, delay = 0 }: any) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ delay, duration: 0.5, ease: "circOut" }}
    className="h-full"
  >
    <Card className="h-full border-none shadow-xl bg-white/40 backdrop-blur-xl group hover:shadow-2xl transition-all duration-500 overflow-hidden relative rounded-[24px]">
      <div className={cn("absolute top-0 right-0 w-32 h-32 blur-3xl opacity-10 rounded-full -mr-16 -mt-16", colorClass)} />
      <CardContent className="p-8">
        <div className="flex justify-between items-start relative z-10">
          <div className={`p-4 rounded-2xl ${colorClass} shadow-lg shadow-black/5`}>
            <Icon className="w-8 h-8 text-white" />
          </div>
          <div className="text-end">
            <p className="text-xs font-black text-neutral-500 uppercase tracking-[0.2em] mb-2">{title}</p>
            <h3 className="text-4xl font-black text-neutral-900 tracking-tighter">{value}</h3>
          </div>
        </div>
      </CardContent>
    </Card>
  </motion.div>
));

StatCard.displayName = 'StatCard';

export const ApplicantDashboard = ({ data, userName }: ApplicantDashboardProps) => {
  const t = useTranslations('dashboard.applicant');

  return (
    <div className="max-w-7xl mx-auto space-y-12">
      {/* Editorial Header */}
      <header className="relative py-10 px-4">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl"
          >
            <span className="inline-block px-3 py-1 rounded-full bg-primary-100 text-primary-700 text-[10px] font-black uppercase tracking-widest mb-6">
              {new Date().toLocaleDateString('ar-SA', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </span>
            <h1 className="text-5xl md:text-7xl font-black text-neutral-900 leading-[1.1] tracking-tighter mb-6 font-arabic">
              {t.rich('welcome', { 
                name: userName,
                highlight: (chunks) => <span className="text-primary-600">{chunks}</span>
              })}
            </h1>
            <p className="text-xl text-neutral-500 font-medium leading-relaxed font-arabic">
              تتبع حالة طلباتك واحصل على رخصتك بكل سهولة ويسر عبر منصة مُجاز الرقمية.
            </p>
          </motion.div>

          <Link href="/applications/new">
            <Button className="bg-primary-600 hover:bg-primary-700 text-white h-16 px-10 rounded-[20px] shadow-2xl shadow-primary-900/40 transition-all hover:scale-105 active:scale-95 text-lg font-black">
              <Plus className="me-3 w-6 h-6" />
              {t('startNew')}
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
              title={t('activeApplications')} 
              value={data.activeApplicationsCount} 
              icon={LayoutDashboard}
              colorClass="bg-primary-600"
              delay={0.1}
            />
            <StatCard 
              title={t('pendingActions')} 
              value={data.pendingActionsCount} 
              icon={Clock}
              colorClass="bg-amber-500"
              delay={0.2} 
            />
            <StatCard 
              title="إجمالي المنجز" 
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
            transition={{ delay: 0.4 }}
          >
            <Card className="border-none shadow-2xl bg-white/60 backdrop-blur-2xl rounded-[32px] overflow-hidden">
              <CardHeader className="p-8 pb-0">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-2xl font-black flex items-center gap-3">
                    <div className="w-2 h-8 bg-primary-600 rounded-full" />
                    {t('recentApplications')}
                  </CardTitle>
                  <Link href="/applications" className="text-sm text-primary-600 font-black hover:underline tracking-tight">
                    عرض الكل
                  </Link>
                </div>
              </CardHeader>
              <CardContent className="p-8 pt-6">
                <div className="overflow-x-auto">
                  <table className="w-full text-start">
                    <thead>
                      <tr className="border-b border-neutral-100">
                        <th className="pb-4 text-[10px] font-black text-neutral-400 uppercase tracking-[0.2em] text-start">رقم الطلب</th>
                        <th className="pb-4 text-[10px] font-black text-neutral-400 uppercase tracking-[0.2em] text-start">الفئة</th>
                        <th className="pb-4 text-[10px] font-black text-neutral-400 uppercase tracking-[0.2em] text-start">المرحلة</th>
                        <th className="pb-4 text-[10px] font-black text-neutral-400 uppercase tracking-[0.2em] text-start">الحالة</th>
                        <th className="pb-4 text-[10px] font-black text-neutral-400 uppercase tracking-[0.2em] text-end">التحديث</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-50">
                      {data.applications.map((app) => (
                        <tr 
                          key={app.id} 
                          className="hover:bg-white/50 transition-colors group cursor-pointer"
                        >
                          <td className="py-5 font-black text-primary-700 tracking-tight">{app.applicationNumber}</td>
                          <td className="py-5">
                            <span className="font-black text-neutral-600 bg-neutral-100 px-3 py-1 rounded-lg text-xs">
                              {app.licenseCategoryCode}
                            </span>
                          </td>
                          <td className="py-5 text-sm font-bold text-neutral-600">
                            {app.currentStage}
                          </td>
                          <td className="py-5">
                            <StatusBadge status={app.status} />
                          </td>
                          <td className="py-5 text-end">
                            <span className="text-xs text-neutral-400 font-bold">
                              {new Date(app.updatedAt).toLocaleDateString('ar-SA')}
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
            <div className="bg-primary-900 rounded-[40px] p-8 text-white relative overflow-hidden group shadow-3xl shadow-primary-900/30">
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500/20 blur-[80px] -mr-32 -mt-32" />
              <div className="relative z-10">
                <div className="w-16 h-16 bg-white/10 backdrop-blur-lg rounded-2xl flex items-center justify-center mb-8 border border-white/10">
                  <CheckCircle2 className="w-8 h-8 text-primary-400" />
                </div>
                <h3 className="text-3xl font-black mb-4 font-arabic leading-tight tracking-tight">جاهز للاختبار؟</h3>
                <p className="text-primary-100/70 mb-8 leading-relaxed font-medium">
                  نحن هنا لتمكينك. اطلع على دليل الاختبارات النظرية والعملية لضمان نجاحك من المرة الأولى.
                </p>
                <button className="w-full bg-white text-primary-900 font-black h-16 rounded-2xl hover:bg-primary-50 transition-all hover:scale-105 active:scale-95 px-6 text-sm flex items-center justify-between group/btn">
                  <span>تحميل الدليل الإرشادي</span>
                  <Plus className="w-5 h-5 group-hover/btn:rotate-90 transition-transform" />
                </button>
              </div>
            </div>
            
            <div className="mt-8 p-8 bg-amber-50 rounded-[32px] border border-amber-100 group hover:border-amber-200 transition-colors">
              <div className="flex gap-4">
                <div className="w-14 h-14 bg-amber-100 rounded-2xl flex items-center justify-center shrink-0 shadow-sm border border-amber-200">
                  <Clock className="w-7 h-7 text-amber-600" />
                </div>
                <div>
                  <h4 className="font-black text-amber-900 text-lg mb-1 tracking-tight">نصيحة اليوم</h4>
                  <p className="text-sm text-amber-700/70 font-bold leading-relaxed">
                    تأكد من إحضار الهوية الوطنية الأصلية عند موعد فحص النظر لضمان سلاسة الإجراءات.
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
