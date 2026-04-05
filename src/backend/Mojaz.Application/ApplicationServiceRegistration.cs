using Microsoft.Extensions.DependencyInjection;
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
        
        // ─── Workflow & Business ───
        services.AddScoped<IApplicationWorkflowService, ApplicationWorkflowService>();
        services.AddScoped<IApplicationService, ApplicationService>();
        services.AddScoped<IDocumentService, DocumentService>();
        services.AddScoped<IPaymentService, PaymentService>();
        services.AddScoped<ILicenseService, LicenseService>();
        
        // ─── Notifications ───
        services.AddScoped<INotificationService, NotificationService>();

        return services;
    }
}
