import axios from '@/lib/api-client';

export interface UserDto {
  id: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  appRole: string;
  isActive: boolean;
  requiresPasswordReset: boolean;
  createdAt: string;
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
  async getAllUsers(): Promise<UserDto[]> {
    const response = await axios.get<{ data: UserDto[] }>('/api/v1/users');
    return response.data.data;
  },

  async getUserById(userId: string): Promise<UserDto> {
    const response = await axios.get<{ data: UserDto }>(`/api/v1/users/${userId}`);
    return response.data.data;
  },

  async createUser(request: CreateUserRequest): Promise<CreateUserResponse> {
    const response = await axios.post<{ data: CreateUserResponse }>('/api/v1/users', request);
    return response.data.data;
  },

  async updateUserStatus(userId: string, isActive: boolean): Promise<void> {
    await axios.patch(`/api/v1/users/${userId}/status`, { isActive });
  },

  async updateUserRole(userId: string, appRole: string): Promise<void> {
    await axios.patch(`/api/v1/users/${userId}/role`, { appRole });
  },
};

export default userService;