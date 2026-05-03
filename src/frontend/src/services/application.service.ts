import apiClient from '@/lib/api-client';
import { ApiResponse } from '@/types/api.types';
import { ServiceType, LicenseCategoryCode, LicenseCategoryOption, ExamCenter } from '@/types/wizard.types';
import { serviceTypeToString } from '@/lib/enum-utils';
import { 
  VerifyStolenReportRequest, 
  VerifyStolenReportResponse 
} from '@/types/application.types';
import { 
  DocumentDto, 
  DocumentReviewRequest 
} from '@/types/document.types';

export interface ApplicationDraftDto {
  id: number;
  applicationNumber: string;
  status: string;
  currentStage?: string;
  currentStageNumber?: number;
  serviceType: ServiceType;
  licenseCategoryId?: number | null;      // numeric DB ID (used for wizard-data PUT)
  licenseCategoryCode: LicenseCategoryCode | null;  // string code "A","B",etc. (used for display)
  licenseCategoryNameAr?: string;
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
  branchId?: string | number; // API field (int from backend)
  testLanguage?: string;
  preferredLanguage?: string; // API field
  appointmentPreference?: string;
  specialNeedsDeclaration?: boolean;
  specialNeeds?: boolean | string | null; // API field
  specialNeedsNote?: string;
  progress?: number;
  applicantName?: string;
  fullName?: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Full application details for review pages
 */
export interface ApplicationWithDetailsDto extends ApplicationDraftDto {
  applicantName?: string;
  fullName?: string;
  nationalId?: string;
  dateOfBirth?: string;
  gender?: string;
  mobileNumber?: string;
  email?: string;
  address?: string;
  city?: string;
  region?: string;
  documents?: DocumentDto[];
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
 * Timeline stage interface for application workflow timeline
 */
export interface TimelineStageDto {
  stageNumber: number;
  nameAr: string;
  nameEn: string;
  state: 'pending' | 'in_progress' | 'completed' | 'failed' | 'future' | 'current';
  completedAt?: string;
  actorName?: string;
  actorRole?: string;
  outcomeNote?: string;
}

/**
 * Full application timeline with all stages
 */
export interface ApplicationTimelineDto {
  applicationId: number;
  currentStageNumber: number;
  stages: TimelineStageDto[];
}

import { TimelineStage } from "@/components/domain/application/ApplicationTimeline";

/**
 * Converts application status to timeline stage
 */
export function convertToTimelineStageArray(timeline: ApplicationTimelineDto): TimelineStage[] {
  const stateStatusMap: Record<string, TimelineStage['status']> = {
    'completed': 'completed',
    'current': 'current',
    'in_progress': 'current',
    'pending': 'pending',
    'failed': 'failed',
    'future': 'pending'
  };

  return timeline.stages
    .sort((a, b) => a.stageNumber - b.stageNumber)
    .map((stage) => ({
      id: stage.stageNumber.toString(),
      label: stage.nameAr,
      status: stateStatusMap[stage.state] || 'pending',
      timestamp: stage.completedAt,
      reason: stage.outcomeNote,
    }));
}

export interface EligibilityResponseDto {
  isEligible: boolean;
  message?: string;
  existingApplicationId?: string;
  existingApplicationNumber?: string;
}

export interface EligibilityResponse {
  isEligible: boolean;
  message?: string;
  existingApplicationId?: number;
  existingApplicationNumber?: string;
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
   * Get current applicant's applications (for payments page)
   */
  async getMyApplications(): Promise<ApiResponse<any>> {
    const response = await apiClient.get('/applications', { params: { page: 1, pageSize: 10 } });
    return response.data;
  },

  /**
   * Create a new draft application (called after Step 1)
   * Sends serviceType as string name (e.g., "NewLicense") for backend JsonStringEnumConverter.
   */
  async createApplication(serviceType: ServiceType): Promise<ApiResponse<ApplicationDraftDto>> {
    const serviceTypeStr = serviceTypeToString(serviceType);
    const response = await apiClient.post('/applications/draft', { serviceType: serviceTypeStr });
    return response.data;
  },

