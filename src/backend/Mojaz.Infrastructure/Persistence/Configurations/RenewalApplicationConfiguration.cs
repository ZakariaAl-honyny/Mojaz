using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Mojaz.Domain.Entities;
using Mojaz.Domain.Enums;

namespace Mojaz.Infrastructure.Persistence.Configurations
{
    /// <summary>
    /// Configuration for RenewalApplication entity (Table Per Hierarchy with Application)
    /// Note: Properties like OldLicenseId, NewLicenseId, MedicalExaminationId, TrainingExempt, 
    ///       TheoryExempt, PracticalExempt, RenewalFeePaid are inherited from Application base class
    ///       The FK relationships are also inherited - we just define additional indexes here
    /// </summary>
    public class RenewalApplicationConfiguration : IEntityTypeConfiguration<RenewalApplication>
    {
        public void Configure(EntityTypeBuilder<RenewalApplication> builder)
        {
            // Navigation properties (OldLicense, NewLicense, MedicalExamination) are defined in RenewalApplication
            // FK relationships inherit from Application - no need to redefine HasForeignKey
            // EF Core will use the inherited FK properties automatically

            // Index for faster queries on inherited properties
            builder.HasIndex(x => x.OldLicenseId).HasDatabaseName("IX_RenewalApplications_OldLicenseId");
            builder.HasIndex(x => x.NewLicenseId).HasDatabaseName("IX_RenewalApplications_NewLicenseId");
        }
    }
}