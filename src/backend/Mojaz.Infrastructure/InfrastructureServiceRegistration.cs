using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Configuration;
using Mojaz.Domain.Entities;
using Mojaz.Domain.Interfaces;
using Mojaz.Infrastructure.Persistence;
using Mojaz.Infrastructure.Persistence.Repositories;
using Mojaz.Infrastructure.Persistence.UnitOfWork;
using SendGrid;
using Hangfire;
using Hangfire.SqlServer;
using Mojaz.Infrastructure.Authentication;

namespace Mojaz.Infrastructure;

/// <summary>
/// DI registration for Infrastructure layer services.
/// </summary>
public static class InfrastructureServiceRegistration
{
    public static IServiceCollection AddInfrastructureServices(this IServiceCollection services, IConfiguration configuration)
    {
        // EF Core DbContext
        services.AddDbContext<MojazDbContext>(options =>
            options.UseSqlServer(
                configuration.GetConnectionString("DefaultConnection"),
                b => b.MigrationsAssembly(typeof(MojazDbContext).Assembly.FullName)));

        // Repository & UnitOfWork
        services.AddScoped(typeof(IRepository<>), typeof(Repository<>));
        services.AddScoped<IUnitOfWork, UnitOfWork>();

        // Identity & Infrastructure Services
        services.AddScoped<Application.Interfaces.Services.IJwtService, Identity.JwtService>();
        services.AddScoped<Application.Interfaces.Services.IAuditService, Services.AuditService>();

        // Hangfire (Phase 3 Fix)
        services.AddHangfire(config => config
            .SetDataCompatibilityLevel(CompatibilityLevel.Version_180)
            .UseSimpleAssemblyNameTypeSerializer()
            .UseRecommendedSerializerSettings()
            .UseSqlServerStorage(configuration.GetConnectionString("DefaultConnection"), new SqlServerStorageOptions
            {
                CommandBatchMaxTimeout = TimeSpan.FromMinutes(5),
                SlidingInvisibilityTimeout = TimeSpan.FromMinutes(5),
                QueuePollInterval = TimeSpan.Zero,
                UseRecommendedIsolationLevel = true,
                DisableGlobalLocks = true
            }));

        services.AddHangfireServer();

        // SendGrid Client
        var sendGridApiKey = configuration["SendGridSettings:ApiKey"];
        if (!string.IsNullOrEmpty(sendGridApiKey))
        {
            services.AddScoped<ISendGridClient>(_ => new SendGridClient(sendGridApiKey));
        }
        else
        {
            // Fallback for development
            services.AddScoped<ISendGridClient>(_ => new SendGridClient("SG.test-key"));
        }

        // Notification & Push
        services.AddScoped<Application.Interfaces.Services.IEmailService, Services.EmailService>();
        services.AddScoped<Application.Interfaces.Services.ISmsService, Services.SmsService>();
        services.AddScoped<Application.Interfaces.Infrastructure.ISmsService, Services.TwilioSmsService>();
        services.AddScoped<Application.Interfaces.Services.IPushNotificationService>(provider => 
            new Services.FirebasePushService(
                provider.GetRequiredService<IRepository<PushToken>>(),
                provider.GetRequiredService<IUnitOfWork>(),
                provider.GetRequiredService<MojazDbContext>()
            ));
        services.AddScoped<Application.Interfaces.Services.IOtpService, Services.OtpService>();
        services.AddScoped<Application.Interfaces.Services.ISystemSettingsService, Services.SystemSettingsService>();
        services.AddScoped<Application.Interfaces.Infrastructure.IFileStorageService, Services.LocalFileStorageService>();
        services.AddScoped<IOtpRepository, OtpRepository>();

        // JWT Authentication & Authorization
        services.AddMojazAuthentication(configuration);

        // Background Jobs - Process Expired Applications (FR-005, Phase 8)
        services.AddScoped<Mojaz.Infrastructure.Jobs.ProcessExpiredApplicationsJob>();
        
        // Recurring job registration
        RecurringJob.AddOrUpdate<Mojaz.Infrastructure.Jobs.ProcessExpiredApplicationsJob>(
            "mojaz-expire-applications",
            job => job.ExecuteAsync(),
            Cron.Daily(2)); // Daily at 02:00 UTC (FR-005)

        return services;
    }
}
