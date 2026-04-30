"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import ApplicationService, { ApplicationDraftDto } from "@/services/application.service";
import { useWizardStore } from "@/stores/wizard-store";
import { ApiResponse } from "@/types/api.types";
import { ServiceType, LicenseCategoryCode, Gender } from "@/lib/enums";
import { licenseCategoryToNumber, genderToNumber } from "@/lib/enum-utils";

// ============================================================
// Update Draft Request - Combined wizard step data
// ============================================================
export interface UpdateDraftRequest {
  // Step 1: Service Type
  serviceType?: ServiceType;
  
  // Step 2: License Category
  licenseCategoryCode?: LicenseCategoryCode | string | null;
  licenseCategoryId?: number | null;
  
  // Step 3: Personal Information
  nationalId?: string | null;
  dateOfBirth?: string | null;
  nationality?: string | null;
  gender?: Gender | number | null;
  mobileNumber?: string | null;
  email?: string | null;
  address?: string | null;
  city?: string | null;
  region?: string | null;
  
  // Step 4: Application Details
  applicantType?: number | null; // Mapped to backend enum (Private, Public, etc.)
  preferredCenterId?: number | null;
  branchId?: number | null;
  testLanguage?: string | null;
  preferredLanguage?: string | null;
  appointmentPreference?: string | null;
  specialNeeds?: string | null; // This is the notes string, not the boolean declaration
}

interface UseApplicationMutationReturn {
  submitApplicationAsync: (id: number) => Promise<void>;
  updateDraftAsync: (id: number, data: UpdateDraftRequest) => Promise<ApplicationDraftDto | null>;
  createDraftAsync: (serviceType: ServiceType) => Promise<number>;
}

export function useApplicationMutation(): UseApplicationMutationReturn {
  const queryClient = useQueryClient();
  const { setApplicationId, setStep1 } = useWizardStore();

  const createDraftMutation = useMutation({
    mutationFn: async (serviceType: ServiceType) => {
      const response = await ApplicationService.createApplication(serviceType);
      if (!response.success || !response.data) {
        throw new Error(response.message || "فشل في إنشاء مسودة الطلب.");
      }
      return response.data;
    },
    onSuccess: (data) => {
      setApplicationId(data.id);
      setStep1({ serviceType: data.serviceType });
    },
    onError: (error: Error) => {
      console.error("Create draft error:", error);
    },
  });

  const updateDraftMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: UpdateDraftRequest }) => {
      // Clean up common 400-causing issues
      const cleanedData: any = { ...data };

      // 1. BranchId is now a number (auto-increment), frontend uses preferredCenterId or branchId
      // Ensure we send branchId as a valid number or null
      const branchId = cleanedData.branchId || cleanedData.preferredCenterId;
      
      if (!branchId || typeof branchId !== 'number') {
        cleanedData.branchId = null;
      } else {
        cleanedData.branchId = branchId;
      }
      delete cleanedData.preferredCenterId;

      // 2. Map applicantType string to backend enum number (Private=0, Public=1...)
      if (typeof cleanedData.applicantType === 'string') {
        const mapping: Record<string, number> = { 'Citizen': 0, 'Resident': 1 };
        cleanedData.applicantType = mapping[cleanedData.applicantType] ?? 0;
      }

      // 3. Ensure Gender is numeric
      if (cleanedData.gender !== undefined) {
        cleanedData.gender = genderToNumber(cleanedData.gender);
      }

      // 4. Empty strings for GUIDs should be null
      if (cleanedData.licenseCategoryId === "" || !cleanedData.licenseCategoryId) {
        delete cleanedData.licenseCategoryId; 
      }
      
      // 5. Aliases/Compatibility
      if (cleanedData.phone && !cleanedData.mobileNumber) {
        cleanedData.mobileNumber = cleanedData.phone;
      }
      delete cleanedData.phone;

      // 6. Cleanup redundant fields not in backend UpdateWizardDataRequest
      delete cleanedData.licenseCategoryCode;

      console.log("[Mutation] Sending update draft payload:", cleanedData);

      try {
        const response = await ApplicationService.updateApplication(id, cleanedData);
        if (!response.success) {
          // Parse business rule error codes from error message
          const errorMessage = response.message || "فشل في تحديث بيانات المسودة.";
          
          // Check for LICENSE_ALREADY_EXISTS error
          if (errorMessage.includes("[LICENSE_ALREADY_EXISTS]")) {
            const err = new Error(errorMessage) as Error & { code: string; existingApplicationId?: string };
            err.code = "LICENSE_ALREADY_EXISTS";
            throw err;
          }
          
          // Check for APPLICATION_IN_PROGRESS error (extract existing app ID)
          if (errorMessage.includes("[APPLICATION_IN_PROGRESS:")) {
            const match = errorMessage.match(/APPLICATION_IN_PROGRESS:([a-f0-9-]+)/i);
            const existingAppId = match ? match[1] : undefined;
            const err = new Error(errorMessage) as Error & { code: string; existingApplicationId?: string };
            err.code = "APPLICATION_IN_PROGRESS";
            err.existingApplicationId = existingAppId;
            throw err;
          }
          
          throw new Error(errorMessage);
        }
        return response.data;
      } catch (error: any) {
        if (error.response?.data) {
          const apiError = error.response.data;
          console.error("[Mutation] API Validation Errors:", apiError.errors || apiError.message || apiError);
          
          // If there are specific field errors, flatten them for the error message
          if (apiError.errors && typeof apiError.errors === 'object') {
            const firstError = Object.values(apiError.errors).flat()[0];
            if (firstError) {
               throw new Error(String(firstError));
            }
          }
        }
        throw error;
      }
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["applications"] });
// Sync API response back to wizard store (handles server-applied defaults / computed fields)
        if (data) {
        useWizardStore.getState().loadFromApi({
          serviceType: data.serviceType,
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
          preferredCenterId: data.preferredCenterId ? Number(data.preferredCenterId) : undefined,
          testLanguage: data.testLanguage,
          appointmentPreference: data.appointmentPreference,
          specialNeedsDeclaration: data.specialNeedsDeclaration,
        });
      }
    },
    onError: (error: Error) => {
      console.error("Update draft error:", error);
    },
  });

  const submitMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await ApplicationService.submitApplication(id);
      if (!response.success) {
        throw new Error(response.message || "فشل في إرسال الطلب النهائي.");
      }
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["applications"] });
    },
    onError: (error: Error) => {
      console.error("Submit application error:", error);
    },
  });

  const createDraftAsync = async (serviceType: ServiceType): Promise<number> => {
    const data = await createDraftMutation.mutateAsync(serviceType);
    return data.id;
  };

  const updateDraftAsync = async (id: number, data: UpdateDraftRequest): Promise<ApplicationDraftDto | null> => {
    return await updateDraftMutation.mutateAsync({ id, data });
  };

  const submitApplicationAsync = async (id: number): Promise<void> => {
    await submitMutation.mutateAsync(id);
  };

  return {
    createDraftAsync,
    updateDraftAsync,
    submitApplicationAsync,
  };
}