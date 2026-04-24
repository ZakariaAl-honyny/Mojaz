'use client';

import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function ApplicationsLoading() {
  return (
    <div className="space-y-6 md:space-y-10 font-arabic" dir="rtl">
      {/* Header Skeleton */}
      <header className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 px-4">
        <div className="flex items-center gap-4 md:gap-6">
          <Skeleton className="w-1 h-12 md:h-16 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-8 w-48 md:w-64" />
            <Skeleton className="h-4 w-72" />
          </div>
        </div>
        <Skeleton className="h-12 md:h-16 w-full md:w-48 rounded-xl md:rounded-2xl" />
      </header>

      {/* Toolbar Skeleton */}
      <div className="bg-white border border-neutral-200 p-4 md:p-8 rounded-2xl md:rounded-[2.5rem] shadow-sm mx-4">
        <div className="flex flex-col lg:flex-row gap-4 md:gap-6 justify-between">
          <div className="flex flex-wrap gap-2">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-10 w-24 rounded-xl" />
            ))}
          </div>
          <Skeleton className="h-10 w-full lg:w-80 rounded-lg" />
        </div>
      </div>

      {/* Applications Grid Skeleton */}
      <div className="grid grid-cols-1 gap-5 px-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="border border-neutral-200 shadow-sm rounded-2xl md:rounded-3xl p-1 bg-white">
            <CardContent className="p-4 md:p-7 flex flex-col lg:flex-row items-center justify-between gap-6 md:gap-10">
              <div className="flex items-center gap-4 md:gap-6 flex-1 w-full lg:w-auto">
                <Skeleton className="w-12 h-12 md:w-16 md:h-16 rounded-xl md:rounded-2xl" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-6 w-48" />
                  <Skeleton className="h-4 w-32" />
                </div>
              </div>
              <div className="flex flex-row items-center gap-6 md:gap-14 flex-1 justify-between md:justify-center w-full lg:w-auto">
                <Skeleton className="h-8 w-24" />
                <Skeleton className="h-2 w-40 rounded-full" />
              </div>
              <Skeleton className="h-10 w-10 rounded-xl" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}