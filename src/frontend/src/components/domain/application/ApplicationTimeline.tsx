"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Check, Clock, AlertCircle, Circle } from "lucide-react";
import { cn } from "@/lib/utils";

export interface TimelineStage {
  id: string;
  nameKey: string;
  status: "completed" | "current" | "pending" | "failed";
  timestamp?: string;
  reason?: string;
}

interface ApplicationTimelineProps {
  stages: TimelineStage[];
}

export function ApplicationTimeline({ stages }: ApplicationTimelineProps) {
  const t = useTranslations("application.timeline");

  return (
    <div className="relative space-y-8 before:absolute before:inset-0 before:ms-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-neutral-200 before:to-transparent">
      {stages.map((stage, index) => {
        const isCompleted = stage.status === "completed";
        const isCurrent = stage.status === "current";
        const isFailed = stage.status === "failed";
        const isPending = stage.status === "pending";

        return (
          <div key={stage.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
            {/* Icon */}
            <div
              className={cn(
                "flex items-center justify-center w-10 h-10 rounded-full border-4 border-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 transition-colors duration-300",
                isCompleted && "bg-green-500 text-white",
                isCurrent && "bg-primary-500 text-white ring-4 ring-primary-100",
                isFailed && "bg-red-500 text-white",
                isPending && "bg-neutral-200 text-neutral-400"
              )}
            >
              {isCompleted && <Check className="w-5 h-5" />}
              {isCurrent && <Clock className="w-5 h-5 animate-pulse" />}
              {isFailed && <AlertCircle className="w-5 h-5" />}
              {isPending && <Circle className="w-3 h-3" />}
            </div>

            {/* Content card */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={cn(
                "w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl shadow-sm border transition-all duration-300",
                isCurrent ? "bg-white border-primary-200 shadow-md transform scale-[1.02]" : "bg-neutral-50/50 border-neutral-100",
                isFailed ? "border-red-200 bg-red-50/30" : ""
              )}
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-1">
                <h3 className={cn("font-bold text-lg", isCurrent ? "text-primary-900" : isFailed ? "text-red-700" : "text-neutral-700")}>
                  {t(`stages.${stage.nameKey}` as any)}
                </h3>
                {stage.timestamp && (
                  <time className="text-xs text-neutral-500 mt-1 sm:mt-0 font-mono bg-neutral-100 px-2 py-1 rounded">
                    {new Date(stage.timestamp).toLocaleDateString()}
                  </time>
                )}
              </div>
              
              <div className="text-sm mt-2">
                 {isCompleted && <p className="text-green-600">{t("status.completed")}</p>}
                 {isCurrent && <p className="text-primary-600 font-medium">{t("status.current")}</p>}
                 {isPending && <p className="text-neutral-400">{t("status.pending")}</p>}
                 {isFailed && (
                   <p className="text-red-600 font-medium mt-1">
                     {t("status.failed")}: <span className="font-normal">{stage.reason}</span>
                   </p>
                 )}
              </div>
            </motion.div>
          </div>
        );
      })}
    </div>
  );
}
