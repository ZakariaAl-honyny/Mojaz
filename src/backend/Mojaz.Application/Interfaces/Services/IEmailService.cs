using System.Threading.Tasks;
using DrivingLicenseIssuanceSystem.Application.DTOs.Email;

namespace DrivingLicenseIssuanceSystem.Application.Interfaces.Services;

public interface IEmailService
{
    Task SendEmailAsync(string to, string subject, string body);
    Task SendTemplatedAsync(TemplatedEmailRequest request);
    Task<string> RenderTemplateAsync<T>(string templateName, T model);
}
