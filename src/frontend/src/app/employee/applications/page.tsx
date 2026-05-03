'use client';

import { EmployeeApplicationQueue } from '@/components/employee/queue/employee-application-queue';
import { DashboardSurface } from '@/components/layout/dashboard-surface';

export default function EmployeeApplicationsListPage() {
  return (
    <DashboardSurface className="py-6 sm:py-10">
      <div className="max-w-6xl mx-auto space-y-8 md:space-y-12 px-4">
        <section className="animate-in fade-in slide-in-from-bottom-4 duration-700">
          <header className="mb-10 text-center md:text-start">
             <h1 className="text-4xl font-black text-[#1a3a8f] tracking-tighter mb-2">إدارة كافة الطلبات</h1>
             <p className="text-neutral-500 font-bold text-sm uppercase tracking-widest italic opacity-70">استعراض ومتابعة جميع المعاملات في النظام</p>
          </header>
          
          <EmployeeApplicationQueue />
        </section>
      </div>
    </DashboardSurface>
  );
}
