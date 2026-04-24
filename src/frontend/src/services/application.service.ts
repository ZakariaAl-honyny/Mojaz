import apiClient from '@/lib/api-client';
import { ApiResponse } from '@/types/api.types';
import { ServiceType, LicenseCategoryCode, LicenseCategoryOption, ExamCenter } from '@/types/wizard.types';
import { 
  VerifyStolenReportRequest, 
  VerifyStolenReportResponse 
} from '@/types/application.types';
import { 
  DocumentDto, 
  DocumentReviewRequest 
} from '@/types/document.types';

export interface ApplicationDraftDto {
  id: string;
  applicationNumber: string;
  status: string;
  currentStage?: string;
  currentStageNumber?: number;
  serviceType: ServiceType;
  licenseCategoryCode: LicenseCategoryCode | null;
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
  testLanguage?: string;
  appointmentPreference?: string;
  specialNeedsDeclaration?: boolean;
  createdAt: string;
  updatedAt: string;
}

/**
 * Full application details for review pages
 */
export interface ApplicationWithDetailsDto extends ApplicationDraftDto {
  applicantName?: string;
  fullName?: string;
  dateOfBirth?: string;
  gender?: string;
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
  stageId: string;
  stageNameAr: string;
  stageNameEn: string;
  stageOrder: number;
  status: 'pending' | 'in_progress' | 'completed' | 'rejected' | 'skipped';
  completedAt?: string;
  completedBy?: string;
  notes?: string;
  isCurrentStage: boolean;
}

/**
 * Full application timeline with all stages
 */
export interface ApplicationTimelineDto {
  applicationId: string;
  applicationNumber: string;
  currentStageOrder: number;
  stages: TimelineStageDto[];
}

import { TimelineStage } from "@/components/domain/application/ApplicationTimeline";

/**
 * Converts application status to timeline stage
 */
export function convertToTimelineStageArray(timeline: ApplicationTimelineDto): TimelineStage[] {
  const stageStatusMap: Record<TimelineStageDto['status'], TimelineStage['status']> = {
    'completed': 'completed',
    'in_progress': 'current',
    'pending': 'pending',
    'rejected': 'failed',
    'skipped': 'failed',
  };

  return timeline.stages
    .sort((a, b) => a.stageOrder - b.stageOrder)
    .map((stage) => ({
      id: stage.stageId,
      label: stage.stageNameAr,
      status: stageStatusMap[stage.status] || 'pending',
      timestamp: stage.completedAt,
      reason: stage.notes,
    }));
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
   * Verify eligibility for license category upgrade
   */
  async checkUpgradeEligibility(nationalId: string): Promise<ApiResponse<LicenseCategoryOption[]>> {
    const response = await apiClient.get('/applications/check-upgrade-eligibility', {
      params: { nationalId }
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
  },

  /**
   * Verify stolen report for license replacement
   */
  async verifyStolenReport(id: string, data: VerifyStolenReportRequest): Promise<ApiResponse<VerifyStolenReportResponse>> {
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
   * Get full application details with applicant info and documents
   */
  async getApplicationDetails(id: string): Promise<ApiResponse<ApplicationWithDetailsDto>> {
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
    id: string, 
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
    id: string, 
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
    id: string, 
    reason: string
  ): Promise<ApiResponse<ApplicationDraftDto>> {
    const response = await apiClient.patch(
      `/applications/${id}/reject?reason=${encodeURIComponent(reason)}`
    );
    return response.data;
  },

  /**
   * Get documents for an application
   */
  async getApplicationDocuments(applicationId: string): Promise<ApiResponse<DocumentDto[]>> {
    const response = await apiClient.get(`/applications/${applicationId}/documents`);
    return response.data;
  },

  /**
   * Review a single document
   */
  async reviewDocument(
    applicationId: string,
    documentId: string,
    review: DocumentReviewRequest
  ): Promise<ApiResponse<DocumentDto>> {
    const response = await apiClient.patch(
      `/applications/${applicationId}/documents/${documentId}/review`,
      review
    );
    return response.data;
  },

  /**
   * Review all documents for an application (bulk approve)
   */
  async reviewAllDocuments(
    applicationId: string,
    approved: boolean,
    rejectionReason?: string
  ): Promise<ApiResponse<{ reviewResults: DocumentDto[] }>> {
    const response = await apiClient.patch(
      `/applications/${applicationId}/documents/review-all`,
      { approved, rejectionReason }
    );
    return response.data;
  },

  /**
   * Get application timeline with all stages
   */
  async getTimeline(applicationId: string): Promise<ApiResponse<ApplicationTimelineDto>> {
    const response = await apiClient.get(`/applications/${applicationId}/timeline`);
    return response.data;
  },

  /**
   * Get application details by ID
   */
  async getApplicationById(id: string): Promise<ApiResponse<ApplicationDraftDto>> {
    const response = await apiClient.get(`/applications/${id}`);
    return response.data;
  },

  /**
   * Get application details by ID (alias)
   */
  async getById(id: string): Promise<ApiResponse<ApplicationDraftDto>> {
    const response = await apiClient.get(`/applications/${id}`);
    return response.data;
  },

  /**
   * Delete (soft delete) an application
   */
  async deleteApplication(id: string): Promise<ApiResponse<void>> {
    const response = await apiClient.delete(`/applications/${id}`);
    return response.data;
  },
};

export { ApplicationService };
export default ApplicationService;
