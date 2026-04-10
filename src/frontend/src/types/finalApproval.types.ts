export interface Gate4Condition {
  key: string;
  labelAr: string;
  labelEn: string;
  isPassed: boolean;
  failureMessageAr?: string;
  failureMessageEn?: string;
}

export interface Gate4ValidationResult {
  applicationId: string;
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
  applicationId: string;
  applicationNumber: string;
  newStatus: string;
  decision: FinalDecisionType;
  decisionAt: string;
  decisionBy: string;
  gate4Result: Gate4ValidationResult;
}