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
import { useTranslations } from 'next-intl';
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
  const t = useTranslations('reports');
  const { locale } = useParams();
  const isRTL = locale === 'ar';

  const [searchQuery, setSearchQuery] = useState('');
  const [actionFilter, setActionFilter] = useState('all');
  const [userFilter, setUserFilter] = useState('all');

  // Mock audit logs
  const auditLogs: AuditLog[] = [
    { id: '1', user: 'أحمد محمد', userEmail: 'ahmed@example.com', action: 'تسجيل الدخول', actionType: 'login', entity: 'النظام', entityId: '-', timestamp: '2025-02-01 09:15:23', ipAddress: '192.168.1.100', details: 'تسجيل دخول ناجح' },
    { id: '2', user: 'سعيد خالد', userEmail: 'saeed@example.com', action: 'تعديل طلب', actionType: 'update', entity: 'طلب', entityId: 'MOJ-2025-84729163', timestamp: '2025-02-01 09:45:12', ipAddress: '192.168.1.105', details: 'تحديث حالة الطلب إلى قيد المراجعة' },
    { id: '3', user: 'عبدالله عمر', userEmail: 'abdullah@example.com', action: 'إنشاء مستخدم', actionType: 'create', entity: 'مستخدم', entityId: 'USR-2025-001', timestamp: '2025-02-01 10:22:45', ipAddress: '192.168.1.110' },
    { id: '4', user: 'فاطمة علي', userEmail: 'fatima@example.com', action: 'تصدير تقرير', actionType: 'export', entity: 'تقرير', entityId: 'RPT-2025-002', timestamp: '2025-02-01 10:55:30', ipAddress: '192.168.1.115' },
    { id: '5', user: 'خالد إبراهيم', userEmail: 'khaled@example.com', action: 'حذف ملف', actionType: 'delete', entity: 'مستند', entityId: 'DOC-2025-045', timestamp: '2025-02-01 11:12:18', ipAddress: '192.168.1.120', details: 'حذف مستند غير صالح' },
    { id: '6', user: 'نورة محمد', userEmail: 'nora@example.com', action: 'تسجيل الخروج', actionType: 'logout', entity: 'النظام', entityId: '-', timestamp: '2025-02-01 11:45:00', ipAddress: '192.168.1.125' },
    { id: '7', user: 'أحمد محمد', userEmail: 'ahmed@example.com', action: 'تغيير الإعدادات', actionType: 'settings', entity: 'إعدادات النظام', entityId: '-', timestamp: '2025-02-01 12:05:33', ipAddress: '192.168.1.100', details: 'تفعيل إشعارات البريد الإلكتروني' },
    { id: '8', user: 'سعيد خالد', userEmail: 'saeed@example.com', action: 'مشاهدة طلب', actionType: 'view', entity: 'طلب', entityId: 'MOJ-2025-92837465', timestamp: '2025-02-01 12:30:45', ipAddress: '192.168.1.105' },
  ];

  const getActionIcon = (actionType: string) => {
    switch (actionType) {
      case 'login': return <LogIn className="w-4 h-4 text-green-500" />;
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
      login: { variant: 'default', label: locale === 'ar' ? 'تسجيل دخول' : 'Login' },
      logout: { variant: 'outline', label: locale === 'ar' ? 'تسجيل خروج' : 'Logout' },
      create: { variant: 'default', label: locale === 'ar' ? 'إنشاء' : 'Create' },
      update: { variant: 'secondary', label: locale === 'ar' ? 'تعديل' : 'Update' },
      delete: { variant: 'destructive', label: locale === 'ar' ? 'حذف' : 'Delete' },
      view: { variant: 'outline', label: locale === 'ar' ? 'عرض' : 'View' },
      export: { variant: 'outline', label: locale === 'ar' ? 'تصدير' : 'Export' },
      settings: { variant: 'outline', label: locale === 'ar' ? 'إعدادات' : 'Settings' },
    };
    const c = config[actionType] || { variant: 'outline', label: actionType };
    return <Badge variant={c.variant as any}>{c.label}</Badge>;
  };

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900">{t('audits.title')}</h1>
          <p className="text-neutral-500 mt-1">{t('audits.subtitle')}</p>
        </div>
        <Button className="gap-2 bg-primary-500 hover:bg-primary-600">
          <Download className="w-4 h-4" />
          {t('export.csv')}
        </Button>
      </div>

      {/* Filters */}
      <Card className="border-0 shadow-sm">
        <CardContent className="p-5">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-neutral-700">{t('audits.user')}</label>
              <Select value={userFilter} onValueChange={setUserFilter}>
                <SelectTrigger>
                  <SelectValue placeholder={locale === 'ar' ? 'اختر المستخدم' : 'Select User'} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{locale === 'ar' ? 'جميع المستخدمين' : 'All Users'}</SelectItem>
                  <SelectItem value="ahmed">أحمد محمد</SelectItem>
                  <SelectItem value="saeed">سعيد خالد</SelectItem>
                  <SelectItem value="abdullah">عبدالله عمر</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-neutral-700">{t('audits.action')}</label>
              <Select value={actionFilter} onValueChange={setActionFilter}>
                <SelectTrigger>
                  <SelectValue placeholder={locale === 'ar' ? 'اختر الإجراء' : 'Select Action'} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{locale === 'ar' ? 'جميع الإجراءات' : 'All Actions'}</SelectItem>
                  <SelectItem value="login">{locale === 'ar' ? 'تسجيل دخول' : 'Login'}</SelectItem>
                  <SelectItem value="logout">{locale === 'ar' ? 'تسجيل خروج' : 'Logout'}</SelectItem>
                  <SelectItem value="create">{locale === 'ar' ? 'إنشاء' : 'Create'}</SelectItem>
                  <SelectItem value="update">{locale === 'ar' ? 'تعديل' : 'Update'}</SelectItem>
                  <SelectItem value="delete">{locale === 'ar' ? 'حذف' : 'Delete'}</SelectItem>
                  <SelectItem value="view">{locale === 'ar' ? 'عرض' : 'View'}</SelectItem>
                  <SelectItem value="export">{locale === 'ar' ? 'تصدير' : 'Export'}</SelectItem>
                  <SelectItem value="settings">{locale === 'ar' ? 'إعدادات' : 'Settings'}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-neutral-700">{t('filters.fromDate')}</label>
              <Input type="date" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-neutral-700">{t('filters.toDate')}</label>
              <Input type="date" />
            </div>
          </div>
          <div className="mt-4 flex gap-2">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
              <Input 
                placeholder={locale === 'ar' ? 'البحث في السجلات...' : 'Search logs...'}
                className="ps-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button variant="outline" className="gap-2">
              <Filter className="w-4 h-4" />
              {locale === 'ar' ? 'تطبيق' : 'Apply'}
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
            <p className="text-sm text-neutral-500">{locale === 'ar' ? 'تسجيلات دخول' : 'Logins'}</p>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4 text-center">
            <div className="w-10 h-10 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-2">
              <FileEdit className="w-5 h-5 text-green-500" />
            </div>
            <p className="text-2xl font-bold text-neutral-900">89</p>
            <p className="text-sm text-neutral-500">{locale === 'ar' ? 'تعديلات' : 'Updates'}</p>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4 text-center">
            <div className="w-10 h-10 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-2">
              <User className="w-5 h-5 text-amber-500" />
            </div>
            <p className="text-2xl font-bold text-neutral-900">245</p>
            <p className="text-sm text-neutral-500">{locale === 'ar' ? 'مشاهدات' : 'Views'}</p>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4 text-center">
            <div className="w-10 h-10 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-2">
              <AlertCircle className="w-5 h-5 text-red-500" />
            </div>
            <p className="text-2xl font-bold text-neutral-900">12</p>
            <p className="text-sm text-neutral-500">{locale === 'ar' ? 'محذوفات' : 'Deleted'}</p>
          </CardContent>
        </Card>
      </div>

      {/* Audit Log Table */}
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <FileText className="w-5 h-5 text-primary-500" />
            {locale === 'ar' ? 'سجل التدقيق' : 'Audit Log'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-neutral-50 border-b border-neutral-100">
                <tr>
                  <th className="text-start px-4 py-3 text-sm font-medium text-neutral-500">{t('audits.user')}</th>
                  <th className="text-start px-4 py-3 text-sm font-medium text-neutral-500">{t('audits.action')}</th>
                  <th className="text-start px-4 py-3 text-sm font-medium text-neutral-500">{t('audits.entity')}</th>
                  <th className="text-start px-4 py-3 text-sm font-medium text-neutral-500">{locale === 'ar' ? 'العنصر' : 'Entity ID'}</th>
                  <th className="text-start px-4 py-3 text-sm font-medium text-neutral-500">{t('audits.timestamp')}</th>
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
                        {log.timestamp}
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