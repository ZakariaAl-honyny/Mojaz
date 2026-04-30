import apiClient from '@/lib/api-client';
import { ApiResponse } from '@/types/api.types';
import { MedicalExamDto } from '@/types/api.types';

// Medical Exam Status Enum (matching backend)
export enum MedicalExamResultStatus {
  Fit = 0,              // لائق
  ConditionallyFit = 1, // لائق بشروط
  Unfit = 2            // غير لائق
}

// Request DTO for submitting medical exam results
export interface SubmitMedicalExamRequest {
  visionLeft: number;      // 0 = Pass, 1 = Fail
  visionRight: number;     // 0 = Pass, 1 = Fail
  hearing: number;         // 0 = Pass, 1 = Fail
  physicalHealth: number;  // 0 = Pass, 1 = Fail
  bloodPressure: number;   // 0 = Pass, 1 = Fail
  overallStatus: MedicalExamResultStatus;
  physicianNotes?: string;
}

export interface SubmitMedicalExamResponse {
  success: boolean;
  message: string;
  data: MedicalExamDto | null;
}

/**
 * Medical Exam Service - handles medical examination API calls for Doctor role
 */
const MedicalService = {
  /**
   * Submit medical examination results for an application
   * @param applicationId - The application ID (UUID or number)
   * @param request - Medical exam results
   */
  async submitMedicalExam(
    applicationId: string,
    request: SubmitMedicalExamRequest
  ): Promise<SubmitMedicalExamResponse> {
    const response = await apiClient.post<SubmitMedicalExamResponse>(
      `medical-exams/application/${applicationId}`,
      request
    );
    return response.data;
  },

  /**
   * Get medical exam history for an application
   * @param applicationId - The application ID
   */
  async getMedicalExamHistory(
    applicationId: string
  ): Promise<ApiResponse<MedicalExamDto>> {
    const response = await apiClient.get<ApiResponse<MedicalExamDto>>(
      `medical-exams/application/${applicationId}/history`
    );
    return response.data;
  },

  /**
   * Get a specific medical exam by ID
   * @param examId - Medical exam ID
   */
  async getMedicalExamById(
    examId: string
  ): Promise<ApiResponse<MedicalExamDto>> {
    const response = await apiClient.get<ApiResponse<MedicalExamDto>>(
      `medical-exams/${examId}`
    );
    return response.data;
  }
};

export default MedicalService;