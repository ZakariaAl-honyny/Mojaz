// Document Review Panel Component for Employee

'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { FileText, Check, Clock, X, Eye, Trash2 } from 'lucide-react';
import { DocumentDto, DocumentStatus } from '@/types/document.types';
import { DocumentStatusBadge } from './DocumentStatusBadge';
import { DocumentLightbox } from './DocumentLightbox';
import { useReviewDocument, useBulkApprove } from '@/hooks/useDocuments';
import { Button } from '@/components/ui/button';
import { toast } from 'react-hot-toast';

interface DocumentReviewPanelProps {
  applicationId: string;
  documents: DocumentDto[];
  onRefresh?: () => void;
}

export function DocumentReviewPanel({
  applicationId,
  documents,
  onRefresh,
}: DocumentReviewPanelProps) {
  const t = useTranslations('document');
  const reviewMutation = useReviewDocument(applicationId);
  const bulkApproveMutation = useBulkApprove(applicationId);
  
  const [selectedDocument, setSelectedDocument] = useState<DocumentDto | null>(null);

  // Count documents by status
  const pendingDocs = documents.filter(d => d.status === DocumentStatus.Pending);
  const approvedDocs = documents.filter(d => d.status === DocumentStatus.Approved);
  const rejectedDocs = documents.filter(d => d.status === DocumentStatus.Rejected);

  // Handle individual approve
  const handleApprove = async (documentId: string) => {
    try {
      await reviewMutation.mutateAsync({
        documentId,
        data: { approved: true }
      });
      toast.success(t('review.approve'));
      onRefresh?.();
    } catch (error) {
      toast.error(t('errors.notFound'));
    }
  };

  // Handle individual reject
  const handleReject = async (documentId: string, reason: string) => {
    try {
      await reviewMutation.mutateAsync({
        documentId,
        data: { approved: false, rejectionReason: reason }
      });
      toast.success(t('review.reject'));
      onRefresh?.();
    } catch (error) {
      toast.error(t('errors.notFound'));
    }
  };

  // Handle bulk approve
  const handleBulkApprove = async () => {
    try {
      const result = await bulkApproveMutation.mutateAsync();
      toast.success(t('review.approvedCount', { count: result.data?.approvedCount || 0 }));
      onRefresh?.();
    } catch (error) {
      toast.error(t('errors.notFound'));
    }
  };

  // Get document type name
  const getDocumentTypeName = (doc: DocumentDto): string => {
    const typeKey = doc.documentTypeName;
    return t(`types.${typeKey}`) || typeKey;
  };

  // Format date
  const formatDate = (dateStr: string): string => {
    return new Date(dateStr).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Get status icon
  const getStatusIcon = (status: DocumentStatus) => {
    switch (status) {
      case DocumentStatus.Pending:
        return <Clock className="w-4 h-4 text-amber-500" />;
      case DocumentStatus.Approved:
        return <Check className="w-4 h-4 text-green-500" />;
      case DocumentStatus.Rejected:
        return <X className="w-4 h-4 text-red-500" />;
      default:
        return <FileText className="w-4 h-4 text-gray-400" />;
    }
  };

  // Render document row
  const renderDocumentRow = (doc: DocumentDto) => (
    <tr
      key={doc.id}
      className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors cursor-pointer"
      onClick={() => setSelectedDocument(doc)}
    >
      <td className="py-3 px-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800">
            <FileText className="w-5 h-5 text-gray-500" />
          </div>
          <div>
            <p className="font-medium text-gray-900 dark:text-gray-100">
              {getDocumentTypeName(doc)}
            </p>
            <p className="text-xs text-gray-500">
              {doc.originalFileName} • {(doc.fileSizeBytes / 1024).toFixed(1)} KB
            </p>
          </div>
        </div>
      </td>
      <td className="py-3 px-4">
        <div className="flex items-center gap-2">
          {getStatusIcon(doc.status)}
          <DocumentStatusBadge status={doc.status} />
        </div>
      </td>
      <td className="py-3 px-4 text-sm text-gray-500 dark:text-gray-400">
        {formatDate(doc.createdAt)}
      </td>
      <td className="py-3 px-4 text-sm text-gray-500 dark:text-gray-400">
        {doc.status === DocumentStatus.Pending ? (
          <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => handleApprove(doc.id)}
              disabled={reviewMutation.isPending}
              className="p-1.5 rounded-lg text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors"
              title={t('review.approve')}
            >
              <Check className="w-4 h-4" />
            </button>
            <button
              onClick={() => setSelectedDocument(doc)}
              className="p-1.5 rounded-lg text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
              title={t('review.reject')}
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <button
            className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            title={t('lightbox.download')}
          >
            <Eye className="w-4 h-4" />
          </button>
        )}
      </td>
    </tr>
  );

  return (
    <div className="space-y-4">
      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-amber-50 dark:bg-amber-900/20 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <Clock className="w-5 h-5 text-amber-600" />
            <div>
              <p className="text-2xl font-bold text-amber-700 dark:text-amber-400">
                {pendingDocs.length}
              </p>
              <p className="text-sm text-amber-600 dark:text-amber-500">
                {t('status.pending')}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <Check className="w-5 h-5 text-green-600" />
            <div>
              <p className="text-2xl font-bold text-green-700 dark:text-green-400">
                {approvedDocs.length}
              </p>
              <p className="text-sm text-green-600 dark:text-green-500">
                {t('status.approved')}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <X className="w-5 h-5 text-red-600" />
            <div>
              <p className="text-2xl font-bold text-red-700 dark:text-red-400">
                {rejectedDocs.length}
              </p>
              <p className="text-sm text-red-600 dark:text-red-500">
                {t('status.rejected')}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bulk Approve Button */}
      {pendingDocs.length > 0 && (
        <div className="flex justify-end">
          <Button
            onClick={handleBulkApprove}
            disabled={bulkApproveMutation.isPending}
            className="bg-green-600 hover:bg-green-700"
          >
            <Check className="w-4 h-4 me-2" />
            {bulkApproveMutation.isPending ? t('review.approve') + '...' : t('review.bulkApprove')}
          </Button>
        </div>
      )}

      {/* Documents Table */}
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        {documents.length > 0 ? (
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
              <tr>
                <th className="text-start py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">
                  {t('review.title')}
                </th>
                <th className="text-start py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">
                  {t('status.pending')}
                </th>
                <th className="text-start py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">
                  {t('review.title')}
                </th>
                <th className="text-start py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">
                  {t('review.title')}
                </th>
              </tr>
            </thead>
            <tbody>
              {documents.map(renderDocumentRow)}
            </tbody>
          </table>
        ) : (
          <div className="p-8 text-center text-gray-500">
            <FileText className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p>{t('review.noDocuments')}</p>
          </div>
        )}
      </div>

      {/* Lightbox Modal */}
      {selectedDocument && (
        <DocumentLightbox
          document={selectedDocument}
          onClose={() => setSelectedDocument(null)}
          onApprove={() => handleApprove(selectedDocument.id)}
          onReject={(reason) => handleReject(selectedDocument.id, reason)}
          isApproving={reviewMutation.isPending}
        />
      )}
    </div>
  );
}

export default DocumentReviewPanel;