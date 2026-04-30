'use client';

import React from 'react';
import { ManagerDashboard } from '@/components/employee/dashboard/manager-dashboard';
import { EmployeeApplicationQueue } from '@/components/employee/queue/employee-application-queue';
import { DashboardSurface } from '@/components/layout/dashboard-surface';
import { ManagerKpiDto } from '@/types/application.types';
import { useAuth } from '@/hooks/useAuth';
import { isManagerRole, isAdminRole } from '@/lib/enums';

interface EmployeeDashboardPageProps {
  data?: ManagerKpiDto | null;
}

export default function EmployeeDashboardPage({ data }: EmployeeDashboardPageProps) {
  const { user } = useAuth();
   
  // Only Managers and Admins see the executive dashboard
  const isManager = isManagerRole(user?.role) || isAdminRole(user?.role);

  return (
    <DashboardSurface className="py-6 sm:py-10">
      <div className="max-w-5xl mx-auto space-y-8 md:space-y-12 px-4">
        {isManager && data && (
          <section className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            <ManagerDashboard data={data} />
          </section>
        )}

        <section className="animate-in fade-in slide-in-from-bottom-6 duration-1000 delay-200">
          <EmployeeApplicationQueue />
        </section>
      </div>
    </DashboardSurface>
  );
}
