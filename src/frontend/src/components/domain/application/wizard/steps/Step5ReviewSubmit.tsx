'use client';

import { useWizardStore } from '@/stores/wizard-store';
import { useApplicationWizard } from '@/hooks/useApplicationWizard';
import { useTranslations } from 'next-intl';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { FileKey2, User, MapPin, Settings, CheckCircle2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import applicationService from '@/services/application.service';
import { useQuery } from '@tanstack/react-query';

export function Step5ReviewSubmit() {
  const t = useTranslations('wizard');
  const { step1, step2, step3, step4, setDeclaration } = useWizardStore();
  const { declarationAccepted } = useWizardStore();
  const [mounted, setMounted] = useState(false);

  // Fetch driving centers to display the center name
  const { data: centersData } = useQuery({
    queryKey: ['driving-centers'],
    queryFn: async () => {
      const response = await applicationService.getExamCenters();
      if (!response.success) {
        throw new Error(response.message);
      }
      return response.data || [];
    },
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  // Get center name
  const selectedCenter = centersData?.find((c: any) => c.id === step4.preferredCenterId);

  // Service type label
  const getServiceTypeLabel = (type: string | null) => {
    if (!type) return '-';
    const labels: Record<string, string> = {
      NewLicense: t('step1.newLicense.title'),
      Renewal: t('step1.renewal.title'),
      Replacement: t('step1.replacement.title'),
      CategoryUpgrade: t('step1.categoryUpgrade.title'),
      TestRetake: t('step1.testRetake.title'),
      AppointmentBooking: t('step1.appointmentBooking.title'),
    };
    return labels[type] || type;
  };

  // Category label
  const getCategoryLabel = (code: string | null) => {
    if (!code) return '-';
    const labels: Record<string, string> = {
      A: t('step2.categoryA.title'),
      B: t('step2.categoryB.title'),
      C: t('step2.categoryC.title'),
      D: t('step2.categoryD.title'),
      E: t('step2.categoryE.title'),
      F: t('step2.categoryF.title'),
    };
    return labels[code] || code;
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">
        {t('step5.title')}
      </h2>

      <p className="text-neutral-500 dark:text-neutral-400 text-sm">
        {t('step5.description')}
      </p>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Service Type */}
        <Card className="bg-neutral-50 dark:bg-neutral-900/50 border-neutral-200 dark:border-neutral-700">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-primary-100 dark:bg-primary-900/30">
                <FileKey2 className="w-5 h-5 text-primary-600 dark:text-primary-400" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-neutral-500 dark:text-neutral-400">{t('step5.serviceType')}</p>
                <p className="font-semibold text-neutral-900 dark:text-neutral-100">
                  {getServiceTypeLabel(step1.serviceType)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* License Category */}
        <Card className="bg-neutral-50 dark:bg-neutral-900/50 border-neutral-200 dark:border-neutral-700">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-primary-100 dark:bg-primary-900/30">
                <CheckCircle2 className="w-5 h-5 text-primary-600 dark:text-primary-400" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-neutral-500 dark:text-neutral-400">{t('step5.category')}</p>
                <p className="font-semibold text-neutral-900 dark:text-neutral-100">
                  {getCategoryLabel(step2.categoryCode)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Personal Info */}
        <Card className="bg-neutral-50 dark:bg-neutral-900/50 border-neutral-200 dark:border-neutral-700">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-primary-100 dark:bg-primary-900/30">
                <User className="w-5 h-5 text-primary-600 dark:text-primary-400" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-neutral-500 dark:text-neutral-400">{t('step5.personalInfo')}</p>
                <p className="font-semibold text-neutral-900 dark:text-neutral-100">
                  {step3.nationalId || '-'}
                </p>
                <p className="text-sm text-neutral-500 dark:text-neutral-400">
                  {step3.mobileNumber || '-'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Application Details */}
        <Card className="bg-neutral-50 dark:bg-neutral-900/50 border-neutral-200 dark:border-neutral-700">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-primary-100 dark:bg-primary-900/30">
                <MapPin className="w-5 h-5 text-primary-600 dark:text-primary-400" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-neutral-500 dark:text-neutral-400">{t('step5.center')}</p>
                <p className="font-semibold text-neutral-900 dark:text-neutral-100">
                  {selectedCenter?.nameEn || step4.preferredCenterId || '-'}
                </p>
                <p className="text-sm text-neutral-500 dark:text-neutral-400">
                  {t(`step5.${step4.testLanguage}`)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Declaration */}
      <div className="border-t border-neutral-200 dark:border-neutral-700 pt-6">
        <div className="flex items-start gap-3 p-4 bg-secondary-50 dark:bg-secondary-900/20 border border-secondary-200 dark:border-secondary-800 rounded-lg">
          <Checkbox
            id="declaration"
            checked={declarationAccepted}
            onCheckedChange={(checked) => setDeclaration(checked === true)}
          />
          <Label htmlFor="declaration" className="cursor-pointer text-sm leading-relaxed">
            {t('step5.declaration')}
          </Label>
        </div>
      </div>
    </div>
  );
}