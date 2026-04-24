'use client';

import React from 'react';
import { ChevronLeft, ChevronRight, Loader2, SendHorizonal, ArrowRight, ArrowLeft } from 'lucide-react';
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
    <div className="flex items-center justify-between mt-16 pt-10 border-t border-neutral-100 font-arabic" dir="rtl">
      {/* Back Button */}
      {currentStep > 1 ? (
        <Button
          type="button"
          variant="ghost"
          onClick={handleBack}
          disabled={isSubmitting}
          className="group h-14 px-8 rounded-2xl flex items-center gap-3 font-black text-neutral-400 hover:text-neutral-900 hover:bg-neutral-100 transition-all duration-300"
        >
          <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
          السابق
        </Button>
      ) : (
        <div /> 
      )}

      {/* Next/Submit Button */}
      <Button
        onClick={onNext}
        disabled={isSubmitting || nextDisabled}
        className={cn(
          "group h-14 px-10 rounded-2xl flex items-center gap-4 font-black transition-all duration-500 shadow-xl",
          isLastStep 
            ? "bg-[#1a3a8f] text-white hover:bg-blue-900 shadow-blue-900/20" 
            : "bg-[#1a3a8f] text-white hover:bg-blue-900 shadow-blue-900/20"
        )}
      >
        {isSubmitting ? (
          <div className="flex items-center gap-3">
            <Loader2 className="w-5 h-5 animate-spin" />
            جاري المعالجة...
          </div>
        ) : (
          <div className="flex items-center gap-3">
            {isLastStep ? (
              <>
                <SendHorizonal className="w-5 h-5" />
                تقديم الطلب النهائي
              </>
            ) : (
              <>
                التالي
                <ArrowLeft className="w-5 h-5 transition-transform duration-300 group-hover:-translate-x-1" />
              </>
            )}
          </div>
        )}
      </Button>
    </div>
  );
}
