using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using Microsoft.Extensions.Configuration;
using System;
using System.IO;

namespace DrivingLicenseIssuanceSystem.Infrastructure.Persistence
{
    /// <summary>
    /// Design-time factory for EF Core migrations.
    /// Allows `dotnet ef` commands to create DbContext without running the full application.
    /// </summary>
    public class DesignTimeDbContextFactory : IDesignTimeDbContextFactory<DrivingLicenseIssuanceSystemDbContext>
    {
        public DrivingLicenseIssuanceSystemDbContext CreateDbContext(string[] args)
        {
            var configuration = new ConfigurationBuilder()
                .SetBasePath(Path.Combine(Directory.GetCurrentDirectory(), "..", "DrivingLicenseIssuanceSystem.API"))
                .AddJsonFile("appsettings.json", optional: false, reloadOnChange: true)
                .Build();

            var connectionString = configuration.GetConnectionString("DefaultConnection")
                ?? "Server=localhost;Database=DrivingLicenseIssuanceSystemDB;User Id=sa;Password=sa123456;TrustServerCertificate=true;MultipleActiveResultSets=true";

            var optionsBuilder = new DbContextOptionsBuilder<DrivingLicenseIssuanceSystemDbContext>();
            optionsBuilder.UseSqlServer(connectionString);

            return new DrivingLicenseIssuanceSystemDbContext(optionsBuilder.Options);
        }
    }
}