'use client';

/**
 * useNotifications Hook
 * React Query — SINGLE SOURCE OF TRUTH for all notification state.
 *
 * Mutations use optimistic updates to update the local cache immediately,
 * then reconcile with the server response. This prevents the bell badge
 * and unread count from diverging from what the server reports.
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { notificationService } from '@/services/notification.service';
import type { ApiResponse } from '@/types/api.types';
import type { NotificationListResponse, NotificationDto } from '@/types/notification.types';

// Polling interval for unread count (30 seconds)
const UNREAD_COUNT_POLL_INTERVAL = 30_000;

export const NOTIFICATION_KEYS = {
  all:        ['notifications'] as const,
  list:       (page: number, pageSize: number) => ['notifications', 'list', page, pageSize] as const,
  unreadCount: ['notifications', 'unread-count'] as const,
};

export const useNotifications = (options?: {
  page?: number;
  pageSize?: number;
  enabled?: boolean;
}) => {
  const queryClient = useQueryClient();
  const { page = 1, pageSize = 20, enabled = true } = options || {};

  // ── Query: paginated notifications list ──────────────────────────────────
  const notificationsQuery = useQuery<ApiResponse<NotificationListResponse>>({
    queryKey: NOTIFICATION_KEYS.list(page, pageSize),
    queryFn:  () => notificationService.getNotifications(page, pageSize),
    enabled,
    staleTime: 30_000,
  });

  // ── Query: unread count with polling ─────────────────────────────────────
  const unreadCountQuery = useQuery({
    queryKey: NOTIFICATION_KEYS.unreadCount,
    queryFn:  () => notificationService.getUnreadCount(),
    enabled,
    refetchInterval: UNREAD_COUNT_POLL_INTERVAL,
    staleTime: UNREAD_COUNT_POLL_INTERVAL,
  });

  // ── Mutation: mark all as read (optimistic) ───────────────────────────────
  const markAllAsReadMutation = useMutation({
    mutationFn: () => notificationService.markAllAsRead(),
    onMutate: async () => {
      // Cancel in-flight refetches to avoid overwriting optimistic update
      await queryClient.cancelQueries({ queryKey: NOTIFICATION_KEYS.all });

      // Optimistically set unread count to 0
      queryClient.setQueryData(NOTIFICATION_KEYS.unreadCount, (old: any) =>
        old ? { ...old, data: { count: 0 } } : old
      );

      // Optimistically mark all notifications in every page cache as read
      queryClient.setQueriesData<ApiResponse<NotificationListResponse>>(
        { queryKey: ['notifications', 'list'] },
        (old) => {
          if (!old?.data?.items) return old;
          return {
            ...old,
            data: {
              ...old.data,
              items: old.data.items.map((n: NotificationDto) => ({ ...n, isRead: true })),
            },
          };
        }
      );
    },
    onError: () => {
      // Roll back on failure
      queryClient.invalidateQueries({ queryKey: NOTIFICATION_KEYS.all });
    },
    onSettled: () => {
      // Always reconcile with server after mutation
      queryClient.invalidateQueries({ queryKey: NOTIFICATION_KEYS.all });
    },
  });

  // ── Mutation: mark single notification as read (optimistic) ───────────────
  const markAsReadMutation = useMutation({
    mutationFn: (notificationId: number) => notificationService.markAsRead(notificationId),
    onMutate: async (notificationId: number) => {
      await queryClient.cancelQueries({ queryKey: NOTIFICATION_KEYS.all });

      // Optimistically decrement unread count
      queryClient.setQueryData(NOTIFICATION_KEYS.unreadCount, (old: any) => {
        if (!old?.data) return old;
        return { ...old, data: { count: Math.max(0, (old.data.count ?? 0) - 1) } };
      });

      // Optimistically mark the specific notification as read in list cache
      queryClient.setQueriesData<ApiResponse<NotificationListResponse>>(
        { queryKey: ['notifications', 'list'] },
        (old) => {
          if (!old?.data?.items) return old;
          return {
            ...old,
            data: {
              ...old.data,
              items: old.data.items.map((n: NotificationDto) =>
                n.id === notificationId ? { ...n, isRead: true } : n
              ),
            },
          };
        }
      );
    },
    onError: () => {
      queryClient.invalidateQueries({ queryKey: NOTIFICATION_KEYS.all });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: NOTIFICATION_KEYS.all });
    },
  });

  return {
    // List
    notifications:        notificationsQuery.data?.data?.items ?? [],
    notificationsLoading: notificationsQuery.isLoading,
    notificationsError:   notificationsQuery.error,
    notificationsRefetch: notificationsQuery.refetch,

    // Unread count (server-authoritative, polled every 30s)
    unreadCount:        unreadCountQuery.data?.data?.count ?? 0,
    unreadCountLoading: unreadCountQuery.isLoading,
    unreadCountError:   unreadCountQuery.error,

    // Mutations
    markAllAsRead:        markAllAsReadMutation.mutate,
    markAllAsReadLoading: markAllAsReadMutation.isPending,
    markAllAsReadError:   markAllAsReadMutation.error,

    markAsRead:        markAsReadMutation.mutate,
    markAsReadLoading: markAsReadMutation.isPending,
    markAsReadError:   markAsReadMutation.error,
  };
};
