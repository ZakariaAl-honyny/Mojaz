using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Mojaz.Domain.Entities;
using Mojaz.Domain.Enums;
using DomainApplication = Mojaz.Domain.Entities.Application;

namespace Mojaz.Infrastructure.Persistence.Configurations
{
    public class ApplicationConfiguration : IEntityTypeConfiguration<DomainApplication>
    {
        public void Configure(EntityTypeBuilder<DomainApplication> builder)
        {
            builder.ToTable("Applications");
            builder.HasKey(a => a.Id);
            
            // TPH is automatically configured when derived types exist
            // EF Core will use ServiceType enum as discriminator
            
            // Relationships with proper navigation
            builder.HasOne(a => a.Applicant)
                .WithMany()
                .HasForeignKey(a => a.ApplicantId)
                .OnDelete(DeleteBehavior.Restrict)
                .HasPrincipalKey(u => u.Id);
                
            builder.HasOne(a => a.LicenseCategory)
                .WithMany()
                .HasForeignKey(a => a.LicenseCategoryId)
                .OnDelete(DeleteBehavior.Restrict)
                .IsRequired(false);
            
            // Indexes
            builder.HasIndex(a => a.ApplicantId).HasDatabaseName("IX_Applications_ApplicantId");
            builder.HasIndex(a => a.ApplicationNumber).IsUnique().HasDatabaseName("IX_Applications_ApplicationNumber");
            
            // Properties
            builder.Property(a => a.ApplicationNumber).HasMaxLength(20);
            builder.Property(a => a.Notes).HasMaxLength(500);
            builder.Property(a => a.RejectionReason).HasMaxLength(200);
            builder.Property(a => a.CancellationReason).HasMaxLength(200);
            builder.Property(a => a.CurrentStage).HasMaxLength(50);
            builder.Property(a => a.PreferredLanguage).HasMaxLength(10);
            builder.Property(a => a.SpecialNeeds).HasMaxLength(200);
builder.Property(a => a.DataAccuracyConfirmed).IsRequired();
            builder.Property(a => a.TheoryAttemptCount).HasDefaultValue(0);
            
            // Enum properties with tinyint
            builder.Property(a => a.Status).HasColumnType("tinyint");
            builder.Property(a => a.ServiceType).HasColumnType("tinyint");
            
            // Final Approval fields
            builder.Property(a => a.FinalDecision).HasColumnType("tinyint");
            builder.Property(a => a.FinalDecisionReason).HasMaxLength(1000);
            builder.Property(a => a.ReturnToStage).HasMaxLength(50);
            builder.Property(a => a.ManagerNotes).HasMaxLength(1000);
            
            // Query filter for soft delete
            builder.HasQueryFilter(a => !a.IsDeleted);
            
            // Staff Assignment fields
            builder.Property(a => a.AssignmentNotes).HasMaxLength(500);
            builder.HasIndex(a => a.AssignedToId).HasDatabaseName("IX_Applications_AssignedToId");

            // TPH Discriminator column (added by migration)
            builder.Property(a => a.Discriminator).HasMaxLength(21);
        }
    }
}