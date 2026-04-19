import { z } from 'zod';

export enum ServiceType {
  NewLicense = 'NewLicense',
  Renewal = 'Renewal',
  Replacement = 'Replacement',
  CategoryUpgrade = 'CategoryUpgrade',
  TestRetake = 'TestRetake',
  AppointmentBooking = 'AppointmentBooking',
  Cancellation = 'Cancellation',
  DocumentDownload = 'DocumentDownload',
  ExperienceCertificate = 'ExperienceCertificate',
}

export enum LicenseCategoryCode {
  A = 'A',
  B = 'B',
  C = 'C',
  D = 'D',
  E = 'E',
  F = 'F',
}

export type StepId = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

export interface DocumentData {
  id: string;
  type: string;
  name: string;
  size: number;
  url: string;
  status: 'Uploading' | 'Completed' | 'Failed';
}

export interface Step5Data {
  documents: DocumentData[];
}

export interface Step1Data {
  serviceType: ServiceType | null;
}

export interface Step2Data {
  categoryCode: LicenseCategoryCode | null;
}

export interface Step3Data {
  nationalId: string;
  dateOfBirth: string;
  nationality: string;
  gender: 'Male' | 'Female';
  mobileNumber: string;
  email: string;
  address: string;
  city: string;
  region: string;
}

export interface Step4Data {
  applicantType: 'Citizen' | 'Resident';
  preferredCenterId: string;
  testLanguage: 'ar' | 'en';
  appointmentPreference: 'Morning' | 'Afternoon' | 'Evening' | 'NoPreference';
  specialNeedsDeclaration: boolean;
  specialNeedsNote?: string;
}

export interface LicenseCategoryOption {
  code: LicenseCategoryCode;
  nameAr: string;
  nameEn: string;
  descriptionAr: string;
  descriptionEn: string;
  minAge: number;
  icon: string;
  validityYears: number;
  upgradeFrom?: LicenseCategoryCode;
}

export interface ExamCenter {
  id: string;
  nameAr: string;
  nameEn: string;
  city: string;
  region: string;
  isActive: boolean;
}

export interface ServiceCardConfig {
  type: ServiceType;
  titleKey: string;
  descriptionKey: string;
  icon: string;
  availableInMvp: boolean;
  href?: string;
}

export interface WizardState {
  // Application identity
  applicationId: string | null;
  currentStep: StepId;
  completedSteps: StepId[];
  lastSavedAt: Date | null;
  consecutiveSaveFailures: number;
  isSaving: boolean;

  // Step data
  step1: Step1Data;
  step2: Step2Data;
  step3: Step3Data;
  step4: Step4Data;
  step5: Step5Data;

  // Service flows
  medicalVerified: boolean;
  theoryTestPassed: boolean;
  theoryTestScore: number | null;

  // Declaration
  declarationAccepted: boolean;

  // Actions
  setStep1: (data: Partial<Step1Data>) => void;
  setStep2: (data: Partial<Step2Data>) => void;
  setStep3: (data: Partial<Step3Data>) => void;
  setStep4: (data: Partial<Step4Data>) => void;
  setStep5: (data: Partial<Step5Data>) => void;
  setDeclaration: (accepted: boolean) => void;
  setMedicalVerified: (verified: boolean) => void;
  setTheoryTestResult: (passed: boolean, score: number) => void;
  goTo: (step: StepId) => void;
  markCompleted: (step: StepId) => void;
  setApplicationId: (id: string) => void;
  setLastSavedAt: (date: Date) => void;
  setSaving: (saving: boolean) => void;
  incrementSaveFailures: () => void;
  resetSaveFailures: () => void;
  resetWizard: () => void;
}