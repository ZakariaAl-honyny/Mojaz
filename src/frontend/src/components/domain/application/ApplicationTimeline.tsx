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
  extraContent?: React.ReactNode;
}

interface ApplicationTimelineProps {
  stages: TimelineStage[];
  className?: string;
}

export function ApplicationTimeline({ stages, className }: ApplicationTimelineProps) {
  const t = useTranslations("application.timeline");

  return (
    <div data-testid="application-timeline" className={cn("relative space-y-12 before:absolute before:inset-0 before:ms-6 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-1 before:bg-gradient-to-b before:from-transparent before:via-white/10 before:to-transparent", className)}>
      {stages.map((stage, index) => {
        const isCompleted = stage.status === "completed";
        const isCurrent = stage.status === "current";
        const isFailed = stage.status === "failed";
        const isPending = stage.status === "pending";

        return (
          <div key={stage.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
            {/* Icon */}
            <div
              className={cn(
                "flex items-center justify-center w-12 h-12 rounded-2xl border border-white/10 shadow-2xl shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 transition-all duration-500",
                isCompleted && "bg-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.4)] text-white scale-110",
                isCurrent && "bg-primary-500 text-white ring-4 ring-primary-500/20 shadow-[0_0_25px_rgba(0,108,53,0.5)] scale-125 z-20",
                isFailed && "bg-red-500 text-white shadow-[0_0_20px_rgba(239,68,68,0.4)]",
                isPending && "bg-neutral-800 text-neutral-500 border-white/5"
              )}
            >
              {isCompleted && <Check className="w-6 h-6 stroke-[3]" />}
              {isCurrent && <Clock className="w-6 h-6 animate-pulse stroke-[3]" />}
              {isFailed && <AlertCircle className="w-6 h-6 stroke-[3]" />}
              {isPending && <Circle className="w-4 h-4 fill-current" />}
            </div>

            {/* Content card */}
            <motion.div
              initial={{ opacity: 0, x: index % 2 === 0 ? 20 : -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
              className={cn(
                "w-[calc(100%-4rem)] md:w-[calc(50%-3.5rem)] p-8 rounded-[2rem] border transition-all duration-500 backdrop-blur-3xl relative overflow-hidden",
                isCurrent
                  ? "bg-white/10 border-primary-500/30 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.5)] scale-[1.05] z-10"
                  : "bg-white/5 border-white/5 shadow-2xl opacity-60 hover:opacity-100",
                isFailed ? "border-red-500/30 bg-red-500/5 shadow-[0_0_30px_rgba(239,68,68,0.1)]" : ""
              )}
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3">
                <h3 className={cn("font-black text-xl tracking-tight font-arabic", isCurrent ? "text-white" : isFailed ? "text-red-400" : "text-neutral-400")}>
                  {t(`stages.${stage.nameKey}` as any)}
                </h3>
                {stage.timestamp && (
                  <time className="text-xs text-neutral-500 mt-1 sm:mt-0 font-mono bg-neutral-100 px-2 py-1 rounded">
                    {new Date(stage.timestamp).toLocaleDateString()}
                  </time>
                )}
              </div>

              <div className="text-sm mt-2">
                {isCompleted && <p className="text-King blue-600">{t("status.completed")}</p>}
                {isCurrent && <p className="text-primary-600 font-medium">{t("status.current")}</p>}
                {isPending && <p className="text-neutral-400">{t("status.pending")}</p>}
                {isFailed && (
                  <p className="text-red-600 font-medium mt-1">
                    {t("status.failed")}: <span className="font-normal">{stage.reason}</span>
                  </p>
                )}
              </div>

              {stage.extraContent && (
                <div className="mt-4 animate-in slide-in-from-top-2 duration-500">
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
