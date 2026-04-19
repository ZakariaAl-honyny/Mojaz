'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  FileText,
  Download,
  Filter,
  Search,
  User,
  Clock,
  LogIn,
  LogOut,
  FileEdit,
  Settings,
  Trash2,
  Shield,
  AlertCircle
} from "lucide-react";
import { useTranslations, useFormatter } from 'next-intl';
import { useParams } from 'next/navigation';
import { useState } from 'react';

interface AuditLog {
  id: string;
  user: string;
  userEmail: string;
  action: string;
  actionType: 'login' | 'logout' | 'create' | 'update' | 'delete' | 'view' | 'export' | 'settings';
  entity: string;
  entityId: string;
  timestamp: string;
  ipAddress: string;
  details?: string;
}

export default function AuditsReportPage() {
  const t = useTranslations('admin');
  const format = useFormatter();
  const { locale } = useParams();
  const isRTL = locale === 'ar';

  const [searchQuery, setSearchQuery] = useState('');
  const [actionFilter, setActionFilter] = useState('all');
  const [userFilter, setUserFilter] = useState('all');

  // Mock audit logs
  const auditLogs: AuditLog[] = [
    { id: '1', user: locale === 'ar' ? 'أحمد محمد' : 'Ahmed Mohammed', userEmail: 'ahmed@example.com', action: t('reports.audits.login'), actionType: 'login', entity: t('reports.audits.system'), entityId: '-', timestamp: '2026-02-01 09:15:23', ipAddress: '192.168.1.100', details: 'Successful login' },
    { id: '2', user: locale === 'ar' ? 'سعيد خالد' : 'Said Khalid', userEmail: 'saeed@example.com', action: t('reports.audits.update'), actionType: 'update', entity: t('reports.audits.application'), entityId: 'MOJ-2026-84729163', timestamp: '2026-02-01 09:45:12', ipAddress: '192.168.1.105', details: 'Updated status to In Review' },
    { id: '3', user: locale === 'ar' ? 'عبدالله عمر' : 'Abdullah Omar', userEmail: 'abdullah@example.com', action: t('reports.audits.create'), actionType: 'create', entity: t('reports.audits.user'), entityId: 'USR-2026-001', timestamp: '2026-02-01 10:22:45', ipAddress: '192.168.1.110' },
    { id: '4', user: locale === 'ar' ? 'فاطمة علي' : 'Fatima Ali', userEmail: 'fatima@example.com', action: t('reports.audits.export'), actionType: 'export', entity: t('reports.audits.report'), entityId: 'RPT-2026-002', timestamp: '2026-02-01 10:55:30', ipAddress: '192.168.1.115' },
    { id: '5', user: locale === 'ar' ? 'خالد إبراهيم' : 'Khalid Ibrahim', userEmail: 'khaled@example.com', action: t('reports.audits.delete'), actionType: 'delete', entity: t('reports.audits.document'), entityId: 'DOC-2026-045', timestamp: '2026-02-01 11:12:18', ipAddress: '192.168.1.120', details: 'Deleted invalid document' },
    { id: '6', user: locale === 'ar' ? 'نورة محمد' : 'Nora Mohammed', userEmail: 'nora@example.com', action: t('reports.audits.logout'), actionType: 'logout', entity: t('reports.audits.system'), entityId: '-', timestamp: '2026-02-01 11:45:00', ipAddress: '192.168.1.125' },
    { id: '7', user: locale === 'ar' ? 'أحمد محمد' : 'Ahmed Mohammed', userEmail: 'ahmed@example.com', action: t('reports.audits.settings'), actionType: 'settings', entity: t('reports.audits.systemSettings'), entityId: '-', timestamp: '2026-02-01 12:05:33', ipAddress: '192.168.1.100', details: 'Enabled email notifications' },
    { id: '8', user: locale === 'ar' ? 'سعيد خالد' : 'Said Khalid', userEmail: 'saeed@example.com', action: t('reports.audits.view'), actionType: 'view', entity: t('reports.audits.application'), entityId: 'MOJ-2026-92837465', timestamp: '2026-02-01 12:30:45', ipAddress: '192.168.1.105' },
  ];

  const getActionIcon = (actionType: string) => {
    switch (actionType) {
      case 'login': return <LogIn className="w-4 h-4 text-primary-500" />;
      case 'logout': return <LogOut className="w-4 h-4 text-blue-500" />;
      case 'create': return <FileText className="w-4 h-4 text-blue-500" />;
      case 'update': return <FileEdit className="w-4 h-4 text-amber-500" />;
      case 'delete': return <Trash2 className="w-4 h-4 text-red-500" />;
      case 'view': return <User className="w-4 h-4 text-neutral-500" />;
      case 'export': return <Download className="w-4 h-4 text-purple-500" />;
      case 'settings': return <Settings className="w-4 h-4 text-cyan-500" />;
      default: return <Shield className="w-4 h-4 text-neutral-500" />;
    }
  };

  const getActionBadge = (actionType: string) => {
    const config: Record<string, { variant: any; label: string }> = {
      login: { variant: 'default', label: t('reports.audits.login') || 'Login' },
      logout: { variant: 'outline', label: t('reports.audits.logout') || 'Logout' },
      create: { variant: 'default', label: t('reports.audits.create') || 'Create' },
      update: { variant: 'secondary', label: t('reports.audits.update') || 'Update' },
      delete: { variant: 'destructive', label: t('reports.audits.delete') || 'Delete' },
      view: { variant: 'outline', label: t('reports.audits.view') || 'View' },
      export: { variant: 'outline', label: t('reports.audits.export') || 'Export' },
      settings: { variant: 'outline', label: t('reports.audits.settings') || 'Settings' },
    };
    const c = config[actionType] || { variant: 'outline', label: actionType };
    return <Badge variant={c.variant as any}>{c.label}</Badge>;
  };

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900">{t('reports.audits.title')}</h1>
          <p className="text-neutral-500 mt-1">{t('reports.audits.subtitle')}</p>
        </div>
        <Button className="gap-2 bg-primary-500 hover:bg-primary-600">
          <Download className="w-4 h-4" />
          {t('reports.common.exportCSV')}
        </Button>
      </div>

      {/* Filters */}
      <Card className="border-0 shadow-sm">
        <CardContent className="p-5">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-neutral-700">{t('reports.audits.user')}</label>
              <Select value={userFilter} onValueChange={setUserFilter}>
                <SelectTrigger>
                  <SelectValue placeholder={t('reports.audits.selectUser')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t('reports.audits.selectAllUsers')}</SelectItem>
                  <SelectItem value="ahmed">{locale === 'ar' ? 'أحمد محمد' : 'Ahmed Mohammed'}</SelectItem>
                  <SelectItem value="saeed">{locale === 'ar' ? 'سعيد خالد' : 'Said Khalid'}</SelectItem>
                  <SelectItem value="abdullah">{locale === 'ar' ? 'عبدالله عمر' : 'Abdullah Omar'}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-neutral-700">{t('reports.audits.action')}</label>
              <Select value={actionFilter} onValueChange={setActionFilter}>
                <SelectTrigger>
                  <SelectValue placeholder={t('reports.audits.selectAction')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t('reports.audits.selectAllActions')}</SelectItem>
                  <SelectItem value="login">{t('reports.audits.login')}</SelectItem>
                  <SelectItem value="logout">{t('reports.audits.logout')}</SelectItem>
                  <SelectItem value="create">{t('reports.audits.create')}</SelectItem>
                  <SelectItem value="update">{t('reports.audits.update')}</SelectItem>
                  <SelectItem value="delete">{t('reports.audits.delete')}</SelectItem>
                  <SelectItem value="view">{t('reports.audits.view')}</SelectItem>
                  <SelectItem value="export">{t('reports.audits.export')}</SelectItem>
                  <SelectItem value="settings">{t('reports.audits.settings')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-neutral-700">{t('reports.common.fromDate')}</label>
              <Input type="date" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-neutral-700">{t('reports.common.toDate')}</label>
              <Input type="date" />
            </div>
          </div>
          <div className="mt-4 flex gap-2">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
              <Input
                placeholder={t('reports.common.search')}
                className="ps-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button variant="outline" className="gap-2">
              <Filter className="w-4 h-4" />
              {t('reports.common.apply')}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4 text-center">
            <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-2">
              <LogIn className="w-5 h-5 text-blue-500" />
            </div>
            <p className="text-2xl font-bold text-neutral-900">156</p>
            <p className="text-sm text-neutral-500">{t('reports.audits.logins')}</p>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4 text-center">
            <div className="w-10 h-10 bg-primary-50 rounded-full flex items-center justify-center mx-auto mb-2">
              <FileEdit className="w-5 h-5 text-primary-500" />
            </div>
            <p className="text-2xl font-bold text-neutral-900">89</p>
            <p className="text-sm text-neutral-500">{t('reports.audits.updates')}</p>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4 text-center">
            <div className="w-10 h-10 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-2">
              <User className="w-5 h-5 text-amber-500" />
            </div>
            <p className="text-2xl font-bold text-neutral-900">245</p>
            <p className="text-sm text-neutral-500">{t('reports.audits.views')}</p>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4 text-center">
            <div className="w-10 h-10 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-2">
              <AlertCircle className="w-5 h-5 text-red-500" />
            </div>
            <p className="text-2xl font-bold text-neutral-900">12</p>
            <p className="text-sm text-neutral-500">{t('reports.audits.deleted')}</p>
          </CardContent>
        </Card>
      </div>

      {/* Audit Log Table */}
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <FileText className="w-5 h-5 text-primary-500" />
            {t('reports.audits.table')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-neutral-50 border-b border-neutral-100">
                <tr>
                  <th className="text-start px-4 py-3 text-sm font-medium text-neutral-500">{t('reports.audits.user')}</th>
                  <th className="text-start px-4 py-3 text-sm font-medium text-neutral-500">{t('reports.audits.action')}</th>
                  <th className="text-start px-4 py-3 text-sm font-medium text-neutral-500">{t('reports.audits.entity')}</th>
                  <th className="text-start px-4 py-3 text-sm font-medium text-neutral-500">{t('reports.audits.entityId')}</th>
                  <th className="text-start px-4 py-3 text-sm font-medium text-neutral-500">{t('reports.audits.timestamp')}</th>
                  <th className="text-start px-4 py-3 text-sm font-medium text-neutral-500">IP</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {auditLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-neutral-50">
                    <td className="px-4 py-3">
                      <div>
                        <p className="font-medium text-neutral-900">{log.user}</p>
                        <p className="text-xs text-neutral-400">{log.userEmail}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        {getActionIcon(log.actionType)}
                        {getActionBadge(log.actionType)}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-neutral-600">{log.entity}</td>
                    <td className="px-4 py-3 text-neutral-500 font-mono text-sm">{log.entityId}</td>
                    <td className="px-4 py-3 text-neutral-600 text-sm">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-neutral-400" />
                        {format.dateTime(new Date(log.timestamp), { dateStyle: 'medium', timeStyle: 'short' })}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-neutral-500 font-mono text-sm">{log.ipAddress}</td>
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