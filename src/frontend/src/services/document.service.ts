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
 * Get base URL for documents using Smart ID (ID or Number)
 */
const getBaseUrl = (idOrNumber: string) => `documents/application/${idOrNumber}`;

/**
 * Upload a document for an application
 */
export const uploadDocument = async (
  idOrNumber: number,
  request: UploadDocumentRequest,
  onUploadProgress?: (progress: number) => void
): Promise<ApiResponse<DocumentDto>> => {
  const formData = new FormData();
  formData.append('documentType', request.documentType.toString());
  formData.append('file', request.file);

  const response = await axios.post<ApiResponse<DocumentDto>>(
    `${getBaseUrl(String(idOrNumber))}/upload`,
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
export const listDocuments = async (idOrNumber: string): Promise<ApiResponse<DocumentDto[]>> => {
  const response = await axios.get<ApiResponse<DocumentDto[]>>(getBaseUrl(idOrNumber));
  return response.data;
};

/**
 * Get document requirements for an application
 */
export const getRequirements = async (idOrNumber: string): Promise<ApiResponse<DocumentRequirementDto[]>> => {
  const response = await axios.get<ApiResponse<DocumentRequirementDto[]>>(
    `${getBaseUrl(idOrNumber)}/requirements`
  );
  return response.data;
};

/**
 * Review (approve/reject) a document
 */
export const reviewDocument = async (
  idOrNumber: string,
  documentId: string,
  request: DocumentReviewRequest
): Promise<ApiResponse<DocumentDto>> => {
  const response = await axios.patch<ApiResponse<DocumentDto>>(
    `${getBaseUrl(idOrNumber)}/review/${documentId}`,
    request
  );
  return response.data;
};

/**
 * Bulk approve all pending documents for an application
 */
export const bulkApprove = async (idOrNumber: string): Promise<ApiResponse<BulkApproveResponse>> => {
  const response = await axios.patch<ApiResponse<BulkApproveResponse>>(
    `${getBaseUrl(idOrNumber)}/bulk-approve`
  );
  return response.data;
};

/**
 * Delete a document (soft delete)
 */
export const deleteDocument = async (
  idOrNumber: string,
  documentId: string
): Promise<ApiResponse<boolean>> => {
  const response = await axios.delete<ApiResponse<boolean>>(
    `documents/${documentId}`
  );
  return response.data;
};

/**
 * Get download URL for a document
 */
export const getDownloadUrl = (idOrNumber: string, documentId: string): string => {
  return `documents/${documentId}/download`;
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