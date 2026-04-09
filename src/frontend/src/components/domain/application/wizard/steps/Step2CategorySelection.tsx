'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
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
  const t = useTranslations('wizard');
  const tv = useTranslations('wizard.validation.step2');
  
  const { data: categories, isLoading, error } = useLicenseCategories();

  // Prepare minAgeMap for validation
  const minAgeMap = React.useMemo(() => {
    const map: Record<LicenseCategoryCode, number> = {} as any;
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
    mode: 'onChange' // Validate immediately on selection
  });

  const selectedCategory = watch('categoryCode');

  const onNext = (data: Step2FormValues) => {
    setStep2(data);
    markCompleted(2);
    goTo(3);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Loader2 className="w-10 h-10 text-primary-600 animate-spin mb-4" />
        <p className="text-neutral-500">{t('loading')}</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center px-4">
        <AlertCircle className="w-12 h-12 text-status-error mb-4" />
        <h3 className="text-lg font-bold text-neutral-900 mb-2">{t('step2.errorLoading')}</h3>
        <p className="text-neutral-500 mb-6 max-w-sm">
          {t('step2.errorLoadingMessage')}
        </p>
        <button 
          onClick={() => window.location.reload()}
          className="text-primary-600 font-bold hover:underline"
        >
          {t('step2.retry')}
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onNext)}>
      <WizardStepHeader />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories?.map((cat) => (
          <CategoryCard
            key={cat.code}
            code={cat.code as any}
            nameAr={cat.nameAr}
            nameEn={cat.nameEn}
            descriptionAr={cat.descriptionAr || ''}
            descriptionEn={cat.descriptionEn || ''}
            minAge={cat.minAge}
            selected={selectedCategory === cat.code}
            onClick={() => setValue('categoryCode', cat.code as any, { shouldValidate: true })}
          />
        ))}
      </div>

      {errors.categoryCode && (
        <div className="mt-6 p-4 bg-status-error/10 border border-status-error/20 rounded-lg flex items-center gap-3 text-status-error">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <p className="text-sm font-medium">
             {/* If the error message contains a colon, it's a parameterized key like ageError:18 */}
             {errors.categoryCode.message?.includes(':') 
               ? tv('ageError', { age: errors.categoryCode.message.split(':')[1] })
               : errors.categoryCode.message}
          </p>
        </div>
      )}

      <WizardNavigation onNext={handleSubmit(onNext)} />
    </form>
  );
}
