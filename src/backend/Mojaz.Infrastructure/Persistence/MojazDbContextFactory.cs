using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using Mojaz.Infrastructure.Persistence;

namespace Mojaz.Infrastructure.Persistence
{
    public class MojazDbContextFactory : IDesignTimeDbContextFactory<MojazDbContext>
    {
        public MojazDbContext CreateDbContext(string[] args)
        {
            var optionsBuilder = new DbContextOptionsBuilder<MojazDbContext>();
            optionsBuilder.UseSqlServer("Server=localhost;Database=Mojaz;TrustServerCertificate=true;MultipleActiveResultSets=true");
            return new MojazDbContext(optionsBuilder.Options);
        }
    }
}