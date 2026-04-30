'use client';

import React from 'react';
import { ApplicantDashboard } from '@/components/applicant/dashboard/applicant-dashboard';
import { DashboardSurface } from '@/components/layout/dashboard-surface';
import { Skeleton } from '@/components/ui/skeleton';

import { DashboardSummaryDto } from '@/types/application.types';

interface ApplicantDashboardPageProps {
  data?: DashboardSummaryDto | null;
  userName: string;
}

// This component receives data from the parent page via React Query
export default function ApplicantDashboardPage({ data, userName }: ApplicantDashboardPageProps) {
  // Show loading state while data is being fetched
  if (!data) {
    return (
      <div className="max-w-5xl mx-auto space-y-6 md:space-y-8 font-arabic" dir="rtl">
        {/* Welcome Banner Skeleton */}
        <div className="h-32 bg-neutral-100 animate-pulse rounded-2xl" />
        
        {/* Stats Grid Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-24 bg-neutral-100 animate-pulse rounded-xl" />
          ))}
        </div>

        {/* Table Skeleton */}
        <div className="h-64 bg-neutral-100 animate-pulse rounded-xl" />
      </div>
    );
  }

  return (
    <ApplicantDashboard 
      data={data} 
      userName={userName} 
    />
  );
}