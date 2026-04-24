"use client";

import { useNotifications } from '@/hooks/useNotifications';
import { NotificationDto } from '@/types/notification.types';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { X, Bell, Check, CheckCheck, Loader2, Inbox, CalendarClock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface NotificationListProps {
  isOpen: boolean;
  onClose: () => void;
}

export function NotificationList({ isOpen, onClose }: NotificationListProps) {
  const {
    notifications,
    notificationsLoading,
    unreadCount,
    markAllAsRead,
    markAllAsReadLoading,
    markAsRead,
  } = useNotifications({ page: 1, pageSize: 50 });

  if (!isOpen) return null;

  const handleNotificationClick = (notification: NotificationDto) => {
    if (!notification.isRead) {
      markAsRead(notification.id);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ar-YE', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] bg-blue-950/20 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: -20, x: '50%' }}
        animate={{ opacity: 1, scale: 1, y: 0, x: '50%' }}
        exit={{ opacity: 0, scale: 0.95, y: -20, x: '50%' }}
        className={cn(
          'fixed end-1/2 top-24 z-[101] w-full max-w-lg -translate-x-1/2 font-arabic',
          'rounded-[2.5rem] border border-blue-50/50 bg-white shadow-[0_30px_100px_-20px_rgba(26,58,143,0.15)]',
          'max-h-[75vh] flex flex-col overflow-hidden'
        )}
        dir="rtl"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-8 py-8 border-b border-neutral-50">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-[#1a3a8f]">
               <Bell className="w-6 h-6 stroke-[2.5px]" />
            </div>
            <div>
               <h2 className="text-xl font-black text-neutral-900">مركز التنبيهات</h2>
               <p className="text-xs font-bold text-neutral-400 mt-0.5">تابع آخر مستجدات طلباتك</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-xl flex items-center justify-center text-neutral-300 hover:bg-neutral-50 hover:text-neutral-900 transition-all"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Actions bar if there are unread notifications */}
        {unreadCount > 0 && (
          <div className="px-8 py-3 bg-blue-50/30 flex items-center justify-between border-b border-blue-50/50">
            <span className="text-[10px] font-black text-[#1a3a8f] uppercase tracking-widest">
              لديك {unreadCount} تنبيهات غير مقروءة
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => markAllAsRead()}
              disabled={markAllAsReadLoading}
              className="h-8 rounded-lg text-[10px] font-black text-[#1a3a8f] hover:bg-blue-50 flex items-center gap-2"
            >
              {markAllAsReadLoading ? (
                <Loader2 className="w-3 h-3 animate-spin" />
              ) : (
                <CheckCheck className="w-3 h-3" />
              )}
              تحديد الكل كمقروء
            </Button>
          </div>
        )}

        {/* Notification List Scrollable Area */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-2">
          {notificationsLoading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <Loader2 className="w-8 h-8 animate-spin text-[#1a3a8f]" />
              <p className="text-xs font-black text-neutral-300 uppercase tracking-widest animate-pulse">جاري التحميل...</p>
            </div>
          ) : notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="w-20 h-20 rounded-[2rem] bg-neutral-50 flex items-center justify-center mb-6">
                 <Inbox className="w-10 h-10 text-neutral-200" />
              </div>
              <h3 className="text-lg font-black text-neutral-900">صندوق التنبيهات فارغ</h3>
              <p className="text-xs font-bold text-neutral-400 mt-2">لا توجد تنبيهات حالياً في حسابك</p>
            </div>
          ) : (
            <ul className="space-y-3">
              {notifications.map((notification) => (
                <li key={notification.id}>
                  <button
                    onClick={() => handleNotificationClick(notification)}
                    className={cn(
                      'w-full p-6 text-right rounded-[2rem] transition-all duration-300 group',
                      notification.isRead 
                        ? 'bg-transparent hover:bg-neutral-50' 
                        : 'bg-blue-50/50 hover:bg-blue-50 ring-1 ring-blue-100/20 shadow-lg shadow-blue-900/5'
                    )}
                  >
                    <div className="flex items-start gap-4">
                      <div className={cn(
                        "w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 transition-all duration-500",
                        notification.isRead ? "bg-neutral-50 text-neutral-300" : "bg-white text-[#1a3a8f] shadow-md shadow-blue-900/5"
                      )}>
                         <Bell className={cn("w-5 h-5", !notification.isRead && "animate-bounce group-hover:animate-none")} />
                      </div>
                      
                      <div className="flex-1 space-y-1.5">
                        <div className="flex items-center justify-between">
                           <h4 className={cn(
                             "text-base font-black tracking-tight",
                             notification.isRead ? "text-neutral-500" : "text-[#1a3a8f]"
                           )}>
                             {notification.titleAr}
                           </h4>
                           {!notification.isRead && (
                             <div className="w-2 h-2 rounded-full bg-[#1a3a8f] animate-pulse" />
                           )}
                        </div>
                        
                        <p className={cn(
                          "text-sm font-bold leading-relaxed",
                          notification.isRead ? "text-neutral-400" : "text-neutral-600"
                        )}>
                          {notification.messageAr}
                        </p>
                        
                        <div className="flex items-center gap-2 pt-2">
                           <CalendarClock className="w-3 h-3 text-neutral-300" />
                           <span className="text-[10px] font-black text-neutral-300 tracking-wider">
                             {formatDate(notification.createdAt)}
                           </span>
                        </div>
                      </div>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
        
        {/* Footer */}
        <div className="p-8 bg-neutral-50/50 border-t border-neutral-50 text-center">
           <p className="text-[10px] font-black text-neutral-300 uppercase tracking-[0.2em]">الإدارة العامة للمرور - محافظة صنعاء</p>
        </div>
      </motion.div>
    </>
  );
}
