import React, { memo } from 'react';
import { motion } from 'framer-motion';
import { 
  Plus, LayoutDashboard, Clock, CheckCircle2, 
  ArrowUpRight, FileText, ChevronLeft, ShieldCheck, 
  Award, Bell, Download, HelpCircle
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/shared/status-badge';
import { DashboardSummaryDto, ApplicationSummaryDto } from '@/types/application.types';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { FormattedDate } from '@/components/shared/FormattedDate';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ElementType;
  color: string;
  delay?: number;
}

interface ApplicantDashboardProps {
  data: DashboardSummaryDto;
  userName: string;
}

const StatCard = memo(({ title, value, icon: Icon, color, delay = 0 }: StatCardProps) => (
  <motion.div
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.4 }}
    className="h-full"
  >
    <Card className="h-full border border-neutral-200 shadow-sm bg-white hover:shadow-md hover:border-[#1a3a8f]/20 transition-all duration-300 rounded-xl group overflow-hidden">
      <CardContent className="p-3 md:p-4">
        <div className="flex items-center justify-between gap-3">
          <div className="space-y-0.5 md:space-y-1">
            <p className="text-[9px] md:text-[10px] font-black text-neutral-400 uppercase tracking-widest leading-none mb-1">{title}</p>
            <h3 className="text-xl md:text-2xl font-black text-neutral-900 tracking-tight">{value}</h3>
          </div>
          <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg flex items-center justify-center transition-transform group-hover:scale-110" style={{ backgroundColor: `${color}10`, color: color }}>
            <Icon className="w-4 h-4 md:w-5 md:h-5" />
          </div>
        </div>
      </CardContent>
    </Card>
  </motion.div>
));

StatCard.displayName = 'StatCard';

