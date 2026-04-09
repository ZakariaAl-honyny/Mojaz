import { z } from 'zod';

export const submitPracticalResultSchema = z.object({
  score: z.number().min(0).max(100).optional(),
  isAbsent: z.boolean(),
  notes: z.string().max(1000).optional(),
  examinerNotes: z.string().max(1000).optional(),
  vehicleUsed: z.string().optional(),
  requiresAdditionalTraining: z.boolean().default(false),
  additionalHoursRequired: z.number().min(1).max(100).optional(),
  needsManualTransmissionEndorsement: z.boolean().default(false),
}).refine(data => data.isAbsent || (data.score !== undefined && data.score !== null), {
  message: "Score is required when applicant is not absent",
  path: ["score"],
});

export type SubmitPracticalResultFormValues = z.infer<typeof submitPracticalResultSchema>;
