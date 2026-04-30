"use client";

import { motion } from "framer-motion";
import { Check, Clock, AlertCircle, Circle } from "lucide-react";
import { cn } from "@/lib/utils";

export interface TimelineStage {
  id: string;
  label: string;
  status: "completed" | "current" | "pending" | "failed";
  timestamp?: string;
  reason?: string;
  extraContent?: React.ReactNode;
}

interface ApplicationTimelineProps {
  stages: TimelineStage[];
}

export function ApplicationTimeline({ stages }: ApplicationTimelineProps) {
  // Get stage title directly in Arabic
  const getStageTitle = (stageId: string, fallbackLabel: string): string => {
    switch (stageId) {
      case "01-Creation": return "إنشاء الطلب";
      case "02-Documents": return "رفع المستندات";
      case "03-InitialPayment": return "سداد الرسوم الإدارية";
      case "04-MedicalExam": return "الفحص الطبي";
      case "05-Training": return "الدورة التدريبية";
      case "06-TheoryTest": return "الاختبار النظري";
      case "07-PracticalTest": return "الاختبار العملي";
      case "08-FinalApproval": return "المراجعة النهائية";
      case "09-IssuancePayment": return "سداد رسوم الإصدار";
      case "10-Issuance": return "إصدار الرخص";
      default: return fallbackLabel;
    }
  };

  // Get status description in Arabic
  const getStatusText = (status: TimelineStage['status']): string => {
    switch (status) {
      case 'completed': return 'مكتمل';
      case 'current': return 'قيد التنفيذ';
      case 'pending': return 'بالانتظار';
      case 'failed': return 'غير مكتمل / مرفوض';
      default: return '';
    }
  };

  return (
    <div className="relative space-y-6 md:space-y-8 before:absolute before:inset-0 before:ms-5 md:before:ms-[calc(50%-2px)] before:-translate-x-px md:before:translate-x-0 before:h-full before:w-[2px] before:bg-gradient-to-b before:from-transparent before:via-blue-100 before:to-transparent font-arabic" dir="rtl">
      {stages.map((stage, index) => {
        const isCompleted = stage.status === "completed";
        const isCurrent = stage.status === "current";
        const isFailed = stage.status === "failed";
        const isPending = stage.status === "pending";

        const stageKey = `stage-${stage.id || index}-${index}`;

        return (
          <div key={stageKey} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
            {/* Icon */}
            <div
              className={cn(
                "flex items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-lg md:rounded-xl border-2 md:border-4 border-white shadow-xl shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 transition-all duration-500",
                isCompleted && "bg-emerald-500 text-white shadow-emerald-500/10",
                isCurrent && "bg-[#1a3a8f] text-white ring-[8px] md:ring-[12px] ring-blue-50 shadow-blue-900/20",
                isFailed && "bg-red-500 text-white shadow-red-500/10",
                isPending && "bg-neutral-100 text-neutral-300 border-neutral-50 shadow-none"
              )}
            >
              {isCompleted && <Check className="w-5 h-5 md:w-6 md:h-6 stroke-[3px]" />}
              {isCurrent && <Clock className="w-5 h-5 md:w-6 md:h-6 animate-pulse" />}
              {isFailed && <AlertCircle className="w-5 h-5 md:w-6 md:h-6" />}
              {isPending && <Circle className="w-2.5 h-2.5 md:w-3 md:h-3 fill-current" />}
            </div>

            {/* Content card */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className={cn(
                "w-[calc(100%-3.5rem)] md:w-[calc(50%-3rem)] p-5 md:p-6 rounded-xl md:rounded-2xl border transition-all duration-500",
                isCurrent ? "bg-white border-blue-200 shadow-xl shadow-blue-900/5 transform md:scale-[1.02] z-20" : "bg-white/80 backdrop-blur-sm border-neutral-100 shadow-sm",
                isFailed ? "border-red-100 bg-red-50/50" : ""
              )}
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3">
                <h3 className={cn("font-black text-lg md:text-xl tracking-tight", isCurrent ? "text-[#1a3a8f]" : isFailed ? "text-red-700" : "text-neutral-800")}>
                  {getStageTitle(stage.id, stage.label)}
                </h3>
                {stage.timestamp && (
                  <time className="text-[10px] text-neutral-400 font-bold bg-neutral-50 px-3 py-1 rounded-full border border-neutral-100 whitespace-nowrap">
                    {new Date(stage.timestamp).toLocaleDateString('ar-YE', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </time>
                )}
              </div>
              
<div className="flex items-center gap-3">
                  <div className={cn(
                    "w-2 h-2 rounded-full",
                    isCompleted && "bg-emerald-500",
                    isCurrent && "bg-[#1a3a8f] animate-pulse",
                    isPending && "bg-neutral-200",
                    isFailed && "bg-red-500"
                  )} />
                  <span className={cn(
                    "text-sm font-black uppercase tracking-widest",
                    isCompleted && "text-emerald-600",
                    isCurrent && "text-[#1a3a8f]",
                    isPending && "text-neutral-400",
                    isFailed && "text-red-600"
                  )}>
                    {getStatusText(stage.status)}
                  </span>
               </div>

              {isFailed && stage.reason && (
                <div className="mt-4 p-4 rounded-[1.25rem] bg-red-100/50 border border-red-100">
                   <p className="text-sm font-bold text-red-900 leading-relaxed">
                     <span className="opacity-60 ms-2">السبب:</span>
                     {stage.reason}
                   </p>
                </div>
              )}

              {stage.extraContent && (
                <div className="mt-4 pt-4 border-t border-dashed border-neutral-100 animate-in fade-in slide-in-from-top-4 duration-700">
                  {stage.extraContent}
                </div>
              )}
            </motion.div>
          </div>
        );
      })}
    </div>
  );
}
