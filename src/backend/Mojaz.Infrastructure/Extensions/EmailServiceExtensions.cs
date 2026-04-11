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
            
            services.AddScoped<SendGridClient>(sp => 
            {
                var settings = configuration.GetSection("SendGridSettings").Get<SendGridSettings>();
                return new SendGridClient(settings?.ApiKey ?? "");
            });
            
            services.AddScoped<IEmailService, SendGridEmailService>();
            services.AddScoped<IEmailLogRepository, EmailLogRepository>();
            
            services.AddSingleton<IRazorLightEngine>(_ => new RazorLightEngineBuilder()
                .UseFileSystemProject("src/backend/Mojaz.Infrastructure/EmailTemplates")
                .UseMemoryCachingProvider()
                .Build());
            
            return services;
        }
    }
}