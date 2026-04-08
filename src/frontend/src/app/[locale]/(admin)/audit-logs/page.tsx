'use client';

import { useState, useEffect } from 'react';
import { auditService, AuditLogDto, AuditLogResponse } from '@/services/audit.service';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

const actionLabels: Record<string, { ar: string; en: string }> = {
  CREATE: { ar: 'إنشاء', en: 'Create' },
  UPDATE: { ar: 'تحديث', en: 'Update' },
  DELETE: { ar: 'حذف', en: 'Delete' },
};

export default function AuditLogsPage() {
  const [logs, setLogs] = useState<AuditLogDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [entityFilter, setEntityFilter] = useState('');
  const [locale, setLocale] = useState<'ar' | 'en'>('ar');

  useEffect(() => {
    loadLogs();
  }, [page, entityFilter]);

  const loadLogs = async () => {
    try {
      setLoading(true);
      const response = await auditService.getAuditLogs({
        entityName: entityFilter || undefined,
        page,
        pageSize: 20,
      });
      setLogs(response.auditLogs);
      setTotalPages(response.totalPages);
    } catch (error) {
      console.error('Failed to load audit logs:', error);
    } finally {
      setLoading(false);
    }
  };

  const t = (key: string) => {
    const translations: Record<string, string> = {
      'audit.title': locale === 'ar' ? 'سجل التدقيق' : 'Audit Logs',
      'audit.entity': locale === 'ar' ? 'الكيان' : 'Entity',
      'audit.action': locale === 'ar' ? 'الإجراء' : 'Action',
      'audit.user': locale === 'ar' ? 'المستخدم' : 'User',
      'audit.date': locale === 'ar' ? 'التاريخ' : 'Date',
      'audit.details': locale === 'ar' ? 'التفاصيل' : 'Details',
      'audit.noLogs': locale === 'ar' ? 'لا توجد سجلات' : 'No logs found',
      'audit.search': locale === 'ar' ? 'بحث بالكيان...' : 'Search by entity...',
      'audit.previous': locale === 'ar' ? 'السابق' : 'Previous',
      'audit.next': locale === 'ar' ? 'التالي' : 'Next',
    };
    return translations[key] || key;
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleString(locale === 'ar' ? 'ar-SA' : 'en-US');
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-primary-900">{t('audit.title')}</h1>

        <Card>
          <CardHeader>
            <Input
              placeholder={t('audit.search')}
              value={entityFilter}
              onChange={(e) => {
                setEntityFilter(e.target.value);
                setPage(1);
              }}
              className="max-w-md"
            />
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8 text-gray-500">Loading...</div>
            ) : logs.length === 0 ? (
              <div className="text-center py-8 text-gray-500">{t('audit.noLogs')}</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="p-4 text-start">{t('audit.date')}</th>
                      <th className="p-4 text-start">{t('audit.user')}</th>
                      <th className="p-4 text-start">{t('audit.entity')}</th>
                      <th className="p-4 text-start">{t('audit.action')}</th>
                      <th className="p-4 text-start">{t('audit.details')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {logs.map((log) => (
                      <tr key={log.id} className="border-b hover:bg-gray-50">
                        <td className="p-4 text-sm">{formatDate(log.timestamp)}</td>
                        <td className="p-4">{log.userName || '-'}</td>
                        <td className="p-4">{log.entityName}</td>
                        <td className="p-4">
                          <span className={`px-2 py-1 rounded-full text-sm ${
                            log.actionType === 'CREATE' ? 'bg-green-100 text-green-800' :
                            log.actionType === 'UPDATE' ? 'bg-blue-100 text-blue-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {actionLabels[log.actionType]?.[locale] || log.actionType}
                          </span>
                        </td>
                        <td className="p-4 text-sm text-gray-500 max-w-xs truncate">
                          {log.entityId}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {totalPages > 1 && (
              <div className="flex justify-center gap-2 mt-4">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-4 py-2 border rounded disabled:opacity-50"
                >
                  {t('audit.previous')}
                </button>
                <span className="px-4 py-2">
                  {page} / {totalPages}
                </span>
                <button
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="px-4 py-2 border rounded disabled:opacity-50"
                >
                  {t('audit.next')}
                </button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}