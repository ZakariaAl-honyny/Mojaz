import { TestResult } from './auth.types'; // Assuming TestResult is shared or defined here

export interface PracticalTestDto {
  id: string;
  applicationId: string;
  examinerId: string;
  examinerName?: string;
  attemptNumber: number;
  conductedAt: string;
  score?: number;
  passingScore: number;
  isAbsent: boolean;
  result: 'Pass' | 'Fail' | 'Absent';
  notes?: string;
  vehicleUsed?: string;
  requiresAdditionalTraining: boolean;
  additionalHoursRequired?: number;
}

export interface SubmitPracticalResultRequest {
  score?: number;
  isAbsent: boolean;
  notes?: string;
  vehicleUsed?: string;
  requiresAdditionalTraining?: boolean;
  additionalHoursRequired?: number;
}
