export enum ApplicationStatus {
  Draft = 'Draft',
  Submitted = 'Submitted',
  Documents = 'Documents', // Was DocumentReview
  InReview = 'InReview',
  Medical = 'Medical', // Was MedicalExam
  Training = 'Training',
  Theory = 'Theory', // Was TheoryTest
  Practical = 'Practical', // Was PracticalTest
  Approved = 'Approved',
  Payment = 'Payment',
  Issued = 'Issued',
  Active = 'Active',
  Rejected = 'Rejected',
  Cancelled = 'Cancelled',
  Expired = 'Expired',
  // Specific statuses from api.types
  Paid = 'Paid',
  MedicalDone = 'MedicalDone',
  TheoryDone = 'TheoryDone',
  PracticalDone = 'PracticalDone'
}

export interface ApplicationSummaryDto {
  id: number;
  applicationNumber: string;
  applicantName: string;
  licenseCategoryCode: string;
  serviceType: string;
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
  applicationId: number;
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
  applications: ApplicationSummaryDto[];
  upcomingAppointments: AppointmentSummaryDto[];
  recentNotifications: RecentNotificationDto[];
  stats: UserDashboardStats;
}

export interface AppointmentSummaryDto {
  id: number;
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
}

export interface StatusDistributionDto {
  status: string;
  count: number;
}

export interface DailyLoadDto {
  date: string;
  count: number;
}
