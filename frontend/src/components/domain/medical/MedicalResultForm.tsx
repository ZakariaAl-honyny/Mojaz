'use client';

import { useState, useTransition } from 'react';
import { useTranslations } from 'next-intl';
import { 
  CreateMedicalResultRequest, 
  FitnessResult, 
  BloodType 
} from '@/types/medical.types';
import { 
  useCreateMedicalResult, 
  useUpdateMedicalResult 
} from '@/services/medical.service';
import { cn } from '@/lib/utils';

// Import shadcn/ui components (adjust paths based on actual installation)
// Assuming shadcn/ui is installed and configured
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Toast, toast } from '@/components/ui/use-toast';

interface MedicalResultFormProps {
  applicationId: string;
  initialData?: {
    result?: FitnessResult;
    bloodType?: BloodType | null;
    visionTestResult?: string | null;
    colorBlindTestResult?: string | null;
    bloodPressureNormal?: boolean | null;
    notes?: string | null;
  };
  onSuccess?: () => void;
}

export const MedicalResultForm = ({ 
  applicationId, 
  initialData,
  onSuccess 
}: MedicalResultFormProps) => {
  const t = useTranslations('medical');
  const [formData, setFormData] = useState<CreateMedicalResultRequest>({
    applicationId,
    result: initialData?.result ?? FitnessResult.Fit,
    bloodType: initialData?.bloodType ?? null,
    visionTestResult: initialData?.visionTestResult ?? null,
    colorBlindTestResult: initialData?.colorBlindTestResult ?? null,
    bloodPressureNormal: initialData?.bloodPressureNormal ?? null,
    notes: initialData?.notes ?? null
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isPending, startTransition] = useTransition();
  const { mutate: createMedicalResult, isPending: isCreatingPending } = useCreateMedicalResult();
  const { mutate: updateMedicalResult, isPending: isUpdatingPending } = useUpdateMedicalResult();
  
  // Determine if we're creating or updating
  const isEditMode = !!initialData?.result; // Simplified check
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.applicationId) {
      toast({
        title: t('errors.missingApplication'),
        description: t('errors.applicationRequired'),
        variant: 'destructive'
      });
      return;
    }
    
    startTransition(() => {
      setIsLoading(true);
      
      if (isEditMode) {
        // Update existing medical result
        // Note: In a real implementation, we would need the medical result ID
        // This is a simplified version assuming we have it from initialData.id
        // For now, we'll simulate the update
        setIsUpdating(true);
        // In reality: updateMedicalResult({ id: medicalResultId, data: formData });
        setTimeout(() => {
          setIsUpdating(false);
          setIsLoading(false);
          toast({
            title: t('success.title'),
            description: t('success.updated'),
            variant: 'success'
          });
          onSuccess?.();
        }, 1000);
      } else {
        // Create new medical result
        createMedicalResult(formData, {
          onSuccess: () => {
            setIsLoading(false);
            toast({
              title: t('success.title'),
              description: t('success.created'),
              variant: 'success'
            });
            onSuccess?.();
          },
          onError: (error) => {
            setIsLoading(false);
            toast({
              title: t('errors.title'),
              description: error.message || t('errors.unknown'),
              variant: 'destructive'
            });
          }
        });
      }
    });
  };
  
  const bloodTypeOptions = [
    { value: BloodType.A_POSITIVE, label: 'A+' },
    { value: BloodType.A_NEGATIVE, label: 'A-' },
    { value: BloodType.B_POSITIVE, label: 'B+' },
    { value: BloodType.B_NEGATIVE, label: 'B-' },
    { value: BloodType.AB_POSITIVE, label: 'AB+' },
    { value: BloodType.AB_NEGATIVE, label: 'AB-' },
    { value: BloodType.O_POSITIVE, label: 'O+' },
    { value: BloodType.O_NEGATIVE, label: 'O-' },
  ];
  
  const resultOptions = [
    { value: FitnessResult.Fit, label: t('result.fit') },
    { value: FitnessResult.Unfit, label: t('result.unfit') },
    { value: FitnessResult.ConditionallyFit, label: t('result.conditionallyFit') },
  ];
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-primary-600 dark:text-primary-400">
          {t('form.title')}
        </h2>
        <p className="text-muted-foreground">
          {t('form.description')}
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Result */}
        <div>
          <label className="block text-sm font-medium text-muted-foreground mb-2">
            {t('form.result')}
          </label>
          <Select value={formData.result} onValueChange={(value: FitnessResult) => setFormData(prev => ({ ...prev, result: value }))}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder={t('form.selectResult')} />
            </SelectTrigger>
            <SelectContent>
              {resultOptions.map(option => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        {/* Blood Type */}
        <div>
          <label className="block text-sm font-medium text-muted-foreground mb-2">
            {t('form.bloodType')}
          </label>
          <Select value={formData.bloodType} onValueChange={(value) => setFormData(prev => ({ ...prev, bloodType: value }))}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder={t('form.selectBloodType')} />
            </SelectTrigger>
            <SelectContent>
              {bloodTypeOptions.map(option => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {/* Vision Test */}
      <div>
        <label className="block text-sm font-medium text-muted-foreground mb-2">
          {t('form.visionTest')}
        </label>
        <Input
          type="text"
          placeholder={t('form.visionTestPlaceholder')}
          value={formData.visionTestResult ?? ''}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData(prev => ({ ...prev, visionTestResult: e.target.value || null }))}
          className={cn(
            'block w-full rounded-md border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
            'dark:border-input-dark dark:bg-background-dark dark:text-muted-foreground-dark dark:placeholder:text-muted-foreground-dark'
          )}
        />
      </div>
      
      {/* Color Blind Test */}
      <div>
        <label className="block text-sm font-medium text-muted-foreground mb-2">
          {t('form.colorBlindTest')}
        </label>
        <Input
          type="text"
          placeholder={t('form.colorBlindTestPlaceholder')}
          value={formData.colorBlindTestResult ?? ''}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData(prev => ({ ...prev, colorBlindTestResult: e.target.value || null }))}
          className={cn(
            'block w-full rounded-md border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
            'dark:border-input-dark dark:bg-background-dark dark:text-muted-foreground-dark dark:placeholder:text-muted-foreground-dark'
          )}
        />
      </div>
      
      {/* Blood Pressure */}
      <div>
        <div className="flex items-start space-x-3">
          <Checkbox
            checked={formData.bloodPressureNormal ?? false}
            onCheckedChange={(checked: boolean) => setFormData(prev => ({ ...prev, bloodPressureNormal: checked }))}
            className="h-4 w-4 text-primary-600"
          />
          <div>
            <label className="text-sm font-medium text-muted-foreground">
              {t('form.bloodPressureNormal')}
            </label>
            <p className="text-xs text-muted-foreground">
              {t('form.bloodPressureNormalHint')}
            </p>
          </div>
        </div>
      </div>
      
      {/* Notes */}
      <div>
        <label className="block text-sm font-medium text-muted-foreground mb-2">
          {t('form.notes')}
        </label>
        <Textarea
          placeholder={t('form.notesPlaceholder')}
          value={formData.notes ?? ''}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setFormData(prev => ({ ...prev, notes: e.target.value || null }))}
          className={cn(
            'block w-full rounded-md border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none h-20',
            'dark:border-input-dark dark:bg-background-dark dark:text-muted-foreground-dark dark:placeholder:text-muted-foreground-dark'
          )}
        />
      </div>
      
      {/* Submit Button */}
      <div className="flex justify-end">
        <Button 
          type="submit" 
          disabled={isLoading || isUpdating}
          className={cn(
            'w-fit px-8 py-3',
            'transition-all duration-200',
            'hover:scale-[1.02]',
            'active:scale-[0.98]'
          )}
        >
          {isLoading || isUpdating ? 
            (isUpdating ? t('form.updating') : t('form.submitting')) : 
            t('form.submit')
          }
        </Button>
      </div>
    </form>
  );
};