// Document Lightbox Component for Employee Review

'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { X, Check, FileText, Image as ImageIcon, ChevronLeft, ChevronRight, Download, AlertCircle } from 'lucide-react';
import { DocumentDto, DocumentStatus } from '@/types/document.types';
import { DocumentStatusBadge } from './DocumentStatusBadge';
import { Button } from '@/components/ui/button';

interface DocumentLightboxProps {
  document: DocumentDto;
  onClose: () => void;
  onApprove: () => void;
  onReject: (reason: string) => void;
  isApproving?: boolean;
  isRejecting?: boolean;
}

export function DocumentLightbox({
  document,
  onClose,
  onApprove,
  onReject,
  isApproving = false,
  isRejecting = false,
}: DocumentLightboxProps) {
  const t = useTranslations('document');
  const [showRejectForm, setShowRejectForm] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');

  // Check if document is an image
  const isImage = document.contentType?.startsWith('image/');
  const isPdf = document.contentType === 'application/pdf';

  // Handle approve
  const handleApprove = () => {
    onApprove();
    onClose();
  };

  // Handle reject
  const handleReject = () => {
    if (!rejectionReason.trim()) return;
    onReject(rejectionReason);
    onClose();
  };

  // Can approve/reject only if pending
  const canReview = document.status === DocumentStatus.Pending;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-gray-900 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <h3 className="font-semibold text-gray-900 dark:text-gray-100">
              {document.documentTypeName}
            </h3>
            <DocumentStatusBadge status={document.status} />
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content - Document Viewer */}
        <div className="p-4 bg-gray-50 dark:bg-gray-800 flex items-center justify-center min-h-[400px]">
          {isImage ? (
            <img
              src={`/api/v1/applications/${document.applicationId}/documents/${document.id}/download`}
              alt={document.originalFileName}
              className="max-w-full max-h-[50vh] object-contain rounded-lg"
            />
          ) : isPdf ? (
            <div className="text-center">
              <FileText className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                {document.originalFileName}
              </p>
              <a
                href={`/api/v1/applications/${document.applicationId}/documents/${document.id}/download`}
                target="_blank"
                className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700"
              >
                <Download className="w-4 h-4" />
                {t('lightbox.download')}
              </a>
            </div>
          ) : (
            <div className="text-center">
              <FileText className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <p className="text-gray-600 dark:text-gray-400">
                {document.originalFileName}
              </p>
            </div>
          )}
        </div>

        {/* Document Info */}
        <div className="px-4 py-3 bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
          <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-400">
            <span>{document.originalFileName}</span>
            <span>•</span>
            <span>{(document.fileSizeBytes / 1024).toFixed(1)} KB</span>
            {document.rejectionReason && (
              <>
                <span>•</span>
                <span className="text-red-600 dark:text-red-400">
                  {t('review.rejectionReason')}: {document.rejectionReason}
                </span>
              </>
            )}
          </div>
        </div>

        {/* Actions */}
        {canReview ? (
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            {!showRejectForm ? (
              <div className="flex gap-3 justify-end">
                <Button
                  variant="outline"
                  onClick={() => setShowRejectForm(true)}
                  className="border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300"
                >
                  {t('review.reject')}
                </Button>
                <Button
                  onClick={handleApprove}
                  disabled={isApproving}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <Check className="w-4 h-4 me-2" />
                  {isApproving ? t('review.approve') + '...' : t('review.approve')}
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {t('review.rejectionReason')}
                  </label>
                  <textarea
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    placeholder={t('review.rejectionPlaceholder')}
                    className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    rows={3}
                  />
                </div>
                <div className="flex gap-3 justify-end">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowRejectForm(false);
                      setRejectionReason('');
                    }}
                    disabled={isRejecting}
                  >
                    {t('common.cancel') || 'Cancel'}
                  </Button>
                  <Button
                    onClick={handleReject}
                    disabled={!rejectionReason.trim() || isRejecting}
                    className="bg-red-600 hover:bg-red-700 disabled:opacity-50"
                  >
                    {isRejecting ? t('review.confirmReject') + '...' : t('review.confirmReject')}
                  </Button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="p-4 border-t border-gray-200 dark:border-gray-700 text-center text-gray-500">
            {document.status === DocumentStatus.Approved
              ? t('status.approved')
              : document.status === DocumentStatus.Rejected
              ? t('status.rejected')
              : ''}
          </div>
        )}
      </div>
    </div>
  );
}

export default DocumentLightbox;