export const ApplicantDashboard = ({ data, userName }: ApplicantDashboardProps) => {
  return (
    <div className="max-w-5xl mx-auto space-y-6 md:space-y-8 font-arabic" dir="rtl">
      
      {/* Welcome Banner */}
      <section className="relative overflow-hidden rounded-xl md:rounded-2xl bg-[#0f1e4a] p-5 md:p-7 shadow-xl group/banner">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_#1a3a8f_0%,_transparent_70%)]" />
        <div className="absolute -top-24 -end-24 w-64 h-64 bg-[#D4A017] rounded-full blur-[100px] opacity-[0.03] group-hover/banner:opacity-[0.06] transition-opacity duration-700" />
        
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-5 md:gap-4">
          <div className="space-y-2 md:space-y-3 max-w-xl text-center md:text-start">
            <motion.span 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-[9px] md:text-[10px] px-2.5 md:px-3 py-1 bg-white/10 rounded-full text-white w-fit mx-auto md:mx-0 font-bold"
            >
              <FormattedDate date={new Date()} options={{ weekday: 'long', day: 'numeric', month: 'long' }} />
            </motion.span>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-lg md:text-2xl font-black text-white leading-tight tracking-tight"
            >
              مرحباً بك، <br className="hidden md:block" />
              <span className="text-[#D4A017]">{userName || 'المتقدم'}</span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-slate-300 font-bold text-xs md:text-sm opacity-90"
            >
              تابع خطوات إصدار رخصتك الإلكترونية عبر منظومة المرور الموحدة.
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
          >
            <Link href="/applications/new">
              <Button className="h-10 md:h-11 px-5 md:px-6 bg-[#D4A017] hover:bg-[#b88a14] text-white rounded-lg md:rounded-xl text-sm font-bold shadow-lg shadow-amber-900/10 hover:scale-105 active:scale-95 transition-all flex items-center gap-2">
                <Plus className="w-4 h-4 md:w-5 md:h-5" />
                ابدأ طلب جديد
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="الطلبات النشطة"
          value={data?.activeApplicationsCount || 0}
          icon={LayoutDashboard}
          color="#1a3a8f"
          delay={0.1}
        />
        <StatCard
          title="إجراءات معلقة"
          value={data?.pendingActionsCount || 0}
          icon={Clock}
          color="#D4A017"
          delay={0.2}
        />
        <StatCard
          title="طلبات منجزة"
          value={data?.stats?.totalSubmitted || 0}
          icon={CheckCircle2}
          color="#0f766e"
          delay={0.3}
        />
        <StatCard
          title="إخطارات جديدة"
          value={data?.newNotificationsCount || 0}
          icon={Bell}
          color="#7c3aed"
          delay={0.4}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Applications Table */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="border border-neutral-200 shadow-sm rounded-xl overflow-hidden bg-white">
            <CardHeader className="p-4 md:p-5 border-b border-neutral-100 flex flex-row items-center justify-between space-y-0">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 md:w-9 md:h-9 rounded-lg bg-primary-50 flex items-center justify-center">
                  <FileText className="w-4 h-4 md:w-4.5 md:h-4.5 text-[#1a3a8f]" />
                </div>
                <CardTitle className="text-base md:text-lg font-black text-neutral-900 tracking-tight">أحدث الطلبات</CardTitle>
              </div>
              <Link href="/applications">
                <Button variant="ghost" className="text-[#1a3a8f] font-black text-xs hover:bg-[#1a3a8f]/5 gap-1.5 md:gap-2 group h-8 md:h-9 px-3">
                  عرض الكل
                  <ChevronLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-start">
                  <thead>
                    <tr className="bg-neutral-50/50">
                      <th className="px-4 md:px-6 py-2.5 md:py-3.5 text-[9px] md:text-[10px] font-black text-neutral-400 uppercase tracking-widest">رقم الطلب</th>
                      <th className="px-4 md:px-6 py-2.5 md:py-3.5 text-[9px] md:text-[10px] font-black text-neutral-400 uppercase tracking-widest">الفئة</th>
                      <th className="px-4 md:px-6 py-2.5 md:py-3.5 text-[9px] md:text-[10px] font-black text-neutral-400 uppercase tracking-widest">المرحلة الحالية</th>
                      <th className="px-4 md:px-6 py-2.5 md:py-3.5 text-[9px] md:text-[10px] font-black text-neutral-400 uppercase tracking-widest text-center">الحالة</th>
                      <th className="px-4 md:px-6 py-2.5 md:py-3.5 text-[9px] md:text-[10px] font-black text-neutral-400 uppercase tracking-widest text-end">التاريخ</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100">
                    {data?.applications?.map((app: ApplicationSummaryDto) => (
                      <tr key={app.id} className="hover:bg-neutral-50/50 transition-colors group cursor-pointer border-b last:border-0 border-neutral-50">
                        <td className="px-4 md:px-6 py-3.5 md:py-4 font-black text-[#1a3a8f] text-xs md:text-sm tracking-tight group-hover:underline">
                          <Link href={`/applications/${app.id}`}>
                            {app.applicationNumber}
                          </Link>
                        </td>
                        <td className="px-4 md:px-6 py-3.5 md:py-4">
                          <span className="inline-flex items-center justify-center w-6 h-6 md:w-7 md:h-7 rounded-md bg-neutral-100 text-neutral-900 text-[9px] md:text-[10px] font-black">
                            {app.licenseCategoryCode}
                          </span>
                        </td>
                        <td className="px-4 md:px-6 py-3.5 md:py-4 text-[10px] md:text-xs font-bold text-neutral-600">
                          {app.currentStage}
                        </td>
                        <td className="px-4 md:px-6 py-3.5 md:py-4 text-center">
                          <StatusBadge status={app.status} />
                        </td>
                        <td className="px-4 md:px-6 py-3.5 md:py-4 text-end text-[9px] md:text-[10px] font-bold text-neutral-400">
                          <FormattedDate date={app.updatedAt} />
                        </td>
                      </tr>
                    ))}
                    {(!data?.applications || data.applications.length === 0) && (
                      <tr>
                        <td colSpan={5} className="px-8 py-16 text-center text-neutral-400 font-bold italic">
                          لا توجد طلبات نشطة لعرضها في الوقت الحالي
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar Cards */}
        <div className="space-y-6">
          {/* Guide Card */}
          <div className="relative group overflow-hidden rounded-xl bg-white border border-neutral-200 p-5 md:p-6 shadow-sm hover:shadow-md hover:border-[#1a3a8f]/20 transition-all duration-300">
             <div className="absolute top-0 right-0 w-24 md:w-32 h-24 md:h-32 bg-[#1a3a8f]/5 blur-2xl md:blur-3xl -mr-12 md:-mr-16 -mt-12 md:-mt-16" />
             <div className="relative z-10 space-y-4">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-emerald-50 rounded-xl flex items-center justify-center border border-emerald-100">
                  <Award className="w-5 h-5 md:w-6 md:h-6 text-emerald-600" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-base md:text-lg font-black text-neutral-900 tracking-tight leading-tight">دليل النجاح</h4>
                  <p className="text-[10px] md:text-xs text-neutral-500 font-semibold leading-relaxed">
                    استعد للاختبارات النظرية والعملية عبر الاطلاع على دليل الإرشادات المعتمد.
                  </p>
                </div>
                <Button 
                  asChild
                  className="w-full h-10 md:h-11 bg-[#1a3a8f] hover:bg-[#152d6f] text-white rounded-lg text-[10px] md:text-xs font-black transition-all gap-2 md:gap-3 shadow-lg shadow-blue-900/10"
                >
                  <a href="/docs/success-guide.html" target="_blank">
                    تحميل الدليل (PDF)
                    <Download className="w-3.5 h-3.5" />
                  </a>
                </Button>
             </div>
          </div>

          {/* Tips Card */}
          <div className="p-5 md:p-6 bg-[#D4A017]/5 border border-[#D4A017]/10 rounded-xl space-y-2 md:space-y-3">
             <div className="flex items-center gap-2 md:gap-3">
                <HelpCircle className="w-3.5 h-3.5 md:w-4 md:h-4 text-[#D4A017]" />
                <h4 className="font-black text-[#856404] text-[9px] md:text-[11px] uppercase tracking-widest text-start">معلومة سريعة</h4>
             </div>
             <p className="text-[10px] md:text-xs text-[#856404] font-bold leading-relaxed text-start">
                يمكنك التحقق من صلاحية رخصتك في أي وقت من خلال قسم "تراخيصي" في القائمة الجانبية.
             </p>
          </div>

          {/* Security Banner */}
          <div className="flex items-center justify-center gap-3 opacity-30 select-none">
             <ShieldCheck className="w-4 h-4" />
             <span className="text-[10px] font-black uppercase tracking-[0.2em]">بياناتك محمية بأنظمة تشفير سيادية</span>
          </div>
        </div>
      </div>
    </div>
  );
};
