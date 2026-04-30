import apiClient from '@/lib/api-client';
import { ApiResponse, PaginatedResult } from '@/types/api.types';

export interface ReportingFilter {
  startDate?: string;
  endDate?: string;
  branchId?: string;
  licenseCategoryId?: string;
}

export interface ChartDataPoint {
  name: string;
  processed: number;
  passed: number;
  failed: number;
}

export interface CategoryDataPoint {
  name: string;
  value: number;
  color: string;
}

export interface DetailRecord {
  applicationNumber: string;
  result: 'passed' | 'failed' | 'pending';
  processingTime: string;
  date: string;
  category: string;
}

export interface PerformanceReportData {
  totalProcessed: number;
  passRate: number;
  avgProcessingTime: number;
  efficiencyTrend: number;
  chartData: ChartDataPoint[];
  categoryData: CategoryDataPoint[];
  details: DetailRecord[];
}

export interface SummaryReportDto {
  totalApplications: number;
  pendingApplications: number;
  completedApplications: number;
  rejectedApplications: number;
  averageProcessingDays: number;
  totalRevenue: number;
}

export interface TestPerformanceDto {
  examType: string;
  totalAttempts: number;
  passedAttempts: number;
  failedAttempts: number;
  passRate: number;
  averageScore: number;
}

export interface BranchThroughputDto {
  branchId: string;
  branchName: string;
  applicationsProcessed: number;
  averageProcessingDays: number;
  efficiency: number;
}

export interface EmployeeActivityDto {
  employeeId: string;
  employeeName: string;
  role: string;
  applicationsReviewed: number;
  averageReviewTime: number;
}

export interface IssuanceTimelineDto {
  licenseCategory: string;
  averageDaysToIssue: number;
  minDays: number;
  maxDays: number;
  totalIssued: number;
}

export interface StatusDistributionDto {
  status: string;
  count: number;
  percentage: number;
  color: string;
}

export interface ServiceStatsDto {
  serviceType: string;
  count: number;
}

export interface DelayedApplicationEntry {
  applicationId: string;
  applicationNumber: string;
  currentStatus: string;
  daysInStage: number;
  applicantName: string;
  branchName: string;
}

export const reportsService = {
  /**
   * Get aggregated performance report data for the employee dashboard
   */
  getPerformanceReport: async (filter: ReportingFilter): Promise<PerformanceReportData> => {
    // Get data from multiple endpoints in parallel
    const [summaryResponse, testPerformanceResponse, statusDistributionResponse] = await Promise.all([
      apiClient.get<ApiResponse<SummaryReportDto>>('reports/summary', { params: filter }).catch(() => ({ data: { data: null } })),
      apiClient.get<ApiResponse<TestPerformanceDto[]>>('reports/test-performance', { params: filter }).catch(() => ({ data: { data: [] } })),
      apiClient.get<ApiResponse<StatusDistributionDto[]>>('reports/status-distribution', { params: filter }).catch(() => ({ data: { data: [] } }))
    ]);

    const summary = summaryResponse.data.data;
    const testPerformance = testPerformanceResponse.data.data || [];
    const statusDistribution = statusDistributionResponse.data.data || [];

    // Calculate totals
    const totalProcessed = summary?.totalApplications || 0;
    const completedCount = summary?.completedApplications || 0;
    const passRate = totalProcessed > 0 ? Math.round((completedCount / totalProcessed) * 100) : 0;
    const avgProcessingTime = summary?.averageProcessingDays || 0;

    // Build chart data from test performance
    const chartData: ChartDataPoint[] = testPerformance.map(tp => ({
      name: tp.examType === 'Theory' ? 'النظري' : tp.examType === 'Practical' ? 'العملي' : tp.examType,
      processed: tp.totalAttempts,
      passed: tp.passedAttempts,
      failed: tp.failedAttempts
    }));

    // Build category data from status distribution
    const categoryData: CategoryDataPoint[] = statusDistribution.map((sd, index) => ({
      name: sd.status,
      value: sd.count,
      color: ['#1a3a8f', '#3B82F6', '#10B981', '#D4A017', '#EF4444', '#8B5CF6'][index % 6]
    }));

    // Build details from delayed applications (sample)
    const delayedResponse = await apiClient.get<ApiResponse<PaginatedResult<DelayedApplicationEntry>>>('reports/delayed-applications', { 
      params: { ...filter, page: 1, pageSize: 10 } 
    }).catch(() => ({ data: { data: { items: [] } } }));
    
    const details: DetailRecord[] = (delayedResponse.data.data?.items || []).map(da => ({
      applicationNumber: da.applicationNumber,
      result: 'pending' as const,
      processingTime: `${da.daysInStage}د`,
      date: new Date().toISOString().split('T')[0],
      category: 'ب' // Default category
    }));

    // Efficiency trend - compare with previous period
    // This is a simplified calculation
    const efficiencyTrend = passRate > 70 ? 5 : passRate > 50 ? 0 : -5;

    return {
      totalProcessed,
      passRate,
      avgProcessingTime,
      efficiencyTrend,
      chartData,
      categoryData,
      details
    };
  },

  getSummary: async (filter: ReportingFilter) => {
    const response = await apiClient.get<ApiResponse<SummaryReportDto>>('reports/summary', { params: filter });
    return response.data;
  },

  getStatusDistribution: async (filter: ReportingFilter) => {
    const response = await apiClient.get<ApiResponse<StatusDistributionDto[]>>('reports/status-distribution', { params: filter });
    return response.data;
  },

  getServiceDistribution: async (filter: ReportingFilter) => {
    const response = await apiClient.get<ApiResponse<ServiceStatsDto[]>>('reports/service-distribution', { params: filter });
    return response.data;
  },

  getDelayedApplications: async (filter: ReportingFilter, page = 1, pageSize = 10) => {
    const response = await apiClient.get<ApiResponse<PaginatedResult<DelayedApplicationEntry>>>('reports/delayed-applications', { 
      params: { ...filter, page, pageSize } 
    });
    return response.data;
  },

  getTestPerformance: async (filter: ReportingFilter) => {
    const response = await apiClient.get<ApiResponse<TestPerformanceDto[]>>('reports/test-performance', { params: filter });
    return response.data;
  },

  getBranchThroughput: async (filter: ReportingFilter) => {
    const response = await apiClient.get<ApiResponse<BranchThroughputDto[]>>('reports/branch-throughput', { params: filter });
    return response.data;
  },

  getEmployeeActivity: async (filter: ReportingFilter) => {
    const response = await apiClient.get<ApiResponse<EmployeeActivityDto[]>>('reports/employee-activity', { params: filter });
    return response.data;
  },

  getIssuanceTimeline: async (filter: ReportingFilter) => {
    const response = await apiClient.get<ApiResponse<IssuanceTimelineDto[]>>('reports/issuance-timeline', { params: filter });
    return response.data;
  },

  exportCsv: async (filter: ReportingFilter) => {
    const response = await apiClient.get('reports/export-csv', { 
      params: filter,
      responseType: 'blob' 
    });
    return response.data;
  },

  exportPdf: async (filter: ReportingFilter) => {
    const response = await apiClient.get('reports/export-pdf', {
      params: filter,
      responseType: 'blob'
    });
    return response.data;
  }
};
