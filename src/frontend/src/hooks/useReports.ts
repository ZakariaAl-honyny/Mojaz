import { useQuery } from '@tanstack/react-query';
import { reportsService, ReportingFilter, StatusDistributionDto, ServiceStatsDto, DelayedApplicationEntry } from '@/services/reports.service';
import { ApiResponse, PaginatedResult } from '@/types/api.types';

// Query keys
export const reportKeys = {
  all: ['reports'] as const,
  summary: (filters: ReportingFilter) => [...reportKeys.all, 'summary', filters] as const,
  statusDistribution: (filters: ReportingFilter) => [...reportKeys.all, 'status-distribution', filters] as const,
  serviceDistribution: (filters: ReportingFilter) => [...reportKeys.all, 'service-distribution', filters] as const,
  delayedApplications: (filters: ReportingFilter, page: number, pageSize: number) => [...reportKeys.all, 'delayed', filters, page, pageSize] as const,
  testPerformance: (filters: ReportingFilter) => [...reportKeys.all, 'test-performance', filters] as const,
  branchThroughput: (filters: ReportingFilter) => [...reportKeys.all, 'branch-throughput', filters] as const,
  employeeActivity: (filters: ReportingFilter) => [...reportKeys.all, 'employee-activity', filters] as const,
  issuanceTimeline: (filters: ReportingFilter) => [...reportKeys.all, 'issuance-timeline', filters] as const,
};

// Hooks
export function useReportSummary(filters: ReportingFilter) {
  return useQuery({
    queryKey: reportKeys.summary(filters),
    queryFn: () => reportsService.getSummary(filters),
  });
}

export function useStatusDistribution(filters: ReportingFilter) {
  return useQuery({
    queryKey: reportKeys.statusDistribution(filters),
    queryFn: () => reportsService.getStatusDistribution(filters),
    select: (response) => response?.data,
  });
}

export function useServiceDistribution(filters: ReportingFilter) {
  return useQuery({
    queryKey: reportKeys.serviceDistribution(filters),
    queryFn: () => reportsService.getServiceDistribution(filters),
    select: (response) => response?.data,
  });
}

export function useDelayedApplications(filters: ReportingFilter, page = 1, pageSize = 10) {
  return useQuery({
    queryKey: reportKeys.delayedApplications(filters, page, pageSize),
    queryFn: () => reportsService.getDelayedApplications(filters, page, pageSize),
    select: (response) => response?.data,
  });
}

export function useTestPerformance(filters: ReportingFilter) {
  return useQuery({
    queryKey: reportKeys.testPerformance(filters),
    queryFn: () => reportsService.getTestPerformance(filters),
    select: (response) => response?.data,
  });
}

export function useBranchThroughput(filters: ReportingFilter) {
  return useQuery({
    queryKey: reportKeys.branchThroughput(filters),
    queryFn: () => reportsService.getBranchThroughput(filters),
    select: (response) => response?.data,
  });
}

export function useEmployeeActivity(filters: ReportingFilter) {
  return useQuery({
    queryKey: reportKeys.employeeActivity(filters),
    queryFn: () => reportsService.getEmployeeActivity(filters),
    select: (response) => response?.data,
  });
}

export function useIssuanceTimeline(filters: ReportingFilter) {
  return useQuery({
    queryKey: reportKeys.issuanceTimeline(filters),
    queryFn: () => reportsService.getIssuanceTimeline(filters),
    select: (response) => response?.data,
  });
}

// Export hook
export function useExportReport(filters: ReportingFilter) {
  return useQuery({
    queryKey: [...reportKeys.all, 'export', filters],
    queryFn: () => reportsService.exportCsv(filters),
    enabled: false, // Manual trigger only
  });
}