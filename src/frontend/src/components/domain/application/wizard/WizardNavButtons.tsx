'use client';

import { useWizardStore } from '@/stores/wizard-store';
import { useApplicationWizard } from '@/hooks/useApplicationWizard';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Send, Save } from 'lucide-react';
import { cn } from '@/lib/utils';

export function WizardNavButtons() {
  const t = useTranslations('wizard');
  const { currentStep, isSaving } = useWizardStore();
  const { goBack, goNext, submit, isSubmitting } = useApplicationWizard();

  const isFirstStep = currentStep === 1;
  const isLastStep = currentStep === 5;

  const isLoading = isSubmitting || isSaving;

  const handleBack = () => {
    goBack();
  };

  const handleNext = async () => {
    // Get form instance from the current step to access trigger and setFocus
    const stepForms = {
      1: (window as any).__step1Form,
      2: (window as any).__step2Form,
      3: (window as any).__step3Form,
      4: (window as any).__step4Form,
    };
    
    const form = stepForms[currentStep as keyof typeof stepForms];
    const trigger = form?.trigger;
    const setFocus = form?.setFocus;
    
    await goNext(trigger, setFocus);
  };

  const handleSubmit = async () => {
    await submit();
  };

  return (
    <div
      className={cn(
        'flex items-center justify-between border-t border-neutral-100 dark:border-neutral-800 pt-6',
        'rtl:flex-row-reverse' // RTL: Back on right, Next on left
      )}
    >
      {/* Back button - hidden on Step 1 */}
      <div className={cn('rtl:order-2', !isFirstStep && 'visible', isFirstStep && 'invisible')}>
        <Button
          variant="outline"
          onClick={handleBack}
          disabled={isLoading}
          className={cn(
            'border-neutral-200 dark:border-neutral-700',
            'hover:bg-neutral-50 dark:hover:bg-neutral-800',
            'rtl:flex-row-reverse'
          )}
        >
          <ChevronLeft className={cn('w-4 h-4', 'rtl:rotate-180', 'rtl:me-2', 'rtl:ms-0', 'me-2')} />
          {t('navigation.back')}
        </Button>
      </div>

      {/* Right side: Save Draft (optional) + Next/Submit */}
      <div
        className={cn(
          'flex items-center gap-4',
          'rtl:flex-row-reverse'
        )}
      >
        {/* Save Draft button (always visible except on Step 5 where we have submit) */}
        {!isLastStep && (
          <Button
            variant="ghost"
            disabled={isLoading}
            className={cn(
              'text-neutral-600 dark:text-neutral-400',
              'hover:text-primary-500 dark:hover:text-primary-400',
              'hover:bg-neutral-100 dark:hover:bg-neutral-800'
            )}
          >
            <Save className={cn('w-4 h-4', 'rtl:me-2', 'me-2')} />
            {t('navigation.saveDraft')}
          </Button>
        )}

        {/* Auto-save indicator */}
        {isSaving && (
          <span className="text-sm text-neutral-500 dark:text-neutral-400">
            {t('autoSave.saving')}
          </span>
        )}

        {/* Next or Submit button */}
        {!isLastStep ? (
          <Button
            onClick={handleNext}
            disabled={isLoading}
            className={cn(
              'bg-primary-500 hover:bg-primary-600',
              'dark:bg-primary-600 dark:hover:bg-primary-700',
              'text-white',
              'shadow-lg shadow-primary-500/20',
              'disabled:opacity-50 disabled:cursor-not-allowed',
              'rtl:flex-row-reverse'
            )}
          >
            {isSaving ? (
              <span className="flex items-center">
                <svg
                  className={cn('animate-spin', 'rtl:-me-1', 'rtl:ms-2', '-me-1', 'me-2')}
                  h-4
                  w-4
                  text-white
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  />
                </svg>
                {t('autoSave.saving')}
              </span>
            ) : (
              <>
                {t('navigation.next')}
                <ChevronRight className={cn('w-4 h-4', 'rtl:rotate-180', 'rtl:ms-2', 'rtl:me-0', 'ms-2')} />
              </>
            )}
          </Button>
        ) : (
          <Button
            onClick={handleSubmit}
            disabled={isLoading}
            className={cn(
              'bg-primary-500 hover:bg-primary-600',
              'dark:bg-primary-600 dark:hover:bg-primary-700',
              'text-white',
              'shadow-lg shadow-primary-500/20',
              'disabled:opacity-50 disabled:cursor-not-allowed',
              'rtl:flex-row-reverse'
            )}
          >
            {isSubmitting ? (
              <span className="flex items-center">
                <svg
                  className={cn('animate-spin', 'rtl:-me-1', 'rtl:ms-2', '-me-1', 'me-2')}
                  h-4
                  w-4
                  text-white
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  />
                </svg>
                {t('step5.submitting')}
              </span>
            ) : (
              <>
                <Send className={cn('w-4 h-4', 'rtl:me-2', 'me-2')} />
                {t('step5.submit')}
              </>
            )}
          </Button>
        )}
      </div>
    </div>
  );
}