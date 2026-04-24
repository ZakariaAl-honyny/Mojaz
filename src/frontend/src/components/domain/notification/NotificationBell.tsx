"use client";

import { useState } from 'react';
import { Bell } from 'lucide-react';
import { useNotifications } from '@/hooks/useNotifications';
import { NotificationList } from './NotificationList';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

interface NotificationBellProps {
  className?: string;
}

export function NotificationBell({ className }: NotificationBellProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { unreadCount } = useNotifications();

  return (
    <>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        type="button"
        className={cn(
          'relative flex items-center justify-center rounded-2xl w-12 h-12 transition-all duration-300 font-arabic',
          'bg-neutral-50 text-neutral-400 hover:bg-blue-50 hover:text-[#1a3a8f] hover:shadow-xl hover:shadow-blue-900/5',
          className
        )}
        onClick={() => setIsOpen(true)}
        aria-label="التنبيهات"
        title="التنبيهات"
      >
        <Bell className="w-6 h-6 stroke-[2.5px]" />
        
        <AnimatePresence>
          {unreadCount > 0 && (
            <motion.span
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              className="absolute -top-1 -end-1 flex min-w-[22px] h-[22px] px-1.5 items-center justify-center rounded-full bg-[#1a3a8f] text-[10px] font-black text-white ring-4 ring-white shadow-lg shadow-blue-900/20"
            >
              {unreadCount > 99 ? '99+' : unreadCount}
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>

      <NotificationList isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}
