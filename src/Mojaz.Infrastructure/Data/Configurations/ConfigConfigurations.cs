namespace Mojaz.Infrastructure.Data.Configurations;

using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Mojaz.Domain.Entities.Config;
using Mojaz.Infrastructure.Data.Seeders;

/// <summary>
/// Entity Framework Core configuration for LicenseCategory entity.
/// </summary>
public class LicenseCategoryConfiguration : IEntityTypeConfiguration<LicenseCategory>
{
    public void Configure(EntityTypeBuilder<LicenseCategory> builder)
    {
        builder.HasKey(lc => lc.Id);

        builder.Property(lc => lc.Code)
            .IsRequired()
            .HasMaxLength(10);

        builder.Property(lc => lc.NameAr)
            .IsRequired()
            .HasMaxLength(200);

        builder.Property(lc => lc.NameEn)
            .IsRequired()
            .HasMaxLength(200);

        builder.Property(lc => lc.Description)
            .HasMaxLength(1000);

        builder.Property(lc => lc.RequiresX)
            .HasMaxLength(50);

        // Index for code uniqueness
        builder.HasIndex(lc => lc.Code)
            .IsUnique();

        // Seed license categories
        builder.HasData(LookupSeeder.SeedLicenseCategories());

        builder.ToTable("LicenseCategories");
    }
}

/// <summary>
/// Entity Framework Core configuration for FeeStructure entity.
/// </summary>
public class FeeStructureConfiguration : IEntityTypeConfiguration<FeeStructure>
{
    public void Configure(EntityTypeBuilder<FeeStructure> builder)
    {
        builder.HasKey(fs => fs.Id);

        builder.Property(fs => fs.Code)
            .IsRequired()
            .HasMaxLength(50);

        builder.Property(fs => fs.NameAr)
            .IsRequired()
            .HasMaxLength(200);

        builder.Property(fs => fs.NameEn)
            .IsRequired()
            .HasMaxLength(200);

        builder.Property(fs => fs.Category)
            .HasMaxLength(100);

        builder.Property(fs => fs.Amount)
            .HasPrecision(10, 2);

        builder.Property(fs => fs.Currency)
            .IsRequired()
            .HasMaxLength(3);

        builder.HasIndex(fs => fs.Code)
            .IsUnique();

        builder.HasIndex(fs => fs.LicenseCategoryId);

        // Seed fee structures
        builder.HasData(LookupSeeder.SeedFeeStructures());

        builder.ToTable("FeeStructures");
    }
}

/// <summary>
/// Entity Framework Core configuration for SystemSetting entity.
/// </summary>
public class SystemSettingConfiguration : IEntityTypeConfiguration<SystemSetting>
{
    public void Configure(EntityTypeBuilder<SystemSetting> builder)
    {
        builder.HasKey(ss => ss.Id);

        builder.Property(ss => ss.Key)
            .IsRequired()
            .HasMaxLength(200);

        builder.Property(ss => ss.Value)
            .IsRequired();

        builder.Property(ss => ss.Description)
            .HasMaxLength(500);

        builder.Property(ss => ss.DataType)
            .IsRequired()
            .HasMaxLength(50);

        // Index for key lookups
        builder.HasIndex(ss => ss.Key)
            .IsUnique();

        // Seed system settings
        builder.HasData(LookupSeeder.SeedSystemSettings());

        builder.ToTable("SystemSettings");
    }
}
