'use client';

import { useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useWizardStore } from '@/stores/wizard-store';
import { useApplicationWizard } from '@/hooks/useApplicationWizard';
import { useWizardAutoSave } from '@/hooks/useWizardAutoSave';
import { WizardProgressBar } from './WizardProgressBar';
import { WizardNavButtons } from './WizardNavButtons';
import Step1ServiceSelection from './steps/Step1ServiceSelection';
import { Step2LicenseCategory } from './steps/Step2LicenseCategory';
import Step3PersonalInfo from './steps/Step3PersonalInfo';
import Step4ApplicationDetails from './steps/Step4ApplicationDetails';
import { Step5ReviewSubmit } from './steps/Step5ReviewSubmit';
import { AutoSaveIndicator } from './shared/AutoSaveIndicator';
import { ShieldCheck, Info } from 'lucide-react';

const steps = [
  Step1ServiceSelection,
  Step2LicenseCategory,
  Step3PersonalInfo,
  Step4ApplicationDetails,
  Step5ReviewSubmit,
];

export function WizardShell() {
  const { currentStep, isSaving } = useWizardStore();
  const { goTo, direction } = useApplicationWizard();
  
  // Initialize auto-save functionality
  useWizardAutoSave();

  // Prevent accidental navigation
  const handleBeforeUnload = useCallback((e: BeforeUnloadEvent) => {
    if (isSaving) {
      e.preventDefault();
      e.returnValue = '';
      return '';
    }
  }, [isSaving]);

  useEffect(() => {
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [handleBeforeUnload]);

  // Get step component
  const StepComponent = steps[currentStep - 1];

  return (
    <div className="w-full max-w-4xl mx-auto p-4 md:p-6 font-arabic" dir="rtl">
      {/* Progress Architecture */}
      <div className="mb-10 md:mb-12 lg:mb-16 space-y-6 md:space-y-10">
        <WizardProgressBar currentStep={currentStep} onStepClick={goTo} />
        
        {/* Institutional Feedback Row */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 md:gap-6 px-4 md:px-8 py-3 md:py-4 bg-white border border-neutral-100 rounded-xl md:rounded-2xl lg:rounded-[2rem] shadow-sm">
            <div className="flex items-center gap-3 md:gap-4 text-[10px] md:text-xs font-black text-neutral-400">
                <ShieldCheck className="w-4 h-4 md:w-5 md:h-5 text-emerald-500" />
                <span>نظام توثيق البيانات الموحد نشط</span>
            </div>
            <div className="h-5 md:h-6">
                <AutoSaveIndicator />
            </div>
            <div className="flex items-center gap-2 md:gap-3 text-[10px] md:text-xs font-black text-[#1a3a8f]/60">
                <Info className="w-3.5 h-3.5 md:w-4 md:h-4" />
                <span>الخطوة {currentStep} من ٥</span>
            </div>
        </div>
      </div>

       {/* Master Stage Content */}
       <div className="mb-16 md:mb-20 lg:mb-24 min-h-[500px] md:min-h-[600px] relative">
         <AnimatePresence mode="wait" custom={direction}>
           <motion.div
             key={currentStep}
             custom={direction}
             initial={{ opacity: 0, x: direction * 80, scale: 0.98 }}
             animate={{ opacity: 1, x: 0, scale: 1 }}
             exit={{ opacity: 0, x: direction * -80, scale: 0.98 }}
             transition={{ 
               type: "spring",
               stiffness: 300,
               damping: 30,
             }}
             className="w-full"
           >
             {StepComponent && <StepComponent />}
           </motion.div>
         </AnimatePresence>
       </div>

      {/* Control Actions */}
      <div className="sticky bottom-10 z-30">
          {/* Subtle Glow Background for Sticky Buttons */}
          <div className="absolute -inset-x-20 bottom-0 h-40 bg-gradient-to-t from-[#f8fafc] via-[#f8fafc]/80 to-transparent -z-10 pointer-events-none" />
          <WizardNavButtons />
      </div>
    </div>
  );
}