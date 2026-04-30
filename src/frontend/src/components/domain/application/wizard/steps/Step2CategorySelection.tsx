'use client';

import React, { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, AlertCircle, Info } from 'lucide-react';
import { useWizardStore } from '@/stores/wizard-store';
import { createStep2Schema, Step2FormValues } from '@/lib/validations/wizard.schema';
import { useLicenseCategories } from '@/hooks/useLicenseCategories';
import { useUserLicenses, useUpgradeTargets } from '@/hooks/useUpgradeCategories';
import { LicenseStatus } from '@/lib/enums';
import CategoryCard from '../shared/CategoryCard';
import WizardNavigation from '../WizardNavigation';
import WizardStepHeader from '../WizardStepHeader';
import { ServiceType } from '@/types/wizard.types';

export default function Step2CategorySelection() {
  const { step1, step2, step3, setStep2, goTo, markCompleted } = useWizardStore();
  
  // Check if this is an upgrade service
  const isUpgradeService = step1.serviceType === ServiceType.CategoryUpgrade;
  
  // Fetch all available categories
  const { data: allCategories, isLoading: isLoadingCategories, error: errorCategories } = useLicenseCategories();
  
  // Fetch user's licenses (only needed for upgrade service)
  const { data: userLicenses, isLoading: isLoadingLicenses } = useUserLicenses();
  
  // Get the first active license for upgrade (Active = 0)
  const activeLicense = userLicenses?.find(l => l.status === 0);
  
  // Fetch upgrade targets for the active license (only if upgrade service and license exists)
  const { data: upgradeTargets, isLoading: isLoadingUpgradeTargets } = useUpgradeTargets(activeLicense?.id ? Number(activeLicense.id) : null);
  
  // Determine if we're loading any data
  const isLoading = isLoadingCategories || (isUpgradeService && (isLoadingLicenses || (!!activeLicense && isLoadingUpgradeTargets)));
  
  // Error state
  const categoryError = errorCategories;
  
  // Compute filtered categories based on service type
  const filteredCategories = useMemo(() => {
    if (!allCategories) return [];
    
    // If not upgrade service, show all categories
    if (!isUpgradeService) {
      return allCategories;
    }
    
    // If upgrade service but no active license, show all categories (user can't upgrade)
    if (!activeLicense || !upgradeTargets || upgradeTargets.length === 0) {
      return allCategories;
    }
    
    // Filter to only show upgrade target categories
    const targetCodes = upgradeTargets.map(t => t.code);
    return allCategories.filter(cat => targetCodes.includes(cat.code));
  }, [allCategories, isUpgradeService, activeLicense, upgradeTargets]);
  
  // Prepare minAgeMap for validation (only from filtered categories)
  const minAgeMap = useMemo(() => {
    const map: Record<string, number> = {};
    filteredCategories?.forEach(cat => {
      map[cat.code] = cat.minAge;
    });
    return map;
  }, [filteredCategories]);

  const { 
    handleSubmit, 
    setValue, 
    watch,
    formState: { errors, isValid } 
  } = useForm<Step2FormValues>({
    resolver: zodResolver(createStep2Schema(step3.dateOfBirth, minAgeMap)),
    defaultValues: {
      categoryCode: step2.categoryCode as any,
    },
    mode: 'onChange' 
  });

  const selectedCategory = watch('categoryCode');

  // Reset selected category when filtered categories change (if not in the new list)
  useEffect(() => {
    if (step2.categoryCode && filteredCategories.length > 0 && !filteredCategories.some(c => c.code === step2.categoryCode)) {
      setValue('categoryCode', undefined as any, { shouldValidate: false });
    }
  }, [filteredCategories, step2.categoryCode, setValue]);

  const onNext = (data: Step2FormValues) => {
    setStep2({ 
      categoryCode: data.categoryCode,
      availableCategories: isUpgradeService ? filteredCategories.map(c => c.code) : null
    });
    markCompleted(2);
    goTo(3);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 space-y-6">
        <div className="relative">
           <Loader2 className="w-16 h-16 text-[#1a3a8f] animate-spin" />
           <div className="absolute inset-0 bg-[#1a3a8f]/10 rounded-full blur-xl animate-pulse" />
        </div>
        <p className="text-neutral-400 font-bold font-arabic">
          {isUpgradeService ? 'جاري تحميل فئات الترقية المتاحة...' : 'جاري تحميل فئات الرخص المتاحة...'}
        </p>
      </div>
    );
  }

  if (categoryError) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-center px-4 space-y-6 font-arabic" dir="rtl">
        <div className="w-20 h-20 bg-red-50 rounded-3xl flex items-center justify-center text-red-500 shadow-xl shadow-red-500/10">
          <AlertCircle className="w-10 h-10" />
        </div>
        <div className="space-y-2">
           <h3 className="text-2xl font-black text-neutral-900">عذراً، فشل تحميل البيانات</h3>
           <p className="text-neutral-500 font-bold max-w-sm mx-auto">
             حدث خطأ غير متوقع أثناء محاولة استرداد فئات الرخص. يرجى التحقق من اتصالك بالإنترنت.
           </p>
        </div>
        <button 
          onClick={() => window.location.reload()}
          className="px-8 py-3 bg-[#1a3a8f] text-white rounded-xl font-black shadow-xl shadow-blue-900/20 hover:scale-105 active:scale-95 transition-all"
        >
          إعادة المحاولة
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onNext)} className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700 font-arabic" dir="rtl">
      <WizardStepHeader 
        title={isUpgradeService ? "فئة الرخصة المطلوب ترقيتها" : "فئة رخصة القيادة"} 
        subtitle={
          isUpgradeService 
            ? activeLicense 
              ? `رخصتك الحالية: ${activeLicense.licenseCategoryNameAr || activeLicense.licenseCategoryCode}. اختر الفئة المراد الترقي إليها.`
              : "اختر الفئة المراد الترقي إليها من رخصتك الحالية."
            : "اختر نوع المركبة التي يرغب في إصدار رخصة لها للمتابعة في الإجراءات القانونية."
        }
      />

      {/* Info banner for upgrade service */}
      {isUpgradeService && activeLicense && (
        <div className="p-6 rounded-[2rem] bg-amber-50 border border-amber-100 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 flex items-center justify-center text-amber-600 shrink-0">
            <Info className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <p className="text-sm font-black text-amber-900">رخصتك الحالية: {activeLicense.licenseCategoryCode}</p>
            <p className="text-xs font-bold text-amber-700">
             expires at: {activeLicense.expiresAt ? new Date(activeLicense.expiresAt).toLocaleDateString('ar-SA') : 'غير محدد'}
            </p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCategories?.map((cat) => (
          <CategoryCard
            key={cat.code}
            code={cat.code as any}
            nameAr={cat.nameAr}
            descriptionAr={cat.descriptionAr || ''}
            minAge={cat.minAge}
            selected={selectedCategory === cat.code}
            onClick={() => setValue('categoryCode', cat.code as any, { shouldValidate: true })}
          />
        ))}
      </div>

      {errors.categoryCode && (
        <div className="p-6 rounded-[2rem] bg-red-50 border border-red-100 flex items-center gap-4 animate-in shake duration-500">
           <AlertCircle className="w-6 h-6 text-red-500 shrink-0" />
           <p className="text-sm font-black text-red-700">
              {errors.categoryCode.message?.includes('Required') 
                ? 'يرجى اختيار فئة رخصة للمتابعة' 
                : errors.categoryCode.message?.includes(':')
                  ? `عذراً، يجب أن يكون عمرك ${errors.categoryCode.message.split(':')[1]} سنة على الأقل لهذه الفئة`
                  : errors.categoryCode.message}
           </p>
        </div>
      )}

      <WizardNavigation onNext={handleSubmit(onNext)} />
    </form>
  );
}