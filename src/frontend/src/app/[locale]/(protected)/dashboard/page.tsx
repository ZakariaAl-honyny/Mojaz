'use client';

import React, { Suspense } from 'react';
import { useAuth } from '@/hooks/useAuth';
import ApplicantDashboardPage from './ApplicantDashboardPage';
import EmployeeDashboardPage from './EmployeeDashboardPage';
import { useTranslations } from 'next-intl';
import { useQuery } from '@tanstack/react-query';
import { dashboardService } from '@/services/dashboard.service';
import { Skeleton } from '@/components/ui/skeleton';

const DashboardSkeleton = () => (
  <div className="max-w-7xl mx-auto space-y-12 py-12 px-6">
    <div className="h-40 w-2/3 bg-neutral-200 animate-pulse rounded-[40px]" />
    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
      {[1, 2, 3, 4].map(i => <div key={i} className="h-48 bg-neutral-200 animate-pulse rounded-[32px]" />)}
    </div>
    <div className="h-96 bg-neutral-200 animate-pulse rounded-[40px]" />
  </div>
);

export default function DashboardPage() {
  const { user } = useAuth();
  const t = useTranslations('dashboard');

  const isEmployee = !!user?.role && ['Receptionist', 'Doctor', 'Examiner', 'Manager', 'Security'].includes(user.role);

  // Fetch Applicant Dashboard Data
  const { data: applicantData, isLoading: isApplicantLoading } = useQuery({
    queryKey: ['applicant-dashboard'],
    queryFn: () => dashboardService.getApplicantDashboard(),
    enabled: !!user && !isEmployee,
  });

  // Fetch Manager/Employee Data (if applicable)
  const { data: managerData, isLoading: isManagerLoading } = useQuery({
    queryKey: ['manager-dashboard'],
    queryFn: () => dashboardService.getManagerDashboard(),
    enabled: !!user && isEmployee,
  });

  if (!user || isApplicantLoading || isManagerLoading) {
    return <DashboardSkeleton />;
  }

  return (
    <Suspense fallback={<DashboardSkeleton />}>
      {isEmployee ? (
        <EmployeeDashboardPage data={managerData?.data || undefined} />
      ) : (
        <ApplicantDashboardPage data={applicantData?.data || undefined} user={user} />
      )}
    </Suspense>
  );
}
