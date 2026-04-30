export interface Gate4Condition {
  key: string;
  labelAr: string;
  labelEn: string;
  isPassed: boolean;
  failureMessageAr?: string;
  failureMessageEn?: string;
}

export interface Gate4ValidationResult {
  applicationId: number;
  isFullyPassed: boolean;
  conditions: Gate4Condition[];
}

export interface FinalizeApplicationRequest {
  decision: FinalDecisionType;
  reason?: string;
  returnToStage?: string;
  managerNotes?: string;
}

export enum FinalDecisionType {
  Approved = "Approved",
  Rejected = "Rejected",
  Returned = "Returned"
}

export interface ApplicationDecision {
  applicationId: number;
  applicationNumber: string;
  newStatus: string;
  decision: FinalDecisionType;
  decisionAt: string;
  decisionBy: number;
  gate4Result: Gate4ValidationResult;
}