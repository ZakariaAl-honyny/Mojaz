'use client';

import { useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useWizardStore } from '@/stores/wizard-store';
import { useApplicationWizard } from '@/hooks/useApplicationWizard';
import { useWizardAutoSave } from '@/hooks/useWizardAutoSave';
import { useParams } from 'next/navigation';
import { WizardProgressBar } from './WizardProgressBar';
import { WizardNavButtons } from './WizardNavButtons';
import Step1ServiceSelection from './steps/Step1ServiceSelection';
import { Step2LicenseCategory } from './steps/Step2LicenseCategory';
import Step3PersonalInfo from './steps/Step3PersonalInfo';
import Step4ApplicationDetails from './steps/Step4ApplicationDetails';
import { Step5ReviewSubmit } from './steps/Step5ReviewSubmit';
import { AutoSaveIndicator } from './shared/AutoSaveIndicator';

const steps = [
  Step1ServiceSelection,
  Step2LicenseCategory,
  Step3PersonalInfo,
  Step4ApplicationDetails,
  Step5ReviewSubmit,
];

export function WizardShell() {
  const params = useParams();
  const locale = (params.locale as string) || 'ar';
  const isRTL = locale === 'ar';
  const { currentStep, isSaving } = useWizardStore();
  const { goTo, direction } = useApplicationWizard();
  
  // RTL multiplier: invert X direction for RTL
  const rtlMultiplier = isRTL ? -1 : 1;
  
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
    <div className="w-full max-w-4xl mx-auto">
      {/* Progress Bar */}
      <WizardProgressBar currentStep={currentStep} onStepClick={goTo} />

      {/* Auto-save indicator */}
      <div className="mt-4">
        <AutoSaveIndicator />
      </div>

       {/* Step Content */}
       <div className="mt-8">
         <AnimatePresence mode="wait" custom={direction}>
           <motion.div
             key={currentStep}
             custom={direction}
             initial={{ opacity: 0, x: direction * 50 }}
             animate={{ opacity: 1, x: 0 }}
             exit={{ opacity: 0, x: direction * -50 }}
             transition={{ duration: 0.2 }}
           >
             {StepComponent && <StepComponent />}
           </motion.div>
         </AnimatePresence>
       </div>

      {/* Navigation Buttons */}
      <div className="mt-8">
        <WizardNavButtons />
      </div>
    </div>
  );
}