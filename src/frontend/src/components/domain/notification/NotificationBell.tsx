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
          'relative inline-flex items-center justify-center rounded-xl p-2.5',
          'bg-white/5 border border-white/10 text-white hover:bg-white/10',
          'transition-all duration-300 active:scale-95 group',
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
              'absolute -top-1 -right-1 flex size-5 items-center justify-center',
              'rounded-full bg-primary-600 text-[10px] font-black text-white',
              'ring-2 ring-neutral-950 shadow-lg shadow-primary-900/50',
              'animate-in zoom-in duration-300 pulse-glow'
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
