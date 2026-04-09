'use client';

import { useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { MedicalResultForm } from '@/components/domain/medical/MedicalResultForm';
import { useGetMedicalResult } from '@/services/medical.service';
import { cn } from '@/lib/utils';

interface MedicalPageProps {
  params: {
    locale: string;
    id: string; // applicationId
  };
}

export default function MedicalPage({ params }: MedicalPageProps) {
  const { id: applicationId } = params;
  const t = useTranslations('medical');
  
  const { data: medicalResult, isLoading, isError } = useGetMedicalResult(applicationId);
  
  // Determine if we're in edit mode
  const isEditMode = !!medicalResult;
  
  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        <p className="mt-4 text-muted-foreground">{t('common.loading')}</p>
      </div>
    );
  }
  
  if (isError) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center">
        <h2 className="text-xl font-semibold text-destructive mb-4">{t('errors.title')}</h2>
        <p className="text-muted-foreground">{t('errors.fetchFailed')}</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <h1 className="text-2xl font-bold text-primary-600 dark:text-primary-400">
          {t('form.title')}
        </h1>
        {medicalResult && (
          <div className="text-sm text-muted-foreground">
            <span className="mr-2">{t('common.updatedAt')}:</span>
            <span className="font-medium">{new Date(medicalResult.updatedAt).toLocaleDateString()}</span>
          </div>
        )}
      </div>
      
      <MedicalResultForm 
        applicationId={applicationId}
        initialData={medicalResult ? {
          result: medicalResult.result,
          bloodType: medicalResult.bloodType,
          visionTestResult: medicalResult.visionTestResult,
          colorBlindTestResult: medicalResult.colorBlindTestResult,
          bloodPressureNormal: medicalResult.bloodPressureNormal,
          notes: medicalResult.notes
        } : undefined}
        onSuccess={() => {
          // Optionally refetch or show success message
          console.log('Medical result saved successfully');
        }}
      />
    </div>
  );
}