// ============================================================
// UserRole Enum - MUST match Backend exactly
// Backend: Applicant=0, Receptionist=1, Doctor=2, Examiner=3, Manager=4, Security=5, Admin=6
// ============================================================
export enum UserRole {
  Applicant = 0,
  Receptionist = 1,
  Doctor = 2,
  Examiner = 3,
  Manager = 4,
  Security = 5,
  Admin = 6
}

// Helper functions
export const isApplicantRole = (role: UserRole | number | string | undefined): boolean => {
  if (role === undefined) return false;
  if (typeof role === 'number') return role === UserRole.Applicant;
  if (role === 'Applicant') return true;
  const parsed = parseInt(role);
  return !isNaN(parsed) && parsed === UserRole.Applicant;
};

export const isEmployeeRole = (role: UserRole | number | string | undefined): boolean => {
  if (role === undefined) return false;
  if (typeof role === 'number') {
    return role >= 1 && role <= 6;
  }
  if (typeof role === 'string') {
    const parsed = parseInt(role);
    return !isNaN(parsed) && parsed >= 1 && parsed <= 6;
  }
  return ['Receptionist', 'Doctor', 'Examiner', 'Manager', 'Security', 'Admin'].includes(role);
};

export const isAdminRole = (role: UserRole | number | string | undefined): boolean => {
  if (role === undefined) return false;
  if (typeof role === 'number') return role === UserRole.Admin;
  if (role === 'Admin') return true;
  const parsed = parseInt(role);
  return !isNaN(parsed) && parsed === UserRole.Admin;
};

export const isManagerRole = (role: UserRole | number | string | undefined): boolean => {
  if (role === undefined) return false;
  if (typeof role === 'number') return role === UserRole.Manager;
  if (role === 'Manager') return true;
  const parsed = parseInt(role);
  return !isNaN(parsed) && parsed === UserRole.Manager;
};

export const getRoleLabel = (role: UserRole | number | string | undefined): string => {
  if (role === undefined) return 'غير معروف';
  
  let roleNum: number;
  if (typeof role === 'number') {
    roleNum = role;
  } else if (typeof role === 'string') {
    roleNum = parseInt(role);
    if (isNaN(roleNum)) {
      // Try string match
      switch (role) {
        case 'Applicant': return 'متقدم';
        case 'Receptionist': return 'موظف الاستقبال';
        case 'Doctor': return 'طبيب';
        case 'Examiner': return 'مفتش';
        case 'Manager': return 'مدير';
        case 'Admin': return 'مدير النظام';
        case 'Security': return 'أمن';
        default: return 'غير معروف';
      }
    }
  } else {
    return 'غير معروف';
  }

  switch (roleNum) {
    case UserRole.Applicant: return 'متقدم';
    case UserRole.Receptionist: return 'موظف الاستقبال';
    case UserRole.Doctor: return 'طبيب';
    case UserRole.Examiner: return 'مفتش';
    case UserRole.Manager: return 'مدير';
    case UserRole.Admin: return 'مدير النظام';
    case UserRole.Security: return 'أمن';
    default: return 'غير معروف';
  }
};

export const EMPLOYEE_ROLES = [
  UserRole.Receptionist,
  UserRole.Doctor,
  UserRole.Examiner,
  UserRole.Manager,
  UserRole.Security,
  UserRole.Admin
];

// ============================================================
// ApplicationStatus Enum - MUST match Backend exactly
// Backend: Draft=0, Submitted=1, DocumentReview=2, InReview=3, MedicalExam=4,
//          Training=5, TheoryTest=6, PracticalTest=7, Approved=8, Payment=9,
//          Issued=10, Active=11, Rejected=12, Cancelled=13, Expired=14
// ============================================================
export enum ApplicationStatus {
  Draft = 0,
  Submitted = 1,
  DocumentReview = 2,
  InReview = 3,
  MedicalExam = 4,
  Training = 5,
  TheoryTest = 6,
  PracticalTest = 7,
  Approved = 8,
  Payment = 9,
  Issued = 10,
  Active = 11,
  Rejected = 12,
  Cancelled = 13,
  Expired = 14
}

