'use client';

import React from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { Check, Clock, AlertCircle, Circle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ApplicationTimelineDto, TimelineStageDto } from '@/types/application.types';

interface ApplicationTimelineProps {
  timeline: ApplicationTimelineDto;
  className?: string;
}

const StageIcon = ({ state }: { state: TimelineStageDto['state'] }) => {
  switch (state) {
    case 'completed':
      return <Check className="w-4 h-4 text-white" />;
    case 'current':
      return <motion.div 
        animate={{ scale: [1, 1.2, 1], opacity: [0.8, 1, 0.8] }} 
        transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
      >
        <Clock className="w-4 h-4 text-white" />
      </motion.div>;
    case 'failed':
      return <AlertCircle className="w-4 h-4 text-white" />;
    default:
      return <Circle className="w-4 h-4 text-neutral-400" strokeWidth={1.5} />;
  }
};

export const ApplicationTimeline = ({ timeline, className }: ApplicationTimelineProps) => {
  const t = useTranslations('dashboard.timeline');
  const locale = useLocale();

  return (
    <div className={cn("relative py-6", className)}>
      {timeline.stages.map((stage, index) => {
        const isLast = index === timeline.stages.length - 1;
        const name = locale === 'ar' ? stage.nameAr : stage.nameEn;
        
        // Motion variants
        const containerVariants = {
          hidden: { opacity: 0, x: locale === 'ar' ? 20 : -20 },
          visible: { 
            opacity: 1, 
            x: 0,
            transition: { delay: index * 0.1, duration: 0.5, ease: "easeOut" }
          }
        };

        return (
          <motion.div 
            key={stage.stageNumber} 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="group relative flex gap-6 pb-12 rtl:flex-row-reverse last:pb-0"
          >
            {/* Connector - Animated SVG Line */}
            {!isLast && (
              <div className="absolute top-[40px] bottom-0 left-[15px] w-[2px] rtl:left-auto rtl:right-[15px]">
                <div className="h-full w-full bg-neutral-100" />
                <motion.div 
                  initial={{ height: 0 }}
                  whileInView={{ height: '100%' }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: (index * 0.1) + 0.3 }}
                  className={cn(
                    "absolute top-0 left-0 w-full z-10",
                    stage.state === 'completed' ? "bg-primary-500 shadow-[0_0_8px_rgba(0,108,53,0.4)]" : "bg-neutral-200"
                  )}
                />
              </div>
            )}

            {/* Bubble */}
            <div className="relative z-20">
              <div className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center transition-all duration-500",
                "border-2 ring-4 ring-transparent group-hover:ring-primary-100/50",
                stage.state === 'completed' ? "bg-primary-600 border-primary-600 shadow-lg shadow-primary-900/20" : 
                stage.state === 'current' ? "bg-amber-500 border-amber-500 shadow-[0_0_20px_rgba(245,158,11,0.4)]" :
                stage.state === 'failed' ? "bg-red-500 border-red-500 shadow-lg shadow-red-900/20" :
                "bg-white border-neutral-200"
              )}>
                <StageIcon state={stage.state} />
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 text-start">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <h4 className={cn(
                  "font-black text-base tracking-tight font-arabic",
                  stage.state === 'future' ? "text-neutral-400" : "text-neutral-900"
                )}>
                  {name}
                </h4>
                {stage.state === 'current' && (
                  <span className="px-2 py-0.5 rounded text-[9px] font-black uppercase bg-amber-100 text-amber-700 animate-pulse">
                    قيد التنفيذ
                  </span>
                )}
              </div>

              <div className="space-y-2">
                {stage.completedAt && (
                  <span className="inline-flex items-center text-[11px] font-medium text-neutral-400 bg-neutral-50 px-2 py-0.5 rounded border border-neutral-100">
                    {new Date(stage.completedAt).toLocaleDateString(locale, { day: 'numeric', month: 'short', year: 'numeric' })}
                  </span>
                )}

                {stage.outcomeNote && stage.state !== 'future' && (
                  <motion.div 
                    initial={{ opacity: 0, y: 5 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    className={cn(
                      "text-sm p-4 rounded-xl border font-medium leading-relaxed max-w-2xl",
                      stage.state === 'failed' ? "bg-red-50 border-red-100 text-red-700" : "bg-neutral-50 border-neutral-100 text-neutral-600"
                    )}
                  >
                    {stage.outcomeNote}
                  </motion.div>
                )}

                {stage.actorName && (
                  <div className="flex items-center gap-2 text-[10px] text-neutral-400 font-bold uppercase tracking-widest">
                    <span className="w-4 h-px bg-neutral-200" />
                    {stage.actorName} • {stage.actorRole}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};
