using Microsoft.Extensions.Configuration;
using Mojaz.Application.Interfaces.Services;
using System;
using System.Threading.Tasks;
using Twilio;
using Twilio.Rest.Api.V2010.Account;
using Twilio.Types;

namespace Mojaz.Infrastructure.Services;

public class SmsService : ISmsService
{
    private readonly IConfiguration _configuration;

    public SmsService(IConfiguration configuration)
    {
        _configuration = configuration;
        var accountSid = _configuration["Twilio:AccountSid"];
        var authToken = _configuration["Twilio:AuthToken"];
        if (!string.IsNullOrEmpty(accountSid) && !string.IsNullOrEmpty(authToken))
        {
            TwilioClient.Init(accountSid, authToken);
        }
    }

    public async Task SendSmsAsync(string phoneNumber, string message)
    {
        var fromNumber = _configuration["Twilio:FromNumber"];
        if (string.IsNullOrEmpty(fromNumber)) throw new Exception("Twilio FromNumber is missing.");

        var to = new PhoneNumber(phoneNumber);
        var from = new PhoneNumber(fromNumber);
        
        await MessageResource.CreateAsync(to: to, from: from, body: message);
    }
}
