'use client';

import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
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
import { Building2, Languages, Clock, Accessibility, AlertCircle, Loader2, TextIcon, ShieldCheck, Stethoscope, Briefcase } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

function FormSkeleton() {
  return (
    <div className="space-y-12 font-arabic" dir="rtl">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="space-y-4">
            <div className="h-4 w-32 bg-neutral-100 rounded-full animate-pulse" />
            <div className="h-16 w-full bg-white border border-neutral-100 rounded-2xl animate-pulse shadow-sm" />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Step4ApplicationDetails() {
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

  const { register, setValue, watch, trigger, setFocus, getValues, formState: { errors } } = useForm<Step4FormValues>({
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

  useEffect(() => {
    const values = getValues();
    setStep4({
      applicantType: values.applicantType || 'Citizen',
      preferredCenterId: values.preferredCenterId || '',
      testLanguage: values.testLanguage || 'ar',
      appointmentPreference: values.appointmentPreference || 'Morning',
      specialNeedsDeclaration: values.specialNeedsDeclaration || false,
      specialNeedsNote: values.specialNeedsNote || '',
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loadingCenters) {
    return (
      <div className="space-y-16 animate-in fade-in duration-1000">
        <WizardStepHeader 
           title="تحميل المقار الرسمية" 
           subtitle="يتم الآن عرض مراكز الفحص المعتمدة والنشطة في النطاق الجغرافي المخصص."
        />
        <FormSkeleton />
      </div>
    );
  }

  return (
    <div className="space-y-16 animate-in fade-in slide-in-from-bottom-12 duration-1000 font-arabic" dir="rtl">
      <WizardStepHeader 
         title="تحديد تفاصيل وأولويات الفحص"
         subtitle="اختر مركز الفحص المفضل وتفضيلات الاختبار النظري لتسهيل جدولة الموعد الخاص بك."
      />

      <WizardErrorDisplay 
        error={centersError} 
        onRetry={refetchCenters} 
        errorMessage="عذراً، فشل استرجاع قائمة مراكز الفحص الحكومية المعتمدة حالياً." 
        retryLabel="محاولة التحديث" 
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-14">
        {/* Applicant Type Section */}
        <div className="space-y-4">
          <Label className="text-base font-black text-neutral-900 flex items-center gap-3">
             <Briefcase className="w-5 h-5 text-[#1a3a8f]/40" />
             الصفة القانونية للمتقدم
          </Label>
<RadioGroup 
              value={watch('applicantType')} 
              onValueChange={v => setValue('applicantType', v as any)}
             className="flex gap-10 bg-white p-6 rounded-3xl border border-neutral-100 shadow-sm"
          >
            <div className="flex items-center space-x-4 rtl:space-x-reverse cursor-pointer group">
              <RadioGroupItem value="Citizen" id="type-citizen" className="w-6 h-6 border-neutral-200 text-[#1a3a8f] focus:ring-[#1a3a8f]" />
              <Label htmlFor="type-citizen" className="cursor-pointer font-black text-lg text-neutral-600 group-hover:text-[#1a3a8f] transition-colors">مواطن يمني</Label>
            </div>
            <div className="flex items-center space-x-4 rtl:space-x-reverse cursor-pointer group">
              <RadioGroupItem value="Resident" id="type-resident" className="w-6 h-6 border-neutral-200 text-[#1a3a8f] focus:ring-[#1a3a8f]" />
              <Label htmlFor="type-resident" className="cursor-pointer font-black text-lg text-neutral-600 group-hover:text-[#1a3a8f] transition-colors">مقيم (أجنبي)</Label>
            </div>
          </RadioGroup>
          {errors.applicantType && <p role="alert" className="text-xs font-black text-red-500 mt-2 px-2">يجب تحديد صفة المتقدم</p>}
        </div>

        {/* Center Selection */}
        <SelectField 
           label="مركز الفحص المعتمد" 
           id="preferredCenterId" 
           error={errors.preferredCenterId} 
           required 
           {...register('preferredCenterId')}
           icon={<Building2 className="w-5 h-5 text-[#1a3a8f]/40" />}
        >
          <option value="">-- اختر مركز فحص القيادة المفضل --</option>
          {centersData?.map(c => (
            <option key={c.id} value={c.id}>{c.nameAr} - {c.city}</option>
          ))}
        </SelectField>

        {/* Language Selection */}
        <div className="space-y-4">
          <Label className="text-base font-black text-neutral-900 flex items-center gap-3">
             <Languages className="w-5 h-5 text-[#1a3a8f]/40" />
             لغة الاختبار النظري
          </Label>
          <div className="flex items-center justify-between gap-6 bg-white p-6 rounded-3xl border border-neutral-100 shadow-sm">
            <span className={cn("text-lg font-black transition-all duration-500", watch('testLanguage') === 'ar' ? "text-[#1a3a8f] scale-105" : "text-neutral-300")}>العربية</span>
            <Switch 
               checked={watch('testLanguage') === 'en'} 
               onCheckedChange={c => setValue('testLanguage', c ? 'en' : 'ar')} 
               className="data-[state=checked]:bg-[#1a3a8f] scale-125" 
            />
            <span className={cn("text-lg font-black transition-all duration-500", watch('testLanguage') === 'en' ? "text-[#1a3a8f] scale-105" : "text-neutral-300")}>الإنجليزية</span>
          </div>
        </div>

        {/* Appointment Preference */}
        <div className="space-y-4">
          <Label className="text-base font-black text-neutral-900 flex items-center gap-3">
             <Clock className="w-5 h-5 text-[#1a3a8f]/40" />
             تفضيل الفترة الزمنية
          </Label>
          <RadioGroup 
             value={watch('appointmentPreference')} 
             onValueChange={v => setValue('appointmentPreference', v as any)} 
             className="flex flex-wrap gap-4 bg-white p-6 rounded-3xl border border-neutral-100 shadow-sm"
          >
            <div className="flex items-center space-x-3 rtl:space-x-reverse cursor-pointer group px-4 py-2 rounded-xl hover:bg-neutral-50 transition-colors">
              <RadioGroupItem value="Morning" id="pref-morning" className="w-5 h-5 border-neutral-200 text-[#1a3a8f]" />
              <Label htmlFor="pref-morning" className="cursor-pointer font-black text-neutral-600 group-hover:text-[#1a3a8f] text-sm">الفترة الصباحية</Label>
            </div>
            <div className="flex items-center space-x-3 rtl:space-x-reverse cursor-pointer group px-4 py-2 rounded-xl hover:bg-neutral-50 transition-colors">
              <RadioGroupItem value="Afternoon" id="pref-afternoon" className="w-5 h-5 border-neutral-200 text-[#1a3a8f]" />
              <Label htmlFor="pref-afternoon" className="cursor-pointer font-black text-neutral-600 group-hover:text-[#1a3a8f] text-sm">الفترة المسائية</Label>
            </div>
            <div className="flex items-center space-x-3 rtl:space-x-reverse cursor-pointer group px-4 py-2 rounded-xl hover:bg-neutral-50 transition-colors">
               <RadioGroupItem value="NoPreference" id="pref-none" className="w-5 h-5 border-neutral-200 text-[#1a3a8f]" />
               <Label htmlFor="pref-none" className="cursor-pointer font-black text-neutral-600 group-hover:text-[#1a3a8f] text-sm">حسب المتاح</Label>
            </div>
          </RadioGroup>
          {errors.appointmentPreference && <p role="alert" className="text-xs font-black text-red-500 mt-2 px-2">يرجى تحديد تفضيل الوقت</p>}
        </div>

        {/* Special Needs Section */}
        <div className="md:col-span-2 space-y-8 pt-10 border-t border-neutral-100">
          <div className="flex items-start gap-6 p-8 rounded-[2.5rem] bg-amber-500/5 border border-amber-500/10 transition-all duration-700 hover:bg-amber-500/10 shadow-sm group">
             <Checkbox 
                id="specialNeedsDeclaration" 
                checked={watch('specialNeedsDeclaration')} 
                onCheckedChange={c => setValue('specialNeedsDeclaration', c === true)} 
                className="mt-2 w-7 h-7 border-amber-300 data-[state=checked]:bg-amber-600 data-[state=checked]:border-amber-600 rounded-lg transition-all"
              />
            <div className="space-y-3 leading-none">
              <div className="flex items-center gap-3">
                  <Stethoscope className="w-6 h-6 text-amber-600" />
                  <Label htmlFor="specialNeedsDeclaration" className="text-2xl font-black text-amber-900 leading-none cursor-pointer">الإفصاح الطبي والمتطلبات الخاصة</Label>
              </div>
              <p className="text-sm font-bold text-amber-800/60 leading-relaxed max-w-2xl">يرجى تحديد هذا الخيار إذا كنت تعاني من أي حالة طبية أو إعاقة تستوجب ترتيبات استثنائية أثناء تنفيذ الفحص الميداني أو النظري.</p>
            </div>
          </div>

          <AnimatePresence mode="wait">
              {watch('specialNeedsDeclaration') && (
                <motion.div 
                   initial={{ opacity: 0, height: 0 }}
                   animate={{ opacity: 1, height: 'auto' }}
                   exit={{ opacity: 0, height: 0 }}
                   className="ms-14 space-y-4"
                >
                   <div className="relative group">
                      <Label className="text-sm font-black text-neutral-700 mb-3 block px-2">تقديم تفاصيل عن الترتيبات الحكومية المطلوبة</Label>
                      <textarea 
                        placeholder="يرجى كتابة ملاحظاتك الطبية هنا ليتم دراستها من قبل لجنة الفحص..." 
                        rows={5} 
                        className="flex min-h-[160px] w-full rounded-[2rem] border border-neutral-100 bg-white px-10 py-7 text-lg font-bold text-[#1a3a8f] placeholder:text-neutral-300 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#1a3a8f]/5 transition-all duration-700 hover:shadow-xl focus-visible:shadow-2xl focus-visible:border-[#1a3a8f]/30" 
                        {...register('specialNeedsNote')} 
                      />
                      {errors.specialNeedsNote && <p role="alert" className="text-xs font-black text-red-500 mt-3 px-6 animate-pulse">يرجى تقديم شرح مفصل للترتيبات المطلوبة</p>}
                   </div>
                </motion.div>
              )}
          </AnimatePresence>
        </div>
      </div>

      <div className="pt-10 border-t border-neutral-100 flex items-center justify-center gap-4 text-neutral-400 opacity-60">
          <ShieldCheck className="w-5 h-5" />
          <span className="text-[10px] font-black uppercase tracking-[0.3em]">نظام التنسيق اللوجستي المركزي • أمن البيانات السيادي ٢٠٢٤</span>
      </div>
    </div>
  );
}