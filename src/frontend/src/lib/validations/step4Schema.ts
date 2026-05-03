import { z } from 'zod';

export const step4Schema = z.object({
  applicantType: z.enum(['Citizen', 'Resident'], {
    invalid_type_error: 'يرجى اختيار صفة المتقدم.',
    required_error: 'هذا الحقل مطلوب.',
  }),
  preferredCenterId: z.string({
    invalid_type_error: 'يرجى اختيار مركز الفحص من القائمة.',
    required_error: 'يرجى اختيار مركز الفحص من القائمة.',
  }).min(1, 'يرجى تحديد مركز الفحص المفضل من القائمة.'),
  testLanguage: z.enum(['ar', 'en'], {
    invalid_type_error: 'يرجى اختيار لغة الاختبار.',
    required_error: 'هذا الحقل مطلوب.',
  }),
  appointmentPreference: z.enum(['Morning', 'Afternoon', 'Evening', 'NoPreference'], {
    invalid_type_error: 'يرجى اختيار الفترة الزمنية المفضلة.',
    required_error: 'هذا الحقل مطلوب.',
  }),
  specialNeedsDeclaration: z.boolean(),
  specialNeedsNote: z.string().max(500, 'لا يمكن تجاوز ٥٠٠ حرف في الوصف.').optional(),
  identityDocument: z.any().optional().nullable(),
  medicalDocument: z.any().optional().nullable(),
}).superRefine((data, ctx) => {
  if (data.specialNeedsDeclaration && !data.specialNeedsNote?.trim()) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['specialNeedsNote'],
      message: 'يرجى توضيح طبيعة الاحتياجات الخاصة لاتخاذ التدابير اللازمة.',
    });
  }
});

export type Step4FormValues = z.infer<typeof step4Schema>;
