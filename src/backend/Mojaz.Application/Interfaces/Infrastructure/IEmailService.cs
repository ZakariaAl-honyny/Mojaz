using System.Threading.Tasks;

namespace Mojaz.Application.Interfaces.Infrastructure
{
    public interface IEmailService
    {
        Task SendAsync(string to, string subject, string body, bool isHtml);
    }
}
