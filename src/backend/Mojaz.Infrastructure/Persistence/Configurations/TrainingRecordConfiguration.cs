using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Mojaz.Domain.Entities;

namespace Mojaz.Infrastructure.Persistence.Configurations
{
    public class TrainingRecordConfiguration : IEntityTypeConfiguration<TrainingRecord>
    {
        public void Configure(EntityTypeBuilder<TrainingRecord> builder)
        {
            builder.ToTable("TrainingRecords");
            builder.HasKey(x => x.Id);
            builder.Property(x => x.ApplicationId).IsRequired();
            builder.Property(x => x.SchoolName).IsRequired().HasMaxLength(128);
            builder.Property(x => x.CertificateNumber).HasMaxLength(64);
            builder.Property(x => x.CompletedHours).IsRequired();
            builder.Property(x => x.RequiredHours).IsRequired();
            builder.Property(x => x.IsExempt).IsRequired();
            builder.Property(x => x.ExemptionReason).HasMaxLength(256);
            builder.Property(x => x.ExemptionApprovedBy).IsRequired(false);
            builder.Property(x => x.Status).IsRequired().HasMaxLength(32);
            builder.Property(x => x.CompletedAt).IsRequired(false);
            builder.HasIndex(x => x.ApplicationId);
            builder.HasIndex(x => x.Status);
            builder.HasIndex(x => x.SchoolName);
        }
    }
}