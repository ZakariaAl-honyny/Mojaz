'use client';

import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { step1Schema, Step1FormValues } from '@/lib/validations/wizard.schema';
import { SERVICES_CONFIG } from '@/lib/constants';
import { useWizardStore } from '@/stores/wizard-store';
import ServiceCard from '../shared/ServiceCard';
import WizardNavigation from '../WizardNavigation';
import WizardStepHeader from '../WizardStepHeader';

export default function Step1ServiceSelection() {
  const { step1, setStep1, goTo, markCompleted } = useWizardStore();
  
  const { 
    handleSubmit, 
    setValue, 
    watch,
    formState: { errors },
    trigger
  } = useForm<Step1FormValues>({
    resolver: zodResolver(step1Schema),
    defaultValues: {
      serviceType: step1.serviceType as any,
    },
  });

  // Register form on window for WizardNavButtons to access
  useEffect(() => {
    (window as any).__step1Form = { trigger, setFocus: undefined };
    return () => {
      delete (window as any).__step1Form;
    };
  }, [trigger]);

  const selectedService = watch('serviceType');

  const onNext = (data: Step1FormValues) => {
    setStep1(data);
    markCompleted(1);
    goTo(2);
  };

  return (
    <form onSubmit={handleSubmit(onNext)}>
      <WizardStepHeader />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {SERVICES_CONFIG.map((service) => (
          <ServiceCard
            key={service.type}
            titleKey={service.titleKey}
            descriptionKey={service.descriptionKey}
            iconName={service.icon}
            selected={selectedService === service.type}
            disabled={!service.availableInMvp}
            onClick={() => setValue('serviceType', service.type, { shouldValidate: true })}
          />
        ))}
      </div>

      {errors.serviceType && (
        <p className="mt-4 text-sm text-status-error font-medium">
          {/* Typically handled by useTranslations if the error message is a key */}
          {errors.serviceType.message}
        </p>
      )}

      <WizardNavigation onNext={handleSubmit(onNext)} />
    </form>
  );
}