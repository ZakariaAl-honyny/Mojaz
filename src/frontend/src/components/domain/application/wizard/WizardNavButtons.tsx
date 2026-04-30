'use client';

import { useWizardStore } from '@/stores/wizard-store';
import { useApplicationWizard } from '@/hooks/useApplicationWizard';
import { useApplicationMutation } from '@/hooks/useApplicationMutation';
import { Button } from '@/components/ui/button';
import { Send, Loader2, ArrowRight, ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

export function WizardNavButtons() {
  const { currentStep, isSaving, declarationAccepted, stepValidators, applicationId, step1, setApplicationId } = useWizardStore();
  const { goBack, goNext, submit, isSubmitting } = useApplicationWizard();
  const { createDraftAsync } = useApplicationMutation();
  const { toast } = useToast();

  const isFirstStep = currentStep === 1;
  const isLastStep = currentStep === 5;
  const isLoading = isSubmitting || isSaving;

  const handleBack = () => {
    goBack();
  };

  const handleNext = async () => {
    const form = stepValidators[currentStep as keyof typeof stepValidators];
    if (currentStep <= 4 && !form?.trigger) {
      return;
    }
    const trigger = form?.trigger;
    const setFocus = form?.setFocus;
    await goNext(trigger, setFocus);
  };

  const handleSubmit = async () => {
    if (!applicationId) {
      try {
        const newId = await createDraftAsync(step1.serviceType || 0);
        setApplicationId(newId);
      } catch (err) {
        toast({ variant: "destructive", title: "خطأ", description: "لم نتمكن من إنشاء الطلب" });
        return;
      }
    }
    
    if (!declarationAccepted) {
      toast({ variant: "destructive", title: "متطلبات الإرسال", description: "يرجى الموافقة على الإقرار" });
      return;
    }
    
    await submit();
  };

  return (
    <div className="w-full flex items-center justify-between gap-2 py-2 px-2 bg-white/80 backdrop-blur rounded-lg border border-neutral-100 font-arabic" dir="rtl">
      {/* Back */}
      <Button
        variant="ghost"
        onClick={handleBack}
        disabled={isLoading || isFirstStep}
        className={cn(
          "h-8 px-3 rounded-md text-xs font-bold",
          isFirstStep && "opacity-0 pointer-events-none"
        )}
      >
        <ArrowRight className="w-3 h-3 me-1" />
        <span>السابق</span>
      </Button>

      {/* Next / Submit */}
      {!isLastStep ? (
        <Button
          onClick={handleNext}
          disabled={isLoading || stepValidators[currentStep]?.isValid === false}
          className="h-8 px-4 rounded-md bg-[#1a3a8f] text-white text-xs font-bold"
        >
          {isLoading ? (
            <Loader2 className="w-3 h-3 animate-spin" />
          ) : (
            <>
              <span>التالي</span>
              <ArrowLeft className="w-3 h-3 ms-1" />
            </>
          )}
        </Button>
      ) : (
        <Button
          onClick={handleSubmit}
          disabled={isLoading}
          className="h-8 px-4 rounded-md bg-emerald-600 text-white text-xs font-bold"
        >
          {isSubmitting ? (
            <Loader2 className="w-3 h-3 animate-spin" />
          ) : (
            <>
              <span>إرسال</span>
              <Send className="w-3 h-3 ms-1" />
            </>
          )}
        </Button>
      )}
    </div>
  );
}