// Document Upload Grid Component

'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { UploadCard } from './UploadCard';
import { useUploadDocument } from '@/hooks/useDocuments';
import { DocumentRequirementDto, DocumentDto, UploadDocumentRequest } from '@/types/document.types';
import toast from 'react-hot-toast';

interface DocumentUploadGridProps {
  applicationId: string;
  requirements: DocumentRequirementDto[];
  documents: DocumentDto[];
}

export function DocumentUploadGrid({
  applicationId,
  requirements,
  documents,
}: DocumentUploadGridProps) {
  const t = useTranslations('document');
  const uploadMutation = useUploadDocument(applicationId);

  // Track upload progress per document type
  const [uploadProgress, setUploadProgress] = useState<Record<number, number>>({});
  const [uploadingTypes, setUploadingTypes] = useState<Set<number>>(new Set());

  // Get document for a specific type
  const getDocumentForType = (documentType: number): DocumentDto | undefined => {
    return documents.find((doc) => doc.documentType === documentType);
  };

  // Handle upload
  const handleUpload = async (documentType: number, file: File) => {
    setUploadingTypes((prev) => new Set(prev).add(documentType));
    setUploadProgress((prev) => ({ ...prev, [documentType]: 0 }));

    try {
      const request: UploadDocumentRequest = {
        documentType,
        file,
      };

      await uploadMutation.mutateAsync({
        data: request,
        onProgress: (progress) => {
          setUploadProgress((prev) => ({ ...prev, [documentType]: progress }));
        },
      });

      toast.success(t('upload.success'));
    } catch (error: any) {
      console.error('Upload failed:', error);
      toast.error(error?.response?.data?.message || t('upload.error'));
    } finally {
      setUploadingTypes((prev) => {
        const newSet = new Set(prev);
        newSet.delete(documentType);
        return newSet;
      });
      setUploadProgress((prev) => {
        const newProgress = { ...prev };
        delete newProgress[documentType];
        return newProgress;
      });
    }
  };

  // Handle delete
  const handleDelete = async (documentId: string) => {
    try {
      // Note: We need delete mutation - using mutation directly for now
      const { useDeleteDocument } = await import('@/hooks/useDocuments');
      const deleteMutation = useDeleteDocument(applicationId);
      await deleteMutation.mutateAsync(documentId);
      toast.success(t('upload.remove'));
    } catch (error) {
      console.error('Delete failed:', error);
      toast.error(t('errors.notFound'));
    }
  };

  // Filter requirements to show mandatory first, then conditional
  const sortedRequirements = [...requirements].sort((a, b) => {
    if (a.isRequired && !b.isRequired) return -1;
    if (!a.isRequired && b.isRequired) return 1;
    return 0;
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
      {sortedRequirements.map((requirement) => {
        const document = getDocumentForType(requirement.documentType);
        const isUploading = uploadingTypes.has(requirement.documentType);
        const progress = uploadProgress[requirement.documentType] || 0;

        return (
          <UploadCard
            key={requirement.documentType}
            requirement={requirement}
            document={document}
            onUpload={(file) => handleUpload(requirement.documentType, file)}
            onDelete={document ? () => handleDelete(document.id) : undefined}
            isUploading={isUploading}
            uploadProgress={progress}
          />
        );
      })}
    </div>
  );
}

export default DocumentUploadGrid;