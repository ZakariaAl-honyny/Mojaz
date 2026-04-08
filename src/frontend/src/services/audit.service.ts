import axios from '@/lib/api-client';

export interface AuditLogDto {
  id: string;
  userId?: string;
  userName?: string;
  actionType: string;
  entityName: string;
  entityId: string;
  payload: string;
  timestamp: string;
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
  fromDate?: string;
  toDate?: string;
  page?: number;
  pageSize?: number;
}

export const auditService = {
  async getAuditLogs(request: AuditLogQueryRequest): Promise<AuditLogResponse> {
    const params = new URLSearchParams();
    if (request.entityName) params.append('entityName', request.entityName);
    if (request.actionType) params.append('actionType', request.actionType);
    if (request.fromDate) params.append('fromDate', request.fromDate);
    if (request.toDate) params.append('toDate', request.toDate);
    if (request.page) params.append('page', request.page.toString());
    if (request.pageSize) params.append('pageSize', request.pageSize.toString());

    const response = await axios.get<{ data: AuditLogResponse }>(`/api/v1/audit-logs?${params}`);
    return response.data.data;
  },
};

export default auditService;