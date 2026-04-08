/**
 * Notification Service
 * API client for Unified Notification Service
 */

import apiClient from '@/lib/api-client';
import { ApiResponse } from '@/types/api.types';
import {
  NotificationDto,
  NotificationListResponse,
  UnreadCountResponse,
  MarkAllReadResponse,
} from '@/types/notification.types';

export const notificationService = {
  /**
   * Get paginated list of notifications for the authenticated user
   */
  async getNotifications(
    page: number = 1,
    pageSize: number = 20
  ): Promise<ApiResponse<NotificationListResponse>> {
    const response = await apiClient.get<ApiResponse<NotificationListResponse>>(
      '/notifications',
      {
        params: { page, pageSize },
      }
    );
    return response.data;
  },

  /**
   * Get unread notifications count (for polling)
   */
  async getUnreadCount(): Promise<ApiResponse<UnreadCountResponse>> {
    const response = await apiClient.get<ApiResponse<UnreadCountResponse>>(
      '/notifications/unread-count'
    );
    return response.data;
  },

  /**
   * Mark all notifications as read
   */
  async markAllAsRead(): Promise<ApiResponse<MarkAllReadResponse>> {
    const response = await apiClient.patch<ApiResponse<MarkAllReadResponse>>(
      '/notifications/read-all'
    );
    return response.data;
  },

  /**
   * Mark a single notification as read
   */
  async markAsRead(notificationId: number): Promise<ApiResponse<void>> {
    const response = await apiClient.patch<ApiResponse<void>>(
      `/notifications/${notificationId}/read`
    );
    return response.data;
  },
};
