using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using DrivingLicenseIssuanceSystem.Infrastructure.Persistence;

namespace DrivingLicenseIssuanceSystem.Infrastructure.Persistence
{
    public class DrivingLicenseIssuanceSystemDbContextFactory : IDesignTimeDbContextFactory<DrivingLicenseIssuanceSystemDbContext>
    {
        public DrivingLicenseIssuanceSystemDbContext CreateDbContext(string[] args)
        {
            var optionsBuilder = new DbContextOptionsBuilder<DrivingLicenseIssuanceSystemDbContext>();
            optionsBuilder.UseSqlServer("Server=localhost;Database=DrivingLicenseIssuanceSystem;TrustServerCertificate=true;MultipleActiveResultSets=true");
            return new DrivingLicenseIssuanceSystemDbContext(optionsBuilder.Options);
        }
    }
}