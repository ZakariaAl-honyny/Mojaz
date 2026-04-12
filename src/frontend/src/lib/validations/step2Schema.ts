import { z } from 'zod';
import { LicenseCategoryCode } from '@/types/wizard.types';

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

// Create schema with age validation
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

export type Step2FormValues = z.infer<ReturnType<typeof createStep2Schema>>;
