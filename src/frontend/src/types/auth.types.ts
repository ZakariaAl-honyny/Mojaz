import { ApiResponse } from './api.types';

// ============================================================
// UserRole - matches backend numeric values
// Backend: Applicant=0, Receptionist=1, Doctor=2, Examiner=3, Manager=4, Admin=5, Security=6
// ============================================================
export enum UserRole {
  Applicant = 0,
  Receptionist = 1,
  Doctor = 2,
  Examiner = 3,
  Manager = 4,
  Admin = 5,
  Security = 6
}

// Display labels for UserRole
export const UserRoleLabels = {
  [UserRole.Applicant]: { ar: 'متقدم', en: 'Applicant' },
  [UserRole.Receptionist]: { ar: 'موظف الاستقبال', en: 'Receptionist' },
  [UserRole.Doctor]: { ar: 'طبيب', en: 'Doctor' },
  [UserRole.Examiner]: { ar: 'مفتش', en: 'Examiner' },
  [UserRole.Manager]: { ar: 'مدير', en: 'Manager' },
  [UserRole.Admin]: { ar: 'مدير النظام', en: 'Admin' },
  [UserRole.Security]: { ar: 'امن', en: 'Security' },
} as const;

export enum RegistrationMethod {
  NationalId = 0,
  Email = 1,
  Phone = 2
}

export enum OtpPurpose {
  Registration = 0,
  Login = 1,
  PasswordReset = 2,
  Payment = 3,
  ApplicationStatus = 4,
  Generic = 5
}

export interface UserDto {
  id: string;
  fullName: string;
  email?: string;
  phone?: string;
  role: UserRole;
  isActive: boolean;
  preferredLanguage: string;
}

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
  userId: string;
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
  destination: string;
  purpose: OtpPurpose;
}

export interface ResetPasswordRequest {
  userId: string;
  code: string;
  newPassword: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}