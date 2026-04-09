'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import WizardStepIndicator from './WizardStepIndicator';
import { useWizardStore } from '@/stores/wizard-store';
import { useTranslations } from 'next-intl';

interface WizardLayoutProps {
  children: React.ReactNode;
}

export default function WizardLayout({ children }: WizardLayoutProps) {
  const currentStep = useWizardStore((state) => state.currentStep);

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Wizard Header & Indicator */}
        <div className="mb-12">
          <WizardStepIndicator />
        </div>

        {/* Wizard Content with Page Transitions */}
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          className="bg-white dark:bg-neutral-900 shadow-gov rounded-gov border border-neutral-200 dark:border-neutral-800 overflow-hidden"
        >
          <div className="p-6 sm:p-10">
            {children}
          </div>
        </motion.div>

        {/* Auto-save Status Bar (Floating) */}
        <div className="mt-8 text-center">
            <AutoSaveIndicator />
        </div>
      </div>
    </div>
  );
}

function AutoSaveIndicator() {
  const t = useTranslations('wizard.autoSave');
  const lastSavedAt = useWizardStore((state) => state.lastSavedAt);
  const consecutiveFailures = useWizardStore((state) => state.consecutiveSaveFailures);

  if (consecutiveFailures >= 3) {
    return (
      <span className="text-sm text-status-warning animate-pulse">
        {t('connectionIssues')}
      </span>
    );
  }

  if (!lastSavedAt) return null;

  return (
    <span className="text-sm text-neutral-400">
      {t('lastSaved')} {new Date(lastSavedAt).toLocaleTimeString()}
    </span>
  );
}
