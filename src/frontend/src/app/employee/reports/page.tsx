'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { isManagerRole, UserRole } from '@/lib/enums';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Loader2, 
  BarChart3, 
  TrendingUp, 
  Users, 
  FileText, 
  Calendar, 
  Download, 
  Activity,
  PieChart,
  Clock,
  DollarSign,
  CheckCircle2,
  XCircle,
  RefreshCw,
  FileSpreadsheet,
  Filter
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { reportsService, ReportingFilter, SummaryReportDto, StatusDistributionDto, ServiceStatsDto } from '@/services/reports.service';

// Mobile-first grid system
const gridStyles = {
  base: 'grid grid-cols-1',
  sm: 'sm:grid-cols-2',
  lg: 'lg:grid-cols-4',
  xl: 'xl:grid-cols-4'
};

type DateRange = 'week' | 'month' | 'year';

export default function ManagerReportsPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading: isAuthLoading } = useAuth();
  const [dateRange, setDateRange] = useState<DateRange>('week');
  const [isExporting, setIsExporting] = useState(false);

  useEffect(() => {
    if (!isAuthLoading && (!isAuthenticated || (!isManagerRole(user?.role) && user?.role !== UserRole.Admin))) {
      router.replace('/forbidden');
    }
  }, [user, isAuthenticated, isAuthLoading, router]);

  // Calculate date filter based on dateRange
  const getFilter = (): ReportingFilter => {
    const now = new Date();
    const startDate = new Date();
    if (dateRange === 'week') startDate.setDate(now.getDate() - 7);
    else if (dateRange === 'month') startDate.setMonth(now.getMonth() - 1);
    else startDate.setFullYear(now.getFullYear() - 1);
    return { startDate: startDate.toISOString(), endDate: now.toISOString() };
  };

  // Handle CSV export
  const handleExport = async (type: 'summary' | 'status' | 'service' = 'summary') => {
    try {
      setIsExporting(true);
      const filter = getFilter();
      const blob = await reportsService.exportCsv(filter);
      
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      const now = new Date();
      const dateStr = now.toISOString().split('T')[0];
      const rangeLabel = dateRange === 'week' ? 'week' : dateRange === 'month' ? 'month' : 'year';
      link.download = `mojaz-${type}-report-${rangeLabel}-${dateStr}.csv`;
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('فشل التصدير:', error);
    } finally {
      setIsExporting(false);
    }
  };

  // Fetch summary report data
  const { data: summaryData, isLoading } = useQuery({
    queryKey: ['reports-summary', dateRange],
    queryFn: () => reportsService.getSummary(getFilter()),
    enabled: !!user,
  });

  // Fetch status distribution
  const { data: statusData } = useQuery({
    queryKey: ['reports-status', dateRange],
    queryFn: () => reportsService.getStatusDistribution(getFilter()),
    enabled: !!user,
  });

  // Fetch service distribution  
  const { data: serviceData } = useQuery({
    queryKey: ['reports-service', dateRange],
    queryFn: () => reportsService.getServiceDistribution(getFilter()),
    enabled: !!user,
  });

  const summary = summaryData?.data;
  const statusDist = statusData?.data || [];
  const serviceDist = serviceData?.data || [];

  if (isAuthLoading || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]" dir="rtl">
        <Loader2 className="w-10 h-10 animate-spin text-[#1a3a8f]" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-4 md:py-8 px-3 md:px-4 space-y-4 md:space-y-6 font-arabic" dir="rtl">
      {/* Header - Mobile First */}
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="w-10 h-10 sm:w-12 bg-[#1a3a8f] rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0">
            <BarChart3 className="w-5 h-5 sm:w-6 text-white" />
          </div>
          <div>
            <h1 className="text-lg sm:text-2xl font-black text-neutral-900">التقارير والإحصائيات</h1>
            <p className="text-xs sm:text-sm text-neutral-500 hidden sm:block">لوحة تحكم المدير</p>
          </div>
        </div>
        
        {/* Export Button - Mobile First */}
        <Button 
          onClick={() => handleExport('summary')} 
          disabled={isExporting}
          className="w-full sm:w-auto gap-2 h-10 sm:h-10 text-sm"
          variant="default"
        >
          {isExporting ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Download className="w-4 h-4" />
          )}
          <span>تصدير</span>
        </Button>
      </header>

      {/* Date Range Tabs - Mobile First */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {(['week', 'month', 'year'] as DateRange[]).map((range) => (
          <Button
            key={range}
            variant={dateRange === range ? 'default' : 'outline'}
            onClick={() => setDateRange(range)}
            className="flex-1 sm:flex-none gap-2 h-9 sm:h-10 px-4 whitespace-nowrap"
          >
            {range === 'week' && (
              <>
                <Clock className="w-4 h-4" />
                <span>أسبوع</span>
              </>
            )}
            {range === 'month' && (
              <>
                <Calendar className="w-4 h-4" />
                <span>شهر</span>
              </>
            )}
            {range === 'year' && (
              <>
                <BarChart3 className="w-4 h-4" />
                <span>سنة</span>
              </>
            )}
          </Button>
        ))}
      </div>

      {/* Stats Grid - Mobile First */}
      <div className={`grid ${gridStyles.base} ${gridStyles.sm} ${gridStyles.lg} gap-3 sm:gap-4`}>
        <StatCard 
          label="إجمالي الطلبات" 
          value={summary?.totalApplications || 0} 
          icon={FileText}
          variant="default"
        />
        <StatCard 
          label="طلبات معلقة" 
          value={summary?.pendingApplications || 0} 
          icon={Clock}
          variant="warning"
        />
        <StatCard 
          label="مكتملة" 
          value={summary?.completedApplications || 0} 
          icon={CheckCircle2}
          variant="success"
        />
        <StatCard 
          label="متوسط أيام المعالجة" 
          value={summary?.averageProcessingDays || 0} 
          icon={TrendingUp}
          variant="default"
        />
      </div>

      {/* Revenue Card */}
      <Card className="border-none shadow-lg">
        <CardContent className="p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 sm:w-12 bg-emerald-50 rounded-xl flex items-center justify-center">
                <DollarSign className="w-5 h-5 sm:w-6 text-emerald-600" />
              </div>
              <div>
                <p className="text-xs sm:text-sm text-neutral-500">إجمالي الإيرادات</p>
                <p className="text-xl sm:text-2xl font-black text-emerald-600">
                  {(summary?.totalRevenue || 0).toLocaleString('ar-YE')} ر.ي
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Status Distribution */}
      <Card className="border-none shadow-lg">
        <CardHeader className="px-4 sm:px-6 py-3 sm:py-4 border-b border-neutral-100">
          <div className="flex items-center gap-2 sm:gap-3">
            <PieChart className="w-4 h-4 sm:w-5 sm:h-5 text-[#1a3a8f]" />
            <CardTitle className="text-sm sm:text-base font-bold">توزيع الحالات</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="p-3 sm:p-4">
          <div className="space-y-2 sm:space-y-3">
            {statusDist.length > 0 ? statusDist.map((item, i) => (
              <div key={i} className="flex items-center justify-between p-2 sm:p-3 bg-neutral-50 rounded-lg">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-xs sm:text-sm font-medium">{item.status}</span>
                </div>
                <span className="text-sm sm:text-base font-black">{item.count}</span>
              </div>
            )) : (
              <p className="text-center text-neutral-400 py-4 text-sm">لا توجد بيانات</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Service Distribution */}
      <Card className="border-none shadow-lg">
        <CardHeader className="px-4 sm:px-6 py-3 sm:py-4 border-b border-neutral-100">
          <div className="flex items-center gap-2 sm:gap-3">
            <FileSpreadsheet className="w-4 h-4 sm:w-5 sm:h-5 text-[#1a3a8f]" />
            <CardTitle className="text-sm sm:text-base font-bold">توزيع الخدمات</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="p-3 sm:p-4">
          <div className="space-y-2 sm:space-y-3">
            {serviceDist.length > 0 ? serviceDist.map((item, i) => (
              <div key={i} className="flex items-center justify-between p-2 sm:p-3 bg-neutral-50 rounded-lg">
                <span className="text-xs sm:text-sm font-medium">{item.serviceType}</span>
                <span className="text-sm sm:text-base font-black">{item.count}</span>
              </div>
            )) : (
              <p className="text-center text-neutral-400 py-4 text-sm">لا توجد بيانات</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Quick Export Options */}
      <Card className="border-none shadow-lg">
        <CardHeader className="px-4 sm:px-6 py-3 sm:py-4 border-b border-neutral-100">
          <div className="flex items-center gap-2 sm:gap-3">
            <Download className="w-4 h-4 sm:w-5 sm:h-5 text-[#1a3a8f]" />
            <CardTitle className="text-sm sm:text-base font-bold">تصدير التقارير</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="p-3 sm:p-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3">
            <Button 
              variant="outline" 
              onClick={() => handleExport('summary')}
              disabled={isExporting}
              className="h-10 sm:h-12 text-xs sm:text-sm gap-2"
            >
              <FileText className="w-4 h-4" />
              تقرير الملخص
            </Button>
            <Button 
              variant="outline" 
              onClick={() => handleExport('status')}
              disabled={isExporting}
              className="h-10 sm:h-12 text-xs sm:text-sm gap-2"
            >
              <PieChart className="w-4 h-4" />
              تقرير الحالات
            </Button>
            <Button 
              variant="outline" 
              onClick={() => handleExport('service')}
              disabled={isExporting}
              className="h-10 sm:h-12 text-xs sm:text-sm gap-2"
            >
              <FileSpreadsheet className="w-4 h-4" />
              تقرير الخدمات
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Reusable Stat Card Component
function StatCard({ 
  label, 
  value, 
  icon: Icon, 
  variant = 'default'
}: { 
  label: string; 
  value: number; 
  icon: React.ComponentType<{ className?: string }>;
  variant?: 'default' | 'success' | 'warning';
}) {
  const colors = {
    default: 'text-neutral-900',
    success: 'text-emerald-600',
    warning: 'text-amber-600'
  };
  
  const bgColors = {
    default: 'bg-neutral-50',
    success: 'bg-emerald-50',
    warning: 'bg-amber-50'
  };

  return (
    <Card className="border-none shadow-md sm:shadow-lg">
      <CardContent className="p-3 sm:p-5">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="text-xs sm:text-sm text-neutral-500 mb-1">{label}</p>
            <p className={`text-xl sm:text-2xl md:text-3xl font-black ${colors[variant]}`}>{value}</p>
          </div>
          <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg ${bgColors[variant]} flex items-center justify-center flex-shrink-0`}>
            <Icon className={`w-4 h-4 sm:w-5 sm:h-5 ${colors[variant]}`} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}