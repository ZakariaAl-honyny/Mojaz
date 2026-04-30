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

export const isReceptionistRole = (role: UserRole | number | string | undefined): boolean => {
  if (role === undefined) return false;
  if (typeof role === 'number') return role === UserRole.Receptionist;
  if (role === 'Receptionist') return true;
  const parsed = parseInt(role);
  return !isNaN(parsed) && parsed === UserRole.Receptionist;
};

export const isDoctorRole = (role: UserRole | number | string | undefined): boolean => {
  if (role === undefined) return false;
  if (typeof role === 'number') return role === UserRole.Doctor;
  if (role === 'Doctor') return true;
  const parsed = parseInt(role);
  return !isNaN(parsed) && parsed === UserRole.Doctor;
};

export const isExaminerRole = (role: UserRole | number | string | undefined): boolean => {
  if (role === undefined) return false;
  if (typeof role === 'number') return role === UserRole.Examiner;
  if (role === 'Examiner') return true;
  const parsed = parseInt(role);
  return !isNaN(parsed) && parsed === UserRole.Examiner;
};

export const isSecurityRole = (role: UserRole | number | string | undefined): boolean => {
  if (role === undefined) return false;
  if (typeof role === 'number') return role === UserRole.Security;
  if (role === 'Security') return true;
  const parsed = parseInt(role);
  return !isNaN(parsed) && parsed === UserRole.Security;
};

export const getRoleLabel = (role: UserRole | number | string | undefined | null): string => {
  if (role === undefined || role === null) return 'غير معروف';

  let roleIdentifier: string | number = role;

  // If it's a string, try to parse it or match it case-insensitively
  if (typeof role === 'string') {
    const parsed = parseInt(role);
    if (!isNaN(parsed)) {
      roleIdentifier = parsed;
    } else {
      // Case-insensitive match
      const normalized = role.toLowerCase();
      switch (normalized) {
        case 'applicant': return 'متقدم';
        case 'receptionist': return 'موظف الاستقبال';
        case 'doctor': return 'طبيب';
        case 'examiner': return 'مفتش';
        case 'manager': return 'مدير';
        case 'admin': return 'مدير النظام';
        case 'security': return 'أمن';
        default: return 'غير معروف';
      }
    }
  }

  // Handle numeric values (including 0 for Applicant)
  const roleNum = typeof roleIdentifier === 'number' ? roleIdentifier : -1;

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
//          InternationalLicense=4, StatusChange=5, MedicalExtension=6, TemporaryLicense=7, TestRetake=8
// ============================================================
export enum ServiceType {
  NewLicense = 0,
  Renewal = 1,
  Replacement = 2,
  CategoryUpgrade = 3,
  InternationalLicense = 4,
  StatusChange = 5,
  MedicalExtension = 6,
  TemporaryLicense = 7,
  TestRetake = 8
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

// ============================================================
// ReplacementReason Enum - Frontend only (for replacement service)
// Backend doesn't have this enum, it's mapped from request
// ============================================================
export enum ReplacementReason {
  Lost = 1,
  Damaged = 2,
  Stolen = 3
}

export enum Gender {
  NotSpecified = 0,
  Male = 1,
  Female = 2
}

// ============================================================
// ApplicationStages Enum - MUST match Backend ApplicationStages constants
// Backend: Stage01Creation, Stage02Documents, Stage03InitialPayment, 
//          Stage04MedicalExam, Stage05Training, Stage06TheoryTest,
//          Stage07PracticalTest, Stage08FinalApproval, 
//          Stage09IssuancePayment, Stage10Issuance
// ============================================================
export enum ApplicationStages {
  Stage01Creation = "01-Creation",
  Stage02Documents = "02-Documents",
  Stage03InitialPayment = "03-InitialPayment",
  Stage04MedicalExam = "04-MedicalExam",
  Stage05Training = "05-Training",
  Stage06TheoryTest = "06-TheoryTest",
  Stage07PracticalTest = "07-PracticalTest",
  Stage08FinalApproval = "08-FinalApproval",
  Stage09IssuancePayment = "09-IssuancePayment",
  Stage10Issuance = "10-Issuance"
}

// ============================================================
// BloodType Enum - MUST match Backend exactly
// Backend: APositive=0, ANegative=1, BPositive=2, BNegative=3, ABPositive=4, ABNegative=5, OPositive=6, ONegative=7
// ============================================================
export enum BloodType {
  APositive = 0,
  ANegative = 1,
  BPositive = 2,
  BNegative = 3,
  ABPositive = 4,
  ABNegative = 5,
  OPositive = 6,
  ONegative = 7
}