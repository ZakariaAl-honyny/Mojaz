import { z } from 'zod';

export const step5Schema = z.object({
  declarationAccepted: z.boolean().refine(val => val === true, {
    message: 'يجب الإقرار بصحة البيانات المسجلة للمتابعة.',
  }),
});

export type Step5FormValues = z.infer<typeof step5Schema>;
