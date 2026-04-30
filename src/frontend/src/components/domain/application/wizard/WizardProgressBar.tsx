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
  { num: 1, label: 'الخدمة' },
  { num: 2, label: 'الفئة' },
  { num: 3, label: 'البيانات' },
  { num: 4, label: 'التفاصيل' },
  { num: 5, label: 'المراجعة' },
];

export function WizardProgressBar({ currentStep, onStepClick }: WizardProgressBarProps) {
  const getStepStatus = (stepNum: number): 'completed' | 'current' | 'upcoming' => {
    if (stepNum < currentStep) return 'completed';
    if (stepNum === currentStep) return 'current';
    return 'upcoming';
  };

  return (
    <div className="w-full font-arabic" dir="rtl">
      {/* Desktop: Horizontal stepper */}
      <div className="hidden sm:flex items-center justify-between relative px-3 py-4 bg-white rounded-lg border border-neutral-100 shadow-sm">
        {/* Progress line */}
        <div className="absolute top-1/2 inset-inline-start-[40px] inset-inline-end-[40px] h-0.5 bg-neutral-100">
            <motion.div 
               className="h-full bg-[#1a3a8f] rounded-full"
               initial={{ scaleX: 0 }}
               animate={{ scaleX: (currentStep - 1) / (STEPS.length - 1) }}
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
                  'w-7 h-7 rounded-md flex items-center justify-center transition-all text-xs font-bold',
                  status === 'current' && 'bg-[#1a3a8f] text-white shadow-md scale-105',
                  status === 'completed' && 'bg-[#1a3a8f] text-white border-2 border-[#1a3a8f]/20',
                  status === 'upcoming' && 'bg-neutral-100 text-neutral-300 cursor-not-allowed opacity-50'
                )}
              >
                {status === 'completed' ? (
                  <Check className="w-3.5 h-3.5 stroke-[3px]" />
                ) : (
                  step.num
                )}
              </button>
              <span className={cn(
                'text-[8px] font-medium mt-1 text-center hidden sm:block',
                status === 'current' && 'text-[#1a3a8f]',
                status === 'completed' && 'text-neutral-500',
                status === 'upcoming' && 'text-neutral-300'
              )}>
                {step.label}
              </span>
            </div>
          );
        })}
      </div>

      {/* Mobile: Compact bar */}
      <div className="sm:hidden">
        <div className="flex items-center h-1 bg-neutral-100 rounded-full overflow-hidden">
           {STEPS.map((step) => {
             const isCurrent = step.num === currentStep;
             const isCompleted = step.num < currentStep;
             return (
               <div 
                 key={step.num}
                 className={cn(
                   "h-full flex-1",
                   isCurrent ? "bg-[#1a3a8f]" : isCompleted ? "bg-[#1a3a8f]/60" : "bg-transparent"
                 )}
               />
             )
           })}
        </div>
        <div className="flex items-center justify-between p-2 bg-white rounded-lg border mt-2">
           <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-[#1a3a8f] text-white rounded flex items-center justify-center font-bold text-xs">
                 {currentStep}
              </div>
              <span className="text-xs font-bold text-[#1a3a8f]">
                  {STEPS.find(s => s.num === currentStep)?.label}
              </span>
           </div>
           <ShieldCheck className="w-3 h-3 text-neutral-300" />
        </div>
      </div>
    </div>
  );
}