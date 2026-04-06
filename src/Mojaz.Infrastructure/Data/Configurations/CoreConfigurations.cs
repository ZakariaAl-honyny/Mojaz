namespace Mojaz.Infrastructure.Data.Configurations;

using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Mojaz.Domain.Entities.Core;

/// <summary>
/// Entity Framework Core configuration for Application entity.
/// </summary>
public class ApplicationConfiguration : IEntityTypeConfiguration<Application>
{
    public void Configure(EntityTypeBuilder<Application> builder)
    {
        builder.HasKey(a => a.Id);

        builder.Property(a => a.ApplicationNumber)
            .IsRequired()
            .HasMaxLength(50);

        builder.Property(a => a.Status)
            .IsRequired()
            .HasMaxLength(50);

        builder.Property(a => a.CreatedAt)
            .HasDefaultValueSql("GETUTCDATE()");

        // Unique index for application number
        builder.HasIndex(a => a.ApplicationNumber)
            .IsUnique()
            .HasFilter("[IsDeleted] = 0");

        // Index for applicant lookups
        builder.HasIndex(a => a.ApplicantId);

        // Index for license category lookups
        builder.HasIndex(a => a.LicenseCategoryId);

        // Index for soft delete queries
        builder.HasIndex(a => a.IsDeleted);

        builder.ToTable("Applications");
    }
}

/// <summary>
/// Entity Framework Core configuration for License entity.
/// </summary>
public class LicenseConfiguration : IEntityTypeConfiguration<License>
{
    public void Configure(EntityTypeBuilder<License> builder)
    {
        builder.HasKey(l => l.Id);

        builder.Property(l => l.LicenseNumber)
            .IsRequired()
            .HasMaxLength(50);

        builder.Property(l => l.Status)
            .IsRequired()
            .HasMaxLength(50);

        // Unique index for license number
        builder.HasIndex(l => l.LicenseNumber)
            .IsUnique();

        // Index for license holder
        builder.HasIndex(l => l.HolderId);

        // Index for license category
        builder.HasIndex(l => l.LicenseCategoryId);

        // Index for status queries
        builder.HasIndex(l => l.Status);

        builder.ToTable("Licenses");
    }
}

/// <summary>
/// Entity Framework Core configuration for Appointment entity.
/// </summary>
public class AppointmentConfiguration : IEntityTypeConfiguration<Appointment>
{
    public void Configure(EntityTypeBuilder<Appointment> builder)
    {
        builder.HasKey(a => a.Id);

        builder.Property(a => a.AppointmentType)
            .IsRequired()
            .HasMaxLength(100);

        builder.Property(a => a.Status)
            .IsRequired()
            .HasMaxLength(50);

        // Index for application lookups
        builder.HasIndex(a => a.ApplicationId);

        // Index for applicant lookups
        builder.HasIndex(a => a.ApplicantId);

        // Index for assigned employee
        builder.HasIndex(a => a.AssignedEmployeeId);

        // Index for scheduled date range queries
        builder.HasIndex(a => a.ScheduledAt);

        builder.ToTable("Appointments");
    }
}

/// <summary>
/// Entity Framework Core configuration for Document entity.
/// </summary>
public class DocumentConfiguration : IEntityTypeConfiguration<Document>
{
    public void Configure(EntityTypeBuilder<Document> builder)
    {
        builder.HasKey(d => d.Id);

        builder.Property(d => d.DocumentType)
            .IsRequired()
            .HasMaxLength(100);

        builder.Property(d => d.FilePath)
            .IsRequired()
            .HasMaxLength(500);

        // Index for application lookups
        builder.HasIndex(d => d.ApplicationId);

        // Index for uploader lookups
        builder.HasIndex(d => d.UploadedById);

        // Index for document type queries
        builder.HasIndex(d => new { d.ApplicationId, d.DocumentType });

        builder.ToTable("Documents");
    }
}

/// <summary>
/// Entity Framework Core configuration for Payment entity.
/// </summary>
public class PaymentConfiguration : IEntityTypeConfiguration<Payment>
{
    public void Configure(EntityTypeBuilder<Payment> builder)
    {
        builder.HasKey(p => p.Id);

        builder.Property(p => p.PaymentReference)
            .IsRequired()
            .HasMaxLength(50);

        builder.Property(p => p.Status)
            .IsRequired()
            .HasMaxLength(50);

        builder.Property(p => p.Amount)
            .HasPrecision(12, 2);

        builder.Property(p => p.TransactionId)
            .HasMaxLength(200);

        // Unique index for payment reference
        builder.HasIndex(p => p.PaymentReference)
            .IsUnique();

        // Index for application lookups
        builder.HasIndex(p => p.ApplicationId);

        // Index for payer lookups
        builder.HasIndex(p => p.PaidById);

        // Index for status queries
        builder.HasIndex(p => p.Status);

        builder.ToTable("Payments");
    }
}
