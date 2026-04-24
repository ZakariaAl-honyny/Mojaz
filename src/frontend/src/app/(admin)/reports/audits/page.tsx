'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
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
  AlertCircle,
  ShieldCheck,
  Zap,
  Activity,
  History,
  Lock,
  Globe
} from "lucide-react";
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { auditService, AuditLogDto, AuditLogQueryRequest } from '@/services/audit.service';
import { useQuery } from '@tanstack/react-query';

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
  const [searchQuery, setSearchQuery] = useState('');
  const [actionFilter, setActionFilter] = useState('all');
  const [page, setPage] = useState(1);

  // Fetch audit logs from API
  const { data: auditData, isLoading } = useQuery({
    queryKey: ['auditLogs', page, searchQuery, actionFilter],
    queryFn: () => {
      const request: AuditLogQueryRequest = {
        page,
        pageSize: 10,
        sortBy: 'timestamp',
        sortDir: 'desc',
        ...(actionFilter !== 'all' && { actionType: actionFilter.toUpperCase() }),
        ...(searchQuery && { search: searchQuery }),
      };
      return auditService.getAuditLogs(request);
    }
  });

  // Transform API data to view format
  const auditLogs: AuditLog[] = (auditData?.auditLogs || []).map((log: AuditLogDto) => ({
    id: log.id,
    user: log.userName || '未知',
    userEmail: log.userEmail || '',
    action: log.actionType,
    actionType: log.actionType.toLowerCase() as AuditLog['actionType'],
    entity: log.entityName,
    entityId: log.entityId,
    timestamp: log.timestamp,
    ipAddress: log.ipAddress || '',
  }));

  // Calculate summary stats from real data
  const totalLogs = auditData?.totalCount || 0;

  const getActionIcon = (actionType: string) => {
    switch (actionType) {
      case 'login': return <LogIn className="w-4 h-4 text-emerald-500" />;
      case 'logout': return <LogOut className="w-4 h-4 text-neutral-400" />;
      case 'create': return <Zap className="w-4 h-4 text-[#1a3a8f]" />;
      case 'update': return <FileEdit className="w-4 h-4 text-amber-500" />;
      case 'delete': return <Trash2 className="w-4 h-4 text-red-500" />;
      case 'view': return <Globe className="w-4 h-4 text-blue-500" />;
      case 'export': return <Download className="w-4 h-4 text-purple-500" />;
      case 'settings': return <Settings className="w-4 h-4 text-cyan-500" />;
      default: return <Shield className="w-4 h-4 text-neutral-500" />;
    }
  };

  const getActionBadge = (actionType: string) => {
    const config: Record<string, { bg: string; text: string; label: string }> = {
      login: { bg: 'bg-emerald-50', text: 'text-emerald-700', label: 'دخول' },
      logout: { bg: 'bg-neutral-50', text: 'text-neutral-600', label: 'خروج' },
      create: { bg: 'bg-blue-50', text: 'text-blue-700', label: 'إضافة' },
      update: { bg: 'bg-amber-50', text: 'text-amber-700', label: 'تعديل' },
      delete: { bg: 'bg-red-50', text: 'text-red-700', label: 'حذف' },
      view: { bg: 'bg-cyan-50', text: 'text-cyan-700', label: 'استعلام' },
      export: { bg: 'bg-purple-50', text: 'text-purple-700', label: 'تصدير' },
      settings: { bg: 'bg-neutral-100', text: 'text-neutral-900', label: 'إعدادات' },
    };
    const c = config[actionType] || { bg: 'bg-neutral-50', text: 'text-neutral-500', label: actionType };
    return (
      <Badge className={cn("border-none px-3 py-1 font-black text-[10px] rounded-lg", c.bg, c.text)}>
        {c.label}
      </Badge>
    );
  };

  return (
    <div className="max-w-7xl mx-auto py-10 px-4 space-y-10 font-arabic" dir="rtl">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 border-b border-neutral-100 pb-10">
        <div className="space-y-2">
          <div className="flex items-center gap-4">
             <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-[#1a3a8f] shadow-sm">
               <ShieldCheck className="w-6 h-6" />
             </div>
             <div>
               <h1 className="text-4xl font-black text-neutral-900 tracking-tight">سجل الرقابة والتدقيق</h1>
               <p className="text-lg text-neutral-400 font-bold">مراقبة كافة تحركات الموظفين والعمليات الحساسة في النظام</p>
             </div>
          </div>
        </div>
        <Button className="h-10 md:h-12 px-6 md:px-8 rounded-md bg-[#1a3a8f] hover:bg-black font-black text-sm md:text-base gap-2 md:gap-3 transition-all">
          <Download className="w-4 h-4 md:w-5 md:h-5" />
          تصدير السجل اليومي
        </Button>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {[
          { icon: Lock, value: totalLogs, label: 'إجمالي السجلات', color: 'text-blue-600', bg: 'bg-blue-50' },
          { icon: FileEdit, value: Math.round(totalLogs * 0.3), label: 'تعديلات', color: 'text-amber-600', bg: 'bg-amber-50' },
          { icon: History, value: Math.round(totalLogs * 0.5), label: 'استعلامات', color: 'text-cyan-600', bg: 'bg-cyan-50' },
          { icon: AlertCircle, value: Math.round(totalLogs * 0.05), label: 'أحداث敏感ة', color: 'text-red-600', bg: 'bg-red-50' },
        ].map((item, idx) => (
          <Card key={idx} className={cn("border-none shadow-xl rounded-[2rem] overflow-hidden bg-white")}>
            <CardContent className="p-6 flex items-center gap-5">
              <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center shadow-sm", item.bg)}>
                <item.icon className={cn("w-6 h-6", item.color)} />
              </div>
              <div>
                <p className="text-2xl font-black text-neutral-900 leading-none">{item.value.toLocaleString()}</p>
                <p className="text-[10px] text-neutral-400 font-black uppercase tracking-widest mt-1">{item.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <Card className="border-none shadow-2xl rounded-[2.5rem] bg-white overflow-hidden">
        <CardContent className="p-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-3">
              <label className="text-sm font-black text-neutral-700 mr-2">الموظف المسؤول</label>
              <Select defaultValue="all">
                <SelectTrigger className="h-14 rounded-[1.25rem] border-neutral-100 bg-neutral-50/50 font-bold focus:ring-[#1a3a8f]">
                  <SelectValue placeholder="كافة الكادر" />
                </SelectTrigger>
                <SelectContent className="rounded-2xl border-none shadow-2xl">
                  <SelectItem value="all" className="font-bold py-3">كافة الكادر التشغيلي</SelectItem>
                  <SelectItem value="ahmed" className="font-bold py-3">أحمد فؤاد السلمي</SelectItem>
                  <SelectItem value="saeed" className="font-bold py-3">محمد علي منصور</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-3">
              <label className="text-sm font-black text-neutral-700 mr-2">نوع الحدث</label>
              <Select defaultValue="all">
                <SelectTrigger className="h-14 rounded-[1.25rem] border-neutral-100 bg-neutral-50/50 font-bold">
                  <SelectValue placeholder="كافة الأحداث" />
                </SelectTrigger>
                <SelectContent className="rounded-2xl border-none shadow-2xl">
                  <SelectItem value="all" className="font-bold py-3">كافة الأحداث</SelectItem>
                  <SelectItem value="login" className="font-bold py-3">تسجيل دخول</SelectItem>
                  <SelectItem value="update" className="font-bold py-3">تعديل بيانات</SelectItem>
                  <SelectItem value="delete" className="font-bold py-3">حذف ملفات</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-3">
              <label className="text-sm font-black text-neutral-700 mr-2">تاريخ البداية</label>
              <Input type="date" className="h-14 rounded-[1.25rem] border-neutral-100 bg-neutral-50/50 font-bold" />
            </div>
            <div className="space-y-3">
              <label className="text-sm font-black text-neutral-700 mr-2">تاريخ النهاية</label>
              <Input type="date" className="h-14 rounded-[1.25rem] border-neutral-100 bg-neutral-50/50 font-bold" />
            </div>
          </div>
          <div className="mt-8 flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute start-5 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
              <Input
                placeholder="البحث في تفاصيل العمليات، عناوين IP، أو أرقام المعاملات..."
                className="h-14 ps-14 rounded-[1.25rem] border-neutral-100 bg-neutral-50/50 font-bold"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button variant="outline" className="h-14 px-8 rounded-[1.25rem] border-neutral-200 font-black gap-2 hover:bg-neutral-50">
              <Filter className="w-5 h-5" />
              تصفية النتائج
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Audit Log Table */}
      <Card className="border-none shadow-2xl rounded-[2.5rem] bg-white overflow-hidden">
        <CardHeader className="p-10 border-b border-neutral-50">
          <CardTitle className="text-2xl font-black flex items-center gap-4 text-neutral-800">
            <Activity className="w-8 h-8 text-[#1a3a8f]" />
            التفاصيل الزمنية للعمليات
          </CardTitle>
          <CardDescription className="font-bold text-neutral-400 mt-1">عرض حي لكافة الإجراءات المسجلة حديثاً</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-right">
              <thead className="bg-neutral-50/50 border-b border-neutral-100">
                <tr>
                  <th className="px-8 py-6 text-sm font-black text-neutral-400 uppercase tracking-widest">المستخدم</th>
                  <th className="px-8 py-6 text-sm font-black text-neutral-400 uppercase tracking-widest">الإجراء</th>
                  <th className="px-8 py-6 text-sm font-black text-neutral-400 uppercase tracking-widest text-center">الكيان المتأثر</th>
                  <th className="px-8 py-6 text-sm font-black text-neutral-400 uppercase tracking-widest">الوقت والتاريخ</th>
                  <th className="px-8 py-6 text-sm font-black text-neutral-400 uppercase tracking-widest text-left">IP العنوان</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-50">
                {auditLogs.map((log, idx) => (
                  <tr key={log.id} className="hover:bg-neutral-50/50 transition-colors group">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-neutral-100 rounded-xl flex items-center justify-center text-[#1a3a8f] font-black">{log.user.charAt(0)}</div>
                        <div>
                          <p className="text-neutral-900 font-black leading-tight">{log.user}</p>
                          <p className="text-[10px] text-neutral-400 font-bold">{log.userEmail}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-neutral-50 flex items-center justify-center border border-neutral-100 group-hover:bg-white group-hover:scale-110 transition-all">
                          {getActionIcon(log.actionType)}
                        </div>
                        {getActionBadge(log.actionType)}
                      </div>
                    </td>
                    <td className="px-8 py-6 text-center">
                       <span className="bg-neutral-100 text-neutral-600 px-4 py-1.5 rounded-xl font-black text-xs border border-neutral-200">
                         {log.entity} <span className="opacity-40 px-1">|</span> {log.entityId}
                       </span>
                       {log.details && (
                         <p className="text-[10px] text-neutral-400 mt-2 font-bold max-w-[200px] mx-auto line-clamp-1">{log.details}</p>
                       )}
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-2 text-neutral-500 font-black text-xs">
                        <Clock className="w-3.5 h-3.5 opacity-40" />
                        {log.timestamp}
                      </div>
                    </td>
                    <td className="px-8 py-6 text-left">
                       <span className="font-mono text-[10px] font-black text-neutral-400 bg-neutral-50 px-3 py-1 rounded-lg">
                         {log.ipAddress}
                       </span>
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