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

/**
 * Get base URL for documents by application number
 * Uses the new by-number endpoints
 */
const getBaseUrl = (applicationNumber: string) => `/applications/by-number/${applicationNumber}/documents`;

/**
 * Upload a document for an application
 * Uses the upload-by-number endpoint
 */
export const uploadDocument = async (
  applicationNumber: string,
  request: UploadDocumentRequest,
  onUploadProgress?: (progress: number) => void
): Promise<ApiResponse<DocumentDto>> => {
  const formData = new FormData();
  formData.append('documentType', request.documentType.toString());
  formData.append('file', request.file);

  const response = await axios.post<ApiResponse<DocumentDto>>(
    `/applications/upload-by-number/${applicationNumber}/documents/upload`,
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
export const listDocuments = async (applicationNumber: string): Promise<ApiResponse<DocumentDto[]>> => {
  const response = await axios.get<ApiResponse<DocumentDto[]>>(getBaseUrl(applicationNumber));
  return response.data;
};

/**
 * Get document requirements for an application
 * Uses the requirements-by-number endpoint
 */
export const getRequirements = async (applicationNumber: string): Promise<ApiResponse<DocumentRequirementDto[]>> => {
  const response = await axios.get<ApiResponse<DocumentRequirementDto[]>>(
    `/applications/requirements-by-number/${applicationNumber}/documents/requirements`
  );
  return response.data;
};

/**
 * Review (approve/reject) a document
 */
export const reviewDocument = async (
  applicationNumber: string,
  documentId: string,
  request: DocumentReviewRequest
): Promise<ApiResponse<DocumentDto>> => {
  const response = await axios.patch<ApiResponse<DocumentDto>>(
    `${getBaseUrl(applicationNumber)}/${documentId}/review`,
    request
  );
  return response.data;
};

/**
 * Bulk approve all pending documents for an application
 */
export const bulkApprove = async (applicationNumber: string): Promise<ApiResponse<BulkApproveResponse>> => {
  const response = await axios.patch<ApiResponse<BulkApproveResponse>>(
    `${getBaseUrl(applicationNumber)}/bulk-approve`
  );
  return response.data;
};

/**
 * Delete a document (soft delete)
 */
export const deleteDocument = async (
  applicationNumber: string,
  documentId: string
): Promise<ApiResponse<boolean>> => {
  const response = await axios.delete<ApiResponse<boolean>>(
    `${getBaseUrl(applicationNumber)}/${documentId}`
  );
  return response.data;
};

/**
 * Get download URL for a document
 */
export const getDownloadUrl = (applicationNumber: string, documentId: string): string => {
  return `${getBaseUrl(applicationNumber)}/${documentId}/download`;
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