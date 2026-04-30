'use client';

import React from 'react';
import { useWizardStore } from '@/stores/wizard-store';
import { ShieldCheck } from 'lucide-react';

interface WizardStepHeaderProps {
  title?: string;
  subtitle?: string;
}

const stepContent: Record<number, { title: string; subtitle: string }> = {
  1: { title: 'اختيار نوع الخدمة', subtitle: 'حدد نوع الخدمة المرورية' },
  2: { title: 'تحديد فئة الرخصة', subtitle: 'اختر فئة الرخصة المطلوبة' },
  3: { title: 'البيانات الشخصية', subtitle: 'أدخل بيانات الهوية' },
  4: { title: 'تفضيلات الفحص', subtitle: 'حدد مركز الفحص' },
  5: { title: 'المراجعة والتقديم', subtitle: 'راجع البيانات قبل الإرسال' },
};

export default function WizardStepHeader({ title, subtitle }: WizardStepHeaderProps) {
  const currentStep = useWizardStore((state) => state.currentStep);
  const content = stepContent[currentStep] || { title: '', subtitle: '' };

  const displayTitle = title || content.title;
  const displaySubtitle = subtitle || content.subtitle;

  return (
    <div className="mb-3 pb-2 border-b border-neutral-100 font-arabic" dir="rtl">
      <div className="flex items-center gap-1.5 mb-1">
        <span className="text-[9px] font-bold text-[#1a3a8f]/50 uppercase tracking-wider">المعاملة</span>
        <ShieldCheck className="w-2.5 h-2.5 text-emerald-500" />
      </div>
      <h2 className="text-base font-bold text-neutral-800">
        {displayTitle}
      </h2>
      <p className="text-xs text-neutral-400 font-medium">
        {displaySubtitle}
      </p>
    </div>
  );
}