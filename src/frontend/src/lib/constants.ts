import { ServiceType } from '@/types/wizard.types';

export const APP_NAME = "مُجاز | Mojaz";
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  REGISTER: "/register",
  DASHBOARD: "/dashboard",
  APPLICATIONS: "/applications",
  APPOINTMENTS: "/appointments",
  PROFILE: "/profile",
};

export const ROLES = {
  APPLICANT: "Applicant",
  RECEPTIONIST: "Receptionist",
  DOCTOR: "Doctor",
  EXAMINER: "Examiner",
  MANAGER: "Manager",
  SECURITY: "Security",
  ADMIN: "Admin",
};

export const LOCALES = ["ar", "en"] as const;
export type Locale = (typeof LOCALES)[number];

// Wizard Query Keys for React Query
export const wizardQueryKeys = {
  existingDraft: ['applications', 'draft', 'check'] as const,
  licenseCategories: ['license-categories'] as const,
  examCenters: ['exam-centers'] as const,
  nationalities: ['lookups', 'nationalities'] as const,
  regions: ['lookups', 'regions'] as const,
};

export const SERVICES_CONFIG = [
  {
    type: ServiceType.NewLicense,
    titleKey: 'wizard.step1.newLicense.title',
    descriptionKey: 'wizard.step1.newLicense.description',
    icon: 'FilePlus',
    availableInMvp: true,
  },
  {
    type: ServiceType.Renewal,
    titleKey: 'wizard.step1.renewal.title',
    descriptionKey: 'wizard.step1.renewal.description',
    icon: 'RefreshCw',
    availableInMvp: true,
  },
  {
    type: ServiceType.Replacement,
    titleKey: 'wizard.step1.replacement.title',
    descriptionKey: 'wizard.step1.replacement.description',
    icon: 'Copy',
    availableInMvp: true,
  },
  {
    type: ServiceType.CategoryUpgrade,
    titleKey: 'wizard.step1.upgrade.title',
    descriptionKey: 'wizard.step1.upgrade.description',
    icon: 'TrendingUp',
    availableInMvp: true,
  },
  {
    type: ServiceType.TestRetake,
    titleKey: 'wizard.step1.retake.title',
    descriptionKey: 'wizard.step1.retake.description',
    icon: 'Repeat',
    availableInMvp: false,
  },
  {
    type: ServiceType.AppointmentBooking,
    titleKey: 'wizard.step1.appointment.title',
    descriptionKey: 'wizard.step1.appointment.description',
    icon: 'Calendar',
    availableInMvp: false,
  },
  {
    type: ServiceType.Cancellation,
    titleKey: 'wizard.step1.cancellation.title',
    descriptionKey: 'wizard.step1.cancellation.description',
    icon: 'XCircle',
    availableInMvp: false,
  },
  {
    type: ServiceType.DocumentDownload,
    titleKey: 'wizard.step1.download.title',
    descriptionKey: 'wizard.step1.download.description',
    icon: 'Download',
    availableInMvp: false,
    href: '/downloads',
  },
];
