"use client";

import { useCallback, useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useWizardStore } from "@/stores/wizard-store";
import { useApplicationMutation } from "@/hooks/useApplicationMutation";
import ApplicationService from "@/services/application.service";
import type { StepId, Step1Data, Step2Data, Step3Data, Step4Data } from "@/types/wizard.types";
import { genderToNumber } from "@/lib/enum-utils";

interface UseApplicationWizardReturn {
  currentStep: StepId;
  completedSteps: StepId[];
  goTo: (step: number) => void;
  goNext: (trigger?: (fields?: string[]) => Promise<boolean>, setFocus?: (field: string) => void) => Promise<boolean>;
  goBack: () => void;
  submit: () => Promise<void>;
  isSubmitting: boolean;
  setStep1Data: (data: Step1Data) => void;
  setStep2Data: (data: Step2Data) => void;
  setStep3Data: (data: Step3Data) => void;
  setStep4Data: (data: Step4Data) => void;
  direction: number;
}

interface StepFieldMap {
  [key: number]: string[];
}

const STEP_FIELD_MAP: StepFieldMap = {
  1: ["serviceType"],
  2: ["categoryCode"],
  3: ["nationalId", "dateOfBirth", "nationality", "gender", "mobileNumber", "email", "address", "city", "region"],
  4: ["applicantType", "preferredCenterId", "testLanguage", "appointmentPreference", "specialNeedsDeclaration"],
};

