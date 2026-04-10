'use client';

import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations, useLocale } from 'next-intl';
import { useQuery } from '@tanstack/react-query';
import { useWizardStore } from '@/stores/wizard-store';
import { step4Schema, type Step4FormValues } from '@/lib/validations/step4Schema';
import ApplicationService from '@/services/application.service';
import { wizardQueryKeys } from '@/lib/constants';
import WizardStepHeader from '../WizardStepHeader';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from '@/components/ui/switch';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { cn } from '@/lib/utils';
import { FormField, SelectField } from '../shared/FormField';
import WizardErrorDisplay from '../shared/WizardErrorDisplay';

function FormSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="space-y-2">
            <div className="h-4 w-24 bg-neutral-100 dark:bg-neutral-800 rounded animate-pulse" />
            <div className="h-10 w-full bg-neutral-100 dark:bg-neutral-800 rounded animate-pulse" />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Step4ApplicationDetails() {
  const locale = useLocale();
  const t = useTranslations('wizard');
  const tv = useTranslations('wizard.validation.step4');
  const { step4, setStep4 } = useWizardStore();

  const { data: centersData, isLoading: loadingCenters, error: centersError, refetch: refetchCenters } = useQuery({
    queryKey: wizardQueryKeys.examCenters,
    queryFn: async () => {
      const response = await ApplicationService.getExamCenters();
      if (!response.success || !response.data) throw new Error('Failed to load exam centers');
      return (response.data || []).filter(center => center.isActive);
    },
    staleTime: 24 * 60 * 60 * 1000,
  });

  const { register, setValue, watch, trigger, setFocus, formState: { errors } } = useForm<Step4FormValues>({
    resolver: zodResolver(step4Schema),
    defaultValues: {
      applicantType: step4.applicantType,
      preferredCenterId: step4.preferredCenterId,
      testLanguage: step4.testLanguage,
      appointmentPreference: step4.appointmentPreference,
      specialNeedsDeclaration: step4.specialNeedsDeclaration,
      specialNeedsNote: step4.specialNeedsNote || '',
    },
    mode: 'onBlur',
  });

  useEffect(() => {
    (window as any).__step4Form = { trigger, setFocus };
    return () => {
      delete (window as any).__step4Form;
    };
  }, [trigger, setFocus]);

  const watchedValues = watch();

  useEffect(() => {
    setStep4({
      applicantType: watchedValues.applicantType || 'Citizen',
      preferredCenterId: watchedValues.preferredCenterId || '',
      testLanguage: watchedValues.testLanguage || 'ar',
      appointmentPreference: watchedValues.appointmentPreference || 'Morning',
      specialNeedsDeclaration: watchedValues.specialNeedsDeclaration || false,
      specialNeedsNote: watchedValues.specialNeedsNote || '',
    });
  }, [watchedValues, setStep4]);

  if (loadingCenters) {
    return (
      <div className="space-y-8 animate-in fade-in">
        <WizardStepHeader />
        <FormSkeleton />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <WizardStepHeader />

      <WizardErrorDisplay error={centersError} onRetry={refetchCenters} errorMessage={t('step4.errors.centersFailed')} retryLabel={t('common.retry')} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
        <div className="space-y-2">
          <Label>{t('step4.applicantType')}</Label>
          <RadioGroup value={watchedValues.applicantType} onValueChange={v => setValue('applicantType', v as any)} className="flex gap-4 mt-2">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="Citizen" id="type-citizen" />
              <Label htmlFor="type-citizen" className="cursor-pointer font-normal">{t('step4.citizen')}</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="Resident" id="type-resident" />
              <Label htmlFor="type-resident" className="cursor-pointer font-normal">{t('step4.resident')}</Label>
            </div>
          </RadioGroup>
          {errors.applicantType && <p role="alert" className="text-xs text-status-error">{tv(errors.applicantType.message as string)}</p>}
        </div>

        <SelectField label={t('step4.preferredCenter')} id="preferredCenterId" error={errors.preferredCenterId ? { message: tv(errors.preferredCenterId.message as string) } : undefined} required {...register('preferredCenterId')}>
          <option value="">{t('common.select')}</option>
          {centersData?.map(c => (
            <option key={c.id} value={c.id}>{locale === 'ar' ? c.nameAr : c.nameEn} - {c.city}</option>
          ))}
        </SelectField>

        <div className="space-y-2">
          <Label>{t('step4.testLanguage')}</Label>
          <div className="flex items-center gap-3 mt-2">
            <span className={cn("text-sm", watchedValues.testLanguage === 'ar' ? "font-medium text-primary-600" : "text-neutral-500")}>{t('step4.arabic')}</span>
            <Switch checked={watchedValues.testLanguage === 'en'} onCheckedChange={c => setValue('testLanguage', c ? 'en' : 'ar')} />
            <span className={cn("text-sm", watchedValues.testLanguage === 'en' ? "font-medium text-primary-600" : "text-neutral-500")}>{t('step4.english')}</span>
          </div>
        </div>

        <div className="space-y-2">
          <Label>{t('step4.appointmentPreference')}</Label>
          <RadioGroup value={watchedValues.appointmentPreference} onValueChange={v => setValue('appointmentPreference', v as any)} className="flex flex-wrap gap-3 mt-2">
            {['Morning', 'Afternoon', 'Evening', 'NoPreference'].map(p => (
              <div key={p} className="flex items-center space-x-2">
                <RadioGroupItem value={p} id={`pref-${p.toLowerCase()}`} />
                <Label htmlFor={`pref-${p.toLowerCase()}`} className="cursor-pointer font-normal text-sm">{t(`step4.${p.toLowerCase()}`)}</Label>
              </div>
            ))}
          </RadioGroup>
          {errors.appointmentPreference && <p role="alert" className="text-xs text-status-error">{tv(errors.appointmentPreference.message as string)}</p>}
        </div>

        <div className="md:col-span-2 space-y-4 pt-4 border-t border-neutral-100 dark:border-neutral-800">
          <div className="flex items-start space-x-3">
            <Checkbox id="specialNeedsDeclaration" checked={watchedValues.specialNeedsDeclaration} onCheckedChange={c => setValue('specialNeedsDeclaration', c === true)} />
            <div className="grid gap-1.5 leading-none">
              <Label htmlFor="specialNeedsDeclaration" className="text-sm font-medium leading-none cursor-pointer">{t('step4.specialNeedsDeclaration')}</Label>
              <p className="text-xs text-neutral-500">{t('step4.specialNeedsInfo')}</p>
            </div>
          </div>

          {watchedValues.specialNeedsDeclaration && (
            <FormField label={t('step4.specialNeedsNote')} id="specialNeedsNote" error={errors.specialNeedsNote ? { message: tv(errors.specialNeedsNote.message as string) } : undefined} className="ms-7" required>
              <textarea placeholder={t('step4.specialNeedsNotePlaceholder')} rows={3} className="flex min-h-[80px] w-full rounded-md border border-neutral-200 dark:border-neutral-700 bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500" {...register('specialNeedsNote')} />
            </FormField>
          )}
        </div>
      </div>
    </div>
  );
}