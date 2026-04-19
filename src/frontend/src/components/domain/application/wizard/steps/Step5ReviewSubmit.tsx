'use client';

import { useWizardStore } from '@/stores/wizard-store';
import { useTranslations, useLocale } from 'next-intl';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { 
  FileKey2, 
  User, 
  MapPin, 
  CheckCircle2, 
  ChevronRight, 
  ShieldCheck, 
  Printer, 
  CreditCard,
  Languages,
  Clock,
  Briefcase
} from 'lucide-react';
import { useEffect, useState } from 'react';
import applicationService from '@/services/application.service';
import { useQuery } from '@tanstack/react-query';
import WizardStepHeader from '../WizardStepHeader';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

export function Step5ReviewSubmit() {
  const t = useTranslations('wizard');
  const locale = useLocale();
  const { step1, step2, step3, step4, declarationAccepted, setDeclaration } = useWizardStore();
  const [mounted, setMounted] = useState(false);

  const { data: centersData } = useQuery({
    queryKey: ['driving-centers'],
    queryFn: async () => {
      const response = await applicationService.getExamCenters();
      if (!response.success) throw new Error(response.message);
      return response.data || [];
    },
    staleTime: 24 * 60 * 60 * 1000,
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const selectedCenter = centersData?.find((c: any) => c.id === step4.preferredCenterId);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const sectionVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" }
    }
  };

  const SummaryCard = ({ icon: Icon, label, value, subValue, pulse = false }: any) => (
    <motion.div 
      variants={sectionVariants}
      className={cn(
        "relative p-6 rounded-2xl border-2 border-neutral-100 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-sm overflow-hidden group hover:border-primary-200 dark:hover:border-primary-800 transition-all duration-300",
        pulse && "ring-2 ring-primary-500/20"
      )}
    >
      <div className="flex items-start gap-4 h-full">
        <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-primary-50 dark:bg-primary-900/20 flex items-center justify-center text-primary-600 dark:text-primary-400 group-hover:scale-110 transition-transform duration-500">
          <Icon className="w-6 h-6" />
        </div>
        <div className="flex-1 space-y-1">
          <p className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">{label}</p>
          <p className="font-bold text-base text-neutral-900 dark:text-neutral-100 leading-tight">
            {value}
          </p>
          {subValue && (
            <p className="text-xs text-neutral-500 dark:text-neutral-400 font-medium">
              {subValue}
            </p>
          )}
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="space-y-10">
      <WizardStepHeader />

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        {/* Service Section */}
        <SummaryCard 
          icon={FileKey2}
          label={t('step5.serviceType')}
          value={t(`step1.${step1.serviceType?.charAt(0).toLowerCase()}${step1.serviceType?.slice(1)}.title` as any)}
          subValue={step1.serviceType === 'NewLicense' ? t('step1.newLicense.description') : undefined}
        />

        {/* License Category Section */}
        <SummaryCard 
          icon={Briefcase}
          label={t('step5.category')}
          value={`${t('step2.title')} (${step2.categoryCode})`}
          subValue={t('step2.yourAge', { age: step3.dateOfBirth ? (new Date().getFullYear() - new Date(step3.dateOfBirth).getFullYear()) : '?' })}
        />

        {/* Personal Detials Section */}
        <SummaryCard 
          icon={User}
          label={t('step5.personalInfo')}
          value={step3.nationalId}
          subValue={step3.mobileNumber}
        />

        {/* Location & Language Section */}
        <SummaryCard 
          icon={MapPin}
          label={t('step5.center')}
          value={locale === 'ar' ? (selectedCenter?.nameAr || step4.preferredCenterId) : (selectedCenter?.nameEn || step4.preferredCenterId)}
          subValue={`${t('step4.testLanguage')}: ${t(`step4.${step4.testLanguage}`)}`}
        />

        {/* Preferences Section */}
        <SummaryCard 
          icon={Clock}
          label={t('step4.appointmentPreference')}
          value={t(`step4.${step4.appointmentPreference.toLowerCase()}`)}
          subValue={step4.specialNeedsDeclaration ? t('step4.specialNeedsDeclaration') : t('common.noSpecialNeeds')}
        />

        {/* Contact Email */}
        <SummaryCard 
          icon={CreditCard}
          label={t('step3.email')}
          value={step3.email}
          subValue={t('common.verified')}
        />
      </motion.div>

      {/* Final Declaration Area */}
      <motion.div 
        variants={sectionVariants}
        initial="hidden"
        animate="visible"
        className="pt-8 space-y-4"
      >
        <div className="flex items-center gap-2 mb-4">
          <ShieldCheck className="w-5 h-5 text-primary-500" />
          <h4 className="font-bold text-lg">{t('step5.finalReview')}</h4>
        </div>

        <div className={cn(
          "group relative flex items-start gap-4 p-6 rounded-2xl border-2 transition-all duration-500",
          declarationAccepted 
            ? "border-primary-500/50 bg-primary-50/30 dark:bg-primary-900/10 shadow-lg shadow-primary-500/5" 
            : "border-neutral-100 dark:border-neutral-800 bg-white dark:bg-neutral-900/50 hover:border-primary-200"
        )}>
          <div className="pt-1">
            <Checkbox
              id="declaration"
              checked={declarationAccepted}
              onCheckedChange={(checked) => setDeclaration(checked === true)}
              className="w-6 h-6 rounded-lg border-2 border-neutral-200 data-[state=checked]:bg-primary-500 data-[state=checked]:border-primary-500 transition-all duration-300"
            />
          </div>
          <div className="flex-1 space-y-1">
            <Label htmlFor="declaration" className="cursor-pointer text-sm font-bold leading-relaxed text-neutral-800 dark:text-neutral-200 select-none">
              {t('step5.declaration')}
            </Label>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed italic">
              {t('step5.declarationSubtitle')}
            </p>
          </div>

          <AnimatePresence>
            {declarationAccepted && (
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                className="hidden sm:block"
              >
                <div className="bg-primary-500 text-white rounded-full p-2">
                  <ShieldCheck className="w-4 h-4" />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}