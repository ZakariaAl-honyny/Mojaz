// ============================================
// API Response Types - Single Source of Truth
// ============================================

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
  id: number;
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
  id: number;
  applicationNumber: string;
  applicantId: number;
  applicantFullName: string;
  nationalId: string;
  dateOfBirth: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  region: string;
  licenseCategoryId: number;
  categoryCode: string;
  categoryNameAr: string;
  categoryNameEn: string;
  applicantType: number;
  preferredCenter: string;
  testLanguage: number;
  specialNeeds?: string;
  status: number;
  currentStage: number;
  stageName: string;
  isEligible: boolean;
  rejectionReason?: string;
  createdAt: string;
  updatedAt: string;
}

// Document DTOs
export interface DocumentDto {
  id: number;
  applicationId: number;
  documentType: string;
  fileName: string;
  filePath: string;
  fileSize: number;
  mimeType: string;
  status: number;
  rejectionReason?: string;
  uploadedAt: string;
  reviewedAt?: string;
  reviewedBy?: number;
}

// Timeline DTOs
export interface TimelineEventDto {
  id: number;
  applicationId: number;
  stageNumber: number;
  stageName: string;
  status: number;
  remarks?: string;
  createdAt: string;
  completedAt?: string;
  completedBy?: number;
}

// Medical Exam DTOs
export interface MedicalExamDto {
  id: number;
  applicationId: number;
  doctorId: number;
  doctorName?: string;
  examinedAt: string;
  fitnessResult: number;
  bloodType?: string;
  notes?: string;
  reportReference?: string;
  validUntil?: string;
  updatedAt?: string;
  visionTestResult?: string;
  colorBlindTestResult?: string;
  bloodPressureNormal?: boolean;
}

// Theory Test DTOs
export interface TheoryTestDto {
  id: number;
  applicationId: number;
  examinerId?: number;
  examinerName?: string;
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  passingScore: number;
  status: number;
  language: string;
  attemptNumber: number;
  maxAttempts: number;
  testDate?: string;
  resultDate?: string;
}

// Practical Test DTOs
export interface PracticalTestDto {
  id: number;
  applicationId: number;
  examinerId?: number;
  examinerName?: string;
  vehicleType: string;
  score: number;
  passingScore: number;
  status: number;
  majorFaults: number;
  minorFaults: number;
  examinerNotes?: string;
  testDate?: string;
  resultDate?: string;
}

// Training Record DTOs
export interface TrainingRecordDto {
  id: number;
  applicationId: number;
  trainingCenterId: number;
  trainingCenterName: string;
  instructorId: number;
  instructorName: string;
  trainingType: number;
  startDate: string;
  endDate: string;
  hoursCompleted: number;
  hoursRequired: number;
  status: number;
  certificateUrl?: string;
}

// User DTOs (additional fields)
export interface UserDto {
  id: number;
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
  userName?: string;
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
  id: number;
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
  id: number;
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