'use client';

import { useParams } from 'next/navigation';
import { WizardShell } from '@/components/domain/application/wizard/WizardShell';

export default function NewApplicationPage() {
  return (
    <div className="min-h-screen bg-neutral-50 font-arabic" dir="rtl">
      <div className="w-full max-w-2xl mx-auto py-2 px-2 sm:px-3">
        <WizardShell />
      </div>
    </div>
  );
}