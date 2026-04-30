'use client';

import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StatsCard } from '@/components/ui/stats-card';

export default function DashboardLoading() {
  return (
    <div className="max-w-5xl mx-auto space-y-6 md:space-y-8 py-6 md:py-10 px-4 space-y-8 sm:space-y-10 font-arabic" dir="rtl">
      {/* Header Skeleton */}
      <header className="flex flex-col md:flex-row md:items-end md:justify-between gap-5 px-0 md:px-4">
        <div className="flex items-center gap-3 md:gap-4">
          <Skeleton className="w-1 md:w-1.5 h-8 md:h-10 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-6 md:h-8 w-48 md:w-64" />
            <Skeleton className="h-3 md:h-4 w-32" />
          </div>
        </div>
        <div className="flex gap-2 sm:gap-2.5">
          <Skeleton className="h-9 md:h-10 w-24 rounded-lg" />
          <Skeleton className="h-9 md:h-10 w-24 rounded-lg" />
        </div>
      </header>

      {/* Stats Cards Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5 px-0 md:px-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="border border-neutral-200 shadow-sm rounded-xl md:rounded-2xl overflow-hidden bg-white">
            <CardContent className="p-4 md:p-6">
              <div className="flex items-center justify-between">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="w-8 h-8 rounded-lg" />
              </div>
              <Skeleton className="h-8 w-16 mt-2" />
              <Skeleton className="h-3 w-12 mt-2" />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Chart Skeleton */}
      <Card className="border border-neutral-200 shadow-sm rounded-xl md:rounded-2xl overflow-hidden bg-white">
        <CardHeader className="p-4 md:p-5 border-b border-neutral-100 flex flex-row items-center justify-between space-y-0">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-6 w-16 rounded-full" />
        </CardHeader>
        <CardContent className="p-4 md:p-6 lg:p-8 pt-6 md:pt-10">
          <Skeleton className="h-[350px] w-full rounded-lg" />
        </CardContent>
      </Card>

      {/* Activity List Skeleton */}
      <Card className="border border-neutral-200 shadow-sm bg-white rounded-xl overflow-hidden mx-0 md:mx-4">
        <CardHeader className="p-4 md:p-5 border-b border-neutral-100">
          <Skeleton className="h-6 w-32" />
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-neutral-50">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-center gap-4 md:gap-6 p-4 md:p-6">
                <Skeleton className="w-10 h-10 md:w-12 md:h-12 rounded-xl" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
                <Skeleton className="h-8 w-16 rounded-lg" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}