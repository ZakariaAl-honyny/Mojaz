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
import { Checkbox } from '@/components/ui/checkbox';
import { practicalService } from '@/services/practical.service';
import { submitPracticalResultSchema, SubmitPracticalResultFormValues } from '@/lib/validations/practical.schema';
import { Loader2 } from 'lucide-react';

interface PracticalResultFormProps {
  applicationId: string;
  onSuccess?: () => void;
}

export function PracticalResultForm({ applicationId, onSuccess }: PracticalResultFormProps) {
  const t = useTranslations('practical');
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    control,
    formState: { errors },
  } = useForm<SubmitPracticalResultFormValues>({
    resolver: zodResolver(submitPracticalResultSchema),
    defaultValues: {
      isAbsent: false,
      requiresAdditionalTraining: false,
      needsManualTransmissionEndorsement: false,
    },
  });

  const isAbsent = watch('isAbsent');
  const requiresTraining = watch('requiresAdditionalTraining');

  const onSubmit = async (data: SubmitPracticalResultFormValues) => {
    try {
      setIsSubmitting(true);
      const res = await practicalService.submitResult(applicationId, {
        score: data.score || 0,
        isAbsent: data.isAbsent,
        notes: data.notes,
        examinerNotes: data.examinerNotes,
        vehicleUsed: data.vehicleUsed,
        requiresAdditionalTraining: data.requiresAdditionalTraining,
        additionalHoursRequired: data.additionalHoursRequired,
        needsManualTransmissionEndorsement: data.needsManualTransmissionEndorsement,
      });

      if (res.success) {
        toast.success(t('form.success'));
        onSuccess?.();
        router.refresh();
      } else {
        toast.error(res.message || t('form.error'));
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || t('form.error'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-sm border-neutral-200">
      <CardHeader className="bg-primary-50 rounded-t-gov border-b border-primary-100">
        <CardTitle className="text-primary-800">{t('form.title')}</CardTitle>
        <CardDescription className="text-primary-600">{t('form.description')}</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-6 pt-6">
          <div className="flex items-center space-x-3 rtl:space-x-reverse bg-neutral-50 p-4 rounded-md border border-neutral-200">
            <Controller
              name="isAbsent"
              control={control}
              render={({ field }) => (
                <Checkbox
                  id="isAbsent"
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              )}
            />
            <Label htmlFor="isAbsent" className="font-semibold text-neutral-800 cursor-pointer">
              {t('form.isAbsent')}
            </Label>
          </div>

          {!isAbsent && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="score">{t('form.score')} <span className="text-red-500">*</span></Label>
                <Input
                  id="score"
                  type="number"
                  placeholder="0 - 100"
                  {...register('score', { valueAsNumber: true })}
                  className={errors.score ? 'border-red-500' : ''}
                />
                {errors.score && (
                  <p className="text-sm text-red-500">{errors.score.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="vehicleUsed">{t('form.vehicleUsed')}</Label>
                <Input
                  id="vehicleUsed"
                  type="text"
                  placeholder={t('form.vehicleUsedPlaceholder')}
                  {...register('vehicleUsed')}
                />
              </div>
            </div>
          )}

          {!isAbsent && (
            <div className="flex items-center space-x-3 rtl:space-x-reverse bg-orange-50 p-4 rounded-md border border-orange-200">
              <Controller
                name="needsManualTransmissionEndorsement"
                control={control}
                render={({ field }) => (
                  <Checkbox
                    id="needsManualTransmission"
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                )}
              />
              <Label htmlFor="needsManualTransmission" className="font-semibold text-orange-800 cursor-pointer">
                {t('form.needsManualTransmission')}
              </Label>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="notes">{t('form.notes')}</Label>
            <Textarea
              id="notes"
              placeholder={t('form.notesPlaceholder')}
              {...register('notes')}
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="examinerNotes">{t('form.examinerNotes')} ({t('form.internalOnly')})</Label>
            <Textarea
              id="examinerNotes"
              placeholder={t('form.examinerNotesPlaceholder')}
              {...register('examinerNotes')}
              rows={3}
              className="bg-yellow-50/50"
            />
          </div>

          <div className="border border-neutral-200 rounded-md p-4 space-y-4">
            <div className="flex items-center space-x-3 rtl:space-x-reverse">
              <Controller
                name="requiresAdditionalTraining"
                control={control}
                render={({ field }) => (
                  <Checkbox
                    id="requiresTraining"
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                )}
              />
              <Label htmlFor="requiresTraining" className="font-semibold cursor-pointer">
                {t('form.requiresAdditionalTraining')}
              </Label>
            </div>

            {requiresTraining && (
              <div className="space-y-2 pt-2 ms-6 rtl:ms-0 rtl:me-6">
                <Label htmlFor="additionalHours">{t('form.additionalHours')}</Label>
                <Input
                  id="additionalHours"
                  type="number"
                  placeholder="2 - 20"
                  {...register('additionalHoursRequired', { valueAsNumber: true })}
                />
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter className="bg-neutral-50 px-6 py-4 flex justify-end rounded-b-gov border-t border-neutral-200">
          <Button type="submit" className="w-full sm:w-auto" disabled={isSubmitting}>
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
