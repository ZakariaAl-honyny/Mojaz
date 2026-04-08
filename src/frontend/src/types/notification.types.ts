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
