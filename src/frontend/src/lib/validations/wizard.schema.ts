import { z } from 'zod';
import { ServiceType, LicenseCategoryCode } from '@/types/wizard.types';

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
    required_error: 'wizard.validation.step1.serviceRequired',
  }),
});

export const createStep2Schema = (
  dateOfBirth: string | undefined,
  minAgeMap: Record<LicenseCategoryCode, number>
) =>
  z.object({
    categoryCode: z.nativeEnum(LicenseCategoryCode, {
      required_error: 'wizard.validation.step2.categoryRequired',
    }),
  }).superRefine((data, ctx) => {
    if (!dateOfBirth || !data.categoryCode) return;
    const age = calculateAge(dateOfBirth);
    const minAge = minAgeMap[data.categoryCode] ?? 999;
    if (age < minAge) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['categoryCode'],
        message: `wizard.validation.step2.ageError:${minAge}`,
      });
    }
  });

export const step3Schema = z.object({
  nationalId: z.string().min(10).max(20).regex(/^[0-9]+$/, 'wizard.validation.step3.nationalIdFormat'),
  dateOfBirth: z.string().refine(v => !isNaN(Date.parse(v)), 'wizard.validation.step3.dobInvalid'),
  nationality: z.string().min(1, 'wizard.validation.step3.nationalityRequired'),
  gender: z.enum(['Male', 'Female'], { required_error: 'wizard.validation.step3.genderRequired' }),
  mobileNumber: z.string().regex(/^\+?[0-9]{9,15}$/, 'wizard.validation.step3.mobileFormat'),
  email: z.string().email('wizard.validation.step3.emailFormat').optional().or(z.literal('')),
  address: z.string().min(5, 'wizard.validation.step3.addressMin'),
  city: z.string().min(1, 'wizard.validation.step3.cityRequired'),
  region: z.string().min(1, 'wizard.validation.step3.regionRequired'),
});

export const step4Schema = z.object({
  applicantType: z.enum(['Citizen', 'Resident']),
  preferredCenterId: z.string().uuid('wizard.validation.step4.centerRequired'),
  testLanguage: z.enum(['ar', 'en']),
  appointmentPreference: z.enum(['Morning', 'Afternoon', 'Evening', 'NoPreference']),
  specialNeedsDeclaration: z.boolean(),
  specialNeedsNote: z.string().max(500).optional(),
}).superRefine((data, ctx) => {
  if (data.specialNeedsDeclaration && !data.specialNeedsNote?.trim()) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['specialNeedsNote'],
      message: 'wizard.validation.step4.specialNeedsNoteRequired',
    });
  }
});

export const step5Schema = z.object({
  declarationAccepted: z.literal(true, {
    errorMap: () => ({ message: 'wizard.validation.step5.declarationRequired' }),
  }),
});

export type Step1FormValues = z.infer<typeof step1Schema>;
export type Step3FormValues = z.infer<typeof step3Schema>;
export type Step4FormValues = z.infer<typeof step4Schema>;
export type Step5FormValues = z.infer<typeof step5Schema>;
export const step2BaseSchema = z.object({
  categoryCode: z.nativeEnum(LicenseCategoryCode),
});
export type Step2FormValues = z.infer<typeof step2BaseSchema>;
