import api from '@/lib/api-client';
import { ApiResponse, QueryParams } from '@/types/api.types';
import { PagedResult } from './application.service';
import { DashboardSummaryDto, ManagerKpiDto, AdminKpiDto, ApplicationSummaryDto } from '@/types/application.types';

// Map backend ApplicationDto to frontend ApplicationSummaryDto
interface BackendApplicationDto {
  id: string;
  applicationNumber: string;
  applicantName: string;
  licenseCategoryCode: string;
  serviceType: number;
  currentStage: string | null;
  status: number;
  submittedAt: string | null;
  updatedAt: string | null;
  createdAt: string;
  licenseCategoryNameAr?: string;
}

function mapToSummaryDto(dto: BackendApplicationDto): ApplicationSummaryDto {
  return {
    id: dto.id,
    applicationNumber: dto.applicationNumber,
    applicantName: dto.applicantName,
    licenseCategoryCode: dto.licenseCategoryCode,
    serviceType: dto.serviceType,
    currentStage: dto.currentStage || '',
    status: dto.status as any,
    submittedDate: dto.submittedAt || dto.createdAt,
    updatedAt: dto.updatedAt || dto.createdAt,
    licenseCategoryNameAr: dto.licenseCategoryNameAr,
  };
}

export const dashboardService = {
  getApplicantDashboard: async () => {
    const response = await api.get<ApiResponse<DashboardSummaryDto>>('dashboards/applicant');
    return response.data;
  },
   
  getEmployeeQueue: async (params?: QueryParams) => {
    const response = await api.get<ApiResponse<any>>('applications/queue', { params });
    // Map the response to ensure correct property names
    const data = response.data?.data;
    if (data?.items) {
      return {
        ...response.data,
        data: {
          ...data,
          items: data.items.map(mapToSummaryDto),
        },
      };
    }
    return response.data;
  },

  getEmployeeDashboard: async () => {
    const response = await api.get<ApiResponse<any>>('dashboards/employee');
    return response.data;
  },

  getReceptionistDashboard: async () => {
    const response = await api.get<ApiResponse<any>>('dashboards/receptionist');
    return response.data;
  },

  getManagerDashboard: async () => {
    const response = await api.get<ApiResponse<ManagerKpiDto>>('dashboards/manager');
    return response.data;
  },

  getAdminDashboard: async () => {
    const response = await api.get<ApiResponse<AdminKpiDto>>('dashboards/admin');
    return response.data;
  }
};
