'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useWizardStore } from '@/stores/wizard-store';
import { cn } from '@/lib/utils';

interface WizardNavigationProps {
  onNext: () => void;
  onBack?: () => void;
  isSubmitting?: boolean;
  nextDisabled?: boolean;
}

export default function WizardNavigation({
  onNext,
  onBack,
  isSubmitting = false,
  nextDisabled = false,
}: WizardNavigationProps) {
  const t = useTranslations('wizard.navigation');
  const currentStep = useWizardStore((state) => state.currentStep);
  const goTo = useWizardStore((state) => state.goTo);

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else if (currentStep > 1) {
      goTo((currentStep - 1) as any);
    }
  };

  const isLastStep = currentStep === 5;

  return (
    <div className="flex items-center justify-between mt-10 pt-6 border-t border-neutral-100 dark:border-neutral-800">
      {/* Back Button */}
      {currentStep > 1 ? (
        <Button
          variant="outline"
          onClick={handleBack}
          disabled={isSubmitting}
          className="flex items-center gap-2"
        >
          <ChevronLeft className="w-4 h-4 rtl:rotate-180" />
          {t('back')}
        </Button>
      ) : (
        <div /> // Spacer
      )}

      {/* Next/Submit Button */}
      <Button
        onClick={onNext}
        disabled={isSubmitting || nextDisabled}
        className={cn(
          "min-w-32 flex items-center gap-2",
          isLastStep ? "bg-primary-600 hover:bg-primary-700" : ""
        )}
      >
        {isSubmitting ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            {t('processing')}
          </>
        ) : (
          <>
            {isLastStep ? t('submit') : t('next')}
            {!isLastStep && <ChevronRight className="w-4 h-4 rtl:rotate-180" />}
          </>
        )}
      </Button>
    </div>
  );
}
