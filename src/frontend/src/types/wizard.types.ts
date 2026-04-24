import { z } from 'zod';
import { ServiceType, LicenseCategoryCode } from '@/lib/enums';

// Re-export for convenience
export { ServiceType, LicenseCategoryCode };

// Gender numeric enum (matches backend: NotSpecified=0, Male=1, Female=2)
export enum Gender {
  NotSpecified = 0,
  Male = 1,
  Female = 2
}

// Display labels for enums (separate from API values)
export const ServiceTypeLabels = {
  [ServiceType.NewLicense]: { ar: 'رخصة جديدة', en: 'New License' },
  [ServiceType.Renewal]: { ar: 'تجديد رخصة', en: 'Renewal' },
  [ServiceType.Replacement]: { ar: 'استبدال رخصة', en: 'Replacement' },
  [ServiceType.CategoryUpgrade]: { ar: 'ترقية فئة', en: 'Category Upgrade' },
  [ServiceType.InternationalLicense]: { ar: 'رخصة دولية', en: 'International License' },
  [ServiceType.StatusChange]: { ar: 'تغيير الحالة', en: 'Status Change' },
  [ServiceType.MedicalExtension]: { ar: 'تمديد طبي', en: 'Medical Extension' },
  [ServiceType.TemporaryLicense]: { ar: 'رخصة مؤقتة', en: 'Temporary License' },
} as const;

export const LicenseCategoryLabels = {
  [LicenseCategoryCode.A]: { ar: 'دراجة ناري��', en: 'Motorcycle' },
  [LicenseCategoryCode.B]: { ar: 'سيارة خاصة', en: 'Private Car' },
  [LicenseCategoryCode.C]: { ar: 'شاحنة خفيفة', en: 'Light Truck' },
  [LicenseCategoryCode.D]: { ar: 'حافلة', en: 'Bus' },
  [LicenseCategoryCode.E]: { ar: 'شاحنة ثقيلة', en: 'Heavy Truck' },
  [LicenseCategoryCode.F]: { ar: 'مركبة خاصة', en: 'Special Vehicle' },
} as const;

export const GenderLabels = {
  [Gender.NotSpecified]: { ar: 'غير محدد', en: 'Not Specified' },
  [Gender.Male]: { ar: 'ذكر', en: 'Male' },
  [Gender.Female]: { ar: 'أنثى', en: 'Female' },
} as const;

export type StepId = 1 | 2 | 3 | 4 | 5;

export interface Step1Data {
  serviceType: ServiceType | null;
}

export interface Step2Data {
  categoryCode: string | null; // Backend returns "A", "B", etc. as strings
}

export interface Step3Data {
  nationalId: string;
  dateOfBirth: string;
  nationality: string;
  gender: Gender;
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
  id: string;
  code: string; // Backend returns "A", "B", etc. - convert to number using licenseCategoryToNumber
  nameAr: string;
  nameEn: string;
  descriptionAr?: string;
  descriptionEn?: string;
  minAge: number;
  icon?: string;
  validityYears?: number;
  upgradeFrom?: string;
}

export interface ExamCenter {
  id: string;
  nameAr: string;
  nameEn: string;
  city: string;
  region: string;
  address?: string;
  phoneNumber?: string;
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

  // Declaration
  declarationAccepted: boolean;

  // Actions
  setStep1: (data: Step1Data) => void;
  setStep2: (data: Step2Data) => void;
  setStep3: (data: Step3Data) => void;
  setStep4: (data: Step4Data) => void;
  setDeclaration: (accepted: boolean) => void;
  goTo: (step: StepId) => void;
  markCompleted: (step: StepId) => void;
  setApplicationId: (id: string) => void;
  setLastSavedAt: (date: Date) => void;
  setSaving: (saving: boolean) => void;
  incrementSaveFailures: () => void;
  resetSaveFailures: () => void;
  resetWizard: () => void;
  loadFromApi: (data: {
    serviceType?: number | null;
    licenseCategoryCode?: number | string | null;
    nationalId?: string | null;
    dateOfBirth?: string | null;
    nationality?: string | null;
    gender?: number | string | null;
    mobileNumber?: string | null;
    email?: string | null;
    address?: string | null;
    city?: string | null;
    region?: string | null;
    applicantType?: string | null;
    preferredCenterId?: string | null;
    testLanguage?: string | null;
    appointmentPreference?: string | null;
    specialNeedsDeclaration?: boolean | null;
    specialNeedsNote?: string | null;
  }) => void;
}