'use client';

import { EmployeeApplicationQueue } from '@/components/employee/queue/employee-application-queue';
import { DashboardSurface } from '@/components/layout/dashboard-surface';
import { ShieldCheck } from 'lucide-react';

export default function SecurityQueuePage() {
  return (
    <DashboardSurface className="py-6 sm:py-10">
      <div className="max-w-6xl mx-auto space-y-8 md:space-y-12 px-4">
        <section className="animate-in fade-in slide-in-from-bottom-4 duration-700">
          <header className="mb-10 text-center md:text-start flex flex-col md:flex-row md:items-center gap-4">
             <div className="w-16 h-16 rounded-2xl bg-rose-600 flex items-center justify-center text-white shadow-xl shadow-rose-900/20">
                <ShieldCheck className="w-8 h-8" />
             </div>
             <div>
                <h1 className="text-4xl font-black text-neutral-900 tracking-tighter mb-1">طابور المراجعة الأمنية</h1>
                <p className="text-neutral-500 font-bold text-sm uppercase tracking-widest italic opacity-70">التحقق من السوابق والموافقات الأمنية للمتقدمين</p>
             </div>
          </header>
          
          <EmployeeApplicationQueue />
        </section>
      </div>
    </DashboardSurface>
  );
}
