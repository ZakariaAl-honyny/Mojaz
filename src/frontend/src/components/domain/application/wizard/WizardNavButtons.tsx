'use client';

import { useWizardStore } from '@/stores/wizard-store';
import { useApplicationWizard } from '@/hooks/useApplicationWizard';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Send, Save, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

export function WizardNavButtons() {
  const t = useTranslations('wizard');
  const { currentStep, isSaving, declarationAccepted } = useWizardStore();
  const { goBack, goNext, submit, isSubmitting } = useApplicationWizard();

  const isFirstStep = currentStep === 1;
  const isLastStep = currentStep === 5;
  const isLoading = isSubmitting || isSaving;

  const handleBack = () => {
    goBack();
  };

  const handleNext = async () => {
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
    <div className="sticky bottom-0 z-20 w-full mt-10 -mx-4 px-4 py-6 bg-white/80 dark:bg-neutral-950/80 backdrop-blur-md border-t border-neutral-200 dark:border-neutral-800 transition-all duration-300">
      <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
        {/* Back button */}
        <div className={cn(isFirstStep ? 'invisible' : 'visible')}>
          <Button
            variant="ghost"
            onClick={handleBack}
            disabled={isLoading}
            className="group flex items-center gap-2 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors"
          >
            <ChevronLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1 rtl:rotate-180 rtl:group-hover:translate-x-1" />
            <span className="font-medium">{t('navigation.back')}</span>
          </Button>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-4">
          {!isLastStep && (
            <Button
              variant="ghost"
              disabled={isLoading}
              className="hidden sm:flex items-center gap-2 text-neutral-500 hover:text-primary-600 dark:hover:text-primary-400"
            >
              <Save className="w-4 h-4" />
              <span className="text-sm font-medium">{t('navigation.saveDraft')}</span>
            </Button>
          )}

          {isSaving && !isSubmitting && (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-neutral-100 dark:bg-neutral-800 animate-in fade-in slide-in-from-bottom-1">
              <Loader2 className="w-3 h-3 animate-spin text-neutral-500" />
              <span className="text-xs text-neutral-500 font-medium">{t('autoSave.saving')}</span>
            </div>
          )}

          {!isLastStep ? (
            <Button
              onClick={handleNext}
              disabled={isLoading}
              size="lg"
              className={cn(
                "group relative min-w-[140px] bg-primary-600 hover:bg-primary-700 text-white font-semibold transition-all duration-300",
                "shadow-lg shadow-primary-600/20 hover:shadow-primary-600/30",
                "rounded-gov overflow-hidden"
              )}
            >
              <span className="relative z-10 flex items-center gap-2">
                {t('navigation.next')}
                <ChevronRight className="w-5 h-5 transition-transform group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1" />
              </span>
              <motion.div 
                className="absolute inset-0 bg-white/10 dark:bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity" 
                initial={false}
              />
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={isLoading || !declarationAccepted}
              size="lg"
              className={cn(
                "group min-w-[160px] bg-primary-600 hover:bg-primary-700 disabled:bg-neutral-200 dark:disabled:bg-neutral-800 text-white font-bold transition-all duration-300",
                "shadow-xl shadow-primary-600/20 hover:shadow-primary-600/40",
                "rounded-gov"
              )}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin me-2" />
                  {t('step5.submitting')}
                </>
              ) : (
                <>
                  <Send className="w-5 h-5 me-2 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  {t('step5.submit')}
                </>
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}