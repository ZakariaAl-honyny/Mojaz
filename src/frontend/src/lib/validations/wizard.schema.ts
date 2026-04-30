import { z } from 'zod';
import { ServiceType, LicenseCategoryCode, Gender } from '@/lib/enums';

// Helper to calculate age from DOB string (YYYY-MM-DD)
export const calculateAge = (dob: string) => {
  const birthDate = new Date(dob);
  if (isNaN(birthDate.getTime())) return 0;
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
};

export const step1Schema = z.object({
  serviceType: z.nativeEnum(ServiceType, {
    required_error: 'يرجى تحديد نوع الخدمة المطلوبة للمضي قدماً في إجراءات المعاملة السيادية.',
  }),
});

export const createStep2Schema = (
  dateOfBirth: string | undefined,
  minAgeMap: Record<string, number>
) =>
  z.object({
    categoryCode: z.string().min(1, 'يرجى تحديد فئة الرخصة المستهدفة للمتابعة في إجراءات المعاملة.'),
  }).superRefine((data, ctx) => {
    if (!dateOfBirth || !data.categoryCode) return;
    const age = calculateAge(dateOfBirth);
    const minAge = minAgeMap[data.categoryCode] ?? 999;
    if (age < minAge) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['categoryCode'],
        message: `AGE_ERROR:${minAge}`, // Use a prefix to handle dynamic value in component
      });
    }
  });

// Gender uses string type matching backend: 'NotSpecified', 'Male', 'Female'
export const step3Schema = z.object({
  nationalId: z.string().min(10, 'رقم الهوية الوطنية/الإقامة قصير جداً.').max(20, 'رقم الهوية الوطنية/الإقامة طويل جداً.').regex(/^[0-9]+$/, 'يرجى إدخال أرقام فقط في خانة الهوية.'),
  dateOfBirth: z.string().refine(v => !isNaN(Date.parse(v)), 'تاريخ الميلاد غير صحيح.'),
  nationality: z.string().min(1, 'يرجى تحديد الجنسية.'),
  gender: z.enum(['NotSpecified', 'Male', 'Female'], {
    required_error: 'يرجى تحديد الجنس.',
    invalid_type_error: 'تعديل الجنس غير صالح.',
  }),
  mobileNumber: z.string().regex(/^\+?[0-9]{9,15}$/, 'رقم الهاتف غير صحيح (يرجى إدخال رقم هاتف صالح).'),
  email: z.string().email('البريد الإلكتروني غير صحيح.').optional().or(z.literal('')),
  address: z.string().min(5, 'يجب أن يكون العنوان مفصلاً (٥ أحرف على الأقل).'),
  city: z.string().min(1, 'يرجى تحديد المدينة.'),
  region: z.string().min(1, 'يرجى تحديد المحافظة.'),
});

export const step4Schema = z.object({
  applicantType: z.enum(['Citizen', 'Resident']),
  preferredCenterId: z.number().min(1, 'يرجى تحديد مركز الفحص المفضل من القائمة.'),
  testLanguage: z.enum(['ar', 'en']),
  appointmentPreference: z.enum(['Morning', 'Afternoon', 'Evening', 'NoPreference']),
  specialNeedsDeclaration: z.boolean(),
  specialNeedsNote: z.string().max(500, 'لا يمكن تجاوز ٥٠٠ حرف في الوصف.').optional(),
}).superRefine((data, ctx) => {
  if (data.specialNeedsDeclaration && !data.specialNeedsNote?.trim()) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['specialNeedsNote'],
      message: 'يرجى توضيح طبيعة الاحتياجات الخاصة لاتخاذ التدابير اللازمة.',
    });
  }
});

export const step5Schema = z.object({
  declarationAccepted: z.literal(true, {
    errorMap: () => ({ message: 'يجب الإقرار بصحة البيانات المسجلة للمتابعة.' }),
  }),
});

export type Step1FormValues = z.infer<typeof step1Schema>;
export type Step3FormValues = z.infer<typeof step3Schema>;
export type Step4FormValues = z.infer<typeof step4Schema>;
export type Step5FormValues = z.infer<typeof step5Schema>;
export const step2BaseSchema = z.object({
  categoryCode: z.string(),
});
export type Step2FormValues = z.infer<typeof step2BaseSchema>;