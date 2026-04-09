// React Query hooks for Document Upload & Review

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  uploadDocument,
  listDocuments,
  getRequirements,
  reviewDocument,
  bulkApprove,
  deleteDocument
} from '@/services/document.service';
import { UploadDocumentRequest, DocumentReviewRequest } from '@/types/document.types';

// Query keys
export const documentKeys = {
  all: ['documents'] as const,
  lists: () => [...documentKeys.all, 'list'] as const,
  list: (applicationId: string) => [...documentKeys.lists(), { applicationId }] as const,
  requirements: (applicationId: string) => [...documentKeys.all, 'requirements', { applicationId }] as const,
};

/**
 * Hook to get all documents for an application
 */
export const useGetDocuments = (applicationId: string) => {
  return useQuery({
    queryKey: documentKeys.list(applicationId),
    queryFn: () => listDocuments(applicationId),
    enabled: !!applicationId,
  });
};

/**
 * Hook to get document requirements for an application
 */
export const useGetRequirements = (applicationId: string) => {
  return useQuery({
    queryKey: documentKeys.requirements(applicationId),
    queryFn: () => getRequirements(applicationId),
    enabled: !!applicationId,
  });
};

/**
 * Hook to upload a document
 */
export const useUploadDocument = (applicationId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: { data: UploadDocumentRequest; onProgress?: (progress: number) => void }) =>
      uploadDocument(applicationId, request.data, request.onProgress),
    onSuccess: () => {
      // Invalidate both documents and requirements queries
      queryClient.invalidateQueries({ queryKey: documentKeys.list(applicationId) });
      queryClient.invalidateQueries({ queryKey: documentKeys.requirements(applicationId) });
    },
  });
};

/**
 * Hook to review (approve/reject) a document
 */
export const useReviewDocument = (applicationId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: { documentId: string; data: DocumentReviewRequest }) =>
      reviewDocument(applicationId, request.documentId, request.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: documentKeys.list(applicationId) });
      queryClient.invalidateQueries({ queryKey: documentKeys.requirements(applicationId) });
    },
  });
};

/**
 * Hook to bulk approve all pending documents
 */
export const useBulkApprove = (applicationId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => bulkApprove(applicationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: documentKeys.list(applicationId) });
      queryClient.invalidateQueries({ queryKey: documentKeys.requirements(applicationId) });
    },
  });
};

/**
 * Hook to delete a document
 */
export const useDeleteDocument = (applicationId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (documentId: string) => deleteDocument(applicationId, documentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: documentKeys.list(applicationId) });
      queryClient.invalidateQueries({ queryKey: documentKeys.requirements(applicationId) });
    },
  });
};

export default {
  useGetDocuments,
  useGetRequirements,
  useUploadDocument,
  useReviewDocument,
  useBulkApprove,
  useDeleteDocument,
};