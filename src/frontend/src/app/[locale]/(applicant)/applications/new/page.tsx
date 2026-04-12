'use client';

import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import ApplicationService from "@/services/application.service";
import { useTranslations } from 'next-intl';
import { WizardShell } from '@/components/domain/application/wizard/WizardShell';
import { ExistingApplicationBanner } from '@/components/domain/application/wizard/shared/ExistingApplicationBanner';
import { Loader2 } from 'lucide-react';

export default function NewApplicationPage() {
  const t = useTranslations('wizard');
  const params = useParams();
  const locale = params.locale as string;

  // Query for existing active application (non-draft)
  const { data: existingApp, isLoading } = useQuery({
    queryKey: ['existing-application'],
    queryFn: async () => {
      const response = await ApplicationService.getDrafts(); // Using getDrafts to check for active apps
      if (!response.success || !response.data || !response.data.items || response.data.items.length === 0) {
        return null;
      }
      // Check if any item is not draft (i.e., active application)
      const activeApp = response.data.items.find((item: any) => item.status !== 'Draft');
      return activeApp || null;
    },
    retry: false,
  });

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary-500 mx-auto mb-4" />
          <p className="text-neutral-500">{t('loading')}</p>
        </div>
      </div>
    );
  }

  // If there's an existing active application, show banner
  if (existingApp) {
    return (
      <div className="min-h-screen bg-neutral-50 p-4 md:p-8">
        <ExistingApplicationBanner
          applicationNumber={existingApp.applicationNumber}
          status={existingApp.status}
        />
      </div>
    );
  }

  // Otherwise, show the wizard
  return (
    <div className="min-h-screen bg-neutral-50 p-4 md:p-8">
      <WizardShell />
    </div>
  );
}