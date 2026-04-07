using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Mojaz.Domain.Entities;
using Mojaz.Domain.Enums;

namespace Mojaz.Infrastructure.Persistence.Configurations
{
    public class SmsLogConfiguration : IEntityTypeConfiguration<SmsLog>
    {
        public void Configure(EntityTypeBuilder<SmsLog> builder)
        {
            builder.HasKey(e => e.Id);
            
            builder.Property(e => e.ApplicationId).IsRequired(false);
            builder.Property(e => e.UserId).IsRequired();
            builder.Property(e => e.RecipientNumber).IsRequired().HasMaxLength(20);
            builder.Property(e => e.TemplateType).IsRequired().HasMaxLength(50);
            builder.Property(e => e.Status).IsRequired();
            builder.Property(e => e.TwilioMessageId).HasMaxLength(100);
            builder.Property(e => e.Cost).HasColumnType("decimal(18,2)");
            builder.Property(e => e.ErrorMessage).HasMaxLength(1000);

            builder.HasIndex(e => new { e.UserId, e.TemplateType }).HasDatabaseName("IX_SmsLogs_UserId_TemplateType");
            builder.HasIndex(e => e.Status).HasDatabaseName("IX_SmsLogs_Status");
            builder.HasIndex(e => e.CreatedAt).HasDatabaseName("IX_SmsLogs_CreatedAt");

            builder.HasOne(e => e.User)
                .WithMany()
                .HasForeignKey(e => e.UserId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.HasOne(e => e.Application)
                .WithMany()
                .HasForeignKey(e => e.ApplicationId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.HasQueryFilter(e => !e.IsDeleted);
        }
    }
}