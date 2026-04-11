// Document Service for Document Upload & Review Feature

import axios from '@/lib/api-client';
import {
  DocumentDto,
  DocumentRequirementDto,
  DocumentReviewRequest,
  BulkApproveResponse,
  ApiResponse,
  UploadDocumentRequest
} from '@/types/document.types';

// Base API URL for documents
const getBaseUrl = (applicationId: string) => `/api/v1/applications/${applicationId}/documents`;

/**
 * Upload a document for an application
 */
export const uploadDocument = async (
  applicationId: string,
  request: UploadDocumentRequest,
  onUploadProgress?: (progress: number) => void
): Promise<ApiResponse<DocumentDto>> => {
  const formData = new FormData();
  formData.append('documentType', request.documentType.toString());
  formData.append('file', request.file);

  const response = await axios.post<ApiResponse<DocumentDto>>(
    `${getBaseUrl(applicationId)}/upload`,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      onUploadProgress: (progressEvent) => {
        if (onUploadProgress && progressEvent.total) {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onUploadProgress(progress);
        }
      }
    }
  );

  return response.data;
};

/**
 * Get all documents for an application
 */
export const listDocuments = async (applicationId: string): Promise<ApiResponse<DocumentDto[]>> => {
  const response = await axios.get<ApiResponse<DocumentDto[]>>(getBaseUrl(applicationId));
  return response.data;
};

/**
 * Get document requirements for an application
 */
export const getRequirements = async (applicationId: string): Promise<ApiResponse<DocumentRequirementDto[]>> => {
  const response = await axios.get<ApiResponse<DocumentRequirementDto[]>>(
    `${getBaseUrl(applicationId)}/requirements`
  );
  return response.data;
};

/**
 * Review (approve/reject) a document
 */
export const reviewDocument = async (
  applicationId: string,
  documentId: string,
  request: DocumentReviewRequest
): Promise<ApiResponse<DocumentDto>> => {
  const response = await axios.patch<ApiResponse<DocumentDto>>(
    `${getBaseUrl(applicationId)}/${documentId}/review`,
    request
  );
  return response.data;
};

/**
 * Bulk approve all pending documents for an application
 */
export const bulkApprove = async (applicationId: string): Promise<ApiResponse<BulkApproveResponse>> => {
  const response = await axios.patch<ApiResponse<BulkApproveResponse>>(
    `${getBaseUrl(applicationId)}/bulk-approve`
  );
  return response.data;
};

/**
 * Delete a document (soft delete)
 */
export const deleteDocument = async (
  applicationId: string,
  documentId: string
): Promise<ApiResponse<boolean>> => {
  const response = await axios.delete<ApiResponse<boolean>>(
    `${getBaseUrl(applicationId)}/${documentId}`
  );
  return response.data;
};

/**
 * Get download URL for a document
 */
export const getDownloadUrl = (applicationId: string, documentId: string): string => {
  return `${getBaseUrl(applicationId)}/${documentId}/download`;
};

export default {
  uploadDocument,
  listDocuments,
  getRequirements,
  reviewDocument,
  bulkApprove,
  deleteDocument,
  getDownloadUrl
};