export enum TrainingStatus {
  Required = 0,
  InProgress = 1,
  Completed = 2,
  ExemptionPending = 3,
}

export type TrainingStatusString = 'Required' | 'InProgress' | 'Completed' | 'ExemptionPending' | 'Exempted';

export interface TrainingRecordDto {
  id: number;
  applicationId: number;
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
  exemptionApprovedBy?: number;
  exemptionApprovedAt?: string;
  exemptionRejectionReason?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface CreateTrainingRecordRequest {
  applicationId: number;
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
  applicationId: number;
  exemptionReason: string;
  exemptionDocumentId: number;
}

export interface ExemptionActionRequest {
  actionBy: number;
  notes: string;
}

export interface PendingExemptionDto {
  id: number;
  applicationId: number;
  applicationNumber: string;
  applicantName: string;
  exemptionReason: string;
  documentId: number;
  submittedAt: string;
  status: TrainingStatus;
}
