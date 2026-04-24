'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Bell,
  CreditCard,
  Calendar,
  FileText,
  Settings,
  Check,
  Trash2,
  Filter,
  Search,
  Smartphone,
  Mail,
  Monitor,
  RefreshCw,
  Clock,
  ShieldCheck,
  Zap,
  Info,
  CheckCircle2,
  AlertTriangle,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { useNotificationStore } from '@/stores/notification-store';
import { notificationService } from '@/services/notification.service';
import type { NotificationType } from '@/types/notification.types';
import { motion, AnimatePresence } from 'framer-motion';

const getNotificationIcon = (type: NotificationType, className?: string) => {
  switch (type) {
    case 'payment':
      return <CreditCard className={cn("w-5 h-5", className)} />;
    case 'appointment':
      return <Calendar className={cn("w-5 h-5", className)} />;
    case 'status':
      return <FileText className={cn("w-5 h-5", className)} />;
    case 'system':
      return <Settings className={cn("w-5 h-5", className)} />;
    default:
      return <Bell className={cn("w-5 h-5", className)} />;
  }
};

const getIconBgColor = (type: NotificationType) => {
  switch (type) {
    case 'payment':
      return "bg-emerald-50 text-emerald-600 border-emerald-100";
    case 'appointment':
      return "bg-blue-50 text-[#1a3a8f] border-blue-100";
    case 'status':
      return "bg-amber-50 text-amber-600 border-amber-100";
    case 'system':
      return "bg-neutral-50 text-neutral-600 border-neutral-100";
    default:
      return "bg-blue-50 text-[#1a3a8f] border-blue-100";
  }
};

type FilterType = 'all' | 'unread' | 'payment' | 'appointment' | 'status' | 'system';

