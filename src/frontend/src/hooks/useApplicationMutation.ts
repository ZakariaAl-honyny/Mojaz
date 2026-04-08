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
      const response = await ApplicationService.updateApplication(id, data);
      if (!response.success) {
        throw new Error(response.message || "Failed to update draft");
      }
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["applications"] });
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
