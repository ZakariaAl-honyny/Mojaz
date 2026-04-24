import { 
  ApplicationStatus, 
  ServiceType, 
  FeeType, 
  PaymentStatus, 
  TestResult, 
  MedicalFitnessResult,
  AppointmentType,
  LicenseStatus,
  DocumentStatus,
  UserRole,
  AppointmentStatus,
  ApplicantType
} from './enums';

// ============================================================
// Application Status Labels - الحالة
// ============================================================
export const ApplicationStatusLabels: Record<ApplicationStatus, string> = {
  [ApplicationStatus.Draft]: "مسودة",
  [ApplicationStatus.Submitted]: "مقدّم",
  [ApplicationStatus.DocumentReview]: "مراجعة الوثائق",
  [ApplicationStatus.InReview]: "قيد المراجعة",
  [ApplicationStatus.MedicalExam]: "الفحص الطبي",
  [ApplicationStatus.Training]: "التدريب",
  [ApplicationStatus.TheoryTest]: "الاختبار النظري",
  [ApplicationStatus.PracticalTest]: "الاختبار العملي",
  [ApplicationStatus.Approved]: "مقبول",
  [ApplicationStatus.Payment]: "الدفع",
  [ApplicationStatus.Issued]: "صادر",
  [ApplicationStatus.Active]: "نشط",
  [ApplicationStatus.Rejected]: "مرفوض",
  [ApplicationStatus.Cancelled]: "ملغى",
  [ApplicationStatus.Expired]: "منتهي"
};

// ============================================================
// Service Type Labels - نوع الخدمة
// ============================================================
export const ServiceTypeLabels: Record<ServiceType, string> = {
  [ServiceType.NewLicense]: "رخصة جديدة",
  [ServiceType.Renewal]: "تجديد رخصة",
  [ServiceType.Replacement]: "بدل رخصة",
  [ServiceType.CategoryUpgrade]: "ترقية فئة",
  [ServiceType.InternationalLicense]: "رخصة دولية",
  [ServiceType.StatusChange]: "تغيير حالة",
  [ServiceType.MedicalExtension]: "تمديد طبي",
  [ServiceType.TemporaryLicense]: "رخصة مؤقتة"
};

// ============================================================
// Fee Type Labels - نوع الرسوم
// ============================================================
export const FeeTypeLabels: Record<FeeType, string> = {
  [FeeType.ApplicationFee]: "رسوم التقديم",
  [FeeType.MedicalExamFee]: "رسوم الفحص الطبي",
  [FeeType.TheoryTestFee]: "رسوم الاختبار النظري",
  [FeeType.PracticalTestFee]: "رسوم الاختبار العملي",
  [FeeType.IssuanceFee]: "رسوم الإصدار",
  [FeeType.RetakeFee]: "رسوم إعادة الاختبار",
  [FeeType.RenewalFee]: "رسوم التجديد",
  [FeeType.ReplacementFee]: "رسوم البدل",
  [FeeType.CategoryUpgrade]: "رسوم ترقية الفئة"
};

// ============================================================
// Payment Status Labels - حالة الدفع
// ============================================================
export const PaymentStatusLabels: Record<PaymentStatus, string> = {
  [PaymentStatus.Pending]: "قيد الانتظار",
  [PaymentStatus.Paid]: "مدفوع",
  [PaymentStatus.Failed]: "فشل",
  [PaymentStatus.Refunded]: "مسترد"
};

// ============================================================
// Test Result Labels - نتيجة الاختبار
// ============================================================
export const TestResultLabels: Record<TestResult, string> = {
  [TestResult.Pass]: "ناجح",
  [TestResult.Fail]: "راسب",
  [TestResult.Absent]: "غائب"
};

// ============================================================
// Medical Fitness Result Labels - نتيجة اللياقة الطبية
// ============================================================
export const MedicalFitnessResultLabels: Record<MedicalFitnessResult, string> = {
  [MedicalFitnessResult.Fit]: "لائق",
  [MedicalFitnessResult.Unfit]: "غير لائق",
  [MedicalFitnessResult.ConditionallyFit]: "لائق بشروط"
};

// ============================================================
// Appointment Type Labels - نوع الموعد
// ============================================================
export const AppointmentTypeLabels: Record<AppointmentType, string> = {
  [AppointmentType.MedicalExam]: "كشف طبي",
  [AppointmentType.TheoryTest]: "اختبار نظري",
  [AppointmentType.PracticalTest]: "اختبار عملي"
};

// ============================================================
// License Status Labels - حالة الرخصة
// ============================================================
export const LicenseStatusLabels: Record<LicenseStatus, string> = {
  [LicenseStatus.Active]: "نشطة",
  [LicenseStatus.Expired]: "منتهية",
  [LicenseStatus.Suspended]: "معلقة",
  [LicenseStatus.Revoked]: "ملغاة",
  [LicenseStatus.Replaced]: "بديلة",
  [LicenseStatus.Renewed]: "مجددة",
  [LicenseStatus.Superseded]: "مستبدلة"
};

// ============================================================
// Document Status Labels - حالة الوثيقة
// ============================================================
export const DocumentStatusLabels: Record<DocumentStatus, string> = {
  [DocumentStatus.Pending]: "قيد الانتظار",
  [DocumentStatus.Approved]: "موافق عليها",
  [DocumentStatus.Rejected]: "مرفوضة"
};

// ============================================================
// User Role Labels - الدور
// ============================================================
export const UserRoleLabels: Record<UserRole, string> = {
  [UserRole.Applicant]: "متقدم",
  [UserRole.Receptionist]: "موظف الاستقبال",
  [UserRole.Doctor]: "طبيب",
  [UserRole.Examiner]: "مفتش",
  [UserRole.Manager]: "مدير",
  [UserRole.Security]: "أمن",
  [UserRole.Admin]: "مدير النظام"
};

// ============================================================
// Appointment Status Labels - حالة الموعد
// ============================================================
export const AppointmentStatusLabels: Record<AppointmentStatus, string> = {
  [AppointmentStatus.Scheduled]: "مجدول",
  [AppointmentStatus.Completed]: "مكتمل",
  [AppointmentStatus.Cancelled]: "ملغى",
  [AppointmentStatus.NoShow]: "لم يحضر"
};

// ============================================================
// Applicant Type Labels - نوع مقدم الطلب
// ============================================================
export const ApplicantTypeLabels: Record<ApplicantType, string> = {
  [ApplicantType.Private]: "خصوصي",
  [ApplicantType.Public]: "عمومي",
  [ApplicantType.Motorcycle]: "دراجة نارية",
  [ApplicantType.Commercial]: "تجاري"
};

// ============================================================
// Helper function to get any enum label
// ============================================================
export function getEnumLabel<T extends number>(mapper: Record<T, string>, value: T | number): string {
  const num = typeof value === 'number' ? value : parseInt(value as any);
  return mapper[num as T] ?? 'غير معروف';
}