'use client';

import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function NotificationsLoading() {
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
        <Skeleton className="h-10 w-32 rounded-lg" />
      </header>

      {/* Filters Skeleton */}
      <div className="bg-white border border-neutral-200 p-4 md:p-6 rounded-2xl shadow-sm mx-4">
        <div className="flex flex-wrap gap-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} className="h-9 w-20 rounded-lg" />
          ))}
        </div>
      </div>

      {/* Notifications List Skeleton */}
      <div className="space-y-3 px-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <Card key={i} className="border border-neutral-200 shadow-sm rounded-xl bg-white">
            <CardContent className="p-4 md:p-6 flex items-start gap-4">
              <Skeleton className="w-10 h-10 rounded-xl" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
              <Skeleton className="h-4 w-16 rounded-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}