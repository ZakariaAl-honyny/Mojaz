"use client";

import { useEffect, useRef, useCallback } from "react";
import { useWizardStore } from "@/stores/wizard-store";
import { useApplicationMutation } from "@/hooks/useApplicationMutation";
import { useTranslations } from "next-intl";

const AUTO_SAVE_INTERVAL = 30_000; // 30 seconds

export function useWizardAutoSave() {
  const t = useTranslations("wizard");
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
        step1,
        step2,
        step3,
        step4,
      });
      lastSavedHashRef.current = currentHash;
      setLastSavedAt(new Date());
      resetSaveFailures();
    } catch (error) {
      console.error("Auto-save failed:", error);
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
