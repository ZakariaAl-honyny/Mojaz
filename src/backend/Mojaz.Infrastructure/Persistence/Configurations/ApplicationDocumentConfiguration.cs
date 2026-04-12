using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Mojaz.Domain.Entities;
using Mojaz.Domain.Enums;
using DomainApplication = Mojaz.Domain.Entities.Application;

namespace Mojaz.Infrastructure.Persistence.Configurations
{
    public class ApplicationDocumentConfiguration : IEntityTypeConfiguration<ApplicationDocument>
    {
        public void Configure(EntityTypeBuilder<ApplicationDocument> builder)
        {
            builder.ToTable("ApplicationDocuments");
            builder.HasKey(x => x.Id);
            builder.Property(x => x.DocumentType)
                .IsRequired()
                .HasConversion<string>()
                .HasMaxLength(32);
            builder.Property(x => x.FileName).IsRequired().HasMaxLength(128);
            builder.Property(x => x.FilePath).IsRequired().HasMaxLength(256);
            builder.Property(x => x.FileSize).IsRequired();
            builder.Property(x => x.ContentType).IsRequired().HasMaxLength(64);
            builder.Property(x => x.IsRequired).IsRequired();
            builder.Property(x => x.Status)
                .IsRequired()
                .HasConversion<string>()
                .HasMaxLength(32);
            builder.Property(x => x.RejectionReason).HasMaxLength(256);
            builder.Property(x => x.ReviewedBy).IsRequired(false);
            builder.Property(x => x.ReviewedAt).IsRequired(false);
             builder.Property(x => x.UploadedAt).IsRequired();
             builder.HasOne<DomainApplication>().WithMany().HasForeignKey(x => x.ApplicationId).OnDelete(DeleteBehavior.Restrict);
             builder.HasIndex(x => x.ApplicationId);
            builder.HasIndex(x => x.DocumentType);
            builder.HasIndex(x => x.Status);
        }
    }
}