// Enum utilities for converting between frontend display values and backend numeric values
// Backend uses tinyint enums, frontend uses numeric enums that match backend exactly

import { ServiceType, ApplicationStatus, UserRole, Gender } from '@/lib/enums';
import { RegistrationMethod, OtpPurpose } from '@/types/auth.types';

// ============================================================
// ServiceType conversions
// Backend: NewLicense=0, Renewal=1, Replacement=2, CategoryUpgrade=3, 
//          InternationalLicense=4, StatusChange=5, MedicalExtension=6, TemporaryLicense=7
// ============================================================

export const serviceTypeToNumber = (value: ServiceType | number | null | undefined): number | null => {
  if (value === null || value === undefined) return null;
  if (typeof value === 'number') return value;
  return value; // Already numeric enum
};

export const serviceTypeFromNumber = (value: number | string | null | undefined): ServiceType | null => {
  if (value === null || value === undefined) return null;
  return Number(value) as ServiceType;
};

// ============================================================
// LicenseCategoryCode conversions
// Backend: A=0, B=1, C=2, D=3, E=4, F=5
// ============================================================

export const licenseCategoryToNumber = (value: string | number | null | undefined): number | null => {
  if (value === null || value === undefined) return null;
  if (typeof value === 'number') return value;
  const mapping: Record<string, number> = {
    'A': 0,
    'B': 1,
    'C': 2,
    'D': 3,
    'E': 4,
    'F': 5,
  };
  return mapping[value] ?? null;
};

export const licenseCategoryFromNumber = (value: number | string | null | undefined): string | null => {
  if (value === null || value === undefined) return null;
  const mapping: Record<number, string> = {
    0: 'A',
    1: 'B',
    2: 'C',
    3: 'D',
    4: 'E',
    5: 'F',
  };
  return mapping[Number(value)] ?? null;
};

// ============================================================
// ApplicationStatus conversions
// Backend: Draft=0, Submitted=1, DocumentReview=2, InReview=3, MedicalExam=4,
//          Training=5, TheoryTest=6, PracticalTest=7, Approved=8, Payment=9,
//          Issued=10, Active=11, Rejected=12, Cancelled=13, Expired=14
// ============================================================

export const applicationStatusToNumber = (value: ApplicationStatus | number | null | undefined): number | null => {
  if (value === null || value === undefined) return null;
  if (typeof value === 'number') return value;
  return value; // Already numeric enum
};

export const applicationStatusFromNumber = (value: number | string | null | undefined): ApplicationStatus | null => {
  if (value === null || value === undefined) return null;
  return Number(value) as ApplicationStatus;
};

// ============================================================
// UserRole conversions
// Backend: Applicant=0, Receptionist=1, Doctor=2, Examiner=3, Manager=4, Security=5, Admin=6
// ============================================================

export const userRoleToNumber = (value: UserRole | number | null | undefined): number | null => {
  if (value === null || value === undefined) return null;
  if (typeof value === 'number') return value;
  return value; // Already numeric enum
};

export const userRoleFromNumber = (value: number | string | null | undefined): UserRole | null => {
  if (value === null || value === undefined) return null;
  return Number(value) as UserRole;
};

// ============================================================
// Gender conversions
// Backend: NotSpecified=0, Male=1, Female=2
// Frontend: Gender enum (numeric) matching backend
// ============================================================

export const genderToNumber = (value: Gender | number | null | undefined): number | null => {
  if (value === null || value === undefined) return null;
  // If already number, return directly (Gender enum is numeric)
  return typeof value === 'number' ? value : Number(value);
};

export const genderFromNumber = (value: number | string | null | undefined): Gender | null => {
  if (value === null || value === undefined) return null;
  const num = Number(value);
  // Validate range: 0-2
  if (num >= 0 && num <= 2) return num as Gender;
  return null;
};

// ============================================================
// RegistrationMethod conversions
// Backend: NationalId=0, Email=1, Phone=2
// ============================================================

export const registrationMethodToNumber = (value: RegistrationMethod | number | null | undefined): number | null => {
  if (value === null || value === undefined) return null;
  if (typeof value === 'number') return value;
  return value;
};

export const registrationMethodFromNumber = (value: number | string | null | undefined): RegistrationMethod | null => {
  if (value === null || value === undefined) return null;
  return Number(value) as RegistrationMethod;
};

// ============================================================
// OtpPurpose conversions
// Backend: Registration=0, Login=1, PasswordReset=2, Payment=3, ApplicationStatus=4, Generic=5
// ============================================================

export const otpPurposeToNumber = (value: OtpPurpose | number | null | undefined): number | null => {
  if (value === null || value === undefined) return null;
  if (typeof value === 'number') return value;
  return value;
};

export const otpPurposeFromNumber = (value: number | string | null | undefined): OtpPurpose | null => {
  if (value === null || value === undefined) return null;
  return Number(value) as OtpPurpose;
};

// ============================================================
// ApplicantType conversions (Step 4)
// Frontend: "Citizen" | "Resident"
// Backend: 0 = Citizen, 1 = Resident
// ============================================================

export const applicantTypeToNumber = (value: 'Citizen' | 'Resident' | string | number | null | undefined): number | null => {
  if (value === null || value === undefined) return null;
  if (value === 'Citizen' || value === 0) return 0;
  if (value === 'Resident' || value === 1) return 1;
  return null;
};

export const applicantTypeFromNumber = (value: number | string | null | undefined): 'Citizen' | 'Resident' | null => {
  if (value === null || value === undefined) return null;
  const num = Number(value);
  if (num === 0) return 'Citizen';
  if (num === 1) return 'Resident';
  return null;
};