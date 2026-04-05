using Mojaz.Application.Interfaces.Services;
using Mojaz.Domain.Entities;
using Mojaz.Domain.Enums;
using Mojaz.Domain.Interfaces;
using Mojaz.Shared.Models;
using System;
using System.Linq;
using System.Threading.Tasks;

using ApplicationEntity = Mojaz.Domain.Entities.Application;

namespace Mojaz.Application.Services;

/// <summary>
/// Orchestrator for sending multi-channel notifications (Email, SMS, Push).
/// </summary>
public class NotificationService : INotificationService
{
    private readonly IRepository<Notification> _notificationRepository;
    private readonly IRepository<ApplicationEntity> _applicationRepository;
    private readonly IRepository<User> _userRepository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly IEmailService _emailService;
    private readonly ISmsService _smsService;
    private readonly IPushNotificationService _pushNotificationService;

    public NotificationService(
        IRepository<Notification> notificationRepository,
        IRepository<ApplicationEntity> applicationRepository,
        IRepository<User> userRepository,
        IUnitOfWork unitOfWork,
        IEmailService emailService,
        ISmsService smsService,
        IPushNotificationService pushNotificationService)
    {
        _notificationRepository = notificationRepository;
        _applicationRepository = applicationRepository;
        _userRepository = userRepository;
        _unitOfWork = unitOfWork;
        _emailService = emailService;
        _smsService = smsService;
        _pushNotificationService = pushNotificationService;
    }

    public async Task SendAsync(NotificationRequest request)
    {
        var user = await _userRepository.GetByIdAsync(request.UserId);
        if (user == null) return;

        // 1. Record in Database
        var notification = new Notification
        {
            UserId = request.UserId,
            ApplicationId = request.ApplicationId,
            EventType = request.EventType,
            TitleAr = request.TitleAr,
            TitleEn = request.TitleEn,
            MessageAr = request.MessageAr,
            MessageEn = request.MessageEn,
            SentAt = DateTime.UtcNow,
            IsRead = false
        };

        await _notificationRepository.AddAsync(notification);

        // 2. Dispatch via Email
        if (request.Email && !string.IsNullOrEmpty(user.Email))
        {
            var subject = user.PreferredLanguage == "ar" ? request.TitleAr : request.TitleEn;
            var body = user.PreferredLanguage == "ar" ? request.MessageAr : request.MessageEn;
            try { await _emailService.SendEmailAsync(user.Email, subject, body); } catch { /* Log failure but don't block workflow */ }
        }

        // 3. Dispatch via SMS
        if (request.Sms && !string.IsNullOrEmpty(user.PhoneNumber))
        {
            var body = user.PreferredLanguage == "ar" ? request.MessageAr : request.MessageEn;
            try { await _smsService.SendSmsAsync(user.PhoneNumber, body); } catch { /* Log failure */ }
        }

        // 4. Dispatch via Push
        if (request.Push)
        {
            try 
            { 
                await _pushNotificationService.SendToUserAsync(request.UserId, new PushMessage
                {
                    TitleAr = request.TitleAr,
                    TitleEn = request.TitleEn,
                    BodyAr = request.MessageAr,
                    BodyEn = request.MessageEn
                }); 
            } 
            catch { /* Log failure */ }
        }

        await _unitOfWork.SaveChangesAsync();
    }

    public async Task<ApiResponse<PagedResult<NotificationDto>>> GetUserNotificationsAsync(Guid userId, int page = 1, int pageSize = 20)
    {
        var notifications = await _notificationRepository.FindAsync(n => n.UserId == userId);
        var totalCount = notifications.Count;
        var pagedItems = notifications.OrderByDescending(n => n.SentAt)
                                      .Skip((page - 1) * pageSize)
                                      .Take(pageSize)
                                      .Select(n => new NotificationDto
                                      {
                                          Id = n.Id,
                                          Title = n.TitleAr, // Localize for MVP
                                          Message = n.MessageAr,
                                          SentAt = n.SentAt,
                                          IsRead = n.IsRead
                                      })
                                      .ToList();

        var result = new PagedResult<NotificationDto>
        {
            Items = pagedItems,
            TotalCount = totalCount,
            Page = page,
            PageSize = pageSize
        };

        return ApiResponse<PagedResult<NotificationDto>>.Ok(result);
    }

    public async Task<bool> MarkAsReadAsync(Guid userId, Guid notificationId)
    {
        var notification = await _notificationRepository.GetByIdAsync(notificationId);
        if (notification != null && notification.UserId == userId)
        {
            notification.IsRead = true;
            _notificationRepository.Update(notification);
            await _unitOfWork.SaveChangesAsync();
            return true;
        }
        return false;
    }

    public async Task<bool> MarkAllAsReadAsync(Guid userId)
    {
        var notifications = await _notificationRepository.FindAsync(n => n.UserId == userId && !n.IsRead);
        if (notifications.Any())
        {
            foreach (var notification in notifications)
            {
                notification.IsRead = true;
                _notificationRepository.Update(notification);
            }
            await _unitOfWork.SaveChangesAsync();
            return true;
        }
        return false;
    }
}
