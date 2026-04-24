'use client';

import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
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
import { Fingerprint, Calendar, Phone, Mail, MapPin, Building2, User2, ShieldCheck, Contact2 } from 'lucide-react';
import { Gender } from '@/types/wizard.types';

interface LookupItem {
  code: string;
  nameAr: string;
}

function FormSkeleton() {
  return (
    <div className="space-y-12 font-arabic" dir="rtl">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="space-y-4">
            <div className="h-4 w-32 bg-neutral-100 rounded-full animate-pulse" />
            <div className="h-16 w-full bg-white border border-neutral-100 rounded-2xl animate-pulse shadow-sm" />
          </div>
        ))}
      </div>
    </div>
  );
}

// Gender enum for internal use (numeric: 0=NotSpecified, 1=Male, 2=Female)

// Convert numeric Gender enum to string for RadioGroup display value
const genderToDisplayValue = (value: Gender | undefined): string => {
  if (value === Gender.Female) return 'Female';
  return 'Male';
};

// Convert RadioGroup string value to numeric Gender enum
const genderFromDisplayValue = (value: string): Gender => {
  if (value === 'Female') return Gender.Female;
  return Gender.Male;
};

export default function Step3PersonalInfo() {
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

  const { register, getValues, setValue, trigger, setFocus, watch, formState: { errors } } = useForm({
    resolver: zodResolver(step3Schema),
    defaultValues: {
      nationalId: step3.nationalId,
      dateOfBirth: step3.dateOfBirth,
      nationality: step3.nationality,
      // Convert numeric enum to string for form display
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

  useEffect(() => {
    const values = getValues();
    setStep3({
      nationalId: values.nationalId || '',
      dateOfBirth: values.dateOfBirth || '',
      nationality: values.nationality || '',
      // Gender is already numeric enum from form
      gender: values.gender,
      mobileNumber: values.mobileNumber || '',
      email: values.email || '',
      address: values.address || '',
      city: values.city || '',
      region: values.region || '',
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Handle gender change from RadioGroup - set numeric enum value
  const handleGenderChange = (value: string) => {
    const genderValue = value === 'Female' ? Gender.Female : Gender.Male;
    setValue('gender', genderValue as any);
    setStep3({
      ...step3,
      gender: genderValue,
    });
  };

  if (isLoading) {
    return (
      <div className="space-y-16 animate-in fade-in duration-1000">
        <WizardStepHeader 
           title="تحميل البيانات السجلية"
           subtitle="يتم الآن تأمين الاتصال بقاعدة البيانات المركزية لاستعادة حزمة البيانات المطلوبة."
        />
        <FormSkeleton />
      </div>
    );
  }

  return (
    <div className="space-y-16 animate-in fade-in slide-in-from-bottom-12 duration-1000 font-arabic" dir="rtl">
      <WizardStepHeader 
         title="استكمال البيانات الشخصية والمهنية"
         subtitle="يرجى تزويد النظام ببياناتك الرسمية المطابقة للهوية الوطنية لضمان صحة المعاملة وإصدار التراخيص."
      />

      <WizardErrorDisplay 
        error={nationalitiesError || regionsError}
        onRetry={() => {
          if (nationalitiesError) refetchNationalities();
          if (regionsError) refetchRegions();
        }}
        errorMessage="عذراً، تعذر الوصول لقوائم الاختيارات الوطنية حالياً. يرجى إعادة المحاولة لاسترجاع البيانات."
        retryLabel="محاولة استعادة البيانات"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-14">
        <FormField 
          label="الرقم الوطني / جواز السفر" 
          id="nationalId" 
          error={errors.nationalId} 
          required
          icon={<Fingerprint className="w-5 h-5 text-[#1a3a8f]/40" />}
        >
           <Input 
             placeholder="أدخل الرقم الوطني المكون من 11 رقم" 
             className="h-16 rounded-2xl bg-white focus:ring-4 focus:ring-[#1a3a8f]/5"
             {...register('nationalId')} 
           />
        </FormField>

        <FormField 
          label="تاريخ الميلاد السيادي" 
          id="dateOfBirth" 
          error={errors.dateOfBirth} 
          required
          icon={<Calendar className="w-5 h-5 text-[#1a3a8f]/40" />}
        >
          <Input 
            type="date" 
            className="h-16 rounded-2xl shadow-sm focus:ring-4 focus:ring-[#1a3a8f]/5"
            {...register('dateOfBirth')} 
          />
        </FormField>

        <SelectField 
          label="الجنسية الأصلية" 
          id="nationality" 
          error={errors.nationality} 
          required 
          {...register('nationality')}
        >
          <option value="">-- اختر من قائمة الجنسيات المعتمدة --</option>
          {(nationalitiesData as LookupItem[])?.map(n => (
            <option key={n.code} value={n.code}>{n.nameAr}</option>
          ))}
        </SelectField>

        <div className="space-y-4">
          <Label className="text-base font-black text-neutral-900 flex items-center gap-3">
             <User2 className="w-5 h-5 text-[#1a3a8f]/40" />
             تحديد النوع
          </Label>
<RadioGroup 
              value={genderToDisplayValue(watch('gender'))} 
              onValueChange={(val) => setValue('gender', genderFromDisplayValue(val) as any)}
              className="flex gap-10 bg-white p-6 rounded-3xl border border-neutral-100 shadow-sm"
           >
            <div className="flex items-center space-x-4 rtl:space-x-reverse cursor-pointer group">
              <RadioGroupItem value="Male" id="gender-male" className="w-6 h-6 border-neutral-200 text-[#1a3a8f] focus:ring-[#1a3a8f]" />
              <Label htmlFor="gender-male" className="cursor-pointer font-black text-lg text-neutral-600 group-hover:text-[#1a3a8f] transition-colors">ذكر</Label>
            </div>
            <div className="flex items-center space-x-4 rtl:space-x-reverse cursor-pointer group">
              <RadioGroupItem value="Female" id="gender-female" className="w-6 h-6 border-neutral-200 text-[#1a3a8f] focus:ring-[#1a3a8f]" />
              <Label htmlFor="gender-female" className="cursor-pointer font-black text-lg text-neutral-600 group-hover:text-[#1a3a8f] transition-colors">أنثى</Label>
            </div>
          </RadioGroup>
          {errors.gender && <p role="alert" className="text-xs font-black text-red-500 mt-2 px-2">يجب اختيار نوع المتقدم</p>}
        </div>

        <FormField 
          label="رقم الهاتف للتواصل" 
          id="mobileNumber" 
          error={errors.mobileNumber} 
          required
          icon={<Phone className="w-5 h-5 text-[#1a3a8f]/40" />}
        >
          <Input 
            placeholder="7XXXXXXXX" 
            dir="ltr" 
            className="h-16 rounded-2xl bg-white focus:ring-4 focus:ring-[#1a3a8f]/5"
            {...register('mobileNumber')} 
          />
        </FormField>

        <FormField 
          label="البريد الإلكتروني للإشعارات" 
          id="email" 
          error={errors.email} 
          required
          icon={<Mail className="w-5 h-5 text-[#1a3a8f]/40" />}
        >
          <Input 
            type="email" 
            placeholder="example@domain.com" 
            dir="ltr" 
            className="h-16 rounded-2xl bg-white focus:ring-4 focus:ring-[#1a3a8f]/5"
            {...register('email')} 
          />
        </FormField>

        <SelectField 
           label="المحافظة" 
           id="region" 
           error={errors.region} 
           required 
           {...register('region')}
           icon={<MapPin className="w-5 h-5 text-[#1a3a8f]/40" />}
        >
          <option value="">-- اختر المحافظة --</option>
          {(regionsData as LookupItem[])?.map(r => (
            <option key={r.code} value={r.code}>{r.nameAr}</option>
          ))}
        </SelectField>

        <FormField 
          label="اسم المدينة / المديرية" 
          id="city" 
          error={errors.city} 
          required
          icon={<Building2 className="w-5 h-5 text-[#1a3a8f]/40" />}
        >
          <Input 
             placeholder="أدخل اسم المدينة أو المديرية الحالية" 
             className="h-16 rounded-2xl bg-white focus:ring-4 focus:ring-[#1a3a8f]/5"
             {...register('city')} 
          />
        </FormField>

        <FormField 
          label="العنوان التفصيلي الدائم" 
          id="address" 
          error={errors.address} 
          className="md:col-span-2" 
          required
          icon={<Contact2 className="w-5 h-5 text-[#1a3a8f]/40" />}
        >
          <Input 
             placeholder="مثال: صنعاء - شارع الخمسين - خلف بنك اليمن والخليج" 
             className="h-20 rounded-[1.75rem] bg-white focus:ring-4 focus:ring-[#1a3a8f]/5 px-8"
             {...register('address')} 
          />
        </FormField>
      </div>

      <div className="pt-10 border-t border-neutral-100 flex items-center justify-center gap-4 text-neutral-400 opacity-60">
          <ShieldCheck className="w-5 h-5" />
          <span className="text-[10px] font-black uppercase tracking-[0.3em]">نظام التحقق الوطني الآمن • كافة البيانات مشفرة سيادياً</span>
      </div>
    </div>
  );
}