import { ServiceType } from '@/types/wizard.types';

export const APP_NAME = "نظام إصدار رخص القيادة الإلكتروني - مُجاز";
export const INSTITUTION_NAME = "الإدارة العامة للمرور - محافظة صنعاء";
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5013/api/v1";

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

// Wizard Query Keys for React Query
export const wizardQueryKeys = {
  existingDraft: ['applications', 'draft', 'check'] as const,
  licenseCategories: ['license-categories'] as const,
  examCenters: ['exam-centers'] as const,
  nationalities: ['lookups', 'nationalities'] as const,
  regions: ['lookups', 'regions'] as const,
};

// Institutional Color Tokens - Royal King Blue
export const PRIMARY_COLOR = '#1a3a8f'; 
export const SECONDARY_COLOR = '#D4A017'; 

// Services config - matches backend ServiceType enum (numeric values 0-7)
// Note: Future services (8+) are not yet defined in backend and marked as unavailable
export const SERVICES_CONFIG = [
  {
    type: ServiceType.NewLicense,
    title: 'إصدار رخصة قيادة جديدة',
    description: 'بدء إجراءات الحصول على رخصة قيادة لأول مرة (خصوصي، نقل، دراجة).',
    icon: 'FilePlus',
    availableInMvp: true,
  },
  {
    type: ServiceType.Renewal,
    title: 'تجديد رخصة القيادة',
    description: 'تجديد صلاحية رخصة القيادة المنتهية أو التي قاربت على الانتهاء.',
    icon: 'RefreshCw',
    availableInMvp: true,
  },
  {
    type: ServiceType.Replacement,
    title: 'بدل فاقد أو تالف',
    description: 'إصدار رخصة بديلة في حال فقدان أو تلف الرخصة الحالية.',
    icon: 'Copy',
    availableInMvp: true,
  },
  {
    type: ServiceType.CategoryUpgrade,
    title: 'ترقية فئة الرخصة',
    description: 'إضافة فئات جديدة إلى رخصتك الحالية (مثلاً من خصوصي إلى نقل).',
    icon: 'TrendingUp',
    availableInMvp: true,
  },
  {
    type: ServiceType.InternationalLicense,
    title: 'رخصة قيادة دولية',
    description: 'إصدار رخصة قيادة دولية للت السفر الدولي.',
    icon: 'Globe',
    availableInMvp: true,
  },
  {
    type: ServiceType.StatusChange,
    title: 'تغيير حالة الرخصة',
    description: 'تغيير حالة الرخصة (تعليق، إلغاء، استئناف).',
    icon: 'RefreshCw',
    availableInMvp: true,
  },
  {
    type: ServiceType.MedicalExtension,
    title: 'تمديد طبي',
    description: 'تمديد صلاحية الرخصة بناءً على تقرير طبي جديد.',
    icon: 'Plus',
    availableInMvp: true,
  },
  {
    type: ServiceType.TemporaryLicense,
    title: 'رخصة مؤقتة',
    description: 'إصدار رخصة قيادة مؤقتة لفترة محددة.',
    icon: 'Clock',
    availableInMvp: true,
  },
];