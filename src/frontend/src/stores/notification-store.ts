import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Notification, NotificationPreferences, DeviceInfo } from '@/types/notification.types';

interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  preferences: NotificationPreferences | null;
  devices: DeviceInfo[];
  isLoading: boolean;
  error: string | null;
  
  // Actions
  setNotifications: (notifications: Notification[]) => void;
  setUnreadCount: (count: number) => void;
  setPreferences: (preferences: NotificationPreferences | null) => void;
  setDevices: (devices: DeviceInfo[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  addNotification: (notification: Notification) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  removeNotification: (id: string) => void;
}

export const useNotificationStore = create<NotificationState>()(
  persist(
    (set) => ({
      notifications: [],
      unreadCount: 0,
      preferences: null,
      devices: [],
      isLoading: false,
      error: null,

      setNotifications: (notifications) => set({ notifications }),
      setUnreadCount: (count) => set({ unreadCount: count }),
      setPreferences: (preferences) => set({ preferences }),
      setDevices: (devices) => set({ devices }),
      setLoading: (isLoading) => set({ isLoading }),
      setError: (error) => set({ error }),
      
      addNotification: (notification) => set((state) => ({
        notifications: [notification, ...state.notifications],
        unreadCount: state.unreadCount + 1,
      })),
      
      markAsRead: (id) => set((state) => {
        const notification = state.notifications.find(n => n.id === id);
        const wasUnread = notification && !notification.isRead;
        return {
          notifications: state.notifications.map(n => 
            n.id === id ? { ...n, isRead: true } : n
          ),
          unreadCount: wasUnread ? Math.max(0, state.unreadCount - 1) : state.unreadCount,
        };
      }),
      
      markAllAsRead: () => set((state) => ({
        notifications: state.notifications.map(n => ({ ...n, isRead: true })),
        unreadCount: 0,
      })),
      
      removeNotification: (id) => set((state) => {
        const notification = state.notifications.find(n => n.id === id);
        const wasUnread = notification && !notification.isRead;
        return {
          notifications: state.notifications.filter(n => n.id !== id),
          unreadCount: wasUnread ? Math.max(0, state.unreadCount - 1) : state.unreadCount,
        };
      }),
    }),
    {
      name: 'mojaz-notifications',
      partialize: (state) => ({ 
        notifications: state.notifications.slice(0, 50),
        unreadCount: state.unreadCount,
      }),
    }
  )
);