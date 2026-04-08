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
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { AlertCircle, RefreshCw } from 'lucide-react';

export function Step2LicenseCategory() {
  const t = useTranslations('wizard');
  const { step2, step3, setStep2 } = useWizardStore();

  // Fetch license categories using React Query
  const { data: categoriesData, isLoading: categoriesLoading, error: categoriesError, refetch: refetchCategories } = useQuery<LicenseCategoryOption[]>({
    queryKey: ['license-categories'],
    queryFn: async () => {
      const response = await ApplicationService.getLicenseCategories();
      if (!response.success) {
        throw new Error(response.message);
      }
      return response.data || [];
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
  });

  // Build minAgeMap from license categories response
  const minAgeMap = useMemo((): Record<LicenseCategoryCode, number> => {
    const defaultMap: Record<LicenseCategoryCode, number> = {
      [LicenseCategoryCode.A]: 16,
      [LicenseCategoryCode.B]: 18,
      [LicenseCategoryCode.C]: 21,
      [LicenseCategoryCode.D]: 21,
      [LicenseCategoryCode.E]: 21,
      [LicenseCategoryCode.F]: 18,
    };

    if (!categoriesData?.length) {
      return defaultMap;
    }

    const map = { ...defaultMap };
    categoriesData.forEach((cat) => {
      if (cat.code in map) {
        map[cat.code as LicenseCategoryCode] = cat.minAge;
      }
    });

    return map;
  }, [categoriesData]);

  // Calculate applicant age using calculateAge from validations
  const applicantAge = useMemo(() => {
    if (!step3.dateOfBirth) return 0;
    return calculateAge(step3.dateOfBirth);
  }, [step3.dateOfBirth]);

  // Create schema with dob and minAgeMap
  const step2Schema = useMemo(
    () => createStep2Schema(step3.dateOfBirth, minAgeMap),
    [step3.dateOfBirth, minAgeMap]
  );

  const form = useForm<Step2FormValues>({
    resolver: zodResolver(step2Schema),
    defaultValues: {
      categoryCode: step2.categoryCode ?? undefined,
    },
    mode: 'onChange',
  });

  const { watch, setValue, formState: { errors }, trigger, setFocus } = form;

  // Register form on window for WizardNavButtons to access
  useEffect(() => {
    (window as any).__step2Form = { trigger, setFocus };
    return () => {
      delete (window as any).__step2Form;
    };
  }, [trigger, setFocus]);

  const selectedCategory = watch('categoryCode');

  // Compute disabledCategories set from minAgeMap + applicant age
  const disabledCategories = useMemo(() => {
    const disabled = new Set<LicenseCategoryCode>();
    if (applicantAge <= 0) return disabled;

    (Object.keys(minAgeMap) as LicenseCategoryCode[]).forEach((code) => {
      const minAge = minAgeMap[code];
      if (applicantAge < minAge) {
        disabled.add(code);
      }
    });

    return disabled;
  }, [minAgeMap, applicantAge]);

  // Calculate how many categories are disabled
  const disabledCategoriesCount = disabledCategories.size;

  // Show global info banner at top when any categories are disabled
  const showDisabledBanner = applicantAge > 0 && disabledCategoriesCount > 0;

  // Initialize from wizardStore.step2
  useEffect(() => {
    if (step2.categoryCode) {
      setValue('categoryCode', step2.categoryCode);
    }
  }, [step2.categoryCode, setValue]);

  // On unmount write to setStep2()
  useEffect(() => {
    return () => {
      const currentValues = form.getValues();
      if (currentValues.categoryCode) {
        setStep2({ categoryCode: currentValues.categoryCode });
      }
    };
  }, [form, setStep2]);

  // Fallback categories if API didn't return data
  const categories: LicenseCategoryOption[] = categoriesData?.length
    ? categoriesData
    : [
        { code: LicenseCategoryCode.A, nameAr: 'فئة أ', nameEn: 'Category A', descriptionAr: 'دراجات نارية', descriptionEn: 'Motorcycle', minAge: 16, icon: 'Bike', validityYears: 10 },
        { code: LicenseCategoryCode.B, nameAr: 'فئة ب', nameEn: 'Category B', descriptionAr: 'سيارة خاصة', descriptionEn: 'Private Car', minAge: 18, icon: 'Car', validityYears: 10 },
        { code: LicenseCategoryCode.C, nameAr: 'فئة ج', nameEn: 'Category C', descriptionAr: 'شاحنات ثقيلة', descriptionEn: 'Heavy Trucks', minAge: 21, icon: 'Truck', validityYears: 10 },
        { code: LicenseCategoryCode.D, nameAr: 'فئة د', nameEn: 'Category D', descriptionAr: 'حافلات', descriptionEn: 'Bus', minAge: 21, icon: 'Bus', validityYears: 10 },
        { code: LicenseCategoryCode.E, nameAr: 'فئة ه', nameEn: 'Category E', descriptionAr: 'مركبات ثقيلة', descriptionEn: 'Heavy Vehicles', minAge: 21, icon: 'Trailer', validityYears: 10 },
        { code: LicenseCategoryCode.F, nameAr: 'فئة و', nameEn: 'Category F', descriptionAr: 'آليات زراعية', descriptionEn: 'Agricultural Vehicles', minAge: 18, icon: 'Tractor', validityYears: 10 },
      ];

  if (categoriesLoading) {
    return (
      <div className="space-y-6">
        <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">
          {t('steps.category.title')}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="p-5 rounded-xl border-2 border-neutral-200 dark:border-neutral-700"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-neutral-200 dark:bg-neutral-700 animate-pulse" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-20 bg-neutral-200 dark:bg-neutral-700 rounded animate-pulse" />
                  <div className="h-3 w-full bg-neutral-200 dark:bg-neutral-700 rounded animate-pulse" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Error state with retry button
  if (categoriesError) {
    return (
      <div className="space-y-6">
        <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">
          {t('steps.category.title')}
        </h2>
        <div 
          role="alert"
          className="p-4 rounded-lg bg-status-error/10 border border-status-error/30 dark:bg-status-error/20"
        >
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-status-error flex-shrink-0 mt-0.5" />
            <div className="flex-1 space-y-2">
              <p className="text-sm text-status-error font-medium">
                {t('errors.loadFailed')}
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => refetchCategories()}
                className="mt-2"
              >
                <RefreshCw className="w-4 h-4 me-2" />
                {t('common.retry')}
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">
        {t('steps.category.title')}
      </h2>

      {showDisabledBanner && (
        <div className="p-3 rounded-lg bg-info/10 border border-info/30 text-info text-sm dark:bg-info/20 dark:border-info/40">
          {t('step2.disabledMessage', { count: disabledCategoriesCount })}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((cat) => {
          const isDisabled = disabledCategories.has(cat.code);

          return (
            <CategoryCard
              key={cat.code}
              code={cat.code}
              nameAr={cat.nameAr}
              nameEn={cat.nameEn}
              descriptionAr={cat.descriptionAr}
              descriptionEn={cat.descriptionEn}
              minAge={cat.minAge}
              iconName={cat.icon}
              selected={selectedCategory === cat.code}
              disabled={isDisabled}
              onClick={() => setValue('categoryCode', cat.code)}
            />
          );
        })}
      </div>

      {/* Age info footer */}
      {applicantAge > 0 && (
        <p className="text-sm text-neutral-500 dark:text-neutral-400 text-center">
          {t('step2.yourAge', { age: applicantAge })}
        </p>
      )}
    </div>
  );
}