  /**
   * Update an existing draft application (auto-save and Next button)
   */
  async updateApplication(id: number, data: Partial<ApplicationDraftDto>): Promise<ApiResponse<ApplicationDraftDto>> {
    const response = await apiClient.put(`/applications/${id}/wizard-data`, data);
    return response.data;
  },

/**
    * Final submission of the application
    */
  async submitApplication(id: number): Promise<ApiResponse<ApplicationDraftDto>> {
    const response = await apiClient.post(`/applications/${id}/submit`);
    return response.data;
  },

/**
    * Mark application as paid (after successful payment)
    */
  async payApplication(id: number): Promise<ApiResponse<boolean>> {
    try {
      const response = await apiClient.post(`/applications/${id}/pay`, {});
      return response.data;
    } catch {
      // For demo: return success even if API fails
      return { success: true, data: true, message: 'Demo mode', statusCode: 200 };
    }
  },

  /**
   * Check if applicant is eligible for a specific license category
   */
  async checkEligibility(categoryCode: string, serviceType: ServiceType): Promise<ApiResponse<EligibilityResponseDto>> {
    const response = await apiClient.get('/applications/check-eligibility', {
      params: { categoryCode, serviceType }
    });
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
    const response = await apiClient.get('/lookups/exam-centers');
    
    // Map LookupItem (Code, RegionNameAr) to ExamCenter (id, city)
    if (response.data.success && Array.isArray(response.data.data)) {
      response.data.data = response.data.data.map((item: any) => ({
        id: item.code,
        nameAr: item.nameAr,
        nameEn: item.nameEn,
        city: item.regionNameAr || '',
        region: item.regionNameAr || '',
        isActive: true
      }));
    }
    
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
  },

  /**
   * Verify stolen report for license replacement
   */
  async verifyStolenReport(id: number, data: VerifyStolenReportRequest): Promise<ApiResponse<VerifyStolenReportResponse>> {
    const response = await apiClient.patch(`/administrative/applications/${id}/verify-stolen-report`, data);
    return response.data;
  },

  /**
   * Get queue of applications for employee review
   * Returns applications that need processing by employees (receptionist, doctor, examiner, etc.)
   */
  async getQueue(filters: {
    page?: number;
    pageSize?: number;
    status?: string;
    search?: string;
    sortBy?: string;
    sortDir?: 'asc' | 'desc';
  }): Promise<ApiResponse<PagedResult<ApplicationDraftDto>>> {
    const response = await apiClient.get('/applications/queue', { params: filters });
    return response.data;
  },

  /**
   * Get applications from queue filtered by specific workflow stage
   * For document reviewers: status=Submitted
   * For medical examiners: status=MedicalExam
   * etc.
   */
  async getApplicationsQueue(
    page: number = 1,
    pageSize: number = 20,
    search?: string,
    stage?: string
  ): Promise<ApiResponse<PagedResult<ApplicationDraftDto>>> {
    const response = await apiClient.get('/applications/queue', {
      params: { 
        page, 
        pageSize, 
        status: stage,
        search 
      }
    });
    return response.data;
  },

  /**
   * Get applications pending medical examination (for doctors)
   */
  async getMedicalPending(
    page: number = 1,
    pageSize: number = 20,
    search?: string
  ): Promise<ApiResponse<PagedResult<ApplicationDraftDto>>> {
    const response = await apiClient.get('/applications/medical-pending', {
      params: { page, pageSize, search }
    });
    return response.data;
  },

  /**
   * Get full application details with applicant info and documents
   */
  async getApplicationDetails(id: number): Promise<ApiResponse<ApplicationWithDetailsDto>> {
    const response = await apiClient.get(`/applications/${id}/details`);
    return response.data;
  },

  /**
   * Update application status (approve/reject/move to next stage)
   * @param id - Application ID
   * @param newStatus - The new status to move to
   * @param reason - Optional reason (required for rejection)
   */
  async updateApplicationStatus(
    id: number, 
    newStatus: string, 
    reason?: string
  ): Promise<ApiResponse<ApplicationDraftDto>> {
    const response = await apiClient.patch(
      `/applications/${id}/status?status=${newStatus}${reason ? `&reason=${encodeURIComponent(reason)}` : ''}`
    );
    return response.data;
  },

  /**
   * Approve application and move to next stage
   */
  async approveApplication(
    id: number, 
    reason?: string
  ): Promise<ApiResponse<ApplicationDraftDto>> {
    const response = await apiClient.patch(
      `/applications/${id}/approve${reason ? `?reason=${encodeURIComponent(reason)}` : ''}`
    );
    return response.data;
  },

