'use client';

import React from 'react';
import { ApplicantDashboard } from '@/components/applicant/dashboard/applicant-dashboard';
import { DashboardSurface } from '@/components/layout/dashboard-surface';
import { DashboardSummaryDto } from '@/types/application.types';

interface ApplicantDashboardPageProps {
  data?: DashboardSummaryDto;
  user: any;
}

export default function ApplicantDashboardPage({ data, user }: ApplicantDashboardPageProps) {
  if (!data) return null;

  return (
    <DashboardSurface className="pt-20 pb-20">
      <ApplicantDashboard 
        data={data} 
        userName={user?.fullName || ''} 
      />
    </DashboardSurface>
  );
}
