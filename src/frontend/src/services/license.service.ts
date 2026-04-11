import apiClient from '@/lib/api-client';
import { ApiResponse } from '@/types/api.types';

export interface LicenseDto {
  id: string;
  licenseNumber: string;
  licenseCategoryCode: string;
  licenseCategoryNameEn: string;
  licenseCategoryNameAr: string;
  status: string;
  issuedAt: string;
  expiresAt: string;
}

export interface UpgradeTargetCategory {
  id: string;
  code: string;
  nameEn: string;
  nameAr: string;
  minAge: number;
  descriptionEn: string;
  descriptionAr: string;
  requiresFieldTest: boolean;
}

/**
 * License Service - handles license-related API calls
 */
const LicenseService = {
  /**
   * Get current user's active licenses
   */
  async getUserLicenses(): Promise<ApiResponse<LicenseDto[]>> {
    const response = await apiClient.get('/licenses/my');
    return response.data;
  },

  /**
   * Get available upgrade targets for a specific license
   */
  async getUpgradeTargets(currentLicenseId: string): Promise<ApiResponse<UpgradeTargetCategory[]>> {
    const response = await apiClient.get(`/licenses/${currentLicenseId}/upgrade-targets`);
    return response.data;
  },

  /**
   * Submit an upgrade application
   */
  async submitUpgrade(licenseId: string, targetCategoryId: string, branchId: string): Promise<ApiResponse<any>> {
    const response = await apiClient.post('/applications/upgrade', {
      currentLicenseId: licenseId,
      targetCategoryId,
      branchId,
    });
    return response.data;
  },

  /**
   * Check eligibility for license replacement
   */
  async checkReplacementEligibility(): Promise<ApiResponse<{
    isEligible: boolean;
    licenseId: string;
    licenseNumber: string;
    expiryDate: string;
    message?: string;
  }>> {
    const response = await apiClient.get('/applications/replacement/eligibility');
    return response.data;
  },

  /**
   * Submit a replacement application
   */
  async submitReplacement(data: {
    licenseId: string;
    reason: any;
    documentIds?: string[];
  }): Promise<ApiResponse<{ id: string }>> {
    const response = await apiClient.post('/applications/replacement', data);
    return response.data;
  },
};

export default LicenseService;