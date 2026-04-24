'use client';

import React, { memo } from 'react';
import { Badge } from '@/components/ui/badge';
import { ApplicationStatus } from '@/lib/enums';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { ApplicationStatusLabels } from '@/lib/enumMappers';

interface StatusBadgeProps {
  status: ApplicationStatus | number;
  className?: string;
}

const getStatusDotColor = (status: ApplicationStatus | number): string => {
  const configMap: Record<number, string> = {
    [ApplicationStatus.Draft]: "bg-neutral-400",
    [ApplicationStatus.Submitted]: "bg-[#1a3a8f]",
    [ApplicationStatus.DocumentReview]: "bg-purple-500",
    [ApplicationStatus.InReview]: "bg-blue-500",
    [ApplicationStatus.MedicalExam]: "bg-teal-500",
    [ApplicationStatus.Training]: "bg-orange-500",
    [ApplicationStatus.TheoryTest]: "bg-sky-500",
    [ApplicationStatus.PracticalTest]: "bg-indigo-500",
    [ApplicationStatus.Approved]: "bg-emerald-600",
    [ApplicationStatus.Payment]: "bg-yellow-500",
    [ApplicationStatus.Issued]: "bg-emerald-600",
    [ApplicationStatus.Active]: "bg-emerald-500",
    [ApplicationStatus.Rejected]: "bg-red-600",
    [ApplicationStatus.Cancelled]: "bg-neutral-300",
    [ApplicationStatus.Expired]: "bg-red-800",
  };
  return configMap[status] || "bg-neutral-300";
};

const getStatusVariant = (status: ApplicationStatus | number): string => {
  const variants: Record<number, string> = {
    [ApplicationStatus.Draft]: "outline",
    [ApplicationStatus.Submitted]: "primary",
    [ApplicationStatus.DocumentReview]: "secondary",
    [ApplicationStatus.InReview]: "info",
    [ApplicationStatus.MedicalExam]: "info",
    [ApplicationStatus.Training]: "warning",
    [ApplicationStatus.TheoryTest]: "info",
    [ApplicationStatus.PracticalTest]: "info",
    [ApplicationStatus.Approved]: "success",
    [ApplicationStatus.Payment]: "warning",
    [ApplicationStatus.Issued]: "success",
    [ApplicationStatus.Active]: "success",
    [ApplicationStatus.Rejected]: "destructive",
    [ApplicationStatus.Cancelled]: "outline",
    [ApplicationStatus.Expired]: "destructive",
  };
  return variants[status] || "outline";
};

export const StatusBadge = memo(({ status, className }: StatusBadgeProps) => {
  const statusNumber = typeof status === 'number' ? status : status;
  const label = (ApplicationStatusLabels as Record<number, string>)[statusNumber] || String(statusNumber);
  const dotColor = getStatusDotColor(statusNumber);
  const variant = getStatusVariant(statusNumber) as any;

  return (
    <motion.div
      whileHover={{ y: -1 }}
      className="inline-block font-arabic"
    >
      <Badge 
        variant={variant}
        className={cn(
          "px-3 py-1.5 rounded-full font-black text-[9px] uppercase tracking-widest flex items-center gap-2 border shadow-none",
          className
        )}
      >
        <div className={cn("w-1.5 h-1.5 rounded-full shrink-0", dotColor)} />
        <span>{label}</span>
      </Badge>
    </motion.div>
  );
});

StatusBadge.displayName = 'StatusBadge';