export function useApplicationWizard(): UseApplicationWizardReturn {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [direction, setDirection] = useState(1);
  const prevStepRef = useRef<number>(1);

  const {
    currentStep,
    completedSteps,
    step1,
    step2,
    step3,
    step4,
    applicationId,
    goTo: storeGoTo,
    markCompleted,
    setStep1,
    setStep2,
    setStep3,
    setStep4,
    loadFromApi,
    resetWizard,
  } = useWizardStore();

  const { 
    createDraftAsync, 
    updateDraftAsync, 
    submitApplicationAsync 
  } = useApplicationMutation();

  const goTo = useCallback(
    (step: number) => {
      const validStep = Math.max(1, Math.min(5, step)) as StepId;
      setDirection(validStep > prevStepRef.current ? 1 : -1);
      prevStepRef.current = validStep;
      storeGoTo(validStep);
    },
    [storeGoTo]
  );

  const goBack = useCallback(() => {
    const newStep = Math.max(1, currentStep - 1) as StepId;
    setDirection(-1);
    storeGoTo(newStep);
  }, [currentStep, storeGoTo]);

  const goNext = useCallback(
    async (
      trigger?: (fields?: string[]) => Promise<boolean>,
      setFocus?: (field: string) => void
    ): Promise<boolean> => {
      const stepFields = STEP_FIELD_MAP[currentStep] || [];
      
      if (trigger && stepFields.length > 0) {
        const isValid = await trigger(stepFields);
        if (!isValid) {
          if (setFocus && stepFields.length > 0) {
            const firstField = stepFields[0];
            setFocus(firstField);
            
            const fieldElement = document.getElementById(firstField) || document.querySelector(`[name="${firstField}"]`);
            if (fieldElement) {
              fieldElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
          }
          return false;
        }
      }

      setIsSubmitting(true);
      try {
        // Sync current step data to store before persistence
        switch (currentStep) {
          case 1: setStep1(step1); break;
          case 2: setStep2(step2); break;
          case 3: setStep3(step3); break;
          case 4: setStep4(step4); break;
        }

        // Functional Persistence logic
        if (currentStep === 1 && step1.serviceType) {
          // If no ID exists, create the draft, otherwise update it
          if (!applicationId) {
            await createDraftAsync(step1.serviceType);
          } else {
            await updateDraftAsync(applicationId, { serviceType: step1.serviceType });
          }
        } else if (applicationId && currentStep === 2 && step2.categoryCode) {
          // Need to convert numeric licenseCategoryCode to licenseCategoryId (GUID)
          // Since we don't have the mapping here, we need to fetch categories first
          const categoriesResponse = await ApplicationService.getLicenseCategories();
          if (categoriesResponse.success && categoriesResponse.data) {
            const category = categoriesResponse.data.find(c => c.code === step2.categoryCode);
            if (category) {
              await updateDraftAsync(applicationId, { licenseCategoryId: category.id });
            }
          }
        } else if (applicationId && currentStep < 5) {
          // Structured for UpdateWizardDataRequest (application + user fields)
          const patchData = {
            nationalId: step3.nationalId,
            dateOfBirth: step3.dateOfBirth ? new Date(step3.dateOfBirth).toISOString() : undefined,
            nationality: step3.nationality,
            gender: genderToNumber(step3.gender),
            mobileNumber: step3.mobileNumber,
            email: step3.email,
            address: step3.address,
            city: step3.city,
            region: step3.region,
            applicantType: step4.applicantType,
            branchId: step4.preferredCenterId,
            preferredLanguage: step4.testLanguage,
            specialNeeds: step4.specialNeedsDeclaration,
            appointmentPreference: step4.appointmentPreference,
          };
          await updateDraftAsync(applicationId, patchData);
        }

        markCompleted(currentStep);
        const nextStep = Math.min(5, currentStep + 1) as StepId;
        setDirection(1);
        storeGoTo(nextStep);
        return true;
      } catch (error) {
        console.error("Workflow progression error:", error);
        // Toast or Error message should be handled by mutation hook or UI
        return false;
      } finally {
        setIsSubmitting(false);
      }
    },
    [currentStep, applicationId, step1, step2, step3, step4, markCompleted, setStep1, setStep2, setStep3, setStep4, loadFromApi, storeGoTo, createDraftAsync, updateDraftAsync]
  );

  const submit = useCallback(async () => {
    if (!applicationId) return;

    setIsSubmitting(true);
    try {
      await submitApplicationAsync(applicationId);
      
      // Cleanup
      resetWizard();
      sessionStorage.removeItem("mojaz-wizard-draft");
      
      // Institutional redirect to applications detail view
      router.push(`/applications/${applicationId}`);
    } catch (error) {
      console.error("Submission error:", error);
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  }, [applicationId, submitApplicationAsync, resetWizard, router]);

  const setStep1Data = useCallback((data: Step1Data) => setStep1(data), [setStep1]);
  const setStep2Data = useCallback((data: Step2Data) => setStep2(data), [setStep2]);
  const setStep3Data = useCallback((data: Step3Data) => setStep3(data), [setStep3]);
  const setStep4Data = useCallback((data: Step4Data) => setStep4(data), [setStep4]);

  // ── Load existing draft from API on mount (handles page refresh / session restore) ──
  const [hasLoadedDraft, setHasLoadedDraft] = useState(false);
  useEffect(() => {
    if (hasLoadedDraft) return;
    if (!applicationId) { setHasLoadedDraft(true); return; }

    ApplicationService.getApplication(applicationId)
      .then((response) => {
        if (!response.success || !response.data) return;
        const d = response.data;
        loadFromApi({
          serviceType: d.serviceType as any,
          licenseCategoryCode: d.licenseCategoryCode,
          nationalId: d.nationalId,
          dateOfBirth: d.dateOfBirth ? new Date(d.dateOfBirth).toISOString().split('T')[0] : null,
          nationality: d.nationality,
          gender: d.gender,
          mobileNumber: d.mobileNumber,
          email: d.email,
          address: d.address,
          city: d.city,
          region: d.region,
          applicantType: d.applicantType,
          preferredCenterId: d.branchId,
          testLanguage: d.preferredLanguage,
          appointmentPreference: d.appointmentPreference,
          specialNeedsDeclaration: d.specialNeeds,
        });
      })
      .catch((err) => console.warn("Failed to load wizard draft from API:", err))
      .finally(() => setHasLoadedDraft(true));
  }, [applicationId, hasLoadedDraft, loadFromApi]);

  return {
    currentStep,
    completedSteps,
    goTo,
    goNext,
    goBack,
    submit,
    isSubmitting,
    setStep1Data,
    setStep2Data,
    setStep3Data,
    setStep4Data,
    direction,
  };
}