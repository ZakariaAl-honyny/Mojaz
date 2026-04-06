import apiClient from '@/lib/api-client';
import { ApiResponse } from '@/types/api.types';
import { 
  RegisterRequest, 
  RegisterResponse, 
  VerifyOtpRequest, 
  ResendOtpRequest,
  LoginResponse,
  LoginRequest
} from '@/types/auth.types';

export const authService = {
  /**
   * Register a new user (Email or Phone)
   */
  async register(data: RegisterRequest): Promise<ApiResponse<RegisterResponse>> {
    const response = await apiClient.post<ApiResponse<RegisterResponse>>('/auth/register', data);
    return response.data;
  },

  /**
   * Verify OTP code for registration, login, etc.
   */
  async verifyOtp(data: VerifyOtpRequest): Promise<ApiResponse<LoginResponse>> {
    const response = await apiClient.post<ApiResponse<LoginResponse>>('/auth/verify-otp', data);
    return response.data;
  },

  /**
   * Resend OTP code if it expired
   */
  async resendOtp(data: ResendOtpRequest): Promise<ApiResponse<string>> {
    const response = await apiClient.post<ApiResponse<string>>('/auth/resend-otp', data);
    return response.data;
  },

  /**
   * Traditional login (NationalId/Email/Phone + Password)
   */
  async login(data: LoginRequest): Promise<ApiResponse<LoginResponse>> {
    const response = await apiClient.post<ApiResponse<LoginResponse>>('/auth/login', data);
    return response.data;
  },

  /**
   * Logout user by clearing refresh token
   */
  async logout(refreshToken: string): Promise<ApiResponse<void>> {
    const response = await apiClient.post<ApiResponse<void>>('/auth/logout', { refreshToken });
    return response.data;
  }
};
