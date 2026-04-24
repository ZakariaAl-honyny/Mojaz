'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useMemo } from 'react';
import { useWizardStore } from '@/stores/wizard-store';
import { createStep2Schema, type Step2FormValues } from '@/lib/validations/step2Schema';
import { useQuery } from '@tanstack/react-query';
import ApplicationService from '@/services/application.service';
import CategoryCard from '../shared/CategoryCard';
import { calculateAge } from '@/lib/utils';
import { LicenseCategoryCode, LicenseCategoryOption } from '@/types/wizard.types';
import WizardErrorDisplay from '../shared/WizardErrorDisplay';
import WizardStepHeader from '../WizardStepHeader';
import { Loader2, AlertCircle, Info, ShieldCheck, UserCheck } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { licenseCategoryToNumber, licenseCategoryFromNumber } from '@/lib/enum-utils';

export function Step2LicenseCategory() {
  const { step1, step2, step3, setStep2 } = useWizardStore();

  // ExperienceCertificate is service type 12 (not in our enum, check by value)
  const isExperienceCertificate = step1.serviceType !== null && 
    (step1.serviceType as number) === 12;

  const { data: categoriesData, isLoading: categoriesLoading, error: categoriesError, refetch: refetchCategories } = useQuery<LicenseCategoryOption[]>({
    queryKey: ['license-categories'],
    queryFn: async () => {
      const response = await ApplicationService.getLicenseCategories();
      if (!response.success) {
        throw new Error(response.message);
      }
      
      let data = response.data || [];
      // Backend returns code as string "A", "B", etc. - filter for category B
      if (isExperienceCertificate) {
        data = data.filter(c => c.code === 'B');
      }
      return data;
    },
    staleTime: 60 * 60 * 1000,
    retry: 2,
  });

  // Convert string code from API (e.g., "A") to number (0) for frontend enum
  const minAgeMap = useMemo(() => {
    const defaultMap: Record<string, number> = {
      'A': 16,
      'B': 18,
      'C': 21,
      'D': 21,
      'E': 21,
      'F': 18,
    };

    if (!categoriesData?.length) return defaultMap;

    const map = { ...defaultMap };
    categoriesData.forEach((cat) => {
      if (cat.code in map) map[cat.code] = cat.minAge;
    });

    return map;
  }, [categoriesData]);

  const applicantAge = useMemo(() => {
    if (!step3.dateOfBirth) return 0;
    return calculateAge(step3.dateOfBirth);
  }, [step3.dateOfBirth]);

  const step2Schema = useMemo(
    () => createStep2Schema(step3.dateOfBirth, minAgeMap),
    [step3.dateOfBirth, minAgeMap]
  );

  const form = useForm<Step2FormValues>({
    resolver: zodResolver(step2Schema),
    defaultValues: {
      categoryCode: step2.categoryCode || undefined, // String from store
    },
    mode: 'onChange',
  });

  const { watch, setValue, formState: { errors }, trigger, setFocus } = form;

  useEffect(() => {
    (window as any).__step2Form = { trigger, setFocus };
    return () => {
      delete (window as any).__step2Form;
    };
  }, [trigger, setFocus]);

  const selectedCategory = watch('categoryCode');

  // Sync with store
  useEffect(() => {
    if (selectedCategory) {
      setStep2({ categoryCode: selectedCategory });
    }
  }, [selectedCategory, setStep2]);

  const disabledCategories = useMemo(() => {
    const disabled = new Set<string>(); // Use string codes
    if (applicantAge <= 0) return disabled;

    // Use string codes that match API response ("A", "B", etc.)
    const codeStrings = ['A', 'B', 'C', 'D', 'E', 'F'];
    
    codeStrings.forEach((code) => {
      if (applicantAge < (minAgeMap[code] ?? 999)) disabled.add(code);
    });

    return disabled;
  }, [minAgeMap, applicantAge]);

  const disabledCategoriesCount = disabledCategories.size;
  const showDisabledBanner = applicantAge > 0 && disabledCategoriesCount > 0 && !isExperienceCertificate;

  if (categoriesLoading) {
    return (
      <div className="space-y-12 animate-in fade-in duration-1000 font-arabic" dir="rtl">
        <WizardStepHeader 
          title="جاري فحص الفئات المتاحة..."
          subtitle="يقوم النظام الآن بمطابقة بياناتك العمرية مع فئات الرخص المعمول بها قانوناً."
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="p-10 rounded-[2.5rem] bg-white border border-neutral-100 animate-pulse shadow-sm">
              <div className="flex items-center gap-6">
                <div className="w-20 h-20 rounded-2xl bg-neutral-100" />
                <div className="flex-1 space-y-4">
                  <div className="h-6 w-32 bg-neutral-100 rounded-full" />
                  <div className="h-4 w-full bg-neutral-50 rounded-full" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (categoriesError) {
    return (
      <div className="space-y-12 animate-in fade-in duration-1000 font-arabic" dir="rtl">
        <WizardStepHeader 
          title="خطأ في تحميل الفئات"
           subtitle="تعذر الاتصال بقاعدة بيانات الفئات المركزية حالياً."
        />
        <WizardErrorDisplay 
          error={categoriesError}
          onRetry={refetchCategories}
          errorMessage="عذراً، فشل تحميل قائمة فئات الرخص الوطنية. يرجى التحقق من استقرار اتصالك بالإنترنت."
          retryLabel="محاولة استعادة البيانات"
        />
      </div>
    );
  }

  return (
    <div className="space-y-16 animate-in fade-in slide-in-from-bottom-12 duration-1000 font-arabic" dir="rtl">
      <WizardStepHeader 
        title="تحديد فئة المركبة المستهدفة"
        subtitle="اختر فئة الرخصة التي ترغب في الحصول عليها. يطبق النظام تلقائياً ضوابط السن القانوني لكل فئة وفقاً للائحة المرور."
      />

      <AnimatePresence mode="wait">
        {showDisabledBanner && (
            <motion.div 
               initial={{ opacity: 0, y: -20 }}
               animate={{ opacity: 1, y: 0 }}
               exit={{ opacity: 0, y: -20 }}
               role="status" 
               className="p-8 rounded-[2.5rem] bg-amber-500/5 border border-amber-500/10 flex items-start gap-6 shadow-xl shadow-amber-900/5 ring-1 ring-amber-200/20"
            >
                <div className="bg-white p-4 rounded-2xl text-amber-600 shadow-md flex-shrink-0">
                    <AlertCircle className="w-8 h-8" />
                </div>
                <div className="space-y-2">
                    <p className="text-xl font-black text-amber-900 leading-none">تطابق السن القانوني</p>
                    <p className="text-sm font-bold text-amber-800/80 leading-relaxed max-w-3xl">
                        بناءً على تاريخ ميلادك المسجل، هناك {disabledCategoriesCount} فئة (فئات) رخص غير متاحة لك حالياً. يرجى مراجعة السن القانوني الموضح على البطاقات النشطة.
                    </p>
                </div>
            </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {(categoriesData || []).map((cat, idx) => {
          const code = cat.code; // Already string from API ("A", "B", etc.)
          const isDisabled = disabledCategories.has(code);
          return (
            <motion.div
              key={cat.code}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
            >
                <CategoryCard
                    code={code as any} // Cast to any for display
                    nameAr={cat.nameAr}
                    descriptionAr={cat.descriptionAr || ''}
                    minAge={cat.minAge}
                    iconName={cat.icon}
                    selected={selectedCategory === code}
                    disabled={isDisabled}
                    onClick={() => setValue('categoryCode', code, { shouldValidate: true })}
                />
            </motion.div>
          );
        })}
      </div>

      <div className="flex flex-col items-center gap-10 pt-12 border-t border-neutral-100">
        <AnimatePresence mode="wait">
            {applicantAge > 0 && !isExperienceCertificate && (
                <motion.div 
                   initial={{ opacity: 0, scale: 0.9 }}
                   animate={{ opacity: 1, scale: 1 }}
                   className="px-10 py-4 rounded-full bg-[#1a3a8f]/5 text-[#1a3a8f] font-black text-sm flex items-center gap-4 border border-[#1a3a8f]/10"
                >
                    <UserCheck className="w-5 h-5" />
                    <span>العمر المحتسب في النظام: {applicantAge} سنة</span>
                </motion.div>
            )}
        </AnimatePresence>

        <AnimatePresence mode="wait">
            {errors.categoryCode && (
                <motion.div 
                   initial={{ opacity: 0, scale: 0.95 }}
                   animate={{ opacity: 1, scale: 1 }}
                   className="p-8 rounded-[2.5rem] bg-red-500/5 border border-red-500/10 flex items-center gap-6 shadow-xl shadow-red-500/5"
                >
                    <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center text-red-500 shadow-md">
                        <AlertCircle className="w-8 h-8" />
                    </div>
                    <div className="space-y-1">
                        <p className="text-lg font-black text-red-900 leading-none">تنبيه الاختيار</p>
                        <p className="text-sm font-bold text-red-700/80">
                            {errors.categoryCode.message?.includes('Required') 
                            ? 'يرجى اختيار فئة الفحص المستهدفة للمتابعة في إجراءات المعاملة.' 
                            : errors.categoryCode.message?.includes(':')
                                ? `يتطلب هذا المسار بلوغ سن ${errors.categoryCode.message.split(':')[1]} عاماً على الأقل وفقاً للائحة.`
                                : errors.categoryCode.message}
                        </p>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>

        <div className="flex items-center gap-4 text-neutral-400 opacity-60">
            <ShieldCheck className="w-5 h-5" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em]">مطابق للمعايير الوطنية للفحص والقيادة ٢٠٢٤</span>
        </div>
      </div>
    </div>
  );
}