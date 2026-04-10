'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface EmployeeActivityDto {
  userId: string;
  fullName: string;
  role: string;
  totalFinalized: number;
}

interface EmployeeProductivityTableProps {
  data: EmployeeActivityDto[];
}

export const EmployeeProductivityTable: React.FC<EmployeeProductivityTableProps> = ({ data }) => {
  const t = useTranslations('reports');

  return (
    <Card className="shadow-sm border-neutral-200">
      <CardHeader>
        <CardTitle className="text-lg font-medium text-neutral-800">
          {t('employeeActivity')}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-start border-collapse">
            <thead>
              <tr className="border-b border-neutral-100 bg-neutral-50/50">
                <th className="py-2 px-4 text-xs font-semibold text-neutral-600 text-start">Employee</th>
                <th className="py-2 px-4 text-xs font-semibold text-neutral-600 text-start">Role</th>
                <th className="py-2 px-4 text-xs font-semibold text-neutral-600 text-end">Processed</th>
              </tr>
            </thead>
            <tbody>
              {data.map((emp) => (
                <tr key={emp.userId} className="border-b border-neutral-50 hover:bg-neutral-50/30">
                  <td className="py-2 px-4 text-sm text-neutral-800">{emp.fullName}</td>
                  <td className="py-2 px-4 text-xs text-neutral-500">{emp.role}</td>
                  <td className="py-2 px-4 text-sm font-semibold text-end">{emp.totalFinalized}</td>
                </tr>
              ))}
              {data.length === 0 && (
                 <tr><td colSpan={3} className="py-4 text-center text-neutral-400">{t('noData')}</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};
