import apiClient from '@/lib/api-client';
import { ApiResponse, PaginatedResult } from '@/types/api.types';

export interface SubmitPracticalResultRequest {
  score: number;
  isAbsent: boolean;
  notes?: string;
  examinerNotes?: string;
  vehicleUsed?: string;
  requiresAdditionalTraining: boolean;
  additionalHoursRequired?: number;
  needsManualTransmissionEndorsement: boolean;
}

export interface PracticalTestDto {
  id: string;
  applicationId: string;
  examinerId: string;
  examinerName?: string;
  attemptNumber: number;
  conductedAt: string;
  score: number;
  passingScore: number;
  isAbsent: boolean;
  result: 'Pass' | 'Fail' | 'Absent';
  notes?: string;
  examinerNotes?: string;
  vehicleUsed?: string;
  requiresAdditionalTraining: boolean;
  additionalHoursRequired?: number;
  needsManualTransmissionEndorsement: boolean;
  retakeEligibleAfter?: string;
  applicationStatus?: string;
}

export const practicalService = {
  submitResult: async (applicationId: string, data: SubmitPracticalResultRequest): Promise<ApiResponse<PracticalTestDto>> => {
    const response = await apiClient.post<ApiResponse<PracticalTestDto>>(`/practicaltests/applications/${applicationId}/submit`, data);
    return response.data;
  },

  getHistory: async (
    applicationId: string,
    page = 1,
    pageSize = 10
  ): Promise<ApiResponse<PaginatedResult<PracticalTestDto>>> => {
    const response = await apiClient.get<ApiResponse<PaginatedResult<PracticalTestDto>>>(
      `/practicaltests/applications/${applicationId}/history`,
      { params: { page, pageSize } }
    );
    return response.data;
  },
};
