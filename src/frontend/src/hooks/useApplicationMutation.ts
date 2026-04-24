"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import ApplicationService from "@/services/application.service";
import { useWizardStore } from "@/stores/wizard-store";

interface UseApplicationMutationReturn {
  submitApplicationAsync: (id: string) => Promise<void>;
  updateDraftAsync: (id: string, data: any) => Promise<void>;
  createDraftAsync: (serviceType: ServiceType) => Promise<string>;
}

import { ServiceType } from '@/types/wizard.types';

export function useApplicationMutation(): UseApplicationMutationReturn {
  const queryClient = useQueryClient();
  const { setApplicationId, setStep1 } = useWizardStore();

  const createDraftMutation = useMutation({
    mutationFn: async (serviceType: ServiceType) => {
      const response = await ApplicationService.createApplication(serviceType);
      if (!response.success || !response.data) {
        throw new Error(response.message || "Failed to create draft");
      }
      return response.data;
    },
    onSuccess: (data) => {
      setApplicationId(data.id);
      setStep1({ serviceType: data.serviceType });
    },
  });

  const updateDraftMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      const response = await ApplicationService.updateWizardData(id, data);
      if (!response.success) {
        throw new Error(response.message || "Failed to update draft");
      }
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["applications"] });
      // Sync API response back to wizard store (handles server-applied defaults / computed fields)
      if (data) {
        useWizardStore.getState().loadFromApi({
          serviceType: data.serviceType as any,
          licenseCategoryCode: data.licenseCategoryCode,
          nationalId: data.nationalId,
          dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth).toISOString().split('T')[0] : null,
          nationality: data.nationality,
          gender: data.gender,
          mobileNumber: data.mobileNumber,
          email: data.email,
          address: data.address,
          city: data.city,
          region: data.region,
          applicantType: data.applicantType,
          preferredCenterId: data.branchId,
          testLanguage: data.preferredLanguage,
          appointmentPreference: data.appointmentPreference,
          specialNeedsDeclaration: data.specialNeeds,
        });
      }
    },
  });

  const submitMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await ApplicationService.submitApplication(id);
      if (!response.success) {
        throw new Error(response.message || "Failed to submit application");
      }
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["applications"] });
    },
  });

  const createDraftAsync = async (serviceType: ServiceType): Promise<string> => {
    const data = await createDraftMutation.mutateAsync(serviceType);
    return data.id;
  };

  const updateDraftAsync = async (id: string, data: any): Promise<void> => {
    await updateDraftMutation.mutateAsync({ id, data });
  };

  const submitApplicationAsync = async (id: string): Promise<void> => {
    await submitMutation.mutateAsync(id);
  };

  return {
    createDraftAsync,
    updateDraftAsync,
    submitApplicationAsync,
  };
}
