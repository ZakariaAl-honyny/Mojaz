import { ApiResponse, UserDto } from './api.types';
import { UserRole } from '@/lib/enums';

// Re-export from single source
export { UserRole } from '@/lib/enums';

// ============================================================
// RegistrationMethod - matches backend numeric values
// ============================================================
export enum RegistrationMethod {
  NationalId = 'NationalId',
  Email = 'Email',
  Phone = 'Phone'
}

export enum OtpPurpose {
  Registration = 0,
  Login = 1,
  PasswordReset = 2,
  Payment = 3,
  ApplicationStatus = 4,
  Generic = 5
}

// UserDto is re-exported from api.types.ts

export interface RegisterRequest {
  fullName: string;
  email?: string;
  phone?: string;
  password?: string;
  confirmPassword?: string;
  method: RegistrationMethod;
  preferredLanguage: string;
  termsAccepted: boolean;
}

export interface RegisterResponse {
  userId: number;
  requiresVerification: boolean;
  message: string;
}

export interface VerifyOtpRequest {
  destination: string;
  code: string;
  purpose: OtpPurpose;
}

export interface ResendOtpRequest {
  destination: string;
  purpose: OtpPurpose;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: UserDto;
}

export interface LoginRequest {
  identifier: string;
  password: string;
  method?: RegistrationMethod;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface LogoutRequest {
  refreshToken: string;
}

export interface ForgotPasswordRequest {
  identifier: string;
  method: RegistrationMethod;
}

export interface ResetPasswordRequest {
  identifier: string;
  code: string;
  newPassword: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}