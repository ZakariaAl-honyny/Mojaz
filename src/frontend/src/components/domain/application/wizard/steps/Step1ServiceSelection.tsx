'use client';

import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { step1Schema, Step1FormValues } from '@/lib/validations/wizard.schema';
import { SERVICES_CONFIG } from '@/lib/constants';
import { useWizardStore } from '@/stores/wizard-store';
import ServiceCard from '../shared/ServiceCard';
import WizardStepHeader from '../WizardStepHeader';
import { useRouter } from 'next/navigation';
import { ServiceType } from '@/types/wizard.types';
import { AlertCircle, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Step1ServiceSelection() {
  const { step1, setStep1, goTo, markCompleted } = useWizardStore();
  const router = useRouter();

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

  // Sync store with form selection
  useEffect(() => {
    if (selectedService) {
      setStep1({ serviceType: selectedService });
    }
  }, [selectedService, setStep1]);

  return (
    <div className="space-y-16 animate-in fade-in slide-in-from-bottom-12 duration-1000 font-arabic" dir="rtl">
      <WizardStepHeader 
        title="تحديد مسار المعاملة الرقمية" 
        subtitle="يرجى اختيار نوع الخدمة المرورية المطلوبة للبدء في إجراءات المعاملة الرسمية عبر المنظمة الإلكترونية الموحدة - صنعاء."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {SERVICES_CONFIG.map((service, idx) => (
          <motion.div
            key={service.type}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
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

      <AnimatePresence mode="wait">
        {errors.serviceType && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="p-8 rounded-[2.5rem] bg-red-500/5 border border-red-500/10 flex items-center gap-6 shadow-xl shadow-red-500/5 ring-1 ring-red-200/20"
          >
             <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center text-red-500 shadow-md flex-shrink-0">
                <AlertCircle className="w-8 h-8" />
             </div>
             <div className="space-y-1">
                <p className="text-lg font-black text-red-900 leading-none">تنبيه النظام</p>
                <p role="alert" className="text-sm font-bold text-red-700/80 leading-relaxed">
                  {errors.serviceType.message === 'Required' ? 'يرجى تحديد نوع الخدمة المطلوبة للمضي قدماً في إجراءات المعاملة السيادية.' : errors.serviceType.message}
                </p>
             </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="pt-10 border-t border-neutral-100 flex items-center justify-center gap-4 text-neutral-400 opacity-60">
          <ShieldCheck className="w-5 h-5" />
          <span className="text-[10px] font-black uppercase tracking-[0.3em]">نظام التشفير السيادي • المعيار الوطني ٢٠٢٤</span>
      </div>
    </div>
  );
}