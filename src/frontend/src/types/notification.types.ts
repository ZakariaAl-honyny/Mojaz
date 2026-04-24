/**
 * Notification Types
 * Unified Notification Service - TypeScript definitions
 */

export interface NotificationDto {
  id: number;
  titleAr: string;
  titleEn: string;
  messageAr: string;
  messageEn: string;
  eventType: NotificationEventType;
  isRead: boolean;
  createdAt: string;
  applicationId?: number;
}

// Notification type for UI filtering and display
export type NotificationType = 'payment' | 'appointment' | 'status' | 'system';

export enum NotificationEventType {
  ApplicationStatusChanged = 'ApplicationStatusChanged',
  PaymentReceived = 'PaymentReceived',
  MedicalExamScheduled = 'MedicalExamScheduled',
  MedicalExamCompleted = 'MedicalExamCompleted',
  TheoryTestScheduled = 'TheoryTestScheduled',
  TheoryTestCompleted = 'TheoryTestCompleted',
  PracticalTestScheduled = 'PracticalTestScheduled',
  PracticalTestCompleted = 'PracticalTestCompleted',
  LicenseIssued = 'LicenseIssued',
  DocumentRequired = 'DocumentRequired',
  AppointmentReminder = 'AppointmentReminder',
}

export interface NotificationListResponse {
  items: NotificationDto[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export interface UnreadCountResponse {
  count: number;
}

export interface MarkAllReadResponse {
  success: boolean;
  message: string;
}

// Notification for local store (used in zustand store)
export interface Notification {
  id: string;
  userId: string;
  title: string;
  titleAr: string;
  message: string;
  messageAr: string;
  type: NotificationType;
  isRead: boolean;
  createdAt: string;
  applicationId?: number;
}

// Notification preferences
export interface NotificationPreferences {
  userId: string;
  emailEnabled: boolean;
  pushEnabled: boolean;
  smsEnabled: boolean;
  inAppEnabled: boolean;
  events: {
    applicationStatus: boolean;
    payment: boolean;
    appointment: boolean;
    medicalExam: boolean;
    theoryTest: boolean;
    practicalTest: boolean;
    license: boolean;
  };
}

// Device info for push notifications
export interface DeviceInfo {
  id: string;
  userId: string;
  deviceToken: string;
  platform: 'web' | 'ios' | 'android';
  lastActive: string;
}
