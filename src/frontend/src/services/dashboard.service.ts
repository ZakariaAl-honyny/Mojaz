import api from '@/lib/api-client';
import { ApiResponse } from '@/types/api.types';
import { DashboardSummaryDto, ManagerKpiDto, AdminKpiDto } from '@/types/application.types';

export const dashboardService = {
  getApplicantDashboard: async () => {
    const response = await api.get<ApiResponse<DashboardSummaryDto>>('/dashboards/applicant');
    return response.data;
  },
  
  getEmployeeQueue: async (params?: any) => {
    // To be implemented in US3
    const response = await api.get<ApiResponse<any>>('/applications/queue', { params });
    return response.data;
  },

  getManagerDashboard: async () => {
    const response = await api.get<ApiResponse<ManagerKpiDto>>('/dashboards/manager');
    return response.data;
  },

  getAdminDashboard: async () => {
    const response = await api.get<ApiResponse<AdminKpiDto>>('/dashboards/admin');
    return response.data;
  }
};
