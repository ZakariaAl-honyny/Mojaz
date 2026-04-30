"use client";

import { useCallback, useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useWizardStore } from "@/stores/wizard-store";
import { useApplicationMutation } from "@/hooks/useApplicationMutation";
import ApplicationService from "@/services/application.service";
import type { StepId, Step1Data, Step2Data, Step3Data, Step4Data } from "@/types/wizard.types";
import { genderToNumber, applicantTypeToNumber } from "@/lib/enum-utils";
import { useToast } from "@/hooks/use-toast";

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
    setApplicationId,
    loadFromApi,
    resetWizard,
  } = useWizardStore();

  const { 
    createDraftAsync, 
    updateDraftAsync, 
    submitApplicationAsync 
  } = useApplicationMutation();

  const { toast } = useToast();

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
            const newId = await createDraftAsync(step1.serviceType);
            // Immediately set the applicationId in store for Step 5 submission
            setApplicationId(newId);
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
            applicantType: applicantTypeToNumber(step4.applicantType),
            branchId: step4.preferredCenterId,
            preferredLanguage: step4.testLanguage,
            specialNeeds: step4.specialNeedsDeclaration ? step4.specialNeedsNote : null,
            appointmentPreference: step4.appointmentPreference,
          };
          await updateDraftAsync(applicationId, patchData);
        }

        markCompleted(currentStep);
        const nextStep = Math.min(5, currentStep + 1) as StepId;
        setDirection(1);
        storeGoTo(nextStep);
        return true;
      } catch (error: any) {
        console.error("Workflow progression error:", error);
        
        // Business rule error handling - check error codes from backend
        const errorMessage = error?.message || String(error);
        
        // RULE A: LICENSE_ALREADY_EXISTS - Show error toast, block progression
        if (error.code === "LICENSE_ALREADY_EXISTS" || errorMessage.includes("[LICENSE_ALREADY_EXISTS]")) {
          window.dispatchEvent(new CustomEvent("wizard-error", { 
            detail: { type: "LICENSE_ALREADY_EXISTS", message: "عفواً، أنت تملك رخصة نشطة من هذه الفئة مسبقاً. لا يمكنك إصدار رخصة جديدة." }
          }));
          return false;
        }
        
        // RULE B: APPLICATION_IN_PROGRESS - Show info toast and redirect
        if (error.code === "APPLICATION_IN_PROGRESS" || errorMessage.includes("[APPLICATION_IN_PROGRESS:")) {
          const match = errorMessage.match(/APPLICATION_IN_PROGRESS:([a-f0-9-]+)/i);
          const existingAppId = error?.existingApplicationId || match?.[1];
          
          window.dispatchEvent(new CustomEvent("wizard-error", { 
            detail: { type: "APPLICATION_IN_PROGRESS", existingApplicationId: existingAppId, message: "لديك طلب قيد الإجراء لهذه الفئة مسبقاً." }
          }));
          return false;
        }
        
        // Generic error handling
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
      
      // Show success message
      toast({
        title: "تم تقديم الطلب بنجاح",
        description: "تم تقديم طلب رخصة القيادة الخاص بك. يمكنك متابعته من صفحة الطلبات.",
        variant: "default",
      });
      
      // Cleanup
      resetWizard();
      sessionStorage.removeItem("mojaz-wizard-draft");
      
      // Redirect to applications list page
      router.push(`/applications`);
    } catch (error) {
      console.error("Submission error:", error);
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  }, [applicationId, submitApplicationAsync, resetWizard, router, toast]);

  const setStep1Data = useCallback((data: Step1Data) => setStep1(data), [setStep1]);
  const setStep2Data = useCallback((data: Step2Data) => setStep2(data), [setStep2]);
  const setStep3Data = useCallback((data: Step3Data) => setStep3(data), [setStep3]);
  const setStep4Data = useCallback((data: Step4Data) => setStep4(data), [setStep4]);

  // ── Load existing draft from API on mount (handles page refresh / session restore) ──
  const [hasLoadedDraft, setHasLoadedDraft] = useState(false);
  useEffect(() => {
    if (hasLoadedDraft) return;
    if (!applicationId) { setHasLoadedDraft(true); return; }

    ApplicationService.getApplicationById(applicationId)
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
          // @ts-ignore - API response may not have these fields
          applicantType: d.applicantType,
          // @ts-ignore
          preferredCenterId: d.branchId,
          // @ts-ignore
          testLanguage: d.preferredLanguage,
          // @ts-ignore
          appointmentPreference: d.appointmentPreference,
          // @ts-ignore
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