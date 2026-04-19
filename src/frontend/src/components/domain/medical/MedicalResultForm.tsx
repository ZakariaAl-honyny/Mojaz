'use client';

import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { medicalService } from '@/services/medical.service';
import { submitMedicalResultSchema, SubmitMedicalResultFormValues } from '@/lib/validations/medical.schema';
import { MedicalFitnessResult } from '@/types/medical.types';
import { Loader2, Activity, Eye, Droplets } from 'lucide-react';

interface MedicalResultFormProps {
  applicationId: string;
  appointmentId: string;
  onSuccess?: () => void;
}

export function MedicalResultForm({ applicationId, appointmentId, onSuccess }: MedicalResultFormProps) {
  const t = useTranslations('medical');
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<SubmitMedicalResultFormValues>({
    resolver: zodResolver(submitMedicalResultSchema),
    defaultValues: {
      result: undefined,
      bloodType: undefined,
      notes: '',
      visionTestResult: '',
      colorBlindTestResult: '',
      bloodPressureNormal: undefined,
    },
  });

  const onSubmit = async (data: SubmitMedicalResultFormValues) => {
    try {
      setIsSubmitting(true);
      const res = await medicalService.submitResult(applicationId, {
        applicationId,
        appointmentId,
        result: data.result,
        bloodType: data.bloodType,
        notes: data.notes,
        visionTestResult: data.visionTestResult,
        colorBlindTestResult: data.colorBlindTestResult,
        bloodPressureNormal: data.bloodPressureNormal,
      });

      if (res.success) {
        toast.success(t('form.success'));
        onSuccess?.();
        router.refresh();
      } else {
        toast.error(res.message || t('form.error'));
      }
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(err.response?.data?.message || t('form.error'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-sm border-neutral-200 dark:border-neutral-700">
      <CardHeader className="bg-primary-50 dark:bg-primary-900/20 rounded-t-gov border-b border-primary-100 dark:border-primary-800">
        <CardTitle className="text-primary-800 dark:text-primary-400 flex items-center gap-2">
          <Activity className="h-5 w-5" />
          {t('form.title')}
        </CardTitle>
        <CardDescription className="text-primary-600 dark:text-primary-500">
          {t('form.description')}
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-6 pt-6">
          {/* Fitness Result - Required */}
          <div className="space-y-2">
            <Label htmlFor="result">
              {t('form.fitnessResult')} <span className="text-red-500">*</span>
            </Label>
            <Controller
              name="result"
              control={control}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger 
                    id="result"
                    className={errors.result ? 'border-red-500' : ''}
                  >
                    <SelectValue placeholder={t('form.fitnessResultPlaceholder')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Fit">{t('result.fit')}</SelectItem>
                    <SelectItem value="ConditionallyFit">{t('result.conditionallyFit')}</SelectItem>
                    <SelectItem value="Unfit">{t('result.unfit')}</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
            {errors.result && (
              <p className="text-sm text-red-500">{errors.result.message}</p>
            )}
          </div>

          {/* Blood Type - Optional */}
          <div className="space-y-2">
            <Label htmlFor="bloodType">{t('form.bloodType')}</Label>
            <Controller
              name="bloodType"
              control={control}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger id="bloodType">
                    <SelectValue placeholder={t('form.bloodTypePlaceholder')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="A+">A+</SelectItem>
                    <SelectItem value="A-">A-</SelectItem>
                    <SelectItem value="B+">B+</SelectItem>
                    <SelectItem value="B-">B-</SelectItem>
                    <SelectItem value="AB+">AB+</SelectItem>
                    <SelectItem value="AB-">AB-</SelectItem>
                    <SelectItem value="O+">O+</SelectItem>
                    <SelectItem value="O-">O-</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          {/* Clinical Tests Section */}
          <div className="border border-neutral-200 dark:border-neutral-700 rounded-md p-4 space-y-4">
            <h4 className="font-semibold text-neutral-800 dark:text-neutral-200 flex items-center gap-2">
              <Eye className="h-4 w-4" />
              {t('form.clinicalTests')}
            </h4>

            {/* Vision Test */}
            <div className="space-y-2">
              <Label htmlFor="visionTestResult">{t('form.visionTest')}</Label>
              <Controller
                name="visionTestResult"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger id="visionTestResult">
                      <SelectValue placeholder={t('form.testResultPlaceholder')} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Normal">{t('testResult.normal')}</SelectItem>
                      <SelectItem value="Abnormal">{t('testResult.abnormal')}</SelectItem>
                      <SelectItem value="NotTested">{t('testResult.notTested')}</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

            {/* Color Blind Test */}
            <div className="space-y-2">
              <Label htmlFor="colorBlindTestResult">{t('form.colorBlindTest')}</Label>
              <Controller
                name="colorBlindTestResult"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger id="colorBlindTestResult">
                      <SelectValue placeholder={t('form.testResultPlaceholder')} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Normal">{t('testResult.normal')}</SelectItem>
                      <SelectItem value="Abnormal">{t('testResult.abnormal')}</SelectItem>
                      <SelectItem value="NotTested">{t('testResult.notTested')}</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

            {/* Blood Pressure */}
            <div className="space-y-2">
              <Label htmlFor="bloodPressureNormal">{t('form.bloodPressure')}</Label>
              <Controller
                name="bloodPressureNormal"
                control={control}
                render={({ field }) => (
                  <Select 
                    onValueChange={(value) => field.onChange(value === 'true')} 
                    value={field.value?.toString()}
                  >
                    <SelectTrigger id="bloodPressureNormal">
                      <SelectValue placeholder={t('form.bpPlaceholder')} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="true">{t('bp.normal')}</SelectItem>
                      <SelectItem value="false">{t('bp.elevated')}</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
          </div>

          {/* General Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">{t('form.notes')}</Label>
            <Textarea
              id="notes"
              placeholder={t('form.notesPlaceholder')}
              {...register('notes')}
              rows={3}
            />
          </div>
        </CardContent>
        <CardFooter className="bg-neutral-50 dark:bg-neutral-800/50 px-6 py-4 flex justify-end rounded-b-gov border-t border-neutral-200 dark:border-neutral-700">
          <Button 
            type="submit" 
            className="w-full sm:w-auto"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="me-2 h-4 w-4 animate-spin" />
                {t('form.submitting')}
              </>
            ) : (
              t('form.submit')
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}