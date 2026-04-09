import api from '@/lib/api-client';
import { ApiResponse } from '@/types/api.types';
import { DashboardSummaryDto, ManagerKpiDto } from '@/types/application.types';

export const dashboardService = {
  getApplicantDashboard: async () => {
    const response = await api.get<ApiResponse<DashboardSummaryDto>>('/api/v1/dashboards/applicant');
    return response.data;
  },
  
  getEmployeeQueue: async (params?: any) => {
    // To be implemented in US3
    const response = await api.get<ApiResponse<any>>('/api/v1/applications/queue', { params });
    return response.data;
  },

  getManagerDashboard: async () => {
    const response = await api.get<ApiResponse<ManagerKpiDto>>('/api/v1/dashboards/manager');
    return response.data;
  }
};
