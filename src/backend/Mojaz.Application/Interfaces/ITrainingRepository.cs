using Mojaz.Domain.Entities;
using Mojaz.Domain.Interfaces;
using System;
using System.Threading.Tasks;

namespace Mojaz.Application.Interfaces
{
    public interface ITrainingRepository : IRepository<TrainingRecord>
    {
        Task<TrainingRecord?> GetByApplicationIdAsync(Guid applicationId);
    }
}