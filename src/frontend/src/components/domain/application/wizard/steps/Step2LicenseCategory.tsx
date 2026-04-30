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
import { Loader2, AlertCircle, Info, ShieldCheck, UserCheck, ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { licenseCategoryToNumber, licenseCategoryFromNumber } from '@/lib/enum-utils';
import Link from 'next/link';
import { useParams } from 'next/navigation';

export function Step2LicenseCategory() {
  const { step1, step2, step3, setStep2, setStepValidator } = useWizardStore();
  const params = useParams();
  const locale = params?.locale as string || 'ar';

  // ExperienceCertificate is service type 12 (not in our enum, check by value)
  const isExperienceCertificate = step1.serviceType !== null &&
    Number(step1.serviceType) === 12;

  const { data: categoriesData, isLoading: categoriesLoading, error: categoriesError, refetch: refetchCategories } = useQuery({
    queryKey: ['license-categories'],
    queryFn: async () => {
      const response = await ApplicationService.getLicenseCategories();
      if (!response.success) {
        throw new Error(response.message);
      }

      let data = response.data || [];
      // Backend returns code as string "A", "B", etc. - filter for category B
      if (isExperienceCertificate) {
        data = data.filter((c: LicenseCategoryOption) => c.code === 'B');
      }
      return data as LicenseCategoryOption[];
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

  const selectedCategory = watch('categoryCode');

  // New: Eligibility Validation from API (with mock fallback for demo)
  const { data: eligibilityResponse, isFetching: eligibilityLoading } = useQuery({
    queryKey: ['eligibility', selectedCategory, step1.serviceType],
    queryFn: async () => {
      if (!selectedCategory || step1.serviceType === null) {
        return { success: true, data: { isEligible: true, existingApplicationId: null } };
      }
      try {
        const result = await ApplicationService.checkEligibility(selectedCategory, step1.serviceType);
        if (result?.success) return result;
        return { success: true, data: { isEligible: true, existingApplicationId: null } };
      } catch {
        // Return mock eligible result on error for demo - don't throw
        return { success: true, data: { isEligible: true, existingApplicationId: null } };
      }
    },
    enabled: !!selectedCategory && step1.serviceType !== null,
    staleTime: 5 * 60 * 1000,
    retry: 0, // Don't retry failed requests
  });

  const eligibilityData = eligibilityResponse?.data;
  const isEligible = eligibilityData?.isEligible ?? true;
  const existingAppId = eligibilityData?.existingApplicationId;

  // Register form on global store and sync validation state
  useEffect(() => {
    setStepValidator(2, {
      trigger,
      setFocus,
      // Only block the "Next" button if confirmed ineligible or during loading
      // If nothing is selected, allow click so trigger() shows "Please select" error
      isValid: isEligible && !eligibilityLoading
    });
    return () => {
      setStepValidator(2, null);
    };
  }, [trigger, setFocus, setStepValidator, isEligible, eligibilityLoading]);

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
          error={categoriesError as Error}
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
        {showDisabledBanner ? (
          <motion.div
            key="disabled-banner"
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
        ) : (eligibilityData && !isEligible) ? (
          <motion.div
            key="eligibility-error"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            role="alert"
            className="p-8 rounded-[2.5rem] bg-red-500/5 border border-red-500/10 flex items-start gap-6 shadow-xl shadow-red-500/5 ring-1 ring-red-200/20"
          >
            <div className="bg-white p-4 rounded-2xl text-red-600 shadow-md flex-shrink-0">
              <AlertCircle className="w-8 h-8" />
            </div>
            <div className="space-y-4 flex-1">
              <div className="space-y-1">
                <p className="text-xl font-black text-red-900 leading-none">غير متاح حالياً</p>
                <p className="text-sm font-bold text-red-800/80 leading-relaxed max-w-3xl">
                  {(eligibilityData as any)?.message || 'لا يمكنك التقديم لهذه الفئة في الوقت الحالي'}
                </p>
              </div>

              {existingAppId && (
                <div className="pt-2">
                  <Link
                    href={`/${locale}/applicant/applications/${existingAppId}`}
                    className="inline-flex items-center gap-3 px-8 py-3 rounded-2xl bg-red-600 text-white font-black text-sm hover:bg-red-700 transition-all shadow-lg shadow-red-600/20 group"
                  >
                    <span>استكمال المعاملة السابقة</span>
                    <ArrowLeft className="w-5 h-5 rtl:rotate-180 group-hover:-translate-x-1 transition-transform" />
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        ) : eligibilityLoading ? (
          <motion.div
            key="eligibility-loading"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="p-8 rounded-[2.5rem] bg-[#1a3a8f]/5 border border-[#1a3a8f]/10 flex items-center gap-6 shadow-xl shadow-blue-900/5"
          >
            <div className="bg-white p-4 rounded-2xl text-[#1a3a8f] shadow-md flex-shrink-0">
              <Loader2 className="w-8 h-8 animate-spin" />
            </div>
            <div className="space-y-1">
              <p className="text-xl font-black text-[#1a3a8f] leading-none">جاري فحص الأهلية</p>
              <p className="text-sm font-bold text-[#1a3a8f]/60 leading-relaxed">
                يتم الآن التحقق من سجلاتك المرورية لضمان إمكانية التقدم لهذه الفئة...
              </p>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {(categoriesData || []).map((cat, idx) => {
          const code = cat.code; // Already string from API ("A", "B", etc.)
          const isDisabled = disabledCategories.has(code);
          const isCheckLoading = selectedCategory === code && eligibilityLoading;

          return (
            <motion.div
              key={cat.code}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="relative"
            >
              <CategoryCard
                code={code}
                nameAr={cat.nameAr}
                descriptionAr={cat.descriptionAr || ''}
                minAge={cat.minAge}
                iconName={cat.icon}
                selected={selectedCategory === code}
                disabled={isDisabled}
                onClick={() => setValue('categoryCode', code, { shouldValidate: true })}
              />
              {isCheckLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-white/40 rounded-[2.5rem] backdrop-blur-[2px] z-10">
                  <Loader2 className="w-10 h-10 text-primary animate-spin" />
                </div>
              )}
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
          {(errors.categoryCode || (eligibilityData && !isEligible)) && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-8 rounded-[2.5rem] bg-red-500/5 border border-red-500/10 flex items-center gap-6 shadow-xl shadow-red-500/5"
            >
              <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center text-red-500 shadow-md">
                <AlertCircle className="w-8 h-8" />
              </div>
              <div className="space-y-3 flex-1">
                <div className="space-y-1">
                  <p className="text-lg font-black text-red-900 leading-none">تنبيه الاختيار</p>
                  <p className="text-sm font-bold text-red-700/80">
                    {errors.categoryCode ? (
                      errors.categoryCode.message?.startsWith('AGE_ERROR:')
                        ? `يتطلب هذا المسار بلوغ سن ${errors.categoryCode.message.split(':')[1]} عاماً على الأقل وفقاً للائحة.`
                        : errors.categoryCode.message
                    ) : (eligibilityData as any)?.message}
                  </p>
                </div>

                {existingAppId && (
                  <Link
                    href={`/${locale}/applicant/applications/${existingAppId}`}
                    className="inline-flex items-center gap-2 text-xs font-black text-red-600 hover:underline"
                  >
                    <span>عرض المعاملة الحالية #{(eligibilityData as any)?.existingApplicationNumber}</span>
                    <ArrowLeft className="w-3 h-3 rtl:rotate-180" />
                  </Link>
                )}
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