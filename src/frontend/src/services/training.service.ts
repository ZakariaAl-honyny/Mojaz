import apiClient from '@/lib/api-client';
import { ApiResponse } from '@/types/api.types';
import { 
  TrainingRecordDto, 
  CreateTrainingRecordRequest, 
  UpdateTrainingHoursRequest, 
  CreateExemptionRequest,
  ExemptionActionRequest,
  PendingExemptionDto
} from '@/types/training.types';

/**
 * Training Service - Handles recording training hours and exemptions
 */
const TrainingService = {
  /**
   * Get training record for a specific application
   */
  async getRecordByApplicationId(applicationId: number): Promise<ApiResponse<TrainingRecordDto>> {
    const response = await apiClient.get(`training/application/${applicationId}`);
    return response.data;
  },

  /**
   * Create initial training record (if it doesn't exist)
   * Backend: POST /api/v1/training
   */
  async createRecord(request: CreateTrainingRecordRequest): Promise<ApiResponse<TrainingRecordDto>> {
    const response = await apiClient.post('training', request);
    return response.data;
  },

  /**
   * Add training hours to an existing record
   */
  async addHours(id: number, request: UpdateTrainingHoursRequest): Promise<ApiResponse<TrainingRecordDto>> {
    const response = await apiClient.patch(`training/${id}/hours`, request);
    return response.data;
  },

  /**
   * Submit an exemption request
   */
  async submitExemption(request: CreateExemptionRequest): Promise<ApiResponse<TrainingRecordDto>> {
    const response = await apiClient.post('training/exemption', request);
    return response.data;
  },

  /**
   * Approve an exemption (Manager only)
   */
  async approveExemption(id: number, request: ExemptionActionRequest): Promise<ApiResponse<TrainingRecordDto>> {
    const response = await apiClient.patch(`training/${id}/exemption/approve`, request);
    return response.data;
  },

  /**
   * Reject an exemption (Manager only)
   */
  async rejectExemption(id: number, request: ExemptionActionRequest): Promise<ApiResponse<TrainingRecordDto>> {
    const response = await apiClient.patch(`training/${id}/exemption/reject`, request);
    return response.data;
  },

  async getStatus(applicationId: number): Promise<ApiResponse<boolean>> {
    const response = await apiClient.get(`training/application/${applicationId}/status`);
    return response.data;
  },

  /**
   * Get all pending exemptions (Manager only)
   */
  async getPendingExemptions(): Promise<ApiResponse<PendingExemptionDto[]>> {
    const response = await apiClient.get('training/exemptions/pending');
    return response.data;
  }
};

export default TrainingService;
