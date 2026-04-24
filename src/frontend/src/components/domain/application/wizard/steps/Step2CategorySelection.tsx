'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, AlertCircle } from 'lucide-react';
import { useWizardStore } from '@/stores/wizard-store';
import { createStep2Schema, Step2FormValues } from '@/lib/validations/wizard.schema';
import { useLicenseCategories } from '@/hooks/useLicenseCategories';
import CategoryCard from '../shared/CategoryCard';
import WizardNavigation from '../WizardNavigation';
import WizardStepHeader from '../WizardStepHeader';
import { LicenseCategoryCode } from '@/types/wizard.types';

export default function Step2CategorySelection() {
  const { step2, step3, setStep2, goTo, markCompleted } = useWizardStore();
  
  const { data: categories, isLoading, error } = useLicenseCategories();

  // Prepare minAgeMap for validation
  const minAgeMap = React.useMemo(() => {
    const map: Record<string, number> = {};
    categories?.forEach(cat => {
      map[cat.code] = cat.minAge;
    });
    return map;
  }, [categories]);

  const { 
    handleSubmit, 
    setValue, 
    watch,
    formState: { errors, isValid } 
  } = useForm<Step2FormValues>({
    resolver: zodResolver(createStep2Schema(step3.dateOfBirth, minAgeMap)),
    defaultValues: {
      categoryCode: step2.categoryCode as any,
    },
    mode: 'onChange' 
  });

  const selectedCategory = watch('categoryCode');

  const onNext = (data: Step2FormValues) => {
    setStep2({ categoryCode: data.categoryCode });
    markCompleted(2);
    goTo(3);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 space-y-6">
        <div className="relative">
           <Loader2 className="w-16 h-16 text-[#1a3a8f] animate-spin" />
           <div className="absolute inset-0 bg-[#1a3a8f]/10 rounded-full blur-xl animate-pulse" />
        </div>
        <p className="text-neutral-400 font-bold font-arabic">جاري تحميل فئات الرخص المتاحة...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-center px-4 space-y-6 font-arabic" dir="rtl">
        <div className="w-20 h-20 bg-red-50 rounded-3xl flex items-center justify-center text-red-500 shadow-xl shadow-red-500/10">
          <AlertCircle className="w-10 h-10" />
        </div>
        <div className="space-y-2">
           <h3 className="text-2xl font-black text-neutral-900">عذراً، فشل تحميل البيانات</h3>
           <p className="text-neutral-500 font-bold max-w-sm mx-auto">
             حدث خطأ غير متوقع أثناء محاولة استرداد فئات الرخص. يرجى التحقق من اتصالك بالإنترنت.
           </p>
        </div>
        <button 
          onClick={() => window.location.reload()}
          className="px-8 py-3 bg-[#1a3a8f] text-white rounded-xl font-black shadow-xl shadow-blue-900/20 hover:scale-105 active:scale-95 transition-all"
        >
          إعادة المحاولة
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onNext)} className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700 font-arabic" dir="rtl">
      <WizardStepHeader 
        title="فئة رخصة القيادة" 
        subtitle="اختر نوع المركبة التي ترغب في إصدار رخصة لها للمتابعة في الإجراءات القانونية."
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories?.map((cat) => (
          <CategoryCard
            key={cat.code}
            code={cat.code as any}
            nameAr={cat.nameAr}
            descriptionAr={cat.descriptionAr || ''}
            minAge={cat.minAge}
            selected={selectedCategory === cat.code}
            onClick={() => setValue('categoryCode', cat.code as any, { shouldValidate: true })}
          />
        ))}
      </div>

      {errors.categoryCode && (
        <div className="p-6 rounded-[2rem] bg-red-50 border border-red-100 flex items-center gap-4 animate-in shake duration-500">
           <AlertCircle className="w-6 h-6 text-red-500 shrink-0" />
           <p className="text-sm font-black text-red-700">
              {errors.categoryCode.message?.includes('Required') 
                ? 'يرجى اختيار فئة رخصة للمتابعة' 
                : errors.categoryCode.message?.includes(':')
                  ? `عذراً، يجب أن يكون عمرك ${errors.categoryCode.message.split(':')[1]} سنة على الأقل لهذه الفئة`
                  : errors.categoryCode.message}
           </p>
        </div>
      )}

      <WizardNavigation onNext={handleSubmit(onNext)} />
    </form>
  );
}
