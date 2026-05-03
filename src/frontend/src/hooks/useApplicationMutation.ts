"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import ApplicationService, { ApplicationDraftDto } from "@/services/application.service";
import { useWizardStore } from "@/stores/wizard-store";
import { ApiResponse } from "@/types/api.types";
import { ServiceType, LicenseCategoryCode, Gender } from "@/lib/enums";
import { genderToString, applicantTypeToString } from "@/lib/enum-utils";

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
  gender?: Gender | number | string | null;
  mobileNumber?: string | null;
  email?: string | null;
  address?: string | null;
  city?: string | null;
  region?: string | null;
  
  // Step 4: Application Details
  applicantType?: number | string | null; // Mapped to backend enum (Private, Public, etc.)
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
      try {
        const response = await ApplicationService.createApplication(serviceType);
        if (!response.success || !response.data) {
          // 409: draft already exists for this user — fetch existing draft and return it
          if (response.statusCode === 409 || response.message?.includes('already exists')) {
            const draftsResponse = await ApplicationService.getDrafts();
            if (draftsResponse.success && draftsResponse.data?.items?.length) {
              return draftsResponse.data.items[0];
            }
          }
          throw new Error(response.message || "فشل في إنشاء مسودة الطلب.");
        }
        return response.data;
      } catch (err: any) {
        // Axios throws on 4xx/5xx; handle 409 conflict by recovering existing draft
        if (err?.response?.status === 409 || err?.response?.data?.statusCode === 409) {
          console.warn('[Draft] 409 conflict — fetching existing draft');
          const draftsResponse = await ApplicationService.getDrafts();
          if (draftsResponse.success && draftsResponse.data?.items?.length) {
            return draftsResponse.data.items[0];
          }
        }
        throw err;
      }
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

      // 1. BranchId: must be a positive number or omitted
      const branchId = cleanedData.branchId || cleanedData.preferredCenterId;
      if (branchId && typeof branchId === 'number' && branchId > 0) {
        cleanedData.branchId = branchId;
      } else {
        delete cleanedData.branchId;
      }
      delete cleanedData.preferredCenterId;

      // 2. gender — backend uses JsonStringEnumConverter, must send "Male" not 1
      if (cleanedData.gender !== undefined && cleanedData.gender !== null) {
        cleanedData.gender = genderToString(cleanedData.gender);
        if (!cleanedData.gender) delete cleanedData.gender;
      } else {
        delete cleanedData.gender;
      }

      // 3. applicantType — send backend string name ("Private"/"Public"), not 0/1
      if (cleanedData.applicantType !== undefined && cleanedData.applicantType !== null) {
        cleanedData.applicantType = applicantTypeToString(cleanedData.applicantType);
        if (!cleanedData.applicantType) delete cleanedData.applicantType;
      } else {
        delete cleanedData.applicantType;
      }

      // 4. licenseCategoryId: must be a positive integer; omit if absent/zero
      if (!cleanedData.licenseCategoryId || typeof cleanedData.licenseCategoryId !== 'number' || cleanedData.licenseCategoryId <= 0) {
        delete cleanedData.licenseCategoryId;
      }

      // 5. Aliases/Compatibility
      if (cleanedData.phone && !cleanedData.mobileNumber) {
        cleanedData.mobileNumber = cleanedData.phone;
      }
      delete cleanedData.phone;

      // 6. Remove frontend-only fields not in UpdateWizardDataRequest
      delete cleanedData.licenseCategoryCode;
      delete cleanedData.testLanguage; // backend field is preferredLanguage

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
          preferredCenterId: data.branchId ? String(data.branchId) : undefined,
          testLanguage: data.preferredLanguage,
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