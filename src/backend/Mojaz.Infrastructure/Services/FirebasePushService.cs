using FirebaseAdmin.Messaging;
using Microsoft.EntityFrameworkCore;
using Mojaz.Application.Interfaces.Services;
using Mojaz.Domain.Entities;
using Mojaz.Domain.Interfaces;
using Mojaz.Infrastructure.Persistence;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Hangfire;

namespace Mojaz.Infrastructure.Services;

/// <summary>
/// Implementation of push notification service using Firebase FCM.
/// </summary>
[AutomaticRetry(Attempts = 3)]
public class FirebasePushService : IPushNotificationService
{
    private readonly IRepository<PushToken> _pushTokenRepository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly MojazDbContext _context;

    public FirebasePushService(IRepository<PushToken> pushTokenRepository, IUnitOfWork unitOfWork, MojazDbContext context)
    {
        _pushTokenRepository = pushTokenRepository;
        _unitOfWork = unitOfWork;
        _context = context;
    }

    public Task SendAsync(PushMessage message) => Task.CompletedTask; // Generic broadcast not implemented in MVP

    public async Task SendToUserAsync(Guid userId, PushMessage message)
    {
        var tokens = await _pushTokenRepository.FindAsync(t => t.UserId == userId && t.IsActive);
        if (!tokens.Any()) return;

        foreach (var token in tokens)
        {
            // Get user's preferred language to determine which language to use for notification
            var user = await _context.Users.FindAsync(userId);
            bool useArabic = user?.PreferredLanguage == "ar";
            
            var fcmMessage = new Message
            {
                Token = token.Token,
                Notification = new FirebaseAdmin.Messaging.Notification
                {
                    Title = useArabic ? message.TitleAr : message.TitleEn,
                    Body = useArabic ? message.BodyAr : message.BodyEn
                },
                Data = message.Data != null ? new Dictionary<string, string> { { "payload", message.Data } } : null
            };
            try
            {
                await FirebaseMessaging.DefaultInstance.SendAsync(fcmMessage);
                // Update LastUsedAt on successful delivery
                token.LastUsedAt = DateTime.UtcNow;
                _pushTokenRepository.Update(token);
            }
            catch (FirebaseMessagingException)
            {
                // Mark token as inactive if invalid
                token.IsActive = false;
                _pushTokenRepository.Update(token);
            }
        }
        await _unitOfWork.SaveChangesAsync();
    }

    public async Task RegisterTokenAsync(Guid userId, string token, string deviceType)
    {
        var existingTokens = await _pushTokenRepository.FindAsync(t => t.UserId == userId && t.Token == token);
        var existing = existingTokens.FirstOrDefault();
        
        if (existing != null)
        {
            existing.IsActive = true;
            existing.DeviceType = deviceType;
            _pushTokenRepository.Update(existing);
        }
        else
        {
            await _pushTokenRepository.AddAsync(new PushToken
            {
                UserId = userId,
                Token = token,
                DeviceType = deviceType,
                IsActive = true
            });
        }
        await _unitOfWork.SaveChangesAsync();
    }

    public async Task UnregisterTokenAsync(Guid userId, string token)
    {
        var existingTokens = await _pushTokenRepository.FindAsync(t => t.UserId == userId && t.Token == token);
        var existing = existingTokens.FirstOrDefault();
        
        if (existing != null)
        {
            existing.IsActive = false;
            _pushTokenRepository.Update(existing);
            await _unitOfWork.SaveChangesAsync();
        }
    }
}
