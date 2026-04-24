"use client";

import { useEffect, useRef, useCallback } from "react";
import { useWizardStore } from "@/stores/wizard-store";
import { useApplicationMutation } from "@/hooks/useApplicationMutation";

const AUTO_SAVE_INTERVAL = 30_000; // 30 seconds

export function useWizardAutoSave() {
  const lastSavedHashRef = useRef<string | null>(null);
  
  const {
    applicationId,
    step1,
    step2,
    step3,
    step4,
    lastSavedAt,
    setLastSavedAt,
    incrementSaveFailures,
    resetSaveFailures,
    consecutiveSaveFailures,
    setSaving,
  } = useWizardStore();

  const { updateDraftAsync } = useApplicationMutation();

  // Create hash of current state
  const createStateHash = useCallback(() => {
    const state = { step1, step2, step3, step4 };
    return JSON.stringify(state);
  }, [step1, step2, step3, step4]);

  // Save function
  const performAutoSave = useCallback(async () => {
    if (!applicationId) return;

    const currentHash = createStateHash();
    
    // Only save if state changed
    if (currentHash === lastSavedHashRef.current) return;

    setSaving(true);
    try {
      await updateDraftAsync(applicationId, {
        licenseCategoryId: step2.categoryCode,
        nationalId: step3.nationalId,
        dateOfBirth: step3.dateOfBirth ? new Date(step3.dateOfBirth).toISOString() : undefined,
        nationality: step3.nationality,
        gender: step3.gender,
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
      });
      lastSavedHashRef.current = currentHash;
      setLastSavedAt(new Date());
      resetSaveFailures();
    } catch (error) {
      console.error("Auto-save failure:", error);
      incrementSaveFailures();
    } finally {
      setSaving(false);
    }
  }, [applicationId, step1, step2, step3, step4, createStateHash, updateDraftAsync, setLastSavedAt, incrementSaveFailures, resetSaveFailures, setSaving]);

  // Set up interval
  useEffect(() => {
    if (!applicationId) return;

    const interval = setInterval(performAutoSave, AUTO_SAVE_INTERVAL);
    
    return () => clearInterval(interval);
  }, [applicationId, performAutoSave]);

  return {
    lastSavedAt,
    consecutiveSaveFailures,
  };
}
