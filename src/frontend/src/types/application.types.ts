// ============================================================
// ApplicationStatus - matches backend numeric values (Mojaz.Domain/Enums/ApplicationStatus.cs)
// Backend: Draft=0, Submitted=1, DocumentReview=2, InReview=3, MedicalExam=4,
//          Training=5, TheoryTest=6, PracticalTest=7, Approved=8, Payment=9,
//          Issued=10, Active=11, Rejected=12, Cancelled=13, Expired=14
// ============================================================
export enum ApplicationStatus {
  Draft = 0,
  Submitted = 1,
  DocumentReview = 2,
  InReview = 3,
  MedicalExam = 4,
  Training = 5,
  TheoryTest = 6,
  PracticalTest = 7,
  Approved = 8,
  Payment = 9,
  Issued = 10,
  Active = 11,
  Rejected = 12,
  Cancelled = 13,
  Expired = 14,
}

// Display labels for ApplicationStatus
export const ApplicationStatusLabels = {
  [ApplicationStatus.Draft]: { ar: 'مسودة', en: 'Draft' },
  [ApplicationStatus.Submitted]: { ar: 'مُقدَّم', en: 'Submitted' },
  [ApplicationStatus.DocumentReview]: { ar: 'مراجعة المستندات', en: 'Document Review' },
  [ApplicationStatus.InReview]: { ar: 'قيد المراجعة', en: 'In Review' },
  [ApplicationStatus.MedicalExam]: { ar: 'الفحص الطبي', en: 'Medical Exam' },
  [ApplicationStatus.Training]: { ar: 'التدريب', en: 'Training' },
  [ApplicationStatus.TheoryTest]: { ar: 'الاختبار النظري', en: 'Theory Test' },
  [ApplicationStatus.PracticalTest]: { ar: 'الاختبار العملي', en: 'Practical Test' },
  [ApplicationStatus.Approved]: { ar: 'مقبول', en: 'Approved' },
  [ApplicationStatus.Payment]: { ar: 'الدفع', en: 'Payment' },
  [ApplicationStatus.Issued]: { ar: 'تم الإصدار', en: 'Issued' },
  [ApplicationStatus.Active]: { ar: 'نشط', en: 'Active' },
  [ApplicationStatus.Rejected]: { ar: 'مرفوض', en: 'Rejected' },
  [ApplicationStatus.Cancelled]: { ar: 'ملغى', en: 'Cancelled' },
  [ApplicationStatus.Expired]: { ar: 'منتهي الصلاحية', en: 'Expired' },
} as const;

export enum ReplacementReason {
  Lost = 1,
  Damaged = 2,
  Stolen = 3
}

export interface ApplicationSummaryDto {
  id: string;
  applicationNumber: string;
  applicantName: string;
  licenseCategoryCode: number;
  serviceType: number;
  currentStage: string;
  status: ApplicationStatus;
  submittedDate: string;
  updatedAt: string;
}

export interface TimelineStageDto {
  stageNumber: number;
  nameAr: string;
  nameEn: string;
  state: 'completed' | 'current' | 'failed' | 'future';
  completedAt?: string;
  actorName?: string;
  actorRole?: string;
  outcomeNote?: string;
}

export interface ApplicationTimelineDto {
  applicationId: string;
  currentStageNumber: number;
  stages: TimelineStageDto[];
}

export interface RecentNotificationDto {
  id: string;
  title: string;
  message: string;
  createdAt: string;
  isRead: boolean;
}

export interface DashboardSummaryDto {
  activeApplicationsCount: number;
  pendingActionsCount: number;
  newNotificationsCount: number;
  applications: ApplicationSummaryDto[];
  upcomingAppointments: AppointmentSummaryDto[];
  recentNotifications: RecentNotificationDto[];
  stats: UserDashboardStats;
}

export interface AppointmentSummaryDto {
  id: string;
  appointmentDate: string;
  serviceType: string;
  status: string;
}

export interface UserDashboardStats {
  totalSubmitted: number;
  testsPassed: number;
}

export interface ManagerKpiDto {
  todayTotalApplications: number;
  todayPassRate: number;
  statusDistribution: StatusDistributionDto[];
  last7DaysLoad: DailyLoadDto[];
  totalStalledApplications: number;
  activeUsers: number;
}

export interface StatusDistributionDto {
  status: number;
  count: number;
}

export interface DailyLoadDto {
    date: string;
    count: number;
  }

export interface VerifyStolenReportRequest {
  isApproved: boolean;
  comments: string;
}

export interface VerifyStolenReportResponse {
  success: boolean;
  message: string;
}

// Admin Dashboard DTOs
export interface AdminKpiDto {
  todayStats: AdminTodayStats;
  statusDistribution: StatusData[];
  weeklyTrend: WeeklyTrend[];
  recentActivity: ActivityItem[];
}

export interface AdminTodayStats {
  applications: number;
  licenses: number;
  revenue: number;
  activeUsers: number;
  applicationsChange: number;
  licensesChange: number;
  revenueChange: number;
  usersChange: number;
}

export interface StatusData {
  name: string;
  value: number;
  color: string;
}

export interface WeeklyTrend {
  date: string;
  applications: number;
  completed: number;
}

export interface ActivityItem {
  id: string;
  type: 'application' | 'license' | 'payment' | 'user';
  title: string;
  description: string;
  timestamp: string;
}