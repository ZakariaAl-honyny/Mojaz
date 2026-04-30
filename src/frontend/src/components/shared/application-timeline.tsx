'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Check, Clock, AlertCircle, Circle, UserCheck } from 'lucide-react';
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
      return <Circle className="w-4 h-4 text-neutral-300" strokeWidth={1.5} />;
  }
};

export const ApplicationTimeline = ({ timeline, className }: ApplicationTimelineProps) => {
  return (
    <div className={cn("relative py-10 font-arabic", className)} dir="rtl">
      {timeline.stages.map((stage, index) => {
        const isLast = index === timeline.stages.length - 1;
        const name = stage.nameAr; 
        
        return (
          <motion.div 
            key={stage.stageNumber} 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1, duration: 0.6 }}
            className="group relative flex gap-8 pb-14 last:pb-0"
          >
            {/* Connector */}
            {!isLast && (
              <div className="absolute top-[48px] bottom-0 right-[23px] w-[2px]">
                <div className="h-full w-full bg-neutral-100" />
                <motion.div 
                  initial={{ height: 0 }}
                  whileInView={{ height: '100%' }}
                  viewport={{ once: true }}
                  transition={{ duration: 1, delay: (index * 0.1) + 0.3 }}
                  className={cn(
                    "absolute top-0 left-0 w-full z-10",
                    stage.state === 'completed' ? "bg-primary-600 shadow-[0_0_15px_rgba(26,58,143,0.3)]" : "bg-neutral-200"
                  )}
                />
              </div>
            )}

            {/* Bubble */}
            <div className="relative z-20">
              <div className={cn(
                "w-12 h-12 rounded-[1.25rem] flex items-center justify-center transition-all duration-500",
                "border-2 ring-8 ring-transparent group-hover:ring-primary-50/50",
                stage.state === 'completed' ? "bg-primary-600 border-primary-600 shadow-xl shadow-primary-900/30" : 
                stage.state === 'current' ? "bg-amber-500 border-amber-500 shadow-[0_0_25px_rgba(245,158,11,0.3)]" :
                stage.state === 'failed' ? "bg-red-500 border-red-500 shadow-xl shadow-red-900/30" :
                "bg-white border-neutral-100"
              )}>
                <StageIcon state={stage.state} />
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 text-end pt-1">
              <div className="flex flex-wrap items-center gap-3 mb-3 justify-start">
                <h4 className={cn(
                  "font-black text-lg tracking-tight",
                  stage.state === 'future' ? "text-neutral-400" : "text-neutral-900"
                )}>
                  {name}
                </h4>
                {stage.state === 'current' && (
                  <span className="px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-tighter bg-amber-50 text-amber-700 border border-amber-100/50 animate-pulse">
                    المرحلة الحالية
                  </span>
                )}
              </div>

              <div className="space-y-4">
                {stage.completedAt && (
                  <div className="flex items-center gap-2 text-[11px] font-bold text-neutral-400 bg-neutral-50 px-3 py-1.5 rounded-xl border border-neutral-100 w-fit">
                    <Clock className="w-3.5 h-3.5" />
                    {new Date(stage.completedAt).toLocaleDateString('ar-YE', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </div>
                )}

                {stage.outcomeNote && stage.state !== 'future' && (
                  <motion.div 
                    initial={{ opacity: 0, y: 5 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    className={cn(
                      "text-sm p-5 rounded-[1.5rem] border font-bold leading-relaxed max-w-3xl",
                      stage.state === 'failed' ? "bg-red-50 border-red-100 text-red-700 shadow-sm" : "bg-neutral-50/50 border-neutral-200/50 text-neutral-600"
                    )}
                  >
                    {stage.outcomeNote}
                  </motion.div>
                )}

                {stage.actorName && (
                  <div className="flex items-center gap-3 text-[10px] text-neutral-400 font-black uppercase tracking-widest bg-white p-2 rounded-lg border border-neutral-50 w-fit">
                    <UserCheck className="w-3.5 h-3.5 text-primary-600" />
                    <span>تم التدقيق بواسطة: {stage.actorName}</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-neutral-200 mx-1" />
                    <span>{stage.actorRole}</span>
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
