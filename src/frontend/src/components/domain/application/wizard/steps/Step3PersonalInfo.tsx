'use client';

import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations, useLocale } from 'next-intl';
import { useQuery } from '@tanstack/react-query';
import { useWizardStore } from '@/stores/wizard-store';
import { step3Schema, type Step3FormValues } from '@/lib/validations/step3Schema';
import ApplicationService from '@/services/application.service';
import { wizardQueryKeys } from '@/lib/constants';
import WizardStepHeader from '../WizardStepHeader';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { FormField, SelectField } from '../shared/FormField';
import WizardErrorDisplay from '../shared/WizardErrorDisplay';

interface LookupItem {
  code: string;
  nameAr: string;
  nameEn: string;
}

function FormSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="space-y-2">
            <div className="h-4 w-24 bg-neutral-100 dark:bg-neutral-800 rounded animate-pulse" />
            <div className="h-10 w-full bg-neutral-100 dark:bg-neutral-800 rounded animate-pulse" />
          </div>
        ))}
        <div className="md:col-span-2 space-y-2">
          <div className="h-4 w-16 bg-neutral-100 dark:bg-neutral-800 rounded animate-pulse" />
          <div className="h-10 w-full bg-neutral-100 dark:bg-neutral-800 rounded animate-pulse" />
        </div>
      </div>
    </div>
  );
}

export default function Step3PersonalInfo() {
  const locale = useLocale();
  const t = useTranslations('wizard');
  const tv = useTranslations('wizard.validation.step3');
  const { step3, setStep3 } = useWizardStore();

  const { data: nationalitiesData, isLoading: loadingNationalities, error: nationalitiesError, refetch: refetchNationalities } = useQuery({
    queryKey: wizardQueryKeys.nationalities,
    queryFn: async () => {
      const response = await ApplicationService.getNationalities();
      if (!response.success || !response.data) throw new Error('Failed to load nationalities');
      return response.data;
    },
    staleTime: 24 * 60 * 60 * 1000,
  });

  const { data: regionsData, isLoading: loadingRegions, error: regionsError, refetch: refetchRegions } = useQuery({
    queryKey: wizardQueryKeys.regions,
    queryFn: async () => {
      const response = await ApplicationService.getRegions();
      if (!response.success || !response.data) throw new Error('Failed to load regions');
      return response.data;
    },
    staleTime: 24 * 60 * 60 * 1000,
  });

  const isLoading = loadingNationalities || loadingRegions;

  const { register, watch, setValue, trigger, setFocus, formState: { errors } } = useForm<Step3FormValues>({
    resolver: zodResolver(step3Schema),
    defaultValues: {
      nationalId: step3.nationalId,
      dateOfBirth: step3.dateOfBirth,
      nationality: step3.nationality,
      gender: step3.gender,
      mobileNumber: step3.mobileNumber,
      email: step3.email || '',
      address: step3.address,
      city: step3.city,
      region: step3.region,
    },
    mode: 'onBlur',
  });

  useEffect(() => {
    (window as any).__step3Form = { trigger, setFocus };
    return () => {
      delete (window as any).__step3Form;
    };
  }, [trigger, setFocus]);

  const watchedValues = watch();

  useEffect(() => {
    setStep3({
      nationalId: watchedValues.nationalId || '',
      dateOfBirth: watchedValues.dateOfBirth || '',
      nationality: watchedValues.nationality || '',
      gender: watchedValues.gender || 'Male',
      mobileNumber: watchedValues.mobileNumber || '',
      email: watchedValues.email || '',
      address: watchedValues.address || '',
      city: watchedValues.city || '',
      region: watchedValues.region || '',
    });
  }, [watchedValues, setStep3]);

  if (isLoading) {
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

      <WizardErrorDisplay 
        error={nationalitiesError || regionsError}
        onRetry={() => {
          if (nationalitiesError) refetchNationalities();
          if (regionsError) refetchRegions();
        }}
        errorMessage={t('step3.errors.lookupFailed')}
        retryLabel={t('common.retry')}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
        <FormField label={t('step3.nationalId')} id="nationalId" error={errors.nationalId ? { message: tv(errors.nationalId.message as string) } : undefined} required>
          <Input placeholder={t('step3.nationalIdPlaceholder')} {...register('nationalId')} />
        </FormField>

        <FormField label={t('step3.dateOfBirth')} id="dateOfBirth" error={errors.dateOfBirth ? { message: tv(errors.dateOfBirth.message as string) } : undefined} required>
          <Input type="date" {...register('dateOfBirth')} />
        </FormField>

        <SelectField label={t('step3.nationality')} id="nationality" error={errors.nationality ? { message: tv(errors.nationality.message as string) } : undefined} {...register('nationality')}>
          <option value="">{t('common.select')}</option>
          {(nationalitiesData as LookupItem[])?.map(n => (
            <option key={n.code} value={n.code}>{locale === 'ar' ? n.nameAr : n.nameEn}</option>
          ))}
        </SelectField>

        <div className="space-y-2">
          <Label>{t('step3.gender')}</Label>
          <RadioGroup value={watchedValues.gender} onValueChange={v => setValue('gender', v as any)} className="flex gap-6 mt-2">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="Male" id="gender-male" />
              <Label htmlFor="gender-male" className="cursor-pointer font-normal">{t('step3.male')}</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="Female" id="gender-female" />
              <Label htmlFor="gender-female" className="cursor-pointer font-normal">{t('step3.female')}</Label>
            </div>
          </RadioGroup>
          {errors.gender && <p role="alert" className="text-xs text-status-error">{tv(errors.gender.message as string)}</p>}
        </div>

        <FormField label={t('step3.mobileNumber')} id="mobileNumber" error={errors.mobileNumber ? { message: tv(errors.mobileNumber.message as string) } : undefined} required>
          <Input placeholder={t('step3.mobileNumberPlaceholder')} dir="ltr" {...register('mobileNumber')} />
        </FormField>

        <FormField label={t('step3.email')} id="email" error={errors.email ? { message: tv(errors.email.message as string) } : undefined} required>
          <Input type="email" placeholder={t('step3.emailPlaceholder')} dir="ltr" {...register('email')} />
        </FormField>

        <SelectField label={t('step3.region')} id="region" error={errors.region ? { message: tv(errors.region.message as string) } : undefined} {...register('region')}>
          <option value="">{t('common.select')}</option>
          {(regionsData as LookupItem[])?.map(r => (
            <option key={r.code} value={r.code}>{locale === 'ar' ? r.nameAr : r.nameEn}</option>
          ))}
        </SelectField>

        <FormField label={t('step3.city')} id="city" error={errors.city ? { message: tv(errors.city.message as string) } : undefined} required>
          <Input {...register('city')} />
        </FormField>

        <FormField label={t('step3.address')} id="address" error={errors.address ? { message: tv(errors.address.message as string) } : undefined} className="md:col-span-2" required>
          <Input placeholder={t('step3.addressPlaceholder')} {...register('address')} />
        </FormField>
      </div>
    </div>
  );
}