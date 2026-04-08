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
import WizardNavigation from '../WizardNavigation';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Loader2, AlertCircle, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LookupItem {
  code: string;
  nameAr: string;
  nameEn: string;
}

function SelectField({
  label,
  id,
  error,
  children,
  className
}: {
  label: string;
  id: string;
  error?: { message?: string };
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("space-y-2", className)}>
      <Label htmlFor={id}>{label}</Label>
      <select
        id={id}
        className={cn(
          "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background",
          "file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground",
          "placeholder:text-muted-foreground",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          "disabled:cursor-not-allowed disabled:opacity-50",
          "md:text-sm",
          error ? "border-status-error focus-visible:ring-status-error" : "border-neutral-200 dark:border-neutral-700"
        )}
      >
        {children}
      </select>
      {error?.message && (
        <p className="text-xs text-status-error">{error.message}</p>
      )}
    </div>
  );
}

function FormSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="space-y-2">
            <div className="h-4 w-24 bg-neutral-200 dark:bg-neutral-700 rounded animate-pulse" />
            <div className="h-10 w-full bg-neutral-200 dark:bg-neutral-700 rounded animate-pulse" />
          </div>
        ))}
        <div className="md:col-span-2 space-y-2">
          <div className="h-4 w-16 bg-neutral-200 dark:bg-neutral-700 rounded animate-pulse" />
          <div className="h-10 w-full bg-neutral-200 dark:bg-neutral-700 rounded animate-pulse" />
        </div>
      </div>
    </div>
  );
}

