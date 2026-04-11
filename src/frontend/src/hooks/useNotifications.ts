'use client';

/**
 * useNotifications Hook
 * React Query hook with polling for Unified Notification Service
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { notificationService } from '@/services/notification.service';
import { NotificationListResponse } from '@/types/notification.types';

// Polling interval for unread count (30 seconds)
const UNREAD_COUNT_POLL_INTERVAL = 30000;

export const useNotifications = (options?: {
  page?: number;
  pageSize?: number;
  enabled?: boolean;
}) => {
  const queryClient = useQueryClient();
  const { page = 1, pageSize = 20, enabled = true } = options || {};

  // Query: Get paginated notifications list
  const notificationsQuery = useQuery({
    queryKey: ['notifications', page, pageSize],
    queryFn: () => notificationService.getNotifications(page, pageSize),
    enabled,
    staleTime: 30000, // 30 seconds
  });

  // Query: Get unread count with polling
  const unreadCountQuery = useQuery({
    queryKey: ['notifications', 'unread-count'],
    queryFn: () => notificationService.getUnreadCount(),
    enabled,
    refetchInterval: UNREAD_COUNT_POLL_INTERVAL,
    staleTime: 10000, // 10 seconds - allow faster refetch
  });

  // Mutation: Mark all as read
  const markAllAsReadMutation = useMutation({
    mutationFn: () => notificationService.markAllAsRead(),
    onSuccess: () => {
      // Invalidate and refetch both queries to update UI
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });

  // Mutation: Mark single notification as read
  const markAsReadMutation = useMutation({
    mutationFn: (notificationId: number) =>
      notificationService.markAsRead(notificationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });

  return {
    // Notifications list query
    notifications: notificationsQuery.data?.data?.items ?? [],
    notificationsLoading: notificationsQuery.isLoading,
    notificationsError: notificationsQuery.error,
    notificationsRefetch: notificationsQuery.refetch,

    // Unread count query with polling
    unreadCount: unreadCountQuery.data?.data?.count ?? 0,
    unreadCountLoading: unreadCountQuery.isLoading,
    unreadCountError: unreadCountQuery.error,
    unreadCountRefetch: unreadCountQuery.refetch,

    // Mutations
    markAllAsRead: markAllAsReadMutation.mutate,
    markAllAsReadLoading: markAllAsReadMutation.isPending,
    markAllAsReadError: markAllAsReadMutation.error,

    markAsRead: markAsReadMutation.mutate,
    markAsReadLoading: markAsReadMutation.isPending,
    markAsReadError: markAsReadMutation.error,
  };
};
