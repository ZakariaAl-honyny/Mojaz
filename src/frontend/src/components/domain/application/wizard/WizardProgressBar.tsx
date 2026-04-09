'use client';

import { useTranslations } from 'next-intl';
import { cn } from '@/lib/utils';
import { CheckCircle2, ChevronLeft } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import type { StepId } from '@/types/wizard.types';

interface WizardProgressBarProps {
  currentStep: number;
  onStepClick: (step: StepId) => void;
}

const STEPS: { num: number; key: string }[] = [
  { num: 1, key: 'steps.step1' },
  { num: 2, key: 'steps.step2' },
  { num: 3, key: 'steps.step3' },
  { num: 4, key: 'steps.step4' },
  { num: 5, key: 'steps.step5' },
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
      {/* Mobile: Vertical stack with cards */}
      <div className="block lg:hidden space-y-2">
        {STEPS.map((step) => {
          const status = getStepStatus(step.num);
          const isClickable = status === 'completed';

          return (
            <Card
              key={step.num}
              className={cn(
                'transition-all duration-200',
                status === 'completed' && 'cursor-pointer border-neutral-200 dark:border-neutral-700 hover:border-primary-300 dark:hover:border-primary-700',
                status === 'current' && 'cursor-default border-primary-500 bg-primary-50 dark:bg-primary-900/20',
                status === 'upcoming' && 'cursor-not-allowed border-neutral-100 dark:border-neutral-800 opacity-60 pointer-events-none'
              )}
              onClick={isClickable ? () => handleStepClick(step.num) : undefined}
              aria-disabled={!isClickable}
            >
              <CardContent className="p-3 flex items-center gap-3">
                {/* Status icon - universal, no RTL flip */}
                <div className="flex-shrink-0">
                  {status === 'completed' ? (
                    <CheckCircle2 className="w-5 h-5 text-primary-500" />
                  ) : status === 'current' ? (
                    <div className="w-5 h-5 rounded-full bg-primary-500 text-white text-xs font-bold flex items-center justify-center">
                      {step.num}
                    </div>
                  ) : (
                    <div className="w-5 h-5 rounded-full bg-neutral-200 dark:bg-neutral-700 text-neutral-400 dark:text-neutral-500 text-xs font-bold flex items-center justify-center">
                      {step.num}
                    </div>
                  )}
                </div>

                {/* Step title */}
                <span
                  className={cn(
                    'text-sm font-medium',
                    status === 'current' && 'text-primary-700 dark:text-primary-300',
                    status === 'completed' && 'text-neutral-700 dark:text-neutral-300',
                    status === 'upcoming' && 'text-neutral-400 dark:text-neutral-500'
                  )}
                >
                  {t(step.key)}
                </span>

                {/* Arrow indicator for clickable */}
                {isClickable && (
                  <ChevronLeft className="w-4 h-4 ms-auto text-neutral-400 rtl:rotate-180" />
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Desktop: Horizontal stepper */}
      <div className="hidden lg:flex items-center justify-between">
        {STEPS.map((step, index) => {
          const status = getStepStatus(step.num);
          const isClickable = status === 'completed';

          return (
            <div key={step.num} className="flex items-center flex-1">
              {/* Step circle with clickable wrapper */}
              <button
                type="button"
                onClick={isClickable ? () => handleStepClick(step.num) : undefined}
                disabled={!isClickable}
                aria-disabled={!isClickable}
                className={cn(
                  'relative z-10 flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-300',
                  status === 'current' && 'bg-primary-50 dark:bg-primary-900/30 border-2 border-primary-500',
                  status === 'completed' && 'hover:bg-primary-50 dark:hover:bg-primary-900/20 cursor-pointer',
                  status === 'upcoming' && 'pointer-events-none cursor-not-allowed',
                  status === 'upcoming' && 'cursor-not-allowed'
                )}
              >
                {/* Step indicator */}
                <div
                  className={cn(
                    'w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300',
                    status === 'current' && 'bg-primary-500 text-white ring-4 ring-primary-100/50 dark:ring-primary-900/30',
                    status === 'completed' && 'bg-primary-100 dark:bg-primary-900/50 text-primary-600 dark:text-primary-400',
                    status === 'upcoming' && 'bg-neutral-100 dark:bg-neutral-800 text-neutral-400 dark:text-neutral-500'
                  )}
                >
                  {status === 'completed' ? (
                    <CheckCircle2 className="w-5 h-5" />
                  ) : (
                    step.num
                  )}
                </div>

                {/* Step label */}
                <span
                  className={cn(
                    'font-medium text-sm whitespace-nowrap',
                    status === 'current' && 'text-primary-700 dark:text-primary-300 font-semibold',
                    status === 'completed' && 'text-neutral-700 dark:text-neutral-300',
                    status === 'upcoming' && 'text-neutral-400 dark:text-neutral-500'
                  )}
                >
                  {t(step.key)}
                </span>
              </button>

              {/* Connector line */}
              {index < STEPS.length - 1 && (
                <div
                  className={cn(
                    'flex-1 h-0.5 mx-2 sm:mx-4 rounded transition-colors duration-300',
                    status === 'completed' || STEPS[index + 1].num <= currentStep
                      ? 'bg-primary-200 dark:bg-primary-800'
                      : 'bg-neutral-200 dark:bg-neutral-700'
                  )}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}