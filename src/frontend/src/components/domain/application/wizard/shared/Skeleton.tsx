"use client";

import { cn } from "@/lib/utils";

interface SkeletonProps {
  className?: string;
}

export function FormSkeleton({ className }: SkeletonProps) {
  return (
    <div className={cn("space-y-4", className)}>
      {/* Two column skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Row 1 */}
        <div className="space-y-2">
          <div className="h-4 w-20 bg-neutral-200 dark:bg-neutral-700 rounded animate-pulse" />
          <div className="h-10 w-full bg-neutral-200 dark:bg-neutral-700 rounded animate-pulse" />
        </div>
        <div className="space-y-2">
          <div className="h-4 w-24 bg-neutral-200 dark:bg-neutral-700 rounded animate-pulse" />
          <div className="h-10 w-full bg-neutral-200 dark:bg-neutral-700 rounded animate-pulse" />
        </div>

        {/* Row 2 */}
        <div className="space-y-2">
          <div className="h-4 w-16 bg-neutral-200 dark:bg-neutral-700 rounded animate-pulse" />
          <div className="h-10 w-full bg-neutral-200 dark:bg-neutral-700 rounded animate-pulse" />
        </div>
        <div className="space-y-2">
          <div className="h-4 w-12 bg-neutral-200 dark:bg-neutral-700 rounded animate-pulse" />
          <div className="h-10 w-full bg-neutral-200 dark:bg-neutral-700 rounded animate-pulse" />
        </div>

        {/* Row 3 */}
        <div className="space-y-2">
          <div className="h-4 w-28 bg-neutral-200 dark:bg-neutral-700 rounded animate-pulse" />
          <div className="h-10 w-full bg-neutral-200 dark:bg-neutral-700 rounded animate-pulse" />
        </div>
        <div className="space-y-2">
          <div className="h-4 w-24 bg-neutral-200 dark:bg-neutral-700 rounded animate-pulse" />
          <div className="h-10 w-full bg-neutral-200 dark:bg-neutral-700 rounded animate-pulse" />
        </div>
      </div>

      {/* Full width row */}
      <div className="space-y-2">
        <div className="h-4 w-16 bg-neutral-200 dark:bg-neutral-700 rounded animate-pulse" />
        <div className="h-10 w-full bg-neutral-200 dark:bg-neutral-700 rounded animate-pulse" />
      </div>
    </div>
  );
}