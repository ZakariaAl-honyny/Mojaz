import { ApiResponse, PaginatedResult } from './api.types';

// Report filter interface
export interface ReportFilter {
  startDate?: string;
  endDate?: string;
  branchId?: string;
  licenseCategoryId?: string;
  examinerId?: string;
}

// Status distribution DTO
export interface StatusDistributionDto {
  status: string;
  count: number;
  percentage: number;
  color: string;
}

// Service statistics DTO
export interface ServiceStatsDto {
  serviceType: string;
  count: number;
}

// Test performance DTO
export interface TestPerformanceDto {
  testType: string;
  total: number;
  passed: number;
  failed: number;
  passRate: number;
}

// Branch throughput DTO
export interface BranchThroughputDto {
  branchId: string;
  branchName: string;
  processed: number;
  completed: number;
  avgProcessingDays: number;
}

// Employee activity DTO
export interface EmployeeActivityDto {
  employeeId: string;
  employeeName: string;
  role: string;
  processed: number;
  completed: number;
  approvalRate: number;
}

// Issuance timeline DTO
export interface IssuanceTimelineDto {
  date: string;
  count: number;
  cumulative: number;
}

// Delayed application entry
export interface DelayedApplicationEntry {
  applicationId: string;
  applicationNumber: string;
  applicantName: string;
  currentStatus: string;
  daysInStage: number;
  branchName: string;
  lastUpdated: string;
}

// Summary KPI
export interface ReportSummaryKpi {
  label: string;
  value: number;
  change?: number;
  trend?: 'up' | 'down' | 'stable';
}

// Report response types
export type ReportSummaryResponse = ApiResponse<{
  totalApplications: number;
  activeApplications: number;
  completedToday: number;
  delayedCount: number;
} | null>;

export type StatusDistributionResponse = ApiResponse<StatusDistributionDto[]>;
export type ServiceDistributionResponse = ApiResponse<ServiceStatsDto[]>;
export type TestPerformanceResponse = ApiResponse<TestPerformanceDto[]>;
export type BranchThroughputResponse = ApiResponse<BranchThroughputDto[]>;
export type EmployeeActivityResponse = ApiResponse<EmployeeActivityDto[]>;
export type IssuanceTimelineResponse = ApiResponse<IssuanceTimelineDto[]>;
export type DelayedApplicationsResponse = ApiResponse<PaginatedResult<DelayedApplicationEntry>>;

// Report export types
export type ExportFormat = 'csv' | 'pdf' | 'excel';

export interface ExportReportRequest {
  reportType: string;
  filters: ReportFilter;
  format: ExportFormat;
}