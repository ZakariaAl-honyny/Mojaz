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
      <Card data-testid="application-card" className="border border-white/10 shadow-[0_20px_40px_rgba(0,0,0,0.3)] bg-white/5 backdrop-blur-3xl rounded-[2.5rem] overflow-hidden group cursor-pointer transition-all duration-500 hover:scale-[1.02] hover:bg-white/10 relative">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary-500/50 to-transparent group-hover:via-primary-500 transition-all duration-700" />
        
        <CardContent className="p-8 flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div className="flex-1 space-y-4">
             <div className="flex items-center gap-4">
                <span className="font-black text-white bg-white/5 border border-white/10 px-4 py-1.5 rounded-xl text-xs tracking-widest uppercase gov-gloss">
                  {number}
                </span>
                <StatusBadge status={status} />
             </div>
             
             <div>
                <h3 className="font-black text-2xl text-white tracking-tight font-arabic">
                  {t(`application.create.fields.${categoryNameKey}` as any)}
                </h3>
             </div>
             
             <div className="flex flex-wrap items-center gap-6 text-xs text-neutral-500">
                <span className="flex items-center gap-2 bg-white/5 border border-white/5 px-3 py-1.5 rounded-xl font-bold text-primary-400">
                   <Activity className="w-4 h-4" />
                   {currentStage}
                </span>
                <span className="flex items-center gap-2 font-bold">
                   <Calendar className="w-4 h-4 text-neutral-600" />
                   {t("application.details.submittedOn")}: {new Date(updatedAt).toLocaleDateString()}
                </span>
             </div>
          </div>
          
          <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-white/5 border border-white/10 group-hover:bg-primary-600 group-hover:border-primary-500 group-hover:text-white transition-all duration-500 group-hover:shadow-[0_0_20px_rgba(0,108,53,0.5)]">
            <ChevronRight className="w-6 h-6 rtl:rotate-180 transition-transform group-hover:translate-x-1 rtl:group-hover:-translate-x-1" />
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
