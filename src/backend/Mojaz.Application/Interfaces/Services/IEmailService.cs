using System.Threading.Tasks;

namespace Mojaz.Application.Interfaces.Services;

public interface IEmailService
{
    Task SendEmailAsync(string to, string subject, string body);
}
