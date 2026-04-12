'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
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
  RefreshCw
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { useNotificationStore } from '@/stores/notification-store';
import type { NotificationType } from '@/types/notification.types';

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
      return "bg-green-100 text-green-600";
    case 'appointment':
      return "bg-blue-100 text-blue-600";
    case 'status':
      return "bg-amber-100 text-amber-600";
    case 'system':
      return "bg-neutral-100 text-neutral-600";
    default:
      return "bg-primary-100 text-primary-500";
  }
};

const mockNotifications = [
  {
    id: '1',
    userId: 'user1',
    title: 'Payment Received',
    titleAr: 'تم استلام الدفع',
    message: 'Your payment of SAR 100 has been processed successfully. You can now proceed to the medical examination.',
    messageAr: 'تمت معالجة دفعة قدرها 100 ريال بنجاح. يمكنك الآن المتابعة للفحص الطبي.',
    type: 'payment' as NotificationType,
    isRead: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
  },
  {
    id: '2',
    userId: 'user1',
    title: 'Appointment Reminder',
    titleAr: 'تذكير بالموعد',
    message: 'You have a medical examination tomorrow at 9:00 AM at the Riyadh Center. Please arrive 15 minutes early.',
    messageAr: 'لديك فحص طبي غداً الساعة التاسعة صباحاً في مركز الرياض. يرجى الوصول قبل 15 دقيقة.',
    type: 'appointment' as NotificationType,
    isRead: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
  },
  {
    id: '3',
    userId: 'user1',
    title: 'Application Status Update',
    titleAr: 'تحديث حالة الطلب',
    message: 'Your application MOJ-2025-12345678 has been approved. You can now proceed to the payment stage.',
    messageAr: 'تم اعتماد طلبك MOJ-2025-12345678. يمكنك الآن المتابعة لمرحلة الدفع.',
    type: 'status' as NotificationType,
    isRead: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
  },
  {
    id: '4',
    userId: 'user1',
    title: 'Medical Results Available',
    titleAr: 'النتائج الطبية متاحة',
    message: 'Your medical examination results are ready. Please check your application for details.',
    messageAr: 'نتائج فحصك الطبي جاهزة. يرجى التحقق من طلبك للتفاصيل.',
    type: 'status' as NotificationType,
    isRead: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
  },
  {
    id: '5',
    userId: 'user1',
    title: 'System Maintenance',
    titleAr: 'صيانة النظام',
    message: 'The system will be under maintenance on Sunday from 2:00 AM to 6:00 AM. Some services may be unavailable.',
    messageAr: 'سيكون النظام قيد الصيانة يوم الأحد من الساعة 2:00 صباحاً إلى 6:00 صباحاً. قد تكون بعض الخدمات غير متاحة.',
    type: 'system' as NotificationType,
    isRead: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
  },
];

type FilterType = 'all' | 'unread' | 'payment' | 'appointment' | 'status' | 'system';

export default function NotificationsPage() {
  const t = useTranslations('notification');
  const [filter, setFilter] = useState<FilterType>('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  const { notifications, unreadCount, markAsRead, markAllAsRead, removeNotification } = useNotificationStore();
  
  const displayNotifications = notifications.length > 0 ? notifications : mockNotifications;
  const actualUnreadCount = unreadCount > 0 ? unreadCount : displayNotifications.filter(n => !n.isRead).length;

  const filteredNotifications = displayNotifications.filter(n => {
    // Apply type filter
    if (filter === 'unread' && n.isRead) return false;
    if (filter !== 'all' && filter !== 'unread' && n.type !== filter) return false;
    
    // Apply search
    if (searchQuery) {
      return n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
             n.message.toLowerCase().includes(searchQuery.toLowerCase());
    }
    
    return true;
  });

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatFullDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">{t('title')}</h1>
          <p className="text-neutral-500 mt-1">{t('subtitle')}</p>
        </div>
        <div className="flex items-center gap-3">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => markAllAsRead()}
            disabled={actualUnreadCount === 0}
          >
            <Check className="w-4 h-4 me-2" />
            {t('markAllRead')}
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            className="text-error hover:bg-error/10"
          >
            <Trash2 className="w-4 h-4 me-2" />
            {t('deleteOld')}
          </Button>
        </div>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute start-4 top-3 h-4 w-4 text-neutral-400" />
              <Input
                placeholder={t('search')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="ps-10"
              />
            </div>
            
            {/* Filter Tabs */}
            <div className="flex items-center gap-2 flex-wrap">
              <Button
                variant={filter === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilter('all')}
              >
                {t('all')}
                <Badge variant="secondary" className="ms-2">{displayNotifications.length}</Badge>
              </Button>
              <Button
                variant={filter === 'unread' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilter('unread')}
              >
                {t('unread')}
                {actualUnreadCount > 0 && (
                  <Badge variant="secondary" className="ms-2">{actualUnreadCount}</Badge>
                )}
              </Button>
              <Button
                variant={filter === 'payment' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilter('payment')}
              >
                <CreditCard className="w-3 h-3 me-1" />
                {t('types.payment')}
              </Button>
              <Button
                variant={filter === 'appointment' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilter('appointment')}
              >
                <Calendar className="w-3 h-3 me-1" />
                {t('types.appointment')}
              </Button>
              <Button
                variant={filter === 'status' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilter('status')}
              >
                <FileText className="w-3 h-3 me-1" />
                {t('types.status')}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notifications List */}
      <div className="space-y-3">
        {filteredNotifications.length === 0 ? (
          <Card>
            <CardContent className="py-16 text-center">
              <Bell className="w-16 h-16 text-neutral-200 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-neutral-600">{t('noNotifications')}</h3>
              <p className="text-neutral-400 mt-2">{t('noNotificationsDesc')}</p>
            </CardContent>
          </Card>
        ) : (
          filteredNotifications.map((notification) => (
            <Card 
              key={notification.id}
              className={cn(
                "transition-all hover:shadow-md cursor-pointer",
                !notification.isRead && "border-primary-200 bg-primary-50/30"
              )}
              onClick={() => markAsRead(notification.id)}
            >
              <CardContent className="p-4 sm:p-5">
                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div className={cn(
                    "w-12 h-12 rounded-xl flex items-center justify-center shrink-0",
                    getIconBgColor(notification.type)
                  )}>
                    {getNotificationIcon(notification.type)}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className={cn(
                        "font-semibold text-base",
                        !notification.isRead && "text-neutral-900",
                        notification.isRead && "text-neutral-500"
                      )}>
                        {notification.title}
                      </h3>
                      <Badge 
                        variant={notification.type === 'payment' ? 'default' : 
                                notification.type === 'appointment' ? 'secondary' : 
                                'outline'}
                        className="text-xs"
                      >
                        {t(`types.${notification.type}`)}
                      </Badge>
                    </div>
                    <p className={cn(
                      "text-sm mt-2",
                      notification.isRead ? "text-neutral-400" : "text-neutral-600"
                    )}>
                      {notification.message}
                    </p>
                    <p className="text-xs text-neutral-300 mt-3 flex items-center gap-2">
                      <span>{formatTime(notification.createdAt)}</span>
                      {!notification.isRead && (
                        <span className="w-1.5 h-1.5 bg-primary-500 rounded-full" />
                      )}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 shrink-0">
                    {!notification.isRead && (
                      <span className="w-3 h-3 bg-primary-500 rounded-full" />
                    )}
                    <Button
                      variant="ghost"
                      size="icon-xs"
                      className="text-neutral-400 hover:text-error"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeNotification(notification.id);
                      }}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}