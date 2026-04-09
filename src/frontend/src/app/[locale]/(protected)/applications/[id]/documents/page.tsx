// Applicant Documents Page

'use client';

import { use } from 'react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { FileText, ArrowRight, ChevronLeft, Upload } from 'lucide-react';
import { DocumentUploadGrid } from '@/components/domain/document/DocumentUploadGrid';
import { useGetDocuments, useGetRequirements } from '@/hooks/useDocuments';
import { DocumentType, DocumentStatus } from '@/types/document.types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'react-hot-toast';

// Hardcoded requirements for MVP (fallback if endpoint not implemented)
const MANDATORY_REQUIREMENTS = [
  { documentType: DocumentType.IdCopy, documentTypeName: 'IdCopy', isRequired: true, isConditional: false, hasUpload: false },
  { documentType: DocumentType.PersonalPhoto, documentTypeName: 'PersonalPhoto', isRequired: true, isConditional: false, hasUpload: false },
  { documentType: DocumentType.MedicalReport, documentTypeName: 'MedicalReport', isRequired: true, isConditional: false, hasUpload: false },
  { documentType: DocumentType.TrainingCertificate, documentTypeName: 'TrainingCertificate', isRequired: true, isConditional: false, hasUpload: false },
];

interface DocumentsPageProps {
  params: Promise<{ locale: string; id: string }>;
}

export default function DocumentsPage({ params }: DocumentsPageProps) {
  const { locale, id: applicationId } = use(params);
  const t = useTranslations('document');

  // Fetch requirements and documents
  const { data: requirementsData, isLoading: requirementsLoading, error: requirementsError } = useGetRequirements(applicationId);
  const { data: documentsData, isLoading: documentsLoading, error: documentsError } = useGetDocuments(applicationId);

  // Use API data or fallback to hardcoded requirements
  const requirements = requirementsData?.data || MANDATORY_REQUIREMENTS;
  const documents = documentsData?.data || [];

  const isLoading = requirementsLoading || documentsLoading;
  const hasError = requirementsError || documentsError;

  if (isLoading) {
    return (
      <div className="max-w-5xl mx-auto py-8 px-4 space-y-6">
        <div className="space-y-2">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-96" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="p-4">
              <Skeleton className="h-6 w-32 mb-4" />
              <Skeleton className="h-24 w-full" />
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (hasError) {
    // Show fallback UI on error (for MVP)
    toast.error(t('errors.notFound'));
  }

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 space-y-6">
      {/* Page Header */}
      <div className="flex items-center gap-4">
        <Link
          href={`/${locale}/applications/${applicationId}`}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {t('upload.title')}
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            {t('requirements.title')}
          </p>
        </div>
      </div>

      {/* Requirements Summary Card */}
      <Card className="border-gray-200 dark:border-gray-700">
        <CardHeader className="pb-3 border-b border-gray-100 dark:border-gray-800">
          <CardTitle className="text-lg flex items-center gap-2">
            <Upload className="w-5 h-5 text-primary-500" />
            {t('requirements.title')}
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-amber-500"></span>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {t('requirements.mandatory')}: {requirements.filter((r) => r.isRequired).length}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-gray-400"></span>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {t('requirements.optional')}: {requirements.filter((r) => !r.isRequired).length}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-green-500"></span>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {t('requirements.uploaded')}: {documents.length}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Document Upload Grid */}
      <DocumentUploadGrid
        applicationId={applicationId}
        requirements={requirements}
        documents={documents}
      />

      {/* Help Text */}
      <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
        <h3 className="font-medium text-blue-900 dark:text-blue-300 mb-2">
          {t('upload.selectFile')}
        </h3>
        <ul className="text-sm text-blue-700 dark:text-blue-400 space-y-1">
          <li>• {t('upload.maxSize', { size: 5 })}</li>
          <li>• {t('upload.invalidType')}</li>
        </ul>
      </div>
    </div>
  );
}