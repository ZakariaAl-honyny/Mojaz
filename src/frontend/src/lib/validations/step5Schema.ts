import { z } from 'zod';

export const step5Schema = z.object({
  declarationAccepted: z.boolean().refine(val => val === true, {
    message: 'wizard.validation.step5.declarationRequired',
  }),
});

export type Step5FormValues = z.infer<typeof step5Schema>;
