import { z } from 'zod';

export const step4Schema = z.object({
  applicantType: z.enum(['Citizen', 'Resident']),
  preferredCenterId: z.number().min(1, 'يرجى تحديد مركز الفحص المفضل من القائمة.'),
  testLanguage: z.enum(['ar', 'en']),
  appointmentPreference: z.enum(['Morning', 'Afternoon', 'Evening', 'NoPreference']),
  specialNeedsDeclaration: z.boolean(),
  specialNeedsNote: z.string().max(500, 'لا يمكن تجاوز ٥٠٠ حرف في الوصف.').optional(),
  identityDocument: z.instanceof(File).optional().nullable(),
  medicalDocument: z.instanceof(File).optional().nullable(),
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
