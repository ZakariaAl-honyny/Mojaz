export enum TrainingStatus {
  Required = 0,
  InProgress = 1,
  Completed = 2,
  ExemptionPending = 3,
}

export type TrainingStatusString = 'Required' | 'InProgress' | 'Completed' | 'ExemptionPending' | 'Exempted';

export interface TrainingRecordDto {
  id: string;
  applicationId: string;
  schoolName: string;
  centerName?: string;
  trainerName?: string;
  certificateNumber?: string;
  completedHours: number;
  totalHoursRequired: number;
  progressPercentage: number;
  trainingStatus: TrainingStatus;
  trainingDate?: string;
  isExempted: boolean;
  exemptionReason?: string;
  exemptionApprovedBy?: string;
  exemptionApprovedAt?: string;
  exemptionRejectionReason?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface CreateTrainingRecordRequest {
  applicationId: string;
  schoolName: string;
  certificateNumber?: string;
  hoursCompleted: number;
  trainingDate: string;
  trainerName?: string;
  centerName?: string;
  notes?: string;
}

export interface UpdateTrainingHoursRequest {
  hoursToAdd: number;
  notes?: string;
}

export interface CreateExemptionRequest {
  applicationId: string;
  exemptionReason: string;
  exemptionDocumentId: string;
}

export interface ExemptionActionRequest {
  actionBy: string;
  notes: string;
}
