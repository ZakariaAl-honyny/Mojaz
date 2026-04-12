using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Mojaz.Domain.Entities;
using Mojaz.Domain.Enums;

namespace Mojaz.Infrastructure.Persistence.Configurations
{
    public class ApplicationDocumentConfiguration : IEntityTypeConfiguration<ApplicationDocument>
    {
        public void Configure(EntityTypeBuilder<ApplicationDocument> builder)
        {
            builder.ToTable("ApplicationDocuments");
            
            // Base entity configuration
            builder.HasKey(x => x.Id);
            
            // Soft delete global filter
            builder.HasQueryFilter(x => !x.IsDeleted);
            
            // Document type
            builder.Property(x => x.DocumentType)
                .IsRequired()
                .HasConversion<string>()
                .HasMaxLength(32);
            
            // File properties
            builder.Property(x => x.OriginalFileName).IsRequired().HasMaxLength(260);
            builder.Property(x => x.StoredFileName).IsRequired().HasMaxLength(260);
            builder.Property(x => x.FilePath).IsRequired().HasMaxLength(500);
            builder.Property(x => x.FileSizeBytes).IsRequired();
            builder.Property(x => x.ContentType).IsRequired().HasMaxLength(100);
            builder.Property(x => x.IsRequired).IsRequired();
            
            // Status
            builder.Property(x => x.Status)
                .IsRequired()
                .HasDefaultValue(DocumentStatus.Pending)
                .HasConversion<string>()
                .HasMaxLength(32);
            
            // Review info
            builder.Property(x => x.RejectionReason).HasMaxLength(1000);
            builder.Property(x => x.ReviewedBy).IsRequired(false);
            builder.Property(x => x.ReviewedAt).IsRequired(false);
            
            // Timestamps
            builder.Property(x => x.CreatedAt).IsRequired();
            builder.Property(x => x.UpdatedAt).IsRequired();
            
            // Indexes
            builder.HasIndex(x => x.ApplicationId);
            builder.HasIndex(x => x.DocumentType);
            builder.HasIndex(x => x.Status);
            
            // Unique filtered index on ApplicationId + DocumentType
            builder.HasIndex(x => new { x.ApplicationId, x.DocumentType })
                .HasFilter("[IsDeleted] = 0")
                .IsUnique();
        }
    }
}