function ErrorDisplay({ 
  error, 
  onRetry,
  errorMessage,
  retryLabel
}: { 
  error: Error | null; 
  onRetry: () => void;
  errorMessage: string;
  retryLabel: string;
}) {
  if (!error) return null;
  
  return (
    <div 
      role="alert"
      className="p-4 rounded-lg bg-status-error/10 border border-status-error/30 dark:bg-status-error/20"
    >
      <div className="flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-status-error flex-shrink-0 mt-0.5" />
        <div className="flex-1 space-y-2">
          <p className="text-sm text-status-error font-medium">
            {errorMessage}
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={onRetry}
          >
            <RefreshCw className="w-4 h-4 me-2" />
            {retryLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function Step3PersonalInfo() {
  const locale = useLocale();
  const t = useTranslations('wizard');
  const tv = useTranslations('wizard.validation.step3');
  const { step3, setStep3, goTo, markCompleted } = useWizardStore();

  // Fetch nationalities using React Query directly
  const { data: nationalitiesData, isLoading: loadingNationalities, error: nationalitiesError, refetch: refetchNationalities } = useQuery({
    queryKey: wizardQueryKeys.nationalities,
    queryFn: async () => {
      const response = await ApplicationService.getNationalities();
      if (!response.success || !response.data) {
        throw new Error('Failed to load nationalities');
      }
      return response.data;
    },
    staleTime: 24 * 60 * 60 * 1000,
    retry: 2,
  });

  // Fetch regions using React Query directly
  const { data: regionsData, isLoading: loadingRegions, error: regionsError, refetch: refetchRegions } = useQuery({
    queryKey: wizardQueryKeys.regions,
    queryFn: async () => {
      const response = await ApplicationService.getRegions();
      if (!response.success || !response.data) {
        throw new Error('Failed to load regions');
      }
      return response.data;
    },
    staleTime: 24 * 60 * 60 * 1000,
    retry: 2,
  });

  const nationalities = nationalitiesData as LookupItem[] | undefined;
  const regions = regionsData as LookupItem[] | undefined;
  const isLoading = loadingNationalities || loadingRegions;

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<Step3FormValues>({
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

  const selectedGender = watch('gender');

  // Save to store on unmount (when user navigates away)
  useEffect(() => {
    const subscription = watch((formData) => {
      const data = formData as Partial<Step3FormValues>;
      const formValues = {
        nationalId: data.nationalId || '',
        dateOfBirth: data.dateOfBirth || '',
        nationality: data.nationality || '',
        gender: data.gender || 'Male',
        mobileNumber: data.mobileNumber || '',
        email: (data.email || '').toString(),
        address: data.address || '',
        city: data.city || '',
        region: data.region || '',
      };
      setStep3(formValues);
    });
    return () => {
      subscription.unsubscribe();
    };
  }, [watch, setStep3]);

  const onNext = (data: Step3FormValues) => {
    // Ensure all required fields have string values (not undefined)
    const formData = {
      nationalId: data.nationalId || '',
      dateOfBirth: data.dateOfBirth || '',
      nationality: data.nationality || '',
      gender: data.gender || 'Male',
      mobileNumber: data.mobileNumber || '',
      email: (data.email || '').toString(),
      address: data.address || '',
      city: data.city || '',
      region: data.region || '',
    };
    setStep3(formData);
    markCompleted(3);
    goTo(4);
  };

  if (isLoading) {
    return (
      <div className="space-y-8">
        <WizardStepHeader />
        <FormSkeleton />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onNext)} className="space-y-8">
      <WizardStepHeader />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
        {/* National ID */}
        <div className="space-y-2">
          <Label htmlFor="nationalId">{t('step3.nationalId')}</Label>
          <Input
            id="nationalId"
            {...register('nationalId')}
            placeholder={t('step3.nationalIdPlaceholder')}
            className={cn(
              errors.nationalId && "border-status-error focus-visible:ring-status-error"
            )}
          />
          {errors.nationalId && (
            <p className="text-xs text-status-error">{tv(errors.nationalId.message as string)}</p>
          )}
        </div>

        {/* Date of Birth */}
        <div className="space-y-2">
          <Label htmlFor="dateOfBirth">{t('step3.dateOfBirth')}</Label>
          <Input
            id="dateOfBirth"
            type="date"
            {...register('dateOfBirth')}
            className={cn(
              errors.dateOfBirth && "border-status-error focus-visible:ring-status-error"
            )}
          />
          {errors.dateOfBirth && (
            <p className="text-xs text-status-error">{tv(errors.dateOfBirth.message as string)}</p>
          )}
        </div>

        {/* Nationality */}
        <SelectField
          label={t('step3.nationality')}
          id="nationality"
          error={errors.nationality}
        >
          <option value="">{t('common.select')}</option>
          {nationalities?.map((n) => (
            <option key={n.code} value={n.code}>
              {locale === 'ar' ? n.nameAr : n.nameEn}
            </option>
          ))}
        </SelectField>

        {/* Gender */}
        <div className="space-y-2">
          <Label>{t('step3.gender')}</Label>
          <RadioGroup
            value={selectedGender}
            onValueChange={(value) => setValue('gender', value as 'Male' | 'Female')}
            className="flex gap-6 mt-2"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="Male" id="gender-male" />
              <Label htmlFor="gender-male" className="cursor-pointer font-normal">
                {t('step3.male')}
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="Female" id="gender-female" />
              <Label htmlFor="gender-female" className="cursor-pointer font-normal">
                {t('step3.female')}
              </Label>
            </div>
          </RadioGroup>
          {errors.gender && (
            <p className="text-xs text-status-error">{tv(errors.gender.message as string)}</p>
          )}
        </div>

        {/* Mobile Number */}
        <div className="space-y-2">
          <Label htmlFor="mobileNumber">{t('step3.mobileNumber')}</Label>
          <Input
            id="mobileNumber"
            {...register('mobileNumber')}
            placeholder={t('step3.mobileNumberPlaceholder')}
            dir="ltr"
            className={cn(
              errors.mobileNumber && "border-status-error focus-visible:ring-status-error"
            )}
          />
          {errors.mobileNumber && (
            <p className="text-xs text-status-error">{tv(errors.mobileNumber.message as string)}</p>
          )}
        </div>

        {/* Email */}
        <div className="space-y-2">
          <Label htmlFor="email">{t('step3.email')}</Label>
          <Input
            id="email"
            type="email"
            {...register('email')}
            placeholder={t('step3.emailPlaceholder')}
            dir="ltr"
            className={cn(
              errors.email && "border-status-error focus-visible:ring-status-error"
            )}
          />
          {errors.email && (
            <p className="text-xs text-status-error">{tv(errors.email.message as string)}</p>
          )}
        </div>

        {/* Region */}
        <div className="space-y-2">
          <Label htmlFor="region">{t('step3.region')}</Label>
          <select
            id="region"
            {...register('region')}
            className={cn(
              "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background",
              "file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground",
              "placeholder:text-muted-foreground",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
              "disabled:cursor-not-allowed disabled:opacity-50",
              "md:text-sm",
              errors.region ? "border-status-error focus-visible:ring-status-error" : "border-neutral-200 dark:border-neutral-700"
            )}
          >
            <option value="">{t('common.select')}</option>
            {regions?.map((r) => (
              <option key={r.code} value={r.code}>
                {locale === 'ar' ? r.nameAr : r.nameEn}
              </option>
            ))}
          </select>
          {errors.region && (
            <p className="text-xs text-status-error">{tv(errors.region.message as string)}</p>
          )}
        </div>

        {/* City */}
        <div className="space-y-2">
          <Label htmlFor="city">{t('step3.city')}</Label>
          <Input
            id="city"
            {...register('city')}
            className={cn(
              errors.city && "border-status-error focus-visible:ring-status-error"
            )}
          />
          {errors.city && (
            <p className="text-xs text-status-error">{tv(errors.city.message as string)}</p>
          )}
        </div>

        {/* Address */}
        <div className="md:col-span-2 space-y-2">
          <Label htmlFor="address">{t('step3.address')}</Label>
          <Input
            id="address"
            {...register('address')}
            placeholder={t('step3.addressPlaceholder')}
            className={cn(
              errors.address && "border-status-error focus-visible:ring-status-error"
            )}
          />
          {errors.address && (
            <p className="text-xs text-status-error">{tv(errors.address.message as string)}</p>
          )}
        </div>
      </div>

      <WizardNavigation onNext={handleSubmit(onNext)} />
    </form>
  );
}