using Microsoft.Extensions.Configuration;
using Mojaz.Application.DTOs.Email;
using Mojaz.Application.Interfaces.Services;
using SendGrid;
using SendGrid.Helpers.Mail;
using System;
using System.Threading.Tasks;
using Hangfire;

namespace Mojaz.Infrastructure.Services;

[AutomaticRetry(Attempts = 3)]
public class EmailService : IEmailService
{
    private readonly IConfiguration _configuration;
    private readonly SendGridClient _client;

    public EmailService(IConfiguration configuration, SendGridClient client)
    {
        _configuration = configuration;
        _client = client;
    }

    public async Task SendEmailAsync(string to, string subject, string body)
    {
        var fromEmail = _configuration["SendGrid:SenderEmail"] ?? "noreply@mojaz.gov.sa";
        var fromName = _configuration["SendGrid:SenderName"] ?? "Mojaz Platform";
        
        var from = new EmailAddress(fromEmail, fromName);
        var toEmail = new EmailAddress(to);
        var msg = MailHelper.CreateSingleEmail(from, toEmail, subject, body, body);
        
        var response = await _client.SendEmailAsync(msg);
        if (!response.IsSuccessStatusCode)
        {
            var errorBody = await response.Body.ReadAsStringAsync();
            throw new Exception($"Failed to send email via SendGrid: {errorBody}");
        }
    }

    public async Task SendTemplatedAsync(TemplatedEmailRequest request)
    {
        // Use the rendered HTML body as content
        await SendEmailAsync(request.RecipientEmail, request.TemplateName, request.TemplateData?.ToString() ?? "");
    }

    public Task<string> RenderTemplateAsync<T>(string templateName, T model)
    {
        // Simple implementation - just return model to string for now
        // In production, this would use RazorLight
        return Task.FromResult(model?.ToString() ?? string.Empty);
    }
}