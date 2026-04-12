using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Mojaz.Domain.Entities;
using Mojaz.Domain.Enums;
using DomainApplication = Mojaz.Domain.Entities.Application;

namespace Mojaz.Infrastructure.Persistence.Configurations
{
    public class CategoryUpgradeConfiguration : IEntityTypeConfiguration<CategoryUpgrade>
    {
        public void Configure(EntityTypeBuilder<CategoryUpgrade> builder)
        {
            builder.ToTable("CategoryUpgrades");
            builder.HasKey(x => x.Id);

             builder.Property(x => x.LicenseId).IsRequired();
             builder.Property(x => x.ApplicationId).IsRequired();

             builder.HasOne<License>().WithMany().HasForeignKey(x => x.LicenseId).OnDelete(DeleteBehavior.Restrict);
             builder.HasOne<DomainApplication>().WithMany().HasForeignKey(x => x.ApplicationId).OnDelete(DeleteBehavior.Restrict);

             builder.Property(x => x.FromCategory)
                .IsRequired()
                .HasConversion<string>()
                .HasMaxLength(8);
            builder.Property(x => x.ToCategory)
                .IsRequired()
                .HasConversion<string>()
                .HasMaxLength(8);
            builder.Property(x => x.UpgradedAt).IsRequired();
            builder.Property(x => x.ProcessedBy).IsRequired(false);

            builder.HasIndex(x => x.LicenseId);
            builder.HasIndex(x => x.ApplicationId);
            builder.HasIndex(x => x.UpgradedAt);

            // Disable cascade delete to prevent cycle/multiple cascade path errors
            builder.HasOne(x => x.License)
                .WithMany()
                .HasForeignKey(x => x.LicenseId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.HasOne(x => x.Application)
                .WithMany()
                .HasForeignKey(x => x.ApplicationId)
                .OnDelete(DeleteBehavior.Restrict);
        }
    }
}