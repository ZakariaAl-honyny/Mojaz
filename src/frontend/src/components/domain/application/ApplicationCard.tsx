"use client";

import { useTranslations } from "next-intl";
import Link from "next/link";
import { ApplicationStatus } from "@/types/api.types";
import { StatusBadge } from "./StatusBadge";
import { Card, CardContent } from "@/components/ui/card";
import { FileText, ChevronRight, Activity, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";

interface ApplicationCardProps {
  id: string;
  number: string;
  categoryNameKey: string; // e.g. "privateCar"
  status: ApplicationStatus;
  currentStage: string;
  updatedAt: string;
  locale: string;
}

export function ApplicationCard({
  id,
  number,
  categoryNameKey,
  status,
  currentStage,
  updatedAt,
  locale
}: ApplicationCardProps) {
  const t = useTranslations();

  return (
    <Link href={`/${locale}/applications/${id}`}>
      <Card data-testid="application-card" className="border-0 shadow-sm hover:shadow-md transition-shadow group bg-white cursor-pointer relative overflow-hidden">
        {/* Subtle decorative edge */}
        <div className={cn(
          "absolute rtl:right-0 ltr:left-0 top-0 bottom-0 w-1 rounded-s-xl",
          status === "Draft" ? "bg-neutral-300" :
          status === "Rejected" || status === "Cancelled" ? "bg-red-500" :
          status === "Issued" || status === "Approved" || status === "Paid" ? "bg-green-500" :
          "bg-primary-500"
        )} />
        
        <CardContent className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex-1 space-y-3">
             <div className="flex items-center gap-3">
                <span className="font-bold text-primary-900 border border-primary-200 bg-primary-50 px-2 py-0.5 rounded text-sm font-mono">
                  {number}
                </span>
                <StatusBadge status={status} />
             </div>
             
             <div>
                <h3 className="font-semibold text-lg text-neutral-800">
                  {t(`application.create.fields.${categoryNameKey}` as any)}
                </h3>
             </div>
             
             <div className="flex flex-wrap items-center gap-4 text-xs text-neutral-500">
                <span className="flex items-center gap-1.5 bg-neutral-100 px-2 py-1 rounded">
                   <Activity className="w-3.5 h-3.5" />
                   {currentStage}
                </span>
                <span className="flex items-center gap-1.5">
                   <Calendar className="w-3.5 h-3.5" />
                   {t("application.details.submittedOn")}: {new Date(updatedAt).toLocaleDateString()}
                </span>
             </div>
          </div>
          
          <div className="hidden md:flex items-center justify-center w-10 h-10 rounded-full bg-neutral-50 group-hover:bg-primary-50 group-hover:text-primary-600 transition-colors">
            <ChevronRight className="w-5 h-5 rtl:rotate-180" />
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
