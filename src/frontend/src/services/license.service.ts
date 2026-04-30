import apiClient from '@/lib/api-client';
import { ApiResponse } from '@/types/api.types';
import { LicenseStatus } from '@/lib/enums';
import { ReplacementReason } from '@/lib/enums';

export interface LicenseDto {
  id: number;
  licenseNumber: string;
  licenseCategoryCode: string;
  licenseCategoryNameEn: string;
  licenseCategoryNameAr: string;
  status: LicenseStatus;
  issuedAt: string;
  expiresAt: string;
}

export interface UpgradeTargetCategory {
  id: number;
  code: string;
  nameEn: string;
  nameAr: string;
  minAge: number;
  descriptionEn: string;
  descriptionAr: string;
  requiresFieldTest: boolean;
}

export interface RenewalEligibilityResponse {
  isEligible: boolean;
  reason?: string;
  licenseId?: number;
  licenseNumber?: string;
  licenseCategoryCode?: string;
  licenseCategoryName?: string;
  currentLicenseExpiresAt?: string;
  gracePeriodEndsAt?: string;
  renewalFeeAmount?: number;
}

export interface LicenseCategoryOption {
  id: number;
  code: string;
  nameAr: string;
  nameEn: string;
  minAge?: number;
}

/**
 * License Service - handles license-related API calls
 */
const LicenseService = {
  /**
   * Get current user's active licenses
   */
  async getUserLicenses(): Promise<ApiResponse<LicenseDto[]>> {
    const response = await apiClient.get('licenses');
    return response.data;
  },

  /**
   * Get available upgrade targets for a specific license
   */
  async getUpgradeTargets(currentLicenseId: number): Promise<ApiResponse<UpgradeTargetCategory[]>> {
    const response = await apiClient.get(`licenses/${currentLicenseId}/upgrade-targets`);
    return response.data;
  },

  /**
   * Submit an upgrade application
   */
  async submitUpgrade(licenseId: number, targetCategoryid: number, branchid: number): Promise<ApiResponse<{ id: number; applicationNumber: string }>> {
    const response = await apiClient.post('applications/upgrade', {
      currentLicenseid: licenseId,
      targetCategoryid,
      branchid,
    });
    return response.data;
  },

  /**
   * Check eligibility for license replacement
   */
  async checkReplacementEligibility(): Promise<ApiResponse<{
    isEligible: boolean;
    licenseId: number;
    licenseNumber: string;
    expiryDate: string;
    message?: string;
  }>> {
    const response = await apiClient.get('applications/replacement/eligibility');
    return response.data;
  },

  /**
   * Submit a replacement application
   */
  async submitReplacement(data: {
    licenseId: number;
    reason: ReplacementReason;
    documentIds?: string[];
  }): Promise<ApiResponse<{ id: number; applicationNumber: string }>> {
    const response = await apiClient.post('applications/replacement', data);
    return response.data;
  },

  /**
   * Check eligibility for license renewal
   */
  async checkRenewalEligibility(categoryId: number): Promise<ApiResponse<RenewalEligibilityResponse>> {
    const response = await apiClient.get('licenses/renewal/eligibility', {
      params: { categoryId }
    });
    return response.data;
  },

  /**
   * Create a renewal application
   */
  async createRenewal(data: {
    oldLicenseId: number;
    licenseCategoryId: number;
  }): Promise<ApiResponse<{ id: number; applicationNumber: string }>> {
    const response = await apiClient.post('licenses/renewal', data);
    return response.data;
  },

  /**
   * Get available license categories for the user
   */
  async getUserLicenseCategories(): Promise<ApiResponse<LicenseCategoryOption[]>> {
    const response = await apiClient.get('license-categories');
    return response.data;
  },

  /**
   * Get applications waiting for license issuance (after payment stage)
   */
  async getIssuancePending(
    filters: {
      page?: number;
      pageSize?: number;
      search?: string;
    } = {}
  ): Promise<ApiResponse<any>> {
    const response = await apiClient.get('applications/issuance-pending', { params: filters });
    return response.data;
  },

  /**
   * Issue a license for an application
   */
  async issueLicense(applicationId: number): Promise<ApiResponse<LicenseDto>> {
    const response = await apiClient.post(`licenses/application/${applicationId}/issue`);
    return response.data;
  },
};

export default LicenseService;