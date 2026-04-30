import { z } from 'zod';
import { ServiceType } from '@/types/wizard.types';

export const step1Schema = z.object({
  serviceType: z.nativeEnum(ServiceType, {
    required_error: 'يرجى تحديد نوع الخدمة المطلوبة للمضي قدماً في إجراءات المعاملة السيادية.',
  }),
});

export type Step1FormValues = z.infer<typeof step1Schema>;