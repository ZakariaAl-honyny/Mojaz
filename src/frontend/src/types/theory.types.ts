import { ApiResponse, PaginatedResult } from './api.types';

export type TestResultType = 'Pass' | 'Fail' | 'Absent';

export interface TheoryTestDto {
  id: number;
  applicationId: number;
  attemptNumber: number;
  score: number | null;
  passingScore: number;
  result: TestResultType;
  isPassed: boolean;
  isAbsent: boolean;
  conductedAt: string;
  examinerId: number;
  examinerName?: string;
  notes?: string;
  retakeEligibleAfter?: string;
  applicationStatus?: string;
}

export interface SubmitTheoryResultRequest {
  score?: number;
  isAbsent: boolean;
  notes?: string;
}

export type TheoryHistoryResponse = ApiResponse<PaginatedResult<TheoryTestDto>>;
export type SubmitTheoryResultResponse = ApiResponse<TheoryTestDto>;