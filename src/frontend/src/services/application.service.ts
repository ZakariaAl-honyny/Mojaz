import apiClient from "@/lib/api-client";
import { ApiResponse, PaginatedResult } from "@/types/api.types";

export interface ApplicationListDto {
  id: string;
  applicationNumber: string;
  applicantFullName: string;
  categoryName: string;
  status: string;
  currentStage: string;
  createdAt: string;
}

export interface ApplicationDetailDto extends ApplicationListDto {
  nationalId: string;
  dateOfBirth: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  region: string;
  applicantType: string;
  preferredCenter: string;
  testLanguage: string;
  specialNeeds: string;
  documents: Array<{
    id: string;
    documentType: string;
    fileName: string;
    status: string;
    rejectionReason?: string;
  }>;
  timeline: Array<{
    id: string;
    stageName: string;
    status: string;
    createdAt: string;
  }>;
}

export interface UpdateStatusRequest {
  status: string;
  remarks?: string;
}

const applicationService = {
  createApplication: async (payload: any) => {
    const response = await apiClient.post<ApiResponse<any>>("/applications", payload);
    return response.data;
  },

  getApplications: async (params?: any) => {
    const response = await apiClient.get<ApiResponse<PaginatedResult<ApplicationListDto>>>("/applications", { params });
    return response.data;
  },

  getApplication: async (id: string) => {
    const response = await apiClient.get<ApiResponse<ApplicationDetailDto>>(`/applications/${id}`);
    return response.data;
  },

  updateStatus: async (id: string, payload: UpdateStatusRequest) => {
    const response = await apiClient.patch<ApiResponse<any>>(`/applications/${id}/status`, payload);
    return response.data;
  },

  getTimeline: async (id: string) => {
    const response = await apiClient.get<ApiResponse<any>>(`/applications/${id}/timeline`);
    return response.data;
  },

  cancelApplication: async (id: string) => {
    const response = await apiClient.patch<ApiResponse<any>>(`/applications/${id}/cancel`);
    return response.data;
  }
};

export default applicationService;
