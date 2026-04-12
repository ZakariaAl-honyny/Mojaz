using Microsoft.EntityFrameworkCore;
using Mojaz.Application.Interfaces.Repositories;
using Mojaz.Domain.Entities;
using Mojaz.Infrastructure.Persistence;

namespace Mojaz.Infrastructure.Persistence.Repositories;

public class LicenseRepository : ILicenseRepository
{
    private readonly MojazDbContext _context;

    public LicenseRepository(MojazDbContext context)
    {
        _context = context;
    }

    public async Task<License?> GetByIdAsync(Guid id)
    {
        return await _context.Licenses
            .Include(l => l.LicenseCategory)
            .FirstOrDefaultAsync(l => l.Id == id);
    }

    public async Task UpdateAsync(License license)
    {
        _context.Licenses.Update(license);
        await Task.CompletedTask;
    }

    public async Task SaveChangesAsync()
    {
        await _context.SaveChangesAsync();
    }
}
