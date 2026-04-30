using Mojaz.Domain.Entities;

namespace Mojaz.Application.Interfaces.Repositories;

public interface ILicenseRepository
{
    Task<License?> GetByIdAsync(int id);
    Task UpdateAsync(License license);
    Task SaveChangesAsync();
}