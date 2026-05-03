"use client";

import { useEffect, useRef, useCallback } from "react";
import { useWizardStore } from "@/stores/wizard-store";
import { useApplicationMutation } from "@/hooks/useApplicationMutation";
import ApplicationService from "@/services/application.service";
import { useQuery } from "@tanstack/react-query";
import { applicantTypeToString } from "@/lib/enum-utils";

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
    isSaving,
    setLastSavedAt,
    incrementSaveFailures,
    resetSaveFailures,
    consecutiveSaveFailures,
    setSaving,
  } = useWizardStore();

  const { updateDraftAsync } = useApplicationMutation();

  // Cache categories to avoid API hammering during auto-save
  const { data: categoriesData } = useQuery({
    queryKey: ['license-categories'],
    queryFn: async () => {
      const response = await ApplicationService.getLicenseCategories();
      return response.data || [];
    },
    staleTime: Infinity, // Categories are static
    enabled: !!applicationId,
  });

  // Create efficient hash of current state to avoid GC pressure from JSON.stringify
  const createStateHash = useCallback(() => {
    return [
      step1.serviceType,
      step2.categoryCode,
      step3.nationalId,
      step3.dateOfBirth,
      step3.email,
      step4.preferredCenterId,
      step4.testLanguage
    ].join('|');
  }, [step1, step2, step3, step4]);

  // Save function
  const performAutoSave = useCallback(async () => {
    // Skip if a manual save is already in progress (from goNext) or no data
    if (!applicationId || !step2.categoryCode || isSaving) return;

    const currentHash = createStateHash();
    
    // Only save if state changed
    if (currentHash === lastSavedHashRef.current) return;

    setSaving(true);
    try {
      const categories = categoriesData;
      if (!categories || !Array.isArray(categories) || categories.length === 0) {
        setSaving(false);       
        return; // Defer save entirely until dictionary is loaded
      }
      
      const category = (categories as any[]).find((c) => c.code === step2.categoryCode);
      if (!category) {
        console.warn("AutoSave aborted: Invalid Category Code mapping");
        setSaving(false);
        return; // Do not send junk to the backend
      }

      const licenseCategoryId = category.id;

      await updateDraftAsync(applicationId, {
        licenseCategoryId,
        nationalId: step3.nationalId,
        dateOfBirth: step3.dateOfBirth ? new Date(step3.dateOfBirth).toISOString() : undefined,
        nationality: step3.nationality,
        gender: step3.gender, // Now handled inside updateDraftMutation cleanedData
        mobileNumber: step3.mobileNumber,
        email: step3.email,
        address: step3.address,
        city: step3.city,
        region: step3.region,
        applicantType: applicantTypeToString(step4.applicantType) as any, // Now mapped in mutation hook
        branchId: step4.preferredCenterId ? Number(step4.preferredCenterId) : undefined,
        preferredLanguage: step4.testLanguage,
        specialNeeds: step4.specialNeedsDeclaration ? step4.specialNeedsNote : null,
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
  }, [applicationId, step1, step2, step3, step4, isSaving, categoriesData, createStateHash, updateDraftAsync, setLastSavedAt, incrementSaveFailures, resetSaveFailures, setSaving]);

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
