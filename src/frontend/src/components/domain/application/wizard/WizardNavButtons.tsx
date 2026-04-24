'use client';

import { useWizardStore } from '@/stores/wizard-store';
import { useApplicationWizard } from '@/hooks/useApplicationWizard';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Send, Save, Loader2, ArrowRight, ArrowLeft, SendHorizonal, ShieldCheck, BookmarkCheck } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

export function WizardNavButtons() {
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
    <div className="w-full flex items-center justify-between gap-8 py-10 px-10 bg-white/60 backdrop-blur-3xl rounded-[2.5rem] border border-white shadow-[0_-10px_50px_-20px_rgba(26,58,143,0.1)] transition-all duration-700 font-arabic group" dir="rtl">
      {/* Dynamic Background Glow */}
      <div className="absolute inset-0 bg-gradient-to-l from-transparent via-[#1a3a8f]/5 to-transparent rounded-[2.5rem] -z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />

      {/* Back Control */}
      <div className={cn("transition-all duration-500", isFirstStep ? 'opacity-0 pointer-events-none' : 'opacity-100')}>
        <Button
          variant="ghost"
          onClick={handleBack}
          disabled={isLoading}
          className="h-10 md:h-12 px-6 md:px-8 rounded-md font-black text-sm md:text-base transition-all duration-500"
        >
          <div className="w-8 h-8 md:w-9 md:h-9 rounded-md bg-neutral-50 flex items-center justify-center transition-transform group-hover:-translate-x-1">
            <ArrowRight className="w-4 h-4 md:w-5 md:h-5" />
          </div>
          <span className="text-sm md:text-base">الخطوة السابقة</span>
        </Button>
      </div>

      {/* Primary Actions Container */}
      <div className="flex items-center gap-8">
        <AnimatePresence mode="wait">
            {!isLastStep && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                >
                    <Button
                        variant="ghost"
                        disabled={isLoading}
                        className="hidden md:flex h-10 md:h-12 px-5 md:px-6 rounded-md items-center gap-3 text-sm md:text-base text-neutral-400 hover:text-emerald-600 font-black transition-all hover:bg-emerald-50 border border-transparent hover:border-emerald-100"
                    >
                        <BookmarkCheck className="w-4 h-4 md:w-5 md:h-5" />
                        <span className="text-sm md:text-base">حفظ المسودة</span>
                    </Button>
                </motion.div>
            )}
        </AnimatePresence>

        <AnimatePresence mode="wait">
            {!isLastStep ? (
                <motion.div
                    key="next-btn"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                >
                    <Button
                        onClick={handleNext}
                        disabled={isLoading}
                        className={cn(
                            "group h-10 md:h-12 px-6 md:px-8 rounded-md bg-[#1a3a8f] hover:bg-[#00215a] text-white font-black text-sm md:text-base transition-all duration-500",
                            "flex items-center gap-3 md:gap-4 ring-0"
                        )}
                    >
                        {isLoading ? (
                            <Loader2 className="w-5 h-5 md:w-6 md:h-6 animate-spin" />
                        ) : (
                            <>
                                <span className="text-sm md:text-base">الانتقال للمرحلة التالية</span>
                                <div className="w-8 h-8 md:w-10 md:h-10 rounded-md bg-white/20 flex items-center justify-center transition-transform group-hover:-translate-x-1">
                                    <ArrowLeft className="w-4 h-4 md:w-5 md:h-5" />
                                </div>
                            </>
                        )}
                    </Button>
                </motion.div>
            ) : (
                <motion.div
                    key="submit-btn"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                >
                    <Button
                        onClick={handleSubmit}
                        disabled={isLoading || !declarationAccepted}
                        className={cn(
                            "group h-10 md:h-12 px-6 md:px-8 rounded-md bg-[#1a3a8f] text-white font-black text-sm md:text-base transition-all duration-500 hover:bg-emerald-600 disabled:bg-neutral-100 disabled:text-neutral-300 disabled:shadow-none disabled:border-neutral-200",
                            "flex items-center gap-3 md:gap-4 ring-0"
                        )}
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 className="w-5 h-5 md:w-6 md:h-6 animate-spin" />
                                <span className="text-sm md:text-base">جاري تقديم الطلب سيادياً...</span>
                            </>
                        ) : (
                            <>
                                <div className="flex flex-col items-start leading-none gap-1">
                                    <span className="text-sm md:text-base">إرسال الطلب النهائي</span>
                                    <span className="text-xs opacity-60 uppercase tracking-widest">الموافقة والمراجعة</span>
                                </div>
                                <div className="w-8 h-8 md:w-10 md:h-10 rounded-md bg-white/20 flex items-center justify-center transition-transform group-hover:rotate-12">
                                    <SendHorizonal className="w-4 h-4 md:w-5 md:h-5" />
                                </div>
                            </>
                        )}
                    </Button>
                </motion.div>
            )}
        </AnimatePresence>
      </div>
    </div>
  );
}