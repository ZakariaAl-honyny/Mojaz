import { z } from 'zod';

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

export type Step4FormValues = z.infer<typeof step4Schema>;
