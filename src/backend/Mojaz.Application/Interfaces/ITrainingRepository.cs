using DrivingLicenseIssuanceSystem.Domain.Entities;
using DrivingLicenseIssuanceSystem.Domain.Interfaces;
using System;
using System.Threading.Tasks;

namespace DrivingLicenseIssuanceSystem.Application.Interfaces
{
    public interface ITrainingRepository : IRepository<TrainingRecord>
    {
        Task<TrainingRecord?> GetByApplicationIdAsync(Guid applicationId);
    }
}