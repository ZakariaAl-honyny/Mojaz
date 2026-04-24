'use client';

import React from 'react';
import { ApplicantDashboard } from '@/components/applicant/dashboard/applicant-dashboard';
import { DashboardSurface } from '@/components/layout/dashboard-surface';

import { DashboardSummaryDto } from '@/types/application.types';

interface ApplicantDashboardPageProps {
  data?: DashboardSummaryDto | null;
  userName: string;
}

// This component receives data from the parent page via React Query
export default function ApplicantDashboardPage({ data, userName }: ApplicantDashboardPageProps) {
  return (
    <ApplicantDashboard 
      data={data as any} 
      userName={userName} 
    />
  );
}