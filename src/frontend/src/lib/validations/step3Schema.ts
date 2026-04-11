import { z } from 'zod';

export const step3Schema = z.object({
  nationalId: z.string()
    .min(10, 'wizard.validation.step3.nationalIdMin')
    .max(20, 'wizard.validation.step3.nationalIdMax')
    .regex(/^[0-9]+$/, 'wizard.validation.step3.nationalIdFormat'),
  dateOfBirth: z.string()
    .refine((v) => !isNaN(Date.parse(v)), 'wizard.validation.step3.dobInvalid'),
  nationality: z.string().min(1, 'wizard.validation.step3.nationalityRequired'),
  gender: z.enum(['Male', 'Female'], {
    required_error: 'wizard.validation.step3.genderRequired',
  }),
  mobileNumber: z.string()
    .regex(/^\+?[0-9]{9,15}$/, 'wizard.validation.step3.mobileFormat'),
  email: z.string()
    .email('wizard.validation.step3.emailFormat')
    .optional()
    .or(z.literal('')),
  address: z.string()
    .min(5, 'wizard.validation.step3.addressMin'),
  city: z.string()
    .min(1, 'wizard.validation.step3.cityRequired'),
  region: z.string()
    .min(1, 'wizard.validation.step3.regionRequired'),
});

export type Step3FormValues = z.infer<typeof step3Schema>;