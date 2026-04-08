using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Diagnostics;
using Mojaz.Domain.Entities;
using Mojaz.Infrastructure.Persistence.Interceptors;
using System;
using System.Threading;
using System.Threading.Tasks;
using DomainApplication = Mojaz.Domain.Entities.Application;

namespace Mojaz.Infrastructure.Persistence
{
    public class MojazDbContext : DbContext
    {
        public MojazDbContext(DbContextOptions<MojazDbContext> options) : base(options) { }

        // DbSets for all 21 entities
        public DbSet<User> Users { get; set; }
        public DbSet<OtpCode> OtpCodes { get; set; }
        public DbSet<RefreshToken> RefreshTokens { get; set; }
        public DbSet<LicenseCategory> LicenseCategories { get; set; }
        public DbSet<DomainApplication> Applications { get; set; }
        public DbSet<ApplicationDocument> ApplicationDocuments { get; set; }
        public DbSet<ApplicationStatusHistory> ApplicationStatusHistories { get; set; }
        public DbSet<Appointment> Appointments { get; set; }
        public DbSet<MedicalExamination> MedicalExaminations { get; set; }
        public DbSet<TrainingRecord> TrainingRecords { get; set; }
        public DbSet<TheoryTest> TheoryTests { get; set; }
        public DbSet<PracticalTest> PracticalTests { get; set; }
        public DbSet<Payment> Payments { get; set; }
        public DbSet<License> Licenses { get; set; }
        public DbSet<LicenseRenewal> LicenseRenewals { get; set; }
        public DbSet<LicenseReplacement> LicenseReplacements { get; set; }
        public DbSet<CategoryUpgrade> CategoryUpgrades { get; set; }
        public DbSet<Notification> Notifications { get; set; }
        public DbSet<PushToken> PushTokens { get; set; }
        public DbSet<AuditLog> AuditLogs { get; set; }
        public DbSet<SystemSetting> SystemSettings { get; set; }
        public DbSet<FeeStructure> FeeStructures { get; set; }
        public DbSet<EmailLog> EmailLogs { get; set; }
        public DbSet<SmsLog> SmsLogs { get; set; }

        public override Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
        {
            foreach (var entry in ChangeTracker.Entries())
            {
                if (entry.Entity is Mojaz.Domain.Common.BaseEntity baseEntity)
                {
                    if (entry.State == EntityState.Added)
                    {
                        baseEntity.CreatedAt = DateTime.UtcNow;
                    }
                    baseEntity.UpdatedAt = DateTime.UtcNow;
                }
            }
            return base.SaveChangesAsync(cancellationToken);
        }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder.AddInterceptors(new AuditInterceptor());
            base.OnConfiguring(optionsBuilder);
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // Register all IEntityTypeConfiguration<T> from this assembly
            modelBuilder.ApplyConfigurationsFromAssembly(typeof(MojazDbContext).Assembly);

            base.OnModelCreating(modelBuilder);
        }
    }
}
