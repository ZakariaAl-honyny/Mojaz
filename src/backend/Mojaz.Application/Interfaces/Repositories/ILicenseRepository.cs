using Mojaz.Domain.Entities;

namespace Mojaz.Application.Interfaces.Repositories;

public interface ILicenseRepository
{
    Task<License?> GetByIdAsync(Guid id);
    Task UpdateAsync(License license);
    Task SaveChangesAsync();
}
