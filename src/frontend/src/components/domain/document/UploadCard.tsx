// Upload Card Component for Document Upload

'use client';

import { useState, useRef, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { Upload, FileText, Image as ImageIcon, X, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { DocumentDto, DocumentRequirementDto, DocumentStatus, DocumentType } from '@/types/document.types';
import { DocumentStatusBadge } from './DocumentStatusBadge';

interface UploadCardProps {
  requirement: DocumentRequirementDto;
  document?: DocumentDto;
  onUpload: (file: File) => void;
  onDelete?: () => void;
  isUploading?: boolean;
  uploadProgress?: number;
  error?: string;
}

export function UploadCard({
  requirement,
  document,
  onUpload,
  onDelete,
  isUploading = false,
  uploadProgress = 0,
  error,
}: UploadCardProps) {
  const t = useTranslations('document');
  const [isDragging, setIsDragging] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Get document type name
  const getDocumentTypeName = (type: DocumentType): string => {
    const key = DocumentType[type];
    return t(`types.${key}`) || key;
  };

  // Check if file is an image
  const isImage = (file: File): boolean => {
    return file.type.startsWith('image/');
  };

  // Handle file selection
  const handleFileSelect = useCallback(
    (file: File) => {
      // Validate file type
      const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
      if (!allowedTypes.includes(file.type)) {
        console.error('Invalid file type');
        return;
      }

      // Validate file size (5MB max)
      const maxSize = 5 * 1024 * 1024;
      if (file.size > maxSize) {
        console.error('File too large');
        return;
      }

      // Create preview for images
      if (isImage(file)) {
        const reader = new FileReader();
        reader.onload = (e) => setPreviewUrl(e.target?.result as string);
        reader.readAsDataURL(file);
      } else {
        setPreviewUrl(null);
      }

      onUpload(file);
    },
    [onUpload]
  );

  // Handle drag events
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);

      const files = e.dataTransfer.files;
      if (files.length > 0) {
        handleFileSelect(files[0]);
      }
    },
    [handleFileSelect]
  );

  // Handle click to browse
  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  // Get status from document or requirement
  const currentStatus = document?.status || requirement.status;
  const hasDocument = !!document || requirement.hasUpload;

  // Render file preview
  const renderPreview = () => {
    if (previewUrl) {
      return (
        <div className="relative w-full h-32 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800">
          <img
            src={previewUrl}
            alt={document?.originalFileName || requirement.documentTypeName}
            className="w-full h-full object-cover"
          />
          {isUploading && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <div className="text-white text-sm font-medium">{uploadProgress}%</div>
            </div>
          )}
        </div>
      );
    }

    if (document?.originalFileName) {
      // Show file type icon based on content type
      const isDocImage = document.contentType?.startsWith('image/');
      return (
        <div className="w-full h-32 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
          {isDocImage ? (
            <ImageIcon className="w-12 h-12 text-gray-400" />
          ) : (
            <FileText className="w-12 h-12 text-gray-400" />
          )}
        </div>
      );
    }

    return null;
  };

  // Render upload area
  const renderUploadArea = () => {
    if (isUploading) {
      return (
        <div className="space-y-2">
          <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-primary-500 transition-all duration-300"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
          <p className="text-sm text-center text-gray-500">{t('upload.uploading')}</p>
        </div>
      );
    }

    return (
      <div
        className={cn(
          'border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors',
          isDragging
            ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
            : 'border-gray-300 dark:border-gray-600 hover:border-primary-400 hover:bg-gray-50 dark:hover:bg-gray-800'
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
      >
        <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
        <p className="text-sm text-gray-500">{t('upload.dragDrop')}</p>
        <p className="text-xs text-gray-400 mt-1">{t('upload.maxSize', { size: 5 })}</p>
      </div>
    );
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-4 shadow-sm">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="font-semibold text-gray-900 dark:text-gray-100">
            {getDocumentTypeName(requirement.documentType)}
          </h3>
          {requirement.isConditional && requirement.conditionDescription && (
            <p className="text-xs text-amber-600 dark:text-amber-400 mt-1">
              {t('conditional.show', { condition: requirement.conditionDescription })}
            </p>
          )}
        </div>
        {currentStatus !== undefined && currentStatus !== null && (
          <DocumentStatusBadge status={currentStatus} />
        )}
      </div>

      {/* Preview or Upload Area */}
      {hasDocument ? (
        <div className="space-y-3">
          {renderPreview()}
          
          {/* File info */}
          {document && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400 truncate max-w-[150px]">
                {document.originalFileName}
              </span>
              <span className="text-gray-400 text-xs">
                {(document.fileSizeBytes / 1024).toFixed(1)} KB
              </span>
            </div>
          )}

          {/* Rejection reason */}
          {currentStatus === DocumentStatus.Rejected && document?.rejectionReason && (
            <div className="flex items-start gap-2 p-2 bg-red-50 dark:bg-red-900/20 rounded-lg">
              <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
              <p className="text-xs text-red-700 dark:text-red-300">{document.rejectionReason}</p>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-2">
            {currentStatus !== DocumentStatus.Approved && onDelete && (
              <button
                onClick={onDelete}
                className="flex items-center gap-1 px-3 py-1.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
              >
                <X className="w-4 h-4" />
                {t('upload.remove')}
              </button>
            )}
            {currentStatus === DocumentStatus.Rejected && (
              <button
                onClick={handleClick}
                className="flex items-center gap-1 px-3 py-1.5 text-sm text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg transition-colors"
              >
                <Upload className="w-4 h-4" />
                {t('upload.reupload')}
              </button>
            )}
          </div>
        </div>
      ) : (
        renderUploadArea()
      )}

      {/* Error message */}
      {error && (
        <p className="mt-2 text-sm text-red-600 dark:text-red-400">{error}</p>
      )}

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,.jpg,.jpeg,.png"
        onChange={handleInputChange}
        className="hidden"
        disabled={isUploading}
      />
    </div>
  );
}

export default UploadCard;