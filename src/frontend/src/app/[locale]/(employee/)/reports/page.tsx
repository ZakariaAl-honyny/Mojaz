'use client';

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { reportsService, ReportingFilter } from '@/services/reports.service';
import { StatusDonutChart } from '@/components/domain/reports/charts/StatusDonutChart';
import { ServiceBarChart } from '@/components/domain/reports/charts/ServiceBarChart';
import { PerformanceTrendChart } from '@/components/domain/reports/charts/PerformanceTrendChart';
import { BranchEfficiencyMap } from '@/components/domain/reports/charts/BranchEfficiencyMap';
import { DailyLoadTimeline } from '@/components/domain/reports/charts/DailyLoadTimeline';
import { DelayedAppsTable } from '@/components/domain/reports/tables/DelayedAppsTable';
import { EmployeeProductivityTable } from '@/components/domain/reports/tables/EmployeeProductivityTable';
import { SummaryCard } from '@/components/domain/reports/cards/SummaryCard';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useTranslations } from 'next-intl';
import { Loader2, Download, RefreshCw, Filter } from 'lucide-react';

export default function ReportsDashboardPage() {
  const t = useTranslations('reports');
  const [filter, setFilter] = useState<ReportingFilter>({});

  const { data: summaryData, isLoading: summaryLoading } = useQuery({
    queryKey: ['reports', 'summary', filter],
    queryFn: () => reportsService.getSummary(filter)
  });

  const { data: statusData, isLoading: statusLoading } = useQuery({
    queryKey: ['reports', 'status-distribution', filter],
    queryFn: () => reportsService.getStatusDistribution(filter)
  });

  const { data: serviceData, isLoading: serviceLoading } = useQuery({
    queryKey: ['reports', 'service-distribution', filter],
    queryFn: () => reportsService.getServiceDistribution(filter)
  });

  const { data: delayedData, isLoading: delayedLoading } = useQuery({
    queryKey: ['reports', 'delayed-applications', filter],
    queryFn: () => reportsService.getDelayedApplications(filter)
  });

  const { data: performanceData, isLoading: performanceLoading } = useQuery({
    queryKey: ['reports', 'test-performance', filter],
    queryFn: () => reportsService.getTestPerformance(filter)
  });

  const { data: branchData, isLoading: branchLoading } = useQuery({
    queryKey: ['reports', 'branch-throughput', filter],
    queryFn: () => reportsService.getBranchThroughput(filter)
  });

  const { data: employeeData, isLoading: employeeLoading } = useQuery({
    queryKey: ['reports', 'employee-activity', filter],
    queryFn: () => reportsService.getEmployeeActivity(filter)
  });

  const { data: timelineData, isLoading: timelineLoading } = useQuery({
    queryKey: ['reports', 'issuance-timeline', filter],
    queryFn: () => reportsService.getIssuanceTimeline(filter)
  });

  const handleExport = async () => {
    try {
      const blob = await reportsService.exportCsv(filter);
      const url = window.URL.createObjectURL(new Blob([blob as any]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `mojaz-report-${new Date().getTime()}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Export failed', error);
    }
  };

  const handleReset = () => {
    setFilter({});
  };

  return (
    <div className="container mx-auto py-8 px-4 max-w-7xl animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900 tracking-tight">{t('title')}</h1>
          <p className="text-neutral-500 mt-1">{t('subtitle')}</p>
        </div>
        
        <div className="flex items-center gap-3">
          <Button onClick={handleReset} variant="ghost" className="text-neutral-500 hover:text-neutral-900">
            <RefreshCw className="w-4 h-4 mr-2" />
            {t('reset')}
          </Button>
          <Button 
            onClick={handleExport} 
            className="bg-primary-500 hover:bg-primary-600 text-white shadow-lg shadow-primary-500/20 gap-2 px-6"
          >
            <Download className="w-4 h-4" />
            {t('export')}
          </Button>
        </div>
      </div>

      {/* Filters Area */}
      <Card className="bg-white shadow-sm border-neutral-200">
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            <div className="space-y-2">
              <label className="text-sm font-medium">{t('filters.dateRange')}</label>
              <Input 
                type="date" 
                onChange={(e) => setFilter({ ...filter, startDate: e.target.value })}
                className="w-full"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">To</label>
              <Input 
                type="date" 
                onChange={(e) => setFilter({ ...filter, endDate: e.target.value })}
                className="w-full"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">{t('filters.branch')}</label>
              <Input 
                placeholder="Select Branch"
                onChange={(e) => setFilter({ ...filter, branchId: e.target.value })}
              />
            </div>
            <Button className="w-full flex items-center gap-2 h-10">
              <Filter className="w-4 h-4" />
              {t('filters.apply')}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {statusLoading ? (
          <Card className="h-[400px] flex items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
          </Card>
        ) : (
          <StatusDonutChart data={statusData?.data || []} />
        )}

        {serviceLoading ? (
          <Card className="h-[400px] flex items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
          </Card>
        ) : (
          <ServiceBarChart data={serviceData?.data || []} />
        )}
      </div>

      <div className="grid grid-cols-1 gap-6">
        {performanceLoading ? (
          <Card className="h-[400px] flex items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
          </Card>
        ) : (
          <PerformanceTrendChart data={performanceData?.data || []} />
        )}
      </div>

      <div className="grid grid-cols-1 gap-6">
        {timelineLoading ? (
          <Card className="h-[400px] flex items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
          </Card>
        ) : (
          <DailyLoadTimeline data={timelineData?.data || []} />
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {branchLoading ? (
          <Card className="h-[400px] flex items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
          </Card>
        ) : (
          <BranchEfficiencyMap data={branchData?.data || []} />
        )}

        {employeeLoading ? (
          <Card className="h-[400px] flex items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
          </Card>
        ) : (
          <EmployeeProductivityTable data={employeeData?.data || []} />
        )}
      </div>

      {/* Delayed Applications Table */}
      <div className="mt-8">
        <DelayedAppsTable 
          data={delayedData?.data?.items || []} 
          isLoading={delayedLoading} 
        />
      </div>
    </div>
  );
}
