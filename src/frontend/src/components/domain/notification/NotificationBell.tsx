"use client";

/**
 * NotificationBell Component
 * Displays bell icon with unread count badge and opens notification list on click
 */

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Bell } from 'lucide-react';
import { useNotifications } from '@/hooks/useNotifications';
import { NotificationList } from './NotificationList';
import { cn } from '@/lib/utils';

interface NotificationBellProps {
  className?: string;
}

export function NotificationBell({ className }: NotificationBellProps) {
  const t = useTranslations('navigation');
  const [isOpen, setIsOpen] = useState(false);
  const { unreadCount } = useNotifications();

  const handleOpen = () => {
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <>
      <button
        type="button"
        className={cn(
          'relative inline-flex items-center justify-center rounded-lg p-2',
          'text-neutral-600 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-800',
          'transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary',
          className
        )}
        onClick={handleOpen}
        aria-label={t('notifications')}
        title={t('notifications')}
      >
        <Bell className="size-5" />
        {unreadCount > 0 && (
          <span
            className={cn(
              'absolute -me-1 -mt-1 flex size-5 items-center justify-center',
              'rounded-full bg-primary text-[10px] font-bold text-white',
              'ring-2 ring-background'
            )}
          >
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      <NotificationList isOpen={isOpen} onClose={handleClose} />
    </>
  );
}