// ============================================================
// ServiceType Enum - MUST match Backend exactly
// Backend: NewLicense=0, Renewal=1, Replacement=2, CategoryUpgrade=3,
//          InternationalLicense=4, StatusChange=5, MedicalExtension=6, TemporaryLicense=7
// ============================================================
export enum ServiceType {
  NewLicense = 0,
  Renewal = 1,
  Replacement = 2,
  CategoryUpgrade = 3,
  InternationalLicense = 4,
  StatusChange = 5,
  MedicalExtension = 6,
  TemporaryLicense = 7
}

// ============================================================
// FeeType Enum - MUST match Backend exactly
// Backend: ApplicationFee=0, MedicalExamFee=1, TheoryTestFee=2, PracticalTestFee=3,
//          IssuanceFee=4, RetakeFee=5, RenewalFee=6, ReplacementFee=7, CategoryUpgrade=8
// ============================================================
export enum FeeType {
  ApplicationFee = 0,
  MedicalExamFee = 1,
  TheoryTestFee = 2,
  PracticalTestFee = 3,
  IssuanceFee = 4,
  RetakeFee = 5,
  RenewalFee = 6,
  ReplacementFee = 7,
  CategoryUpgrade = 8
}

// ============================================================
// PaymentStatus Enum - MUST match Backend exactly
// Backend: Pending=0, Paid=1, Failed=2, Refunded=3
// ============================================================
export enum PaymentStatus {
  Pending = 0,
  Paid = 1,
  Failed = 2,
  Refunded = 3
}

// ============================================================
// TestResult Enum - MUST match Backend exactly
// Backend: Pass=0, Fail=1, Absent=2
// ============================================================
export enum TestResult {
  Pass = 0,
  Fail = 1,
  Absent = 2
}

// ============================================================
// MedicalFitnessResult Enum - MUST match Backend exactly
// Backend: Fit=0, Unfit=1, ConditionallyFit=2
// ============================================================
export enum MedicalFitnessResult {
  Fit = 0,
  Unfit = 1,
  ConditionallyFit = 2
}

// ============================================================
// AppointmentType Enum - MUST match Backend exactly
// Backend: MedicalExam=0, TheoryTest=1, PracticalTest=2
// ============================================================
export enum AppointmentType {
  MedicalExam = 0,
  TheoryTest = 1,
  PracticalTest = 2
}

// ============================================================
// LicenseStatus Enum - MUST match Backend exactly
// Backend: Active=0, Expired=1, Suspended=2, Revoked=3, Replaced=4, Renewed=5, Superseded=6
// ============================================================
export enum LicenseStatus {
  Active = 0,
  Expired = 1,
  Suspended = 2,
  Revoked = 3,
  Replaced = 4,
  Renewed = 5,
  Superseded = 6
}

// ============================================================
// DocumentStatus Enum - MUST match Backend exactly
// Backend: Pending=0, Approved=1, Rejected=2
// ============================================================
export enum DocumentStatus {
  Pending = 0,
  Approved = 1,
  Rejected = 2
}

// ============================================================
// LicenseCategoryCode Enum - MUST match Backend exactly
// Backend: A=0, B=1, C=2, D=3, E=4, F=5
// ============================================================
export enum LicenseCategoryCode {
  A = 0,
  B = 1,
  C = 2,
  D = 3,
  E = 4,
  F = 5
}

// ============================================================
// AppointmentStatus Enum - MUST match Backend exactly
// Backend: Scheduled=0, Completed=1, Cancelled=2, NoShow=3
// ============================================================
export enum AppointmentStatus {
  Scheduled = 0,
  Completed = 1,
  Cancelled = 2,
  NoShow = 3
}

// ============================================================
// ApplicantType Enum - MUST match Backend exactly
// Backend: Private=0, Public=1, Motorcycle=2, Commercial=3
// ============================================================
export enum ApplicantType {
  Private = 0,
  Public = 1,
  Motorcycle = 2,
  Commercial = 3
}