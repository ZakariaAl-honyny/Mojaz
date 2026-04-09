import apiClient from '@/lib/api-client';
import { ApiResponse } from '@/types/api.types';
import { 
  ServiceType, 
  LicenseCategoryCode, 
  LicenseCategoryOption, 
  ExamCenter 
} from '@/types/wizard.types';

export interface ApplicationDraftDto {
  id: string;
  applicationNumber: string;
  status: string;
  serviceType: ServiceType;
  licenseCategoryCode: LicenseCategoryCode | null;
  nationalId?: string;
  dateOfBirth?: string;
  nationality?: string;
  gender?: string;
  mobileNumber?: string;
  email?: string;
  address?: string;
  city?: string;
  region?: string;
  applicantType?: string;
  preferredCenterId?: string;
  testLanguage?: string;
  appointmentPreference?: string;
  specialNeedsDeclaration?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PagedResult<T> {
  items: T[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

/**
 * Application Service - handles all application-related API calls
 */
const ApplicationService = {
  /**
   * Check if applicant has any existing draft applications
   */
  async getDrafts(): Promise<ApiResponse<PagedResult<ApplicationDraftDto>>> {
    const response = await apiClient.get('/applications', {
      params: { status: 'Draft', pageSize: 1, page: 1 }
    });
    return response.data;
  },

  /**
   * Get applications with filters (for examiners/admins)
   */
  async getApplications(filters: any): Promise<ApiResponse<PagedResult<any>>> {
    const response = await apiClient.get('/applications', { params: filters });
    return response.data;
  },

  /**
   * Create a new draft application (called after Step 1)
   */
  async createApplication(serviceType: ServiceType): Promise<ApiResponse<ApplicationDraftDto>> {
    const response = await apiClient.post('/applications', { serviceType });
    return response.data;
  },

  /**
   * Update an existing draft application (auto-save and Next button)
   */
  async updateApplication(id: string, data: Partial<ApplicationDraftDto>): Promise<ApiResponse<ApplicationDraftDto>> {
    const response = await apiClient.patch(`/applications/${id}`, data);
    return response.data;
  },

  /**
   * Final submission of the application
   */
  async submitApplication(id: string): Promise<ApiResponse<ApplicationDraftDto>> {
    const response = await apiClient.post(`/applications/${id}/submit`);
    return response.data;
  },

  /**
   * Lookup license categories with min age requirements
   */
  async getLicenseCategories(): Promise<ApiResponse<LicenseCategoryOption[]>> {
    const response = await apiClient.get('/license-categories');
    return response.data;
  },

  /**
   * Lookup active exam centers
   */
  async getExamCenters(): Promise<ApiResponse<ExamCenter[]>> {
    const response = await apiClient.get('/exam-centers', {
      params: { isActive: true }
    });
    return response.data;
  },

  /**
   * Lookup nationalities
   */
  async getNationalities(): Promise<ApiResponse<{ code: string; nameAr: string; nameEn: string }[]>> {
    const response = await apiClient.get('/lookups/nationalities');
    return response.data;
  },

  /**
   * Lookup regions
   */
  async getRegions(): Promise<ApiResponse<{ code: string; nameAr: string; nameEn: string }[]>> {
    const response = await apiClient.get('/lookups/regions');
    return response.data;
  }
};

export default ApplicationService;
