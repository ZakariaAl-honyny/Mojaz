'use client';

import React, { useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { step1Schema, Step1FormValues } from '@/lib/validations/wizard.schema';
import { SERVICES_CONFIG } from '@/lib/constants';
import { useWizardStore } from '@/stores/wizard-store';
import ServiceCard from '../shared/ServiceCard';
import WizardStepHeader from '../WizardStepHeader';
import { AlertCircle, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Step1ServiceSelection() {
  const { step1, setStep1, setStepValidator } = useWizardStore();

  const {
    setValue,
    watch,
    formState: { errors },
    trigger,
    setFocus,
    reset
  } = useForm<Step1FormValues>({
    resolver: zodResolver(step1Schema),
    defaultValues: {
      serviceType: (step1.serviceType ?? undefined) as Step1FormValues['serviceType'],
    },
    mode: 'onChange',
  });

  const selectedService = watch('serviceType');

  // Sync form with store only on initial load (not on every change to avoid loop)
  const hasInitialized = useRef(false);
  useEffect(() => {
    if (step1.serviceType && !hasInitialized.current) {
      hasInitialized.current = true;
      reset({ serviceType: step1.serviceType });
    }
  }, [step1.serviceType]);

  useEffect(() => {
    setStepValidator(1, { trigger, setFocus });
    return () => {
      setStepValidator(1, null);
    };
  }, [trigger, setFocus, setStepValidator]);

  useEffect(() => {
    if (selectedService && selectedService !== step1.serviceType) {
      setStep1({ serviceType: selectedService });
    }
  }, [selectedService, step1.serviceType, setStep1]);

  return (
    <div className="space-y-3 font-arabic" dir="rtl">
      <WizardStepHeader 
        title="اختيار نوع الخدمة" 
        subtitle="حدد نوع الخدمة المرورية المطلوبة"
      />

      {/* Services Grid - Equal size cards */}
      <div className="grid grid-cols-2 gap-2">
        {SERVICES_CONFIG.map((service, idx) => (
          <motion.div
            key={service.type}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: idx * 0.03 }}
          >
            <ServiceCard
              titleAr={service.title}
              descriptionAr={service.description}
              iconName={service.icon}
              selected={selectedService === service.type}
              disabled={!service.availableInMvp}
              onClick={() => setValue('serviceType', service.type, { shouldValidate: true })}
            />
          </motion.div>
        ))}
      </div>

      {/* Error Message */}
      <AnimatePresence mode="wait">
        {errors.serviceType && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="p-2 rounded-lg bg-red-50 border border-red-200 flex items-center gap-2 text-sm"
          >
              <AlertCircle className="w-4 h-4 text-red-500" />
              <p className="text-xs font-bold text-red-900">{errors.serviceType.message}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <div className="pt-2 border-t border-neutral-100 flex items-center justify-center gap-1 text-neutral-400 text-[9px]">
        <ShieldCheck className="w-3 h-3" />
        <span className="font-medium">نظام موحد</span>
      </div>
    </div>
  );
}