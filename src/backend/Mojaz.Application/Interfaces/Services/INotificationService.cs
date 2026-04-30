using Mojaz.Domain.Entities;
using Mojaz.Domain.Enums;
using Mojaz.Shared;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Mojaz.Application.Interfaces.Services;

/// <summary>
/// Unified notification service interface for Mojaz platform.
/// </summary>
public interface INotificationService
{
    Task SendAsync(NotificationRequest request);
    Task<ApiResponse<PagedResult<NotificationDto>>> GetUserNotificationsAsync(int userId, int page = 1, int pageSize = 20);
    Task<ApiResponse<int>> GetUnreadCountAsync(int userId);
    Task<bool> MarkAsReadAsync(int userId, int notificationId);
    Task<bool> MarkAllAsReadAsync(int userId);
}

/// <summary>
/// Notification request DTO for unified notification dispatch.
/// </summary>
public class NotificationRequest
{
    public int UserId { get; set; }
    public int? ApplicationId { get; set; }
    public NotificationEventType EventType { get; set; }
    public string TitleAr { get; set; } = string.Empty;
    public string TitleEn { get; set; } = string.Empty;
    public string MessageAr { get; set; } = string.Empty;
    public string MessageEn { get; set; } = string.Empty;
    
    // Channel flags
    public bool Email { get; set; } = true;
    public bool Sms { get; set; } = false;
    public bool Push { get; set; } = true;
    public bool InApp { get; set; } = true;
}

public class NotificationDto
{
    public int Id { get; set; }
    public string TitleAr { get; set; } = string.Empty;
    public string TitleEn { get; set; } = string.Empty;
    public string MessageAr { get; set; } = string.Empty;
    public string MessageEn { get; set; } = string.Empty;
    public NotificationEventType EventType { get; set; }
    public bool IsRead { get; set; }
    public DateTime CreatedAt { get; set; }
}
