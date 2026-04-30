using Microsoft.Extensions.DependencyInjection;
using FluentValidation;
using Mojaz.Application.Interfaces;
using Mojaz.Application.Interfaces.Services;
using Mojaz.Application.Services;
using Mojaz.Domain.Entities;
using Mojaz.Domain.Enums;
using Mojaz.Domain.Interfaces;

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
        
        // ApplicationService requires: IRepository<ApplicationEntity>, IRepository<User>, 
        // IRepository<LicenseCategory>, IRepository<SystemSetting>, IRepository<License>,
        // IFeeStructureRepository, IRepository<PaymentTransaction>, IUnitOfWork, IMapper, 
        // IAuditService, INotificationService, IPaymentService
        services.AddScoped<IApplicationService, ApplicationService>();
        
        services.AddScoped<IDocumentService, DocumentService>();
        services.AddScoped<IPaymentService, PaymentService>();
        services.AddScoped<ILicenseService, LicenseService>();
        
        // ─── Dashboards & Reporting ───
        services.AddScoped<IDashboardService, DashboardService>();
        services.AddScoped<IReportService, ReportService>();

        // ─── Training ───
        services.AddScoped<ITrainingService, TrainingService>();

        // ─── Theory Test ───
        services.AddScoped<ITheoryService, TheoryService>();

        // ─── Practical Test ───
        services.AddScoped<IPracticalService, PracticalService>();

        // ─── Notifications ───
        services.AddScoped<INotificationService, NotificationService>();

        // ─── Appointments ───
        services.AddScoped<IAppointmentService, AppointmentService>();
        services.AddScoped<AppointmentBookingValidator>(sp => 
            new AppointmentBookingValidator(
                sp.GetRequiredService<IAppointmentRepository>(),
                sp.GetRequiredService<IRepository<Domain.Entities.Application>>(),
                sp.GetRequiredService<IRepository<PaymentTransaction>>(),
                sp.GetRequiredService<ISystemSettingsService>(),
                sp.GetRequiredService<ITrainingService>(),
                sp.GetRequiredService<ITheoryService>(),
                sp.GetRequiredService<IPracticalService>()));

        // ─── Medical Examination ───
        services.AddScoped<IMedicalService, MedicalService>();

        // ─── Final Approval (Feature 022) ───
        services.AddScoped<IGate4ValidationService, Gate4ValidationService>();
        services.AddScoped<IFinalApprovalService, FinalApprovalService>();

        // ─── License Renewal (Feature 025) ───
        services.AddScoped<IRenewalService, RenewalService>();

        // ─── Replace License ───
        services.AddScoped<IReplaceLicenseService, ReplaceLicenseService>();

        // ─── Fee Structure Management (Admin) ───
        services.AddScoped<IFeeStructureService, FeeStructureService>();

        return services;
    }
}
