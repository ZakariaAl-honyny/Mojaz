using DrivingLicenseIssuanceSystem.Domain.Entities;
using DrivingLicenseIssuanceSystem.Domain.Enums;
using DrivingLicenseIssuanceSystem.Shared;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace DrivingLicenseIssuanceSystem.Application.Interfaces.Services;

/// <summary>
/// Unified notification service interface for DrivingLicenseIssuanceSystem platform.
/// </summary>
public interface INotificationService
{
    Task SendAsync(NotificationRequest request);
    Task<ApiResponse<PagedResult<NotificationDto>>> GetUserNotificationsAsync(Guid userId, int page = 1, int pageSize = 20);
    Task<ApiResponse<int>> GetUnreadCountAsync(Guid userId);
    Task<bool> MarkAsReadAsync(Guid userId, Guid notificationId);
    Task<bool> MarkAllAsReadAsync(Guid userId);
}

/// <summary>
/// Notification request DTO for unified notification dispatch.
/// </summary>
public class NotificationRequest
{
    public Guid UserId { get; set; }
    public Guid? ApplicationId { get; set; }
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
    public Guid Id { get; set; }
    public string TitleAr { get; set; } = string.Empty;
    public string TitleEn { get; set; } = string.Empty;
    public string MessageAr { get; set; } = string.Empty;
    public string MessageEn { get; set; } = string.Empty;
    public NotificationEventType EventType { get; set; }
    public bool IsRead { get; set; }
    public DateTime CreatedAt { get; set; }
}
