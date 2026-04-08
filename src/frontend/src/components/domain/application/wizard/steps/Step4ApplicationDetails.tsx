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
import WizardNavigation from '../WizardNavigation';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from '@/components/ui/switch';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

// ExamCenter type is imported from '@/types/wizard.types'

function FormSkeleton() {
  const t = useTranslations('wizard');
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="space-y-2">
            <div className="h-4 w-24 bg-neutral-200 dark:bg-neutral-700 rounded animate-pulse" />
            <div className="h-10 w-full bg-neutral-200 dark:bg-neutral-700 rounded animate-pulse" />
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
  const { step4, setStep4, goTo, markCompleted } = useWizardStore();

  // Fetch exam centers using React Query
  const { data: centersData, isLoading: loadingCenters } = useQuery({
    queryKey: wizardQueryKeys.examCenters,
    queryFn: async () => {
      const response = await ApplicationService.getExamCenters();
      if (!response.success || !response.data) {
        throw new Error('Failed to load exam centers');
      }
      // Filter only active centers
      return (response.data || []).filter(center => center.isActive);
    },
    staleTime: 24 * 60 * 60 * 1000,
  });

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<Step4FormValues>({
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

  const specialNeeds = watch('specialNeedsDeclaration');
  const selectedLanguage = watch('testLanguage');
  const selectedApplicantType = watch('applicantType');
  const selectedPreference = watch('appointmentPreference');

  // Save to store on unmount (when user navigates away)
  useEffect(() => {
    const subscription = watch((formData) => {
      const data = formData as Partial<Step4FormValues>;
      const formValues = {
        applicantType: data.applicantType || 'Citizen',
        preferredCenterId: data.preferredCenterId || '',
        testLanguage: data.testLanguage || 'ar',
        appointmentPreference: data.appointmentPreference || 'Morning',
        specialNeedsDeclaration: data.specialNeedsDeclaration || false,
        specialNeedsNote: data.specialNeedsNote || '',
      };
      setStep4(formValues);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [watch, setStep4]);

  const onNext = (data: Step4FormValues) => {
    const formData = {
      applicantType: data.applicantType,
      preferredCenterId: data.preferredCenterId || '',
      testLanguage: data.testLanguage,
      appointmentPreference: data.appointmentPreference,
      specialNeedsDeclaration: data.specialNeedsDeclaration,
      specialNeedsNote: data.specialNeedsNote || '',
    };
    setStep4(formData);
    markCompleted(4);
    goTo(5);
  };

  if (loadingCenters) {
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
        {/* Applicant Type - Radio Group */}
        <div className="space-y-2">
          <Label>{t('step4.applicantType')}</Label>
          <RadioGroup
            value={selectedApplicantType}
            onValueChange={(value) => setValue('applicantType', value as 'Citizen' | 'Resident')}
            className="flex gap-4 mt-2"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="Citizen" id="applicant-type-citizen" />
              <Label htmlFor="applicant-type-citizen" className="cursor-pointer font-normal">
                {t('step4.citizen')}
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="Resident" id="applicant-type-resident" />
              <Label htmlFor="applicant-type-resident" className="cursor-pointer font-normal">
                {t('step4.resident')}
              </Label>
            </div>
          </RadioGroup>
          {errors.applicantType && (
            <p className="text-xs text-status-error">{tv(errors.applicantType.message as string)}</p>
          )}
        </div>

        {/* Preferred Center - Select Dropdown */}
        <div className="space-y-2">
          <Label htmlFor="preferredCenterId">{t('step4.preferredCenter')}</Label>
          <select
            id="preferredCenterId"
            {...register('preferredCenterId')}
            className={cn(
              "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background",
              "file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground",
              "placeholder:text-muted-foreground",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
              "disabled:cursor-not-allowed disabled:opacity-50",
              "md:text-sm",
              errors.preferredCenterId 
                ? "border-status-error focus-visible:ring-status-error" 
                : "border-neutral-200 dark:border-neutral-700"
            )}
          >
            <option value="">{t('common.select')}</option>
            {centersData?.map((center) => (
              <option key={center.id} value={center.id}>
                {locale === 'ar' ? center.nameAr : center.nameEn} - {center.city}
              </option>
            ))}
          </select>
          {errors.preferredCenterId && (
            <p className="text-xs text-status-error">{tv(errors.preferredCenterId.message as string)}</p>
          )}
        </div>

        {/* Test Language - Switch Toggle */}
        <div className="space-y-2">
          <Label>{t('step4.testLanguage')}</Label>
          <div className="flex items-center gap-3 mt-2">
            <span className={cn("text-sm", selectedLanguage === 'ar' ? "font-medium text-primary-600" : "text-neutral-500")}>
              {t('step4.arabic')}
            </span>
            <Switch
              checked={selectedLanguage === 'en'}
              onCheckedChange={(checked) => setValue('testLanguage', checked ? 'en' : 'ar')}
            />
            <span className={cn("text-sm", selectedLanguage === 'en' ? "font-medium text-primary-600" : "text-neutral-500")}>
              {t('step4.english')}
            </span>
          </div>
        </div>

        {/* Appointment Preference - Radio Group */}
        <div className="space-y-2">
          <Label>{t('step4.appointmentPreference')}</Label>
          <RadioGroup
            value={selectedPreference}
            onValueChange={(value) => setValue('appointmentPreference', value as 'Morning' | 'Afternoon' | 'Evening' | 'NoPreference')}
            className="flex flex-wrap gap-3 mt-2"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="Morning" id="pref-morning" />
              <Label htmlFor="pref-morning" className="cursor-pointer font-normal text-sm">
                {t('step4.morning')}
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="Afternoon" id="pref-afternoon" />
              <Label htmlFor="pref-afternoon" className="cursor-pointer font-normal text-sm">
                {t('step4.afternoon')}
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="Evening" id="pref-evening" />
              <Label htmlFor="pref-evening" className="cursor-pointer font-normal text-sm">
                {t('step4.evening')}
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="NoPreference" id="pref-none" />
              <Label htmlFor="pref-none" className="cursor-pointer font-normal text-sm">
                {t('step4.noPreference')}
              </Label>
            </div>
          </RadioGroup>
          {errors.appointmentPreference && (
            <p className="text-xs text-status-error">{tv(errors.appointmentPreference.message as string)}</p>
          )}
        </div>

        {/* Special Needs Declaration - Checkbox */}
        <div className="md:col-span-2 space-y-4 pt-4 border-t border-neutral-100 dark:border-neutral-800">
          <div className="flex items-start space-x-3">
            <Checkbox
              id="specialNeedsDeclaration"
              checked={specialNeeds}
              onCheckedChange={(checked) => setValue('specialNeedsDeclaration', checked === true)}
            />
            <div className="grid gap-1.5 leading-none">
              <Label
                htmlFor="specialNeedsDeclaration"
                className="text-sm font-medium leading-none cursor-pointer"
              >
                {t('step4.specialNeedsDeclaration')}
              </Label>
              <p className="text-xs text-neutral-500">
                {t('step4.specialNeedsInfo')}
              </p>
            </div>
          </div>

          {/* Conditional Special Needs Note - Textarea */}
          {specialNeeds && (
            <div className="space-y-2 ms-7">
              <Label htmlFor="specialNeedsNote">{t('step4.specialNeedsNote')}</Label>
              <textarea
                id="specialNeedsNote"
                {...register('specialNeedsNote')}
                placeholder={t('step4.specialNeedsNotePlaceholder')}
                rows={3}
                className={cn(
                  "flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background",
                  "placeholder:text-muted-foreground",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                  "disabled:cursor-not-allowed disabled:opacity-50",
                  "md:text-sm",
                  errors.specialNeedsNote 
                    ? "border-status-error focus-visible:ring-status-error" 
                    : "border-neutral-200 dark:border-neutral-700"
                )}
              />
              {errors.specialNeedsNote && (
                <p className="text-xs text-status-error">{tv(errors.specialNeedsNote.message as string)}</p>
              )}
            </div>
          )}
        </div>
      </div>

      <WizardNavigation onNext={handleSubmit(onNext)} />
    </form>
  );
}