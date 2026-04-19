'use client';

import { useTranslations } from 'next-intl';
import { cn } from '@/lib/utils';
import { CheckCircle2, ChevronLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import type { StepId } from '@/types/wizard.types';

interface WizardProgressBarProps {
  currentStep: number;
  onStepClick: (step: StepId) => void;
}

const STEPS: { num: number; key: string }[] = [
  { num: 1, key: 'steps.service' },
  { num: 2, key: 'steps.category' },
  { num: 3, key: 'steps.personal' },
  { num: 4, key: 'steps.details' },
  { num: 5, key: 'steps.review' },
];


export function WizardProgressBar({ currentStep, onStepClick }: WizardProgressBarProps) {
  const t = useTranslations('wizard');

  const getStepStatus = (stepNum: number): 'completed' | 'current' | 'upcoming' => {
    if (stepNum < currentStep) return 'completed';
    if (stepNum === currentStep) return 'current';
    return 'upcoming';
  };

  const handleStepClick = (stepNum: number) => {
    // Allow clicking on completed steps only
    if (stepNum < currentStep) {
      onStepClick(stepNum as StepId);
    }
  };

  return (
    <div className="w-full">
      {/* Mobile: Vertical stack with glass panels */}
      <div className="block lg:hidden space-y-3">
        {STEPS.map((step) => {
          const status = getStepStatus(step.num);
          const isClickable = status === 'completed';

          return (
            <motion.div
              key={step.num}
              initial={false}
              animate={{
                scale: status === 'current' ? 1 : 0.98,
                opacity: status === 'upcoming' ? 0.6 : 1
              }}
              className={cn(
                'p-4 rounded-2xl border transition-all duration-300',
                status === 'completed' && 'bg-white/5 border-white/10 cursor-pointer hover:bg-white/10',
                status === 'current' && 'bg-primary-600/10 border-primary-500/50 shadow-[0_0_20px_rgba(0,108,53,0.1)]',
                status === 'upcoming' && 'bg-black/20 border-white/5 cursor-not-allowed grayscale'
              )}
              onClick={isClickable ? () => handleStepClick(step.num) : undefined}
            >
              <div className="flex items-center gap-4">
                <div className="relative">
                  {status === 'completed' ? (
                    <div className="w-10 h-10 rounded-xl bg-primary-600 flex items-center justify-center shadow-lg shadow-primary-900/40">
                      <CheckCircle2 className="w-5 h-5 text-white" />
                    </div>
                  ) : (
                    <div className={cn(
                      "w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm transition-all duration-500",
                      status === 'current' ? "bg-white text-primary-900 shadow-xl" : "bg-white/10 text-neutral-500"
                    )}>
                      {step.num}
                    </div>
                  )}
                  {status === 'current' && (
                    <span className="absolute -inset-1 rounded-[1.2rem] border border-primary-400/50 animate-pulse-slow" />
                  )}
                </div>

                <div className="flex-1">
                  <span className={cn(
                    'text-sm font-black uppercase tracking-widest',
                    status === 'current' ? 'text-white' : 'text-neutral-500'
                  )}>
                    {t(step.key)}
                  </span>
                </div>

                {isClickable && (
                  <ChevronLeft className="w-4 h-4 text-primary-400 group-hover:translate-x-1 transition-transform rtl:rotate-180" />
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Desktop: Horizontal glass stepper */}
      <div className="hidden lg:flex items-center justify-between bg-black/40 backdrop-blur-2xl p-2 rounded-2xl border border-white/5">
        {STEPS.map((step, index) => {
          const status = getStepStatus(step.num);
          const isClickable = status === 'completed';

          return (
            <div key={step.num} className="flex items-center flex-1 last:flex-none group">
              {/* Step indicator wrapper */}
              <button
                type="button"
                onClick={isClickable ? () => handleStepClick(step.num) : undefined}
                className={cn(
                  'relative z-10 flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-500',
                  status === 'current' && 'bg-primary-600 shadow-[0_4px_20px_rgba(0,108,53,0.4)]',
                  isClickable && 'hover:bg-white/5 cursor-pointer',
                  status === 'upcoming' && 'opacity-40 grayscale cursor-not-allowed'
                )}
              >
                {/* Step circle */}
                <div
                  className={cn(
                    'w-9 h-9 rounded-lg flex items-center justify-center font-black text-sm transition-all duration-500',
                    status === 'current' && 'bg-white text-primary-900 shadow-xl',
                    status === 'completed' && 'bg-primary-600/20 text-primary-400 border border-primary-500/30',
                    status === 'upcoming' && 'bg-white/10 text-neutral-500 font-medium'
                  )}
                >
                  {status === 'completed' ? (
                    <CheckCircle2 className="w-5 h-5" />
                  ) : (
                    step.num
                  )}
                </div>

                {/* Step labels */}
                <div className="text-start">
                   <p className={cn(
                     'text-[10px] uppercase font-black tracking-widest leading-none mb-1',
                     status === 'current' ? 'text-primary-100' : 'text-neutral-500'
                   )}>
                     {t('step')} {step.num}
                   </p>
                   <p className={cn(
                     'font-black text-sm whitespace-nowrap',
                     status === 'current' ? 'text-white' : 'text-neutral-400'
                   )}>
                     {t(step.key)}
                   </p>
                </div>
                
                {status === 'current' && (
                  <span className="absolute -inset-0.5 rounded-[0.9rem] border border-white/20 animate-pulse-slow" />
                )}
              </button>

              {/* Connector gradient line */}
              {index < STEPS.length - 1 && (
                <div className="flex-1 px-4">
                  <div className="h-0.5 w-full bg-white/5 rounded-full relative overflow-hidden">
                    <motion.div 
                      initial={false}
                      animate={{ 
                        width: status === 'completed' ? '100%' : '0%',
                        opacity: status === 'completed' ? 1 : 0
                      }}
                      className="absolute inset-0 bg-gradient-to-r from-primary-600 to-primary-400 shadow-[0_0_8px_rgba(0,108,53,0.5)]"
                    />
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}