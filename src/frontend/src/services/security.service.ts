import apiClient from '@/lib/api-client';
import { ApiResponse, PaginatedResult } from '@/types/api.types';

/**
 * Applications pending security verification
 */
export interface SecurityPendingApplication {
  id: string;
  applicationNumber: string;
  applicantId: string;
  applicantFullName: string;
  nationalId: string;
  dateOfBirth: string;
  gender: number;
  categoryCode: string;
  categoryNameAr: string;
  serviceType: number;
  status: number;
  currentStage: number;
  submittedAt: string;
}

/**
 * Request body for security verification
 */
export interface SecurityVerificationRequest {
  isCleared: boolean;
  notes?: string;
}

/**
 * User for security management
 */
export interface SecurityUserDto {
  id: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  nationalId?: string;
  appRole: string;
  roleName: string;
  isActive: boolean;
  isSecurityBlocked: boolean;
  createdAt: string;
}

/**
 * Security Service - handles security verification API calls
 */
const SecurityService = {
  /**
   * Get applications pending security verification
   */
  async getSecurityPending(
    filters: {
      page?: number;
      pageSize?: number;
      search?: string;
      from?: string;
      to?: string;
    } = {}
  ): Promise<ApiResponse<PaginatedResult<SecurityPendingApplication>>> {
    const response = await apiClient.get('applications/security-pending', { params: filters });
    return response.data;
  },

  /**
   * Submit security verification for an application
   */
  async submitSecurityVerification(
    applicationId: string,
    data: SecurityVerificationRequest
  ): Promise<ApiResponse<SecurityPendingApplication>> {
    const response = await apiClient.post(
      `applications/${applicationId}/security-verification`,
      data
    );
    return response.data;
  },

  /**
   * Toggle user security block status
   */
  async toggleUserSecurityBlock(
    userId: string,
    isSecurityBlocked: boolean
  ): Promise<ApiResponse<SecurityUserDto>> {
    const response = await apiClient.patch(
      `users/${userId}/security-block`,
      { isSecurityBlocked }
    );
    return response.data;
  },

  /**
   * Get dashboard stats for security role
   */
  async getDashboardStats(): Promise<ApiResponse<{
    pendingVerifications: number;
    todayVerifications: number;
    blockedUsers: number;
    totalApplications: number;
  }>> {
    const response = await apiClient.get('applications/security-stats');
    return response.data;
  }
};

export { SecurityService };
export default SecurityService;