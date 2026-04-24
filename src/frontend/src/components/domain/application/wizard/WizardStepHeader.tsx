'use client';

import React from 'react';
import { useWizardStore } from '@/stores/wizard-store';
import { ShieldCheck } from 'lucide-react';

interface WizardStepHeaderProps {
  title?: string;
  subtitle?: string;
}

const stepContent: Record<number, { title: string; subtitle: string }> = {
  1: { 
    title: 'اختيار نوع المسار المروري', 
    subtitle: 'حدد نوع المعاملة السيادية التي ترغب في البدء بها عبر المنصة الموحدة.' 
  },
  2: { 
    title: 'تحديد فئة المركبة المعتمدة', 
    subtitle: 'اختر تصنيف الرخصة المطلوبة وفقاً للائحة المرور الوطنية المعمول بها.' 
  },
  3: { 
    title: 'سجل البيانات الشخصية', 
    subtitle: 'يرجى تقديم بيانات الهوية الرسمية بدقة لضمان مطابقتها للسجلات المركزية.' 
  },
  4: { 
    title: 'تفضيلات الفحص والمركز', 
    subtitle: 'حدد مركز الفحص المفضل وتوقيت الاختبارات النظرية والعملية.' 
  },
  5: { 
    title: 'التدقيق النهائي والإقرار', 
    subtitle: 'راجع كافة البيانات المدخلة قبل المصادقة الرقمية والإرسال للمراجعة.' 
  },
};

export default function WizardStepHeader({ title, subtitle }: WizardStepHeaderProps) {
  const currentStep = useWizardStore((state) => state.currentStep);
  const content = stepContent[currentStep] || { title: '', subtitle: '' };

  const displayTitle = title || content.title;
  const displaySubtitle = subtitle || content.subtitle;

  return (
    <div className="mb-14 pb-12 border-b border-neutral-50 relative font-arabic" dir="rtl">
      {/* Decorative Track Indicator */}
      <div className="absolute -bottom-px right-0 w-48 h-1 bg-gradient-to-l from-[#1a3a8f] to-transparent rounded-full" />
      
      <div className="flex flex-col gap-6">
         <div className="flex items-center gap-5">
            <div className="flex-shrink-0 w-3 h-12 bg-gradient-to-b from-[#1a3a8f] to-[#1a3a8f]/40 rounded-full shadow-lg shadow-blue-900/10" />
            <div className="space-y-1">
                <div className="flex items-center gap-3">
                    <span className="text-[10px] font-black text-[#1a3a8f]/40 uppercase tracking-[0.4em]">المعاملة الرقمية</span>
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                </div>
                <h2 className="text-4xl font-black text-neutral-900 tracking-tight leading-none">
                  {displayTitle}
                </h2>
            </div>
         </div>
         
         <p className="text-neutral-400 font-bold text-xl leading-relaxed max-w-3xl pr-8">
           {displaySubtitle}
         </p>
      </div>
    </div>
  );
}
