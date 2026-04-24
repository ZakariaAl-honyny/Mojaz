'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { auditService, AuditLogDto, ACTION_TYPES, ENTITY_TYPES, AuditLogQueryRequest } from '@/services/audit.service';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { useLocale, useTranslations } from '@/lib/static-translations';
import { 
  History, 
  Search, 
  ChevronLeft, 
  ChevronRight, 
  Loader2, 
  Info, 
  Eye,
  Calendar,
  Filter,
  X,
  Clock,
  User,
  HardDrive,
  ArrowRightLeft,
  Monitor,
  Globe,
} from 'lucide-react';
import { cn } from '@/lib/utils';

function AuditLogsTableComponent() {
  const t = useTranslations('admin');
  const locale = useLocale();
  const isRTL = locale === 'ar';

  const [logs, setLogs] = useState<AuditLogDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // Filter states
  const [search, setSearch] = useState('');
  const [actionFilter, setActionFilter] = useState('');
  const [entityFilter, setEntityFilter] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  // Detail modal state
  const [selectedLog, setSelectedLog] = useState<AuditLogDto | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);

  // Debounced search
  const [debouncedSearch, setDebouncedSearch] = useState('');

  // Watch for search changes with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1); // Reset to first page on search
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  // Fetch data
  useEffect(() => {
    let isMounted = true;

    const fetchLogs = async () => {
      try {
        setLoading(true);
        const request: AuditLogQueryRequest = {
          search: debouncedSearch || undefined,
          actionType: actionFilter || undefined,
          entityName: entityFilter || undefined,
          fromDate: fromDate || undefined,
          toDate: toDate || undefined,
          page,
          pageSize: 20,
          sortBy: 'timestamp',
          sortDir: 'desc',
        };
        const response = await auditService.getAuditLogs(request);
        if (isMounted) {
          setLogs(response.auditLogs);
          setTotalPages(response.totalPages);
          setTotalCount(response.totalCount);
        }
      } catch (error) {
        console.error('Failed to load audit logs:', error);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchLogs();

    return () => {
      isMounted = false;
    };
  }, [page, actionFilter, entityFilter, fromDate, toDate, debouncedSearch]);

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleString(locale === 'ar' ? 'ar-SA' : 'en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleViewDetails = async (log: AuditLogDto) => {
    setSelectedLog(log);
  };

  const resetFilters = () => {
    setSearch('');
    setActionFilter('');
    setEntityFilter('');
    setFromDate('');
    setToDate('');
    setPage(1);
  };

  const getActionBadgeStyle = (actionType: string) => {
    switch (actionType.toUpperCase()) {
      case 'CREATE':
        return 'bg-emerald-50 text-emerald-600 border-emerald-100';
      case 'UPDATE':
        return 'bg-blue-50 text-blue-600 border-blue-100';
      case 'DELETE':
        return 'bg-red-50 text-red-600 border-red-100';
      case 'LOGIN':
      case 'LOGOUT':
        return 'bg-amber-50 text-amber-600 border-amber-100';
      case 'VIEW':
        return 'bg-neutral-50 text-neutral-600 border-neutral-100';
      default:
        return 'bg-neutral-50 text-neutral-600 border-neutral-100';
    }
  };

  const renderValueDiff = useCallback((
    oldValue: unknown,
    newValue: unknown,
    fieldName: string
  ) => {
    const oldStr = JSON.stringify(oldValue, null, 2);
    const newStr = JSON.stringify(newValue, null, 2);
    const hasChanged = oldStr !== newStr;

    return (
      <div key={fieldName} className={cn(
        "p-3 rounded-lg border",
        hasChanged ? "bg-amber-50/50 border-amber-200" : "bg-neutral-50 border-neutral-100"
      )}>
        <div className="flex items-start gap-3">
          <div className="flex-1 min-w-0">
            <div className="text-xs font-mono text-neutral-500 mb-1">
              {t('audits.detail.oldValue')}
            </div>
            <pre className={cn(
              "text-xs p-2 rounded font-mono overflow-x-auto",
              hasChanged ? "text-neutral-600 bg-white" : "text-neutral-400"
            )}>
              {oldStr || '-'}
            </pre>
          </div>
          <ArrowRightLeft className={cn(
            "w-4 h-4 mt-4 shrink-0",
            hasChanged ? "text-amber-500" : "text-neutral-300"
          )} />
          <div className="flex-1 min-w-0">
            <div className="text-xs font-mono text-neutral-500 mb-1">
              {t('audits.detail.newValue')}
            </div>
            <pre className={cn(
              "text-xs p-2 rounded font-mono overflow-x-auto",
              hasChanged ? "text-emerald-600 bg-white" : "text-neutral-400"
            )}>
              {newStr || '-'}
            </pre>
          </div>
        </div>
      </div>
    );
  }, [t]);

  const changesCount = useMemo(() => {
    if (!selectedLog?.oldValues || !selectedLog?.newValues) return 0;
    return Object.keys(selectedLog.newValues).length;
  }, [selectedLog]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-[#1a3a8f]/10 rounded-2xl flex items-center justify-center shadow-inner">
          <History className="h-6 w-6 text-[#1a3a8f]" />
        </div>
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-neutral-900 leading-tight">
            {t('audits.title')}
          </h1>
          <p className="text-sm font-bold text-neutral-400 mt-1">
            {t('audits.subtitle')}
          </p>
        </div>
      </div>

      {/* Filters Card */}
      <Card className="border-0 shadow-xl shadow-blue-900/5 bg-white rounded-2xl overflow-hidden">
        <CardHeader className="pb-4 pt-6 bg-neutral-50/30">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className={cn(
                "absolute top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400",
                isRTL ? "left-4" : "right-4"
              )} />
              <Input
                placeholder={t('audits.searchPlaceholder')}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className={cn(
                  "h-11 bg-white border-neutral-200 rounded-xl focus:ring-2 focus:ring-[#1a3a8f]/5 focus:border-[#1a3a8f]/30 transition-all font-medium",
                  isRTL ? "ps-11" : "pe-11"
                )}
              />
            </div>

            {/* Filter Controls */}
            <div className="flex flex-wrap items-center gap-3">
              {/* Action Type Filter */}
              <Select value={actionFilter} onValueChange={setActionFilter}>
                <SelectTrigger className="w-36 h-10 rounded-lg border-neutral-200 bg-white">
                  <SelectValue placeholder={t('audits.filters.actionType')} />
                </SelectTrigger>
                <SelectContent>
                  {ACTION_TYPES.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.value ? t(`audits.actions.${type.label}`) : t('audits.filters.all')}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Entity Type Filter */}
              <Select value={entityFilter} onValueChange={setEntityFilter}>
                <SelectTrigger className="w-36 h-10 rounded-lg border-neutral-200 bg-white">
                  <SelectValue placeholder={t('audits.filters.entityType')} />
                </SelectTrigger>
                <SelectContent>
                  {ENTITY_TYPES.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.value ? t(`audits.entities.${type.label}`) : t('audits.filters.all')}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Date Range */}
              <div className="flex items-center gap-2">
                <Input
                  type="date"
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                  className="w-36 h-10 rounded-lg border-neutral-200 bg-white text-sm"
                  placeholder={t('audits.filters.from')}
                />
                <span className="text-neutral-400">-</span>
                <Input
                  type="date"
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                  className="w-36 h-10 rounded-lg border-neutral-200 bg-white text-sm"
                  placeholder={t('audits.filters.to')}
                />
              </div>

              {/* Reset Button */}
              <Button
                variant="outline"
                size="sm"
                onClick={resetFilters}
                className="h-10 px-3 rounded-lg border-neutral-200"
              >
                <X className="w-4 h-4 me-1" />
                {t('audits.filters.reset')}
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-4">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-16 space-y-4">
              <Loader2 className="h-8 w-8 animate-spin text-[#1a3a8f]" />
              <p className="text-sm font-medium text-neutral-500">
                {t('audits.loading')}
              </p>
              <div className="w-full max-w-2xl space-y-3">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Skeleton key={i} className="h-14 w-full rounded-lg" />
                ))}
              </div>
            </div>
          ) : logs.length === 0 ? (
            <div className="text-center py-16 text-neutral-500">
              <Info className="h-12 w-12 mx-auto mb-4 text-neutral-300" />
              <p className="text-lg font-medium">{t('audits.noLogs')}</p>
            </div>
          ) : (
            <>
              {/* Table */}
              <div className="rounded-xl border border-neutral-100 bg-white overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-neutral-50/50 border-b border-neutral-100">
                      <TableHead className="text-xs font-black uppercase tracking-widest text-neutral-400 text-start py-4 px-4">
                        {t('audits.date')}
                      </TableHead>
                      <TableHead className="text-xs font-black uppercase tracking-widest text-neutral-400 text-start py-4 px-4">
                        {t('audits.user')}
                      </TableHead>
                      <TableHead className="text-xs font-black uppercase tracking-widest text-neutral-400 text-start py-4 px-4">
                        {t('audits.entity')}
                      </TableHead>
                      <TableHead className="text-xs font-black uppercase tracking-widest text-neutral-400 text-start py-4 px-4">
                        {t('audits.action')}
                      </TableHead>
                      <TableHead className="text-xs font-black uppercase tracking-widest text-neutral-400 text-start py-4 px-4">
                        {t('audits.details')}
                      </TableHead>
                      <TableHead className="w-12 py-4 px-2" />
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {logs.map((log) => (
                      <TableRow 
                        key={log.id} 
                        className="hover:bg-blue-50/30 transition-all border-b border-neutral-50 last:border-0"
                      >
                        <TableCell className="py-4 px-4">
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-neutral-400" />
                            <div>
                              <div className="text-sm font-medium text-neutral-800">
                                {formatDate(log.timestamp).split(',')[0]}
                              </div>
                              <div className="text-xs text-neutral-400">
                                {formatDate(log.timestamp).split(',')[1]}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="py-4 px-4">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-neutral-100 flex items-center justify-center text-xs font-bold text-neutral-500 border border-neutral-200">
                              {log.userName?.charAt(0) || 'ن'}
                            </div>
                            <span className="text-sm font-medium text-neutral-700">
                              {log.userName || 'نظام'}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="py-4 px-4">
                          <Badge variant="outline" className="font-mono text-xs font-medium bg-neutral-50 border-neutral-200 rounded-md px-2">
                            {log.entityName}
                          </Badge>
                          <div className="text-xs text-neutral-400 mt-1 truncate max-w-[100px]">
                            {log.entityId}
                          </div>
                        </TableCell>
                        <TableCell className="py-4 px-4">
                          <span className={cn(
                            "px-3 py-1.5 rounded-lg text-xs font-bold tracking-wider uppercase",
                            getActionBadgeStyle(log.actionType)
                          )}>
                            {t(`audits.actions.${log.actionType.toLowerCase()}`)}
                          </span>
                        </TableCell>
                        <TableCell className="py-4 px-4">
                          <div className="flex items-center gap-2 text-xs text-neutral-400">
                            {log.ipAddress && (
                              <span className="flex items-center gap-1">
                                <Globe className="w-3 h-3" />
                                {log.ipAddress}
                              </span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="py-4 px-2">
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            onClick={() => handleViewDetails(log)}
                            className="w-8 h-8 rounded-lg hover:bg-[#1a3a8f]/10"
                          >
                            <Eye className="w-4 h-4 text-neutral-500" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between mt-6 pt-4 border-t border-neutral-100">
                  <div className="text-sm font-medium text-neutral-500">
                    {t('audits.details')}: {totalCount} {t('audits.title').toLowerCase()}
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={page === 1}
                      className="gap-2 h-9"
                    >
                      <ChevronLeft className="w-4 h-4 rtl:rotate-180" />
                      {t('audits.previous')}
                    </Button>
                    <div className="text-sm font-medium text-neutral-600 px-3">
                      {page} / {totalPages}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                      disabled={page === totalPages}
                      className="gap-2 h-9"
                    >
                      {t('audits.next')}
                      <ChevronRight className="w-4 h-4 rtl:rotate-180" />
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Detail Modal */}
      <Dialog open={!!selectedLog} onOpenChange={(open) => !open && setSelectedLog(null)}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Eye className="w-5 h-5 text-[#1a3a8f]" />
              {t('audits.detail.title')}
            </DialogTitle>
            <DialogDescription>
              {selectedLog?.entityName} - {selectedLog?.entityId}
            </DialogDescription>
          </DialogHeader>

          {selectedLog && (
            <div className="space-y-6 py-4">
              {/* Metadata */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-3 rounded-lg bg-neutral-50 border border-neutral-100">
                  <div className="flex items-center gap-2 text-xs text-neutral-500 mb-1">
                    <User className="w-3 h-3" />
                    {t('audits.detail.user')}
                  </div>
                  <div className="text-sm font-medium text-neutral-800">
                    {selectedLog.userName || 'نظام'}
                  </div>
                  {selectedLog.userEmail && (
                    <div className="text-xs text-neutral-400">
                      {selectedLog.userEmail}
                    </div>
                  )}
                </div>

                <div className="p-3 rounded-lg bg-neutral-50 border border-neutral-100">
                  <div className="flex items-center gap-2 text-xs text-neutral-500 mb-1">
                    <Globe className="w-3 h-3" />
                    {t('audits.detail.ipAddress')}
                  </div>
                  <div className="text-sm font-medium text-neutral-800 font-mono">
                    {selectedLog.ipAddress || '-'}
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-neutral-50 border border-neutral-100">
                  <div className="flex items-center gap-2 text-xs text-neutral-500 mb-1">
                    <Monitor className="w-3 h-3" />
                    {t('audits.detail.userAgent')}
                  </div>
                  <div className="text-xs text-neutral-600 truncate" title={selectedLog.userAgent || ''}>
                    {selectedLog.userAgent || '-'}
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-neutral-50 border border-neutral-100">
                  <div className="flex items-center gap-2 text-xs text-neutral-500 mb-1">
                    <Clock className="w-3 h-3" />
                    {t('audits.detail.timestamp')}
                  </div>
                  <div className="text-sm font-medium text-neutral-800">
                    {formatDate(selectedLog.timestamp)}
                  </div>
                </div>
              </div>

              {/* Action & Entity */}
              <div className="flex items-center gap-4">
                <div className="px-4 py-2 rounded-lg bg-neutral-100 border border-neutral-200">
                  <div className="text-xs text-neutral-500">{t('audits.detail.action')}</div>
                  <div className={cn(
                    "text-sm font-bold uppercase",
                    getActionBadgeStyle(selectedLog.actionType)
                  )}>
                    {t(`audits.actions.${selectedLog.actionType.toLowerCase()}`)}
                  </div>
                </div>
                <div className="px-4 py-2 rounded-lg bg-neutral-100 border border-neutral-200">
                  <div className="text-xs text-neutral-500">{t('audits.detail.entity')}</div>
                  <div className="text-sm font-bold text-neutral-800">
                    {selectedLog.entityName}
                  </div>
                </div>
                <div className="px-4 py-2 rounded-lg bg-neutral-100 border border-neutral-200 flex-1">
                  <div className="text-xs text-neutral-500">{t('audits.detail.entityId')}</div>
                  <div className="text-sm font-bold text-neutral-800 font-mono">
                    {selectedLog.entityId}
                  </div>
                </div>
              </div>

              {/* Changes */}
              <div>
                <div className="text-sm font-bold text-neutral-800 mb-3 flex items-center gap-2">
                  <ArrowRightLeft className="w-4 h-4" />
                  {t('audits.detail.changes')} ({changesCount})
                </div>
                {selectedLog.oldValues && selectedLog.newValues ? (
                  <div className="space-y-2">
                    {Object.entries(selectedLog.newValues as Record<string, unknown>).map(([key, value]) => 
                      renderValueDiff(
                        selectedLog.oldValues?.[key],
                        value,
                        key
                      )
                    )}
                  </div>
                ) : (
                  <div className="text-sm text-neutral-400 p-4 text-center rounded-lg border border-dashed border-neutral-200">
                    {t('audits.detail.noChanges')}
                  </div>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default function AuditLogsPage() {
  return <AuditLogsTableComponent />;
}