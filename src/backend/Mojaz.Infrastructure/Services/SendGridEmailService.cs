using System;
using System.Net;
using System.Threading.Tasks;
using Mojaz.Application.DTOs.Email;
using Mojaz.Application.Interfaces.Repositories;
using Mojaz.Application.Interfaces.Services;
using Mojaz.Domain.Entities;
using Microsoft.Extensions.Options;
using SendGrid;
using SendGrid.Helpers.Mail;
using RazorLight;
using PreMailer.Net;
using Polly;
using Polly.Retry;
using Mojaz.Infrastructure.Authentication;
using Mojaz.Infrastructure.Persistence;

namespace Mojaz.Infrastructure.Services
{
    public class SendGridEmailService : IEmailService
    {
        private readonly SendGridSettings _settings;
        private readonly IEmailLogRepository _emailLogRepository;
        private readonly MojazDbContext _dbContext;
        private readonly IRazorLightEngine _razorEngine;
        private readonly SendGridClient _sendGridClient;
        private readonly AsyncRetryPolicy _retryPolicy;

        public SendGridEmailService(
            IOptions<SendGridSettings> settings,
            IEmailLogRepository emailLogRepository,
            MojazDbContext dbContext,
            IRazorLightEngine razorEngine,
            SendGridClient sendGridClient)
        {
            _settings = settings.Value;
            _emailLogRepository = emailLogRepository;
            _dbContext = dbContext;
            _razorEngine = razorEngine;
            _sendGridClient = sendGridClient;
            _retryPolicy = Policy
                .Handle<Exception>(ex => ex is HttpRequestException)
                .WaitAndRetryAsync(new[] { TimeSpan.FromSeconds(1), TimeSpan.FromSeconds(2), TimeSpan.FromSeconds(4) });
        }

        public async Task SendEmailAsync(string to, string subject, string body)
        {
            var msg = new SendGridMessage()
            {
                From = new EmailAddress(_settings.SenderEmail, _settings.SenderName),
                Subject = subject,
                HtmlContent = body
            };
            msg.AddTo(new EmailAddress(to));
            
            await _retryPolicy.ExecuteAsync(async () =>
            {
                var response = await _sendGridClient.SendEmailAsync(msg);
                if (response.StatusCode >= HttpStatusCode.InternalServerError)
                {
                    throw new Exception($"SendGrid 5xx error: {response.StatusCode}");
                }
            });
        }

        public async Task SendTemplatedAsync(TemplatedEmailRequest request)
        {
            // Deduplication check
            var duplicate = await _emailLogRepository.FindDuplicateAsync(request.RecipientEmail, request.TemplateName, request.ReferenceId);
            if (duplicate != null)
                return;

            var emailLog = new EmailLog
            {
                Id = Guid.NewGuid(),
                RecipientEmail = request.RecipientEmail,
                TemplateName = request.TemplateName,
                ReferenceId = request.ReferenceId,
                Status = Domain.Enums.EmailStatus.Pending,
                RetryCount = 0,
                SentAt = DateTime.UtcNow,
                ErrorMessage = null,
                IsDeleted = false
            };
            _dbContext.EmailLogs.Add(emailLog);
            await _dbContext.SaveChangesAsync();

            try
            {
                var templatePath = $"EmailTemplates/{request.TemplateName}.cshtml";
                var html = await _razorEngine.CompileRenderAsync(templatePath, request.TemplateData);
                var premailer = new PreMailer.Net.PreMailer(html);
                var inlinedResult = premailer.MoveCssInline();
                var inlined = inlinedResult.Html;
                
                await _retryPolicy.ExecuteAsync(async () =>
                {
                    var msg = new SendGridMessage()
                    {
                        From = new EmailAddress(_settings.SenderEmail, _settings.SenderName),
                        Subject = request.TemplateName,
                        HtmlContent = inlined
                    };
                    msg.AddTo(new EmailAddress(request.RecipientEmail));
                    
                    if (request.Attachments != null)
                    {
                        foreach (var att in request.Attachments)
                        {
                            msg.AddAttachment(att.FileName, Convert.ToBase64String(att.Content), att.ContentType);
                        }
                    }
                    
                    var response = await _sendGridClient.SendEmailAsync(msg);
                    
                    if ((int)response.StatusCode >= 500)
                    {
                        throw new Exception($"SendGrid 5xx error: {response.StatusCode}");
                    }
                    
                    emailLog.Status = (int)response.StatusCode < 400 ? Domain.Enums.EmailStatus.Sent : Domain.Enums.EmailStatus.Failed;
                    emailLog.ErrorMessage = (int)response.StatusCode < 400 ? null : await response.Body.ReadAsStringAsync();
                });
            }
            catch (Exception ex)
            {
                emailLog.Status = Domain.Enums.EmailStatus.Failed;
                emailLog.ErrorMessage = ex.Message;
            }
            finally
            {
                emailLog.SentAt = DateTime.UtcNow;
                await _dbContext.SaveChangesAsync();
            }
        }

        public async Task<string> RenderTemplateAsync<T>(string templateName, T model)
        {
            var templatePath = $"{templateName}.cshtml";
            var html = await _razorEngine.CompileRenderAsync(templateName, model);
            var premailer = new PreMailer.Net.PreMailer(html);
            var inlinedResult = premailer.MoveCssInline();
            return inlinedResult.Html;
        }
    }
}