export default function NotificationsPage() {
  const [filter, setFilter] = useState<FilterType>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch notifications from API
  const { data: notificationsData, isLoading } = useQuery({
    queryKey: ['notifications'],
    queryFn: () => notificationService.getNotifications(1, 50),
  });

  const apiNotifications = notificationsData?.data?.items ?? [];

  const { notifications: storeNotifications, unreadCount, markAsRead, markAllAsRead, removeNotification } = useNotificationStore();

  // Use API notifications if available, fallback to store notifications or empty
  const displayNotifications = apiNotifications.length > 0 
    ? apiNotifications 
    : storeNotifications.length > 0 
      ? storeNotifications 
      : [];
      
  const actualUnreadCount = unreadCount > 0 
    ? unreadCount 
    : displayNotifications.filter((n: any) => !n.isRead).length;

  const filteredNotifications = displayNotifications.filter(n => {
    if (filter === 'unread' && n.isRead) return false;
    if (filter !== 'all' && filter !== 'unread' && n.type !== filter) return false;
    if (searchQuery) {
      return n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        n.message.toLowerCase().includes(searchQuery.toLowerCase());
    }
    return true;
  });

  const formatRelTime = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diff = now.getTime() - date.getTime();
    const mins = Math.floor(diff / 60000);
    const hours = Math.floor(mins / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `منذ ${days} يوم`;
    if (hours > 0) return `منذ ${hours} ساعة`;
    if (mins > 0) return `منذ ${mins} دقيقة`;
    return 'الآن';
  };

  return (
    <div className="space-y-10 font-arabic pb-12" dir="rtl">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-end md:justify-between gap-8 px-4">
         <div className="flex items-center gap-6">
            <div className="w-1.5 h-16 bg-[#1a3a8f] rounded-full shadow-lg shadow-blue-900/20" />
            <div>
              <h1 className="text-2xl md:text-3xl font-black text-neutral-900 tracking-tight leading-none mb-3">
                مركز التنبيهات السيادي
              </h1>
              <p className="text-neutral-500 font-bold text-sm max-w-xl leading-relaxed">
                قائد توجيه الإشعارات والمتابعة اللحظية لتحديثات معاملاتك الرسمية.
              </p>
            </div>
         </div>
         <div className="flex items-center gap-3">
            <Button 
              variant="outline" 
              className="h-16 px-8 rounded-2xl font-black gap-2 border-neutral-200 bg-white hover:bg-neutral-50 transition-all shadow-sm"
              onClick={() => markAllAsRead()}
              disabled={actualUnreadCount === 0}
            >
              <CheckCircle2 className="w-5 h-5 text-emerald-500" />
              أرشفة كقراءة
            </Button>
            <Button variant="ghost" className="h-16 w-16 rounded-2xl text-rose-500 hover:bg-rose-50 border border-transparent hover:border-rose-100 transition-all">
               <Trash2 className="w-6 h-6" />
            </Button>
         </div>
      </header>

      {/* Toolbar */}
      <div className="flex flex-col xl:flex-row gap-6 justify-between bg-white border border-neutral-200 p-8 rounded-[2.5rem] shadow-sm mx-4">
         <div className="relative flex-1 group max-w-xl">
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 group-focus-within:text-[#1a3a8f] transition-colors" />
            <Input
              placeholder="البحث في الأرشيف المرجعي..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pr-12 h-12 border-neutral-100 bg-neutral-50/50 focus:bg-white focus:ring-4 focus:ring-blue-100 transition-all rounded-xl font-bold text-sm text-right"
            />
         </div>

         <div className="flex items-center gap-2 flex-wrap">
            {[
              { id: 'all', label: 'الكل', count: displayNotifications.length },
              { id: 'unread', label: 'غير مقروء', count: actualUnreadCount },
              { id: 'payment', label: 'مالية', icon: CreditCard },
              { id: 'appointment', label: 'مواعيد', icon: Calendar },
              { id: 'status', label: 'طلبات', icon: FileText },
            ].map((tab) => (
              <Button
                key={tab.id}
                onClick={() => setFilter(tab.id as FilterType)}
                className={cn(
                  "h-10 px-5 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all gap-2 border",
                  filter === tab.id 
                    ? "bg-[#1a3a8f] text-white border-[#1a3a8f] shadow-lg shadow-blue-900/10" 
                    : "bg-white text-neutral-400 border-neutral-100 hover:bg-neutral-50 shadow-none"
                )}
              >
                {tab.icon && <tab.icon className="w-3.5 h-3.5 opacity-60" />}
                {tab.label}
                {tab.count !== undefined && (
                  <span className={cn(
                    "min-w-[1.25rem] h-4.5 px-1 rounded-md flex items-center justify-center text-[8px] font-black",
                    filter === tab.id ? "bg-white/20 text-white" : "bg-neutral-100 text-neutral-400"
                  )}>
                    {tab.count}
                  </span>
                )}
              </Button>
            ))}
         </div>
      </div>

{/* Notifications Grid */}
      <div className="grid grid-cols-1 gap-4 px-4 pb-12">
        <AnimatePresence mode="popLayout">
          {filteredNotifications.length > 0 ? (
            filteredNotifications.map((n, idx) => (
              <motion.div
                key={n.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.2, delay: idx * 0.03 }}
              >
                <Card
                  className={cn(
                    "border border-neutral-200 shadow-sm rounded-[2rem] transition-all hover:shadow-xl hover:border-[#1a3a8f]/20 cursor-pointer bg-white group relative overflow-hidden",
                    !n.isRead && "ring-1 ring-blue-100/50 bg-blue-50/20"
                  )}
                  onClick={() => markAsRead(n.id)}
                >
                  <CardContent className="p-7">
                    <div className="flex items-start gap-6">
                      <div className={cn(
                        "w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 border shadow-sm group-hover:scale-105 transition-transform duration-500",
                        getIconBgColor(n.type)
                      )}>
                        {getNotificationIcon(n.type, "w-7 h-7")}
                      </div>

                      <div className="flex-1 space-y-2 text-right">
                        <div className="flex items-center justify-between gap-4">
                          <div className="flex items-center gap-3">
                            <h3 className={cn(
                              "text-lg font-black tracking-tight",
                              n.isRead ? "text-neutral-500" : "text-[#1a3a8f]"
                            )}>
                              {n.title}
                            </h3>
                            {!n.isRead && (
                              <Badge className="bg-[#1a3a8f] text-white px-2 py-0.5 rounded-lg font-black text-[9px] uppercase tracking-widest leading-none">جديد</Badge>
                            )}
                          </div>
                          <span className="text-[10px] font-black text-neutral-300 flex items-center gap-2 shrink-0 tracking-widest uppercase">
                            <Clock className="w-3.5 h-3.5" />
                            {formatRelTime(n.createdAt)}
                          </span>
                        </div>
                        <p className={cn(
                          "text-base font-bold leading-relaxed max-w-3xl",
                          n.isRead ? "text-neutral-400" : "text-neutral-600"
                        )}>
                          {n.message}
                        </p>
                      </div>

                      {!n.isRead && (
                        <div className="absolute top-4 left-4 w-2 h-2 bg-[#1a3a8f] rounded-full animate-pulse shadow-[0_0_8px_rgba(26,58,143,0.4)]" />
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))
          ) : (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-24 text-center mx-4">
              <Card className="border border-neutral-200 border-dashed bg-neutral-50/50 rounded-[3rem] p-16">
                <div className="w-20 h-20 bg-white rounded-3xl shadow-xl flex items-center justify-center mx-auto mb-6 border border-neutral-100">
                  <Bell className="w-10 h-10 text-neutral-200" />
                </div>
                <h3 className="text-xl font-black text-neutral-400 italic">سجل التنبيهات خالٍ تماماً</h3>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="flex justify-center pt-4 opacity-30 select-none">
         <div className="flex items-center gap-4 py-3 px-6 rounded-full border border-neutral-200">
            <ShieldCheck className="w-4 h-4" />
            <span className="text-[10px] font-black uppercase tracking-[0.25em]">المركز الوطني للإشعارات - نظام المتابعة السيادي</span>
         </div>
      </div>
    </div>
  );
}