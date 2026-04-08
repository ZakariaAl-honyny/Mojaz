# Phase 1: Contracts - Notification API

This document details the REST API surface exposed by the Unified Notification Service, adhering to Mojaz Clean Architecture standards.

### `GET /api/v1/notifications`
Fetches a paginated list of notifications for the authenticated user.

**Response** (200 OK):
```json
{
  "success": true,
  "message": "Success",
  "data": {
    "items": [
      {
        "id": 1,
        "titleAr": "تحديث الطلب",
        "titleEn": "Application Update",
        "messageAr": "تم قبول طلبك.",
        "messageEn": "Your application was approved.",
        "eventType": "ApplicationStatusChanged",
        "isRead": false,
        "createdAt": "2026-04-08T00:00:00Z"
      }
    ],
    "totalCount": 1,
    "page": 1,
    "pageSize": 20,
    "totalPages": 1,
    "hasPreviousPage": false,
    "hasNextPage": false
  },
  "errors": null,
  "statusCode": 200
}
```

### `GET /api/v1/notifications/unread-count`
Short-polling endpoint to fetch the total unread notifications for the UI Bell icon.

**Response** (200 OK):
```json
{
  "success": true,
  "message": "Success",
  "data": {
    "count": 5
  },
  "errors": null,
  "statusCode": 200
}
```

### `PATCH /api/v1/notifications/read-all`
Marks all existing notifications as read for the authenticated user.

**Response** (200 OK):
```json
{
  "success": true,
  "message": "All notifications marked as read.",
  "data": null,
  "errors": null,
  "statusCode": 200
}
```

### Internal Contract (Application Layer)
```csharp
public interface INotificationService
{
    Task SendAsync(NotificationRequest request);
}

public class NotificationRequest
{
    public int UserId { get; set; }
    public NotificationEvent EventType { get; set; }
    public int? ApplicationId { get; set; }
    public Dictionary<string, string> Payload { get; set; } // Variables for templates
}
```
