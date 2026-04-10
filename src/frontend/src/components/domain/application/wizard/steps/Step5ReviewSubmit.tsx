'use client';

import { useWizardStore } from '@/stores/wizard-store';
import { useTranslations } from 'next-intl';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { FileKey2, User, MapPin, CheckCircle2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import applicationService from '@/services/application.service';
import { useQuery } from '@tanstack/react-query';
import WizardStepHeader from '../WizardStepHeader';

export function Step5ReviewSubmit() {
  const t = useTranslations('wizard');
  const { step1, step2, step3, step4, declarationAccepted, setDeclaration } = useWizardStore();
  const [mounted, setMounted] = useState(false);

  const { data: centersData } = useQuery({
    queryKey: ['driving-centers'],
    queryFn: async () => {
      const response = await applicationService.getExamCenters();
      if (!response.success) throw new Error(response.message);
      return response.data || [];
    },
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const selectedCenter = centersData?.find((c: any) => c.id === step4.preferredCenterId);

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <WizardStepHeader />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Service Type */}
        <Card className="bg-neutral-50/50 dark:bg-neutral-900/30 border-neutral-100 dark:border-neutral-800">
          <CardContent className="p-4 flex items-start gap-4">
            <div className="p-2.5 rounded-gov bg-primary-100/50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400">
              <FileKey2 className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-medium text-neutral-400 uppercase tracking-wider mb-1">{t('step5.serviceType')}</p>
              <p className="font-semibold text-neutral-900 dark:text-neutral-100">
                {t(`step1.${step1.serviceType?.charAt(0).toLowerCase()}${step1.serviceType?.slice(1)}.title` as any)}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* License Category */}
        <Card className="bg-neutral-50/50 dark:bg-neutral-900/30 border-neutral-100 dark:border-neutral-800">
          <CardContent className="p-4 flex items-start gap-4">
            <div className="p-2.5 rounded-gov bg-primary-100/50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-medium text-neutral-400 uppercase tracking-wider mb-1">{t('step5.category')}</p>
              <p className="font-semibold text-neutral-900 dark:text-neutral-100">
                {t(`step2.category${step2.categoryCode}.title` as any)}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Personal Info */}
        <Card className="bg-neutral-50/50 dark:bg-neutral-900/30 border-neutral-100 dark:border-neutral-800">
          <CardContent className="p-4 flex items-start gap-4">
            <div className="p-2.5 rounded-gov bg-primary-100/50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400">
              <User className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <p className="text-xs font-medium text-neutral-400 uppercase tracking-wider mb-1">{t('step5.personalInfo')}</p>
              <p className="font-semibold text-neutral-900 dark:text-neutral-100 leading-tight">{step3.nationalId}</p>
              <p className="text-sm text-neutral-500 dark:text-neutral-400 leading-tight">{step3.mobileNumber}</p>
            </div>
          </CardContent>
        </Card>

        {/* Exam Details */}
        <Card className="bg-neutral-50/50 dark:bg-neutral-900/30 border-neutral-100 dark:border-neutral-800">
          <CardContent className="p-4 flex items-start gap-4">
            <div className="p-2.5 rounded-gov bg-primary-100/50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400">
              <MapPin className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <p className="text-xs font-medium text-neutral-400 uppercase tracking-wider mb-1">{t('step5.center')}</p>
              <p className="font-semibold text-neutral-900 dark:text-neutral-100 leading-tight">
                {selectedCenter?.nameEn || step4.preferredCenterId}
              </p>
              <p className="text-sm text-neutral-500 dark:text-neutral-400 leading-tight">
                {t(`step4.${step4.testLanguage}`)}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Declaration */}
      <div className="pt-8 border-t border-neutral-100 dark:border-neutral-800">
        <div className="group relative flex items-start gap-3 p-5 bg-primary-50/30 dark:bg-primary-950/20 border border-primary-100/50 dark:border-primary-900/30 rounded-xl transition-all duration-300 hover:shadow-md">
          <Checkbox
            id="declaration"
            checked={declarationAccepted}
            onCheckedChange={(checked) => setDeclaration(checked === true)}
            className="mt-1 border-primary-300 data-[state=checked]:bg-primary-500 data-[state=checked]:border-primary-500"
          />
          <Label htmlFor="declaration" className="cursor-pointer text-sm leading-relaxed text-neutral-700 dark:text-neutral-300 select-none">
            {t('step5.declaration')}
          </Label>
        </div>
      </div>
    </div>
  );
}