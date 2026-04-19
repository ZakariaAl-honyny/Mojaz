'use client';

import { useWizardStore } from '@/stores/wizard-store';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import WizardStepHeader from '../WizardStepHeader';
import { motion } from 'framer-motion';
import { Upload, FileText, X, CheckCircle2, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Step5DocumentUpload() {
  const t = useTranslations('wizard');
  const { step5, setStep5 } = useWizardStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="space-y-8">
      <WizardStepHeader />
      
      <div className="p-10 border-2 border-dashed border-neutral-200 dark:border-neutral-800 rounded-3xl bg-white/50 dark:bg-neutral-900/50 flex flex-col items-center justify-center text-center space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-primary-50 dark:bg-primary-900/20 flex items-center justify-center text-primary-500">
          <Upload className="w-8 h-8" />
        </div>
        <div>
          <h3 className="text-xl font-bold">{t('step5.uploadTitle') || 'Upload Documents'}</h3>
          <p className="text-neutral-500 max-w-sm mx-auto">{t('step5.uploadDesc') || 'Drag and drop your files here, or click to browse'}</p>
        </div>
        <button className="px-6 py-2 bg-primary-500 text-white rounded-xl font-bold hover:bg-primary-600 transition-colors">
          {t('common.browse') || 'Browse Files'}
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {/* Document list will go here */}
      </div>
    </div>
  );
}
