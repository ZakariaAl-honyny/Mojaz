'use client';

import { useEffect, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
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

const steps = [
  Step1ServiceSelection,
  Step2LicenseCategory,
  Step3PersonalInfo,
  Step4ApplicationDetails,
  Step5ReviewSubmit,
];

export function WizardShell() {
  const currentStep = useWizardStore(state => state.currentStep);
  const applicationId = useWizardStore(state => state.applicationId);
  const isSaving = useWizardStore(state => state.isSaving);
  const { goTo, direction } = useApplicationWizard();
  const searchParams = useSearchParams();
  const resetWizard = useWizardStore(state => state.resetWizard);
  const setApplicationId = useWizardStore(state => state.setApplicationId);
  const setHasLoadedFromApi = useWizardStore(state => state.setHasLoadedFromApi);
  
  // Handle 'edit' query parameter to resume a draft or reset for a new one
  useEffect(() => {
    const editIdStr = searchParams.get('edit');
    
    if (editIdStr) {
      const editId = parseInt(editIdStr, 10);
      if (!isNaN(editId) && editId !== applicationId) {
        // Reset the wizard first to clear any existing state
        resetWizard();
        // Set the new application ID which will trigger data fetch in useApplicationWizard
        setApplicationId(editId);
        setHasLoadedFromApi(false);
      }
    } else {
      // If we are at /applications/new (which we are if this component is mounted) 
      // and there is NO edit parameter, and we have an existing applicationId, 
      // it means we probably want to start fresh.
      if (applicationId) {
        console.log("[Wizard] No edit ID provided, resetting for new application.");
        resetWizard();
      }
    }
  }, [searchParams, applicationId, resetWizard, setApplicationId, setHasLoadedFromApi]);

  useWizardAutoSave();

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

  const StepComponent = steps[currentStep - 1];

  return (
    <div className="w-full max-w-2xl mx-auto px-1 py-2 font-arabic" dir="rtl">
      {/* Progress Bar */}
      <div className="mb-2">
        <WizardProgressBar currentStep={currentStep} onStepClick={goTo} />
      </div>

      {/* Status Bar */}
      <div className="flex items-center justify-between gap-2 px-2 py-1.5 bg-white border border-neutral-100 rounded text-[9px] mb-2">
        <div className="flex items-center gap-1 text-neutral-400">
          <AutoSaveIndicator />
        </div>
        {applicationId && (
          <span className="font-medium text-[#1a3a8f]">{String(applicationId)}</span>
        )}
        <span className="text-neutral-400">الخطوة {currentStep}/5</span>
      </div>

      {/* Step Content */}
      <div className="mb-14 min-h-[300px] relative">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={currentStep}
            custom={direction}
            initial={{ opacity: 0, x: direction * 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: direction * -30 }}
            className="w-full"
          >
            {StepComponent && <StepComponent />}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation - Fixed Bottom */}
      <div className="fixed bottom-0 left-0 right-0 z-30 bg-white/90 pt-2 pb-2 px-2 border-t border-neutral-100">
        <div className="max-w-2xl mx-auto">
          <WizardNavButtons />
        </div>
      </div>
    </div>
  );
}