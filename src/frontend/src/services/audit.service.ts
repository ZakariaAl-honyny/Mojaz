import axios from '@/lib/api-client';

export interface AuditLogDto {
  id: string;
  userId?: string;
  userName?: string;
  userEmail?: string;
  actionType: string;
  entityName: string;
  entityId: string;
  timestamp: string;
  oldValues?: Record<string, unknown>;
  newValues?: Record<string, unknown>;
  ipAddress?: string;
  userAgent?: string;
}

export interface AuditLogResponse {
  auditLogs: AuditLogDto[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface AuditLogQueryRequest {
  entityName?: string;
  actionType?: string;
  userId?: string;
  fromDate?: string;
  toDate?: string;
  search?: string;
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortDir?: 'asc' | 'desc';
}

export const ACTION_TYPES = [
  { value: 'all', label: 'all' },
  { value: 'CREATE', label: 'create' },
  { value: 'UPDATE', label: 'update' },
  { value: 'DELETE', label: 'delete' },
  { value: 'LOGIN', label: 'login' },
  { value: 'LOGOUT', label: 'logout' },
  { value: 'VIEW', label: 'view' },
] as const;

export const ENTITY_TYPES = [
  { value: 'all', label: 'all' },
  { value: 'User', label: 'user' },
  { value: 'Application', label: 'application' },
  { value: 'License', label: 'license' },
  { value: 'Payment', label: 'payment' },
  { value: 'Appointment', label: 'appointment' },
  { value: 'SystemSetting', label: 'settings' },
] as const;

export const auditService = {
  async getAuditLogs(request: AuditLogQueryRequest): Promise<AuditLogResponse> {
    const params = new URLSearchParams();
    if (request.entityName && request.entityName !== 'all') params.append('entityName', request.entityName);
    if (request.actionType && request.actionType !== 'all') params.append('actionType', request.actionType);
    if (request.userId) params.append('userId', request.userId);
    if (request.fromDate) params.append('fromDate', request.fromDate);
    if (request.toDate) params.append('toDate', request.toDate);
    if (request.search) params.append('search', request.search);
    if (request.page) params.append('page', request.page.toString());
    if (request.pageSize) params.append('pageSize', request.pageSize.toString());
    if (request.sortBy) params.append('sortBy', request.sortBy);
    if (request.sortDir) params.append('sortDir', request.sortDir);

    const response = await axios.get<{ data: AuditLogResponse }>(`audit-logs?${params}`);
    return response.data.data;
  },

  async getAuditLogById(id: number): Promise<AuditLogDto> {
    const response = await axios.get<{ data: AuditLogDto }>(`audit-logs/${id}`);
    return response.data.data;
  },
};

export default auditService;