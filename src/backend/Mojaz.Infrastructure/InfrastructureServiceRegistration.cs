using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Configuration;
using Mojaz.Domain.Entities;
using Mojaz.Domain.Interfaces;
using Mojaz.Application.Interfaces;
using Mojaz.Application.Interfaces.Repositories;
using Mojaz.Infrastructure.Persistence;
using Mojaz.Infrastructure.Persistence.Repositories;
using Mojaz.Infrastructure.Persistence.UnitOfWork;
using Mojaz.Infrastructure.Repositories;
using SendGrid;
using Hangfire;
using Hangfire.SqlServer;
using Mojaz.Infrastructure.Authentication;
using Mojaz.Infrastructure.Jobs;

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
        
        // Appointment Repository
        services.AddScoped<IAppointmentRepository, AppointmentRepository>();

        // Training Repository
        services.AddScoped<ITrainingRepository, TrainingRepository>();

        // Theory Repository
        services.AddScoped<ITheoryRepository, TheoryRepository>();

        // Practical Repository
        services.AddScoped<IPracticalRepository, Persistence.Repositories.PracticalRepository>();

        // Payment Repository
        services.AddScoped<IPaymentRepository, PaymentRepository>();

        // FeeStructure Repository
        services.AddScoped<IFeeStructureRepository, FeeStructureRepository>();

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
        
        // PDF Generators
        services.AddScoped<Application.Interfaces.Infrastructure.IPaymentReceiptGenerator, Documents.QuestPdfPaymentReceiptGenerator>();
        services.AddScoped<Application.Interfaces.Infrastructure.ILicensePdfGenerator, Documents.QuestPdfLicenseGenerator>();

        // Renewal Service
        services.AddScoped<Application.Interfaces.Services.IRenewalService, Application.Services.RenewalService>();

        // Category Upgrade Service
        services.AddScoped<Application.Interfaces.Services.ICategoryUpgradeService, Application.Services.CategoryUpgradeService>();

        // JWT Authentication & Authorization
        services.AddMojazAuthentication(configuration);

        // Background Jobs - Process Expired Applications (FR-005, Phase 8)
        services.AddScoped<Mojaz.Infrastructure.Jobs.ProcessExpiredApplicationsJob>();
        
        // Background Jobs - Appointment Reminders
        services.AddScoped<ProcessAppointmentRemindersJob>();
        
        return services;
    }
}
