// ============================================================
// Application Types - Re-export numeric enums from single source
// ============================================================

import { ApplicationStatus, ReplacementReason } from '@/lib/enums';

// Re-export from single source
export { ApplicationStatus, ReplacementReason } from '@/lib/enums';

// ============================================================
// Additional Type Definitions
// ============================================================

export interface ApplicationSummaryDto {
  id: string;
  applicationNumber: string;
  applicantName: string;
  licenseCategoryCode: string;  // Changed from number to string to match backend
  serviceType: number;
  currentStage: string;
  status: ApplicationStatus;
  submittedDate: string;
  updatedAt: string;
  // Additional fields from backend ApplicationDto
  licenseCategoryId?: string;
  licenseCategoryNameAr?: string;
  licenseCategoryNameEn?: string;
  createdAt?: string;
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
  isApproved?: boolean;
  comments?: string;
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