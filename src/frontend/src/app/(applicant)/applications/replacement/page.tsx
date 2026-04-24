'use client';

import React from 'react';
import ReplacementWizard from '@/components/domain/application/ReplacementWizard';

export default function ReplacementPage() {
  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="w-full max-w-4xl mx-auto p-4 md:p-6">
        <ReplacementWizard />
      </div>
    </div>
  );
}
