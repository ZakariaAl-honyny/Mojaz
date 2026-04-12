using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Mojaz.Domain.Entities;

namespace Mojaz.Infrastructure.Persistence.Configurations
{
    public class AuditLogConfiguration : IEntityTypeConfiguration<AuditLog>
    {
        public void Configure(EntityTypeBuilder<AuditLog> builder)
        {
            builder.ToTable("AuditLogs");
            builder.HasKey(x => x.Id);
            builder.Property(x => x.ActionType).IsRequired().HasMaxLength(64);
            builder.Property(x => x.ActionCategory).IsRequired().HasMaxLength(64);
            builder.Property(x => x.EntityName).IsRequired().HasMaxLength(64);
            builder.Property(x => x.EntityId).IsRequired().HasMaxLength(64);
            builder.Property(x => x.Payload).HasColumnType("nvarchar(max)");
            builder.Property(x => x.IpAddress).HasMaxLength(64);
            builder.Property(x => x.UserAgent).HasMaxLength(256);
            builder.Property(x => x.IsSuccess).IsRequired();
            builder.Property(x => x.Timestamp).IsRequired();
            builder.HasIndex(x => x.UserId);
            builder.HasIndex(x => x.ActionCategory);
            builder.HasIndex(x => x.EntityName);
            builder.HasIndex(x => x.EntityId);
            builder.HasIndex(x => x.Timestamp);
        }
    }
}