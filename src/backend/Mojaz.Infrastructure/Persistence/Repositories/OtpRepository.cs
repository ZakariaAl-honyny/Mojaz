using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Mojaz.Domain.Entities;
using Mojaz.Domain.Interfaces;
using Mojaz.Infrastructure.Persistence;
using Mojaz.Domain.Enums;

namespace Mojaz.Infrastructure.Persistence.Repositories;

public class OtpRepository : IOtpRepository
{
    private readonly MojazDbContext _db;
    public OtpRepository(MojazDbContext db)
    {
        _db = db;
    }

    public async Task<OtpCode?> GetLatestByDestinationAndPurposeAsync(string destination, OtpPurpose purpose)
    {
        return await _db.OtpCodes
            .Where(x => x.Destination == destination && x.Purpose == purpose)
            .OrderByDescending(x => x.CreatedAt)
            .FirstOrDefaultAsync();
    }

    public async Task<List<OtpCode>> GetRecentByDestinationAndPurposeAsync(string destination, OtpPurpose purpose, int withinMinutes)
    {
        var since = DateTime.UtcNow.AddMinutes(-withinMinutes);
        return await _db.OtpCodes
            .Where(x => x.Destination == destination && x.Purpose == purpose && x.CreatedAt >= since)
            .ToListAsync();
    }

    public async Task<int> CountResendsLastHourAsync(string destination, OtpPurpose purpose)
    {
        var since = DateTime.UtcNow.AddHours(-1);
        return await _db.OtpCodes
            .CountAsync(x => x.Destination == destination && x.Purpose == purpose && x.CreatedAt >= since);
    }

    public async Task AddAsync(OtpCode otpCode)
    {
        await _db.OtpCodes.AddAsync(otpCode);
        await _db.SaveChangesAsync();
    }

    public async Task UpdateAsync(OtpCode otpCode)
    {
        _db.OtpCodes.Update(otpCode);
        await _db.SaveChangesAsync();
    }

    public async Task InvalidateUnusedAsync(string destination, OtpPurpose purpose)
    {
        var codes = await _db.OtpCodes
            .Where(x => x.Destination == destination && x.Purpose == purpose && !x.IsUsed && !x.IsInvalidated)
            .ToListAsync();
        foreach (var code in codes)
        {
            code.IsInvalidated = true;
        }
        await _db.SaveChangesAsync();
    }
}
