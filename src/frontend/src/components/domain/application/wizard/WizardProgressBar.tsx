'use client';

import { cn } from '@/lib/utils';
import { Check, ShieldCheck } from 'lucide-react';
import type { StepId } from '@/types/wizard.types';
import { motion } from 'framer-motion';

interface WizardProgressBarProps {
  currentStep: number;
  onStepClick: (step: StepId) => void;
}

const STEPS = [
  { num: 1, label: 'نوع الخدمة' },
  { num: 2, label: 'فئة الرخصة' },
  { num: 3, label: 'بيانات المتقدم' },
  { num: 4, label: 'تفاصيل الطلب' },
  { num: 5, label: 'المراجعة والتقديم' },
];

export function WizardProgressBar({ currentStep, onStepClick }: WizardProgressBarProps) {
  const getStepStatus = (stepNum: number): 'completed' | 'current' | 'upcoming' => {
    if (stepNum < currentStep) return 'completed';
    if (stepNum === currentStep) return 'current';
    return 'upcoming';
  };

  return (
    <div className="w-full font-arabic" dir="rtl">
      {/* Desktop: Horizontal stepper - compact version */}
      <div className="hidden sm:flex items-center justify-between relative px-4 py-6 bg-white rounded-xl border border-neutral-100 shadow-sm overflow-hidden">
        {/* Background subtle pattern */}
        <div className="absolute inset-0 opacity-[0.02] pointer-events-none">
            <div className="absolute top-0 inset-inline-start-0 w-full h-full bg-[radial-gradient(#1a3a8f_1px,transparent_1px)] [background-size:16px_16px]" />
        </div>

        {/* Progress line */}
        <div className="absolute top-[26px] sm:top-[28px] inset-inline-start-[60px] inset-inline-end-[60px] h-0.5 bg-neutral-100 rounded-full z-0">
            <motion.div 
               className="h-full bg-primary rounded-full z-0"
               initial={{ scaleX: 0 }}
               animate={{ scaleX: (currentStep - 1) / (STEPS.length - 1) }}
               transition={{ duration: 0.8, ease: "circOut" }}
               style={{ width: '100%' }}
            />
        </div>

        {STEPS.map((step) => {
          const status = getStepStatus(step.num);
          const isClickable = status === 'completed';

          return (
            <div key={step.num} className="relative z-10 flex flex-col items-center">
              <button
                type="button"
                onClick={() => isClickable && onStepClick(step.num as StepId)}
                disabled={!isClickable}
                className={cn(
                  'w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-lg flex items-center justify-center transition-all duration-500 relative',
                  status === 'current' && 'bg-primary text-white shadow-lg shadow-primary/25 scale-105',
                  status === 'completed' && 'bg-primary text-white border-2 border-primary/20',
                  status === 'upcoming' && 'bg-neutral-50 text-neutral-300 border border-neutral-100 cursor-not-allowed opacity-40'
                )}
              >
                {status === 'completed' ? (
                  <Check className="w-4 h-4 sm:w-5 sm:h-5 stroke-[3px]" />
                ) : (
                  <span className="text-xs sm:text-sm font-bold">{step.num}</span>
                )}
              </button>

              {/* Step label - hidden on mobile, visible on sm+ */}
              <div className="absolute top-10 sm:top-11 md:top-12 text-center w-16 sm:w-20 md:w-24">
                <span className={cn(
                  'text-[9px] sm:text-[10px] font-bold transition-all duration-500 block hidden sm:block',
                  status === 'current' && 'text-primary',
                  status === 'completed' && 'text-neutral-500',
                  status === 'upcoming' && 'text-neutral-300'
                )}>
                  {step.label}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Mobile: Compact progress bar */}
      <div className="sm:hidden space-y-3">
        <div className="flex items-center h-1.5 bg-neutral-100 rounded-full overflow-hidden">
           {STEPS.map((step) => {
             const isCurrent = step.num === currentStep;
             const isCompleted = step.num < currentStep;
             return (
               <div 
                 key={step.num}
                 className={cn(
                   "h-full flex-1 transition-all duration-500",
                   isCurrent ? "bg-primary" : isCompleted ? "bg-primary/60" : "bg-transparent"
                 )}
               />
             )
           })}
        </div>
        
        {/* Mobile step indicator */}
        <div className="flex items-center justify-between p-3 bg-white rounded-xl border border-neutral-100">
           <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-primary text-white rounded-lg flex items-center justify-center font-bold text-sm shadow-md">
                 {currentStep}
              </div>
              <div className="space-y-0.5">
                 <span className="text-[8px] font-bold text-primary uppercase tracking-wider block opacity-60">المرحلة</span>
                 <span className="text-sm font-bold text-primary">
                    {STEPS.find(s => s.num === currentStep)?.label}
                 </span>
              </div>
           </div>
           
           <div className="w-8 h-8 rounded-lg bg-neutral-50 flex items-center justify-center text-neutral-300">
              <ShieldCheck className="w-4 h-4" />
           </div>
        </div>
      </div>
    </div>
  );
}