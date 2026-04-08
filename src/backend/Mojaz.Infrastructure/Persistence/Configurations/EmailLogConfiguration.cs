using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Mojaz.Domain.Entities;

namespace Mojaz.Infrastructure.Persistence.Configurations
{
    public class EmailLogConfiguration : IEntityTypeConfiguration<EmailLog>
    {
        public void Configure(EntityTypeBuilder<EmailLog> builder)
        {
            builder.HasKey(e => e.Id);
            builder.Property(e => e.RecipientEmail).IsRequired().HasMaxLength(256);
            builder.Property(e => e.TemplateName).IsRequired().HasMaxLength(100);
            builder.Property(e => e.ReferenceId).HasMaxLength(100);
            builder.Property(e => e.Status).IsRequired();
            builder.Property(e => e.RetryCount).IsRequired();
            builder.Property(e => e.SentAt);
            builder.Property(e => e.ErrorMessage).HasMaxLength(1000);
            builder.HasIndex(e => new { e.RecipientEmail, e.TemplateName, e.ReferenceId }).HasDatabaseName("IX_EmailLogs_RecipientEmail_TemplateName_ReferenceId");
            builder.HasQueryFilter(e => !e.IsDeleted);
        }
    }
}
