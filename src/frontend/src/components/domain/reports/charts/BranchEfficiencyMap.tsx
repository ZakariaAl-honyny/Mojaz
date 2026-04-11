'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface BranchThroughputDto {
  branchName: string;
  totalProcessed: number;
  approvalRate: number;
  averageProcessingDays: number;
}

interface BranchEfficiencyMapProps {
  data: BranchThroughputDto[];
}

export const BranchEfficiencyMap: React.FC<BranchEfficiencyMapProps> = ({ data }) => {
  const t = useTranslations('reports');

  return (
    <Card className="shadow-sm border-neutral-200">
      <CardHeader>
        <CardTitle className="text-lg font-medium text-neutral-800">
          {t('branchThroughput')}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {data.map((branch, index) => (
            <div key={index} className="p-4 rounded-lg bg-neutral-50 border border-neutral-100">
              <div className="flex justify-between items-center mb-2">
                <span className="font-semibold text-neutral-800">{branch.branchName}</span>
                <span className="text-sm text-neutral-500">{branch.totalProcessed} {t('count')}</span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-sm">
                  <p className="text-neutral-500">Approval Rate</p>
                  <p className="font-medium text-primary-600">{branch.approvalRate}%</p>
                </div>
                <div className="text-sm">
                  <p className="text-neutral-500">Avg. Time</p>
                  <p className="font-medium text-secondary-500">{branch.averageProcessingDays} days</p>
                </div>
              </div>
              {/* Progress bar for approval rate */}
              <div className="mt-3 w-full bg-neutral-200 rounded-full h-2">
                <div 
                  className="bg-primary-500 h-2 rounded-full transition-all" 
                  style={{ width: `${branch.approvalRate}%` }}
                ></div>
              </div>
            </div>
          ))}
          {data.length === 0 && (
             <p className="text-center text-neutral-400 py-4">{t('noData')}</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
