'use client';

import React from 'react';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useWizardStore } from '@/stores/wizard-store';
import { StepId } from '@/types/wizard.types';
import { AnimatePresence, motion } from 'framer-motion';

const steps: { id: StepId; label: string }[] = [
  { id: 1, label: 'نوع المسار' },
  { id: 2, label: 'فئة المعاملة' },
  { id: 3, label: 'سجل الهوية' },
  { id: 4, label: 'تفضيلات الفحص' },
  { id: 5, label: 'التدقيق النهائي' },
];

export default function WizardStepIndicator() {
  const currentStep = useWizardStore((state) => state.currentStep);
  const completedSteps = useWizardStore((state) => state.completedSteps);
  const goTo = useWizardStore((state) => state.goTo);

  return (
    <nav aria-label="Progress" className="relative font-arabic w-full" dir="rtl">
      <ol role="list" className="flex items-center justify-between w-full relative">
        {/* Track line */}
        <div className="absolute top-4 sm:top-5 inset-inline-start-[40px] inset-inline-end-[40px] h-0.5 bg-neutral-100 -z-10" />

        {steps.map((step, index) => {
          const isCompleted = completedSteps.includes(step.id) || step.id < currentStep;
          const isCurrent = currentStep === step.id;
          const isUpcoming = !isCompleted && !isCurrent;

          return (
            <li key={step.id} className={cn("relative flex flex-col items-center", index !== steps.length - 1 ? "flex-1" : "")}>
              <div className="flex flex-col items-center relative">
                {/* Progress line segment */}
                {index !== 0 && (isCompleted || isCurrent) && (
                  <motion.div 
                    className="absolute top-4 sm:top-5 -inset-inline-start-1/2 w-full h-0.5 bg-primary -z-10 origin-end rounded-full"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 0.5, ease: "circOut" }}
                  />
                )}

                {/* Pulse indicator for current step */}
                <AnimatePresence>
                    {isCurrent && (
                        <motion.div 
                           initial={{ scale: 0.8, opacity: 0 }}
                           animate={{ scale: 1.8, opacity: 0.1 }}
                           exit={{ scale: 2, opacity: 0 }}
                           transition={{ duration: 2, repeat: Infinity }}
                           className="absolute top-0 w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-primary -z-10"
                        />
                    )}
                </AnimatePresence>

                {/* Step circle button */}
                <button
                  type="button"
                  onClick={() => (isCompleted || isCurrent) && goTo(step.id)}
                  disabled={isUpcoming}
                  className={cn(
                    "w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-lg flex items-center justify-center transition-all duration-500 relative",
                    isCompleted 
                      ? "bg-primary text-white shadow-md" 
                      : isCurrent 
                        ? "bg-white border-2 border-primary text-primary shadow-lg scale-105"
                        : "bg-neutral-50 text-neutral-300 border border-neutral-100 cursor-not-allowed opacity-40"
                  )}
                >
                  <div className="relative z-10 flex items-center justify-center">
                    {isCompleted ? (
                      <Check className="w-4 h-4 sm:w-5 sm:h-5 stroke-[3px]" />
                    ) : (
                      <span className="text-xs sm:text-sm font-bold">{step.id}</span>
                    )}
                  </div>
                </button>

                {/* Step label - hidden on mobile, visible on sm+ */}
                <div className="absolute top-9 sm:top-10 md:top-11 flex flex-col items-center w-14 sm:w-16 md:w-20">
                    <span 
                      className={cn(
                        "text-[8px] sm:text-[9px] font-bold uppercase tracking-wider text-center transition-all duration-500 whitespace-nowrap hidden sm:block",
                        isCurrent ? "text-primary" : isCompleted ? "text-neutral-500" : "text-neutral-300"
                      )}
                    >
                      {step.label}
                    </span>
                </div>
              </div>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
