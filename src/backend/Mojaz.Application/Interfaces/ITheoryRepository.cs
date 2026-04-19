using DrivingLicenseIssuanceSystem.Domain.Entities;
using DrivingLicenseIssuanceSystem.Domain.Interfaces;
using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

namespace DrivingLicenseIssuanceSystem.Application.Interfaces
{
    public interface ITheoryRepository : IRepository<TheoryTest>
    {
        Task<TheoryTest?> GetLatestByApplicationIdAsync(Guid applicationId);
        Task<IEnumerable<TheoryTest>> GetAllByApplicationIdAsync(Guid applicationId);
        Task<int> GetAttemptCountAsync(Guid applicationId);
    }
}
