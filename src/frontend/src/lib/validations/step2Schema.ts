import { z } from 'zod';

// Calculate age from date of birth
export function calculateAge(dateOfBirth: string): number {
  const today = new Date();
  const birthDate = new Date(dateOfBirth);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
}

// Create schema with age validation - accepts string codes from API ("A", "B", etc.)
export const createStep2Schema = (
  dateOfBirth: string | undefined,
  minAgeMap: Record<string, number>
) =>
  z.object({
    categoryCode: z.string().min(1, 'wizard.validation.step2.categoryRequired'),
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

export type Step2FormValues = z.infer<ReturnType<typeof createStep2Schema>>;
