using Microsoft.EntityFrameworkCore;
using DrivingLicenseIssuanceSystem.Application.Interfaces.Repositories;
using DrivingLicenseIssuanceSystem.Domain.Entities;
using DrivingLicenseIssuanceSystem.Infrastructure.Persistence;

namespace DrivingLicenseIssuanceSystem.Infrastructure.Persistence.Repositories;

public class LicenseRepository : ILicenseRepository
{
    private readonly DrivingLicenseIssuanceSystemDbContext _context;

    public LicenseRepository(DrivingLicenseIssuanceSystemDbContext context)
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
