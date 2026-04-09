'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { useWizardStore } from '@/stores/wizard-store';

export default function WizardStepHeader() {
  const currentStep = useWizardStore((state) => state.currentStep);
  const t = useTranslations('wizard.steps');

  // Map step IDs to translation keys for titles and descriptions
  const stepKeys = {
    1: 'service',
    2: 'category',
    3: 'personal',
    4: 'details',
    5: 'review',
  };

  const key = stepKeys[currentStep as keyof typeof stepKeys];

  return (
    <div className="mb-8 border-b border-neutral-100 dark:border-neutral-800 pb-6">
      <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mb-2">
        {t(`${key}.title`)}
      </h2>
      <p className="text-neutral-500 dark:text-neutral-400">
        {t(`${key}.description`)}
      </p>
    </div>
  );
}
