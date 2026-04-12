export type ApplicationStatus =
  | "Draft"
  | "Submitted"
  | "InReview"
  | "Paid"
  | "MedicalDone"
  | "TheoryDone"
  | "PracticalDone"
  | "Approved"
  | "Issued"
  | "Rejected"
  | "Cancelled";

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T | null;
  errors?: string[];
  statusCode: number;
}

export interface PaginatedResult<T> {
  items: T[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export interface LicenseCategory {
  id: string;
  code: string;
  nameAr: string;
  nameEn: string;
  description?: string;
  minimumAge: number;
  requiresTraining: boolean;
  isActive: boolean;
  validityYears: number;
}

// Application DTOs
export interface ApplicationDto {
  id: string;
  applicationNumber: string;
  applicantId: string;
  applicantFullName: string;
  nationalId: string;
  dateOfBirth: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  region: string;
  licenseCategoryId: string;
  categoryCode: string;
  categoryNameAr: string;
  categoryNameEn: string;
  applicantType: "New" | "Renewal" | "Replacement" | "Upgrade";
  preferredCenter: string;
  testLanguage: "Arabic" | "English";
  specialNeeds?: string;
  status: ApplicationStatus;
  currentStage: number;
  stageName: string;
  isEligible: boolean;
  rejectionReason?: string;
  createdAt: string;
  updatedAt: string;
}

// Document DTOs
export interface DocumentDto {
  id: string;
  applicationId: string;
  documentType: string;
  fileName: string;
  filePath: string;
  fileSize: number;
  mimeType: string;
  status: "Pending" | "Approved" | "Rejected";
  rejectionReason?: string;
  uploadedAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
}

// Timeline DTOs
export interface TimelineEventDto {
  id: string;
  applicationId: string;
  stageNumber: number;
  stageName: string;
  status: "Pending" | "InProgress" | "Completed" | "Skipped";
  remarks?: string;
  createdAt: string;
  completedAt?: string;
  completedBy?: string;
}

// Medical Exam DTOs
export interface MedicalExamDto {
  id: string;
  applicationId: string;
  examinerId: string;
  examinerName: string;
  visionStatus: "Pass" | "Fail";
  hearingStatus: "Pass" | "Fail";
  physicalStatus: "Pass" | "Fail";
  generalHealthStatus: "Pass" | "Fail";
  overallStatus: "Pass" | "Fail";
  physicianNotes?: string;
  examDate: string;
  expiryDate: string;
  isValid: boolean;
}

// Theory Test DTOs
export interface TheoryTestDto {
  id: string;
  applicationId: string;
  examinerId?: string;
  examinerName?: string;
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  passingScore: number;
  status: "Scheduled" | "InProgress" | "Passed" | "Failed" | "Absent";
  language: string;
  attemptNumber: number;
  maxAttempts: number;
  testDate?: string;
  resultDate?: string;
}

// Practical Test DTOs
export interface PracticalTestDto {
  id: string;
  applicationId: string;
  examinerId?: string;
  examinerName?: string;
  vehicleType: string;
  score: number;
  passingScore: number;
  status: "Scheduled" | "InProgress" | "Passed" | "Failed" | "Absent";
  majorFaults: number;
  minorFaults: number;
  examinerNotes?: string;
  testDate?: string;
  resultDate?: string;
}

// Training Record DTOs
export interface TrainingRecordDto {
  id: string;
  applicationId: string;
  trainingCenterId: string;
  trainingCenterName: string;
  instructorId: string;
  instructorName: string;
  trainingType: "Course" | "Session";
  startDate: string;
  endDate: string;
  hoursCompleted: number;
  hoursRequired: number;
  status: "InProgress" | "Completed" | "Cancelled";
  certificateUrl?: string;
}

// User DTOs (additional fields)
export interface UserDto {
  id: string;
  fullName: string;
  email?: string;
  phone?: string;
  nationalId?: string;
  role: number;
  roleName: string;
  isActive: boolean;
  preferredLanguage: string;
  createdAt: string;
  lastLoginAt?: string;
}

// Filter parameters
export interface QueryParams {
  page?: number;
  pageSize?: number;
  search?: string;
  sortBy?: string;
  sortDir?: "asc" | "desc";
  status?: string;
  from?: string;
  to?: string;
}

// Center DTOs
export interface CenterDto {
  id: string;
  name: string;
  nameAr: string;
  nameEn: string;
  address: string;
  city: string;
  region: string;
  phone: string;
  email?: string;
  workingHours: string;
  services: string[];
  isActive: boolean;
}

// Service DTOs
export interface ServiceDto {
  id: string;
  code: string;
  nameAr: string;
  nameEn: string;
  descriptionAr: string;
  descriptionEn: string;
  category: string;
  isActive: boolean;
  requiresAppointment: boolean;
  fees: number;
}

// Settings DTOs
export interface SystemSettingDto {
  key: string;
  value: string;
  description?: string;
  category: string;
  isSecret: boolean;
  updatedAt: string;
}