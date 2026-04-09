using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Mojaz.Domain.Entities;
using Mojaz.Domain.Enums;

namespace Mojaz.Infrastructure.Persistence.Configurations
{
    public class TrainingRecordConfiguration : IEntityTypeConfiguration<TrainingRecord>
    {
        public void Configure(EntityTypeBuilder<TrainingRecord> builder)
        {
            builder.ToTable("TrainingRecords");
            
            // Global query filter for soft delete
            builder.HasQueryFilter(x => !x.IsDeleted);

            builder.HasKey(x => x.Id);

            // Core fields
            builder.Property(x => x.ApplicationId).IsRequired();
            builder.Property(x => x.SchoolName).IsRequired().HasMaxLength(200);
            builder.Property(x => x.CertificateNumber).HasMaxLength(64);
            builder.Property(x => x.CompletedHours).IsRequired();
            builder.Property(x => x.TotalHoursRequired).IsRequired();
            
            // TrainingStatus enum
            builder.Property(x => x.TrainingStatus)
                .IsRequired()
                .HasConversion<int>()
                .HasDefaultValue(TrainingStatus.Required);
            
            // Exemption fields
            builder.Property(x => x.IsExempted).IsRequired().HasDefaultValue(false);
            builder.Property(x => x.ExemptionReason).HasMaxLength(1000);
            builder.Property(x => x.ExemptionRejectionReason).HasMaxLength(1000);
            builder.Property(x => x.ExemptionApprovedAt).IsRequired(false);
            
            // Additional fields
            builder.Property(x => x.TrainerName).HasMaxLength(200);
            builder.Property(x => x.CenterName).HasMaxLength(200);
            builder.Property(x => x.CompletedAt).IsRequired(false);

            // Indexes
            builder.HasIndex(x => x.ApplicationId);
            builder.HasIndex(x => x.TrainingStatus);
            builder.HasIndex(x => x.SchoolName);
            builder.HasIndex(x => x.ExemptionApprovedBy);
            builder.HasIndex(x => x.ExemptionDocumentId);

            // Relationships
            builder.HasOne(x => x.Application)
                .WithMany()
                .HasForeignKey(x => x.ApplicationId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.HasOne(x => x.ExemptionApprover)
                .WithMany()
                .HasForeignKey(x => x.ExemptionApprovedBy)
                .OnDelete(DeleteBehavior.Restrict);

            builder.HasOne(x => x.Creator)
                .WithMany()
                .HasForeignKey(x => x.CreatedBy)
                .OnDelete(DeleteBehavior.Restrict);

            builder.HasOne(x => x.ExemptionDocument)
                .WithMany()
                .HasForeignKey(x => x.ExemptionDocumentId)
                .OnDelete(DeleteBehavior.Restrict);
        }
    }
}
