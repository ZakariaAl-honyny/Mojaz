"use client";

/**
 * NotificationList Component
 * Modal displaying list of notifications with mark as read functionality
 */

import { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { X, Bell, Check, CheckCheck, Loader2 } from 'lucide-react';
import { useNotifications } from '@/hooks/useNotifications';
import { NotificationDto } from '@/types/notification.types';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface NotificationListProps {
  isOpen: boolean;
  onClose: () => void;
}

export function NotificationList({ isOpen, onClose }: NotificationListProps) {
  const t = useTranslations('notifications');
  const locale = useLocale();
  const isRTL = locale === 'ar';

  const {
    notifications,
    notificationsLoading,
    unreadCount,
    markAllAsRead,
    markAllAsReadLoading,
    markAsRead,
  } = useNotifications({ page: 1, pageSize: 50 });

  // For simple implementation, we pass locale as a prop from the parent
  // or use a different approach to detect direction

  if (!isOpen) return null;

  const handleMarkAllAsRead = () => {
    markAllAsRead();
  };

  const handleNotificationClick = (notification: NotificationDto) => {
    if (!notification.isRead) {
      markAsRead(notification.id);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(locale === 'ar' ? 'ar-SA' : 'en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/50"
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className={cn(
          'fixed start-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rtl:translate-x-1/2',
          'rounded-xl border border-neutral-200 bg-white shadow-xl',
          'dark:border-neutral-800 dark:bg-neutral-950',
          'max-h-[80vh] flex flex-col'
        )}
      >
        {/* Header */}
        <div
          className={cn(
            'flex items-center justify-between border-b border-neutral-200 px-4 py-3',
            'dark:border-neutral-800'
          )}
        >
          <div className="flex items-center gap-2">
            <Bell className="size-5 text-primary" />
            <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
              {t('title')}
            </h2>
            {unreadCount > 0 && (
              <span className="rounded-full bg-primary px-2 py-0.5 text-xs font-medium text-white">
                {unreadCount}
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className={cn(
              'rounded-lg p-1 text-neutral-500 hover:bg-neutral-100',
              'dark:text-neutral-400 dark:hover:bg-neutral-800',
              'transition-colors'
            )}
            aria-label="Close"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Actions */}
        {unreadCount > 0 && (
          <div
            className={cn(
              'border-b border-neutral-200 px-4 py-2',
              'dark:border-neutral-800'
            )}
          >
            <Button
              variant="ghost"
              size="sm"
              onClick={handleMarkAllAsRead}
              disabled={markAllAsReadLoading}
              className="gap-1.5 text-primary hover:text-primary/80"
            >
              {markAllAsReadLoading ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <CheckCheck className="size-4" />
              )}
              {t('markAllRead')}
            </Button>
          </div>
        )}

        {/* Notification List */}
        <div className="flex-1 overflow-y-auto">
          {notificationsLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="size-6 animate-spin text-primary" />
            </div>
          ) : notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-neutral-500">
              <Bell className="mb-2 size-8" />
              <p>{t('empty')}</p>
            </div>
          ) : (
            <ul className="divide-y divide-neutral-200 dark:divide-neutral-800">
              {notifications.map((notification) => (
                <li key={notification.id}>
                  <button
                    onClick={() => handleNotificationClick(notification)}
                    className={cn(
                      'w-full px-4 py-3 text-start transition-colors hover:bg-neutral-50',
                      'dark:hover:bg-neutral-900',
                      !notification.isRead && 'bg-primary/5'
                    )}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={cn(
                          'mt-1.5 size-2 shrink-0 rounded-full',
                          notification.isRead
                            ? 'bg-neutral-300 dark:bg-neutral-600'
                            : 'bg-primary'
                        )}
                      />
                      <div className="flex-1 space-y-1">
                        <p
                          className={cn(
                            'font-medium text-neutral-900 dark:text-neutral-100',
                            !notification.isRead && 'font-semibold'
                          )}
                        >
                          {isRTL ? notification.titleAr : notification.titleEn}
                        </p>
                        <p className="text-sm text-neutral-600 dark:text-neutral-400">
                          {isRTL ? notification.messageAr : notification.messageEn}
                        </p>
                        <p className="text-xs text-neutral-400">
                          {formatDate(notification.createdAt)}
                        </p>
                      </div>
                      {!notification.isRead && (
                        <Check className="size-4 text-primary" />
                      )}
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </>
  );
}
