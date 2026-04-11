import apiClient from '@/lib/api-client';
import { ApiResponse, PaginatedResult } from '@/types/api.types';

export interface ReportingFilter {
  startDate?: string;
  endDate?: string;
  branchId?: string;
  licenseCategoryId?: string;
}

export interface StatusDistributionDto {
  status: string;
  count: number;
  percentage: number;
  color: string;
}

export interface ServiceStatsDto {
  serviceType: string;
  count: number;
}

export interface DelayedApplicationEntry {
  applicationId: string;
  applicationNumber: string;
  currentStatus: string;
  daysInStage: number;
  applicantName: string;
  branchName: string;
}

export const reportsService = {
  getSummary: async (filter: ReportingFilter) => {
    const response = await apiClient.get<ApiResponse<any>>('/reports/summary', { params: filter });
    return response.data;
  },

  getStatusDistribution: async (filter: ReportingFilter) => {
    const response = await apiClient.get<ApiResponse<StatusDistributionDto[]>>('/reports/status-distribution', { params: filter });
    return response.data;
  },

  getServiceDistribution: async (filter: ReportingFilter) => {
    const response = await apiClient.get<ApiResponse<ServiceStatsDto[]>>('/reports/service-distribution', { params: filter });
    return response.data;
  },

  getDelayedApplications: async (filter: ReportingFilter, page = 1, pageSize = 10) => {
    const response = await apiClient.get<ApiResponse<PaginatedResult<DelayedApplicationEntry>>>('/reports/delayed-applications', { 
      params: { ...filter, page, pageSize } 
    });
    return response.data;
  },

  getTestPerformance: async (filter: ReportingFilter) => {
    const response = await apiClient.get<ApiResponse<any[]>>('/reports/test-performance', { params: filter });
    return response.data;
  },

  getBranchThroughput: async (filter: ReportingFilter) => {
    const response = await apiClient.get<ApiResponse<any[]>>('/reports/branch-throughput', { params: filter });
    return response.data;
  },

  getEmployeeActivity: async (filter: ReportingFilter) => {
    const response = await apiClient.get<ApiResponse<any[]>>('/reports/employee-activity', { params: filter });
    return response.data;
  },

  getIssuanceTimeline: async (filter: ReportingFilter) => {
    const response = await apiClient.get<ApiResponse<any[]>>('/reports/issuance-timeline', { params: filter });
    return response.data;
  },

  exportCsv: async (filter: ReportingFilter) => {
    const response = await apiClient.get('/reports/export-csv', { 
      params: filter,
      responseType: 'blob' 
    });
    return response.data;
  }
};
