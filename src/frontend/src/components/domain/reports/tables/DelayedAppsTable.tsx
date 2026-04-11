'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface DelayedApplicationEntry {
  applicationId: string;
  applicationNumber: string;
  currentStatus: string;
  daysInStage: number;
  applicantName: string;
  branchName: string;
}

interface DelayedAppsTableProps {
  data: DelayedApplicationEntry[];
  isLoading?: boolean;
}

export const DelayedAppsTable: React.FC<DelayedAppsTableProps> = ({ data, isLoading }) => {
  const t = useTranslations('reports');

  return (
    <Card className="shadow-sm border-neutral-200">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-medium text-neutral-800">
          {t('delayedApplications')}
        </CardTitle>
        <Badge variant="outline" className="text-status-error border-status-error bg-red-50">
          {data.length} {t('count')}
        </Badge>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-start border-collapse">
            <thead>
              <tr className="border-b border-neutral-100 bg-neutral-50/50">
                <th className="py-3 px-4 text-sm font-semibold text-neutral-600 text-start">{t('table.applicationNumber')}</th>
                <th className="py-3 px-4 text-sm font-semibold text-neutral-600 text-start">{t('table.applicant')}</th>
                <th className="py-3 px-4 text-sm font-semibold text-neutral-600 text-start">{t('table.daysInStage')}</th>
                <th className="py-3 px-4 text-sm font-semibold text-neutral-600 text-start">{t('table.branch')}</th>
                <th className="py-3 px-4 text-sm font-semibold text-neutral-600 text-start">{t('table.currentStatus')}</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                // Skeleton rows could go here
                <tr><td colSpan={5} className="py-8 text-center text-neutral-400">Loading...</td></tr>
              ) : data.length === 0 ? (
                <tr><td colSpan={5} className="py-8 text-center text-neutral-400">{t('noData')}</td></tr>
              ) : (
                data.map((app) => (
                  <tr key={app.applicationId} className="border-b border-neutral-50 hover:bg-neutral-50/30 transition-colors">
                    <td className="py-3 px-4 text-sm font-medium text-primary-600">{app.applicationNumber}</td>
                    <td className="py-3 px-4 text-sm text-neutral-700">{app.applicantName}</td>
                    <td className="py-3 px-4 text-sm">
                      <span className={`font-semibold ${app.daysInStage > 20 ? 'text-status-error' : 'text-status-warning'}`}>
                        {app.daysInStage}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm text-neutral-600">{app.branchName}</td>
                    <td className="py-3 px-4 text-sm">
                       {/* Simplified Status Badge for Reports */}
                       <span className="px-2 py-1 rounded text-[11px] uppercase font-bold bg-neutral-100 text-neutral-600">
                         {t(`status.${app.currentStatus.toLowerCase()}`)}
                       </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};
