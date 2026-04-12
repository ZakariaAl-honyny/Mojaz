'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  FileKey2,
  TrendingUp,
  TrendingDown,
  Calendar,
  Download,
  BarChart3,
  PieChart,
  RefreshCw,
  Car,
  Users,
  AlertTriangle
} from "lucide-react";
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';

interface LicenseStats {
  totalIssued: number;
  active: number;
  expired: number;
  suspended: number;
  expiredSoon: number;
  renewalRate: number;
}

interface ClassBreakdown {
  class: string;
  count: number;
  percentage: number;
}

interface MonthlyData {
  month: string;
  issued: number;
  renewed: number;
}

export default function LicenseReportsPage() {
  const t = useTranslations('license');
  const { locale } = useParams();

  // Mock statistics
  const stats: LicenseStats = {
    totalIssued: 12450,
    active: 8920,
    expired: 3120,
    suspended: 410,
    expiredSoon: 520,
    renewalRate: 78.5
  };

  const classBreakdown: ClassBreakdown[] = [
    { class: 'B', count: 5200, percentage: 41.8 },
    { class: 'A', count: 3100, percentage: 24.9 },
    { class: 'C', count: 2100, percentage: 16.9 },
    { class: 'D', count: 1050, percentage: 8.4 },
    { class: 'E', count: 650, percentage: 5.2 },
    { class: 'F', count: 350, percentage: 2.8 }
  ];

  const monthlyData: MonthlyData[] = [
    { month: 'يناير', issued: 320, renewed: 280 },
    { month: 'فبراير', issued: 290, renewed: 310 },
    { month: 'مارس', issued: 350, renewed: 290 },
    { month: 'ابريل', issued: 310, renewed: 330 },
    { month: 'مايو', issued: 280, renewed: 270 },
    { month: 'يونيو', issued: 340, renewed: 300 }
  ];

  const getMaxCount = () => Math.max(...classBreakdown.map(c => c.count));

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-primary-950">{t('employee.reports.title')}</h1>
          <p className="text-neutral-500 mt-1">{t('employee.reports.subtitle')}</p>
        </div>
        <Button variant="outline" className="gap-2">
          <Download className="w-4 h-4" />
          {t('employee.manage.export')}
        </Button>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4 text-center">
            <FileKey2 className="w-6 h-6 text-primary-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-neutral-900">{stats.totalIssued.toLocaleString()}</p>
            <p className="text-xs text-neutral-500">{t('employee.reports.totalIssued')}</p>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4 text-center">
            <div className="w-2 h-2 bg-green-500 rounded-full mx-auto mb-2"></div>
            <p className="text-2xl font-bold text-green-600">{stats.active.toLocaleString()}</p>
            <p className="text-xs text-neutral-500">{t('employee.reports.active')}</p>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4 text-center">
            <div className="w-2 h-2 bg-red-500 rounded-full mx-auto mb-2"></div>
            <p className="text-2xl font-bold text-red-600">{stats.expired.toLocaleString()}</p>
            <p className="text-xs text-neutral-500">{t('employee.reports.expired')}</p>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4 text-center">
            <div className="w-2 h-2 bg-yellow-500 rounded-full mx-auto mb-2"></div>
            <p className="text-2xl font-bold text-yellow-600">{stats.suspended.toLocaleString()}</p>
            <p className="text-xs text-neutral-500">{t('suspended')}</p>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4 text-center">
            <AlertTriangle className="w-6 h-6 text-orange-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-orange-600">{stats.expiredSoon}</p>
            <p className="text-xs text-neutral-500">{t('employee.reports.expiredSoon')}</p>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4 text-center">
            <RefreshCw className="w-6 h-6 text-blue-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-blue-600">{stats.renewalRate}%</p>
            <p className="text-xs text-neutral-500">{t('employee.reports.renewalRates')}</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* By Class Breakdown */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <PieChart className="w-5 h-5 text-primary-500" />
              {t('employee.reports.byClass')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {classBreakdown.map((item) => (
                <div key={item.class}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium text-neutral-700">فئة {item.class}</span>
                    <span className="text-sm text-neutral-500">{item.count.toLocaleString()} ({item.percentage}%)</span>
                  </div>
                  <div className="w-full bg-neutral-100 rounded-full h-3 overflow-hidden">
                    <div 
                      className="bg-primary-500 h-full rounded-full transition-all duration-500"
                      style={{ width: `${(item.count / getMaxCount()) * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Monthly Trends */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-primary-500" />
              {t('employee.reports.byMonth')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {monthlyData.map((item, index) => (
                <div key={index} className="flex items-center gap-4">
                  <span className="w-12 text-sm text-neutral-600">{item.month}</span>
                  <div className="flex-1 grid grid-cols-2 gap-2">
                    <div className="flex items-center gap-2">
                      <div className="w-16 text-xs text-neutral-500">جديد</div>
                      <div className="flex-1 bg-primary-100 rounded h-2">
                        <div 
                          className="bg-primary-500 h-full rounded"
                          style={{ width: `${(item.issued / 400) * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-xs font-medium text-neutral-700 w-8">{item.issued}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-16 text-xs text-neutral-500">تجديد</div>
                      <div className="flex-1 bg-green-100 rounded h-2">
                        <div 
                          className="bg-green-500 h-full rounded"
                          style={{ width: `${(item.renewed / 400) * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-xs font-medium text-neutral-700 w-8">{item.renewed}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Expiring Soon Table */}
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-orange-500" />
            {t('employee.reports.expiredSoon')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-neutral-50 border-b border-neutral-100">
                <tr>
                  <th className="text-start px-4 py-3 text-sm font-medium text-neutral-500">{t('number')}</th>
                  <th className="text-start px-4 py-3 text-sm font-medium text-neutral-500">الحامل</th>
                  <th className="text-start px-4 py-3 text-sm font-medium text-neutral-500">{t('class')}</th>
                  <th className="text-start px-4 py-3 text-sm font-medium text-neutral-500">{t('expiryDate')}</th>
                  <th className="text-start px-4 py-3 text-sm font-medium text-neutral-500">الأيام المتبقية</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {[
                  { number: 'MOJ-2023-12345678', holder: 'أحمد علي', category: 'B', expiry: '2025-02-15', days: 34 },
                  { number: 'MOJ-2023-87654321', holder: 'سعيد محمد', category: 'A', expiry: '2025-02-20', days: 39 },
                  { number: 'MOJ-2023-11223344', holder: 'خالد عبدالله', category: 'C', expiry: '2025-02-28', days: 47 }
                ].map((item, index) => (
                  <tr key={index} className="hover:bg-orange-50/50">
                    <td className="px-4 py-3 text-neutral-900 font-medium">{item.number}</td>
                    <td className="px-4 py-3 text-neutral-700">{item.holder}</td>
                    <td className="px-4 py-3">
                      <Badge variant="outline" className="border-primary-200 text-primary-700">
                        {item.category}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-neutral-600">{item.expiry}</td>
                    <td className="px-4 py-3">
                      <span className="text-orange-600 font-medium">{item.days} يوم</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
