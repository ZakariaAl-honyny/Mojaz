'use client';

import { useWizardStore } from '@/stores/wizard-store';
import { useTranslations } from 'next-intl';
import { CheckCircle2, Loader2, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

export function AutoSaveIndicator() {
  const t = useTranslations('wizard.autoSave');
  const { lastSavedAt, isSaving, consecutiveSaveFailures } = useWizardStore();

  const formatLastSaved = (date: Date | null) => {
    if (!date) return null;
    
    const now = new Date();
    const diff = now.getTime() - new Date(date).getTime();
    const minutes = Math.floor(diff / 60000);
    
    if (minutes < 1) return t('justNow');
    if (minutes === 1) return t('oneMinuteAgo');
    if (minutes < 60) return t('minutesAgo', { count: minutes });
    
    // For older saves, show the actual time
    return new Date(date).toLocaleTimeString();
  };

  const lastSaved = formatLastSaved(lastSavedAt);

  // Show error state after consecutive failures (yellow warning banner)
  if (consecutiveSaveFailures >= 3) {
    return (
      <div className="flex items-center gap-2 px-4 py-2 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
        <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400 flex-shrink-0" />
        <span className="text-sm text-amber-800 dark:text-amber-200">{t('saveFailed')}</span>
      </div>
    );
  }

  // Show saving state
  if (isSaving) {
    return (
      <div className="flex items-center gap-2 text-neutral-500 dark:text-neutral-400">
        <Loader2 className="w-4 h-4 animate-spin" />
        <span className="text-sm">{t('saving')}</span>
      </div>
    );
  }

  // Show saved state with timestamp
  if (lastSaved) {
    return (
      <div className="flex items-center gap-2 text-success dark:text-success">
        <CheckCircle2 className="w-4 h-4" />
        <span className="text-sm">{t('saved')} {lastSaved}</span>
      </div>
    );
  }

  // Initial state - not yet saved
  return (
    <div className="flex items-center gap-2 text-neutral-400 dark:text-neutral-500">
      <span className="text-sm">{t('notSaved')}</span>
    </div>
  );
}