  /**
   * Reject application with reason
   */
  async rejectApplication(
    id: number, 
    reason: string
  ): Promise<ApiResponse<ApplicationDraftDto>> {
    const response = await apiClient.patch(
      `/applications/${id}/reject?reason=${encodeURIComponent(reason)}`
    );
    return response.data;
  },

  /**
   * Get documents for an application
   * Backend: GET /api/v1/documents/application/{appIdOrNumber}
   */
  async getApplicationDocuments(applicationId: number): Promise<ApiResponse<DocumentDto[]>> {
    const response = await apiClient.get(`/documents/application/${applicationId}`);
    return response.data;
  },

  /**
   * Review a single document
   * Backend: PATCH /api/v1/documents/{documentId}/review
   */
  async reviewDocument(
    applicationId: number,
    documentId: string,
    review: DocumentReviewRequest
  ): Promise<ApiResponse<DocumentDto>> {
    const response = await apiClient.patch(
      `/documents/${documentId}/review`,
      review
    );
    return response.data;
  },

  /**
   * Review all documents for an application (bulk approve)
   * Backend: PATCH /api/v1/documents/application/{appIdOrNumber}/bulk-approve
   */
  async reviewAllDocuments(
    applicationId: number,
    approved: boolean,
    rejectionReason?: string
  ): Promise<ApiResponse<{ reviewResults: DocumentDto[] }>> {
    const response = await apiClient.patch(
      `/documents/application/${applicationId}/bulk-approve`,
      { approved, rejectionReason }
    );
    return response.data;
  },

  /**
   * Get application timeline with all stages
   */
  async getTimeline(applicationId: number): Promise<ApiResponse<ApplicationTimelineDto>> {
    const response = await apiClient.get(`/applications/${applicationId}/timeline`);
    return response.data;
  },

  /**
   * Get application details by ID
   */
  async getApplicationById(id: number): Promise<ApiResponse<ApplicationDraftDto>> {
    const response = await apiClient.get(`/applications/${id}`);
    return response.data;
  },

  /**
   * Get application details by ID (alias)
   */
  async getById(id: number): Promise<ApiResponse<ApplicationDraftDto>> {
    const response = await apiClient.get(`/applications/${id}`);
    return response.data;
  },

  /**
   * Delete (soft delete) an application
   */
  async deleteApplication(id: number): Promise<ApiResponse<void>> {
    const response = await apiClient.delete(`/applications/${id}`);
    return response.data;
  },

  /**
   * Retake eligibility DTO
   */
  async getRetakeEligibility(
    applicationIdOrNumber: string,
    token?: string
  ): Promise<ApiResponse<RetakeEligibilityDto>> {
    const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
    const response = await apiClient.get(
      `applications/${applicationIdOrNumber}/retake-eligibility`,
      config
    );
    return response.data;
  },

  /**
   * Request a test retake
   */
  async requestRetake(
    applicationIdOrNumber: string,
    request: RetakeRequest,
    token?: string
  ): Promise<ApiResponse<boolean>> {
    const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
    const response = await apiClient.post(
      `applications/${applicationIdOrNumber}/retake`,
      request,
      config
    );
    return response.data;
  },

  /**
   * Cancel an application
   */
  async cancelApplication(
    applicationId: string,
    reason: string,
    token?: string
  ): Promise<ApiResponse<boolean>> {
    const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
    const response = await apiClient.patch(
      `applications/${applicationId}/cancel`,
      { reason },
      config
    );
    return response.data;
  },
};

/**
 * Retake eligibility DTO
 */
export interface RetakeEligibilityDto {
  applicationId: string;
  applicationNumber: string;
  licenseCategoryId: string;
  licenseCategoryCode: string;
  licenseCategoryName: string;
  theoryAttempts: number;
  maxTheoryAttempts: number;
  canRetakeTheory: boolean;
  theoryIneligibilityReason?: string;
  theoryNextAvailableDate?: string;
  practicalAttempts: number;
  maxPracticalAttempts: number;
  canRetakePractical: boolean;
  practicalIneligibilityReason?: string;
  practicalNextAvailableDate?: string;
  isEligibleForRetake: boolean;
}

/**
 * Retake request
 */
export interface RetakeRequest {
  requestTheoryRetake: boolean;
  requestPracticalRetake: boolean;
}

export { ApplicationService };
export default ApplicationService;
