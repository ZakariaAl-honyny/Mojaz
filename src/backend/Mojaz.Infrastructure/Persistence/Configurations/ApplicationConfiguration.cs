using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Mojaz.Domain.Entities;
using DomainApplication = Mojaz.Domain.Entities.Application;

namespace Mojaz.Infrastructure.Persistence.Configurations
{
    public class ApplicationConfiguration : IEntityTypeConfiguration<DomainApplication>
    {
        public void Configure(EntityTypeBuilder<DomainApplication> builder)
        {
            builder.ToTable("Applications");
            builder.HasKey(a => a.Id);
            builder.HasIndex(a => a.ApplicantId).HasDatabaseName("IX_Applications_ApplicantId");
            builder.HasIndex(a => a.ApplicationNumber).IsUnique().HasDatabaseName("IX_Applications_ApplicationNumber");
            builder.Property(a => a.ApplicationNumber).HasMaxLength(20);
            builder.Property(a => a.Notes).HasMaxLength(500);
            builder.Property(a => a.RejectionReason).HasMaxLength(200);
            builder.Property(a => a.CancellationReason).HasMaxLength(200);
            builder.Property(a => a.CurrentStage).HasMaxLength(50);
            builder.Property(a => a.PreferredLanguage).HasMaxLength(10);
            builder.Property(a => a.SpecialNeeds).HasMaxLength(200);
            builder.Property(a => a.DataAccuracyConfirmed).IsRequired();
            builder.HasOne<User>().WithMany().HasForeignKey(a => a.ApplicantId).OnDelete(DeleteBehavior.Restrict);
            builder.HasOne<LicenseCategory>().WithMany().HasForeignKey(a => a.LicenseCategoryId).OnDelete(DeleteBehavior.Restrict);
            builder.HasQueryFilter(a => !a.IsDeleted);
        }
    }
}
