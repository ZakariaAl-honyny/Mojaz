import apiClient from '@/lib/api-client';
import { ApiResponse } from '@/types/api.types';
import { 
  TrainingRecordDto, 
  CreateTrainingRecordRequest, 
  UpdateTrainingHoursRequest, 
  CreateExemptionRequest,
  ExemptionActionRequest
} from '@/types/training.types';

/**
 * Training Service - Handles recording training hours and exemptions
 */
const TrainingService = {
  /**
   * Get training record for a specific application
   */
  async getRecordByApplicationId(applicationId: string): Promise<ApiResponse<TrainingRecordDto>> {
    const response = await apiClient.get(`/Training/application/${applicationId}`);
    return response.data;
  },

  /**
   * Create initial training record (if it doesn't exist)
   */
  async createRecord(request: CreateTrainingRecordRequest): Promise<ApiResponse<TrainingRecordDto>> {
    const response = await apiClient.post('/Training', request);
    return response.data;
  },

  /**
   * Add training hours to an existing record
   */
  async addHours(id: string, request: UpdateTrainingHoursRequest): Promise<ApiResponse<TrainingRecordDto>> {
    const response = await apiClient.patch(`/Training/${id}/hours`, request);
    return response.data;
  },

  /**
   * Submit an exemption request
   */
  async submitExemption(request: CreateExemptionRequest): Promise<ApiResponse<TrainingRecordDto>> {
    const response = await apiClient.post('/Training/exemption', request);
    return response.data;
  },

  /**
   * Approve an exemption (Manager only)
   */
  async approveExemption(id: string, request: ExemptionActionRequest): Promise<ApiResponse<TrainingRecordDto>> {
    const response = await apiClient.patch(`/Training/${id}/exemption/approve`, request);
    return response.data;
  },

  /**
   * Reject an exemption (Manager only)
   */
  async rejectExemption(id: string, request: ExemptionActionRequest): Promise<ApiResponse<TrainingRecordDto>> {
    const response = await apiClient.patch(`/Training/${id}/exemption/reject`, request);
    return response.data;
  },

  async getStatus(applicationId: string): Promise<ApiResponse<boolean>> {
    const response = await apiClient.get(`/Training/application/${applicationId}/status`);
    return response.data;
  },

  /**
   * Get all pending exemptions (Manager only)
   */
  async getPendingExemptions(): Promise<ApiResponse<any[]>> {
    const response = await apiClient.get('/Training/exemptions/pending');
    return response.data;
  }
};

export default TrainingService;
