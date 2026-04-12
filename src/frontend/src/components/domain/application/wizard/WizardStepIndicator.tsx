'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useWizardStore } from '@/stores/wizard-store';
import { StepId } from '@/types/wizard.types';

const steps: { id: StepId; key: string }[] = [
  { id: 1, key: 'service' },
  { id: 2, key: 'category' },
  { id: 3, key: 'personal' },
  { id: 4, key: 'details' },
  { id: 5, key: 'review' },
];

export default function WizardStepIndicator() {
  const t = useTranslations('wizard.steps');
  const currentStep = useWizardStore((state) => state.currentStep);
  const completedSteps = useWizardStore((state) => state.completedSteps);
  const goTo = useWizardStore((state) => state.goTo);

  return (
    <nav aria-label="Progress" className="relative">
      <ol role="list" className="flex items-center justify-between w-full">
        {steps.map((step, index) => {
          const isCompleted = completedSteps.includes(step.id);
          const isCurrent = currentStep === step.id;
          const isUpcoming = !isCompleted && !isCurrent;

          return (
            <li key={step.id} className={cn("relative", index !== steps.length - 1 ? "flex-1" : "")}>
              <div className="flex flex-col items-center group">
                {/* Connector Line */}
                {index !== 0 && (
                  <div 
                    className={cn(
                      "absolute top-5 -inset-inline-start-1/2 w-full h-[2px] -z-10",
                      isCompleted ? "bg-primary-500" : "bg-neutral-200 dark:bg-neutral-800"
                    )} 
                  />
                )}

                {/* Step Circle */}
                <button
                  onClick={() => (isCompleted || isCurrent) && goTo(step.id)}
                  disabled={isUpcoming}
                  className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300",
                    isCompleted 
                      ? "bg-primary-500 border-primary-500 text-white" 
                      : isCurrent 
                        ? "bg-white dark:bg-neutral-900 border-primary-500 text-primary-500 ring-4 ring-primary-50"
                        : "bg-white dark:bg-neutral-900 border-neutral-300 dark:border-neutral-700 text-neutral-400 cursor-not-allowed"
                  )}
                >
                  {isCompleted ? (
                    <Check className="w-5 h-5 stroke-[3px]" />
                  ) : (
                    <span className="text-sm font-bold">{step.id}</span>
                  )}
                </button>

                {/* Step Label */}
                <span 
                  className={cn(
                    "mt-3 text-xs font-medium text-center transition-colors duration-300 hidden sm:block",
                    isCurrent ? "text-primary-600 font-bold" : isCompleted ? "text-neutral-900 dark:text-neutral-100" : "text-neutral-400"
                  )}
                >
                  {t(`${step.key}.label`)}
                </span>
              </div>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
