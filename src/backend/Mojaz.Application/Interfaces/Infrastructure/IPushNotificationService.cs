using System.Collections.Generic;
using System.Threading.Tasks;

namespace Mojaz.Application.Interfaces.Infrastructure
{
    public interface IPushNotificationService
    {
        Task SendAsync(string deviceToken, string title, string body, IDictionary<string, string> data);
    }
}
