"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { TrainingRecordDto } from "@/types/training.types";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Calendar, User, ArrowRight } from "lucide-react";

interface ExemptionCardProps {
  record: TrainingRecordDto;
  onReview: (id: string) => void;
  className?: string;
}

/**
 * ExemptionCard - Manager view item for pending exemptions in the queue.
 */
export function ExemptionCard({ record, onReview, className }: ExemptionCardProps) {
  const t = useTranslations("training.history");
  const tp = useTranslations("training.page");

  return (
    <Card className={cn("overflow-hidden hover:shadow-md transition-shadow", className)}>
      <CardContent className="p-0">
        <div className="flex items-stretch">
          {/* Status Indicator Bar */}
          <div className="w-1.5 bg-amber-400"></div>
          
          <div className="flex-1 p-5 space-y-4">
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">
                  {tp('applicantInfo')}
                </span>
                <h3 className="text-base font-bold text-neutral-800">
                  APP-2025-{record.applicationId.substring(0, 8)}
                </h3>
              </div>
              <div className="text-right space-y-1">
                <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">
                  {t('lastUpdated')}
                </span>
                <p className="text-xs font-medium text-neutral-600">
                  {record.updatedAt ? new Date(record.updatedAt).toLocaleDateString() : 'N/A'}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2 text-sm text-neutral-600">
                <FileText className="w-4 h-4 text-neutral-300" />
                <span className="truncate">{record.exemptionReason || "No reason provided"}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-neutral-600">
                <School className="w-4 h-4 text-neutral-300" />
                <span>{record.schoolName}</span>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-primary-600 hover:text-primary-700 hover:bg-primary-50 font-bold group"
                onClick={() => onReview(record.id)}
              >
                Review Request
                <ArrowRight className="w-4 h-4 ms-2 group-hover:translate-x-1 rtl:group-hover:-translate-x-1 rtl:rotate-180 transition-transform" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Internal School icon helper if Lucide school is missing or different
function School({ className }: { className?: string }) {
  return (
    <svg 
      className={className} 
      xmlns="http://www.w3.org/2000/svg" 
      width="24" height="24" viewBox="0 0 24 24" 
      fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
    >
      <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
    </svg>
  );
}
