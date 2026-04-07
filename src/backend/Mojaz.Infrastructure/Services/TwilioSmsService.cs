using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Mojaz.Application.Interfaces.Infrastructure;
using Mojaz.Domain.Entities;
using Mojaz.Domain.Enums;
using Mojaz.Infrastructure.Authentication;
using System;
using System.Threading.Tasks;
using Twilio;
using Twilio.Rest.Api.V2010.Account;
using Twilio.Types;

namespace Mojaz.Infrastructure.Services
{
    public class TwilioSmsService : ISmsService
    {
        private readonly TwilioSettings _settings;
        private readonly ILogger<TwilioSmsService> _logger;
        private readonly IConfiguration _configuration;

        public TwilioSmsService(IConfiguration configuration, ILogger<TwilioSmsService> logger)
        {
            _configuration = configuration;
            _logger = logger;
            
            _settings = new TwilioSettings
            {
                AccountSid = configuration["Twilio:AccountSid"] ?? string.Empty,
                AuthToken = configuration["Twilio:AuthToken"] ?? string.Empty,
                FromNumber = configuration["Twilio:FromNumber"] ?? string.Empty
            };

            if (!string.IsNullOrEmpty(_settings.AccountSid) && !string.IsNullOrEmpty(_settings.AuthToken))
            {
                TwilioClient.Init(_settings.AccountSid, _settings.AuthToken);
            }
        }

        public async Task SendAsync(string to, string message)
        {
            if (string.IsNullOrEmpty(_settings.FromNumber))
            {
                throw new InvalidOperationException("Twilio FromNumber is not configured.");
            }

            try
            {
                var toPhone = new PhoneNumber(NormalizePhoneNumber(to));
                var fromPhone = new PhoneNumber(_settings.FromNumber);

                var result = await MessageResource.CreateAsync(
                    to: toPhone,
                    from: fromPhone,
                    body: message
                );

                _logger.LogInformation("SMS sent successfully. Twilio SID: {MessageSid}, To: {To}", 
                    result.Sid, MaskPhoneNumber(to));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to send SMS to {To}. Error: {Message}", MaskPhoneNumber(to), ex.Message);
                throw;
            }
        }

        private static string NormalizePhoneNumber(string phoneNumber)
        {
            // Ensure phone number is in E.164 format
            if (string.IsNullOrEmpty(phoneNumber))
                return phoneNumber;

            // Remove any spaces or dashes
            var cleaned = phoneNumber.Replace(" ", "").Replace("-", "");

            // Add Saudi Arabia country code if not present
            if (!cleaned.StartsWith("+") && cleaned.Length == 10)
            {
                cleaned = "+966" + cleaned.Substring(1);
            }
            else if (!cleaned.StartsWith("+"))
            {
                cleaned = "+" + cleaned;
            }

            return cleaned;
        }

        private static string MaskPhoneNumber(string phoneNumber)
        {
            if (string.IsNullOrEmpty(phoneNumber) || phoneNumber.Length < 6)
                return "****";

            // Show first 3 and last 3 digits
            var length = phoneNumber.Length;
            return phoneNumber.Substring(0, 3) + "****" + phoneNumber.Substring(length - 3);
        }
    }
}