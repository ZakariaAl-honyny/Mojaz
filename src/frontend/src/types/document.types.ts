// Document Types for Document Upload & Review Feature

// Document Status enum
export enum DocumentStatus {
  Pending = 0,
  Approved = 1,
  Rejected = 2
}

// Document Type enum (matching backend)
export enum DocumentType {
  IdCopy = 1,
  PersonalPhoto = 2,
  MedicalReport = 3,
  TrainingCertificate = 4,
  AddressProof = 5,
  GuardianConsent = 6,
  PreviousLicense = 7,
  AccessibilityDocuments = 8
}

// Document DTO (response from API)
export interface DocumentDto {
  id: string;
  applicationId: string;
  documentType: DocumentType;
  documentTypeName: string;
  originalFileName: string;
  fileSizeBytes: number;
  contentType: string;
  status: DocumentStatus;
  rejectionReason?: string;
  reviewedBy?: string;
  reviewedAt?: string;
  createdAt: string;
  downloadUrl: string;
}

// Document Requirement DTO (for requirements endpoint)
export interface DocumentRequirementDto {
  documentType: DocumentType;
  documentTypeName: string;
  isRequired: boolean;
  isConditional: boolean;
  conditionDescription?: string;
  hasUpload: boolean;
  status?: DocumentStatus;
  documentId?: string;
}

// Upload document request
export interface UploadDocumentRequest {
  documentType: DocumentType;
  file: File;
}

// Document review request
export interface DocumentReviewRequest {
  approved: boolean;
  rejectionReason?: string;
}

// Bulk approve response
export interface BulkApproveResponse {
  approvedCount: number;
  approvedDocumentIds: string[];
}

// API Response wrappers
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  statusCode: number;
  data: T;
  errors?: string[];
}

export interface PagedResult<T> {
  items: T[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}