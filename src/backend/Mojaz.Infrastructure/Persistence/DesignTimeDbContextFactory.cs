using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using Microsoft.Extensions.Configuration;
using System;
using System.IO;

namespace Mojaz.Infrastructure.Persistence
{
    /// <summary>
    /// Design-time factory for EF Core migrations.
    /// Allows `dotnet ef` commands to create DbContext without running the full application.
    /// </summary>
    public class DesignTimeDbContextFactory : IDesignTimeDbContextFactory<MojazDbContext>
    {
        public MojazDbContext CreateDbContext(string[] args)
        {
            var configuration = new ConfigurationBuilder()
                .SetBasePath(Path.Combine(Directory.GetCurrentDirectory(), "..", "Mojaz.API"))
                .AddJsonFile("appsettings.json", optional: false, reloadOnChange: true)
                .Build();

            var connectionString = configuration.GetConnectionString("DefaultConnection")
                ?? "Server=localhost;Database=MojazDB;User Id=sa;Password=sa123456;TrustServerCertificate=true;MultipleActiveResultSets=true";

            var optionsBuilder = new DbContextOptionsBuilder<MojazDbContext>();
            optionsBuilder.UseSqlServer(connectionString);

            return new MojazDbContext(optionsBuilder.Options);
        }
    }
}