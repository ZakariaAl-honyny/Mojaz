'use client';

import React from 'react';
import RenewalWizard from '@/components/domain/license/RenewalWizard';

export default function RenewalPage() {
  return (
    <div className="min-h-screen bg-neutral-50 p-4 md:p-8">
      <RenewalWizard />
    </div>
  );
}