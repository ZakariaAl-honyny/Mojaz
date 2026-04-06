namespace Mojaz.Infrastructure.Data.Configurations;

using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Mojaz.Domain.Entities.Identity;
using Mojaz.Infrastructure.Data.Seeders;

/// <summary>
/// Entity Framework Core configuration for User entity.
/// </summary>
public class UserConfiguration : IEntityTypeConfiguration<User>
{
    public void Configure(EntityTypeBuilder<User> builder)
    {
        builder.HasKey(u => u.Id);

        builder.Property(u => u.FirstName)
            .IsRequired()
            .HasMaxLength(100);

        builder.Property(u => u.LastName)
            .IsRequired()
            .HasMaxLength(100);

        builder.Property(u => u.Email)
            .IsRequired()
            .HasMaxLength(255);

        builder.Property(u => u.PasswordHash)
            .IsRequired()
            .HasMaxLength(512);

        builder.Property(u => u.PhoneNumber)
            .HasMaxLength(20);

        builder.Property(u => u.NationalId)
            .HasMaxLength(50);

        builder.Property(u => u.Gender)
            .HasMaxLength(20);

        builder.Property(u => u.RegistrationMethod)
            .HasMaxLength(50);

        // Index for email uniqueness
        builder.HasIndex(u => u.Email)
            .IsUnique()
            .HasFilter("[IsDeleted] = 0");

        // Index for soft delete queries
        builder.HasIndex(u => u.IsDeleted);

        builder.Property(u => u.CreatedAt)
            .HasDefaultValueSql("GETUTCDATE()");

        // Seed test users
        builder.HasData(UserSeeder.SeedUsers());

        builder.ToTable("Users");
    }
}

/// <summary>
/// Entity Framework Core configuration for OtpCode entity.
/// </summary>
public class OtpCodeConfiguration : IEntityTypeConfiguration<OtpCode>
{
    public void Configure(EntityTypeBuilder<OtpCode> builder)
    {
        builder.HasKey(o => o.Id);

        builder.Property(o => o.Code)
            .IsRequired()
            .HasMaxLength(10);

        builder.HasIndex(o => new { o.UserId, o.Code })
            .IsUnique();

        builder.ToTable("OtpCodes");
    }
}

/// <summary>
/// Entity Framework Core configuration for RefreshToken entity.
/// </summary>
public class RefreshTokenConfiguration : IEntityTypeConfiguration<RefreshToken>
{
    public void Configure(EntityTypeBuilder<RefreshToken> builder)
    {
        builder.HasKey(r => r.Id);

        builder.Property(r => r.Token)
            .IsRequired()
            .HasMaxLength(500);

        builder.Property(r => r.IpAddress)
            .HasMaxLength(45); // IPv6 max length

        builder.HasIndex(r => r.UserId);

        builder.ToTable("RefreshTokens");
    }
}

/// <summary>
/// Entity Framework Core configuration for PasswordReset entity.
/// </summary>
public class PasswordResetConfiguration : IEntityTypeConfiguration<PasswordReset>
{
    public void Configure(EntityTypeBuilder<PasswordReset> builder)
    {
        builder.HasKey(p => p.Id);

        builder.Property(p => p.Token)
            .IsRequired()
            .HasMaxLength(500);

        builder.HasIndex(p => p.UserId);

        builder.ToTable("PasswordResets");
    }
}

/// <summary>
/// Entity Framework Core configuration for EmailLog entity.
/// </summary>
public class EmailLogConfiguration : IEntityTypeConfiguration<EmailLog>
{
    public void Configure(EntityTypeBuilder<EmailLog> builder)
    {
        builder.HasKey(e => e.Id);

        builder.Property(e => e.Recipient)
            .IsRequired()
            .HasMaxLength(255);

        builder.Property(e => e.Subject)
            .IsRequired()
            .HasMaxLength(500);

        builder.Property(e => e.Body)
            .IsRequired();

        builder.Property(e => e.Status)
            .IsRequired()
            .HasMaxLength(50);

        builder.HasIndex(e => new { e.UserId, e.SentAt });

        builder.ToTable("EmailLogs");
    }
}

/// <summary>
/// Entity Framework Core configuration for SmsLog entity.
/// </summary>
public class SmsLogConfiguration : IEntityTypeConfiguration<SmsLog>
{
    public void Configure(EntityTypeBuilder<SmsLog> builder)
    {
        builder.HasKey(s => s.Id);

        builder.Property(s => s.PhoneNumber)
            .IsRequired()
            .HasMaxLength(20);

        builder.Property(s => s.Message)
            .IsRequired();

        builder.Property(s => s.Status)
            .IsRequired()
            .HasMaxLength(50);

        builder.HasIndex(s => new { s.UserId, s.SentAt });

        builder.ToTable("SmsLogs");
    }
}

/// <summary>
/// Entity Framework Core configuration for PushToken entity.
/// </summary>
public class PushTokenConfiguration : IEntityTypeConfiguration<PushToken>
{
    public void Configure(EntityTypeBuilder<PushToken> builder)
    {
        builder.HasKey(p => p.Id);

        builder.Property(p => p.Token)
            .IsRequired()
            .HasMaxLength(1000);

        builder.Property(p => p.DeviceType)
            .IsRequired()
            .HasMaxLength(50);

        builder.HasIndex(p => p.UserId);

        builder.ToTable("PushTokens");
    }
}

