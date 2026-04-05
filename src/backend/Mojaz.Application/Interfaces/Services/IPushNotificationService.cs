using System;
using System.Threading.Tasks;

namespace Mojaz.Application.Interfaces.Services
{
    /// <summary>
    /// Interface for sending push notifications via FCM.
    /// </summary>
    public interface IPushNotificationService
    {
        Task SendAsync(PushMessage message);
        Task SendToUserAsync(Guid userId, PushMessage message);
        Task RegisterTokenAsync(Guid userId, string token, string deviceType);
    }

    /// <summary>
    /// DTO for push notification message.
    /// </summary>
    public class PushMessage
    {
        public string TitleAr { get; set; } = string.Empty;
        public string TitleEn { get; set; } = string.Empty;
        public string BodyAr { get; set; } = string.Empty;
        public string BodyEn { get; set; } = string.Empty;
        public string? Data { get; set; }
    }
}
