'use client';

import React, { memo } from 'react';
import { useTranslations } from 'next-intl';
import { Badge } from '@/components/ui/badge';
import { ApplicationStatus } from '@/types/application.types';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface StatusBadgeProps {
  status: ApplicationStatus;
  className?: string;
}

const statusConfig: Record<string, { variant: "success" | "warning" | "destructive" | "info" | "secondary" | "default"; glowColor: string }> = {
  [ApplicationStatus.Draft]: { variant: "secondary", glowColor: "rgba(156, 163, 175, 0.2)" },
  [ApplicationStatus.Submitted]: { variant: "info", glowColor: "rgba(59, 130, 246, 0.2)" },
  [ApplicationStatus.Documents]: { variant: "warning", glowColor: "rgba(245, 158, 11, 0.2)" },
  [ApplicationStatus.InReview]: { variant: "info", glowColor: "rgba(59, 130, 246, 0.2)" },
  [ApplicationStatus.Medical]: { variant: "info", glowColor: "rgba(59, 130, 246, 0.2)" },
  [ApplicationStatus.Training]: { variant: "info", glowColor: "rgba(59, 130, 246, 0.2)" },
  [ApplicationStatus.Theory]: { variant: "info", glowColor: "rgba(59, 130, 246, 0.2)" },
  [ApplicationStatus.Practical]: { variant: "info", glowColor: "rgba(59, 130, 246, 0.2)" },
  [ApplicationStatus.Approved]: { variant: "success", glowColor: "rgba(16, 185, 129, 0.2)" },
  [ApplicationStatus.Payment]: { variant: "warning", glowColor: "rgba(245, 158, 11, 0.2)" },
  [ApplicationStatus.Issued]: { variant: "success", glowColor: "rgba(16, 185, 129, 0.3)" },
  [ApplicationStatus.Active]: { variant: "success", glowColor: "rgba(16, 185, 129, 0.2)" },
  [ApplicationStatus.Rejected]: { variant: "destructive", glowColor: "rgba(239, 68, 68, 0.2)" },
  [ApplicationStatus.Cancelled]: { variant: "secondary", glowColor: "rgba(156, 163, 175, 0.2)" },
  [ApplicationStatus.Expired]: { variant: "destructive", glowColor: "rgba(239, 68, 68, 0.2)" },
  [ApplicationStatus.Paid]: { variant: "success", glowColor: "rgba(16, 185, 129, 0.2)" },
  [ApplicationStatus.MedicalDone]: { variant: "success", glowColor: "rgba(16, 185, 129, 0.2)" },
  [ApplicationStatus.TheoryDone]: { variant: "success", glowColor: "rgba(16, 185, 129, 0.2)" },
  [ApplicationStatus.PracticalDone]: { variant: "success", glowColor: "rgba(16, 185, 129, 0.2)" },
};

export const StatusBadge = memo(({ status, className }: StatusBadgeProps) => {
  const t = useTranslations('status');
  const config = statusConfig[status] || { variant: "default", glowColor: "transparent" };

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="inline-block"
    >
      <Badge 
        variant={config.variant}
        className={cn(
          "px-3 py-1 rounded-full border-none font-bold text-[10px] uppercase tracking-widest backdrop-blur-md shadow-sm",
          "bg-white/10 dark:bg-black/10 transition-all duration-300",
          className
        )}
        style={{ 
          boxShadow: `0 0 15px ${config.glowColor}, inset 0 0 1px 1px rgba(255,255,255,0.1)`,
          border: '1px solid rgba(255,255,255,0.05)'
        }}
      >
        <span className="relative z-10">
          {t(status)}
        </span>
      </Badge>
    </motion.div>
  );
});

StatusBadge.displayName = 'StatusBadge';
