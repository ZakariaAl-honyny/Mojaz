using DrivingLicenseIssuanceSystem.Domain.Entities;

namespace DrivingLicenseIssuanceSystem.Application.Interfaces.Repositories;

public interface ILicenseRepository
{
    Task<License?> GetByIdAsync(Guid id);
    Task UpdateAsync(License license);
    Task SaveChangesAsync();
}
