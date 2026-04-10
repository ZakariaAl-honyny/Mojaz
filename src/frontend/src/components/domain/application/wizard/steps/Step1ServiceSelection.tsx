'use client';

import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { step1Schema, Step1FormValues } from '@/lib/validations/wizard.schema';
import { SERVICES_CONFIG } from '@/lib/constants';
import { useWizardStore } from '@/stores/wizard-store';
import ServiceCard from '../shared/ServiceCard';
import WizardStepHeader from '../WizardStepHeader';

export default function Step1ServiceSelection() {
  const { step1, setStep1 } = useWizardStore();
  
  const { 
    handleSubmit, 
    setValue, 
    watch,
    formState: { errors },
    trigger,
    setFocus
  } = useForm<Step1FormValues>({
    resolver: zodResolver(step1Schema),
    defaultValues: {
      serviceType: step1.serviceType as any,
    },
    mode: 'onChange',
  });

  // Register form on window for WizardNavButtons to access
  useEffect(() => {
    (window as any).__step1Form = { trigger, setFocus };
    return () => {
      delete (window as any).__step1Form;
    };
  }, [trigger, setFocus]);

  const selectedService = watch('serviceType');

  // Sync with store on change
  useEffect(() => {
    if (selectedService) {
      setStep1({ serviceType: selectedService });
    }
  }, [selectedService, setStep1]);

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
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
        <p role="alert" className="mt-4 text-sm text-status-error font-medium animate-in fade-in slide-in-from-top-1 text-center">
          {errors.serviceType.message}
        </p>
      )}
    </div>
  );
}