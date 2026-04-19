using System.IO;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using DrivingLicenseIssuanceSystem.Application.Interfaces.Repositories;
using DrivingLicenseIssuanceSystem.Application.Interfaces.Services;
using DrivingLicenseIssuanceSystem.Infrastructure.Authentication;
using DrivingLicenseIssuanceSystem.Infrastructure.Repositories;
using DrivingLicenseIssuanceSystem.Infrastructure.Services;
using RazorLight;
using SendGrid;

namespace DrivingLicenseIssuanceSystem.Infrastructure.Extensions
{
    public static class EmailServiceExtensions
    {
        public static IServiceCollection AddDrivingLicenseIssuanceSystemEmail(this IServiceCollection services, IConfiguration configuration)
        {
            services.Configure<SendGridSettings>(configuration.GetSection("SendGridSettings"));
            services.Configure<EmailDedupSettings>(configuration.GetSection("EmailDedupSettings"));
            
            services.AddScoped<SendGridClient>(sp => 
            {
                var settings = configuration.GetSection("SendGridSettings").Get<SendGridSettings>();
                return new SendGridClient(settings?.ApiKey ?? "");
            });
            
            services.AddScoped<IEmailService, SendGridEmailService>();
            services.AddScoped<IEmailLogRepository, EmailLogRepository>();
            
            services.AddSingleton<IRazorLightEngine>(_ => new RazorLightEngineBuilder()
                .UseFileSystemProject(Path.Combine(AppContext.BaseDirectory, "..", "..", "..", "..", "DrivingLicenseIssuanceSystem.Infrastructure", "EmailTemplates"))
                .UseMemoryCachingProvider()
                .Build());
            
            return services;
        }
    }
}