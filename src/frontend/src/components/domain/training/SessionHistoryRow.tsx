"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { TrainingRecordDto } from "@/types/training.types";
import { Calendar, User, School, Hash, Clock } from "lucide-react";

interface SessionHistoryRowProps {
  record: TrainingRecordDto;
  className?: string;
}

/**
 * SessionHistoryRow - Displays current training session details in a ledger-style row.
 */
export function SessionHistoryRow({ record, className }: SessionHistoryRowProps) {
  const t = useTranslations("training.history");

  const fields = [
    { 
      label: t('centerName'), 
      value: record.centerName || record.schoolName, 
      icon: School 
    },
    { 
      label: t('trainerName'), 
      value: record.trainerName || t('notApplicable'), 
      icon: User 
    },
    { 
      label: t('certificateNumber'), 
      value: record.certificateNumber || t('notApplicable'), 
      icon: Hash 
    },
    { 
      label: t('lastUpdated'), 
      value: record.updatedAt ? new Date(record.updatedAt).toLocaleDateString() : new Date(record.createdAt).toLocaleDateString(), 
      icon: Calendar 
    },
    { 
      label: t('completedHours'), 
      value: `${record.completedHours} / ${record.totalHoursRequired}`, 
      icon: Clock,
      isMono: true
    }
  ];

  return (
    <div className={cn("grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 py-4 border-b border-neutral-100 dark:border-neutral-800", className)}>
      {fields.map((field, idx) => (
        <div key={idx} className="flex flex-col space-y-1">
          <div className="flex items-center gap-1.5 text-[10px] font-bold text-neutral-400 uppercase tracking-widest">
            <field.icon className="w-3 h-3" />
            {field.label}
          </div>
          <div className={cn(
            "text-sm font-medium text-neutral-700 dark:text-neutral-200 truncate",
            field.isMono && "font-mono text-primary-700 dark:text-primary-400"
          )}>
            {field.value}
          </div>
        </div>
      ))}
    </div>
  );
}
