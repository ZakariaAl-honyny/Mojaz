using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Mojaz.Application.Interfaces.Repositories;
using Mojaz.Application.Interfaces.Services;
using Mojaz.Infrastructure.Authentication;
using Mojaz.Infrastructure.Repositories;
using Mojaz.Infrastructure.Services;
using RazorLight;
using SendGrid;

namespace Mojaz.Infrastructure.Extensions
{
    public static class EmailServiceExtensions
    {
        public static IServiceCollection AddMojazEmail(this IServiceCollection services, IConfiguration configuration)
        {
            services.Configure<SendGridSettings>(configuration.GetSection("SendGridSettings"));
            services.Configure<EmailDedupSettings>(configuration.GetSection("EmailDedupSettings"));
            
            services.AddScoped<ISendGridClient>(sp => 
            {
                var settings = configuration.GetSection("SendGridSettings").Get<SendGridSettings>();
                var apiKey = settings?.ApiKey;
                
                // Ensure we never pass null or empty to SendGridClient to prevent DI resolution crashes
                if (string.IsNullOrWhiteSpace(apiKey))
                {
                    apiKey = "SG.DEVELOPMENT_PLACEHOLDER_KEY";
                }
                
                return new SendGridClient(apiKey);
            });
            
            services.AddScoped<IEmailService, SendGridEmailService>();
            services.AddScoped<IEmailLogRepository, EmailLogRepository>();
            
            services.AddSingleton<IRazorLightEngine>(_ => 
            {
                var baseDir = AppContext.BaseDirectory;
                // Try different possible locations for EmailTemplates
                string templatePath = Path.Combine(baseDir, "..", "..", "..", "Mojaz.Infrastructure", "EmailTemplates");
                if (!Directory.Exists(templatePath))
                {
                    templatePath = Path.Combine(baseDir, "..", "..", "Mojaz.Infrastructure", "EmailTemplates");
                }
                if (!Directory.Exists(templatePath))
                {
                    templatePath = Path.Combine(baseDir, "EmailTemplates");
                }
                if (!Directory.Exists(templatePath))
                {
                    // Final fallback - use absolute path
                    templatePath = @"C:\Users\ALlahabi\Desktop\cmder\Mojaz\src\backend\Mojaz.Infrastructure\EmailTemplates";
                }
                return new RazorLightEngineBuilder()
                    .UseFileSystemProject(templatePath)
                    .UseMemoryCachingProvider()
                    .Build();
            });
            
            return services;
        }
    }
}