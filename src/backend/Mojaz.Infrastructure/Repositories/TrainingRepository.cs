using Microsoft.EntityFrameworkCore;
using DrivingLicenseIssuanceSystem.Application.Interfaces;
using DrivingLicenseIssuanceSystem.Domain.Entities;
using DrivingLicenseIssuanceSystem.Infrastructure.Persistence;
using DrivingLicenseIssuanceSystem.Infrastructure.Persistence.Repositories;
using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace DrivingLicenseIssuanceSystem.Infrastructure.Repositories
{
    public class TrainingRepository : Repository<TrainingRecord>, ITrainingRepository
    {
        public TrainingRepository(DrivingLicenseIssuanceSystemDbContext context) : base(context)
        {
        }

        public async Task<TrainingRecord?> GetByApplicationIdAsync(Guid applicationId)
        {
            return await _context.TrainingRecords
                .Include(t => t.Application)
                .Include(t => t.ExemptionApprover)
                .Include(t => t.Creator)
                .FirstOrDefaultAsync(t => t.ApplicationId == applicationId);
        }
    }
}