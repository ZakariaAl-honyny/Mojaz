using Microsoft.AspNetCore.Hosting;
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
            
            services.AddSingleton<IRazorLightEngine>(sp => 
            {
                // Get the hosting environment to find the content root
                var environment = sp.GetService<IWebHostEnvironment>();
                string templatePath = string.Empty;
                
                // First try: ContentRootPath/EmailTemplates (most reliable)
                if (environment != null)
                {
                    templatePath = Path.Combine(environment.ContentRootPath, "..", "Mojaz.Infrastructure", "EmailTemplates");
                    // Normalize the path
                    templatePath = Path.GetFullPath(templatePath);
                }
                
                // Second try: Check relative to the executing assembly location (Infrastructure.dll)
                if (!Directory.Exists(templatePath))
                {
                    var assemblyLocation = Path.GetDirectoryName(typeof(EmailServiceExtensions).Assembly.Location);
                    templatePath = Path.Combine(assemblyLocation ?? string.Empty, "EmailTemplates");
                }
                
                // Third try: Look in the bin directory of Infrastructure project
                if (!Directory.Exists(templatePath))
                {
                    templatePath = Path.Combine(AppContext.BaseDirectory, "..", "..", "..", "..", 
                        "Mojaz.Infrastructure", "EmailTemplates");
                    templatePath = Path.GetFullPath(templatePath);
                }
                
                // Fourth try: Direct from solution root
                if (!Directory.Exists(templatePath))
                {
                    var solutionRoot = Path.GetFullPath(Path.Combine(AppContext.BaseDirectory, "..", "..", "..", ".."));
                    templatePath = Path.Combine(solutionRoot, "src", "backend", "Mojaz.Infrastructure", "EmailTemplates");
                }
                
                // Validate directory exists before creating engine
                if (!Directory.Exists(templatePath))
                {
                    throw new DirectoryNotFoundException(
                        $"EmailTemplates directory not found. Searched paths include: {templatePath}. " +
                        "Please ensure the EmailTemplates folder exists in the Mojaz.Infrastructure project.");
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