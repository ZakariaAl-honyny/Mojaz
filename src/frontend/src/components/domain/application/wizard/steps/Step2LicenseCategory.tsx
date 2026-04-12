'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useMemo } from 'react';
import { useWizardStore } from '@/stores/wizard-store';
import { createStep2Schema, type Step2FormValues } from '@/lib/validations/step2Schema';
import { useQuery } from '@tanstack/react-query';
import ApplicationService from '@/services/application.service';
import { useTranslations } from 'next-intl';
import CategoryCard from '../shared/CategoryCard';
import { calculateAge } from '@/lib/utils';
import { LicenseCategoryCode, LicenseCategoryOption } from '@/types/wizard.types';
import WizardErrorDisplay from '../shared/WizardErrorDisplay';
import WizardStepHeader from '../WizardStepHeader';

export function Step2LicenseCategory() {
  const t = useTranslations('wizard');
  const { step1, step2, step3, setStep2 } = useWizardStore();

  const isExperienceCertificate = step1.serviceType === 'ExperienceCertificate';

  const { data: categoriesData, isLoading: categoriesLoading, error: categoriesError, refetch: refetchCategories } = useQuery<LicenseCategoryOption[]>({
    queryKey: ['license-categories'],
    queryFn: async () => {
      const response = await ApplicationService.getLicenseCategories();
      if (!response.success) {
        throw new Error(response.message);
      }
      
      let data = response.data || [];
      if (isExperienceCertificate) {
        data = data.filter(c => c.code === LicenseCategoryCode.B);
      }
      return data;
    },
    staleTime: 60 * 60 * 1000,
    retry: 2,
  });

  const minAgeMap = useMemo((): Record<LicenseCategoryCode, number> => {
    const defaultMap: Record<LicenseCategoryCode, number> = {
      [LicenseCategoryCode.A]: 16,
      [LicenseCategoryCode.B]: 18,
      [LicenseCategoryCode.C]: 21,
      [LicenseCategoryCode.D]: 21,
      [LicenseCategoryCode.E]: 21,
      [LicenseCategoryCode.F]: 18,
    };

    if (!categoriesData?.length) return defaultMap;

    const map = { ...defaultMap };
    categoriesData.forEach((cat) => {
      const code = cat.code as LicenseCategoryCode;
      if (code in map) map[code] = cat.minAge;
    });

    return map;
  }, [categoriesData]);

  const applicantAge = useMemo(() => {
    if (!step3.dateOfBirth) return 0;
    return calculateAge(step3.dateOfBirth);
  }, [step3.dateOfBirth]);

  const step2Schema = useMemo(
    () => createStep2Schema(step3.dateOfBirth, minAgeMap),
    [step3.dateOfBirth, minAgeMap]
  );

  const form = useForm<Step2FormValues>({
    resolver: zodResolver(step2Schema),
    defaultValues: {
      categoryCode: (step2.categoryCode as LicenseCategoryCode) || undefined,
    },
    mode: 'onChange',
  });

  const { watch, setValue, formState: { errors }, trigger, setFocus } = form;

  useEffect(() => {
    (window as any).__step2Form = { trigger, setFocus };
    return () => {
      delete (window as any).__step2Form;
    };
  }, [trigger, setFocus]);

  const selectedCategory = watch('categoryCode');

  // Sync with store
  useEffect(() => {
    if (selectedCategory) {
      setStep2({ categoryCode: selectedCategory });
    }
  }, [selectedCategory, setStep2]);

  const disabledCategories = useMemo(() => {
    const disabled = new Set<LicenseCategoryCode>();
    if (applicantAge <= 0) return disabled;

    (Object.keys(minAgeMap) as LicenseCategoryCode[]).forEach((code) => {
      if (applicantAge < minAgeMap[code]) disabled.add(code);
    });

    return disabled;
  }, [minAgeMap, applicantAge]);

  const disabledCategoriesCount = disabledCategories.size;
  const showDisabledBanner = applicantAge > 0 && disabledCategoriesCount > 0 && !isExperienceCertificate;

  if (categoriesLoading) {
    return (
      <div className="space-y-6 animate-in fade-in">
        <WizardStepHeader />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="p-5 rounded-gov border-2 border-neutral-100 dark:border-neutral-800 bg-white/50 dark:bg-neutral-900/50">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-neutral-100 dark:bg-neutral-800 animate-pulse" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-20 bg-neutral-100 dark:bg-neutral-800 rounded animate-pulse" />
                  <div className="h-3 w-full bg-neutral-100 dark:bg-neutral-800 rounded animate-pulse" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (categoriesError) {
    return (
      <div className="space-y-6 animate-in fade-in">
        <WizardStepHeader />
        <WizardErrorDisplay 
          error={categoriesError}
          onRetry={refetchCategories}
          errorMessage={t('errors.loadFailed')}
          retryLabel={t('common.retry')}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <WizardStepHeader />

      {showDisabledBanner && (
        <div role="status" className="p-3 rounded-gov bg-primary-50 border border-primary-100 text-primary-700 text-sm dark:bg-primary-900/10 dark:border-primary-900/30">
          {t('step2.disabledMessage', { count: disabledCategoriesCount })}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {(categoriesData || []).map((cat) => {
          const code = cat.code as LicenseCategoryCode;
          const isDisabled = disabledCategories.has(code);
          return (
            <CategoryCard
              key={cat.code}
              code={code}
              nameAr={cat.nameAr}
              nameEn={cat.nameEn}
              descriptionAr={cat.descriptionAr}
              descriptionEn={cat.descriptionEn}
              minAge={cat.minAge}
              iconName={cat.icon}
              selected={selectedCategory === code}
              disabled={isDisabled}
              onClick={() => setValue('categoryCode', code, { shouldValidate: true })}
            />
          );
        })}
      </div>

      {applicantAge > 0 && !isExperienceCertificate && (
        <p className="text-sm text-neutral-500 dark:text-neutral-400 text-center italic">
          {t('step2.yourAge', { age: applicantAge })}
        </p>
      )}

      {errors.categoryCode && (
        <p role="alert" className="text-sm text-status-error font-medium text-center animate-in fade-in slide-in-from-top-1">
          {errors.categoryCode.message}
        </p>
      )}
    </div>
  );
}