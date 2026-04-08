using System;
using System.Threading.Tasks;

namespace Mojaz.Application.Interfaces.Notifications
{
    /// <summary>
    /// Interface for Hangfire Email job processor.
    /// </summary>
    public interface IEmailJobProcessor
    {
        Task ExecuteAsync(string to, string subject, string body);
    }

    /// <summary>
    /// Interface for Hangfire SMS job processor.
    /// </summary>
    public interface ISmsJobProcessor
    {
        Task ExecuteAsync(string to, string message);
    }

    /// <summary>
    /// Interface for Hangfire Push Notification job processor.
    /// </summary>
    public interface IPushJobProcessor
    {
        Task ExecuteAsync(Guid userId, string titleAr, string titleEn, string bodyAr, string bodyEn, string data = null);
    }
}