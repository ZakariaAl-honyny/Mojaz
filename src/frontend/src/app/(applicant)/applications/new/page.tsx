'use client';

import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import ApplicationService from "@/services/application.service";
import { WizardShell } from '@/components/domain/application/wizard/WizardShell';
import { ExistingApplicationBanner } from '@/components/domain/application/wizard/shared/ExistingApplicationBanner';
import { Loader2 } from 'lucide-react';


export default function NewApplicationPage() {
  const params = useParams();

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
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center font-arabic" dir="rtl">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-[#1a3a8f] mx-auto mb-4" />
          <p className="text-neutral-500 italic">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  // If there's an existing active application, show banner
  if (existingApp) {
    return (
      <div className="min-h-screen bg-neutral-50 font-arabic" dir="rtl">
        <div className="w-full max-w-4xl mx-auto p-4 md:p-6">
          <ExistingApplicationBanner
            applicationNumber={existingApp.applicationNumber}
            status={existingApp.status}
          />
        </div>
      </div>
    );
  }

  // Otherwise, show the wizard
  return (
    <div className="min-h-screen bg-neutral-50 font-arabic" dir="rtl">
      <div className="w-full max-w-4xl mx-auto p-4 md:p-6">
        <WizardShell />
      </div>
    </div>
  );
}