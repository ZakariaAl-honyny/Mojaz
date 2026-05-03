"use client";

import { useCallback, useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useWizardStore } from "@/stores/wizard-store";
import { useApplicationMutation } from "@/hooks/useApplicationMutation";
import ApplicationService from "@/services/application.service";
import type { StepId, Step1Data, Step2Data, Step3Data, Step4Data } from "@/types/wizard.types";
import { genderToString, applicantTypeToString } from "@/lib/enum-utils";
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
  resetWizard: () => void;
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
      // Get FRESH state from store to avoid stale closures
      const state = useWizardStore.getState();
      const {
        currentStep: activeStep,
        applicationId: activeId,
        step1: s1,
        step2: s2,
        step3: s3,
        step4: s4
      } = state;

      const stepFields = STEP_FIELD_MAP[activeStep] || [];

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

      // Re-fetch state after trigger might have updated it
      const freshState = useWizardStore.getState();
      const {
        step1: fs1,
        step2: fs2,
        step3: fs3,
        step4: fs4
      } = freshState;

      setIsSubmitting(true);
      try {
        // Sync current step data to store before persistence
        switch (activeStep) {
          case 1: setStep1(fs1); break;
          case 2: setStep2(fs2); break;
          case 3: setStep3(fs3); break;
          case 4: setStep4(fs4); break;
        }

        // Functional Persistence logic
        if (activeStep === 1 && fs1.serviceType !== null) {
          // If no ID exists, create the draft, otherwise update it
          if (!activeId) {
            const newId = await createDraftAsync(fs1.serviceType);
            // Immediately set the applicationId in store
            setApplicationId(newId);
          } else {
            await updateDraftAsync(activeId, { serviceType: fs1.serviceType });
          }
        } else if (activeId && activeStep === 2 && fs2.categoryCode) {
          // Need to convert numeric licenseCategoryCode to licenseCategoryId
          const categoriesResponse = await ApplicationService.getLicenseCategories();
          if (categoriesResponse.success && categoriesResponse.data) {
            const category = categoriesResponse.data.find(c => c.code === fs2.categoryCode);
            if (category) {
              await updateDraftAsync(activeId, { licenseCategoryId: category.id });
            }
          }
        } else if (activeId && activeStep < 5) {
          // Structured for UpdateWizardDataRequest (application + user fields)
          // All enum values MUST be sent as string names (backend uses JsonStringEnumConverter)
          const patchData = {
            nationalId: fs3.nationalId || undefined,
            dateOfBirth: fs3.dateOfBirth ? new Date(fs3.dateOfBirth).toISOString() : undefined,
            nationality: fs3.nationality || undefined,
            gender: genderToString(fs3.gender) ?? undefined,
            mobileNumber: fs3.mobileNumber || undefined,
            email: fs3.email || undefined,
            address: fs3.address || undefined,
            city: fs3.city || undefined,
            region: fs3.region || undefined,
            applicantType: applicantTypeToString(fs4.applicantType) ?? undefined,
            branchId: fs4.preferredCenterId ? Number(fs4.preferredCenterId) : undefined,
            preferredLanguage: fs4.testLanguage || undefined,
            specialNeeds: fs4.specialNeedsDeclaration ? (fs4.specialNeedsNote || undefined) : undefined,
            appointmentPreference: fs4.appointmentPreference || undefined,
          };
          await updateDraftAsync(activeId, patchData);
        }

        markCompleted(activeStep);
        const nextStep = Math.min(5, activeStep + 1) as StepId;
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
  const lastLoadedIdRef = useRef<number | null>(null);

  useEffect(() => {
    // Only load if we have an ID and it's different from what we last loaded
    if (!applicationId || applicationId === lastLoadedIdRef.current) {
      return;
    }

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
          applicantType: d.applicantType as any,
          preferredCenterId: d.branchId ? String(d.branchId) : null,
          testLanguage: d.preferredLanguage as "ar" | "en" | undefined,
          appointmentPreference: d.appointmentPreference as any,
          specialNeedsDeclaration: typeof d.specialNeeds === 'boolean' ? d.specialNeeds : d.specialNeeds === 'true',
          specialNeedsNote: d.specialNeedsNote,
        });

        lastLoadedIdRef.current = applicationId;
      })
      .catch((err) => console.warn("Failed to load wizard draft from API:", err));
  }, [applicationId, loadFromApi]);

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
    resetWizard,
    direction,
  };
}