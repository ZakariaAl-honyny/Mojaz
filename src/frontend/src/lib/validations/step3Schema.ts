import { z } from 'zod';
import { Gender } from '@/lib/enums';

// Gender uses numeric enum matching backend: 0=NotSpecified, 1=Male, 2=Female
export const step3Schema = z.object({
  nationalId: z.string()
    .min(10, 'رقم الهوية الوطنية/الإقامة قصير جداً.')
    .max(20, 'رقم الهوية الوطنية/الإقامة طويل جداً.')
    .regex(/^[0-9]+$/, 'يرجى إدخال أرقام فقط في خانة الهوية.'),
  dateOfBirth: z.string()
    .refine((v) => !isNaN(Date.parse(v)), 'تاريخ الميلاد غير صحيح.'),
  nationality: z.string().min(1, 'يرجى تحديد الجنسية.'),
  gender: z.number().min(0).max(2, 'تحديد الجنس غير صالح.'),
  mobileNumber: z.string()
    .regex(/^\+?[0-9]{9,15}$/, 'رقم الهاتف غير صحيح (يرجى إدخال رقم هاتف صالح).'),
  email: z.string()
    .email('البريد الإلكتروني غير صحيح.')
    .optional()
    .or(z.literal('')),
  address: z.string()
    .min(5, 'يجب أن يكون العنوان مفصلاً (٥ أحرف على الأقل).'),
  city: z.string()
    .min(1, 'يرجى تحديد المدينة.'),
  region: z.string()
    .min(1, 'يرجى تحديد المحافظة.'),
});

export type Step3FormValues = z.infer<typeof step3Schema>;