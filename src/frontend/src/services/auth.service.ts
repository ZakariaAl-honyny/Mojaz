import apiClient from '@/lib/api-client';
import { ApiResponse } from '@/types/api.types';
import { 
  RegisterRequest, 
  RegisterResponse, 
  VerifyOtpRequest, 
  ResendOtpRequest,
  LoginResponse,
  LoginRequest,
  RefreshTokenRequest,
  LogoutRequest,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  ChangePasswordRequest
} from '@/types/auth.types';

export const authService = {
  /**
   * Register a new user (Email or Phone)
   */
  async register(data: RegisterRequest): Promise<ApiResponse<RegisterResponse>> {
    const response = await apiClient.post<ApiResponse<RegisterResponse>>('auth/register', data);
    return response.data;
  },

  /**
   * Register a new user with email
   */
  async registerWithEmail(data: RegisterRequest): Promise<ApiResponse<RegisterResponse>> {
    const response = await apiClient.post<ApiResponse<RegisterResponse>>('auth/register/email', data);
    return response.data;
  },

  /**
   * Register a new user with phone
   */
  async registerWithPhone(data: RegisterRequest): Promise<ApiResponse<RegisterResponse>> {
    const response = await apiClient.post<ApiResponse<RegisterResponse>>('auth/register/phone', data);
    return response.data;
  },

  /**
   * Verify OTP code for registration, login, etc.
   */
  async verifyOtp(data: VerifyOtpRequest): Promise<ApiResponse<LoginResponse>> {
    const response = await apiClient.post<ApiResponse<LoginResponse>>('auth/verify-otp', data);
    return response.data;
  },

  /**
   * Resend OTP code if it expired
   */
  async resendOtp(data: ResendOtpRequest): Promise<ApiResponse<string>> {
    const response = await apiClient.post<ApiResponse<string>>('auth/resend-otp', data);
    return response.data;
  },

  /**
   * Traditional login (NationalId/Email/Phone + Password)
   */
  async login(data: LoginRequest): Promise<ApiResponse<LoginResponse>> {
    const response = await apiClient.post<ApiResponse<LoginResponse>>('auth/login', data);
    return response.data;
  },

  /**
   * Logout user by clearing refresh token
   */
  async logout(data: LogoutRequest): Promise<ApiResponse<void>> {
    const response = await apiClient.post<ApiResponse<void>>('auth/logout', data);
    return response.data;
  },

  /**
   * Change password for authenticated user
   */
  async changePassword(currentPassword: string, newPassword: string): Promise<ApiResponse<boolean>> {
    const response = await apiClient.post<ApiResponse<boolean>>('auth/change-password', {
      currentPassword,
      newPassword,
      confirmPassword: newPassword
    });
    return response.data;
  },

  /**
   * Refresh access token using refresh token
   */
  async refreshToken(data: RefreshTokenRequest): Promise<ApiResponse<LoginResponse>> {
    const response = await apiClient.post<ApiResponse<LoginResponse>>('auth/refresh-token', data);
    return response.data;
  },

  /**
   * Request password reset OTP
   */
  async forgotPassword(data: ForgotPasswordRequest): Promise<ApiResponse<string>> {
    const response = await apiClient.post<ApiResponse<string>>('auth/forgot-password', data);
    return response.data;
  },

  /**
   * Reset password with OTP
   */
  async resetPassword(data: ResetPasswordRequest): Promise<ApiResponse<LoginResponse>> {
    const response = await apiClient.post<ApiResponse<LoginResponse>>('auth/reset-password', data);
    return response.data;
  }
};
