"use client";

import Link from "next/link";
import { ApplicationStatus } from "@/types/api.types";
import { StatusBadge } from "./StatusBadge";
import { Card, CardContent } from "@/components/ui/card";
import { FileText, ChevronLeft, Activity, Calendar, Fingerprint } from "lucide-react";
import { cn } from "@/lib/utils";

interface ApplicationCardProps {
  id: string;
  number: string;
  categoryNameKey: string; // e.g. "privateCar"
  status: ApplicationStatus;
  currentStage: string;
  updatedAt: string;
}

const categoryLabels: Record<string, string> = {
  "privateCar": "رخصة قيادة خصوصي",
  "motorcycle": "رخصة دراجة نارية",
  "lightTransport": "رخصة نقل خفيف",
  "heavyTransport": "رخصة نقل ثقيل",
  "publicBus": "رخصة حافلة عامة",
  "construction": "رخصة معدات ثقيلة"
};

export function ApplicationCard({
  id,
  number,
  categoryNameKey,
  status,
  currentStage,
  updatedAt
}: ApplicationCardProps) {
  const categoryLabel = categoryLabels[categoryNameKey] || categoryNameKey;

  return (
    <Link href={`/applications/${id}`}>
      <Card data-testid="application-card" className="border-none shadow-sm hover:shadow-2xl transition-all duration-500 group bg-white cursor-pointer relative overflow-hidden rounded-[2.5rem]">
        {/* Subtle decorative edge with King Blue */}
        <div className={cn(
          "absolute right-0 top-0 bottom-0 w-1.5 transition-all duration-500",
          status === "Draft" ? "bg-neutral-200" :
          status === "Rejected" || status === "Cancelled" ? "bg-red-500" :
          status === "Issued" || status === "Approved" || status === "Paid" ? "bg-emerald-500" :
          "bg-[#1a3a8f]"
        )} />
        
        <CardContent className="p-8 flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div className="flex-1 space-y-5">
             <div className="flex flex-wrap items-center gap-4">
                <span className="font-black text-[#1a3a8f] border border-blue-100 bg-blue-50/50 px-4 py-1.5 rounded-xl text-xs font-mono uppercase tracking-widest flex items-center gap-2">
                  <Fingerprint className="w-3.5 h-3.5 opacity-60" />
                  {number}
                </span>
                <StatusBadge status={status} />
             </div>
             
             <div>
                <h3 className="font-black text-2xl text-neutral-900 group-hover:text-[#1a3a8f] transition-colors leading-tight">
                  {categoryLabel}
                </h3>
             </div>
             
             <div className="flex flex-wrap items-center gap-6 text-[11px] text-neutral-400 font-bold uppercase tracking-wider">
                <span className="flex items-center gap-2 bg-neutral-50 px-4 py-2 rounded-xl group-hover:bg-blue-50/50 group-hover:text-[#1a3a8f] transition-all">
                   <Activity className="w-4 h-4 opacity-50" />
                   {currentStage}
                </span>
                <span className="flex items-center gap-2">
                   <Calendar className="w-4 h-4 opacity-50" />
                   تاريخ التحديث: {new Date(updatedAt).toLocaleDateString('ar-YE', { day: 'numeric', month: 'long', year: 'numeric' })}
                </span>
             </div>
          </div>
          
          <div className="hidden md:flex items-center justify-center w-14 h-14 rounded-2xl bg-neutral-50 group-hover:bg-[#1a3a8f] group-hover:text-white transition-all duration-500 shadow-inner group-hover:shadow-2xl">
            <ChevronLeft className="w-6 h-6" />
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
