namespace Mojaz.Infrastructure.Data.Configurations;

using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Mojaz.Domain.Entities.Tracking;

/// <summary>
/// Entity Framework Core configuration for ApplicationStatusHistory entity.
/// </summary>
public class ApplicationStatusHistoryConfiguration : IEntityTypeConfiguration<ApplicationStatusHistory>
{
    public void Configure(EntityTypeBuilder<ApplicationStatusHistory> builder)
    {
        builder.HasKey(ash => ash.Id);

        builder.Property(ash => ash.FromStatus)
            .IsRequired()
            .HasMaxLength(50);

        builder.Property(ash => ash.ToStatus)
            .IsRequired()
            .HasMaxLength(50);

        builder.Property(ash => ash.Reason)
            .HasMaxLength(500);

        // Index for application history lookups
        builder.HasIndex(ash => ash.ApplicationId);

        // Index for timeline queries
        builder.HasIndex(ash => ash.ChangedAt);

        builder.ToTable("ApplicationStatusHistories");
    }
}

/// <summary>
/// Entity Framework Core configuration for MedicalExam entity.
/// </summary>
public class MedicalExamConfiguration : IEntityTypeConfiguration<MedicalExam>
{
    public void Configure(EntityTypeBuilder<MedicalExam> builder)
    {
        builder.HasKey(me => me.Id);

        builder.Property(me => me.Result)
            .IsRequired()
            .HasMaxLength(50);

        builder.Property(me => me.VisionTest)
            .HasMaxLength(200);

        builder.Property(me => me.DoctorName)
            .HasMaxLength(200);

        // Index for application lookups
        builder.HasIndex(me => me.ApplicationId);

        // Index for appointment lookups
        builder.HasIndex(me => me.AppointmentId);

        builder.ToTable("MedicalExams");
    }
}

/// <summary>
/// Entity Framework Core configuration for TrainingRecord entity.
/// </summary>
public class TrainingRecordConfiguration : IEntityTypeConfiguration<TrainingRecord>
{
    public void Configure(EntityTypeBuilder<TrainingRecord> builder)
    {
        builder.HasKey(tr => tr.Id);

        builder.Property(tr => tr.TrainingType)
            .IsRequired()
            .HasMaxLength(100);

        builder.Property(tr => tr.ProviderName)
            .HasMaxLength(200);

        builder.Property(tr => tr.Status)
            .IsRequired()
            .HasMaxLength(50);

        // Index for application lookups
        builder.HasIndex(tr => tr.ApplicationId);

        // Index for status queries
        builder.HasIndex(tr => tr.Status);

        builder.ToTable("TrainingRecords");
    }
}

/// <summary>
/// Entity Framework Core configuration for TheoryTest entity.
/// </summary>
public class TheoryTestConfiguration : IEntityTypeConfiguration<TheoryTest>
{
    public void Configure(EntityTypeBuilder<TheoryTest> builder)
    {
        builder.HasKey(tt => tt.Id);

        builder.Property(tt => tt.Result)
            .IsRequired()
            .HasMaxLength(50);

        builder.Property(tt => tt.Score)
            .HasPrecision(5, 2);

        builder.Property(tt => tt.TotalScore)
            .HasPrecision(5, 2);

        // Index for application lookups
        builder.HasIndex(tt => tt.ApplicationId);

        // Index for appointment lookups
        builder.HasIndex(tt => tt.AppointmentId);

        builder.ToTable("TheoryTests");
    }
}

/// <summary>
/// Entity Framework Core configuration for PracticalTest entity.
/// </summary>
public class PracticalTestConfiguration : IEntityTypeConfiguration<PracticalTest>
{
    public void Configure(EntityTypeBuilder<PracticalTest> builder)
    {
        builder.HasKey(pt => pt.Id);

        builder.Property(pt => pt.Result)
            .IsRequired()
            .HasMaxLength(50);

        builder.Property(pt => pt.Score)
            .HasPrecision(5, 2);

        builder.Property(pt => pt.TotalScore)
            .HasPrecision(5, 2);

        builder.Property(pt => pt.ExaminerNotes)
            .HasMaxLength(1000);

        // Index for application lookups
        builder.HasIndex(pt => pt.ApplicationId);

        // Index for appointment lookups
        builder.HasIndex(pt => pt.AppointmentId);

        builder.ToTable("PracticalTests");
    }
}

/// <summary>
/// Entity Framework Core configuration for Notification entity.
/// </summary>
public class NotificationConfiguration : IEntityTypeConfiguration<Notification>
{
    public void Configure(EntityTypeBuilder<Notification> builder)
    {
        builder.HasKey(n => n.Id);

        builder.Property(n => n.EventType)
            .IsRequired()
            .HasMaxLength(100);

        builder.Property(n => n.Title)
            .IsRequired()
            .HasMaxLength(300);

        builder.Property(n => n.Message)
            .IsRequired();

        // Index for user notifications
        builder.HasIndex(n => n.UserId);

        // Index for unread notifications
        builder.HasIndex(n => new { n.UserId, n.IsRead });

        // Index for creation time queries
        builder.HasIndex(n => n.CreatedAt);

        builder.ToTable("Notifications");
    }
}

/// <summary>
/// Entity Framework Core configuration for AuditLog entity.
/// </summary>
public class AuditLogConfiguration : IEntityTypeConfiguration<AuditLog>
{
    public void Configure(EntityTypeBuilder<AuditLog> builder)
    {
        builder.HasKey(al => al.Id);

        builder.Property(al => al.Action)
            .IsRequired()
            .HasMaxLength(50);

        builder.Property(al => al.EntityType)
            .IsRequired()
            .HasMaxLength(200);

        builder.Property(al => al.OldValues)
            .HasMaxLength(4000);

        builder.Property(al => al.NewValues)
            .HasMaxLength(4000);

        // Index for user action tracking
        builder.HasIndex(al => al.UserId);

        // Index for entity type audits
        builder.HasIndex(al => al.EntityType);

        // Index for audit log timeline
        builder.HasIndex(al => al.LoggedAt);

        builder.ToTable("AuditLogs");
    }
}
