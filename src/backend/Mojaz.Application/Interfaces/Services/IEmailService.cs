using System.Threading.Tasks;
using Mojaz.Application.DTOs.Email;

namespace Mojaz.Application.Interfaces.Services;

public interface IEmailService
{
    Task SendEmailAsync(string to, string subject, string body);
    Task SendTemplatedAsync(TemplatedEmailRequest request);
    Task<string> RenderTemplateAsync<T>(string templateName, T model);
}
