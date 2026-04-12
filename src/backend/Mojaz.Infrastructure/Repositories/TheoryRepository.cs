using Microsoft.EntityFrameworkCore;
using Mojaz.Application.Interfaces;
using Mojaz.Domain.Entities;
using Mojaz.Infrastructure.Persistence;
using Mojaz.Infrastructure.Persistence.Repositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace Mojaz.Infrastructure.Repositories
{
    public class TheoryRepository : Repository<TheoryTest>, ITheoryRepository
    {
        public TheoryRepository(MojazDbContext context) : base(context)
        {
        }

        public async Task<TheoryTest?> GetLatestByApplicationIdAsync(Guid applicationId)
        {
            return await _context.TheoryTests
                .Include(t => t.Examiner)
                .Include(t => t.Application)
                .Where(t => t.ApplicationId == applicationId)
                .OrderByDescending(t => t.ConductedAt)
                .FirstOrDefaultAsync();
        }

        public async Task<IEnumerable<TheoryTest>> GetAllByApplicationIdAsync(Guid applicationId)
        {
            return await _context.TheoryTests
                .Include(t => t.Examiner)
                .Include(t => t.Application)
                .Where(t => t.ApplicationId == applicationId)
                .OrderBy(t => t.AttemptNumber)
                .ToListAsync();
        }

        public async Task<int> GetAttemptCountAsync(Guid applicationId)
        {
            return await _context.TheoryTests
                .Where(t => t.ApplicationId == applicationId)
                .CountAsync();
        }

        // AddAsync is inherited from Repository<T> which already implements IRepository<T>.AddAsync
    }
}