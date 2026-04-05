using FirebaseAdmin.Messaging;
using Microsoft.EntityFrameworkCore;
using Mojaz.Application.Interfaces.Services;
using Mojaz.Domain.Entities;
using Mojaz.Domain.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Mojaz.Infrastructure.Services;

/// <summary>
/// Implementation of push notification service using Firebase FCM.
/// </summary>
public class FirebasePushService : IPushNotificationService
{
    private readonly IRepository<PushToken> _pushTokenRepository;
    private readonly IUnitOfWork _unitOfWork;

    public FirebasePushService(IRepository<PushToken> pushTokenRepository, IUnitOfWork unitOfWork)
    {
        _pushTokenRepository = pushTokenRepository;
        _unitOfWork = unitOfWork;
    }

    public Task SendAsync(PushMessage message) => Task.CompletedTask; // Generic broadcast not implemented in MVP

    public async Task SendToUserAsync(Guid userId, PushMessage message)
    {
        var tokens = await _pushTokenRepository.FindAsync(t => t.UserId == userId && !t.IsRevoked);
        if (!tokens.Any()) return;

        foreach (var token in tokens)
        {
            var fcmMessage = new Message
            {
                Token = token.Token,
                Notification = new FirebaseAdmin.Messaging.Notification
                {
                    Title = message.TitleEn, // Defaulting for MVP
                    Body = message.BodyEn
                },
                Data = message.Data != null ? new Dictionary<string, string> { { "payload", message.Data } } : null
            };
            try
            {
                await FirebaseMessaging.DefaultInstance.SendAsync(fcmMessage);
            }
            catch (FirebaseMessagingException)
            {
                // Mark token as revoked if invalid
                token.IsRevoked = true;
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
            existing.IsRevoked = false;
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
                IsRevoked = false
            });
        }
        await _unitOfWork.SaveChangesAsync();
    }
}
