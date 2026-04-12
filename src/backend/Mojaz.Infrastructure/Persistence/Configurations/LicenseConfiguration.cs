using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Mojaz.Domain.Entities;
using Mojaz.Domain.Enums;

namespace Mojaz.Infrastructure.Persistence.Configurations
{
    public class LicenseConfiguration : IEntityTypeConfiguration<License>
    {
        public void Configure(EntityTypeBuilder<License> builder)
        {
            builder.ToTable("Licenses");
            builder.HasKey(x => x.Id);

            builder.Property(x => x.LicenseNumber).IsRequired().HasMaxLength(32);
             builder.Property(x => x.ApplicationId).IsRequired();
             builder.Property(x => x.HolderId).IsRequired();
             builder.Property(x => x.LicenseCategoryId).IsRequired();

             builder.HasOne<LicenseCategory>().WithMany().HasForeignKey(x => x.LicenseCategoryId).OnDelete(DeleteBehavior.Restrict);
             builder.HasOne<User>().WithMany().HasForeignKey(x => x.HolderId).OnDelete(DeleteBehavior.Restrict);
            builder.Property(x => x.BranchId).IsRequired(false);
            builder.Property(x => x.IssuedAt).IsRequired();
            builder.Property(x => x.ExpiresAt).IsRequired();
            builder.Property(x => x.IssuedBy).IsRequired(false);
            builder.Property(x => x.Status)
                .IsRequired()
                .HasConversion<string>()
                .HasMaxLength(32);
            builder.Property(x => x.QrCode).HasMaxLength(512);
            builder.Property(x => x.PrintedAt).IsRequired(false);
            builder.Property(x => x.DownloadedAt).IsRequired(false);

            builder.HasIndex(x => x.LicenseNumber).IsUnique().HasDatabaseName("IX_Licenses_LicenseNumber");
            builder.HasIndex(x => x.HolderId).HasDatabaseName("IX_Licenses_HolderId");
            builder.HasIndex(x => x.ApplicationId).HasDatabaseName("IX_Licenses_ApplicationId");
            builder.HasIndex(x => x.LicenseCategoryId).HasDatabaseName("IX_Licenses_LicenseCategoryId");
            builder.HasIndex(x => x.Status).HasDatabaseName("IX_Licenses_Status");
            builder.HasIndex(x => x.ExpiresAt).HasDatabaseName("IX_Licenses_ExpiresAt");
            builder.HasIndex(x => new { x.HolderId, x.Status }).HasFilter("[IsDeleted] = 0").HasDatabaseName("IX_Licenses_HolderId_Status");

            builder.HasQueryFilter(x => !x.IsDeleted);
        }
    }
}