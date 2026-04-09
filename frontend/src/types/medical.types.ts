import { z } from 'zod';

export enum FitnessResult {
  Fit = 'Fit',
  Unfit = 'Unfit',
  ConditionallyFit = 'ConditionallyFit'
}

export enum BloodType {
  A_POSITIVE = 'A_POSITIVE',
  A_NEGATIVE = 'A_NEGATIVE',
  B_POSITIVE = 'B_POSITIVE',
  B_NEGATIVE = 'B_NEGATIVE',
  AB_POSITIVE = 'AB_POSITIVE',
  AB_NEGATIVE = 'AB_NEGATIVE',
  O_POSITIVE = 'O_POSITIVE',
  O_NEGATIVE = 'O_NEGATIVE'
}

export interface MedicalResultDto {
  id: string;
  applicationId: string;
  doctorId: string;
  examinedAt: string;
  result: FitnessResult; // Note: Frontend might use 'result' while backend uses 'FitnessResult'
  bloodType: string | null;
  notes: string | null;
  visionTestResult: string | null;
  colorBlindTestResult: string | null;
  bloodPressureNormal: boolean | null;
  updatedAt: string;
}

export interface CreateMedicalResultRequest {
  applicationId: string;
  appointmentId: string;
  result: FitnessResult;
  bloodType: string | null;
  notes: string | null;
  visionTestResult: string | null;
  colorBlindTestResult: string | null;
  bloodPressureNormal: boolean | null;
}

export const createMedicalResultSchema = z.object({
  applicationId: z.string().uuid(),
  appointmentId: z.string().uuid(),
  result: z.nativeEnum(FitnessResult),
  bloodType: z.string().nullable(),
  notes: z.string().max(1000).nullable(),
  visionTestResult: z.string().max(255).nullable(),
  colorBlindTestResult: z.string().max(255).nullable(),
  bloodPressureNormal: z.boolean().nullable(),
});

export const medicalResultDtoSchema = z.object({
  id: z.string().uuid(),
  applicationId: z.string().uuid(),
  doctorId: z.string().uuid(),
  examinedAt: z.string(),
  result: z.nativeEnum(FitnessResult),
  bloodType: z.string().nullable(),
  notes: z.string().max(1000).nullable(),
  visionTestResult: z.string().max(255).nullable(),
  colorBlindTestResult: z.string().max(255).nullable(),
  bloodPressureNormal: z.boolean().nullable(),
  updatedAt: z.string(),
});
