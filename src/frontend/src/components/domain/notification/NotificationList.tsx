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
          'gov-glass-panel rounded-[2rem] border border-white/10 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.6)]',
          'max-h-[80vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-300'
        )}
      >
        {/* Header */}
        <div
          className={cn(
            'flex items-center justify-between border-b border-white/5 px-6 py-5',
            'bg-white/[0.02]'
          )}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary-600/20 flex items-center justify-center">
               <Bell className="size-5 text-primary-400" />
            </div>
            <div>
              <h2 className="text-lg font-black text-white tracking-tight">
                {t('title')}
              </h2>
              {unreadCount > 0 && (
                <p className="text-[10px] font-bold text-primary-500 uppercase tracking-widest">
                  {unreadCount} {t('unread')}
                </p>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            className={cn(
              'w-8 h-8 rounded-full flex items-center justify-center text-neutral-500 hover:text-white hover:bg-white/5',
              'transition-all duration-300'
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
              'border-b border-white/5 px-6 py-3',
              'bg-primary-600/5'
            )}
          >
            <Button
              variant="ghost"
              size="sm"
              onClick={handleMarkAllAsRead}
              disabled={markAllAsReadLoading}
              className="h-9 px-4 gap-2 text-primary-400 hover:text-primary-300 hover:bg-primary-400/10 rounded-xl font-bold text-xs"
            >
              {markAllAsReadLoading ? (
                <Loader2 className="size-3.5 animate-spin" />
              ) : (
                <CheckCheck className="size-3.5" />
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
                      'w-full px-6 py-5 text-start transition-all duration-300 hover:bg-white/[0.03]',
                      !notification.isRead && 'bg-primary-600/[0.02] border-s-2 border-primary-500'
                    )}
                  >
                    <div className="flex items-start gap-4">
                      <div
                        className={cn(
                          'mt-1.5 size-2 shrink-0 rounded-full',
                          notification.isRead
                            ? 'bg-neutral-700'
                            : 'bg-primary-500 shadow-[0_0_10px_rgba(30,58,138,0.5)]'
                        )}
                      />
                      <div className="flex-1 space-y-1">
                        <p
                          className={cn(
                            'text-[15px] font-black text-white leading-tight',
                            !notification.isRead && 'text-primary-400'
                          )}
                        >
                          {isRTL ? notification.titleAr : notification.titleEn}
                        </p>
                        <p className="text-sm text-neutral-400 leading-relaxed">
                          {isRTL ? notification.messageAr : notification.messageEn}
                        </p>
                        <p className="text-[10px] font-bold text-neutral-600 uppercase tracking-widest pt-1">
                          {formatDate(notification.createdAt)}
                        </p>
                      </div>
                      {!notification.isRead && (
                        <Check className="size-4 text-primary-500 mt-1" />
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
