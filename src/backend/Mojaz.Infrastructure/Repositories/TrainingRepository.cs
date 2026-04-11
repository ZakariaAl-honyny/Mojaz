using Microsoft.EntityFrameworkCore;
using Mojaz.Application.Interfaces;
using Mojaz.Domain.Entities;
using Mojaz.Infrastructure.Persistence;
using Mojaz.Infrastructure.Persistence.Repositories;
using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace Mojaz.Infrastructure.Repositories
{
    public class TrainingRepository : Repository<TrainingRecord>, ITrainingRepository
    {
        public TrainingRepository(MojazDbContext context) : base(context)
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