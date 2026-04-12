"use client";

import { useCallback, useState, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import { toast } from "react-hot-toast";
import { useWizardStore } from "@/stores/wizard-store";
import { useApplicationMutation } from "@/hooks/useApplicationMutation";
import type { StepId, Step1Data, Step2Data, Step3Data, Step4Data } from "@/types/wizard.types";

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

/**
 * Maps each wizard step to its form field names for validation.
 * Used by goNext() to know which fields to validate before advancing.
 */
const STEP_FIELD_MAP: StepFieldMap = {
  1: ["serviceType"],
  2: ["categoryCode"],
  3: ["nationalId", "dateOfBirth", "nationality", "gender", "mobileNumber", "email", "address", "city", "region"],
  4: ["applicantType", "preferredCenterId", "testLanguage", "appointmentPreference", "specialNeedsDeclaration"],
};

/**
 * Custom hook for managing the application wizard state and navigation.
 * Provides methods for step navigation, validation, and submission.
 * 
 * @returns Object containing wizard state and navigation methods
 */
export function useApplicationWizard(): UseApplicationWizardReturn {
  const router = useRouter();
  const params = useParams();
  const locale = (params.locale as string) || "ar";
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [direction, setDirection] = useState(1);
  const prevStepRef = useRef<number>(1);

  // Get state and actions from wizard store
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
    resetWizard,
  } = useWizardStore();

  // Get the mutation function from the mutation hook
  const { submitApplicationAsync } = useApplicationMutation();

  /**
   * Navigate to a specific step.
   * Updates direction based on whether moving forward or backward.
   * 
   * @param step - Step number to navigate to (1-5)
   */
  const goTo = useCallback(
    (step: number) => {
      const validStep = Math.max(1, Math.min(5, step)) as StepId;
      setDirection(validStep > prevStepRef.current ? 1 : -1);
      prevStepRef.current = validStep;
      storeGoTo(validStep);
    },
    [storeGoTo]
  );

  /**
   * Navigate to the previous step.
   */
  const goBack = useCallback(() => {
    const newStep = Math.max(1, currentStep - 1) as StepId;
    setDirection(-1);
    storeGoTo(newStep);
  }, [currentStep, storeGoTo]);

  /**
   * Navigate to the next step with optional validation.
   * If trigger function is provided, validates the current step's fields.
   * On success, marks the current step as completed and advances to the next step.
   * If validation fails, calls setFocus to focus the first invalid field and scrolls it into view.
   * 
   * @param trigger - Optional React Hook Form trigger function for validation
   * @param setFocus - Optional React Hook Form setFocus function to focus invalid field
   * @returns Promise<boolean> - true if successful, false if validation failed
   */
  const goNext = useCallback(
    async (
      trigger?: (fields?: string[]) => Promise<boolean>,
      setFocus?: (field: string) => void
    ): Promise<boolean> => {
      // Get fields required for current step validation
      const stepFields = STEP_FIELD_MAP[currentStep] || [];
      
      // Validate current step fields if trigger function is provided
      if (trigger && stepFields.length > 0) {
        const isValid = await trigger(stepFields);
        if (!isValid) {
          // Focus first invalid field and scroll into view on mobile
          if (setFocus && stepFields.length > 0) {
            const firstField = stepFields[0];
            setFocus(firstField);
            
            // Scroll field into view on mobile
            const fieldElement = document.getElementById(firstField) || document.querySelector(`[name="${firstField}"]`);
            if (fieldElement) {
              fieldElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
          }
          return false;
        }
      }
      
      // Mark current step as completed in the store
      markCompleted(currentStep);
      
      // Write current step data to store (ensures persistence)
      switch (currentStep) {
        case 1:
          setStep1(step1);
          break;
        case 2:
          setStep2(step2);
          break;
        case 3:
          setStep3(step3);
          break;
        case 4:
          setStep4(step4);
          break;
      }
      
      // Advance to next step (maximum step is 5)
      const nextStep = Math.min(5, currentStep + 1) as StepId;
      setDirection(1);
      storeGoTo(nextStep);
      
      return true;
    },
    [currentStep, step1, step2, step3, step4, markCompleted, setStep1, setStep2, setStep3, setStep4, storeGoTo]
  );

  /**
   * Submit the application.
   * Calls the submitApplication mutation, clears session storage,
   * and redirects to the application detail page.
   */
  const submit = useCallback(async () => {
    if (!applicationId) {
      const errorMsg = "No application ID to submit";
      console.error(errorMsg);
      return;
    }

    setIsSubmitting(true);
    try {
      await submitApplicationAsync(applicationId);
      
      // Reset wizard state in store
      resetWizard();
      
      // Clear wizard draft from sessionStorage
      sessionStorage.removeItem("mojaz-wizard-draft");
      
      // Log success (toast implementation pending)
      console.log("Application submitted successfully!");
      
      // Redirect to application detail page with locale
      router.push(`/${locale}/applicant/applications/${applicationId}`);
    } catch (error) {
      console.error("Failed to submit application:", error);
      
      // Log error message
      const errorMessage = error instanceof Error ? error.message : "Failed to submit application. Please try again.";
      console.error(errorMessage);
      
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  }, [applicationId, submitApplicationAsync, resetWizard, router, locale]);

  // Step data setter functions
  const setStep1Data = useCallback(
    (data: Step1Data) => {
      setStep1(data);
    },
    [setStep1]
  );

  const setStep2Data = useCallback(
    (data: Step2Data) => {
      setStep2(data);
    },
    [setStep2]
  );

  const setStep3Data = useCallback(
    (data: Step3Data) => {
      setStep3(data);
    },
    [setStep3]
  );

  const setStep4Data = useCallback(
    (data: Step4Data) => {
      setStep4(data);
    },
    [setStep4]
  );

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