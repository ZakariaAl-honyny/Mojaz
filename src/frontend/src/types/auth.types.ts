import { ApiResponse } from './api.types';

export enum UserRole {
  Applicant = 0,
  Receptionist = 1,
  Doctor = 2,
  Examiner = 3,
  Manager = 4,
  Security = 5,
  Admin = 6
}

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
  userId: string;
  code: string;
  type: OtpPurpose;
}

export interface ResendOtpRequest {
  userId: string;
  type: OtpPurpose;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: UserDto;
}
