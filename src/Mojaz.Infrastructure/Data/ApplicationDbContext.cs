using Microsoft.EntityFrameworkCore;
using Mojaz.Domain.Entities.Base;
using Mojaz.Domain.Entities.Identity;
using Mojaz.Domain.Entities.Config;
using Mojaz.Domain.Entities.Core;
using Mojaz.Domain.Entities.Tracking;
using Mojaz.Infrastructure.Data.Configurations;

namespace Mojaz.Infrastructure.Data;

/// <summary>
/// Main database context for the Mojaz application.
/// Configures all entities and their relationships using the Code-First approach.
/// Supports soft delete and audit tracking across all entities.
/// Default collation is set to Arabic_CI_AS for proper Arabic language support.
/// </summary>
public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options)
    {
    }

    #region Authentication & Identification

    /// <summary>
    /// Users in the system (applicants, employees, admins).
    /// </summary>
    public DbSet<User> Users { get; set; }

    /// <summary>
    /// One-time password codes for authentication.
    /// </summary>
    public DbSet<OtpCode> OtpCodes { get; set; }

    /// <summary>
    /// Refresh tokens for session management.
    /// </summary>
    public DbSet<RefreshToken> RefreshTokens { get; set; }

    /// <summary>
    /// Password reset tokens for account recovery.
    /// </summary>
    public DbSet<PasswordReset> PasswordResets { get; set; }

    /// <summary>
    /// Email communication logs.
    /// </summary>
    public DbSet<EmailLog> EmailLogs { get; set; }

    /// <summary>
    /// SMS communication logs.
    /// </summary>
    public DbSet<SmsLog> SmsLogs { get; set; }

    /// <summary>
    /// Push notification tokens for mobile devices.
    /// </summary>
    public DbSet<PushToken> PushTokens { get; set; }

    #endregion

    #region Configuration & Business Dictionary

    /// <summary>
    /// License categories (e.g., Personal, Commercial, Heavy Vehicle).
    /// </summary>
    public DbSet<LicenseCategory> LicenseCategories { get; set; }

    /// <summary>
    /// Fee structures for various services.
    /// </summary>
    public DbSet<FeeStructure> FeeStructures { get; set; }

    /// <summary>
    /// System settings and configuration parameters.
    /// </summary>
    public DbSet<SystemSetting> SystemSettings { get; set; }

    #endregion

    #region Core Workflow Models

    /// <summary>
    /// License applications from applicants.
    /// </summary>
    public DbSet<Application> Applications { get; set; }

    /// <summary>
    /// Issued licenses to users.
    /// </summary>
    public DbSet<License> Licenses { get; set; }

    /// <summary>
    /// Scheduled appointments for tests and exams.
    /// </summary>
    public DbSet<Appointment> Appointments { get; set; }

    /// <summary>
    /// Documents uploaded by applicants (identity, medical, etc.).
    /// </summary>
    public DbSet<Document> Documents { get; set; }

    /// <summary>
    /// Payment records for license applications.
    /// </summary>
    public DbSet<Payment> Payments { get; set; }

    #endregion

    #region Operational Tracking

    /// <summary>
    /// Application status change history for audit trail.
    /// </summary>
    public DbSet<ApplicationStatusHistory> ApplicationStatusHistories { get; set; }

    /// <summary>
    /// Medical exam results.
    /// </summary>
    public DbSet<MedicalExam> MedicalExams { get; set; }

    /// <summary>
    /// Training records for driver education.
    /// </summary>
    public DbSet<TrainingRecord> TrainingRecords { get; set; }

    /// <summary>
    /// Theory test results.
    /// </summary>
    public DbSet<TheoryTest> TheoryTests { get; set; }

    /// <summary>
    /// Practical test results.
    /// </summary>
    public DbSet<PracticalTest> PracticalTests { get; set; }

    /// <summary>
    /// Notifications sent to users (email, SMS, push).
    /// </summary>
    public DbSet<Notification> Notifications { get; set; }

    /// <summary>
    /// Platform audit logs for compliance and security.
    /// </summary>
    public DbSet<AuditLog> AuditLogs { get; set; }

    #endregion

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Configure default collation for all entities to support Arabic
        modelBuilder.UseCollation("Arabic_CI_AS");

        // Apply Identity configurations
        modelBuilder.ApplyConfiguration(new UserConfiguration());
        modelBuilder.ApplyConfiguration(new OtpCodeConfiguration());
        modelBuilder.ApplyConfiguration(new RefreshTokenConfiguration());
        modelBuilder.ApplyConfiguration(new PasswordResetConfiguration());
        modelBuilder.ApplyConfiguration(new EmailLogConfiguration());
        modelBuilder.ApplyConfiguration(new SmsLogConfiguration());
        modelBuilder.ApplyConfiguration(new PushTokenConfiguration());

        // Apply Config configurations
        modelBuilder.ApplyConfiguration(new LicenseCategoryConfiguration());
        modelBuilder.ApplyConfiguration(new FeeStructureConfiguration());
        modelBuilder.ApplyConfiguration(new SystemSettingConfiguration());

        // Apply Core configurations
        modelBuilder.ApplyConfiguration(new ApplicationConfiguration());
        modelBuilder.ApplyConfiguration(new LicenseConfiguration());
        modelBuilder.ApplyConfiguration(new AppointmentConfiguration());
        modelBuilder.ApplyConfiguration(new DocumentConfiguration());
        modelBuilder.ApplyConfiguration(new PaymentConfiguration());

        // Apply Tracking configurations
        modelBuilder.ApplyConfiguration(new ApplicationStatusHistoryConfiguration());
        modelBuilder.ApplyConfiguration(new MedicalExamConfiguration());
        modelBuilder.ApplyConfiguration(new TrainingRecordConfiguration());
        modelBuilder.ApplyConfiguration(new TheoryTestConfiguration());
        modelBuilder.ApplyConfiguration(new PracticalTestConfiguration());
        modelBuilder.ApplyConfiguration(new NotificationConfiguration());
        modelBuilder.ApplyConfiguration(new AuditLogConfiguration());
    }
}
