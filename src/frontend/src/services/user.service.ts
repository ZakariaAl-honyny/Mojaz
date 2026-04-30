import apiClient from '@/lib/api-client';
import { ApiResponse, PaginatedResult } from '@/types/api.types';

export interface UserDto {
  id: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  nationalId?: string;
  appRole?: string;
  role?: string | number;
  appRoleValue?: number;
  isActive: boolean;
  requiresPasswordReset: boolean;
  createdAt: string;
  
  // Official Profile Fields
  address?: string;
  city?: string;
  region?: string;
  dateOfBirth?: string;
  gender?: number;
  nationality?: string;
  bloodType?: number;
  isEmailVerified?: boolean;
  isPhoneVerified?: boolean;
  isLocked?: boolean;
  isSecurityBlocked?: boolean;
  userName?: string;
}

export interface CreateUserRequest {
  fullName: string;
  email: string;
  phoneNumber: string;
  appRole: string;
}

export interface CreateUserResponse {
  userId: string;
  temporaryPassword: string;
}

export interface UpdateUserStatusRequest {
  isActive: boolean;
}

export interface UpdateUserRoleRequest {
  appRole: string;
}

export const userService = {
  async getAllUsers(page: number = 1, pageSize: number = 20, search?: string): Promise<UserDto[]> {
    try {
      const response = await apiClient.get<ApiResponse<PaginatedResult<UserDto>>>('users', {
        params: { page, pageSize, search }
      });
      
      const items = response.data.data?.items || [];
      return items.map((item: any) => ({
        ...item,
        appRoleValue: item.appRole // Keep for backward compatibility with UI components
      })) as UserDto[];
    } catch (error) {
      console.error('Error fetching users:', error);
      return [];
    }
  },

  async getEmployees(): Promise<UserDto[]> {
    const response = await apiClient.get<ApiResponse<PaginatedResult<any>>>('users', {
      params: { page: 1, pageSize: 100 }
    });
    const items = response.data.data?.items || [];
    // Filter: keep users with role 1-6 (Receptionist, Doctor, Examiner, Manager, Security, Admin)
    return items
      .map((item: any) => ({
        ...item,
        appRoleValue: item.appRole,
      }))
      .filter((u: any) => {
        const role = u.appRoleValue ?? 0;
        return role >= 1; // Keep roles >= 1 (employees), exclude role 0 (Applicant)
      });
  },

  async getUserById(userId: number): Promise<UserDto> {
    const response = await apiClient.get<ApiResponse<UserDto>>(`users/${userId}`);
    return response.data.data!;
  },

  async createUser(request: CreateUserRequest): Promise<CreateUserResponse> {
    const response = await apiClient.post<ApiResponse<CreateUserResponse>>('users', request);
    return response.data.data!;
  },

  async updateCurrentUser(data: Partial<UserDto>): Promise<UserDto> {
    const response = await apiClient.patch<ApiResponse<UserDto>>('users/me', data);
    return response.data.data!;
  },

  async getMe(): Promise<UserDto> {
    const response = await apiClient.get<ApiResponse<UserDto>>('users/me');
    return response.data.data!;
  },

  async updateUserStatus(userId: number, isActive: boolean): Promise<void> {
    await apiClient.patch(`users/${userId}/status`, { isActive });
  },

  async updateUserRole(userId: number, appRole: string): Promise<void> {
    await apiClient.patch(`users/${userId}/role`, { appRole });
  },
};

export default userService;