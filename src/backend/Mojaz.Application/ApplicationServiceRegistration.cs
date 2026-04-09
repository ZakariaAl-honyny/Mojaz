using Microsoft.Extensions.DependencyInjection;
using Mojaz.Application.Interfaces;
using Mojaz.Application.Interfaces.Services;
using Mojaz.Application.Services;
using FluentValidation;

namespace Mojaz.Application;

public static class ApplicationServiceRegistration
{
    public static IServiceCollection AddApplicationServices(this IServiceCollection services)
    {
        // ─── AutoMapper ───
        services.AddAutoMapper(typeof(ApplicationServiceRegistration).Assembly);

        // ─── FluentValidation (Phase 3 Fix) ───
        services.AddValidatorsFromAssembly(typeof(ApplicationServiceRegistration).Assembly);
        
        // ─── Auth & Security ───
        services.AddScoped<IAuthService, AuthService>();
        services.AddScoped<IUserService, UserService>();
        services.AddScoped<IAuditLogService, AuditLogService>();
        
        // ─── Workflow & Business ───
        services.AddScoped<IApplicationWorkflowService, ApplicationWorkflowService>();
        services.AddScoped<IApplicationService, ApplicationService>();
        services.AddScoped<IDocumentService, DocumentService>();
        services.AddScoped<IPaymentService, PaymentService>();
        services.AddScoped<ILicenseService, LicenseService>();
        
        // ─── Dashboards & Reporting ───
        services.AddScoped<IDashboardService, DashboardService>();

        // ─── Training ───
        services.AddScoped<ITrainingService, TrainingService>();

        // ─── Theory Test ───
        services.AddScoped<ITheoryService, TheoryService>();

        // ─── Notifications ───
        services.AddScoped<INotificationService, NotificationService>();

        // ─── Appointments ───
        services.AddScoped<IAppointmentService, AppointmentService>();
        services.AddScoped<AppointmentBookingValidator>();

        return services;
    }
}
