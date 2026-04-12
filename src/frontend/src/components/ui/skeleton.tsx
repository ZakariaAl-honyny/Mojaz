// Skeleton component for loading states

import { cn } from "@/lib/utils";

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div className={cn("animate-pulse bg-neutral-200 dark:bg-neutral-700 rounded", className)} />
  );
}