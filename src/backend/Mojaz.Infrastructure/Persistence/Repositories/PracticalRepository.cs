using Microsoft.EntityFrameworkCore;
using Mojaz.Application.Interfaces;
using Mojaz.Domain.Entities;
using Mojaz.Infrastructure.Persistence;
using Mojaz.Infrastructure.Persistence.Repositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Mojaz.Infrastructure.Persistence.Repositories
{
    public class PracticalRepository : Repository<PracticalTest>, IPracticalRepository
    {
        public PracticalRepository(MojazDbContext context) : base(context)
        {
        }

        public async Task<PracticalTest?> GetLatestByApplicationIdAsync(Guid applicationId)
        {
            return await _context.PracticalTests
                .Include(t => t.Examiner)
                .Include(t => t.Application)
                .Where(t => t.ApplicationId == applicationId)
                .OrderByDescending(t => t.ConductedAt)
                .FirstOrDefaultAsync();
        }

        public async Task<IReadOnlyList<PracticalTest>> GetAllByApplicationIdAsync(Guid applicationId)
        {
            return await _context.PracticalTests
                .Include(t => t.Examiner)
                .Include(t => t.Application)
                .Where(t => t.ApplicationId == applicationId)
                .OrderBy(t => t.AttemptNumber)
                .ToListAsync();
        }

        public async Task<int> GetAttemptCountAsync(Guid applicationId)
        {
            return await _context.PracticalTests
                .Where(t => t.ApplicationId == applicationId)
                .CountAsync();
        }
    }
}
